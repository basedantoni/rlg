import { AccountabilityPartnershipWithUsers } from '#/db/schema/accountabilityPartnerships';
import { Users } from '#/db/schema/users';

/**
 * Determines which user in a partnership is the current user and which is the partner
 * @param partnership The partnership containing user1 and user2
 * @param currentUserId The ID of the current user
 * @returns An object with currentUser and partner properties
 */
export const getPartnershipUsers = (
  partnership: AccountabilityPartnershipWithUsers,
  currentUserId: string
) => {
  const isUser1 = partnership.user1Id === currentUserId;

  // Determine current user and partner based on which user ID matches
  const currentUser = isUser1 ? partnership.user1 : partnership.user2;
  const partner = isUser1 ? partnership.user2 : partnership.user1;

  if (!currentUser || !partner) {
    throw new Error('Partnership is missing user information');
  }

  return {
    currentUser,
    partner,
    isUser1,
  };
};

/**
 * Type for the return value of getPartnershipUsers
 */
export type PartnershipUsers = {
  currentUser: Users;
  partner: Users;
  isUser1: boolean;
};
