import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  Settings, 
  Package, 
  FileText, 
  Users, 
  BarChart3, 
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate('/auth');
        } else {
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
      } else {
        setLoading(false);
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch contact messages
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      setProducts(productsData || []);
      setContactMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Error signing out. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Chaitanya Vichare - GRC Professional</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Manage your GRC website and products</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-primary">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Messages</p>
                  <p className="text-2xl font-bold text-accent">{contactMessages.length}</p>
                </div>
                <FileText className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Years Experience</p>
                  <p className="text-2xl font-bold text-primary">2.10+</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projects Delivered</p>
                  <p className="text-2xl font-bold text-accent">2</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Welcome to Your Admin Panel</CardTitle>
                <CardDescription>
                  Manage your GRC portfolio website, products, and customer inquiries from here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Messages
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Update Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Recent Activity</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Admin panel accessed</p>
                      <p>• {contactMessages.length} total contact messages</p>
                      <p>• {products.length} products in catalog</p>
                      <p>• Authentication system active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-primary">Product Management</CardTitle>
                    <CardDescription>Manage your GRC products, templates, and toolkits</CardDescription>
                  </div>
                  <Button className="cyber-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No products yet</h3>
                    <p className="text-muted-foreground mb-4">Start by adding your first GRC product</p>
                    <Button className="cyber-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Product management interface will be implemented here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Contact Messages</CardTitle>
                <CardDescription>Review and respond to customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                {contactMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
                    <p className="text-muted-foreground">Contact messages will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.slice(0, 5).map((message: any) => (
                      <div key={message.id} className="border border-border rounded-lg p-4 bg-muted/20">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{message.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{message.email}</p>
                        <p className="text-sm text-foreground">{message.message}</p>
                        {message.company && (
                          <p className="text-sm text-muted-foreground mt-1">Company: {message.company}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-primary">Settings</CardTitle>
                <CardDescription>Manage your website settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings interface will be implemented here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;