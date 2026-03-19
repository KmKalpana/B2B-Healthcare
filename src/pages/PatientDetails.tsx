import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { patientService } from "../features/patients/patientService";
import type { Patient } from "../features/patients/patientTypes";
import { ReactNode } from "react";
import PageHeader from "../components/ui/PageHeader";
import SkeletonLine from "../components/skeleton/SkeletonLine";
import {
  PATIENT_DETAIL_TEXT,
  PATIENT_DETAIL_BUTTONS,
  PATIENT_FIELDS,
  EXTRA_FIELDS,
  formatStatus,
} from "../utils/constants/patientDetails";
import "../styles/patientDetails.css";

interface PatientField {
  key: keyof Patient;
  label: string;
}

interface PatientRow {
  label: string;
  value: ReactNode;
}

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const patientFields = useMemo(() => 
    PATIENT_FIELDS.map((field): PatientField => ({
      key: field.key as keyof Patient,
      label: field.label
    })), 
  []);
  const patientRows = useMemo((): PatientRow[] => {
    if (!patient) return [];
    
    return [
      ...patientFields.map((field) => ({
        label: field.label,
        value: String(patient[field.key]),
      })),
      {
        label: EXTRA_FIELDS.STATUS,
        value: <span className={`status-badge status-${patient.status}`}>
          {formatStatus(patient.status)}
        </span>,
      },
      ...(patient.notes ? [{
        label: EXTRA_FIELDS.NOTES,
        value: patient.notes,
      }] : []),
    ];
  }, [patient, patientFields]);

  const loadPatient = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const patients = await patientService.getPatients();
      const found = patients.find((p) => p.id === id);
      setPatient(found ?? null);
      
      if (!found) {
        setError(PATIENT_DETAIL_TEXT.NOT_FOUND_DESC(id));
      }
    } catch (error) {
      console.error("Error loading patient:", error);
      setError("Failed to load patient data");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  return (
    <div className="patient-detail-container">
      <PageHeader
        title={PATIENT_DETAIL_TEXT.TITLE}
        subtitle={patient?.name || PATIENT_DETAIL_TEXT.LOADING_SUBTITLE}
        buttons={PATIENT_DETAIL_BUTTONS.map((btn) => ({
          label: btn.label,
          variant: btn.variant as "success" | "primary",
          size: btn.size,
          onClick: () => navigate(btn.route),
        }))}
      />
      <div className="patient-info-section">
        {loading ? (
          <SkeletonLine variant="line" count={9} />
        ) : error ? (
          <div className="empty-state">
            <h3>{PATIENT_DETAIL_TEXT.NOT_FOUND_TITLE}</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => navigate("/patients")}>
              {PATIENT_DETAIL_TEXT.VIEW_ALL}
            </button>
          </div>
        ) : patient ? (
          patientRows.map((row, index) => (
            <div key={`${row.label}-${index}`} className="info-row">
              <strong>{row.label}:</strong> 
              <span>{row.value}</span>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}
