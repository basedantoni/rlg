'use client';

import { trpc } from '@/lib/trpc/client';
import { AccountabilityPartnershipWithAgreement } from '@/db/schema/accountabilityPartnerships';
import { AccountabilityPartnershipWithUsers } from '@/db/schema/accountabilityPartnerships';
import { Users } from '@/db/schema/users';
import { formatDate } from 'date-fns';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Spinner } from '../ui/kibo-ui/spinner';

const PenaltyToday = ({
  partnership,
  currentUser,
  partner,
}: {
  partnership: AccountabilityPartnershipWithUsers &
    AccountabilityPartnershipWithAgreement;
  currentUser: Users;
  partner: Users;
}) => {
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.penalties.getPenaltyToday.useQuery({
    id: partnership.agreement.id,
  });

  const { mutate: updatePenalty } = trpc.penalties.update.useMutation({
    onSuccess: () => {
      utils.penalties.getPenaltyToday.invalidate();
      toast.success('Penalty marked as complete');
    },
    onError: () => {
      toast.error('Failed to mark penalty as complete');
    },
  });

  const penalty = data?.p;
  // Get penalty count from the relationship instead of making a separate query
  const penaltyCount = partnership.agreement.penalties.length;

  const handleMarkComplete = () => {
    updatePenalty({
      id: penalty!.id,
      status: 'inactive',
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!penalty) {
    return <div>No penalty for today</div>;
  }

  if (!penalty.user) {
    return <div>Your partner ditched you...</div>;
  }

  const isCurrentUser = penalty.user.id === currentUser.id;

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex items-baseline justify-between'>
        <p className='text-sm'>
          From{' '}
          <span className='font-bold'>
            {isCurrentUser ? 'You' : penalty.user.name}
          </span>{' '}
          to{' '}
          <span className='font-bold'>
            {isCurrentUser ? partner.name : 'You'}
          </span>
        </p>
        <p className='text-2xl font-bold'>
          {(penalty.missedQuestsCount ?? 0) *
            (partnership.agreement.penaltyAmount ?? 0)}{' '}
          {partnership.agreement.penaltyUnit ?? ''}
        </p>
      </div>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm'>{formatDate(new Date(), 'MMM d, yyyy')}</p>
        </div>
        <div className='flex gap-2'>
          <p className='text-sm'>Penalty #{penaltyCount}</p>
          <Badge
            variant={penalty.status === 'active' ? 'destructive' : 'success'}
          >
            {penalty.status === 'active' ? 'Incomplete' : 'Complete'}
          </Badge>
        </div>
      </div>
      {isCurrentUser && penalty.status === 'active' && (
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleMarkComplete()}
        >
          Mark as Complete
        </Button>
      )}
    </div>
  );
};

export default PenaltyToday;
