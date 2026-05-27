import type { Metadata } from "next";
import { Gideon_Roman } from "next/font/google";

import SmoothScroll from "@/app/components/SmoothScroll";
import "./fonts.css";
import "./globals.css";
import Header from "@/app/components/Header";

const gideonRoman = Gideon_Roman({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gideon",
});

const siteTitle = "Yashwant Rao | AI focused Full Stack Engineer";
const siteDescription =
  "Portfolio of Yashwant Rao, an AI focused Full Stack Developer with 3+ years of experience building scalable web applications, AI powered products, modern UI/UX interfaces, and high performance full stack solutions using Next.js, React, Node.js, Django, Python, and AI technologies.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "en_US",
    siteName: "Yashwant Rao",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  keywords: [
    "Yashwant Rao",
    "Yashwant Rao portfolio",
    "Yashwant Rao full stack developer",
    "Yashwant Rao AI developer",
    "Yashwant Rao software engineer",
    "AI focused full stack developer",
    "full stack developer",
    "full stack engineer",
    "AI developer",
    "AI engineer",
    "web developer",
    "software developer",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "Python developer",
    "Django developer",
    "MERN stack developer",
    "frontend developer",
    "backend developer",
    "TypeScript developer",
    "JavaScript developer",
    "Three.js developer",
    "GSAP developer",
    "modern web developer",
    "scalable web applications",
    "AI powered web applications",
    "full stack web applications",
    "developer portfolio",
    "web developer portfolio",
    "software engineer portfolio",
    "AI portfolio website",
    "freelance full stack developer",
    "best full stack developer portfolio",
    "Next.js portfolio",
    "React portfolio website",
    "full stack developer India",
    "AI developer India",
    "Yashwant Rao Next.js developer",
    "Yashwant Rao React developer",
    "Yashwant Rao AI focused engineer"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gideonRoman.variable} ${gideonRoman.className} antialiased font-sans`}
    >
      <head>
        <link
          rel="preload"
          href="/font/1797.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/jjannon-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SmoothScroll>
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
