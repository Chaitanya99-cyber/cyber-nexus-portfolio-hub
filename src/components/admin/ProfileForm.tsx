import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, User, Upload, FileText, X } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  profile_image_url: z.string().url().optional().or(z.literal('')),
  resume_url: z.string().url().optional().or(z.literal('')),
  experience_years: z.number().min(0, 'Experience must be positive'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_info')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setProfileId(data.id);
        reset({
          name: data.name,
          title: data.title,
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          linkedin_url: data.linkedin_url || '',
          profile_image_url: data.profile_image_url || '',
          resume_url: data.resume_url || '',
          experience_years: Number(data.experience_years),
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleResumeSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedResume(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file for your resume.",
        variant: "destructive",
      });
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `resume_${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    
    try {
      let resumeUrl = data.resume_url || null;
      
      // Upload resume if selected
      if (selectedResume) {
        setUploading(true);
        resumeUrl = await uploadResume(selectedResume);
        setUploading(false);
      }

      const profileData = {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        location: data.location || null,
        linkedin_url: data.linkedin_url || null,
        profile_image_url: data.profile_image_url || null,
        resume_url: resumeUrl,
        bio: data.bio || null,
      };

      if (profileId) {
        const { error } = await supabase
          .from('profile_info')
          .update(profileData)
          .eq('id', profileId);
        
        if (error) throw error;
      } else {
        const { data: newProfile, error } = await supabase
          .from('profile_info')
          .insert([profileData])
          .select()
          .single();
        
        if (error) throw error;
        setProfileId(newProfile.id);
      }
      
      setSelectedResume(null);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your profile information that appears on the website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., GRC Professional"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="City, Country"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience_years">Years of Experience *</Label>
              <Input
                id="experience_years"
                type="number"
                step="0.1"
                {...register('experience_years', { valueAsNumber: true })}
                placeholder="2.5"
              />
              {errors.experience_years && (
                <p className="text-sm text-destructive">{errors.experience_years.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              {...register('linkedin_url')}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedin_url && (
              <p className="text-sm text-destructive">{errors.linkedin_url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_image_url">Profile Image URL</Label>
            <Input
              id="profile_image_url"
              {...register('profile_image_url')}
              placeholder="https://example.com/profile-image.jpg"
            />
            {errors.profile_image_url && (
              <p className="text-sm text-destructive">{errors.profile_image_url.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Resume Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {selectedResume ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{selectedResume.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedResume(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <input
                      type="file"
                      onChange={handleResumeSelect}
                      className="hidden"
                      id="resume-upload"
                      accept=".pdf"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      Click to upload your resume (PDF only)
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume_url">Or Enter Resume URL</Label>
              <Input
                id="resume_url"
                {...register('resume_url')}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell visitors about yourself and your expertise..."
              rows={4}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading || uploading}>
              <Save className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};