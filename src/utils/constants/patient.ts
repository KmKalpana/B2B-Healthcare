export const DEFAULT_FILTERS = {
  city: "",
  gender: "",
  status: "",
};

export const VIEW_TYPES = {
  GRID: "grid",
  LIST: "list",
} as const;

export const UI_TEXT = {
  SEARCH_PLACEHOLDER: "🔍 Search name...",
  LOADING: "Loading patients...",
  EMPTY_TITLE: "No patients found",
  EMPTY_DESC: "No patients match your current search or filter criteria.",
  CLEAR: "Clear",
};

export const TABLE_HEADERS = [
  "Patient",
  "Age",
  "Email",
  "Phone",
  "Status",
  "City",
  "Created",
  "Actions",
];

export const FILTER_KEYS = {
  CITY: "city",
  GENDER: "gender",
  STATUS: "status",
} as const;