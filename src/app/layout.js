import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata = {
  title: "Starky's Portfolio – The Compound",
  description:
    "Explore a sun-drenched Ghibli-style village as a curious cat. Follow winding paths, discover cozy houses, and interact with a world where every corner reveals a new project, skill, and achievement.",
  keywords: ["portfolio", "Ghibli-style", "interactive", "3D Game", "Cat Game", "Three.js", "React", "Next.js", "Creative Developer"],
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
