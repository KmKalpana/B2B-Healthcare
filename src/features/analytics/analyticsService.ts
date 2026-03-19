import type { Patient } from "../patients/patientTypes";

import { patientService } from "../patients/patientService";

export type AnalyticsData = {
  totalPatients: number;
  activePatients: number;
  dischargedPatients: number;
};

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  // simulate API delay
  await new Promise((res) => setTimeout(res, 500));

  // Fetch the same patients list that you use in PatientsPage
   const patients: Patient[] = await patientService.getPatients(); 

  // Compute real counts from actual data
  const totalPatients = patients.length;

  // Example heuristic: treat patients with age < 40 as "active",
  // and 40+ as "discharged" (replace this with your real business logic)
  const activePatients = patients.filter((p) => p.age < 40).length;
  const dischargedPatients = totalPatients - activePatients;

  return {
    totalPatients,
    activePatients,
    dischargedPatients,
  };
};
