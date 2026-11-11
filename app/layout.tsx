import type { Metadata, Viewport } from "next";
import "./legacy.css";
import "./app.css";
import SiteRuntime from "@/components/SiteRuntime";

export const metadata: Metadata = {
  metadataBase: new URL("https://metaversalsolution.com"),
  title: "Metaversal Solutions | AI-First Software & Innovation Studio in Karachi",
  description:
    "Metaversal Solutions builds web and mobile apps, cloud data platforms, DevOps, UI/UX, 3D and AI/ML systems for ambitious businesses. One crew from idea to launch, based in Karachi, Pakistan.",
  icons: { icon: "/brand/favicon.ico", apple: "/brand/apple-icon.png" },
  openGraph: {
    title: "Metaversal Solutions | AI-First Software & Innovation Studio",
    description:
      "One crew from first sketch to production and beyond. Cloud data, DevOps, web, apps, design, 3D and AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0704",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteRuntime />
      </body>
    </html>
  );
}
