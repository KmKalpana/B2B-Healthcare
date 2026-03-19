import { Link } from "react-router-dom";
import { Patient } from "../features/patients/patientTypes";
 import "../styles/patientCard.css";

interface Props {
  patient: Patient;
}

export default function PatientCard({ patient }: Props) {
  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "discharged": return "bg-orange-100 text-orange-800 border-orange-200";
      case "archived": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Link to={`/patients/${patient.id}`} className="patient-card-link">
      <div className="patient-card">
        <div className="card-header">
          <div className="patient-avatar">
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <div className="status-badge">
            <span className={`status-dot ${patient.status}`}></span>
            <span className="status-text">{patient.status}</span>
          </div>
        </div>

        <div className="card-body">
          <h3 className="patient-name">{patient.name}</h3>
          <div className="patient-meta">
            <span className="meta-item">🕒 {patient.age} yrs</span>
            <span className="meta-item">📍 {patient.city}</span>
            <span className="meta-item">{patient.gender[0]}</span>
            <span className="email-preview">{patient.email}</span>
          </div>
          {patient.notes && (
            <p className="patient-notes">{patient.notes}</p>
          )}
          
        </div>

        <div className="card-footer">
      
          <span className="view-details">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
