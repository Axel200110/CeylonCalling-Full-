// PartnerWithUs/hooks/usePartnerForm.js

import { useCallback, useMemo, useState } from "react";
import {
    API_ENDPOINT,
    CATEGORY_MAP,
    MAX_CATEGORIES,
    MAX_PHOTOS,
    SRI_LANKAN_DISTRICTS
} from "../constants";
import { getCategoryTitle, toggleItem } from "../utils/helpers";
import { validateStep1, validateStep2, validateStep3 } from "../validations";

const INITIAL_STATE = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  district: "",
  establishmentType: "restaurant",
  categories: [],
  services: [],
  businessDescription: "",
  photos: []
};

export const usePartnerForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);

  const availableCategories = useMemo(
    () => CATEGORY_MAP[formData.establishmentType] || [],
    [formData.establishmentType]
  );

  const categoryTitle = useMemo(
    () => getCategoryTitle(formData.establishmentType),
    [formData.establishmentType]
  );

  const shouldShowServices = useMemo(
    () => formData.establishmentType === "restaurant",
    [formData.establishmentType]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleEstablishmentChange = useCallback((type) => {
    setFormData(prev => ({
      ...prev,
      establishmentType: type,
      categories: [],
      services: []
    }));
  }, []);

  const toggleCategory = useCallback((categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: toggleItem(prev.categories, categoryId, MAX_CATEGORIES)
    }));
  }, []);

  const toggleService = useCallback((serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: toggleItem(prev.services, serviceId)
    }));
  }, []);

  const handlePhotoChange = useCallback((newPhotos) => {
    setFormData(prev => ({
      ...prev,
      photos: newPhotos.slice(0, MAX_PHOTOS)
    }));
  }, []);

  const validateStep = useCallback((step) => {
    let validationErrors = {};
    
    if (step === 1) validationErrors = validateStep1(formData);
    else if (step === 2) validationErrors = validateStep2(formData);
    else if (step === 3) validationErrors = validateStep3(formData);

    setErrors(validationErrors);
    // Mark all fields as touched for the current step
    const fieldsToTouch = Object.keys(validationErrors);
    setTouched(prev => ({
      ...prev,
      ...fieldsToTouch.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    }));
    
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const goToStep = useCallback((step) => {
    if (step < currentStep || validateStep(step - 1)) {
      setCurrentStep(step);
    }
  }, [currentStep, validateStep]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const buildFormData = useCallback(() => {
    const data = new FormData();
    const { photos, ...rest } = formData;

    // Append all text fields
    Object.entries(rest).forEach(([key, value]) => {
      if (key === 'categories' || key === 'services') {
        data.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null && value !== '') {
        data.append(key, value);
      }
    });

    // Append district label
    const districtLabel = SRI_LANKAN_DISTRICTS
      .find(d => d.id === formData.district)?.label || formData.district || "Anuradhapura";
    data.append("location", districtLabel);
    if (formData.businessDescription) {
      data.append("details", formData.businessDescription);
    }

    // Append photos
    if (photos && Array.isArray(photos)) {
      photos.forEach(photo => {
        if (photo.file) {
          data.append("photos", photo.file);
        }
      });
    }

    return data;
  }, [formData]);

  const submitForm = useCallback(async () => {
    // Validate all steps before submission
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);

    if (!step1Valid || !step2Valid || !step3Valid) {
      setCurrentStep(1);
      setToast({
        type: "error",
        message: "Please complete all required fields before submitting."
      });
      return false;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      const formDataToSend = buildFormData();
      
      // Log the data being sent (for debugging)
      console.log("Submitting form data:", Object.fromEntries(formDataToSend));

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formDataToSend,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });

      if (!response.ok) {
        let errorMessage = "Failed to submit registration";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      setToast({
        type: "success",
        message: "✅ Thank you for your submission! Our team will review your request and contact you soon.\n\n✅ ඔබේ ඉල්ලීම සඳහා ස්තුතියි! අපගේ කණ්ඩායම ඉක්මණින් ඔබව සම්බන්ද කරනු ඇත."
      });

      // Reset form after successful submission
      setFormData(INITIAL_STATE);
      setCurrentStep(1);
      setErrors({});
      setTouched({});

      return true;
    } catch (error) {
      console.error("Submit error:", error);
      setToast({
        type: "error",
        message: error.message || "❌ An error occurred. Please try again later."
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, buildFormData, validateStep]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_STATE);
    setCurrentStep(1);
    setErrors({});
    setTouched({});
    setToast(null);
  }, []);

  return {
    formData,
    currentStep,
    isSubmitting,
    errors,
    touched,
    toast,
    availableCategories,
    categoryTitle,
    shouldShowServices,
    handleInputChange,
    handleBlur,
    handleEstablishmentChange,
    toggleCategory,
    toggleService,
    handlePhotoChange,
    validateStep,
    goToStep,
    nextStep,
    prevStep,
    submitForm,
    resetForm,
    setToast
  };
};