import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CourseFormValues } from "./CourseDetailsPage.types";
import { DynamicArrayField } from "./CourseDetailsPage.components";

type CourseMarketingFormProps = {
  control: Control<CourseFormValues>;
};

export const CourseMarketingForm = ({ control }: CourseMarketingFormProps) => {
  return (
    <div className="pt-4 border-t space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Маркетинг курса</h3>
        <p className="text-sm text-muted-foreground">
          Информация для карточек курса и страницы.
        </p>
      </div>

      <FormField
        control={control}
        name="result"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Результат курса</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Быстро собирать MVP без кода"
                rows={2}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Длительность</FormLabel>
              <FormControl>
                <Input
                  placeholder="3 часа 10 минут"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сложность</FormLabel>
              <Select
                value={
                  field.value !== undefined && field.value !== null
                    ? String(field.value)
                    : ""
                }
                onValueChange={(value) => {
                  if (value && value.trim() !== "") {
                    const numValue = parseInt(value, 10);
                    field.onChange(isNaN(numValue) ? undefined : numValue);
                  } else {
                    field.onChange(undefined);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите сложность" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">
                    Очень легко (🟢⚪️⚪️⚪️⚪️)
                  </SelectItem>
                  <SelectItem value="2">Легко (🟢🟢⚪️⚪️⚪️)</SelectItem>
                  <SelectItem value="3">Средне (🟢🟢🟢⚪️⚪️)</SelectItem>
                  <SelectItem value="4">Сложно (🟢🟢🟢🟢⚪️)</SelectItem>
                  <SelectItem value="5">Очень сложно (🟢🟢🟢🟢🟢)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <DynamicArrayField
        control={control}
        name="tools"
        label="Инструменты"
        placeholder="Make, OpenAI, Telegram"
        addButtonLabel="Добавить инструмент"
      />

      <DynamicArrayField
        control={control}
        name="skills"
        label="Вы научитесь (до 3 пунктов)"
        placeholder="Проектировать MVP"
        addButtonLabel="Добавить пункт"
        maxItems={3}
      />

      <DynamicArrayField
        control={control}
        name="program"
        label="Программа курса (уроки/модули)"
        placeholder="Введение, Поиск проблемы..."
        addButtonLabel="Добавить урок"
      />
    </div>
  );
};
