import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { productsAPI, uploadAPI } from '@/services/api';
import type { Product, ProductCreate } from '@/services/api';
import { Plus, Save, Upload, File, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  short_description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  original_price: z.number().optional(),
  product_type: z.string().default('digital'),
  image_url: z.string().url().optional().or(z.literal('')),
  file_url: z.string().url().optional().or(z.literal('')),
  preview_url: z.string().url().optional().or(z.literal('')),
  features: z.string().optional(),
  requirements: z.string().optional(),
  tags: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ProductForm = ({ product, open, onOpenChange, onSuccess }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      short_description: product.short_description || '',
      price: Number(product.price),
      original_price: product.original_price ? Number(product.original_price) : undefined,
      product_type: product.product_type || 'digital',
      image_url: product.image_url || '',
      file_url: product.file_url || '',
      preview_url: product.preview_url || '',
      features: product.features?.join(', ') || '',
      requirements: product.requirements?.join(', ') || '',
      tags: product.tags?.join(', ') || '',
    } : {},
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        short_description: product.short_description || '',
        price: Number(product.price),
        original_price: product.original_price ? Number(product.original_price) : undefined,
        product_type: product.product_type || 'digital',
        image_url: product.image_url || '',
        file_url: product.file_url || '',
        preview_url: product.preview_url || '',
        features: product.features?.join(', ') || '',
        requirements: product.requirements?.join(', ') || '',
        tags: product.tags?.join(', ') || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        short_description: '',
        price: 0,
        product_type: 'digital',
        image_url: '',
        file_url: '',
        preview_url: '',
        features: '',
        requirements: '',
        tags: '',
      });
    }
  }, [product, reset]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    
    try {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      let fileUrl = data.file_url || undefined;
      
      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        const uploadResult = await uploadAPI.uploadFile(selectedFile);
        fileUrl = uploadResult.url;
        setUploading(false);
      }
      
      const productData: Partial<ProductCreate> = {
        name: data.name,
        description: data.description,
        short_description: data.short_description || undefined,
        price: data.price,
        original_price: data.original_price || undefined,
        product_type: data.product_type,
        slug,
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : undefined,
        requirements: data.requirements ? data.requirements.split(',').map(r => r.trim()).filter(Boolean) : undefined,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        image_url: data.image_url || undefined,
        file_url: fileUrl,
        preview_url: data.preview_url || undefined,
      };

      if (product) {
        await productsAPI.update(product.id, productData);
        
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
      } else {
        await productsAPI.create(productData as ProductCreate);
        
        toast({
          title: "Success",
          description: "Product created successfully!",
        });
      }
      
      reset();
      setSelectedFile(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product ? 'Update the product information below.' : 'Fill in the details to create a new product.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product_type">Product Type</Label>
              <Input
                id="product_type"
                {...register('product_type')}
                placeholder="e.g., digital, template, toolkit"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                {...register('original_price', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              {...register('short_description')}
              placeholder="Brief description for product cards"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Full Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detailed product description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              {...register('image_url')}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product File Upload</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {selectedFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span className="text-sm">{selectedFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.zip,.rar"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                    >
                      Click to upload a file or drag and drop
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file_url">Or Enter File URL</Label>
                <Input
                  id="file_url"
                  {...register('file_url')}
                  placeholder="https://example.com/file.pdf"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preview_url">Preview URL</Label>
                <Input
                  id="preview_url"
                  {...register('preview_url')}
                  placeholder="https://example.com/preview"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea
              id="features"
              {...register('features')}
              placeholder="Feature 1, Feature 2, Feature 3"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (comma-separated)</Label>
            <Textarea
              id="requirements"
              {...register('requirements')}
              placeholder="Requirement 1, Requirement 2"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register('tags')}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              <Save className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};