import { useEffect, useState } from 'react';
import { ShoppingBag, Download, Star, Eye, FileText, Shield, CheckCircle, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category_id?: string;
  price: number;
  original_price?: number;
  product_type: string;
  preview_url?: string;
  image_url?: string;
  file_url?: string;
  features?: string[];
  tags?: string[];
  download_count: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
}

interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (data && !error) {
        setProducts(data);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (data && !error) {
        setCategories(data);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return Shield;
      case 'template':
        return FileText;
      case 'toolkit':
        return ShoppingBag;
      default:
        return FileText;
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        const category = categories.find(cat => cat.id === product.category_id);
        return category?.slug === selectedCategory;
      });
  
  const featuredProducts = products.filter(product => product.is_featured);

  const handleProductAction = async (product: Product) => {
    const price = Number(product.price);
    
    if (price <= 0) {
      // Free product - direct download
      if (product.file_url) {
        try {
          const link = document.createElement('a');
          link.href = product.file_url;
          link.download = `${product.name.replace(/\s+/g, '_')}.${product.file_url.split('.').pop()}`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast({
            title: "Download started",
            description: `Your free download of "${product.name}" has been initiated.`,
          });
        } catch (error) {
          toast({
            title: "Download failed",
            description: "Failed to download the file. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "File not available",
          description: "No download file is available for this product.",
          variant: "destructive",
        });
      }
    } else {
      // Paid product - redirect to payment
      toast({
        title: "Payment required",
        description: "Redirecting to payment gateway...",
      });
      
      // For now, we'll show a placeholder message
      // In a real implementation, you would integrate with Stripe or another payment processor
      setTimeout(() => {
        alert(`Payment gateway integration needed for "${product.name}" - Price: $${price}`);
      }, 1000);
    }
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-background to-secondary/20 relative overflow-hidden">
      {/* Floating Background Icons */}
      <div className="absolute top-20 left-16 float-animation opacity-8">
        <ShoppingBag className="h-18 w-18 text-primary" />
      </div>
      <div className="absolute top-60 right-12 float-animation opacity-10" style={{ animationDelay: '2s' }}>
        <FileText className="h-16 w-16 text-accent" />
      </div>
      <div className="absolute bottom-40 left-8 float-animation opacity-6" style={{ animationDelay: '3.5s' }}>
        <Shield className="h-20 w-20 text-primary" />
      </div>
      <div className="absolute bottom-20 right-20 float-animation opacity-8" style={{ animationDelay: '1s' }}>
        <Download className="h-14 w-14 text-accent" />
      </div>
      <div className="absolute top-40 left-1/3 float-animation opacity-4" style={{ animationDelay: '4s' }}>
        <Star className="h-12 w-12 text-primary" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GRC Products & Solutions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade templates, policies, and toolkits to strengthen your organization's security posture
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'cyber-button' : 'neon-border bg-transparent hover:bg-primary/10'}
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.slug)}
              className={selectedCategory === category.slug ? 'cyber-button' : 'neon-border bg-transparent hover:bg-primary/10'}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && selectedCategory === 'all' && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">Featured Products</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product) => {
                const Icon = getProductIcon(product.product_type);
                return (
                  <div key={product.id} className="cyber-card group relative overflow-hidden">
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                    
                    <div className="flex items-center justify-center h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4">
                      <Icon className="h-16 w-16 text-primary" />
                    </div>

                    <h4 className="text-xl font-bold text-foreground mb-2">{product.name}</h4>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {product.short_description || product.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="h-4 w-4 mr-1" />
                        {product.download_count}
                      </div>
                      {product.rating > 0 && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {product.rating.toFixed(1)} ({product.review_count})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.original_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="cyber-button"
                        onClick={() => handleProductAction(product)}
                      >
                        {Number(product.price) <= 0 ? (
                          <>
                            <Download className="h-4 w-4 mr-1" />
                            Free
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-1" />
                            Buy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const Icon = getProductIcon(product.product_type);
              return (
                <div key={product.id} className="cyber-card group">
                  <div className="flex items-center justify-center h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                  </div>

                  <h4 className="text-lg font-bold text-foreground mb-2">{product.name}</h4>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.short_description || product.description}
                  </p>

                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <ul className="space-y-1">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Download className="h-4 w-4 mr-1" />
                      {product.download_count}
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {product.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${product.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {product.preview_url && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="neon-border bg-transparent"
                          onClick={() => window.open(product.preview_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        className="cyber-button"
                        onClick={() => handleProductAction(product)}
                      >
                        {Number(product.price) <= 0 ? (
                          <Download className="h-4 w-4" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="cyber-card inline-block">
              <ShoppingBag className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Products Coming Soon
              </h3>
              <p className="text-muted-foreground">
                I'm preparing comprehensive GRC solutions including templates, policies, and toolkits.
              </p>
            </div>
          </div>
        )}

        {/* Product Categories Overview */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="cyber-card text-center">
              <h4 className="text-lg font-bold text-primary mb-2">{category.name}</h4>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;