// PartnerWithUs/components/NavigationButtons.jsx

const NavigationButtons = ({ 
  onPrevious, 
  onNext, 
  isSubmitting,
  currentStep,
  totalSteps = 3,
  previousLabel = "← Previous",
  nextLabel = "Next Step",
  submitLabel = "Submit Registration"
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between pt-2">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
          aria-label="Previous step"
        >
          {previousLabel}
        </button>
      )}
      {currentStep < totalSteps && (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/15 flex items-center gap-2 ml-auto"
          aria-label="Next step"
        >
          {nextLabel}
          <span className="text-lg leading-none" aria-hidden="true">→</span>
        </button>
      )}
      {isLastStep && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
          aria-label="Submit registration"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;