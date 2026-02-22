import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { ApprovalStatus } from '../backend';

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
}

export default function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  if (status.__kind__ === 'pending') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
        <span className="text-sm text-muted-foreground">Awaiting Admin Approval</span>
      </div>
    );
  }

  if (status.__kind__ === 'approved') {
    const approvalDate = new Date(Number(status.approved) / 1000000);
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </Badge>
        <span className="text-sm text-muted-foreground">
          {approvalDate.toLocaleDateString()}
        </span>
      </div>
    );
  }

  if (status.__kind__ === 'rejected') {
    const rejectionDate = new Date(Number(status.rejected.timestamp) / 1000000);
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
          <span className="text-sm text-muted-foreground">
            {rejectionDate.toLocaleDateString()}
          </span>
        </div>
        {status.rejected.reason && (
          <p className="text-sm text-muted-foreground">
            Reason: {status.rejected.reason}
          </p>
        )}
      </div>
    );
  }

  return null;
}
