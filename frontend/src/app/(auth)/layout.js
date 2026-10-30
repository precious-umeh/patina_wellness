export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      {children}
    </main>
  );
}
