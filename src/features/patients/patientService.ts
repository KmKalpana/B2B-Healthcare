import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy,
  getDoc 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import type { Patient } from './patientTypes';

// ✅ Clean undefined values (Firebase requirement)
const cleanUndefined = (obj: any): any => {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

export const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    try {
      const patientsQuery = query(
        collection(db, 'patients'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(patientsQuery);
      return querySnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          name: data.name,
          age: data.age,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          city: data.city,
          notes: data.notes || undefined,
          status: data.status,
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.()
        } as Patient;
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  addPatient: async (patientData: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> => {
    try {
      const docRef = await addDoc(collection(db, 'patients'), {
        ...cleanUndefined(patientData),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      
      return {
        id: docRef.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.() || new Date(),
        updatedAt: data?.updatedAt?.toDate?.()
      } as Patient;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  },

  updatePatient: async (id: string, updates: Partial<Patient>): Promise<void> => {
    try {
      const patientRef = doc(db, 'patients', id);
      await updateDoc(patientRef, {
        ...cleanUndefined(updates),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  deletePatient: async (id: string): Promise<void> => {
    try {
      const patientRef = doc(db, 'patients', id);
      await deleteDoc(patientRef);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
};
