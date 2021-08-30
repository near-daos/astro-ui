import cardFooterStyles from 'features/create-dao/components/template/card-footer.module.scss';
import { DAOType } from 'pages/create-dao/steps/types';

export const backgrounds: Record<DAOType, string> = {
  club: cardFooterStyles.club,
  cooperative: cardFooterStyles.cooperative,
  corporation: cardFooterStyles.corporation,
  foundation: cardFooterStyles.foundation
};
