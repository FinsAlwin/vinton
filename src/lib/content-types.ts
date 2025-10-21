// Content Type Registry with Field Definitions

export interface FieldDefinition {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "richtext"
    | "email"
    | "url"
    | "number"
    | "date"
    | "boolean"
    | "image"
    | "gallery"
    | "select"
    | "array"
    | "object"
    | "reference";
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  options?: string[]; // For select fields
  itemFields?: FieldDefinition[]; // For array/object fields
  referenceType?: string; // For reference fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ContentTypeDefinition {
  name: string;
  label: string;
  singular: string;
  plural: string;
  icon: string;
  description: string;
  fields: FieldDefinition[];
  showInNav?: boolean;
}

export const contentTypes: Record<string, ContentTypeDefinition> = {
  homepage: {
    name: "homepage",
    label: "Homepage",
    singular: "Homepage",
    plural: "Homepage",
    icon: "Home",
    description: "Manage homepage content and sections",
    showInNav: true,
    fields: [
      // Hero Section
      {
        name: "hero_title",
        label: "Hero Title",
        type: "text",
        required: true,
        placeholder: "Main headline",
      },
      {
        name: "hero_subtitle",
        label: "Hero Subtitle",
        type: "textarea",
        placeholder: "Supporting text",
      },
      {
        name: "hero_cta_text",
        label: "Hero CTA Button Text",
        type: "text",
        placeholder: "e.g., Get Started",
      },
      {
        name: "hero_cta_link",
        label: "Hero CTA Link",
        type: "url",
        placeholder: "Button destination URL",
      },
      {
        name: "hero_background",
        label: "Hero Background Image",
        type: "image",
      },

      // About Section
      {
        name: "about_heading",
        label: "About Section Heading",
        type: "text",
      },
      {
        name: "about_description",
        label: "About Description",
        type: "richtext",
      },
      {
        name: "about_images",
        label: "About Images",
        type: "gallery",
      },

      // Services Section
      {
        name: "services_heading",
        label: "Services Heading",
        type: "text",
      },
      {
        name: "services_description",
        label: "Services Description",
        type: "textarea",
      },

      // Stats Section
      {
        name: "stats_auto_calculate",
        label: "Auto-calculate Statistics",
        type: "boolean",
        defaultValue: true,
        helpText: "Automatically calculate from team, clients, projects data",
      },

      // Testimonials Section
      {
        name: "testimonials",
        label: "Testimonials",
        type: "array",
        itemFields: [
          { name: "name", label: "Client Name", type: "text", required: true },
          { name: "company", label: "Company", type: "text" },
          { name: "quote", label: "Quote", type: "textarea", required: true },
          { name: "avatar", label: "Avatar Image", type: "image" },
        ],
      },

      // CTA Section
      {
        name: "cta_heading",
        label: "CTA Section Heading",
        type: "text",
      },
      {
        name: "cta_description",
        label: "CTA Description",
        type: "textarea",
      },
      {
        name: "cta_button_text",
        label: "CTA Button Text",
        type: "text",
      },
      {
        name: "cta_button_link",
        label: "CTA Button Link",
        type: "url",
      },

      // Partners Section
      {
        name: "partners_logos",
        label: "Partner/Client Logos",
        type: "gallery",
      },
    ],
  },

  portfolio: {
    name: "portfolio",
    label: "Portfolio",
    singular: "Portfolio Item",
    plural: "Portfolio Items",
    icon: "Briefcase",
    description: "Showcase your work and projects",
    showInNav: true,
    fields: [
      {
        name: "title",
        label: "Project Title",
        type: "text",
        required: true,
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          "Facade & Cladding",
          "Structural Elements",
          "Art Installation & Sculpture",
          "Partition & Screen",
          "Stairway & Railing",
          "Light Fixture & Signage",
          "Furniture & Accessories",
          "Doors & Windows",
        ],
      },
      {
        name: "description",
        label: "Description",
        type: "richtext",
        required: true,
      },
      {
        name: "location",
        label: "Project Location",
        type: "text",
        placeholder: "City, Country",
      },
      {
        name: "year",
        label: "Project Year",
        type: "number",
        validation: { min: 1900, max: 2100 },
      },
      {
        name: "client_name",
        label: "Client Name",
        type: "text",
      },
      {
        name: "tags",
        label: "Tags",
        type: "array",
        itemFields: [{ name: "tag", label: "Tag", type: "text" }],
      },
    ],
  },

  services: {
    name: "services",
    label: "Services",
    singular: "Service",
    plural: "Services",
    icon: "Wrench",
    description: "Manage your service offerings",
    showInNav: true,
    fields: [
      {
        name: "service_name",
        label: "Service Name",
        type: "text",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "richtext",
        required: true,
      },
      {
        name: "icon_image",
        label: "Icon/Image",
        type: "image",
      },
      {
        name: "order",
        label: "Display Order",
        type: "number",
        defaultValue: 0,
        helpText: "Lower numbers appear first",
      },
      {
        name: "featured_homepage",
        label: "Featured on Homepage",
        type: "boolean",
        defaultValue: false,
      },
    ],
  },

  team: {
    name: "team",
    label: "Team",
    singular: "Team Member",
    plural: "Team Members",
    icon: "Users",
    description: "Manage team members",
    showInNav: true,
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "position",
        label: "Position/Role",
        type: "text",
        required: true,
      },
      {
        name: "bio",
        label: "Biography",
        type: "richtext",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
      },
      {
        name: "linkedin",
        label: "LinkedIn Profile URL",
        type: "url",
      },
      {
        name: "join_date",
        label: "Join Date",
        type: "date",
      },
      {
        name: "location",
        label: "Location/Office",
        type: "text",
        placeholder: "e.g., Kochi, Kerala",
      },
    ],
  },

  projects: {
    name: "projects",
    label: "Projects",
    singular: "Project",
    plural: "Projects",
    icon: "FolderOpen",
    description: "Track all projects",
    showInNav: true,
    fields: [
      {
        name: "project_name",
        label: "Project Name",
        type: "text",
        required: true,
      },
      {
        name: "client",
        label: "Client",
        type: "reference",
        referenceType: "clients",
      },
      {
        name: "location",
        label: "Location (City)",
        type: "text",
        required: true,
        placeholder: "City name for statistics",
      },
      {
        name: "start_date",
        label: "Start Date",
        type: "date",
      },
      {
        name: "end_date",
        label: "End Date",
        type: "date",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["completed", "ongoing", "upcoming"],
        defaultValue: "ongoing",
      },
      {
        name: "portfolio_items",
        label: "Portfolio Items",
        type: "reference",
        referenceType: "portfolio",
        helpText: "Link portfolio items to this project",
      },
      {
        name: "value",
        label: "Project Value/Budget",
        type: "text",
        placeholder: "Optional",
      },
    ],
  },

  clients: {
    name: "clients",
    label: "Clients",
    singular: "Client",
    plural: "Clients",
    icon: "Building",
    description: "Manage client companies",
    showInNav: true,
    fields: [
      {
        name: "company_name",
        label: "Company Name",
        type: "text",
        required: true,
      },
      {
        name: "website",
        label: "Website",
        type: "url",
      },
      {
        name: "first_project_date",
        label: "First Project Date",
        type: "date",
      },
    ],
  },

  testimonials: {
    name: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    plural: "Testimonials",
    icon: "MessageSquare",
    description: "Client testimonials and reviews",
    showInNav: true,
    fields: [
      {
        name: "client_name",
        label: "Client Name",
        type: "text",
        required: true,
      },
      {
        name: "company",
        label: "Company",
        type: "text",
      },
      {
        name: "position",
        label: "Position/Title",
        type: "text",
      },
      {
        name: "quote",
        label: "Testimonial Quote",
        type: "textarea",
        required: true,
      },
      {
        name: "rating",
        label: "Rating",
        type: "number",
        validation: { min: 1, max: 5 },
        defaultValue: 5,
      },
      {
        name: "featured_homepage",
        label: "Featured on Homepage",
        type: "boolean",
        defaultValue: false,
      },
      {
        name: "project_reference",
        label: "Related Project",
        type: "reference",
        referenceType: "projects",
      },
    ],
  },

  blogs: {
    name: "blogs",
    label: "Blogs",
    singular: "Blog Post",
    plural: "Blog Posts",
    icon: "FileText",
    description: "Blog posts and articles",
    showInNav: true,
    fields: [
      {
        name: "title",
        label: "Post Title",
        type: "text",
        required: true,
      },
      {
        name: "content",
        label: "Content",
        type: "richtext",
        required: true,
      },
      {
        name: "excerpt",
        label: "Excerpt",
        type: "textarea",
        placeholder: "Short description for listings",
      },
      {
        name: "author",
        label: "Author",
        type: "text",
      },
      {
        name: "publish_date",
        label: "Publish Date",
        type: "date",
      },
      {
        name: "tags",
        label: "Tags",
        type: "array",
        itemFields: [{ name: "tag", label: "Tag", type: "text" }],
      },
    ],
  },
};

// Helper function to get content type definition
export function getContentType(type: string): ContentTypeDefinition | null {
  return contentTypes[type] || null;
}

// Get all content types that should show in navigation
export function getNavContentTypes(): ContentTypeDefinition[] {
  return Object.values(contentTypes).filter((ct) => ct.showInNav);
}

// Validate field value based on field definition
export function validateField(
  value: unknown,
  field: FieldDefinition
): string | null {
  if (field.required && !value) {
    return `${field.label} is required`;
  }

  if (field.type === "number" && typeof value === "number") {
    if (field.validation?.min && value < field.validation.min) {
      return `${field.label} must be at least ${field.validation.min}`;
    }
    if (field.validation?.max && value > field.validation.max) {
      return `${field.label} must be at most ${field.validation.max}`;
    }
  }

  return null;
}
