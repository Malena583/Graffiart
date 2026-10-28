export const getErrorMessage = (error, fallback) =>
  error?.response?.data?.error || fallback;
