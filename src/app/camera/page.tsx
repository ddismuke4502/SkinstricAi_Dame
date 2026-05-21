"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import DiamondButton from "@/components/ui/DiamondButton";
import RotatingDiamond from "@/components/ui/RotatingDiamond";
import { ROUTES } from "@/constants/routes";
import { submitPhaseTwoImage } from "@/lib/api";
import { getInitialActualSelections } from "@/lib/demographics";
import { canvasToBase64 } from "@/lib/image";
import {
  saveActualSelections,
  saveDemographicsData,
} from "@/lib/storage";

export default function CameraPage() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState("");
  const [capturedBase64, setCapturedBase64] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraActive(false);
  }

  async function startCamera() {
    try {
      setErrorMessage("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMessage("Camera access is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCapturedPreview("");
      setCapturedBase64("");
      setIsCameraActive(true);
    } catch {
      setErrorMessage(
        "Unable to access your camera. Please allow camera permissions and try again."
      );
      setIsCameraActive(false);
    }
  }

  function captureSelfie() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setErrorMessage("Camera is not ready yet. Please try again.");
      return;
    }

    const width = video.videoWidth || 720;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setErrorMessage("Unable to capture this selfie. Please try again.");
      return;
    }

    context.translate(width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, width, height);
    context.setTransform(1, 0, 0, 1, 0, 0);

    const result = canvasToBase64(canvas);

    setCapturedPreview(result.dataUrl);
    setCapturedBase64(result.base64);
    setErrorMessage("");
    stopCamera();
  }

  async function analyzeSelfie() {
    if (!capturedBase64) {
      setErrorMessage("Please take a selfie before proceeding.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMessage("");

      const response = await submitPhaseTwoImage({
        image: capturedBase64,
      });

      saveDemographicsData(response.data);
      saveActualSelections(getInitialActualSelections(response.data));

      router.push(ROUTES.demographics);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your selfie.";

      setErrorMessage(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0">
          <p className="skinstric-label">TO START ANALYSIS</p>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <RotatingDiamond size="lg">
            <p className="skinstric-muted-label mb-4">TAKE A SELFIE</p>

            <h1 className="skinstric-section-title">
              Capture
              <br />
              image
            </h1>

            <div className="mt-10 flex flex-col items-center gap-5">
              <div className="relative grid h-48 w-48 place-items-center overflow-hidden rounded-full border border-[#d8d8d8] bg-[#f1f1f1] md:h-56 md:w-56">
                {capturedPreview ? (
                  <div
                    aria-label="Captured selfie preview"
                    className="h-full w-full bg-cover bg-center grayscale"
                    style={{ backgroundImage: `url(${capturedPreview})` }}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    className={[
                      "h-full w-full scale-x-[-1] object-cover grayscale",
                      isCameraActive ? "block" : "hidden",
                    ].join(" ")}
                  />
                )}

                {!isCameraActive && !capturedPreview && (
                  <p className="px-8 text-center text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] text-[#7c7c7c]">
                    Camera preview
                  </p>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                {!isCameraActive && !capturedPreview && (
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={isAnalyzing}
                    className="text-[11px] font-semibold uppercase tracking-[-0.02em] underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-40"
                  >
                    Start camera
                  </button>
                )}

                {isCameraActive && (
                  <button
                    type="button"
                    onClick={captureSelfie}
                    disabled={isAnalyzing}
                    className="text-[11px] font-semibold uppercase tracking-[-0.02em] underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-40"
                  >
                    Capture selfie
                  </button>
                )}

                {capturedPreview && (
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={isAnalyzing}
                    className="text-[11px] font-semibold uppercase tracking-[-0.02em] underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-40"
                  >
                    Retake
                  </button>
                )}
              </div>

              {errorMessage && (
                <p className="max-w-90 text-center text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] text-red-600">
                  {errorMessage}
                </p>
              )}

              {isAnalyzing && (
                <p className="skinstric-muted-label">Analyzing selfie...</p>
              )}

              {capturedPreview && (
                <DiamondButton
                  label={isAnalyzing ? "ANALYZING" : "ANALYZE"}
                  onClick={analyzeSelfie}
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