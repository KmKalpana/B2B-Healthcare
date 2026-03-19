export const PATIENT_STATUS = {
  ACTIVE: "active",
  DISCHARGED: "discharged",
};

export const QUICK_ACTIONS = [
  {
    label: "View Patients",
    icon: "👤",
    route: "/patients",
    description: "Manage all patients",
  },
  {
    label: "View Analytics",
    icon: "📊",
    route: "/analytics",
    description: "Detailed charts & insights",
  },
];

export const ACTIVITY = {
  DEFAULT_ICON: "➕",
  MAX_ITEMS: 5,
};

export const TIME_LABELS = {
  JUST_NOW: "Just now",
  MINUTES: "m ago",
  HOURS: "h ago",
  DAYS: "d ago",
};