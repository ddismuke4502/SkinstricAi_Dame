export const ROUTES = {
  home: "/",
  testing: "/testing",
  select: "/select",
  upload: "/upload",
  camera: "/camera",
  analysis: "/analysis",
  demographics: "/demographics",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];