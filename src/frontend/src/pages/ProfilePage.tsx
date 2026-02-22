import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Briefcase, Building2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (!isAuthenticated) {
    navigate({ to: '/' });
    return null;
  }

  const principal = identity.getPrincipal().toString();

  const handleLogout = () => {
    clear();
    navigate({ to: '/' });
  };

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your Internet Identity details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">Principal ID</p>
                <p className="break-all font-mono text-sm">{principal}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Verified Account</Badge>
                <Badge variant="outline">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration Status</CardTitle>
              <CardDescription>Complete your registration to access all features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Employer Account</h3>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Register as an employer to post jobs and find talent
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/employer-registration">Register as Employer</a>
                  </Button>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Employee Account</h3>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Register as an employee to apply for jobs
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/employee-registration">Register as Employee</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button asChild variant="outline" className="justify-start">
                  <a href="/jobs">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </a>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <a href="/business-directory">
                    <Building2 className="mr-2 h-4 w-4" />
                    Business Directory
                  </a>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <a href="/add-business">
                    <Building2 className="mr-2 h-4 w-4" />
                    Add Business
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
