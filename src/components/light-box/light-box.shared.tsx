import { ImageSource } from 'expo-image';

export type Edge = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type SharedElementContext = {
  type: 'image' | 'video';
  payload: ImageSource | string;
  rect?: Edge;
  uniqueId: string;
  index: number;
};

export namespace SharedElementContext {
  export function equals(a: SharedElementContext, b: SharedElementContext) {
    return a.uniqueId === b.uniqueId;
  }
}
