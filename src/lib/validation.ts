const VALID_TEXT_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'.-]+$/;

export type ValidationResult = {
  isValid: boolean;
  message: string;
};

export function validateRequiredText(
  value: string,
  fieldName: "name" | "location"
): ValidationResult {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      isValid: false,
      message: `Please enter your ${fieldName}.`,
    };
  }

  if (trimmedValue.length < 2) {
    return {
      isValid: false,
      message: `Your ${fieldName} must be at least 2 characters.`,
    };
  }

  if (/\d/.test(trimmedValue)) {
    return {
      isValid: false,
      message: `Your ${fieldName} cannot contain numbers.`,
    };
  }

  if (!VALID_TEXT_PATTERN.test(trimmedValue)) {
    return {
      isValid: false,
      message: `Your ${fieldName} can only include letters, spaces, apostrophes, periods, or hyphens.`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

export function validateName(name: string): ValidationResult {
  return validateRequiredText(name, "name");
}

export function validateLocation(location: string): ValidationResult {
  return validateRequiredText(location, "location");
}

export function sanitizeTextInput(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}