import { trpc } from '#lib/trpc/api';
import { Users } from 'lucide-react';
import AgreementForm from '#components/accountability/agreement-form';
import PartnershipForm from '#components/accountability/partnership-form';
import PartnershipModal from '#components/accountability/partnership-modal';
import PartnershipCard from '#components/accountability/partnership-card';
import Link from 'next/link';
import { CopyableArticle } from '#components/ui/custom/copyable-article';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/ui/card';
import {
  AccountabilityPartnershipWithUsers,
  AccountabilityPartnershipWithAgreement,
} from '@repo/db';
import { env } from '#lib/env.mjs';
import { format } from 'date-fns';

const EmptyState = () => {
  return (
    <section className='flex h-full w-full flex-col items-center justify-center'>
      <div className='flex h-full flex-col gap-8 items-center justify-center text-center max-w-[300px]'>
        <Users className='h-16 w-16 stroke-2' />
        <div className='flex flex-col gap-3'>
          <h2 className='text-2xl font-bold'>No Accountability Found</h2>
          <p className='text-sm text-muted-foreground max-w-[408px]'>
            You don&apos;t have any accountability agreements yet. Start a new
            agreement
          </p>
        </div>
        <PartnershipForm />
      </div>
    </section>
  );
};

const PartnershipCardSection = ({
  partnership,
}: {
  partnership: AccountabilityPartnershipWithUsers &
    AccountabilityPartnershipWithAgreement;
}) => {
  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex gap-2 items-center'>
        <h1>Accountability Partnerships</h1>
        <PartnershipModal />
      </div>
      <Link href={`/accountability/${partnership.id}`}>
        <PartnershipCard
          partnership={{
            ...partnership,
            user1: partnership.user1,
            user2: partnership.user2,
            agreement: partnership.agreement,
          }}
        />
      </Link>
    </div>
  );
};

const AgreementFormSection = ({ partnershipId }: { partnershipId: string }) => {
  return (
    <section className='flex flex-col mt-12 items-center gap-4'>
      <h1>Partnership Agreement</h1>
      <Card className='w-80 md:w-96'>
        <CardHeader>
          <CardTitle>Create Agreement</CardTitle>
          <CardDescription>
            Create an agreement for your partnership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgreementForm partnershipId={partnershipId} />
        </CardContent>
      </Card>
    </section>
  );
};

const PenaltyProposalSection = ({
  partnership,
}: {
  partnership: AccountabilityPartnershipWithUsers &
    AccountabilityPartnershipWithAgreement;
}) => {
  return (
    <section className='flex flex-col gap-4'>
      <h1>Partnership Agreement</h1>
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
            <CopyableArticle
              text={`${env.BASE_URL}/accountability/${partnership.id}`}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default async function AccountabilityPage() {
  const accountabilityPartnerships =
    await trpc.accountabilityPartnerships.getAll();

  if (accountabilityPartnerships.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className='flex flex-col flex-1 p-2 space-y-4 h-screen overflow-hidden slim-scroll'>
      {accountabilityPartnerships.map((partnership) => {
        // Case 1: Complete partnership with both users and agreement
        if (partnership.user1 && partnership.user2 && partnership.agreement) {
          return (
            <PartnershipCardSection
              key={partnership.id}
              partnership={{
                ...partnership,
                user1: partnership.user1!,
                user2: partnership.user2!,
              }}
            />
          );
        }

        // Case 2: No agreement exists yet
        if (!partnership.agreement) {
          return (
            <AgreementFormSection
              key={partnership.id}
              partnershipId={partnership.id}
            />
          );
        }

        // Case 3: Agreement exists but user2 hasn't accepted yet
        return (
          <PenaltyProposalSection
            key={partnership.id}
            partnership={{
              ...partnership,
              user1: partnership.user1!,
              user2: partnership.user2!,
            }}
          />
        );
      })}
    </section>
  );
}
