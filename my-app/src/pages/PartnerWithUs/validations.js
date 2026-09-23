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
    errors.district = "Please select a district (Anuradhapura or Polonnaruwa)";
  }

  if (!formData.city) {
    errors.city = "Please select a town or tourism zone";
  }

  if (formData.latitude !== undefined && formData.latitude !== "") {
    const lat = Number(formData.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = "Latitude must be a valid number between -90 and 90";
    }
  }

  if (formData.longitude !== undefined && formData.longitude !== "") {
    const lng = Number(formData.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = "Longitude must be a valid number between -180 and 180";
    }
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

  // Categories only required if food is provided or establishment is restaurant
  if (formData.hasFood !== false && (!formData.categories || formData.categories.length === 0)) {
    errors.categories = "Please select at least one relevant category or specialization";
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