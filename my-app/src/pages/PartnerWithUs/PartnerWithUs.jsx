// PartnerWithUs/PartnerWithUs.jsx

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Quiz from "../../assets/Restaurent.jpg";
import BusinessInfo from "./components/BusinessInfo";
import CategorySelector from "./components/CategorySelector";
import NavigationButtons from "./components/NavigationButtons";
import PhotoUploader from "./components/PhotoUploader";
import ProgressBar from "./components/ProgressBar";
import ReviewCard from "./components/ReviewCard";
import ServiceSelector from "./components/ServiceSelector";
import StepHeader from "./components/StepHeader";
import { RESTAURANT_SERVICES } from "./constants";
import { usePartnerForm } from "./hooks/usePartnerForm";

const PartnerWithUs = () => {
  const navigate = useNavigate();
  const {
    formData,
    currentStep,
    isSubmitting,
    errors,
    toast,
    availableCategories,
    categoryTitle,
    shouldShowServices,
    handleInputChange,
    handleEstablishmentChange,
    toggleCategory,
    toggleService,
    handlePhotoChange,
    goToStep,
    nextStep,
    prevStep,
    submitForm,
    validateStep,
    setToast
  } = usePartnerForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitForm();
    if (success) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            <StepHeader
              step={1}
              title="Merchant Identity & Verification"
              subtitle="Establish your brand profile, operational contacts, and secure portal access."
            />
            <BusinessInfo
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onEstablishmentChange={handleEstablishmentChange}
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            <StepHeader
              step={2}
              title="Experience Categorization"
              subtitle="Select up to 4 tags and operational capabilities that define your guest experiences."
            />
            <CategorySelector
              categories={availableCategories}
              selected={formData.categories}
              onToggle={toggleCategory}
              title={categoryTitle}
            />
            {shouldShowServices && (
              <ServiceSelector
                services={RESTAURANT_SERVICES}
                selected={formData.services}
                onToggle={toggleService}
              />
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-6"
          >
            <StepHeader
              step={3}
              title="Visual Portfolio & Final Audit"
              subtitle="Showcase high-resolution media properties and double-check asset accuracy prior to review."
            />
            <PhotoUploader
              photos={formData.photos}
              onPhotoChange={handlePhotoChange}
            />
            <ReviewCard formData={formData} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8 md:py-16 flex items-center justify-center relative select-none"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(6, 78, 59, 0.65)), url(${Quiz})` }}
    >
      <div className="w-full max-w-4xl rounded-3xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] p-6 sm:p-10 md:p-12 relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700" />

        {/* Header Block */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200/60 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                <ShieldCheck className="w-3 h-3" /> Merchant Platform
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Register Your Business
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
              List your <span className="text-emerald-700 font-bold capitalize">{formData.establishmentType || "Establishment"}</span> on Ceylon Calling to unlock global traveler visibility.
              <span className="block text-xs text-slate-400 font-normal mt-1 tracking-wide">
                ඔබගේ ව්‍යාපාරය Ceylon Calling හි එක්කර පාරිශ්‍රමිකයින්ට පහසුවෙන් ළඟා වන්න.
              </span>
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] flex-shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" /> Back to Home
          </Link>
        </div>

        {/* Dynamic Multi-Step Progress Utility */}
        <div className="mb-8 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
          <ProgressBar
            currentStep={currentStep}
            onStepClick={goToStep}
            validateStep={validateStep}
          />
        </div>

        {/* Toast Alerts Portal notifications */}
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-sm overflow-hidden ${
                toast.type === "success" 
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" 
                  : "bg-rose-50/60 border-rose-200 text-rose-900"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold whitespace-pre-line leading-relaxed">{toast.message}</p>
                <button 
                  type="button"
                  onClick={() => setToast(null)}
                  className="mt-1.5 text-xs font-bold underline transition opacity-80 hover:opacity-100"
                >
                  Dismiss Notification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Form Wrapper Viewport */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {getStepContent()}
          </AnimatePresence>

          {/* Bottom Dynamic Operational Actions Bar */}
          <div className="pt-6 border-t border-slate-100">
            <NavigationButtons
              currentStep={currentStep}
              onPrevious={prevStep}
              onNext={nextStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PartnerWithUs;