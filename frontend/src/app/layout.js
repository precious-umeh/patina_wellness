import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const inter = localFont({
  src: [
    {
      path: "../fonts/Inter-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://patinawellnesssolutions.com"),

  title: {
    default: "Patina Wellness Solutions",
    template: "%s | Patina Wellness Solutions",
  },
  description:
    "Patina Wellness Solutions is a precision health and wellness consultancy dedicated to helping individuals and organizations achieve holistic wellbeing.",

  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Patina Wellness Solutions",
    title: "Patina Wellness Solutions",
    description:
      "A precision health and wellness consultancy dedicated to helping individuals and organizations achieve holistic wellbeing.",
    images: [
      {
        url: "/og-image.png",
        alt: "Patina Wellness Solutions - wellness and wellbeing",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Patina Wellness Solutions",
    description:
      "A precision health and wellness consultancy dedicated to helping indiduals and organizations achieve holistic wellbeing",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-dvh font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
