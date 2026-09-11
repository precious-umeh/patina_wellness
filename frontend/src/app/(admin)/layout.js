import AdminLayoutShell from "../components/admin/layout/AdminLayoutShell";
import AdminGuard from "../components/auth/AdminGuard";

export const metadata = {
  title: "Admin Dashboard | Patina Wellness Solutions",
  description: "Management dashboard for Patina Wellness Solutions.",
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-dvh w-full">
        <AdminLayoutShell>{children}</AdminLayoutShell>
      </div>
    </AdminGuard>
  );
}
