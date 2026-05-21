"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import RotatingDiamond from "@/components/ui/RotatingDiamond";
import { ROUTES } from "@/constants/routes";
import { submitPhaseTwoImage } from "@/lib/api";
import { getInitialActualSelections } from "@/lib/demographics";
import { fileToBase64 } from "@/lib/image";
import { saveActualSelections, saveDemographicsData } from "@/lib/storage";

type UploadStage = "permission" | "preview" | "analyzing";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stage, setStage] = useState<UploadStage>("permission");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setErrorMessage("");

      const result = await fileToBase64(file);

      setPreviewUrl(result.dataUrl);
      setBase64Image(result.base64);
      setFileName(file.name);
      setStage("preview");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Please upload a valid image file.";

      setPreviewUrl("");
      setBase64Image("");
      setFileName("");
      setErrorMessage(message);
      setStage("permission");
    }
  }

  async function handleAnalyzeImage() {
    if (!base64Image) {
      setErrorMessage("Please upload an image before proceeding.");
      return;
    }

    try {
      setStage("analyzing");
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
      setStage("preview");
    }
  }

  function resetUpload() {
    setPreviewUrl("");
    setBase64Image("");
    setFileName("");
    setErrorMessage("");
    setStage("permission");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  if (stage === "analyzing") {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center px-7 pt-0 md:px-8">
        <RotatingDiamond size="md">
          <p className="text-[13px] font-semibold uppercase tracking-[-0.02em]">
            PREPARING YOUR ANALYSIS ...
          </p>
        </RotatingDiamond>
      </PageShell>
    );
  }

  if (stage === "preview") {
    return (
      <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
        <section className="relative min-h-[calc(100vh-6rem)]">
          <div className="absolute left-0 top-0">
            <p className="skinstric-label">TO START ANALYSIS</p>
          </div>

          <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
            <RotatingDiamond size="lg">
              <p className="skinstric-muted-label mb-4">IMAGE SELECTED</p>

              <h1 className="skinstric-section-title">
                Ready
                <br />
                to scan
              </h1>

              <div className="mt-10 flex flex-col items-center gap-5">
                <div
                  aria-label="Selected image preview"
                  className="h-40 w-40 rounded-full border border-[#1a1a1a] bg-cover bg-center grayscale md:h-48 md:w-48"
                  style={{ backgroundImage: `url(${previewUrl})` }}
                />

                <p className="max-w-65 truncate text-center text-[11px] font-semibold uppercase tracking-[-0.02em] text-[#7c7c7c]">
                  {fileName}
                </p>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-semibold uppercase tracking-[-0.02em] underline underline-offset-4 transition-opacity hover:opacity-60"
                  >
                    Change image
                  </button>

                  <button
                    type="button"
                    onClick={resetUpload}
                    className="text-[11px] font-semibold uppercase tracking-[-0.02em] underline underline-offset-4 transition-opacity hover:opacity-60"
                  >
                    Remove
                  </button>
                </div>

                {errorMessage && (
                  <p className="max-w-85 text-center text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>
            </RotatingDiamond>
          </div>
        </section>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />

        <BottomNav
          backHref={ROUTES.select}
          showBack
          showProceed
          proceedLabel="ANALYZE"
          onProceed={handleAnalyzeImage}
        />
      </PageShell>
    );
  }

  return (
    <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0">
          <p className="skinstric-label">TO START ANALYSIS</p>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <div className="relative grid h-105 w-105 place-items-center">
            <span className="diamond-frame rotate-slow w-105" />
            <span className="diamond-frame rotate-medium w-90" />
            <span className="diamond-frame rotate-fast w-75" />

            <div className="relative z-10 grid place-items-center">
              <div className="grid h-28 w-28 place-items-center rounded-full border border-[#1a1a1a]">
                <Image
                  src="/assets/icons/gallery-icon.svg"
                  alt=""
                  width={96}
                  height={96}
                  className="h-20 w-20 object-contain opacity-60"
                  aria-hidden="true"
                />
              </div>

              <div className="absolute right-19 top-18 h-px w-28 rotate-[-38deg] bg-[#1a1a1a]" />

              <p className="absolute right-38.75 top-26 w-44 text-right text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em]">
                ALLOW A.I.
                <br />
                ACCESS GALLERY
              </p>
            </div>
          </div>

          <div className="skinstric-permission-modal">
            <p className="border-b border-white/30 px-5 py-5 text-[12px] font-semibold uppercase tracking-[-0.02em]">
              ALLOW A.I. TO ACCESS YOUR GALLERY
            </p>

            <div className="flex justify-end gap-8 px-5 py-3">
              <button
                type="button"
                onClick={() => router.push(ROUTES.select)}
                className="text-[11px] font-semibold uppercase tracking-[-0.02em] text-white/70 transition-opacity hover:opacity-70"
              >
                DENY
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold uppercase tracking-[-0.02em] text-white transition-opacity hover:opacity-70"
              >
                ALLOW
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="absolute bottom-28 left-1/2 max-w-md -translate-x-1/2 text-center text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] text-red-600">
            {errorMessage}
          </p>
        )}
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <BottomNav backHref={ROUTES.select} showBack showProceed={false} />
    </PageShell>
  );
}
