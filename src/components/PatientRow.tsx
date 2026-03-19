import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { fetchPatients } from "../features/patients/patientSlice";
import { Patient } from "../features/patients/patientTypes";
import PatientModal from "./modal/PatientModal";
import DeleteModal from "./modal/DeleteModal"; 
import "../styles/patients.css";

interface Props {
  patient: Patient;
}

export default function PatientRow({ patient }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "discharged": return "bg-orange-100 text-orange-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking action buttons
    if (e.target instanceof Element && e.target.closest('.actions-cell')) {
      return;
    }
    navigate(`/patients/${patient.id}`);
  };

  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPatient(patient);
    setShowEditModal(true);
  };
    const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setSelectedPatient(null);
  };

  const handleModalSuccess = () => {
    dispatch(fetchPatients()); // Refresh list
  };

  return (
    <>
      <tr 
        className="patient-row clickable" 
        onClick={handleRowClick}
      >
        <td>{patient.name}</td>
        <td>{patient.age}</td>
        <td className="email-cell">
          <span className="email">{patient.email}</span>
        </td>
        <td>{patient.phone}</td>
        <td>
          <span className={`status-badge-row ${getStatusColor(patient.status)}`}>
            {patient.status}
          </span>
        </td>
        <td>{patient.city}</td>
        <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
        <td className="actions-cell">
          <button 
            className="btn-edit"
            onClick={openEditModal}
            title="Edit Patient"
          >
            ✏️
          </button>
          <button 
            className="btn-delete"
            onClick={openDeleteModal}
            title="Delete Patient"
          >
            🗑️
          </button>
        </td>
      </tr>
      <PatientModal
        isOpen={showEditModal}
        patient={selectedPatient}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
         <DeleteModal
        isOpen={showDeleteModal}
        patient={selectedPatient}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
