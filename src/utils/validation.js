/**
 * Client-side validation is UX (fast feedback). A real backend must re-validate,
 * because the client can always be bypassed. Returns {} when valid.
 */
export const validateLogin = ({ username, password }) => {
  const errors = {};
  const name = username.trim();
  if (!name) errors.username = 'Enter your username.';
  else if (name.length < 3) errors.username = 'Username must be at least 3 characters.';
  if (!password) errors.password = 'Enter your password.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
};

/** Only redirect to paths inside our own app ("//evil.com" would be external). */
export const getSafeRedirect = (from) =>
  typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && from !== '/login'
    ? from
    : '/';
