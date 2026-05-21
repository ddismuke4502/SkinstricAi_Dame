export const ROUTES = {
  home: "/",
  testing: "/testing",
  select: "/select",
  upload: "/upload",
  camera: "/camera",
  demographics: "/demographics",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];