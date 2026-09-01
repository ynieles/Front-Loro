import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          <div>
            <Header />
          </div>

          <main className="flex-1 p-4 lg:px-8 pt-0">{children}</main>
          <Toaster />
        </div>
      </div>
    </ProtectedRoute>
  );
}
