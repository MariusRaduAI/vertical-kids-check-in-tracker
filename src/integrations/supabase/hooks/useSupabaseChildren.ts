import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Child } from "@/types/models";
import { useToast } from "@/hooks/use-toast";
import { differenceInYears, differenceInDays, parseISO } from "date-fns";

// Helper to calculate age and days until birthday
const calculateAge = (birthDate: string): { age: number; daysUntilBirthday: number } => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const age = differenceInYears(today, birth);
  
  const nextBirthday = new Date(birth);
  nextBirthday.setFullYear(today.getFullYear());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const daysUntilBirthday = differenceInDays(nextBirthday, today);
  
  return { age, daysUntilBirthday };
};

// Helper to determine age group
const getAgeGroup = (age: number): Child["ageGroup"] => {
  if (age < 1) return '0-1';
  if (age < 2) return '1-2';
  if (age < 3) return '2-3';
  if (age < 7) return '4-6';
  return '7-12';
};

export const useSupabaseChildren = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .order("full_name");

      if (error) throw error;
      
      return data.map(child => ({
        id: child.id,
        firstName: child.first_name,
        lastName: child.last_name,
        fullName: child.full_name,
        birthDate: child.birth_date,
        age: child.age,
        daysUntilBirthday: child.days_until_birthday,
        ageGroup: child.age_group as Child["ageGroup"],
        category: child.category as Child["category"],
        parents: child.parents,
        phone: child.phone,
        email: child.email,
        loveLanguage: child.love_language,
        profile: child.profile,
        isNew: child.is_new,
        firstAttendanceDate: child.first_attendance_date,
        createdAt: child.created_at,
        updatedAt: child.updated_at,
      })) as Child[];
    },
  });

  const addChildMutation = useMutation({
    mutationFn: async (childData: Omit<Child, "id" | "createdAt" | "updatedAt">) => {
      const { age, daysUntilBirthday } = calculateAge(childData.birthDate);
      const ageGroup = getAgeGroup(age);

      const { data, error } = await supabase
        .from("children")
        .insert({
          first_name: childData.firstName,
          last_name: childData.lastName,
          full_name: childData.fullName,
          birth_date: childData.birthDate,
          age,
          days_until_birthday: daysUntilBirthday,
          age_group: ageGroup,
          category: childData.category,
          parents: childData.parents,
          phone: childData.phone,
          email: childData.email,
          love_language: childData.loveLanguage,
          profile: childData.profile,
          is_new: childData.isNew,
          first_attendance_date: childData.firstAttendanceDate,
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: data.full_name,
        birthDate: data.birth_date,
        age: data.age,
        daysUntilBirthday: data.days_until_birthday,
        ageGroup: data.age_group as Child["ageGroup"],
        category: data.category as Child["category"],
        parents: data.parents,
        phone: data.phone,
        email: data.email,
        loveLanguage: data.love_language,
        profile: data.profile,
        isNew: data.is_new,
        firstAttendanceDate: data.first_attendance_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Child;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast({
        title: "Copil adăugat",
        description: `${data.fullName} a fost adăugat cu succes.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Child> }) => {
      const updateData: any = {};
      
      if (data.firstName) updateData.first_name = data.firstName;
      if (data.lastName) updateData.last_name = data.lastName;
      if (data.fullName) updateData.full_name = data.fullName;
      if (data.birthDate) {
        updateData.birth_date = data.birthDate;
        const { age, daysUntilBirthday } = calculateAge(data.birthDate);
        updateData.age = age;
        updateData.days_until_birthday = daysUntilBirthday;
        updateData.age_group = getAgeGroup(age);
      }
      if (data.category) updateData.category = data.category;
      if (data.parents) updateData.parents = data.parents;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.loveLanguage !== undefined) updateData.love_language = data.loveLanguage;
      if (data.profile !== undefined) updateData.profile = data.profile;
      if (data.isNew !== undefined) updateData.is_new = data.isNew;
      if (data.firstAttendanceDate !== undefined) updateData.first_attendance_date = data.firstAttendanceDate;

      const { data: updated, error } = await supabase
        .from("children")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: updated.id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        fullName: updated.full_name,
        birthDate: updated.birth_date,
        age: updated.age,
        daysUntilBirthday: updated.days_until_birthday,
        ageGroup: updated.age_group as Child["ageGroup"],
        category: updated.category as Child["category"],
        parents: updated.parents,
        phone: updated.phone,
        email: updated.email,
        loveLanguage: updated.love_language,
        profile: updated.profile,
        isNew: updated.is_new,
        firstAttendanceDate: updated.first_attendance_date,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      } as Child;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast({
        title: "Copil actualizat",
        description: `${data.fullName} a fost actualizat cu succes.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getChildById = (id: string) => {
    return children.find((c: Child) => c.id === id);
  };

  const searchChildren = (query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return children.filter(
      (child: Child) =>
        child.fullName.toLowerCase().includes(lowerQuery) ||
        child.firstName.toLowerCase().includes(lowerQuery) ||
        child.lastName.toLowerCase().includes(lowerQuery)
    );
  };

  const addChild = (childData: Omit<Child, "id" | "createdAt" | "updatedAt">): Child => {
    addChildMutation.mutate(childData);
    // Return a temporary child object while the mutation is pending
    return {
      ...childData,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const updateChild = (id: string, data: Partial<Child>): Child => {
    updateChildMutation.mutate({ id, data });
    // Return the updated child optimistically
    const existingChild = getChildById(id);
    return existingChild ? { ...existingChild, ...data } : ({} as Child);
  };

  return {
    children,
    isLoading,
    setChildren: () => {}, // Not used with Supabase
    addChild,
    updateChild,
    getChildById,
    searchChildren,
  };
};
