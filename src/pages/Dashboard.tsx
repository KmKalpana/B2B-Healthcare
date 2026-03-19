import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchAnalytics } from "../features/analytics/analyticsSlice";
import { logoutUser } from "../features/auth/authSlice";
import { patientService } from "../features/patients/patientService";
import type { Patient } from "../features/patients/patientTypes";
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

  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  const dataInitializedRef = useRef(false);

  //Load Patients
  const loadPatientsData = useCallback(async () => {
    if (dataInitializedRef.current) {
      setStatsLoading(false);
      setActivityLoading(false);
      return;
    }

    try {
      setStatsLoading(true);
      const allPatients = await patientService.getPatients();
      setPatients(allPatients);

      dataInitializedRef.current = true;
      setStatsLoading(false);

      return allPatients;
    } catch (error) {
      console.error("Error loading patients:", error);
      setStatsLoading(false);
    }
  }, []);

  // Load Activity
  const loadRecentActivity = useCallback((patientsData: Patient[]) => {
    if (dataInitializedRef.current && recentActivity.length > 0) {
      setActivityLoading(false);
      return;
    }

    try {
      setActivityLoading(true);

      const recent = patientsData
        .slice(0, ACTIVITY.MAX_ITEMS)
        .map((patient) => ({
          id: patient.id,
          icon: ACTIVITY.DEFAULT_ICON,
          message: `New patient ${patient.name} added`,
          timeAgo: formatTimeAgo(
            new Date().getTime() -
            new Date(patient.createdAt).getTime()
          ),
        }));

      setRecentActivity(recent);
    } catch (error) {
      console.error("Error loading activity:", error);
    } finally {
      setActivityLoading(false);
    }
  }, [recentActivity.length]);

  // Main Effect
  useEffect(() => {
    if (!analyticsData && !analyticsLoading) {
      dispatch(fetchAnalytics());
    }

    loadPatientsData().then((patientsData) => {
      if (patientsData) {
        loadRecentActivity(patientsData);
      }
    });
  }, []);


  // Logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  // Stats
  const stats = {
    totalPatients: patients.length,
    activePatients: patients.filter(
      (p) => p.status === PATIENT_STATUS.ACTIVE
    ).length,
    dischargedPatients: patients.filter(
      (p) => p.status === PATIENT_STATUS.DISCHARGED
    ).length,
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
          {statsLoading ? (
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
          {activityLoading ? (
            <>
              <SkeletonLine variant="title" />
              <SkeletonLine variant="line" count={5} />
            </>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
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