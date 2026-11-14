/** Tauri commands may reject with a plain string, so accept both shapes. */
export function getErrorMessage(error: Error | string | null | undefined): string {
  if (!error) return "Something went wrong. Please try again.";
  return typeof error === "string" ? error : error.message;
}
