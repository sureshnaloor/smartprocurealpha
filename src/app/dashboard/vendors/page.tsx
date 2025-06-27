"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { VendorModal } from "@/components/vendors/vendor-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getVendors } from "@/lib/actions";
import { Vendor } from "@/types";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const allVendors = await getVendors();
      setVendors(allVendors);
    } catch (err) {
      setError('Failed to load vendors');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      // For now, we'll just remove from local state
      // You can add a deleteVendor Server Action later if needed
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    } catch (err) {
      setError('Failed to delete vendor');
      console.error('Error deleting vendor:', err);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.contactName && vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <VendorModal onSuccess={fetchVendors} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{vendor.companyName}</CardTitle>
                  <p className="text-gray-600">{vendor.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={vendor.tier === 'tier1' ? 'default' : vendor.tier === 'tier2' ? 'secondary' : 'outline'}>
                    {vendor.tier.toUpperCase()}
                  </Badge>
                  <VendorModal
                    vendor={{
                      company_name: vendor.companyName,
                      contact_name: vendor.contactName || '',
                      email: vendor.email,
                      phone: vendor.phone || '',
                      tier: vendor.tier,
                      location: vendor.location || '',
                      material_class: vendor.materialClasses?.map(mc => mc.materialClass).join(', ') || '',
                    }}
                    onSuccess={fetchVendors}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVendor(vendor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Contact:</span>
                  <p>{vendor.contactName || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <p>{vendor.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <p>{vendor.location || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium">Material Classes:</span>
                  <p>{vendor.materialClasses?.map(mc => mc.materialClass).join(', ') || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No vendors found.</p>
        </div>
      )}
    </div>
  );
}
