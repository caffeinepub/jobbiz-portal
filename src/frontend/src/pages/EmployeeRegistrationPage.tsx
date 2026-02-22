import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeRegistrationPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    currentTitle: '',
    experience: '',
    skills: '',
    education: '',
    resume: '',
  });

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate registration process
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Registration successful! Your unique employee ID has been generated.');
      navigate({ to: '/profile' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <User className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Employee Registration</CardTitle>
              <CardDescription>Please login to continue with employee registration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={login} disabled={isLoggingIn} className="w-full" size="lg">
                {isLoggingIn ? 'Connecting...' : 'Login to Continue'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Employee Registration</h1>
          <p className="text-muted-foreground">Create your profile and start applying for jobs</p>
        </div>

        <Alert className="mb-6 border-accent/50 bg-accent/5">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription>
            A registration fee is required. Upon successful payment, you'll receive a unique employee ID.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Tell us about yourself and your professional background</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="New York, NY"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentTitle">Current Title</Label>
                  <Input
                    id="currentTitle"
                    name="currentTitle"
                    value={formData.currentTitle}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="5 years"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills *</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="List your key skills (e.g., JavaScript, React, Node.js)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education *</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Your educational background"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV Link</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="url"
                  value={formData.resume}
                  onChange={handleChange}
                  placeholder="https://example.com/resume.pdf"
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Registration Fee: $49</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Payment will be processed securely via Stripe. You'll receive your unique employee ID
                  immediately after payment confirmation.
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
