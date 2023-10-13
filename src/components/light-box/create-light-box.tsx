import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useLightBoxContext } from './light-box-provider';
import { SharedElementContext } from './light-box.shared';
import { uid } from '../../internal/utilities';
import { LightBoxProps } from 'expo-inapp-album';

export const createLightBox = ({
  type,
  payload,
  index,
  ...props
}: LightBoxProps) => {
  const context = useLightBoxContext();
  const uniqueId = useRef(uid());
  const viewRef = useRef<View | null>(null);

  const registerEffect = () => {
    const sharedElementContext: SharedElementContext = {
      type: type,
      payload: payload,
      index: index,
      uniqueId: uniqueId.current,
    };
    context._register(sharedElementContext);

    return () => {
      context._unregister(sharedElementContext);
    };
  };

  const onLayout = () => {
    viewRef.current?.measureInWindow((x, y, width, height) => {
      const sharedElementContext: SharedElementContext = {
        type: type,
        payload: payload,
        index: index,
        uniqueId: uniqueId.current,
        rect: {
          x: x,
          y: y,
          width: width,
          height: height,
        },
      };
      context._update(sharedElementContext);
    });
  };

  return {
    onLayout,
    viewRef,
    registerEffect,
  };
};
