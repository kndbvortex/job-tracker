import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Job Tracker",
    short_name: "Job Tracker",
    description: "A case file for your job search: track applications from saved to offer.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FBF9F3",
    theme_color: "#1B1B18",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
