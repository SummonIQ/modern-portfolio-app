import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <AdminShell
      userEmail={session.user.email}
      userName={session.user.name ?? session.user.email}
    >
      {children}
    </AdminShell>
  );
}
