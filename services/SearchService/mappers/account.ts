import { AccountIndex } from 'services/SearchService/types';
import { UserContacts } from 'services/NotificationsService/types';

export function mapAccountIndexToUserContacts(
  index: AccountIndex
): UserContacts | null {
  if (!index) {
    return null;
  }

  return {
    accountId: index.accountId,
    email: index.email,
    isEmailVerified: index.isEmailVerified,
    phoneNumber: index.phoneNumber ?? '',
    isPhoneVerified: index.isPhoneVerified,
  };
}
