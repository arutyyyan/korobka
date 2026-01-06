import { type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const SIDEBAR_WIDTH = 320; // та же ширина, что в grid

const AdminLayout = ({
  title,
  description,
  actions,
  children,
}: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Фиксированный sidebar */}
      <div
        className="hidden lg:block border-r border-border/40 bg-white"
        style={{
          position: "fixed",
          insetBlock: 0, // top:0; bottom:0;
          insetInlineStart: 0, // left:0;
          width: SIDEBAR_WIDTH,
          backgroundColor: "#F8FAFC",
        }}
      >
        <AdminSidebar />
      </div>

      {/* Контент справа */}
      <div className="flex min-h-screen">
        {/* Отступ под сайдбар на десктопе */}
        <div className="hidden lg:block" style={{ width: SIDEBAR_WIDTH }} />

        <section className="flex flex-1 flex-col bg-white">
          <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between bg-white">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              {description ? (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              ) : null}
            </div>
            {actions}
          </div>

          <main className="flex-1 overflow-y-auto scrollbar-hide p-6">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
