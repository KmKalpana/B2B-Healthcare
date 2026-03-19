export interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  notes?: string;
  status: 'active' | 'discharged' | 'archived' | 'critical' | 'recover' | 'emergency' | 'admitted';
  createdAt: Date;
  updatedAt?: Date;
}
