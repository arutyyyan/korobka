import { useCallback, useEffect, useMemo, useState } from "react";

import { enrollInCourse, fetchUserEnrollments, type EnrollmentRecord } from "@/api/enroll";
import type { AuthContextValue } from "@/contexts/auth-context";
import { useAuth } from "@/hooks/use-auth";

type UseEnrollmentsResult = {
  userId: string | null;
  user: AuthContextValue["user"];
  enrollments: EnrollmentRecord[];
  enrollmentMap: Record<string, EnrollmentRecord>;
  loading: boolean;
  enrolling: boolean;
  enroll: (courseSlug: string) => Promise<EnrollmentRecord>;
  refresh: () => Promise<void>;
};

export const useEnrollments = (): UseEnrollmentsResult => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const userId = user?.id ?? null;

  const fetchData = useCallback(async () => {
    if (!userId) {
      setEnrollments([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchUserEnrollments(userId);
      setEnrollments(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const enrollmentMap = useMemo(() => {
    return enrollments.reduce<Record<string, EnrollmentRecord>>((acc, record) => {
      acc[record.course_slug] = record;
      return acc;
    }, {});
  }, [enrollments]);

  const handleEnroll = useCallback(
    async (courseSlug: string) => {
      if (!userId) {
        throw new Error("Авторизуйтесь, чтобы записаться на курс");
      }
      setEnrolling(true);
      try {
        const record = await enrollInCourse(userId, courseSlug);
        setEnrollments((prev) => {
          const next = prev.filter((item) => item.course_slug !== courseSlug);
          next.unshift(record);
          return next;
        });
        return record;
      } finally {
        setEnrolling(false);
      }
    },
    [userId],
  );

  return {
    userId,
    user,
    enrollments,
    enrollmentMap,
    loading,
    enrolling,
    enroll: handleEnroll,
    refresh: fetchData,
  };
};

