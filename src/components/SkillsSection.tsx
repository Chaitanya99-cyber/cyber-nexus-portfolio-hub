import { useEffect, useState } from 'react';
import { Code, Wrench, Users, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number;
  description: string;
}

const SkillsSection = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (data && !error) {
        setSkills(data);
      }
    };

    fetchSkills();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return Code;
      case 'tools':
        return Wrench;
      case 'soft':
        return Users;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'text-primary bg-primary/20';
      case 'tools':
        return 'text-accent bg-accent/20';
      case 'soft':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-purple-400 bg-purple-400/20';
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryTitles = {
    technical: 'Technical Expertise',
    tools: 'Tools & Frameworks',
    soft: 'Soft Skills',
    frameworks: 'Frameworks & Standards'
  };

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-secondary/10 to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive skill set in cybersecurity, risk management, and compliance
          </p>
        </div>

        {Object.entries(groupedSkills).map(([category, categorySkills]) => {
          const Icon = getCategoryIcon(category);
          const colorClass = getCategoryColor(category);
          
          return (
            <div key={category} className="mb-12">
              <div className="flex items-center mb-8">
                <div className={`p-3 rounded-lg ${colorClass} mr-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {categoryTitles[category as keyof typeof categoryTitles] || category}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="cyber-card group">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-foreground">{skill.name}</h4>
                        <span className="text-sm text-primary font-medium">
                          {skill.proficiency_level}/10
                        </span>
                      </div>
                      
                      <div className="skill-bar mb-3">
                        <div 
                          className="skill-progress" 
                          style={{ width: `${skill.proficiency_level * 10}%` }}
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Additional Skills Overview */}
        <div className="mt-16 text-center">
          <div className="cyber-card inline-block">
            <h3 className="text-xl font-semibold mb-4 text-primary">Specialized Areas</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'ISO 27001',
                'NIST Framework',
                'SOC 2',
                'Risk Assessment',
                'Policy Development',
                'Audit Management',
                'Incident Response',
                'Vulnerability Management'
              ].map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;