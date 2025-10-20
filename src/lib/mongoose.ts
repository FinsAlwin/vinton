import mongoose from "mongoose";

// Ensure a single mongoose instance across the app/bundles
declare global {
  var __mongoose_instance__: typeof mongoose | undefined;
}

const mongooseInstance = global.__mongoose_instance__ || mongoose;
if (!global.__mongoose_instance__) {
  global.__mongoose_instance__ = mongooseInstance;
}

export default mongooseInstance;
