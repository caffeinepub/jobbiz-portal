import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Building2, Users, Shield, Zap, Globe } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-background via-muted/20 to-accent/10">
        <div className="container py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Gateway to{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Opportunities
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Connect employers with talent and discover local businesses. All in one powerful platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                    <Link to="/business-directory">Explore Businesses</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full sm:w-auto">
                    {isLoggingIn ? 'Connecting...' : 'Get Started'}
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                    <Link to="/business-directory">Browse Directory</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Why Choose JobBiz?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A comprehensive platform combining job search and business discovery
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/50 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Job Portal</CardTitle>
              <CardDescription>
                Connect employers with talented professionals. Post jobs or find your dream career.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Business Directory</CardTitle>
              <CardDescription>
                Discover local businesses and services. List your business to reach more customers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                <Shield className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Login securely with Internet Identity using passkeys, biometrics, or your preferred method.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Users className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle>Verified Profiles</CardTitle>
              <CardDescription>
                All users receive unique IDs upon registration for enhanced trust and security.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Zap className="h-6 w-6 text-chart-3" />
              </div>
              <CardTitle>Fast & Reliable</CardTitle>
              <CardDescription>
                Built on the Internet Computer for speed, security, and decentralization.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <Globe className="h-6 w-6 text-chart-4" />
              </div>
              <CardTitle>Global Reach</CardTitle>
              <CardDescription>
                Connect with opportunities and businesses from anywhere in the world.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Get Started Today</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose your path and join thousands of users already benefiting from JobBiz
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-primary/50 transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">For Employers</CardTitle>
                <CardDescription>Post jobs and find the perfect candidates for your team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/employer-registration">Register as Employer</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-accent/50 transition-all hover:border-accent hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">For Job Seekers</CardTitle>
                <CardDescription>Find your next opportunity and advance your career</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/employee-registration">Register as Employee</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-chart-1/50 transition-all hover:border-chart-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">For Businesses</CardTitle>
                <CardDescription>List your business and reach more customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/add-business">Add Your Business</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
