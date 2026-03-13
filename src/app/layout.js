import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Starky's Portfolio – The Compound",
  description:
    "An FPS-themed interactive portfolio. Enter the compound, scan targets, and discover projects, skills, and achievements in a Counter-Strike inspired training map.",
  keywords: ["portfolio", "FPS", "interactive", "Three.js", "React", "Next.js", "Web3"],
  authors: [{ name: "Starky" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistMono.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
