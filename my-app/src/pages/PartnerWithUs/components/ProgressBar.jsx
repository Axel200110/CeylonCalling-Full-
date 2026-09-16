// PartnerWithUs/components/ProgressBar.jsx

import { Check } from "lucide-react";

const ProgressBar = ({ currentStep, onStepClick, validateStep }) => {
  const steps = [1, 2, 3];

  const handleClick = (step) => {
    if (step < currentStep || validateStep(step - 1)) {
      onStepClick(step);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step) => (
        <div key={step} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleClick(step)}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
              step === currentStep
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : step < currentStep
                ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
            aria-label={`Step ${step}`}
            aria-current={step === currentStep ? "step" : undefined}
          >
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </button>
          {step < 3 && (
            <div
              className={`w-8 h-0.5 rounded-full ${
                step < currentStep ? "bg-emerald-400" : "bg-slate-200"
              }`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
      <span className="text-xs text-slate-400 ml-2">
        Step {currentStep} of 3
      </span>
    </div>
  );
};

export default ProgressBar;