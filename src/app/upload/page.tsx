"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import DiamondButton from "@/components/ui/DiamondButton";
import RotatingDiamond from "@/components/ui/RotatingDiamond";
import { ROUTES } from "@/constants/routes";
import { submitPhaseTwoImage } from "@/lib/api";
import { getInitialActualSelections } from "@/lib/demographics";
import { fileToBase64 } from "@/lib/image";
import {
  saveActualSelections,
  saveDemographicsData,
} from "@/lib/storage";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setErrorMessage("");

      const result = await fileToBase64(file);

      setPreviewUrl(result.dataUrl);
      setBase64Image(result.base64);
      setFileName(file.name);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Please upload a valid image file.";

      setPreviewUrl("");
      setBase64Image("");
      setFileName("");
      setErrorMessage(message);
    }
  }

  async function handleAnalyzeImage() {
    if (!base64Image) {
      setErrorMessage("Please upload an image before proceeding.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMessage("");

      const response = await submitPhaseTwoImage({
        image: base64Image,
      });

      saveDemographicsData(response.data);
      saveActualSelections(getInitialActualSelections(response.data));

      router.push(ROUTES.analysis);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your image.";

      setErrorMessage(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0">
          <p className="skinstric-label">TO START ANALYSIS</p>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <RotatingDiamond size="lg">
            <p className="skinstric-muted-label mb-4">UPLOAD YOUR IMAGE</p>

            <h1 className="skinstric-section-title">
              Submit
              <br />
              photo
            </h1>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />

            <div className="mt-10 flex flex-col items-center gap-5">
              {previewUrl ? (
                <div
                  aria-label="Selected image preview"
                  className="h-36 w-36 rounded-full border border-[#d8d8d8] bg-cover bg-center grayscale"
                  style={{ backgroundImage: `url(${previewUrl})` }}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="grid h-36 w-36 place-items-center rounded-full border border-dotted border-[#999] text-center text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] transition-opacity hover:opacity-60 disabled:opacity-40"
                >
                  Choose
                  <br />
                  image
                </button>
              )}

              {fileName && (
                <p className="max-w-65 truncate text-center text-[11px] font-semibold uppercase tracking-[-0.02em] text-[#7c7c7c]">
                  {fileName}
                </p>
              )}

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="text-[11px] font-semibold uppercase tracking-[-0.02em] underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-40"
                >
                  {previewUrl ? "Change image" : "Browse files"}
                </button>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl("");
                      setBase64Image("");
                      setFileName("");
                      setErrorMessage("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={isAnalyzing}
                    className="text-[11px] font-semibold uppercase tracking-[-0.02em] underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-40"
                  >
                    Remove
                  </button>
                )}
              </div>

              {errorMessage && (
                <p className="max-w-85 text-center text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] text-red-600">
                  {errorMessage}
                </p>
              )}

              {isAnalyzing && (
                <p className="skinstric-muted-label">Analyzing image...</p>
              )}

              {previewUrl && (
                <DiamondButton
                  label={isAnalyzing ? "ANALYZING" : "ANALYZE"}
                  onClick={handleAnalyzeImage}
                  direction="right"
                  disabled={isAnalyzing}
                />
              )}
            </div>
          </RotatingDiamond>
        </div>
      </section>

      <BottomNav
        backHref={ROUTES.select}
        showBack
        showProceed={false}
      />
    </PageShell>
  );
}