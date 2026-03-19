import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { deletePatient } from "../../features/patients/patientSlice";
import { Patient } from "../../features/patients/patientTypes";
import toast from "react-hot-toast";
import "../../styles/deleteModal.css";

interface Props {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteModal({ isOpen, patient, onClose, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!patient?.id) return;

    setDeleting(true);
    try {
      await dispatch(deletePatient(patient.id)).unwrap();
      toast.success("Patient deleted successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to delete patient");
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Delete Patient</h3>
        </div>

        <div className="delete-content">
          <p className="warning-text">
            Are you sure you want to delete <strong>{patient.name}</strong> data?
          </p>
        </div>

        <div className="modal-actions">
          <button 
            className="btn-cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button 
            className="btn-delete-confirm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}