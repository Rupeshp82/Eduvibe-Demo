import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduVibe",
  description: "A social network for students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
