import AgreementForm from '@/components/accountability/agreement-form';
import PartnershipCard from '@/components/accountability/partnership-card';
import PartnershipForm from '@/components/accountability/partnership-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUserAuth } from '@/lib/auth/utils';
import { trpc } from '@/lib/trpc/api';
import { format } from 'date-fns';

export default async function AccountabilityIdPage({
  params,
}: {
  params: Promise<{ partnershipId: string }>;
}) {
  const { partnershipId } = await params;
  const partnership = await trpc.accountabilityPartnerships.getById({
    id: partnershipId,
  });
  const { session } = await getUserAuth();

  if (!partnership) {
    return <div>Partnership not found</div>;
  }

  if (!session) {
    return <div>You are not authenticated</div>;
  }

  if (!partnership.agreement) {
    return (
      <section className='flex flex-col items-center gap-4'>
        <Card className='w-80 md:w-full'>
          <CardHeader>
            <CardTitle>Create Agreement</CardTitle>
            <CardDescription>
              Create an agreement for your partnership.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgreementForm partnershipId={partnership.id} />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (
    partnership.user1Id !== session.user.id &&
    partnership.user2Id !== session.user.id
  ) {
    return (
      <section className='flex flex-col p-4 gap-4'>
        <h1>Partnership Proposal from {partnership.user1?.name}</h1>
        <Card className='w-80 md:w-96'>
          <CardHeader>
            <CardTitle>Penalty Proposal</CardTitle>
            <CardDescription>
              The penalty for missing your daily quests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Penalty: <span>{partnership.agreement.penaltyAmount}</span>{' '}
              <span>{partnership.agreement.penaltyUnit}</span>
            </p>
            <p>
              Cutoff Time:{' '}
              {format(
                new Date(
                  partnership.agreement.cutoffTime ??
                    new Date().setUTCHours(0, 0, 0, 0)
                ),
                'HH:mm a'
              )}
            </p>
            <div className='flex justify-end'>
              <PartnershipForm
                partnership={partnership}
                userId={session.user.id}
              />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section key={partnership.id} className='flex flex-col gap-4 p-4'>
      <h1>Partnership Agreement</h1>
      <PartnershipCard
        partnership={{
          ...partnership,
          user1: partnership.user1!,
          user2: partnership.user2!,
          agreement: partnership.agreement,
        }}
      />
    </section>
  );
}
