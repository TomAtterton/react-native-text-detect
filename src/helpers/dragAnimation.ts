import { Gesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const dragAnimation = ({
  topRightX,
  topRightY,
  topLeftX,
  topLeftY,
  bottomRightX,
  bottomRightY,
  bottomLeftY,
  bottomLeftX,
  offsetX,
  offsetY,
  imageWidth,
  imageHeight,
}: {
  topRightX: Animated.SharedValue<number>;
  topRightY: Animated.SharedValue<number>;
  topLeftX: Animated.SharedValue<number>;
  topLeftY: Animated.SharedValue<number>;
  bottomRightX: Animated.SharedValue<number>;
  bottomRightY: Animated.SharedValue<number>;
  bottomLeftY: Animated.SharedValue<number>;
  bottomLeftX: Animated.SharedValue<number>;
  offsetX: Animated.SharedValue<number>;
  offsetY: Animated.SharedValue<number>;
  imageWidth: number;
  imageHeight: number;
}) => {
  return Gesture.Pan()
    .onUpdate((e) => {
      // update corner x and y position based gesture
      const { translationX, translationY } = e;
      if (
        topRightX.value + translationX < imageWidth &&
        topLeftX.value + translationX > 0 &&
        bottomRightX.value + translationX < imageWidth &&
        bottomLeftX.value + translationX > 0
      ) {
        offsetX.value = translationX;
      }
      if (
        bottomRightY.value + translationY < imageHeight &&
        topRightY.value + translationY > 0 &&
        bottomLeftY.value + translationY < imageHeight &&
        topLeftY.value + translationY > 0
      ) {
        offsetY.value = translationY;
      }
    })
    .onEnd(() => {
      // Update corner x and y position based on offset
      topLeftX.value += offsetX.value;
      topRightX.value += offsetX.value;
      topLeftY.value += offsetY.value;
      topRightY.value += offsetY.value;
      bottomRightX.value += offsetX.value;
      bottomRightY.value += offsetY.value;
      bottomLeftX.value += offsetX.value;
      bottomLeftY.value += offsetY.value;

      // Reset offset
      offsetX.value = 0;
      offsetY.value = 0;
    });
};

export default dragAnimation;
