import { Edge } from '../components/light-box/light-box.shared';

export function uid() {
  return Math.random().toString(16).slice(2);
}

export const edgeNone = () => {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function calculateFramePosition(
  elementEdge: Edge,
  screenSize: { width: number; height: number },
  progress: number
) {
  const { x, y, width, height } = elementEdge;
  const { width: screenWidth, height: screenHeight } = screenSize;

  const targetWidth = screenWidth;
  const targetHeight = screenHeight;
  const targetX = (screenWidth - targetWidth) / 2;
  const targetY = (screenHeight - targetHeight) / 2;

  return {
    x: x + (targetX - x) * progress,
    y: y + (targetY - y) * progress,
    width: width + (targetWidth - width) * progress,
    height: height + (targetHeight - height) * progress,
  };
}
