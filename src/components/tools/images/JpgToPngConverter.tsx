import React from 'react';
import { ImageConverter } from './ImageConverter';

export const JpgToPngConverter: React.FC = () => {
  return <ImageConverter defaultTarget="png" />;
};
