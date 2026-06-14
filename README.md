# cWatch

A modern movie discovery platform built with Next.js, Bun, and Shadcn UI.

cWatch is more  a public showcase of my work, frontend design decisions,  architecture, and development practices. The project serves as both a functional movie platform and a living portfolio where I experiment with modern web technologies and user experiences.

## Preview 

<p align="center">
  <img src="/preview.png" width="75%" />
  <img src="/mobile-preview.png" width="25%" />
</p>

## Features

* Browse movies and tap to play
* Detailed movie information pages
* Smooth scrolling with Lenis
* Global state management with Redux Toolkit
* Component-driven architecture using Shadcn UI
* Optimized image loading and external assets


## Tech Stack

* Next.js
* Bun
* TypeScript
* Shadcn UI
* Redux Toolkit
* React Redux
* Lenis
* Tailwind CSS

---

## Setup

```bash
git clone https://github.com/cureerel/cwatch.github
```

Initialize Shadcn:

```bash
bunx --bun shadcn@latest init
```

Add components:

```bash
bunx --bun shadcn@latest add button
```

---

## Configuration

Update `next.config.ts` to allow external image domains used by movie APIs and CDN providers.

Example:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cureerel.com",
      },
    ],
  },
};

export default nextConfig;
```

---

## Project Goals

This project is built to:

* Explore frontend architecture
* Experiment with animations and interactions
* Practice scalable component design
* Share my development journey publicly
* Showcase production-ready code and UI craftsmanship

---

## Author

Built and maintained by [Cureerel](https://github.com/cureerel) • [Website](https://cureerel.com) • [Twitter](https://x.com/cureerel)


This repository is part of my public portfolio and serves as a demonstration of my approach to frontend engineering, design systems, and user experience.