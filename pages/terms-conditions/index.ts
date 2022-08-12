import { GetServerSideProps } from 'next';

import { getTranslations } from 'utils/getTranslations';

import TermsAndConditions from './TermsAndConditions';

export default TermsAndConditions;

export const getServerSideProps: GetServerSideProps = async ({
  locale = 'en',
}) => {
  return {
    props: {
      ...(await getTranslations(locale)),
    },
  };
};
