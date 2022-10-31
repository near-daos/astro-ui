export const MAIN_PAGE_URL = '/';

export const MY_DAOS_URL = '/my/daos';
export const MY_FEED_URL = '/my/feed';

export const ALL_DAOS_URL = '/all/daos';
export const ALL_FEED_URL = '/all/feed';

export const DISCOVER = '/discover';

export const CFC_LIBRARY = '/cfc-library';
export const CFC_LIBRARY_TEMPLATE_VIEW = `${CFC_LIBRARY}/[template]`;

export const BOUNTIES = '/bounties';

export const CREATE_DAO_URL = '/create-dao-new';

export const SINGLE_DAO_PAGE = '/dao/[dao]';

export const SEARCH_PAGE_URL = '/search-results';

export const TERMS_AND_CONDITIONS = '/terms-conditions';

export const NOTIFICATIONS_PAGE_URL = '/notifications';
export const NOTIFICATIONS_SETTINGS_PAGE_URL = `${NOTIFICATIONS_PAGE_URL}/settings`;

export const ALL_PROPOSALS_PAGE_URL = '/dao/[dao]/proposals';
export const SINGLE_PROPOSAL_PAGE_URL = `${ALL_PROPOSALS_PAGE_URL}/[proposal]`;

export const GROUPS_PAGE_URL = '/dao/[dao]/groups/[group]';

const TREASURY_URL = '/dao/[dao]/treasury';
export const TREASURY_PAGE_URL = `${TREASURY_URL}/tokens`;
export const GOVERNANCE_TOKEN_INFO_URL = `${TREASURY_URL}/governance-token-info`;
export const CREATE_GOV_TOKEN_PAGE_URL = `${TREASURY_URL}/create-governance-token`;
export const CREATE_GOV_TOKEN_UNDER_CONSTRUCTION = `${TREASURY_URL}/under-construction`;

export const ALL_BOUNTIES_PAGE_URL = '/dao/[dao]/tasks/bounties/list';
export const SINGLE_BOUNTY_PAGE_URL =
  '/dao/[dao]/tasks/bounties/[bountyContext]';

export const DAO_SETTINGS_PAGE_URL = `${SINGLE_DAO_PAGE}/governance/settings`;
export const DAO_CONFIG_PAGE_URL = `${DAO_SETTINGS_PAGE_URL}/config`;
export const DAO_POLICY_PAGE_URL = `${DAO_SETTINGS_PAGE_URL}/policy`;
export const DAO_VERSION_PAGE_URL = `${DAO_SETTINGS_PAGE_URL}/version`;
export const DAO_CUSTOM_FC_TEMPLATES_PAGE_URL = `${DAO_SETTINGS_PAGE_URL}/custom-templates`;
export const MY_ACCOUNT_PAGE_URL = '/my-account';

export const DELEGATE_PAGE_URL = `${SINGLE_DAO_PAGE}/delegate`;

export const DRAFTS_PAGE_URL = `${SINGLE_DAO_PAGE}/drafts`;
export const DRAFT_PAGE_URL = `${SINGLE_DAO_PAGE}/drafts/[draft]`;
export const CREATE_DRAFT_PAGE_URL = `${SINGLE_DAO_PAGE}/create-draft`;
export const EDIT_DRAFT_PAGE_URL = `${DRAFT_PAGE_URL}/edit-draft`;

export const SELECTOR_TRANSACTION_PAGE_URL = '/callback/selectorTransaction';
