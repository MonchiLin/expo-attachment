import React, { useEffect } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useMediaLibraryPermissionState } from '../internal/use-media-library-permission-state';
import { useAlbumState } from '../internal/use-album-state';
import { onAppShow } from '../internal/use-app-state';
import { AlbumAssetThumbnailViewItem } from './album-asset-thumbnail-view-item';
import type { InAppAlbumTypes } from './shared-types';
import LightBoxProvider, {
  useLightBoxContext,
} from './light-box/light-box-provider';
import { FlashList } from '@shopify/flash-list';

function Component() {
  const mediaLibraryPermissionState = useMediaLibraryPermissionState();
  const albumState = useAlbumState();
  const window = useWindowDimensions();
  const preferredWidth = window.width * 0.33;
  const [asset, setAsset] = React.useState<InAppAlbumTypes.Asset | null>(null);
  const lightBoxContext = useLightBoxContext();

  useEffect(() => {
    mediaLibraryPermissionState.requestPermissions();
  }, []);

  useEffect(() => {
    if (
      !mediaLibraryPermissionState.permission ||
      !mediaLibraryPermissionState.permission.granted
    ) {
      return;
    }
    albumState.getAlbums();
  }, [mediaLibraryPermissionState.permission]);

  // recheck permission on app show, because the permission might be changed
  onAppShow(() => {
    mediaLibraryPermissionState.requestPermissions();
  });

  const onAssetPress = (asset: InAppAlbumTypes.Asset, index: number) => {
    setAsset(asset);
    lightBoxContext.open(index);
  };

  // await user permission
  if (!mediaLibraryPermissionState.permission) {
    return (
      <View>
        <Text>同意授权以访问相册</Text>
      </View>
    );
  }

  if (!mediaLibraryPermissionState.permission.granted) {
    return (
      <TouchableOpacity onPress={mediaLibraryPermissionState.goAppSettings}>
        <Text>未授权, 点击重新请求授权</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.containerStyle}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={albumState.mediaFiles}
        keyExtractor={(item, index) => item.id}
        numColumns={3}
        renderItem={({ item, index }) => {
          return (
            <AlbumAssetThumbnailViewItem
              index={index}
              onPress={onAssetPress}
              asset={item}
              preferredWidth={preferredWidth}
            />
          );
        }}
      />
    </View>
  );
}

export const AlbumAssetThumbnailView = () => (
  <LightBoxProvider>
    <Component />
  </LightBoxProvider>
);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
});
