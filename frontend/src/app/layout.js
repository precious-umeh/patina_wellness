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
  title: {
    default: "Patina Wellness Solutions",
    template: "%s | Patina Wellness Solutions",
  },
  description:
    "Patina Wellness Solutions is a precision health and wellness consultancy dedicated to helping individuals and organizations achieve holistic wellbeing.",
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
