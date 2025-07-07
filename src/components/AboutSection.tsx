import { useEffect, useState } from 'react';
import { Shield, Target, Users, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileInfo {
  name: string;
  title: string;
  experience_years: number;
  bio: string;
  email: string;
  location?: string;
  profile_image_url?: string;
}

const AboutSection = () => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const { data, error } = await supabase
        .from('profile_info')
        .select('*')
        .single();
      
      if (data && !error) {
        setProfileInfo(data);
      }
    };

    fetchProfileInfo();
  }, []);

  if (!profileInfo) {
    return (
      <section id="about" className="py-20 bg-gradient-to-br from-background to-secondary/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto mb-8"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dedicated to building secure, compliant, and resilient organizations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Content */}
          <div className="space-y-6">
            <div className="cyber-card">
              <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                {profileInfo.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {profileInfo.bio}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <span className="font-medium text-primary w-24">Experience:</span>
                  <span className="text-muted-foreground">{profileInfo.experience_years} years in GRC</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium text-primary w-24">Email:</span>
                  <span className="text-muted-foreground">{profileInfo.email}</span>
                </div>
                {profileInfo.location && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-primary w-24">Location:</span>
                    <span className="text-muted-foreground">{profileInfo.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="cyber-card group">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Risk Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive risk assessment and mitigation strategies to protect organizational assets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="cyber-card group">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg group-hover:bg-accent/30 transition-colors">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Compliance Excellence</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensuring adherence to regulatory standards and industry best practices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="cyber-card group">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Governance Framework</h4>
                    <p className="text-sm text-muted-foreground">
                      Developing robust governance structures for effective organizational oversight.
                    </p>
                  </div>
                </div>
              </div>

              <div className="cyber-card group">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg group-hover:bg-accent/30 transition-colors">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Professional Excellence</h4>
                    <p className="text-sm text-muted-foreground">
                      Committed to continuous learning and delivering high-quality solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;