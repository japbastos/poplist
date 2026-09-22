export type TaskActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialTaskActionState: TaskActionState = {
  status: "idle",
  message: "",
};
