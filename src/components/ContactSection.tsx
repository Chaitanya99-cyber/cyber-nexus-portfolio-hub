import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. I'll get back to you within 24 hours.",
        duration: 5000,
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-secondary/10 to-background relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute top-24 right-16 float-animation opacity-10">
        <Mail className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute top-60 left-12 float-animation opacity-8" style={{ animationDelay: '2.5s' }}>
        <Phone className="h-12 w-12 text-accent" />
      </div>
      <div className="absolute bottom-32 right-8 float-animation opacity-6" style={{ animationDelay: '1.5s' }}>
        <Send className="h-18 w-18 text-primary" />
      </div>
      <div className="absolute bottom-16 left-20 float-animation opacity-10" style={{ animationDelay: '3.5s' }}>
        <MapPin className="h-14 w-14 text-accent" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to strengthen your organization's security posture? Let's discuss your GRC needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="cyber-card">
              <h3 className="text-2xl font-bold text-primary mb-6">Let's Connect</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Whether you need assistance with risk assessments, compliance frameworks, 
                policy development, or any other GRC-related challenges, I'm here to help. 
                Let's work together to build a more secure future for your organization.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-muted-foreground">chaitanyavichare.99@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-accent/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Phone</h4>
                    <p className="text-muted-foreground">Available upon request</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Location</h4>
                    <p className="text-muted-foreground">Available for remote consultations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Overview */}
            <div className="cyber-card">
              <h4 className="text-lg font-bold text-accent mb-4">Services Available</h4>
              <div className="space-y-3">
                {[
                  'Risk Assessment & Management',
                  'Compliance Framework Implementation',
                  'Security Policy Development',
                  'Audit Preparation & Support',
                  'Incident Response Planning',
                  'GRC Tool Implementation',
                  'Training & Awareness Programs',
                  'Custom GRC Solutions'
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="cyber-card">
            <h3 className="text-2xl font-bold text-primary mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 bg-background border-border focus:border-primary"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 bg-background border-border focus:border-primary"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 bg-background border-border focus:border-primary"
                    placeholder="(optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-foreground">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1 bg-background border-border focus:border-primary"
                    placeholder="Your organization"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-foreground">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1 bg-background border-border focus:border-primary resize-none"
                  placeholder="Please describe your GRC needs or questions in detail..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cyber-button"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <CheckCircle className="h-4 w-4 inline mr-1 text-primary" />
                I typically respond within 24 hours during business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;