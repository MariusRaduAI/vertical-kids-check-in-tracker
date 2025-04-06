
import { AgeGroup, Child, ProgramType } from "./models";

export interface TagPreviewType {
  childName: string;
  uniqueCode: string;
  ageGroup: AgeGroup;
  program: ProgramType;
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
}
