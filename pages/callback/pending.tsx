import { NextPage } from 'next';
import { Loader } from 'components/loader';

const Pending: NextPage = () => {
  return <Loader title="Connecting to the wallet" />;
};

export default Pending;
