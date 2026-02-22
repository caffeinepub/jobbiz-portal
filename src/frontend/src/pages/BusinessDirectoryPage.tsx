import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Phone, MapPin, Plus, Loader2 } from 'lucide-react';
import { useGetAllBusinesses } from '../hooks/useQueries';

export default function BusinessDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: businesses = [], isLoading } = useGetAllBusinesses();

  // Filter to only approved businesses
  const approvedBusinesses = businesses.filter(
    (business) => business.approvalStatus.__kind__ === 'approved'
  );

  const filteredBusinesses = approvedBusinesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-16">
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Business Directory</h1>
            <p className="text-muted-foreground">Discover approved local businesses and services</p>
          </div>
          <Button asChild>
            <Link to="/add-business">
              <Plus className="mr-2 h-4 w-4" />
              Add Your Business
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search businesses by name, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : filteredBusinesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No businesses found</h3>
            <p className="text-center text-muted-foreground">
              {approvedBusinesses.length === 0
                ? 'No approved businesses yet. Be the first to add your business!'
                : 'Try adjusting your search criteria'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{business.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {business.category}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{business.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{business.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{business.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
