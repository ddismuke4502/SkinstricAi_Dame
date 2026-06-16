# SkinstricAi_Dame

A Skinstric-inspired AI skincare analysis web app built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **GSAP**. The project recreates a polished multi-step skincare analysis experience with image upload, camera capture, API-driven demographic analysis, responsive layouts, and animated UI transitions.

**Live Demo:** https://skinstric-ai-dame.vercel.app/

---

## Overview

SkinstricAi_Dame is a frontend-focused AI analysis experience that allows users to begin a skincare assessment, submit an image through upload or camera capture, and review AI-estimated demographic results.

The project emphasizes:

- Pixel-conscious implementation from Figma references
- Multi-step user flow
- Responsive desktop and mobile layouts
- API integration
- Local state persistence
- GSAP-powered motion polish
- Clean component structure
- Production deployment with Vercel

---

## Features

### Intro Flow

- Landing page with animated side navigation
- Interactive hover behavior for `DISCOVER A.I.` and `TAKE TEST`
- Smooth hero text alignment and slide transitions
- Name and location input flow
- Form validation before proceeding

### Image Analysis Flow

- User can choose between:
  - Uploading an image from gallery
  - Capturing an image using the device camera
- Custom permission-style modals
- Base64 image conversion
- API submission through a reusable API helper
- Loading and preparing-analysis states
- Camera preview, capture, retake, and proceed flow

### Demographics Result Flow

- AI-estimated race, age, and sex results
- Confidence scores sorted and displayed by category
- Interactive selection correction
- Reset functionality
- Confirm functionality
- Local storage persistence for analysis data and corrected selections

### Responsive UI

- Desktop layout closely follows provided Figma screens
- Custom mobile layouts for screens without mobile Figma references
- Mobile-safe permission modals
- Mobile-friendly demographics results layout
- Bottom navigation adapted across screen sizes

### Animation Polish

- GSAP landing hero hover animation
- GSAP analysis hub entrance animation
- GSAP demographics results reveal sequence
- GSAP upload flow polish
- GSAP camera flow polish
- Diamond button hover micro-interactions
- CSS rotating diamond frames
- Fade-in page/content transitions

---

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS, CSS utilities
- **Animation:** GSAP, CSS keyframes
- **State:** React state, localStorage
- **Browser APIs:** MediaDevices camera API, FileReader, Canvas
- **Deployment:** Vercel
- **Version Control:** Git / GitHub

---

## Project Structure

```txt
src
├── app
│   ├── analysis
│   ├── camera
│   ├── demographics
│   ├── select
│   ├── testing
│   ├── upload
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── layout
│   │   ├── AppHeader.tsx
│   │   ├── BottomNav.tsx
│   │   └── PageShell.tsx
│   └── ui
│       ├── DiamondButton.tsx
│       ├── ErrorMessage.tsx
│       ├── LoadingOverlay.tsx
│       ├── RotatingDiamond.tsx
│       └── SkinstricIcons.tsx
├── constants
│   └── routes.ts
├── lib
│   ├── api.ts
│   ├── demographics.ts
│   ├── image.ts
│   ├── storage.ts
│   └── validation.ts
└── types
    └── skinstric.ts
