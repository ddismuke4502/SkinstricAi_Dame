import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import PageShell from "@/components/layout/PageShell";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";

type AccessOptionProps = {
  href: string;
  type: "camera" | "gallery";
};

function AccessOption({ href, type }: AccessOptionProps) {
  const isCamera = type === "camera";

  return (
    <Link
      href={href}
      className={[
        "skinstric-access-option skinstric-fade-in-up group",
        isCamera ? "lg:-translate-x-8" : "lg:translate-x-8",
      ].join(" ")}
    >
      <span className="diamond-frame rotate-slow w-65 md:w-[320px] lg:w-105" />
      <span className="diamond-frame rotate-medium w-55 md:w-70 lg:w-90" />
      <span className="diamond-frame rotate-fast w-45 md:w-60 lg:w-75" />

      <div className="relative z-10 grid place-items-center">
        <div className="skinstric-access-icon-shell">
          <Image
            src={
              isCamera
                ? "/assets/icons/camera-aperture.svg"
                : "/assets/icons/gallery-icon.svg"
            }
            alt=""
            width={96}
            height={96}
            className={[
              "object-contain",
              isCamera
                ? "h-20 w-20 md:h-24 md:w-24"
                : "h-18 w-18 opacity-60 md:h-22 md:w-22",
            ].join(" ")}
            aria-hidden="true"
          />
        </div>

        <div
          className={[
            "skinstric-access-line hidden md:block",
            isCamera
              ? "left-17.5 top-8.75 rotate-[-38deg] md:left-20.5 md:top-9.5"
              : "right-17.5 top-21.25 rotate-[-38deg] md:right-20.5 md:top-23.5",
          ].join(" ")}
        />

        <p
          className={[
            "skinstric-access-label",
            isCamera
              ? "md:left-33.75 md:top-16 md:text-left lg:left-38.75 lg:top-18"
              : "md:right-33.75 md:top-28 md:text-right lg:right-38.75 lg:top-32",
          ].join(" ")}
        >
          {isCamera ? (
            <>
              ALLOW A.I.
              <br />
              TO SCAN YOUR FACE
            </>
          ) : (
            <>
              ALLOW A.I.
              <br />
              ACCESS GALLERY
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

export default function SelectPage() {
  return (
    <PageShell contentClassName="min-h-screen px-7 pt-24 md:px-8">
      <section className="skinstric-content-enter relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0 z-20">
          <p className="skinstric-label">TO START ANALYSIS</p>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <div className="skinstric-access-grid">
            <AccessOption href={ROUTES.camera} type="camera" />
            <AccessOption href={ROUTES.upload} type="gallery" />
          </div>
        </div>
      </section>

      <BottomNav backHref={ROUTES.testing} showBack showProceed={false} />
    </PageShell>
  );
}
