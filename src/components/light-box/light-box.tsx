import { ReactNode, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useLightBoxContext } from './light-box-provider';
import { ImageSource } from 'expo-image';
import { SharedElementContext } from './light-box.shared';
import { uid } from '../../internal/utilities';

export type LightBoxProps = {
  type: 'image' | 'video';
  payload: string | ImageSource;
  index: number;
  children?: ReactNode;
};

export const LightBox = ({ type, payload, index, ...props }: LightBoxProps) => {
  const context = useLightBoxContext();
  const uniqueId = useRef(uid());
  const view = useRef<View | null>(null);

  useEffect(() => {
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
  }, []);

  const onLayout = () => {
    view.current?.measureInWindow((x, y, width, height) => {
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

  return (
    <View onLayout={onLayout} ref={view}>
      {props.children}
    </View>
  );
};
