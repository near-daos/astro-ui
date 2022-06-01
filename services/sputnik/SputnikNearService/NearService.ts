import { Mixin } from 'ts-mixer';

import { GovernanceTokenService } from './subServices/GovernanceTokenService';
import { SputnikNearService as NearService } from './subServices/SputnikNearService';

export class SputnikNearService extends Mixin(
  NearService,
  GovernanceTokenService
) {}
