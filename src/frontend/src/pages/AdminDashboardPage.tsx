import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useGetAllEmployees,
  useGetAllEmployers,
  useGetAllBusinesses,
  useApproveEmployee,
  useRejectEmployee,
  useApproveEmployer,
  useRejectEmployer,
  useApproveBusiness,
  useRejectBusiness,
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Shield, Users, Briefcase, Building2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Employee, Employer, Business } from '../backend';

export default function AdminDashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: employees = [], isLoading: employeesLoading } = useGetAllEmployees();
  const { data: employers = [], isLoading: employersLoading } = useGetAllEmployers();
  const { data: businesses = [], isLoading: businessesLoading } = useGetAllBusinesses();

  const approveEmployeeMutation = useApproveEmployee();
  const rejectEmployeeMutation = useRejectEmployee();
  const approveEmployerMutation = useApproveEmployer();
  const rejectEmployerMutation = useRejectEmployer();
  const approveBusinessMutation = useApproveBusiness();
  const rejectBusinessMutation = useRejectBusiness();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTarget, setRejectTarget] = useState<{
    type: 'employee' | 'employer' | 'business';
    id: string;
    name: string;
  } | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (!isAuthenticated) {
    navigate({ to: '/' });
    return null;
  }

  if (isAdminLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Shield className="mb-4 h-16 w-16 text-destructive" />
            <h2 className="mb-2 text-2xl font-bold">Access Denied</h2>
            <p className="text-center text-muted-foreground">
              You do not have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="mt-6">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingEmployees = employees.filter((e) => e.approvalStatus.__kind__ === 'pending');
  const pendingEmployers = employers.filter((e) => e.approvalStatus.__kind__ === 'pending');
  const pendingBusinesses = businesses.filter((b) => b.approvalStatus.__kind__ === 'pending');

  const handleApproveEmployee = async (id: string, name: string) => {
    try {
      await approveEmployeeMutation.mutateAsync(id);
      toast.success(`Approved employee: ${name}`);
    } catch (error) {
      toast.error('Failed to approve employee');
      console.error(error);
    }
  };

  const handleApproveEmployer = async (id: string, name: string) => {
    try {
      await approveEmployerMutation.mutateAsync(id);
      toast.success(`Approved employer: ${name}`);
    } catch (error) {
      toast.error('Failed to approve employer');
      console.error(error);
    }
  };

  const handleApproveBusiness = async (id: string, name: string) => {
    try {
      await approveBusinessMutation.mutateAsync(id);
      toast.success(`Approved business: ${name}`);
    } catch (error) {
      toast.error('Failed to approve business');
      console.error(error);
    }
  };

  const openRejectDialog = (
    type: 'employee' | 'employer' | 'business',
    id: string,
    name: string
  ) => {
    setRejectTarget({ type, id, name });
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;

    try {
      if (rejectTarget.type === 'employee') {
        await rejectEmployeeMutation.mutateAsync({
          id: rejectTarget.id,
          reason: rejectReason || 'No reason provided',
        });
      } else if (rejectTarget.type === 'employer') {
        await rejectEmployerMutation.mutateAsync({
          id: rejectTarget.id,
          reason: rejectReason || 'No reason provided',
        });
      } else if (rejectTarget.type === 'business') {
        await rejectBusinessMutation.mutateAsync({
          id: rejectTarget.id,
          reason: rejectReason || 'No reason provided',
        });
      }
      toast.success(`Rejected ${rejectTarget.type}: ${rejectTarget.name}`);
      setRejectDialogOpen(false);
      setRejectTarget(null);
      setRejectReason('');
    } catch (error) {
      toast.error(`Failed to reject ${rejectTarget.type}`);
      console.error(error);
    }
  };

  return (
    <div className="container py-16">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Review and approve pending registrations</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEmployees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Employers</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEmployers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBusinesses.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">
            Employees ({pendingEmployees.length})
          </TabsTrigger>
          <TabsTrigger value="employers">
            Employers ({pendingEmployers.length})
          </TabsTrigger>
          <TabsTrigger value="businesses">
            Businesses ({pendingBusinesses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          {employeesLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : pendingEmployees.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No pending employees</h3>
                <p className="text-center text-muted-foreground">
                  All employee registrations have been reviewed
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingEmployees.map((employee) => (
              <Card key={employee.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{employee.name}</CardTitle>
                      <CardDescription>ID: {employee.id}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact</p>
                      <p className="text-sm">{employee.contact}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Experience</p>
                      <p className="text-sm">{employee.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Skills</p>
                      <p className="text-sm">{employee.skills}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Education</p>
                      <p className="text-sm">{employee.education}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveEmployee(employee.id, employee.name)}
                      disabled={approveEmployeeMutation.isPending}
                      className="flex-1"
                    >
                      {approveEmployeeMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => openRejectDialog('employee', employee.id, employee.name)}
                      disabled={rejectEmployeeMutation.isPending}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="employers" className="space-y-4">
          {employersLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : pendingEmployers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No pending employers</h3>
                <p className="text-center text-muted-foreground">
                  All employer registrations have been reviewed
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingEmployers.map((employer) => (
              <Card key={employer.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{employer.companyName}</CardTitle>
                      <CardDescription>ID: {employer.id}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Industry</p>
                      <p className="text-sm">{employer.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company Size</p>
                      <p className="text-sm">{employer.size}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Website</p>
                      <p className="text-sm">{employer.website}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact</p>
                      <p className="text-sm">{employer.contact}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-sm">{employer.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveEmployer(employer.id, employer.companyName)}
                      disabled={approveEmployerMutation.isPending}
                      className="flex-1"
                    >
                      {approveEmployerMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        openRejectDialog('employer', employer.id, employer.companyName)
                      }
                      disabled={rejectEmployerMutation.isPending}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="businesses" className="space-y-4">
          {businessesLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : pendingBusinesses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No pending businesses</h3>
                <p className="text-center text-muted-foreground">
                  All business listings have been reviewed
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingBusinesses.map((business) => (
              <Card key={business.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{business.name}</CardTitle>
                      <CardDescription>ID: {business.id}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="text-sm">{business.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-sm">{business.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact</p>
                      <p className="text-sm">{business.contact}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-sm">{business.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveBusiness(business.id, business.name)}
                      disabled={approveBusinessMutation.isPending}
                      className="flex-1"
                    >
                      {approveBusinessMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => openRejectDialog('business', business.id, business.name)}
                      disabled={rejectBusinessMutation.isPending}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {rejectTarget?.type}</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {rejectTarget?.name}. This will be visible to the user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
