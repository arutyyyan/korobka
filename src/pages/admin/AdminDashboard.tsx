import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout
      title="Админ-панель"
      description="Управляйте курсами и студентами"
      actions={
        <Button onClick={() => navigate("/admin/courses/new")}>Создать курс</Button>
      }
    >
      <div className="grid gap-6">
        <section className="rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Обзор</h2>
          <p className="text-sm text-muted-foreground">Здесь появится статистика по платформе.</p>
        </section>

        <section className="rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <p className="font-medium">Новый урок</p>
              <p className="text-sm text-muted-foreground mb-4">Добавьте материалы или задания</p>
              <Button size="sm" onClick={() => navigate("/admin/courses/new")}>
                Создать
              </Button>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-medium">Запись студента</p>
              <p className="text-sm text-muted-foreground mb-4">Добавьте новых участников курса</p>
              <Button size="sm" variant="outline">
                Добавить
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Последние события</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Здесь появится лента активности</span>
              <Separator orientation="vertical" className="h-4 hidden md:block" />
            </div>
            <p>Добавьте действия пользователей, обновления курсов и т.д.</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

