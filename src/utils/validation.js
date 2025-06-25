/**
 * validation.js
 * Form validation helpers.
 */

export const validateUsername = username => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(username).toLowerCase());
};

export const validatePassword = password => {
  return typeof password === 'string' && password.length >= 6;
};

// Additional validation helpers can be added here
