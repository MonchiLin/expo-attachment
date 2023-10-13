import React, { useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import type { InAppAlbumTypes } from './shared-types';
import { ReanimatedImage } from './base/base-image';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LightBox } from './light-box';
import { createLightBox } from './light-box/create-light-box';

type AlbumThumbnailViewItemProps = {
  asset: InAppAlbumTypes.Asset;
  preferredWidth?: number;
  onPress: (asset: InAppAlbumTypes.Asset, index: number) => void;
  index: number;
};

export function AlbumAssetThumbnailViewItem(
  props: AlbumThumbnailViewItemProps
) {
  const lightBox = createLightBox({
    type: 'image',
    payload: { uri: props.asset.uri },
    index: props.index,
  });
  const scale = useSharedValue(1);

  const onPress = () => {
    props.onPress(props.asset, props.index);
  };

  const onSelect = () => {
    scale.value = withSpring(scale.value === 1 ? 0.75 : 1);
  };

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(lightBox.registerEffect, []);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        ref={lightBox.viewRef}
        onLayout={lightBox.onLayout}
        style={[{ width: props.preferredWidth }, albumStyles.container]}
      >
        <ReanimatedImage
          style={[albumStyles.thumbnail, imageStyle]}
          source={{ uri: props.asset.uri }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const albumStyles = StyleSheet.create({
  container: {
    height: 100,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});
