import type { Metadata } from "next";
import { Epilogue, Lexend } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-epilogue",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joyn — Move Together. Age with Joy!",
  description:
    "A matchmaking and virtual fitness platform for retired adults in Arizona. Combat loneliness through movement and human connection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${epilogue.variable} ${lexend.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
