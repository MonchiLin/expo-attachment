import type { ReactNode } from 'react';
import React from 'react';
import Modal, { type ModalProps } from 'react-native-modal';

export interface BaseModalProps extends Partial<ModalProps> {
  children: ReactNode;
  visible: boolean;
}

export function BaseModal(props: BaseModalProps) {
  return (
    <Modal {...props} isVisible={props.visible}>
      {props.children}
    </Modal>
  );
}
