export enum GA_EVENTS {
  CREATE_PROPOSAL = 'create_proposal',
  ACT_PROPOSAL = 'act_proposal',
  CREATE_DAO = 'create_dao',
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
