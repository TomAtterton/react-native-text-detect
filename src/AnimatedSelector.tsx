import React, { forwardRef, memo, useImperativeHandle, useMemo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Svg, { Polygon } from 'react-native-svg';
import styles from './style';
import Corner from './Corner';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { detectTextFromImage } from './utils';
import dragAnimation from './helpers/dragAnimation';

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
  onGenerateText: (text: string) => void;
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
      onGenerateText,
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
        dragAnimation({
          topRightX,
          topRightY,
          bottomRightX,
          bottomRightY,
          bottomLeftX,
          bottomLeftY,
          topLeftX,
          topLeftY,
          offsetX,
          offsetY,
          imageHeight,
          imageWidth,
        }),
      [
        topRightX,
        topRightY,
        bottomRightX,
        bottomRightY,
        bottomLeftX,
        bottomLeftY,
        topLeftX,
        topLeftY,
        offsetX,
        offsetY,
        imageHeight,
        imageWidth,
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
          async detectText() {
            const text = await detectTextFromImage({
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

            onGenerateText(text);
          },
        };
      },
      [
        bottomLeftX.value,
        bottomLeftY.value,
        bottomRightX.value,
        bottomRightY.value,
        imageUri,
        onGenerateText,
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
