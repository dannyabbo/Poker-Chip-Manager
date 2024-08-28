import React from "react";
import "@/app/globals.css";
import { Montserrat } from "next/font/google";
import "../fontawesome";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dim" className={montserrat.className}>
      <body>{children}</body>
    </html>
  );
}
