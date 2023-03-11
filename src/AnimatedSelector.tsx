import React, { forwardRef, memo, useImperativeHandle, useMemo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Polygon } from 'react-native-svg';
import styles from './style';
import Corner from './Corner';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { cropImage, HORIZONTAL_PADDING } from './utils';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

interface Props {
  defaultFrameCoordinates: {
    left: number;
    right: number;
    bottom: number;
    top: number;
  };
  screenHeight: number;
  imageHeight: number;
  imageWidth: number;
  overlayColor: string;
  overlayOpacity: number;
  overlayStrokeColor: string;
  overlayStrokeWidth: number;
  handleColor: string;
  handleBorderColor: string;
  imageUri: string | undefined;
  onCrop: (text: string) => void;
}

const AnimatedSelector = forwardRef(
  (
    {
      handleColor,
      handleBorderColor,
      defaultFrameCoordinates,
      screenHeight,
      imageHeight,
      imageWidth,
      overlayColor,
      overlayOpacity,
      overlayStrokeColor,
      overlayStrokeWidth,
      imageUri,
      onCrop,
    }: Props,
    ref
  ) => {
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const topLeftX = useSharedValue(defaultFrameCoordinates.left);
    const topLeftY = useSharedValue(defaultFrameCoordinates.top);

    const topRightX = useSharedValue(defaultFrameCoordinates.right);
    const topRightY = useSharedValue(defaultFrameCoordinates.top);

    const bottomRightX = useSharedValue(defaultFrameCoordinates.right);
    const bottomRightY = useSharedValue(defaultFrameCoordinates.bottom);

    const bottomLeftX = useSharedValue(defaultFrameCoordinates.left);
    const bottomLeftY = useSharedValue(defaultFrameCoordinates.bottom);

    const panGesture = useMemo(
      () =>
        Gesture.Pan()
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
          }),
      [
        bottomLeftX,
        bottomLeftY,
        bottomRightX,
        bottomRightY,
        imageHeight,
        imageWidth,
        offsetX,
        offsetY,
        topLeftX,
        topLeftY,
        topRightX,
        topRightY,
      ]
    );

    const animatedProps = useAnimatedProps(() => {
      const points = `${topLeftX.value + offsetX.value},${
        topLeftY.value + offsetY.value
      } ${topRightX.value + offsetX.value},${topRightY.value + offsetY.value} ${
        bottomRightX.value + offsetX.value
      },${bottomRightY.value + offsetY.value} ${
        bottomLeftX.value + offsetX.value
      },${bottomLeftY.value + offsetY.value}`;
      return {
        points,
      };
    });
    const cornerProps = {
      handleColor,
      handleBorderColor,
      imageHeight,
      imageWidth,
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          async focus() {
            const text = await cropImage({
              topLeft: {
                x: topLeftX.value,
                y: topLeftY.value,
              },
              topRight: {
                x: topRightX.value,
                y: topRightY.value,
              },
              bottomLeft: {
                x: bottomLeftX.value,
                y: bottomLeftY.value,
              },
              bottomRight: {
                x: bottomRightX.value,
                y: bottomRightY.value,
              },
              imageHeight: imageHeight,
              imageWidth: imageWidth,
              imageUri: imageUri,
            });

            onCrop(text);
          },
        };
      },
      [
        bottomLeftX.value,
        bottomLeftY.value,
        bottomRightX.value,
        bottomRightY.value,
        imageUri,
        onCrop,
        topLeftX.value,
        topLeftY.value,
        topRightX.value,
        topRightY.value,
        imageHeight,
        imageWidth,
      ]
    );
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: defaultFrameCoordinates.top,
          bottom: screenHeight - defaultFrameCoordinates.bottom,
        }}
      >
        <GestureDetector gesture={panGesture}>
          <Svg
            height={imageHeight}
            width={imageWidth}
            style={styles.polygonContainer}
          >
            <AnimatedPolygon
              animatedProps={animatedProps}
              fill={overlayColor}
              fillOpacity={overlayOpacity}
              stroke={overlayStrokeColor}
              strokeWidth={overlayStrokeWidth}
            />
          </Svg>
        </GestureDetector>

        <Corner
          key={1}
          xPosition={topLeftX}
          yPosition={topLeftY}
          xOffset={offsetX}
          yOffset={offsetY}
          {...cornerProps}
        />
        <Corner
          key={2}
          xPosition={topRightX}
          yPosition={topRightY}
          xOffset={offsetX}
          yOffset={offsetY}
          {...cornerProps}
        />
        <Corner
          key={3}
          xPosition={bottomLeftX}
          yPosition={bottomLeftY}
          xOffset={offsetX}
          yOffset={offsetY}
          {...cornerProps}
        />
        <Corner
          key={4}
          xPosition={bottomRightX}
          yPosition={bottomRightY}
          xOffset={offsetX}
          yOffset={offsetY}
          {...cornerProps}
        />
      </View>
    );
  }
);

export default memo(AnimatedSelector);
