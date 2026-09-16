// PartnerWithUs/validations.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateStep1 = (formData) => {
  const errors = {};

  if (!formData.businessName?.trim()) {
    errors.businessName = "Business name is required";
  }

  if (!formData.ownerName?.trim()) {
    errors.ownerName = "Owner name is required";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.phone?.trim()) {
    errors.phone = "Phone number is required";
  }

  if (!formData.district) {
    errors.district = "Please select a district";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export const validateStep2 = (formData) => {
  const errors = {};

  if (!formData.categories || formData.categories.length === 0) {
    errors.categories = "Please select at least one category";
  }

  return errors;
};

export const validateStep3 = (formData) => {
  const errors = {};

  if (!formData.photos || formData.photos.length === 0) {
    errors.photos = "Please upload at least one photo";
  }

  return errors;
};

export const validateAllSteps = (formData) => {
  return {
    step1: validateStep1(formData),
    step2: validateStep2(formData),
    step3: validateStep3(formData)
  };
};