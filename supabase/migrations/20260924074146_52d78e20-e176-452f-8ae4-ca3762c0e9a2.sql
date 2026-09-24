CREATE TYPE public.app_role AS ENUM ('candidate','recruiter','admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.candidate_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  education text,
  degree text,
  branch text,
  experience text,
  visible_to_recruiters boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.candidate_profiles TO authenticated;
GRANT ALL ON public.candidate_profiles TO service_role;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin')
    OR (public.has_role(auth.uid(),'recruiter') AND EXISTS (SELECT 1 FROM public.candidate_profiles c WHERE c.user_id = profiles.id AND c.visible_to_recruiters)));
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Candidate read" ON public.candidate_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin')
    OR (visible_to_recruiters AND public.has_role(auth.uid(),'recruiter')));
CREATE POLICY "Candidate insert own" ON public.candidate_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Candidate update own" ON public.candidate_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.hiring_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  purpose text NOT NULL,
  description text,
  department text,
  location text,
  session_date date,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.hiring_sessions(recruiter_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hiring_sessions TO authenticated;
GRANT ALL ON public.hiring_sessions TO service_role;
ALTER TABLE public.hiring_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recruiter manages own sessions" ON public.hiring_sessions FOR ALL TO authenticated
  USING (recruiter_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (recruiter_id = auth.uid() AND public.has_role(auth.uid(),'recruiter'));

CREATE TABLE public.session_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.hiring_sessions(id) ON DELETE CASCADE,
  candidate_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text,
  assigned_role text,
  status text NOT NULL DEFAULT 'added',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.session_candidates(session_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_candidates TO authenticated;
GRANT ALL ON public.session_candidates TO service_role;
ALTER TABLE public.session_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Session owner manages candidates" ON public.session_candidates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.hiring_sessions s WHERE s.id = session_id AND (s.recruiter_id = auth.uid() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.hiring_sessions s WHERE s.id = session_id AND s.recruiter_id = auth.uid()));
CREATE POLICY "Candidate sees own session entries" ON public.session_candidates FOR SELECT TO authenticated
  USING (candidate_user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER t1 BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t2 BEFORE UPDATE ON public.candidate_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t3 BEFORE UPDATE ON public.hiring_sessions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.app_role;
BEGIN
  r := CASE WHEN NEW.raw_user_meta_data->>'account_type' = 'recruiter' THEN 'recruiter'::public.app_role ELSE 'candidate'::public.app_role END;
  INSERT INTO public.profiles (id, display_name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, r);
  IF r = 'candidate' THEN
    INSERT INTO public.candidate_profiles (user_id, full_name)
      VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'));
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();