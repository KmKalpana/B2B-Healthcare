import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchAnalytics } from "../features/analytics/analyticsSlice";
import { fetchPatients } from "../features/patients/patientSlice";

import Charts from "../components/Charts";
import "../styles/analytics.css";

import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/StatsCard";
import StatsCardSkeleton from "../components/skeleton/StatsCardSkeleton";
import ChartSkeleton from "../components/skeleton/ChartSkeleton";

import { statusColor } from "../utils/statusColor";

type PatientStatus = "active" | "discharged" | "archived" | "critical" | "recover" | "emergency" | "admitted";

export default function Analytics() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: analyticsData, loading: analyticsLoading } = useAppSelector(
    (s) => s.analytics
  );

  const {
    list: patients,
    loading: patientsLoading,
    isFetched,
  } = useAppSelector((s) => s.patients);

  // Fetch only once (NO REFETCH)
  useEffect(() => {
    if (!analyticsData && !analyticsLoading) {
      dispatch(fetchAnalytics());
    }

    if (!isFetched && !patientsLoading) {
      dispatch(fetchPatients());
    }
  }, [dispatch, analyticsData, analyticsLoading, isFetched, patientsLoading]);

  // Derived stats (NO API CALL)
  const stats = useMemo(() => {
    const count = (status: PatientStatus) =>
      patients.filter((p) => p.status === status).length;

    return {
      totalPatients: patients.length,
      activePatients: count("active"),
      dischargedPatients: count("discharged"),
      archivedPatients: count("archived"),
      criticalPatients: count("critical"),
      recoveredPatients: count("recover"),
      admittedPatients: count("admitted"),
      emergencyPatients: count("emergency"),
    };
  }, [patients]);

  const statCards = useMemo(
    () => [
      { type: "total" as const, title: "Total Patients", value: stats.totalPatients },
      { type: "active" as const, title: "Active", value: stats.activePatients },
      { type: "discharged" as const, title: "Discharged", value: stats.dischargedPatients },
      { type: "archived" as const, title: "Archived", value: stats.archivedPatients },
      { type: "critical" as const, title: "Critical", value: stats.criticalPatients },
      { type: "recovered" as const, title: "Recovered", value: stats.recoveredPatients },
      { type: "admitted" as const, title: "Admitted", value: stats.admittedPatients },
      { type: "emergency" as const, title: "Emergency", value: stats.emergencyPatients },
    ],
    [stats]
  );

  const isLoading = patientsLoading || analyticsLoading;

  return (
    <div className="analytics-container">
      <PageHeader
        title="Analytics"
        buttons={[
          {
            label: "Dashboard",
            variant: "success",
            size: "md",
            onClick: () => navigate("/dashboard"),
          },
          {
            label: "Patients",
            variant: "primary",
            size: "md",
            onClick: () => navigate("/patients"),
          },
        ]}
      />

      {isLoading ? (
        <>
          <div className="analytics-cards">
            <StatsCardSkeleton count={8} size="lg" />
          </div>
          <ChartSkeleton />
        </>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="analytics-cards">
            {statCards.map((card) => (
              <StatsCard
                key={card.type}
                type={card.type}
                title={card.title}
                value={card.value}
                size="md"
              />
            ))}
          </div>
          {/* Charts */}
          <div className="chart-section">
            <Charts
              data={statCards.map((card) => ({
                name: card.title,
                value: card.value,
                color: statusColor(card.type),
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
