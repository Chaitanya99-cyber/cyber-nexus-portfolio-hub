-- Create storage buckets for resumes and products
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Storage policies for resumes bucket
CREATE POLICY "Resume files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can upload resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resumes" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete resumes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Storage policies for products bucket
CREATE POLICY "Product files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload products" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Add resume_url to profile_info table
ALTER TABLE public.profile_info ADD COLUMN resume_url TEXT;