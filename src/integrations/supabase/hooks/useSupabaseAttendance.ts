import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Attendance, AttendanceSummary, Child } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import { MedicalCheckData } from "@/types/checkin";

export const useSupabaseAttendance = (currentSunday: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      return data.map(record => ({
        id: record.id,
        childId: record.child_id,
        childName: record.child_name,
        ageGroup: record.age_group,
        category: record.category,
        date: record.date,
        program: record.program,
        status: record.status,
        uniqueCode: record.unique_code,
        checkedBy: record.checked_by,
        medicalCheck: {
          temperature: record.temperature_check,
          noSymptoms: record.no_symptoms_check,
          goodCondition: record.good_condition_check,
        },
        checkedInAt: record.checked_in_at,
        isFirstAttendance: record.is_first_attendance,
      })) as Attendance[];
    },
  });

  const { data: summaries = {} } = useQuery({
    queryKey: ["attendance_summaries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance_summaries")
        .select("*");

      if (error) throw error;

      const summariesMap: Record<string, AttendanceSummary> = {};
      data.forEach(summary => {
        summariesMap[summary.date] = {
          date: summary.date,
          totalP1: summary.total_p1,
          totalP2: summary.total_p2,
          total: summary.total,
          newChildrenCount: summary.new_children_count,
          byAgeGroup: {
            '0-1': { P1: summary.age_group_0_1_p1, P2: summary.age_group_0_1_p2, total: summary.age_group_0_1_p1 + summary.age_group_0_1_p2 },
            '1-2': { P1: summary.age_group_1_2_p1, P2: summary.age_group_1_2_p2, total: summary.age_group_1_2_p1 + summary.age_group_1_2_p2 },
            '2-3': { P1: summary.age_group_2_3_p1, P2: summary.age_group_2_3_p2, total: summary.age_group_2_3_p1 + summary.age_group_2_3_p2 },
            '4-6': { P1: summary.age_group_4_6_p1, P2: summary.age_group_4_6_p2, total: summary.age_group_4_6_p1 + summary.age_group_4_6_p2 },
            '7-12': { P1: summary.age_group_7_12_p1, P2: summary.age_group_7_12_p2, total: summary.age_group_7_12_p1 + summary.age_group_7_12_p2 },
          },
          byCategory: {
            Membru: summary.category_membru,
            Guest: summary.category_guest,
          },
        };
      });

      return summariesMap;
    },
  });

  const checkInChildMutation = useMutation({
    mutationFn: async ({ 
      child, 
      program, 
      medicalCheck,
      isFirstAttendance,
      uniqueCode 
    }: { 
      child: Child; 
      program: "P1" | "P2"; 
      medicalCheck: MedicalCheckData;
      isFirstAttendance: boolean;
      uniqueCode: string;
    }) => {
      const { data, error } = await supabase
        .from("attendance")
        .insert({
          child_id: child.id,
          child_name: child.fullName,
          age_group: child.ageGroup,
          category: child.category,
          date: currentSunday,
          program,
          status: "P",
          unique_code: uniqueCode,
          checked_by: "Current User",
          temperature_check: medicalCheck.temperature,
          no_symptoms_check: medicalCheck.noSymptoms,
          good_condition_check: medicalCheck.goodCondition,
          checked_in_at: new Date().toISOString(),
          is_first_attendance: isFirstAttendance,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance_summaries"] });
    },
  });

  const updateSummaryMutation = useMutation({
    mutationFn: async (summary: AttendanceSummary) => {
      const { data: existing } = await supabase
        .from("attendance_summaries")
        .select("id")
        .eq("date", summary.date)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("attendance_summaries")
          .update({
            total_p1: summary.totalP1,
            total_p2: summary.totalP2,
            total: summary.total,
            new_children_count: summary.newChildrenCount,
            age_group_0_1_p1: summary.byAgeGroup['0-1'].P1,
            age_group_0_1_p2: summary.byAgeGroup['0-1'].P2,
            age_group_1_2_p1: summary.byAgeGroup['1-2'].P1,
            age_group_1_2_p2: summary.byAgeGroup['1-2'].P2,
            age_group_2_3_p1: summary.byAgeGroup['2-3'].P1,
            age_group_2_3_p2: summary.byAgeGroup['2-3'].P2,
            age_group_4_6_p1: summary.byAgeGroup['4-6'].P1,
            age_group_4_6_p2: summary.byAgeGroup['4-6'].P2,
            age_group_7_12_p1: summary.byAgeGroup['7-12'].P1,
            age_group_7_12_p2: summary.byAgeGroup['7-12'].P2,
            category_membru: summary.byCategory.Membru,
            category_guest: summary.byCategory.Guest,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("attendance_summaries")
          .insert({
            date: summary.date,
            total_p1: summary.totalP1,
            total_p2: summary.totalP2,
            total: summary.total,
            new_children_count: summary.newChildrenCount,
            age_group_0_1_p1: summary.byAgeGroup['0-1'].P1,
            age_group_0_1_p2: summary.byAgeGroup['0-1'].P2,
            age_group_1_2_p1: summary.byAgeGroup['1-2'].P1,
            age_group_1_2_p2: summary.byAgeGroup['1-2'].P2,
            age_group_2_3_p1: summary.byAgeGroup['2-3'].P1,
            age_group_2_3_p2: summary.byAgeGroup['2-3'].P2,
            age_group_4_6_p1: summary.byAgeGroup['4-6'].P1,
            age_group_4_6_p2: summary.byAgeGroup['4-6'].P2,
            age_group_7_12_p1: summary.byAgeGroup['7-12'].P1,
            age_group_7_12_p2: summary.byAgeGroup['7-12'].P2,
            category_membru: summary.byCategory.Membru,
            category_guest: summary.byCategory.Guest,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance_summaries"] });
    },
  });

  const getAttendanceForDate = (date: string) => {
    return attendance.filter((a: Attendance) => a.date === date);
  };

  const getAttendanceForChild = (childId: string) => {
    return attendance.filter((a: Attendance) => a.childId === childId);
  };

  const getAttendanceSummaryForDate = (date: string) => {
    return summaries[date];
  };

  const getTotalPresentToday = () => {
    const todaySummary = summaries[currentSunday];
    if (!todaySummary) {
      return { totalP1: 0, totalP2: 0, total: 0, newChildren: 0 };
    }
    return {
      totalP1: todaySummary.totalP1,
      totalP2: todaySummary.totalP2,
      total: todaySummary.total,
      newChildren: todaySummary.newChildrenCount || 0
    };
  };

  const sundays = Object.keys(summaries).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return {
    attendance,
    summaries,
    sundays,
    checkInChild: checkInChildMutation.mutate,
    updateSummary: updateSummaryMutation.mutate,
    getAttendanceForDate,
    getAttendanceForChild,
    getAttendanceSummaryForDate,
    getTotalPresentToday,
  };
};
