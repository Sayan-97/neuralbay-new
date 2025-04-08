import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import "@nfid/identitykit/react/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ICP AI Marketplace",
  description:
    "Decentralized marketplace for AI models on the Internet Computer Protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
      <IdentityKitProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen glossy-bg">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
        </IdentityKitProvider>
      </body>
    </html>
  );
}
