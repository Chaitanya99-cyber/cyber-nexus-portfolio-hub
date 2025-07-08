import { useEffect, useState } from 'react';
import { ChevronDown, Download, Mail, Shield, Lock, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const titles = [
    'GRC Professional',
    'Cybersecurity Specialist',
    'Risk Management Expert',
    'Compliance Consultant'
  ];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex <= currentTitle.length) {
        setDisplayText(currentTitle.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentTitleIndex]);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 matrix-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        
        {/* Floating Security Icons */}
        <div className="absolute top-20 left-10 float-animation">
          <Shield className="h-8 w-8 text-primary/30" />
        </div>
        <div className="absolute top-40 right-20 float-animation" style={{ animationDelay: '1s' }}>
          <Lock className="h-6 w-6 text-accent/30" />
        </div>
        <div className="absolute bottom-40 left-20 float-animation" style={{ animationDelay: '2s' }}>
          <Database className="h-10 w-10 text-primary/20" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Chaitanya Vichare
            </span>
          </h1>
          
          <div className="h-16 flex items-center justify-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
              <span className="matrix-text">&gt;</span>{' '}
              <span className="typing-animation">{displayText}</span>
            </h2>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Securing organizations with{' '}
            <span className="text-primary font-semibold">2+ years</span> of experience in{' '}
            <span className="text-accent font-semibold">Governance, Risk & Compliance</span>.
            Specializing in comprehensive security frameworks and policy development.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="cyber-button group"
            size="lg"
          >
            <Shield className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            Explore Products
          </Button>
          
          <Button 
            onClick={scrollToAbout}
            variant="outline"
            size="lg"
            className="neon-border bg-transparent hover:bg-primary/10"
          >
            <Shield className="h-5 w-5 mr-2" />
            Know About Me
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-16">
          <div className="text-center cyber-card">
            <div className="text-2xl font-bold text-primary">2.10+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center cyber-card">
            <div className="text-2xl font-bold text-accent">2</div>
            <div className="text-sm text-muted-foreground">Projects Delivered</div>
          </div>
          <div className="text-center cyber-card">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary hover:text-accent transition-colors duration-300 animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;