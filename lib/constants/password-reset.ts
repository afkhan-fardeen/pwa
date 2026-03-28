/** Password reset email link validity (must match server token expiry). */
export const PASSWORD_RESET_EXPIRY_MINUTES = 15;
export const PASSWORD_RESET_EXPIRY_MS =
  PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000;
