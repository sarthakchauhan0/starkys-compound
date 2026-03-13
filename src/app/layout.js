import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
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
    <html lang="en">
      <body className={`${quicksand.variable} antialiased bg-[#fffdf2] text-[#2c3e50]`}>
        {children}
      </body>
    </html>
  );
}
