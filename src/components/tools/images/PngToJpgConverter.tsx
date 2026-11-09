import React from 'react';
import { ImageConverter } from './ImageConverter';

export const PngToJpgConverter: React.FC = () => {
  return <ImageConverter defaultTarget="jpg" />;
};
