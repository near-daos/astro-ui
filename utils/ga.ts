export enum GA_EVENTS {
  CREATE_DRAFT_PROPOSAL = 'create_draft_proposal',
  CREATE_PROPOSAL = 'create_proposal',
  ACT_PROPOSAL = 'act_proposal',
  CREATE_DAO = 'create_dao',
  DAO_UPGRADE_STARTED = 'dao_upgrade_started',
  DAO_UPGRADE_FINISHED = 'dao_upgrade_finished',
  SWITCH_ACCOUNT = 'switch_account',
  SWITCH_WALLET = 'switch_wallet',
  SIGN_IN = 'sign_in',
  SIGN_OUT = 'sign_out',
  REQUEST_ALLOWANCE_KEY = 'request_allowance_key',
  SAVE_FC_TEMPLATE = 'save_fc_template',
  GROUP_BULK_UPDATE = 'group_bulk_update',
  GROUP_BULK_UPDATE_INVALID_WALLET = 'group_bulk_update_invalid_wallet',
  GOVERNANCE_TOKEN_CREATE_FLOW = 'governance_token_create_flow',
}

type CustomGaEvent = {
  name: GA_EVENTS;
  accountId?: string;
  daoId?: string;
  params?: Record<string, string | number | string[]>;
};

export function sendGAEvent({
  name,
  accountId,
  daoId,
  params = {},
}: CustomGaEvent): void {
  if (!window || !window.gtag) {
    return;
  }

  window.gtag('event', name, {
    ...params,
    accountId: accountId ?? 'Not authorized',
    daoId: daoId ?? 'n/a',
  });
}
