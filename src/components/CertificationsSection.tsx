import { useEffect, useState } from 'react';
import { Award, ExternalLink, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
}

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const fetchCertifications = async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (data && !error) {
        setCertifications(data);
      }
    };

    fetchCertifications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    return expiry <= threeMonthsFromNow && expiry > today;
  };

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <section id="certifications" className="py-20 bg-gradient-to-br from-secondary/10 to-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Certifications & Credentials
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional certifications that validate expertise and commitment to excellence
          </p>
        </div>

        {certifications.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <div key={cert.id} className="cyber-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  
                  {cert.expiry_date && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isExpired(cert.expiry_date) 
                        ? 'bg-red-500/20 text-red-400'
                        : isExpiringSoon(cert.expiry_date)
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {isExpired(cert.expiry_date) 
                        ? 'Expired'
                        : isExpiringSoon(cert.expiry_date)
                        ? 'Expiring Soon'
                        : 'Valid'
                      }
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">
                  {cert.name}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  Issued by <span className="text-primary font-medium">{cert.issuer}</span>
                </p>

                <div className="space-y-2 mb-4">
                  {cert.issue_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Issued: {formatDate(cert.issue_date)}
                    </div>
                  )}
                  
                  {cert.expiry_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Expires: {formatDate(cert.expiry_date)}
                    </div>
                  )}

                  {cert.credential_id && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">ID:</span> {cert.credential_id}
                    </div>
                  )}
                </div>

                {cert.credential_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full neon-border bg-transparent hover:bg-primary/10"
                    onClick={() => window.open(cert.credential_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify Credential
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="cyber-card inline-block">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Building Professional Credentials
              </h3>
              <p className="text-muted-foreground mb-4">
                Currently pursuing industry-leading certifications in cybersecurity and risk management.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'CISSP',
                  'CISA',
                  'CRISC',
                  'ISO 27001 Lead Auditor',
                  'NIST Cybersecurity Framework'
                ].map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Commitment to Learning */}
        <div className="mt-16 text-center">
          <div className="cyber-card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">Commitment to Excellence</h3>
            <p className="text-muted-foreground leading-relaxed">
              I believe in continuous learning and staying current with industry best practices. 
              My certification journey reflects a commitment to maintaining the highest standards 
              of professional competency in cybersecurity, risk management, and compliance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;