import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import ScrollToTop from "../components/shared/ScrollToTop";

export default function MainLayout({children}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <ScrollToTop />
    </div>
  )
}