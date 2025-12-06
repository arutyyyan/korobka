import { type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const AdminLayout = ({ title, description, actions, children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col w-full">
        <div className="bg-white flex flex-col flex-1">
          <div className="flex-1 flex flex-col h-[100dvh]">
            <div className="flex-1 grid lg:grid-cols-[320px_1fr] gap-0 min-h-0">
              <AdminSidebar />
              <section className="flex flex-col min-h-0 bg-white">
                <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between bg-white">
                  <div>
                    <h1 className="text-xl font-semibold">{title}</h1>
                    {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
                  </div>
                  {actions}
                </div>
                <main className="flex-1 overflow-y-auto scrollbar-hide p-6">
                  {children}
                </main>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;



