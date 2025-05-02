
import { AgeGroup, Child, ProgramType } from "./models";

export interface TagPreviewType {
  childName: string;
  uniqueCode: string;
  ageGroup: AgeGroup;
  program: ProgramType; // Updated to use ProgramType which includes "Both"
  date: string;
}

export interface MedicalCheckData {
  temperature: boolean;
  noSymptoms: boolean;
  goodCondition: boolean;
}

export interface NewChildFormData {
  firstName: string;
  lastName: string;
  ageGroup: AgeGroup;
  parentName: string;
  birthDate: string;
  hasAllergies: boolean;
  allergiesDetails: string;
}
