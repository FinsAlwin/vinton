import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import { logAuthEvent } from "@/lib/logger";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      // Log failed login attempt
      await logAuthEvent(request, "LOGIN_FAILED", email, {
        reason: "User not found",
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt
      await logAuthEvent(request, "LOGIN_FAILED", email, {
        reason: "Invalid password",
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    // Store refresh token in database
    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    // Set cookies
    await setAuthCookies(accessToken, refreshToken);

    // Log successful login
    await logAuthEvent(request, "LOGIN_SUCCESS", user.email, {
      role: user.role,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
