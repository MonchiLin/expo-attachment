import React from 'react';
import type { BaseModalProps } from './base/base-modal';
import { BaseModal } from './base/base-modal';
import { View } from 'react-native';

export interface AttachmentModalEntry {}

export interface AttachmentModalProps extends BaseModalProps {}

export function AttachmentModal(props: AttachmentModalProps) {
  return (
    <BaseModal visible={props.visible} swipeDirection={'down'}>
      <View />
    </BaseModal>
  );
}
