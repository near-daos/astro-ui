import { Mixin } from 'ts-mixer';

import { NearService } from './services/NearService';
import { GovernanceTokenService } from './services/GovernanceTokenService';

export class SputnikNearService extends Mixin(
  NearService,
  GovernanceTokenService
) {}
