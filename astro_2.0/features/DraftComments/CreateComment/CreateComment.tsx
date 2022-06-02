import React, { FC } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export const CreateComment: FC = () => {
  return <ReactQuill />;
};
