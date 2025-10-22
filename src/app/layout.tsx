import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { RegisterSW } from "./register-sw";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Alpha Clean - Sistema de Agendamentos",
    template: "%s | Alpha Clean",
  },
  description:
    "Sistema de agendamento para serviços de lavagem automotiva. Agende sua lavagem de forma rápida e prática.",
  keywords: [
    "lavagem automotiva",
    "agendamento",
    "lava jato",
    "Alpha Clean",
    "serviços automotivos",
  ],
  authors: [{ name: "Alpha Clean Team" }],
  creator: "Alpha Clean",
  publisher: "Alpha Clean",
  applicationName: "AlphaClean",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AlphaClean",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://alphaclean.com.br",
    siteName: "Alpha Clean",
    title: "Alpha Clean - Sistema de Agendamentos",
    description:
      "Agende seus serviços de lavagem automotiva de forma prática e rápida.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alpha Clean - Sistema de Agendamentos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Clean - Sistema de Agendamentos",
    description:
      "Agende seus serviços de lavagem automotiva de forma prática e rápida.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#022744",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <RegisterSW />
        {children}

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          containerClassName="toast-container"
          containerStyle={{
            bottom: 24,
            right: 24,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--card-bg)",
              color: "var(--foreground)",
              border: "1px solid var(--card-border)",
              borderRadius: "12px",
              padding: "12px 16px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              maxWidth: "400px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "var(--accent)",
                secondary: "#fff",
              },
              style: {
                borderColor: "var(--accent)",
                background: "var(--card-bg)",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              style: {
                borderColor: "#ef4444",
                background: "var(--card-bg)",
              },
            },
            loading: {
              iconTheme: {
                primary: "var(--primary)",
                secondary: "#fff",
              },
              style: {
                borderColor: "var(--primary)",
                background: "var(--card-bg)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
