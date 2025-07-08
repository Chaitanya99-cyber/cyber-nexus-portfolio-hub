import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
}

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from('work_experience')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: false });
      
      if (data && !error) {
        setExperiences(data);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-background to-secondary/10 relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute top-20 right-16 float-animation opacity-8">
        <Briefcase className="h-18 w-18 text-primary" />
      </div>
      <div className="absolute top-60 left-12 float-animation opacity-6" style={{ animationDelay: '2.5s' }}>
        <Calendar className="h-14 w-14 text-accent" />
      </div>
      <div className="absolute bottom-24 right-8 float-animation opacity-10" style={{ animationDelay: '1s' }}>
        <MapPin className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute bottom-60 left-16 float-animation opacity-8" style={{ animationDelay: '3.5s' }}>
        <CheckCircle className="h-12 w-12 text-accent" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional Experience
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A journey of growth and expertise in cybersecurity and risk management
          </p>
        </div>

        {experiences.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent"></div>
            
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <div key={experience.id} className="relative flex items-start space-x-8">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg cyber-glow"></div>
                  </div>
                  
                  {/* Experience Card */}
                  <div className="flex-1 cyber-card">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {experience.position}
                        </h3>
                        <div className="flex items-center text-primary font-semibold mb-2">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {experience.company}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start md:items-end space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(experience.start_date)} - {' '}
                          {experience.is_current ? 'Present' : 
                           experience.end_date ? formatDate(experience.end_date) : 'Present'}
                        </div>
                        {experience.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {experience.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {experience.description && (
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {experience.description}
                      </p>
                    )}

                    {experience.responsibilities && experience.responsibilities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Key Responsibilities:</h4>
                        <ul className="space-y-1">
                          {experience.responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="flex items-start text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-primary mr-2 mt-1 flex-shrink-0" />
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {experience.achievements && experience.achievements.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-accent mb-2">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {experience.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-accent mr-2 mt-1 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="cyber-card inline-block">
              <Briefcase className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Building Professional Experience
              </h3>
              <p className="text-muted-foreground">
                With {2.10} years in GRC, I'm continuously expanding my expertise in cybersecurity and risk management.
              </p>
            </div>
          </div>
        )}

        {/* Professional Summary */}
        <div className="mt-16 text-center">
          <div className="cyber-card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">Professional Summary</h3>
            <p className="text-muted-foreground leading-relaxed">
              As a dedicated GRC professional with over 2 years of experience, I have successfully contributed to 
              strengthening organizational security postures through comprehensive risk assessments, policy development, 
              and compliance management. My expertise spans across multiple frameworks including ISO 27001, NIST, and SOC 2, 
              enabling organizations to achieve and maintain robust security standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;