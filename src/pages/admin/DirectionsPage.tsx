import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Direction = {
  id: string;
  title: string;
  description: string | null;
  order_default: number;
  created_at: string;
};

const fetchDirections = async (): Promise<Direction[]> => {
  const { data, error } = await supabase
    .from("directions")
    .select("*")
    .order("order_default", { ascending: true });
  if (error) {
    throw error;
  }
  return data ?? [];
};

const DirectionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
  const [deleteDirection, setDeleteDirection] = useState<Direction | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    order_default: 0,
  });

  const {
    data: directions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-directions"],
    queryFn: fetchDirections,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { id: string; title: string; description: string | null; order_default: number }) => {
      const { error } = await supabase.from("directions").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-directions"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Направление создано",
        description: "Новое направление успешно добавлено.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { title: string; description: string | null; order_default: number };
    }) => {
      const { error } = await supabase.from("directions").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-directions"] });
      setIsDialogOpen(false);
      setEditingDirection(null);
      resetForm();
      toast({
        title: "Направление обновлено",
        description: "Изменения успешно сохранены.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("directions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-directions"] });
      setIsDeleteDialogOpen(false);
      setDeleteDirection(null);
      toast({
        title: "Направление удалено",
        description: "Направление успешно удалено.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      order_default: 0,
    });
    setEditingDirection(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (direction: Direction) => {
    setEditingDirection(direction);
    setFormData({
      id: direction.id,
      title: direction.title,
      description: direction.description || "",
      order_default: direction.order_default,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (direction: Direction) => {
    setDeleteDirection(direction);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Название обязательно для заполнения",
        variant: "destructive",
      });
      return;
    }

    const data = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      order_default: formData.order_default,
    };

    if (editingDirection) {
      updateMutation.mutate({ id: editingDirection.id, data });
    } else {
      if (!formData.id.trim()) {
        toast({
          title: "Ошибка",
          description: "ID обязательно для заполнения",
          variant: "destructive",
        });
        return;
      }
      createMutation.mutate({ ...data, id: formData.id.trim() });
    }
  };

  const hasDirections = useMemo(() => directions.length > 0, [directions.length]);

  return (
    <AdminLayout
      title="Направления"
      description="Управление направлениями обучения"
      actions={
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Создать направление
        </Button>
      }
    >
      <div className="space-y-6">
        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Не удалось загрузить направления</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Попробуйте обновить страницу чуть позже."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="rounded-2xl border bg-background shadow-sm">
          <div className="flex flex-col gap-2 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Все направления</p>
              <p className="text-sm text-muted-foreground">Всего: {directions.length}</p>
            </div>
          </div>

          <div className="p-4">
            {isLoading ? (
              <DirectionsTableSkeleton />
            ) : !hasDirections ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-base font-medium">Направлений пока нет</p>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                  Создайте первое направление обучения.
                </p>
                <Button className="mt-6" onClick={handleCreate}>
                  Добавить направление
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Порядок</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directions.map((direction) => (
                    <TableRow key={direction.id}>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs">{direction.id}</code>
                      </TableCell>
                      <TableCell className="font-medium">{direction.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {direction.description || "—"}
                      </TableCell>
                      <TableCell>{direction.order_default}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(direction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(direction)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingDirection ? "Редактировать направление" : "Создать направление"}</DialogTitle>
            <DialogDescription>
              {editingDirection
                ? "Измените информацию о направлении."
                : "Заполните форму для создания нового направления."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">
                ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="general_ai"
                disabled={!!editingDirection}
                className="font-mono"
              />
              {!editingDirection && (
                <p className="text-xs text-muted-foreground">
                  Латиницей, без пробелов. Например: general_ai, automation
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">
                Название <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Общий ИИ и ChatGPT"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание направления..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_default">Порядок по умолчанию</Label>
              <Input
                id="order_default"
                type="number"
                value={formData.order_default}
                onChange={(e) => setFormData({ ...formData, order_default: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingDirection ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить направление?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить направление "{deleteDirection?.title}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDirection && deleteMutation.mutate(deleteDirection.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

const DirectionsTableSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24 sm:justify-self-end" />
        </div>
      ))}
    </div>
  );
};

export default DirectionsPage;









