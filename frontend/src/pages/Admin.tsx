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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { productsAPI, certificationsAPI, contactAPI, authAPI } from '@/services/api';
import type { Product, Certification, ContactMessage } from '@/services/api';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProfileForm } from '@/components/admin/ProfileForm';
import { CertificationForm } from '@/components/admin/CertificationForm';
import ContentManager from '@/components/admin/ContentManager';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [certificationFormOpen, setCertificationFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user came from auth page, otherwise redirect to auth
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      setLoading(false);
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch products
      const productsData = await productsAPI.getAll();
      
      // Fetch contact messages
      const messagesData = await contactAPI.getAll();
      
      // Fetch certifications
      const certificationsData = await certificationsAPI.getAll();
      
      setProducts(productsData || []);
      setContactMessages(messagesData || []);
      setCertifications(certificationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = () => {
    authAPI.logout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      duration: 3000,
    });
    navigate('/auth');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(productId);
      
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormOpen(true);
  };

  const handleProductFormSuccess = () => {
    fetchData();
    setEditingProduct(null);
  };

  const handleEditCertification = (certification: Certification) => {
    setEditingCertification(certification);
    setCertificationFormOpen(true);
  };

  const handleAddCertification = () => {
    setEditingCertification(null);
    setCertificationFormOpen(true);
  };

  const handleCertificationFormSuccess = () => {
    fetchData();
    setEditingCertification(null);
  };

  const handleDeleteCertification = async (certificationId: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    
    try {
      await certificationsAPI.delete(certificationId);
      
      toast({
        title: "Success",
        description: "Certification deleted successfully!",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete certification",
        variant: "destructive",
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Chaitanya Vichare - GRC Professional</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="bg-transparent flex-1 sm:flex-none"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Site</span>
                <span className="sm:hidden">View</span>
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-transparent flex-1 sm:flex-none"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your GRC website and products</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="cyber-card">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Products</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{products.length}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
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
          <TabsList className="bg-background border border-border overflow-x-auto w-full">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm">Content</TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm">Products</TabsTrigger>
            <TabsTrigger value="certifications" className="text-xs sm:text-sm">Certifications</TabsTrigger>
            <TabsTrigger id="messages-tab" value="messages" className="text-xs sm:text-sm">Messages</TabsTrigger>
            <TabsTrigger id="settings-tab" value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-6">
            <ContentManager />
          </TabsContent>
          
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
                      <Button onClick={handleAddProduct} className="w-full justify-start" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                      <Button onClick={handleAddCertification} className="w-full justify-start" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Certification
                      </Button>
                      <Button onClick={() => document.getElementById('messages-tab')?.click()} className="w-full justify-start" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Messages
                      </Button>
                      <Button onClick={() => document.getElementById('settings-tab')?.click()} className="w-full justify-start" variant="outline">
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
                  <Button onClick={handleAddProduct} className="cyber-button">
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
                    <Button onClick={handleAddProduct} className="cyber-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product: any) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="capitalize">{product.product_type}</TableCell>
                            <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                product.is_active 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {product.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => handleEditProduct(product)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="certifications" className="space-y-6">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-primary">Certification Management</CardTitle>
                    <CardDescription>Manage your professional certifications</CardDescription>
                  </div>
                  <Button onClick={handleAddCertification} className="cyber-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {certifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No certifications yet</h3>
                    <p className="text-muted-foreground mb-4">Start by adding your first certification</p>
                    <Button onClick={handleAddCertification} className="cyber-button">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Certification
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Issuer</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certifications.map((cert: any) => (
                          <TableRow key={cert.id}>
                            <TableCell className="font-medium">{cert.name}</TableCell>
                            <TableCell>{cert.issuer}</TableCell>
                            <TableCell>{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                cert.is_active 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {cert.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => handleEditCertification(cert)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteCertification(cert.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
            <ProfileForm />
          </TabsContent>
        </Tabs>
      </main>

      <ProductForm
        product={editingProduct}
        open={productFormOpen}
        onOpenChange={setProductFormOpen}
        onSuccess={handleProductFormSuccess}
      />

      <CertificationForm
        certification={editingCertification}
        open={certificationFormOpen}
        onOpenChange={setCertificationFormOpen}
        onSuccess={handleCertificationFormSuccess}
      />
    </div>
  );
};

export default Admin;