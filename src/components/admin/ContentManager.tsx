import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Upload, Image, FileText, Globe } from 'lucide-react';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  experience_years: number;
  profile_image_url: string;
  resume_url: string;
}

const ContentManager = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    experience_years: 0,
    profile_image_url: '',
    resume_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profile_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfileData(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profile_info')
        .upsert(profileData, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully! Changes are live on your website.",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, field: 'profile_image_url' | 'resume_url') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const bucket = field === 'profile_image_url' ? 'avatars' : 'resumes';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setProfileData(prev => ({
        ...prev,
        [field]: data.publicUrl
      }));

      toast({
        title: "Success",
        description: `${field === 'profile_image_url' ? 'Image' : 'File'} uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="cyber-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Content Manager
          </CardTitle>
          <CardDescription>
            Edit your website content in real-time. Changes will be immediately visible on your live site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={profileData.title}
                onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., GRC Professional"
                className="bg-background"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell visitors about your background and expertise..."
              className="bg-background min-h-[120px] resize-none"
              rows={5}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                className="bg-background"
              />
            </div>
          </div>

          {/* Location & LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={profileData.linkedin_url}
                onChange={(e) => setProfileData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/yourname"
                className="bg-background"
              />
            </div>
          </div>

          {/* Experience Years */}
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              step="0.1"
              value={profileData.experience_years}
              onChange={(e) => setProfileData(prev => ({ ...prev, experience_years: parseFloat(e.target.value) || 0 }))}
              placeholder="2.5"
              className="bg-background md:w-1/3"
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Profile Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {profileData.profile_image_url ? (
                  <div className="space-y-3">
                    <img 
                      src={profileData.profile_image_url} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    <p className="text-sm text-muted-foreground">Current profile image</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Image className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No profile image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'profile_image_url');
                  }}
                  className="hidden"
                  id="profile-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('profile-image-upload')?.click()}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Resume PDF</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {profileData.resume_url ? (
                  <div className="space-y-3">
                    <FileText className="h-12 w-12 text-primary mx-auto" />
                    <p className="text-sm text-foreground">Resume uploaded</p>
                    <a 
                      href={profileData.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      View current resume
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No resume uploaded</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'resume_url');
                  }}
                  className="hidden"
                  id="resume-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="cyber-button min-w-[120px]"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManager;