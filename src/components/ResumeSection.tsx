import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Star, Briefcase, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResumeSection = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_info')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!profileData?.resume_url) {
      toast({
        title: "Resume not available",
        description: "No resume file has been uploaded yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = profileData.resume_url;
      link.download = `${profileData.name?.replace(/\s+/g, '_')}_Resume.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started",
        description: "Your resume download has been initiated.",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="resume" className="py-20 px-4 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 animate-float">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute top-32 right-20 animate-float-delayed">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float">
          <Star className="h-7 w-7 text-primary" />
        </div>
        <div className="absolute bottom-32 right-1/3 animate-float-delayed">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            Download My Resume
          </h2>
          <p className="text-muted-foreground text-lg">
            Get a comprehensive overview of my professional experience and qualifications
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-elegant transition-all duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {profileData?.name || 'Professional'} Resume
            </CardTitle>
            <CardDescription className="text-lg">
              {profileData?.title || 'GRC Professional'} • {profileData?.experience_years || '2.1'}+ Years Experience
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Professional Experience</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="h-4 w-4" />
                <span>Key Achievements</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Certifications & Skills</span>
              </div>
            </div>

            <Button 
              onClick={handleDownloadResume}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
              disabled={!profileData?.resume_url}
            >
              <Download className="mr-2 h-5 w-5" />
              {profileData?.resume_url ? 'Download Resume (PDF)' : 'Resume Not Available'}
            </Button>

            {!profileData?.resume_url && (
              <p className="text-sm text-muted-foreground mt-2">
                Resume file will be available soon. Please check back later.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResumeSection;