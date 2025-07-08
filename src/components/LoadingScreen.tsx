import { useEffect, useState } from 'react';
import { Shield, Lock, Database, Server, Key, Globe } from 'lucide-react';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 matrix-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        
        {/* Floating Security Icons */}
        <div className="absolute top-20 left-10 float-animation">
          <Shield className="h-12 w-12 text-primary/20" />
        </div>
        <div className="absolute top-40 right-20 float-animation" style={{ animationDelay: '1s' }}>
          <Lock className="h-8 w-8 text-accent/20" />
        </div>
        <div className="absolute bottom-40 left-20 float-animation" style={{ animationDelay: '2s' }}>
          <Database className="h-14 w-14 text-primary/15" />
        </div>
        <div className="absolute top-60 left-1/3 float-animation" style={{ animationDelay: '0.5s' }}>
          <Server className="h-10 w-10 text-accent/15" />
        </div>
        <div className="absolute bottom-60 right-1/3 float-animation" style={{ animationDelay: '1.5s' }}>
          <Key className="h-9 w-9 text-primary/20" />
        </div>
        <div className="absolute top-1/3 right-10 float-animation" style={{ animationDelay: '2.5s' }}>
          <Globe className="h-11 w-11 text-accent/18" />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Shield className="h-20 w-20 text-primary mx-auto mb-6 glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Chaitanya Vichare
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            <span className="matrix-text">&gt;</span> GRC Professional
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary/30 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out cyber-glow"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Initializing secure environment... {progress}%
        </p>
        
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;