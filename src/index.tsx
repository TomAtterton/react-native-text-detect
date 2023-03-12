import React, { forwardRef, memo, useEffect, useMemo, useState } from 'react';

import { Dimensions, Image, View } from 'react-native';
import styles from './style';

import AnimatedSelector from './AnimatedSelector';
import { useAnimatedRef } from 'react-native-reanimated';
import { HORIZONTAL_PADDING, VERTICAL_PADDING } from './utils';

interface Props {
  handleColor?: string;
  handleBorderColor?: string;
  overlayColor?: string;
  overlayStrokeWidth?: number;
  overlayOpacity?: number;
  overlayStrokeColor?: string;
  imageUri?: string;
  defaultFrameCoordinates?: {
    left: number;
    right: number;
    bottom: number;
    top: number;
  };
  onGenerateText: (text: string) => void;
}

const ScreenWidth = Dimensions.get('window').width;

const ImageToTextView = forwardRef(
  (
    {
      handleColor = 'white',
      handleBorderColor = 'blue',
      overlayColor = 'blue',
      overlayStrokeWidth = 3,
      overlayOpacity = 0.5,
      overlayStrokeColor = 'blue',
      imageUri,
      onGenerateText,
    }: Props,
    ref
  ) => {
    const [viewHeight, setViewHeight] = useState(0);
    const [viewWidth, setViewWidth] = useState(0);

    const [imageHeight, setImageHeight] = useState(0);
    const [imageWidth, setImageWidth] = useState(0);

    useEffect(() => {
      imageUri &&
        Image.getSize(imageUri, (width, height) => {
          setImageHeight(height);
          setImageWidth(width);
        });
    }, [imageUri]);

    const aref = useAnimatedRef();

    const [frameCoords, setFrameCoords] = useState<{
      top: number;
      bottom: number;
      left: number;
      right: number;
    } | null>(null);

    const ratio = useMemo(() => {
      if (!imageHeight || !imageWidth) return 1;
      return Math.min(ScreenWidth / imageWidth, viewHeight / imageHeight);
    }, [imageHeight, imageWidth, viewHeight]);

    useEffect(() => {
      if (imageHeight && imageWidth && ratio) {
        setFrameCoords({
          top: VERTICAL_PADDING,
          bottom: imageHeight * ratio + VERTICAL_PADDING,
          left: HORIZONTAL_PADDING,
          right: viewWidth - HORIZONTAL_PADDING,
        });
      }
    }, [ratio, imageHeight, imageWidth, viewWidth]);

    return (
      <View style={styles.container}>
        <View
          style={styles.contentContainer}
          onLayout={(e) => {
            const height = e?.nativeEvent?.layout?.height || 0;
            const width = e?.nativeEvent?.layout?.width || 0;
            setViewHeight(height);
            setViewWidth(width);
          }}
        >
          <Image
            ref={aref}
            source={{ uri: imageUri }}
            resizeMode={'cover'}
            style={[
              {
                height: imageHeight * ratio,
                width: '100%',
              },
            ]}
          />
          {frameCoords && (
            <AnimatedSelector
              ref={ref}
              imageUri={imageUri}
              onGenerateText={onGenerateText}
              handleColor={handleColor}
              handleBorderColor={handleBorderColor}
              defaultFrameCoordinates={frameCoords}
              imageHeight={imageHeight * ratio}
              imageWidth={viewWidth}
              screenHeight={viewHeight}
              overlayColor={overlayColor}
              overlayOpacity={overlayOpacity}
              overlayStrokeColor={overlayStrokeColor}
              overlayStrokeWidth={overlayStrokeWidth}
            />
          )}
        </View>
      </View>
    );
  }
);
export default memo(ImageToTextView);
