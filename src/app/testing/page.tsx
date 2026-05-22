"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import RotatingDiamond from "@/components/ui/RotatingDiamond";
import { ROUTES } from "@/constants/routes";
import { submitPhaseOneProfile } from "@/lib/api";
import { saveCustomerProfile } from "@/lib/storage";
import {
  sanitizeTextInput,
  validateLocation,
  validateName,
} from "@/lib/validation";

type TestingStep = "name" | "location";

export default function TestingPage() {
  const router = useRouter();

  const [step, setStep] = useState<TestingStep>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentValue = step === "name" ? name : location;
  const setCurrentValue = step === "name" ? setName : setLocation;

  const canProceedFromLocation =
    validateName(name).isValid && validateLocation(location).isValid;

  function handleBack() {
    setErrorMessage("");

    if (step === "location") {
      setStep("name");
      return;
    }

    router.push(ROUTES.home);
  }

  function moveToLocationStep() {
    const cleanedName = sanitizeTextInput(name);
    const validation = validateName(cleanedName);

    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    setName(cleanedName);
    setErrorMessage("");
    setStep("location");
  }

  async function submitProfile() {
    const cleanedName = sanitizeTextInput(name);
    const cleanedLocation = sanitizeTextInput(location);

    const nameValidation = validateName(cleanedName);
    const locationValidation = validateLocation(cleanedLocation);

    if (!nameValidation.isValid) {
      setErrorMessage(nameValidation.message);
      setStep("name");
      return;
    }

    if (!locationValidation.isValid) {
      setErrorMessage(locationValidation.message);
      setStep("location");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const profile = {
        name: cleanedName,
        location: cleanedLocation,
      };

      await submitPhaseOneProfile(profile);
      saveCustomerProfile(profile);

      router.push(ROUTES.select);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === "name") {
      moveToLocationStep();
      return;
    }

    void submitProfile();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;

    event.preventDefault();

    if (step === "name") {
      moveToLocationStep();
      return;
    }

    void submitProfile();
  }

  return (
    <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="skinstric-content-enter relative min-h-[calc(100vh-6rem)]">
        <h1 className="skinstric-label absolute left-0 top-0">
          TO START ANALYSIS
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-[calc(100vh-6rem)] items-center justify-center"
        >
          <RotatingDiamond size="md">
            <label
              htmlFor="testing-input"
              className="skinstric-muted-label mb-4"
            >
              {step === "name" ? "CLICK TO TYPE" : "WHERE ARE YOU FROM?"}
            </label>

            <input
              id="testing-input"
              value={currentValue}
              onChange={(event) => {
                setCurrentValue(event.target.value);
                setErrorMessage("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={isSubmitting}
              placeholder={
                step === "name" ? "Introduce Yourself" : "Where are you from?"
              }
              className="skinstric-testing-input" 
              spellCheck={false}
            />

            <p
              className={[
                "mt-5 min-h-4 max-w-105 text-center text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] text-red-600",
                errorMessage ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              {errorMessage || "No error"}
            </p>

            {isSubmitting && (
              <p className="skinstric-muted-label mt-2">Submitting...</p>
            )}
          </RotatingDiamond>
        </form>
      </section>

      <BottomNav
        onBack={handleBack}
        onProceed={() => {
          if (step === "name") {
            moveToLocationStep();
            return;
          }

          void submitProfile();
        }}
        showProceed={step === "location"}
        proceedDisabled={!canProceedFromLocation || isSubmitting}
      />
    </PageShell>
  );
}