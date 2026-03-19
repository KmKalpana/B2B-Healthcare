import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchAnalytics } from "../features/analytics/analyticsSlice";
import { fetchPatients } from "../features/patients/patientSlice";
import { logoutUser } from "../features/auth/authSlice";
import "../styles/dashboard.css";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/StatsCard";
import StatsCardSkeleton from "../components/skeleton/StatsCardSkeleton";
import SkeletonLine from "../components/skeleton/SkeletonLine";
import {
  PATIENT_STATUS,
  QUICK_ACTIONS,
  ACTIVITY,
} from "../utils/constants/dashboard";
import { formatTimeAgo } from "../utils/formatters";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { data: analyticsData, loading: analyticsLoading } = useAppSelector(
    (s) => s.analytics
  );

  const {
    list: patients,
    loading: patientsLoading,
    isFetched,
  } = useAppSelector((s) => s.patients);

  useEffect(() => {
    if (!analyticsData && !analyticsLoading) {
      dispatch(fetchAnalytics());
    }

    if (!isFetched && !patientsLoading) {
      dispatch(fetchPatients());
    }
  }, [dispatch, analyticsData, analyticsLoading, isFetched, patientsLoading]);

  const stats = useMemo(() => {
    return {
      totalPatients: patients.length,
      activePatients: patients.filter(
        (p) => p.status === PATIENT_STATUS.ACTIVE
      ).length,
      dischargedPatients: patients.filter(
        (p) => p.status === PATIENT_STATUS.DISCHARGED
      ).length,
    };
  }, [patients]);

  const recentActivity = useMemo(() => {
    return patients.slice(0, ACTIVITY.MAX_ITEMS).map((patient) => ({
      id: patient.id,
      icon: ACTIVITY.DEFAULT_ICON,
      message: `New patient ${patient.name} added`,
      timeAgo: formatTimeAgo(
        new Date().getTime() -
          new Date(patient.createdAt).getTime()
      ),
    }));
  }, [patients]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome, ${user?.email || "User"} 👋`}
        buttons={[
          {
            label: "Logout",
            variant: "danger",
            size: "md",
            onClick: handleLogout,
          },
        ]}
      />
      {/* Quick Actions */}
      <div className="actions-section">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              className="action-card"
              onClick={() => navigate(action.route)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-text">
                <h4>{action.label}</h4>
                <p>{action.description}</p>
              </div>

            </button>
          ))}
        </div>
      </div>
      <div className="dashboard-main-content">
        {/* Stats */}
        <div className="stats-section">
          {patientsLoading ? (
            <div className="stats-row">
              <StatsCardSkeleton count={3} size="lg" />
            </div>
          ) : (
            <div className="stats-row">
              <StatCard
                type="total"
                title="Total Patients"
                value={stats.totalPatients}
                size="lg"
              />
              <StatCard
                type="active"
                title="Active Patients"
                value={stats.activePatients}
                size="lg"
              />
              <StatCard
                type="discharged"
                title="Discharged"
                value={stats.dischargedPatients}
                size="lg"
              />
            </div>
          )}
        </div>
        {/* Activity */}
        <div className="recent-section">
          <h3>Recent Activity</h3>

          {patientsLoading ? (
            <>
              <SkeletonLine variant="title" />
              <SkeletonLine variant="line" count={5} />
            </>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-icon">
                    {activity.icon}
                  </span>
                  <div>
                    <p>{activity.message}</p>
                    <span className="activity-time">
                      {activity.timeAgo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}