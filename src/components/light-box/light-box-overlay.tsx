import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { Edge, SharedElementContext } from './light-box.shared';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BaseImage } from '../base/base-image';
import {
  calculateFramePosition,
  delay,
  edgeNone,
} from '../../internal/utilities';
import { useSyncState } from '../../internal/use-sync-state';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface LightBoxOverlayProps {
  visible: boolean;
  sharedElement: SharedElementContext | undefined;
  onWillClose?: () => void;
  onDidClose?: () => void;
  onWillOpen?: () => void;
  onDidOpen?: () => void;
}

const ATouchableWithoutFeedback = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
);

export const LightBoxOverlay = (props: LightBoxOverlayProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  const insideVisible = useSyncState(props.visible);
  const sharedContextSnapshot = useRef<SharedElementContext | undefined>(
    undefined
  );
  const sharedElementStyles = useSharedValue(edgeNone());
  const windowDimensions = useWindowDimensions();
  const transited = useSyncState(false);

  useEffect(() => {
    if (props.visible) {
      transited.setState(false);
      sharedContextSnapshot.current = props.sharedElement;
      willOpen();
    } else {
      willClose();
    }
  }, [props.visible, props.sharedElement]);

  const onWillOpenCallback = () => {
    props.onDidOpen?.();
    transited.setState(true);
  };

  const onWillCloseCallback = () => {
    props.onDidClose?.();
    insideVisible.setState(false);
    props.sharedElement = undefined;
  };

  const willOpen = async () => {
    props.onWillOpen?.();
    insideVisible.setState(true);
    const startPosition: Edge = sharedContextSnapshot.current!.rect!;
    sharedElementStyles.value = startPosition;
    await delay(1);
    sharedElementStyles.value = withTiming(
      calculateFramePosition(startPosition, windowDimensions, 1),
      { duration: 200 }
    );
    setTimeout(() => {
      onWillOpenCallback();
    }, 220);
  };

  const willClose = () => {
    props.onWillClose?.();
    if (sharedContextSnapshot.current) {
      sharedElementStyles.value = withTiming(
        sharedContextSnapshot.current!.rect!,
        { duration: 200 }
      );
      setTimeout(() => {
        onWillCloseCallback();
      }, 220);
    } else {
      onWillCloseCallback();
    }
  };

  const sharedElementAnimatedStyles = useAnimatedStyle(() => ({
    width: sharedElementStyles.value.width,
    height: sharedElementStyles.value.height,
    left: sharedElementStyles.value.x,
    top: safeAreaInsets.top + sharedElementStyles.value.y,
  }));

  const showElement = sharedContextSnapshot.current && insideVisible.state;

  return (
    <View style={[insideVisible.state ? styles.overlay : styles.none]}>
      <Animated.View style={[styles.itemBox, sharedElementAnimatedStyles]}>
        {showElement && (
          <BaseImage
            contentFit={'cover'}
            style={styles.element}
            source={sharedContextSnapshot.current!.payload}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 1000,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  none: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    overflow: 'hidden',
    display: 'none',
  },
  itemBox: {
    position: 'absolute',
  },
  element: {
    width: '100%',
    height: '100%',
  },
});
