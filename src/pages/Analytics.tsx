import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchAnalytics } from "../features/analytics/analyticsSlice";
import { patientService } from "../features/patients/patientService";
import Charts from "../components/Charts";
import "../styles/analytics.css";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/StatsCard";
import StatsCardSkeleton from "../components/skeleton/StatsCardSkeleton";
import {statusColor} from "../utils/statusColor.ts";
import ChartSkeleton from "../components/skeleton/ChartSkeleton.tsx";

type PatientStatus = 'active' | 'discharged' | 'archived' | 'critical' | 'recover' | 'emergency' | 'admitted';

interface Stats {
  totalPatients: number;
  activePatients: number;
  dischargedPatients: number;
  archivedPatients: number;    
  criticalPatients: number;
  recoveredPatients: number;
  admittedPatients: number;
  emergencyPatients: number;
}

export default function Analytics() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: analyticsData, loading: analyticsLoading } = useAppSelector((s) => s.analytics);
  
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    activePatients: 0,
    dischargedPatients: 0,
    archivedPatients: 0,     
    criticalPatients: 0,
    recoveredPatients: 0,
    admittedPatients: 0,
    emergencyPatients: 0
  });

  const countPatientsByStatus = useCallback((patients: any[], status: PatientStatus): number => {
    return patients.filter((p: any) => p.status === status).length;
  }, []);

  const loadPatientStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const allPatients = await patientService.getPatients();
      
      setStats({
        totalPatients: allPatients.length,
        activePatients: countPatientsByStatus(allPatients, 'active'),
        dischargedPatients: countPatientsByStatus(allPatients, 'discharged'),
        archivedPatients: countPatientsByStatus(allPatients, 'archived'),   
        criticalPatients: countPatientsByStatus(allPatients, 'critical'),
        recoveredPatients: countPatientsByStatus(allPatients, 'recover'),
        admittedPatients: countPatientsByStatus(allPatients, 'admitted'),
        emergencyPatients: countPatientsByStatus(allPatients, 'emergency'),
      });
    } catch (error) {
      console.error("Error loading patient stats:", error);
      setStats({
        totalPatients: 0, activePatients: 0, dischargedPatients: 0, archivedPatients: 0,
        criticalPatients: 0, recoveredPatients: 0, admittedPatients: 0, emergencyPatients: 0
      });
    } finally {
      setStatsLoading(false);
    }
  }, [countPatientsByStatus]);

  useEffect(() => {
    dispatch(fetchAnalytics());
    loadPatientStats();
  }, [dispatch, loadPatientStats]);

  // DYNAMIC STAT CARDS
  const statCards = useMemo(() => [
    { type: 'total' as const, title: 'Total Patients', value: stats.totalPatients },
    { type: 'active' as const, title: 'Active', value: stats.activePatients },
    { type: 'discharged' as const, title: 'Discharged', value: stats.dischargedPatients },
    { type: 'archived' as const, title: 'Archived', value: stats.archivedPatients },   
    { type: 'critical' as const, title: 'Critical', value: stats.criticalPatients },
    { type: 'recovered' as const, title: 'Recovered', value: stats.recoveredPatients },
    { type: 'admitted' as const, title: 'Admitted', value: stats.admittedPatients },
    { type: 'emergency' as const, title: 'Emergency', value: stats.emergencyPatients }
  ], [stats]);

  const isLoading = statsLoading || analyticsLoading;

  return (
    <div className="analytics-container">
      <PageHeader
        title="Analytics"
        buttons={[
          {
            label: "Dashboard",
            variant: "success",
            size: "md",
            leftIcon: "📊",
            onClick: () => navigate("/dashboard")
          },
          {
            label: "Patients",
            variant: "primary",
            size: "md",
            leftIcon: "👥",
            onClick: () => navigate("/patients")
          }
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
          <div className="chart-section">
  <Charts 
    data={statCards.map(card => ({
      name: card.title,
      value: card.value,
      color: statusColor(card.type) 
    }))} 
  />
</div>
        </>
      )}
    </div>
  );
}
