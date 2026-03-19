// UI Text
export const PATIENT_DETAIL_TEXT = {
  TITLE: "Patient Details",
  LOADING_SUBTITLE: "Loading patient...",
  NOT_FOUND_TITLE: "Patient Not Found",
  NOT_FOUND_DESC: (id?: string) => `Patient with ID "${id}" does not exist.`,
  VIEW_ALL: "View All Patients",
};

export const PATIENT_DETAIL_BUTTONS = [
  {
    label: "Dashboard",
    variant: "success",
    size: "md" as const,
    route: "/dashboard",
  },
  {
    label: "View Patients",
    variant: "primary",
    size: "md" as const,
    route: "/patients",
  },
];
// Labels (for patient info)
export const PATIENT_FIELDS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "gender", label: "Gender" },
  { key: "city", label: "City" },
];

// Special Fields
export const EXTRA_FIELDS = {
  STATUS: "Status",
  CREATED: "Created",
  NOTES: "Notes",
};

// Helpers
export const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString();