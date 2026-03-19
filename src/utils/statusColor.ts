export const statusColor = (type: string): string => {
  const colors: Record<string, string> = {
    total: "#4f46e5",
    active: "#10b981",
    discharged: "#f97316", 
    archived: "#6b7280",
    critical: "#ef4444",
    recovered: "#059669",
    admitted: "#8b5cf6",
    emergency: "#dc2626"
  };
  return colors[type] || "#64748b";
};
