
export interface ChildCheckInState {
  childId: string;
  selected: boolean;
  program: "P1" | "P2" | "Both";
  medicalCheckComplete: boolean;
}
