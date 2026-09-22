export type TrackerActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialTrackerActionState: TrackerActionState = {
  status: "idle",
  message: "",
};
