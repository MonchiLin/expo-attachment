import { useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Linking, Platform } from 'react-native';

export function useMediaLibraryPermissionState() {
  const [permission, setPermission] =
    useState<MediaLibrary.PermissionResponse | null>(null);

  const requestPermissions = () => {
    MediaLibrary.requestPermissionsAsync(false).then((res) => {
      setPermission(res);
    });
  };

  const goAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return {
    permission,
    requestPermissions,
    goAppSettings,
  };
}
