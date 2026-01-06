import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { OnboardingStep } from "@/api/onboarding";

type OnboardingQuestionProps = {
  step: OnboardingStep;
  value: string[] | string | null;
  onChange: (newValue: string[] | string | null) => void;
};

export const OnboardingQuestion = ({
  step,
  value,
  onChange,
}: OnboardingQuestionProps) => {
  if (step.type === "multi") {
    const selectedValues = Array.isArray(value) ? value : [];
    const maxReached =
      step.max_answers !== null &&
      step.max_answers !== undefined &&
      selectedValues.length >= step.max_answers;

    const handleCheckboxChange = (optionId: string, checked: boolean) => {
      const currentValues = Array.isArray(value) ? value : [];
      if (checked) {
        if (maxReached) {
          return; // Don't allow more selections if max is reached
        }
        onChange([...currentValues, optionId]);
      } else {
        onChange(currentValues.filter((id) => id !== optionId));
      }
    };

    return (
      <div className="space-y-3">
        {step.options.map((option) => {
          const isChecked = selectedValues.includes(option.id);
          const isDisabled =
            maxReached && !isChecked && step.max_answers !== null;

          return (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={isChecked}
                disabled={isDisabled}
                className="rounded-none"
                onCheckedChange={(checked) =>
                  handleCheckboxChange(option.id, checked === true)
                }
              />
              <Label
                htmlFor={option.id}
                className={`text-sm font-normal cursor-pointer ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    );
  }

  // Single choice (radio)
  // Use empty string instead of undefined to keep component controlled
  const selectedValue = typeof value === "string" ? value : "";

  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={(newValue) => onChange(newValue)}
    >
      {step.options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label
            htmlFor={option.id}
            className="text-sm font-normal cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
