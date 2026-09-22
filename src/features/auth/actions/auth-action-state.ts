export type LoginActionState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialLoginActionState: LoginActionState = {
  status: "idle",
  message: "",
};
