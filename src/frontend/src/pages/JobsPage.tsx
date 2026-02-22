import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, MapPin, DollarSign, Clock, Loader2 } from 'lucide-react';
import { useGetAllEmployers } from '../hooks/useQueries';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: employers = [], isLoading } = useGetAllEmployers();

  // Filter to only approved employers
  const approvedEmployers = employers.filter(
    (employer) => employer.approvalStatus.__kind__ === 'approved'
  );

  // Create mock jobs from approved employers
  const jobs = approvedEmployers.map((employer, index) => ({
    id: employer.id,
    title: `Position at ${employer.companyName}`,
    company: employer.companyName,
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $120k',
    posted: `${index + 1} days ago`,
    description: employer.description,
    industry: employer.industry,
  }));

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-16">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">Browse job openings from approved employers</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs by title, company, or location..."
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
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No jobs found</h3>
            <p className="text-center text-muted-foreground">
              {jobs.length === 0
                ? 'No approved employers have posted jobs yet'
                : 'Try adjusting your search criteria'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base">{job.company}</CardDescription>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.posted}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.industry}</span>
                  </div>
                </div>
                <Button className="w-full md:w-auto">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
