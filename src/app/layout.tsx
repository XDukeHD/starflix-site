import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/ui/StarBackground";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "StarFlix | O Universo do Cinema em Suas Mãos",
  description: "Assista aos melhores filmes e séries no StarFlix. O streaming com as estrelas.",
  keywords: ["filmes", "séries", "streaming", "starflix", "cinema"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <StarBackground />
        <ClientLayout>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
