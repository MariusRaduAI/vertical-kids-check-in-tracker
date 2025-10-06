-- Create children table
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER NOT NULL,
  days_until_birthday INTEGER NOT NULL,
  age_group TEXT NOT NULL CHECK (age_group IN ('0-1', '1-2', '2-3', '4-6', '7-12')),
  category TEXT NOT NULL CHECK (category IN ('Membru', 'Guest')),
  parents TEXT[] NOT NULL DEFAULT '{}',
  phone TEXT,
  email TEXT,
  love_language TEXT,
  profile TEXT,
  is_new BOOLEAN DEFAULT false,
  first_attendance_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  program TEXT NOT NULL CHECK (program IN ('P1', 'P2')),
  status TEXT NOT NULL CHECK (status IN ('P', 'A')),
  unique_code TEXT,
  checked_by TEXT,
  temperature_check BOOLEAN DEFAULT false,
  no_symptoms_check BOOLEAN DEFAULT false,
  good_condition_check BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  is_first_attendance BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create attendance summaries table
CREATE TABLE public.attendance_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_p1 INTEGER NOT NULL DEFAULT 0,
  total_p2 INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  new_children_count INTEGER NOT NULL DEFAULT 0,
  age_group_0_1_p1 INTEGER DEFAULT 0,
  age_group_0_1_p2 INTEGER DEFAULT 0,
  age_group_1_2_p1 INTEGER DEFAULT 0,
  age_group_1_2_p2 INTEGER DEFAULT 0,
  age_group_2_3_p1 INTEGER DEFAULT 0,
  age_group_2_3_p2 INTEGER DEFAULT 0,
  age_group_4_6_p1 INTEGER DEFAULT 0,
  age_group_4_6_p2 INTEGER DEFAULT 0,
  age_group_7_12_p1 INTEGER DEFAULT 0,
  age_group_7_12_p2 INTEGER DEFAULT 0,
  category_membru INTEGER DEFAULT 0,
  category_guest INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all operations for now (will be restricted with auth later)
CREATE POLICY "Allow all access to children" ON public.children FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to summaries" ON public.attendance_summaries FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_children_full_name ON public.children(full_name);
CREATE INDEX idx_children_birth_date ON public.children(birth_date);
CREATE INDEX idx_attendance_child_id ON public.attendance(child_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_attendance_date_program ON public.attendance(date, program);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_summaries_updated_at
  BEFORE UPDATE ON public.attendance_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();