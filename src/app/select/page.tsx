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
        "group relative grid h-80 w-[320px] place-items-center md:h-105 md:w-105",
        isCamera ? "lg:-translate-x-8" : "lg:translate-x-8",
      ].join(" ")}
    >
      <span className="diamond-frame rotate-slow w-[320px] opacity-80 md:w-105" />
      <span className="diamond-frame rotate-medium w-70 opacity-80 md:w-90" />
      <span className="diamond-frame rotate-fast w-60 opacity-80 md:w-75" />

      <div className="relative z-10 grid place-items-center">
        <div className="grid h-24 w-24 place-items-center rounded-full border border-[#1a1a1a] transition-transform duration-300 group-hover:scale-105 md:h-28 md:w-28">
          <Image
            src={
              isCamera
                ? "/assets/icons/camera-aperture.svg"
                : "/assets/icons/gallery-icon.svg"
            }
            alt=""
            width={96}
            height={96}
            className="h-20 w-20 object-contain md:h-24 md:w-24"
            aria-hidden="true"
          />
        </div>

        <div
          className={[
            "absolute hidden h-px w-24 bg-[#1a1a1a] md:block",
            isCamera
              ? "left-17.5 top-8.75 rotate-[-38deg] md:left-20.5 md:top-9.5"
              : "right-17.5 top-21.25 rotate-[-38deg] md:right-20.5 md:top-23.5",
          ].join(" ")}
        />

        <p
          className={[
            "absolute w-40 text-[11px] font-semibold uppercase leading-snug tracking-[-0.02em] text-[#1a1a1a]",
            isCamera
              ? "left-33.75 top-16 text-left md:left-38.75 md:top-18"
              : "right-33.75 top-28 text-right md:right-38.75 md:top-32",
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
      <section className="relative min-h-[calc(100vh-6rem)]">
        <div className="absolute left-0 top-0">
          <p className="skinstric-label">TO START ANALYSIS</p>
        </div>

        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <div className="grid w-full max-w-6xl place-items-center gap-10 lg:grid-cols-2 lg:gap-24">
            <AccessOption href={ROUTES.camera} type="camera" />
            <AccessOption href={ROUTES.upload} type="gallery" />
          </div>
        </div>
      </section>

      <BottomNav backHref={ROUTES.testing} showBack showProceed={false} />
    </PageShell>
  );
}
