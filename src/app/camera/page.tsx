"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import RotatingDiamond from "@/components/ui/RotatingDiamond";
import { CameraIcon } from "@/components/ui/SkinstricIcons";
import { ROUTES } from "@/constants/routes";
import { submitPhaseTwoImage } from "@/lib/api";
import { getInitialActualSelections } from "@/lib/demographics";
import { canvasToBase64 } from "@/lib/image";
import { saveActualSelections, saveDemographicsData } from "@/lib/storage";

type CameraStage =
  | "permission"
  | "settingUp"
  | "live"
  | "captured"
  | "analyzing";

function CameraGuidanceCopy({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const textColor = tone === "light" ? "text-white" : "text-[#1a1a1a]";
  const mutedColor = tone === "light" ? "text-white/90" : "text-[#1a1a1a]";

  return (
    <div
      className={[
        "mt-18 text-center text-[11px] font-semibold uppercase leading-relaxed tracking-[-0.02em]",
        textColor,
      ].join(" ")}
    >
      <p>TO GET BETTER RESULTS MAKE SURE TO HAVE</p>

      <div
        className={[
          "mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2",
          mutedColor,
        ].join(" ")}
      >
        <span>◇ NEUTRAL EXPRESSION</span>
        <span>◇ FRONTAL POSE</span>
        <span>◇ ADEQUATE LIGHTING</span>
      </div>
    </div>
  );
}

export default function CameraPage() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stage, setStage] = useState<CameraStage>("permission");
  const [capturedPreview, setCapturedPreview] = useState("");
  const [capturedBase64, setCapturedBase64] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startCamera() {
    try {
      setErrorMessage("");
      setCapturedPreview("");
      setCapturedBase64("");
      setStage("settingUp");

      const setupStartedAt = Date.now();

      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMessage("Camera access is not supported in this browser.");
        setStage("permission");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      const elapsedSetupTime = Date.now() - setupStartedAt;
      const minimumSetupTime = 900;
      const remainingSetupTime = Math.max(
        0,
        minimumSetupTime - elapsedSetupTime,
      );

      await new Promise((resolve) => {
        window.setTimeout(resolve, remainingSetupTime);
      });

      setStage("live");
    } catch {
      setErrorMessage(
        "Unable to access your camera. Please allow camera permissions and try again.",
      );
      setStage("permission");
    }
  }

  useEffect(() => {
    if (stage !== "live") return;

    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;

    void video.play().catch(() => {
      setErrorMessage("Unable to start the camera preview. Please try again.");
      setStage("permission");
    });
  }, [stage]);

  function captureSelfie() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setErrorMessage("Camera is not ready yet. Please try again.");
      return;
    }

    const width = video.videoWidth || 1280;
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
    setStage("captured");
    stopCamera();
  }

  async function analyzeSelfie() {
    if (!capturedBase64) {
      setErrorMessage("Please take a selfie before proceeding.");
      return;
    }

    try {
      setStage("analyzing");
      setErrorMessage("");

      const response = await submitPhaseTwoImage({
        image: capturedBase64,
      });

      saveDemographicsData(response.data);
      saveActualSelections(getInitialActualSelections(response.data));

      router.push(ROUTES.analysis);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your selfie.";

      setErrorMessage(message);
      setStage("captured");
    }
  }

  function handleBack() {
    if (stage === "live") {
      stopCamera();
      setStage("permission");
      return;
    }

    if (stage === "captured") {
      setCapturedPreview("");
      setCapturedBase64("");
      setStage("permission");
      return;
    }

    router.push(ROUTES.select);
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (stage === "settingUp" || stage === "analyzing") {
    return (
      <PageShell contentClassName="flex min-h-screen items-center justify-center px-7 pt-0 md:px-8">
        <div className="flex flex-col items-center">
          <RotatingDiamond size="md">
            <div className="mb-6 grid h-24 w-24 place-items-center rounded-full border border-[#1a1a1a]">
              <CameraIcon className="h-16 w-16 text-[#1a1a1a]" />
            </div>

            <p className="text-[13px] font-semibold uppercase tracking-[-0.02em]">
              {stage === "settingUp"
                ? "SETTING UP CAMERA ..."
                : "PREPARING YOUR ANALYSIS ..."}
            </p>
          </RotatingDiamond>

          <CameraGuidanceCopy />
        </div>
      </PageShell>
    );
  }

  if (stage === "live" || stage === "captured") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#d6d8d5] text-white">
        {stage === "live" ? (
          <video
            ref={videoRef}
            muted
            playsInline
            className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${capturedPreview})` }}
          />
        )}

        <div className="absolute inset-0 bg-black/10" />

        <header className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-7 py-5 md:px-8">
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-semibold uppercase tracking-[-0.02em]">
              SKINSTRIC
            </span>
            <span className="hidden text-[12px] font-semibold uppercase tracking-[-0.02em] text-white/70 md:block">
              [ ANALYSIS ]
            </span>
          </div>
        </header>

        {stage === "captured" && (
          <p className="absolute left-1/2 top-[23%] z-20 -translate-x-1/2 text-[12px] font-semibold uppercase tracking-[-0.02em]">
            GREAT SHOT!
          </p>
        )}

        {stage === "live" && (
          <button
            type="button"
            onClick={captureSelfie}
            className="absolute right-10 top-1/2 z-20 flex -translate-y-1/2 items-center gap-4 text-[12px] font-semibold uppercase tracking-[-0.02em] transition-opacity hover:opacity-70"
          >
            TAKE PICTURE
            <span className="grid h-12 w-12 place-items-center rounded-full border border-white">
              <CameraIcon className="h-7 w-7 text-white" />
            </span>
          </button>
        )}

        <div className="absolute bottom-24 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-6">
          <CameraGuidanceCopy tone="light" />
        </div>

        <BottomNav
          onBack={handleBack}
          onProceed={stage === "captured" ? analyzeSelfie : undefined}
          showBack
          showProceed={stage === "captured"}
          proceedLabel="PROCEED"
          className="text-white"
        />

        <canvas ref={canvasRef} className="hidden" />
      </div>
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
                <CameraIcon className="h-20 w-20 text-[#1a1a1a]" />
              </div>

              <div className="absolute left-19 top-10 h-px w-28 rotate-[-38deg] bg-[#1a1a1a]" />

              <p className="absolute left-38.75 top-17.5 w-44 text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em]">
                ALLOW A.I.
                <br />
                TO SCAN YOUR FACE
              </p>
            </div>
          </div>

          <div className="skinstric-permission-modal skinstric-fade-in-up">
            <p className="border-b border-white/30 px-5 py-5 text-[12px] font-semibold uppercase tracking-[-0.02em]">
              ALLOW A.I. TO ACCESS YOUR CAMERA
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
                onClick={startCamera}
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

      <BottomNav onBack={handleBack} showBack showProceed={false} />

      <canvas ref={canvasRef} className="hidden" />
      <video ref={videoRef} muted playsInline className="hidden" />
    </PageShell>
  );
}
