-- Create admin users table for restricted access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin users (only allow read operations, insert will be done manually)
CREATE POLICY "Admin users can read their own data" 
ON public.admin_users 
FOR SELECT 
USING (email = auth.jwt() ->> 'email');

-- Insert the specific admin user with hashed password
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('cyberenthusiasts17@gmail.com', crypt('FuckU!17*@2025', gen_salt('bf')));

-- Create function to check admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(input_email TEXT, input_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = input_email 
    AND password_hash = crypt(input_password, password_hash)
    AND is_active = true
  );
END;
$$;

-- Add updated_at trigger for admin_users table
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();