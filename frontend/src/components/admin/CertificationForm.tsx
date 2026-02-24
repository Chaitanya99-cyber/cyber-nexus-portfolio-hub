import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { certificationsAPI, uploadAPI } from '@/services/api';
import type { Certification, CertificationCreate } from '@/services/api';
import { Upload, X } from 'lucide-react';

interface CertificationFormProps {
  certification?: Certification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CertificationForm = ({ certification, open, onOpenChange, onSuccess }: CertificationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name || '',
        issuer: certification.issuer || '',
        issue_date: certification.issue_date || '',
        expiry_date: certification.expiry_date || '',
        credential_id: certification.credential_id || '',
        credential_url: certification.credential_url || '',
        image_url: certification.image_url || '',
        display_order: certification.display_order || 0,
        is_active: certification.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
        image_url: '',
        display_order: 0,
        is_active: true,
      });
    }
    setImageFile(null);
  }, [certification, open]);

  const handleImageUpload = async (file: File) => {
    try {
      const uploadResult = await uploadAPI.uploadFile(file);
      return uploadResult.url;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if new file selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const certificationData: Partial<CertificationCreate> = {
        name: formData.name,
        issuer: formData.issuer,
        issue_date: formData.issue_date || undefined,
        expiry_date: formData.expiry_date || undefined,
        credential_id: formData.credential_id || undefined,
        credential_url: formData.credential_url || undefined,
        image_url: imageUrl || undefined,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      if (certification) {
        // Update existing certification
        await certificationsAPI.update(certification.id, certificationData);

        toast({
          title: "Success",
          description: "Certification updated successfully!",
        });
      } else {
        // Create new certification
        await certificationsAPI.create(certificationData as CertificationCreate);

        toast({
          title: "Success", 
          description: "Certification added successfully!",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save certification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {certification ? 'Edit Certification' : 'Add New Certification'}
          </DialogTitle>
          <DialogDescription>
            {certification ? 'Update certification details' : 'Add a new certification to your profile'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Certification Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. CISSP, CISA"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer *</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                placeholder="e.g. (ISC)², ISACA"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => handleInputChange('issue_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credential_id">Credential ID</Label>
              <Input
                id="credential_id"
                value={formData.credential_id}
                onChange={(e) => handleInputChange('credential_id', e.target.value)}
                placeholder="Certification ID/Number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credential_url">Verification URL</Label>
            <Input
              id="credential_url"
              type="url"
              value={formData.credential_url}
              onChange={(e) => handleInputChange('credential_url', e.target.value)}
              placeholder="Link to verify certification"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Certificate Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              {(formData.image_url || imageFile) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImageFile(null);
                    handleInputChange('image_url', '');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formData.image_url && !imageFile && (
              <img src={formData.image_url} alt="Certificate" className="mt-2 max-w-32 h-auto rounded border" />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="cyber-button">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                  Saving...
                </div>
              ) : (
                certification ? 'Update Certification' : 'Add Certification'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};