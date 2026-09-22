export type TimerSettingsActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialTimerSettingsActionState: TimerSettingsActionState = {
  status: "idle",
  message: "",
};
