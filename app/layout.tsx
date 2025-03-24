import { Manrope } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import { Metadata } from "next";
import ScrollToTop from "@/components/frontend/ScrollToTop";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Airbnb Rental Management",
  description: "Airbnb Rental management for managing rentals",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} `}>
      <ReactQueryProvider>

        <Providers>{children}

        <ScrollToTop/>

        </Providers>
        </ReactQueryProvider>

      </body>
    </html>
  );
}
