import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, MapPin, DollarSign, Clock } from 'lucide-react';

// Mock data for demonstration
const mockJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Inc',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $180k',
    posted: '2 days ago',
    description: 'We are looking for an experienced software engineer to join our team...',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $150k',
    posted: '1 week ago',
    description: 'Lead product strategy and development for our flagship products...',
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Creative Design Studio',
    location: 'New York, NY',
    type: 'Contract',
    salary: '$80k - $110k',
    posted: '3 days ago',
    description: 'Create beautiful and intuitive user experiences for our clients...',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Analytics Corp',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$130k - $170k',
    posted: '5 days ago',
    description: 'Analyze complex datasets and build predictive models...',
  },
  {
    id: '5',
    title: 'Marketing Manager',
    company: 'Growth Partners',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$90k - $120k',
    posted: '1 week ago',
    description: 'Drive marketing strategy and lead our marketing team...',
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$110k - $160k',
    posted: '4 days ago',
    description: 'Build and maintain our cloud infrastructure and CI/CD pipelines...',
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-16">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground">Browse thousands of job openings from top companies</p>
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

      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No jobs found</h3>
            <p className="text-center text-muted-foreground">
              Try adjusting your search criteria
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
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <CardDescription className="text-base">{job.company}</CardDescription>
                  </div>
                  <Button>Apply Now</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                </div>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
