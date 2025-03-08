import PenaltyToday from './penalty-today';
import {
  AccountabilityPartnershipWithUsers,
  AccountabilityPartnershipWithAgreement,
} from '#/db/schema/accountabilityPartnerships';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getUserAuth } from '#/lib/auth/utils';
import { getPartnershipUsers } from '#/lib/utils/partnership';

interface PartnershipCardProps {
  partnership: AccountabilityPartnershipWithUsers &
    AccountabilityPartnershipWithAgreement;
}

const PartnershipCard = async ({ partnership }: PartnershipCardProps) => {
  const { session } = await getUserAuth();

  if (!session) {
    return null;
  }

  const user = session.user;

  const { currentUser, partner, isUser1 } = getPartnershipUsers(
    partnership,
    user.id
  );

  return (
    <Card gradient className='min-w-80 md:min-w-96'>
      <CardHeader className='pb-1'>
        <CardTitle className='text-xl'>
          {isUser1 ? partnership.user2?.name : partnership.user1?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PenaltyToday
          partnership={partnership}
          currentUser={currentUser}
          partner={partner}
        />
      </CardContent>
    </Card>
  );
};

export default PartnershipCard;
