import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import React, { memo } from 'react';
import { View } from 'react-native';
import styles from './style';

interface Props {
  xPosition: Animated.SharedValue<number>;
  yPosition: Animated.SharedValue<number>;
  xOffset: Animated.SharedValue<number>;
  yOffset: Animated.SharedValue<number>;
  borderColor?: string;
  backgroundColor?: string;
  handleColor?: string;
  handleBorderColor?: string;
  imageHeight: number;
  imageWidth: number;
}

const Corner = ({
  xPosition,
  yPosition,
  xOffset,
  yOffset,
  handleColor,
  handleBorderColor,
  imageHeight,
  imageWidth,
}: Props) => {
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.x = xPosition.value;
      ctx.y = yPosition.value;
    },
    onActive: (event, ctx) => {
      const { translationX, translationY } = event;
      const newX = ctx.x + translationX;
      const newY = ctx.y + translationY;
      if (newX > 0 && newX < imageWidth) {
        xPosition.value = newX;
      }
      if (newY > 0 && newY < imageHeight) {
        yPosition.value = newY;
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xPosition.value + xOffset.value },
      { translateY: yPosition.value + yOffset.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.handler, animatedStyle]}>
        <View
          style={[
            styles.handlerRound,
            { borderColor: handleColor, backgroundColor: handleBorderColor },
          ]}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default memo(Corner);
