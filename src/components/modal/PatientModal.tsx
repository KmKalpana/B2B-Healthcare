import { useState, FormEvent, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addPatient, updatePatient } from "../../features/patients/patientSlice";
import type { Patient } from "../../features/patients/patientTypes";
import "../../styles/addpatientmodal.css"
import Button from "../ui/Button";

interface Props {
  isOpen: boolean;
  patient?: Patient | null;  
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "discharged", label: "Discharged" },
  { value: "archived", label: "Archived" },
  { value: "critical", label: "Critical" },
  { value: "recover", label: "Recovered" },
  { value: "emergency", label: "Emergency" },
  { value: "admitted", label: "Admitted" }
] as const;

interface FormErrors {
  name?: string;
  age?: string;
  email?: string;
  phone?: string;
  city?: string;
  general?: string;
}

export default function PatientModal({ 
  isOpen, 
  patient, 
  onClose, 
  onSuccess 
}: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    gender: "Male" as "Male" | "Female" | "Other",
    city: "",
    notes: "",
    status: "active" as Patient['status']
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = !!patient;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && patient) {
        // EDIT: Populate with patient data
        setFormData({
          name: patient.name,
          age: patient.age.toString(),
          email: patient.email,
          phone: patient.phone,
          gender: patient.gender as "Male" | "Female" | "Other",
          city: patient.city,
          notes: patient.notes || "",
          status: patient.status
        });
        setErrors({});
      } else {
        // ADD: Reset form
        setFormData({
          name: "",
          age: "",
          email: "",
          phone: "",
          gender: "Male",
          city: "",
          notes: "",
          status: "active"
        });
        setErrors({});
      }
    }
  }, [isOpen, patient, isEditMode]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 2) newErrors.name = "Name must be 2+ chars";

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      newErrors.age = "Age must be 0-120";
    }

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Valid email required";
    }

    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Phone must be 10+ chars";
    }

    if (!formData.city.trim()) newErrors.city = "City is required";

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const patientDataBase = {
        name: formData.name.trim(),
        age: Number(formData.age),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        city: formData.city.trim(),
        status: formData.status
      };

      const patientData = formData.notes.trim()
        ? { ...patientDataBase, notes: formData.notes.trim() }
        : patientDataBase;

      if (isEditMode && patient?.id) {
        await dispatch(updatePatient({ 
          id: patient.id, 
          updates: patientData 
        })).unwrap();
      } else {
        await dispatch(addPatient(patientData)).unwrap();
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      setErrors({ general: "Failed to save patient" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? "Edit Patient" : "Add New Patient"}</h3>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>

        {errors.general && <div className="general-error error">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                min="0" 
                max="120"
                disabled={loading}
                className={errors.age ? "error" : ""}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value as "Male" | "Female" | "Other")}
                disabled={loading}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={loading}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={loading}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Dehradun"
                disabled={loading}
                className={errors.city ? "error" : ""}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value as Patient['status'])}
                disabled={loading}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Medical history, allergies, current medications..."
              rows={3}
              disabled={loading}
            />
          </div>

         <div className="form-actions">
  <Button
    variant="secondary"
    size="md"
    onClick={onClose}
    disabled={loading}
  >
    Cancel
  </Button>
  
  <Button
    variant="primary"
    size="lg"
    disabled={loading}
  >
    {loading ? "Saving..." : (isEditMode ? "Update Patient" : "Add Patient")}
  </Button>
</div>
        </form>
      </div>
    </div>
  );
}
