import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

type Direction = {
  id: string;
  title: string;
};

type Course = {
  slug: string;
  title: string;
};

type CourseGroup = {
  id: string;
  direction_id: string;
  title: string;
  subtitle: string | null;
  order_in_direction: number;
  course_slugs: string[];
  created_at: string;
  updated_at: string;
};

const fetchCourseGroups = async (): Promise<CourseGroup[]> => {
  const { data, error } = await supabase
    .from("course_groups")
    .select("*")
    .order("direction_id", { ascending: true })
    .order("order_in_direction", { ascending: true });
  if (error) {
    throw error;
  }
  return data ?? [];
};

const fetchDirections = async (): Promise<Direction[]> => {
  const { data, error } = await supabase
    .from("directions")
    .select("id, title")
    .order("order_default", { ascending: true });
  if (error) {
    throw error;
  }
  return data ?? [];
};

const fetchCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("slug, title")
    .order("title", { ascending: true });
  if (error) {
    throw error;
  }
  return data ?? [];
};

const CourseGroupsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CourseGroup | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<CourseGroup | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    direction_id: "",
    order_in_direction: 0,
    course_slugs: [] as string[],
  });

  const {
    data: courseGroups = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-course-groups"],
    queryFn: fetchCourseGroups,
  });

  const { data: directions = [] } = useQuery({
    queryKey: ["admin-directions"],
    queryFn: fetchDirections,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses-for-groups"],
    queryFn: fetchCourses,
  });

  const directionsMap = useMemo(() => {
    return new Map(directions.map((d) => [d.id, d.title]));
  }, [directions]);

  const createMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      subtitle: string | null;
      direction_id: string;
      order_in_direction: number;
      course_slugs: string[];
    }) => {
      const { error } = await supabase.from("course_groups").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-groups"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Группа создана",
        description: "Новая группа курсов успешно добавлена.",
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
      data: {
        title: string;
        subtitle: string | null;
        direction_id: string;
        order_in_direction: number;
        course_slugs: string[];
      };
    }) => {
      const { error } = await supabase
        .from("course_groups")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-groups"] });
      setIsDialogOpen(false);
      setEditingGroup(null);
      resetForm();
      toast({
        title: "Группа обновлена",
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
      const { error } = await supabase
        .from("course_groups")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-groups"] });
      setIsDeleteDialogOpen(false);
      setDeleteGroup(null);
      toast({
        title: "Группа удалена",
        description: "Группа курсов успешно удалена.",
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
      title: "",
      subtitle: "",
      direction_id: "",
      order_in_direction: 0,
      course_slugs: [],
    });
    setEditingGroup(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (group: CourseGroup) => {
    setEditingGroup(group);
    setFormData({
      title: group.title,
      subtitle: group.subtitle || null,
      direction_id: group.direction_id,
      order_in_direction: group.order_in_direction,
      course_slugs: group.course_slugs || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (group: CourseGroup) => {
    setDeleteGroup(group);
    setIsDeleteDialogOpen(true);
  };

  const handleCourseToggle = (slug: string) => {
    setFormData((prev) => {
      const newSlugs = prev.course_slugs.includes(slug)
        ? prev.course_slugs.filter((s) => s !== slug)
        : [...prev.course_slugs, slug];
      return { ...prev, course_slugs: newSlugs };
    });
  };

  const handleMoveCourse = (slug: string, direction: "up" | "down") => {
    setFormData((prev) => {
      const index = prev.course_slugs.indexOf(slug);
      if (index === -1) return prev;
      const newSlugs = [...prev.course_slugs];
      if (direction === "up" && index > 0) {
        [newSlugs[index - 1], newSlugs[index]] = [
          newSlugs[index],
          newSlugs[index - 1],
        ];
      } else if (direction === "down" && index < newSlugs.length - 1) {
        [newSlugs[index], newSlugs[index + 1]] = [
          newSlugs[index + 1],
          newSlugs[index],
        ];
      }
      return { ...prev, course_slugs: newSlugs };
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Название группы обязательно для заполнения",
        variant: "destructive",
      });
      return;
    }
    if (!formData.subtitle.trim()) {
      toast({
        title: "Ошибка",
        description: "Результат обязательно для заполнения",
        variant: "destructive",
      });
      return;
    }
    if (!formData.direction_id) {
      toast({
        title: "Ошибка",
        description: "Выберите направление",
        variant: "destructive",
      });
      return;
    }

    const data = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || null,
      direction_id: formData.direction_id,
      order_in_direction: formData.order_in_direction,
      course_slugs: formData.course_slugs,
    };

    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const hasGroups = useMemo(
    () => courseGroups.length > 0,
    [courseGroups.length]
  );

  return (
    <AdminLayout
      title="Группы курсов"
      description="Управление группами курсов для роадмапа"
      actions={
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Создать группу
        </Button>
      }
    >
      <div className="space-y-6">
        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Не удалось загрузить группы курсов</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Попробуйте обновить страницу чуть позже."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="rounded-2xl border bg-background shadow-sm">
          <div className="flex flex-col gap-2 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Все группы курсов</p>
              <p className="text-sm text-muted-foreground">
                Всего: {courseGroups.length}
              </p>
            </div>
          </div>

          <div className="p-4">
            {isLoading ? (
              <CourseGroupsTableSkeleton />
            ) : !hasGroups ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-base font-medium">Групп курсов пока нет</p>
                <p className="text-sm text-muted-foreground max-w-sm mt-2">
                  Создайте первую группу курсов для роадмапа.
                </p>
                <Button className="mt-6" onClick={handleCreate}>
                  Добавить группу
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название группы</TableHead>
                    <TableHead>Направление</TableHead>
                    <TableHead>Количество курсов</TableHead>
                    <TableHead>Порядок</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">
                        {group.title}
                      </TableCell>
                      <TableCell>
                        {directionsMap.get(group.direction_id) ||
                          group.direction_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {group.course_slugs?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>{group.order_in_direction}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(group)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(group)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Редактировать группу" : "Создать группу курсов"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup
                ? "Измените информацию о группе курсов."
                : "Заполните форму для создания новой группы курсов."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Название группы <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="ChatGPT, Автоматизация, Вайб-кодинг..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">
                Результат <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Собираем MVP без кода..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direction_id">
                Направление <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.direction_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, direction_id: value })
                }
              >
                <SelectTrigger id="direction_id">
                  <SelectValue placeholder="Выберите направление" />
                </SelectTrigger>
                <SelectContent>
                  {directions.map((direction) => (
                    <SelectItem key={direction.id} value={direction.id}>
                      {direction.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_in_direction">
                Порядок внутри направления
              </Label>
              <Input
                id="order_in_direction"
                type="number"
                value={formData.order_in_direction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_in_direction: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Список курсов группы</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Курсы не найдены
                  </p>
                ) : (
                  <div className="space-y-3">
                    {formData.course_slugs.length > 0 && (
                      <div className="border-b pb-2 mb-2">
                        <p className="text-sm font-medium mb-2">
                          Выбранные курсы (порядок):
                        </p>
                        <div className="space-y-1">
                          {formData.course_slugs.map((slug, index) => {
                            const course = courses.find((c) => c.slug === slug);
                            return (
                              <div
                                key={slug}
                                className="flex items-center gap-2 p-2 bg-muted rounded text-sm"
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <span className="flex-1">
                                  {course?.title || slug}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleMoveCourse(slug, "up")}
                                    disabled={index === 0}
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      handleMoveCourse(slug, "down")
                                    }
                                    disabled={
                                      index === formData.course_slugs.length - 1
                                    }
                                  >
                                    ↓
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <p className="text-sm font-medium">Все курсы:</p>
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <div
                          key={course.slug}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`course-${course.slug}`}
                            checked={formData.course_slugs.includes(
                              course.slug
                            )}
                            onCheckedChange={() =>
                              handleCourseToggle(course.slug)
                            }
                          />
                          <Label
                            htmlFor={`course-${course.slug}`}
                            className="font-normal cursor-pointer flex-1"
                          >
                            {course.title}
                          </Label>
                          <code className="text-xs text-muted-foreground">
                            {course.slug}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Выбранные курсы будут отображаться в указанном порядке в
                роадмапе.
              </p>
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
              {editingGroup ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить группу курсов?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить группу "{deleteGroup?.title}"? Это
              действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteGroup && deleteMutation.mutate(deleteGroup.id)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

const CourseGroupsTableSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="grid gap-3 rounded-xl border p-4 sm:grid-cols-5"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24 sm:justify-self-end" />
        </div>
      ))}
    </div>
  );
};

export default CourseGroupsPage;

