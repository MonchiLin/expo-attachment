import React, { type ForwardedRef, forwardRef } from 'react';
import type { ImageProps } from 'expo-image';
import { Image } from 'expo-image';
import Reanimated from 'react-native-reanimated';

export const BaseImage = forwardRef(
  (props: ImageProps, ref: ForwardedRef<Image>) => {
    return <Image {...props} ref={ref} />;
  }
);

export type BaseImage = typeof BaseImage;

export const ReanimatedImage = Reanimated.createAnimatedComponent(BaseImage);
