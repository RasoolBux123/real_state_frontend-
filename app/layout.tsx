import "./globals.css";
import SiteShell from "./components/SiteShell";
import AuthModal from "./components/AuthModal";

export const metadata = { title: "RealEstate", description: "Find your next property" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SiteShell>{children}</SiteShell>
        <AuthModal />
      </body>
    </html>
  );
}