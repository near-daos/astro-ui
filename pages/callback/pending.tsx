import { NextPage } from 'next';
import { Loader } from 'components/loader';

const Pending: NextPage = () => {
  return <Loader title="Uploading data to the wallet" />;
};

export default Pending;
