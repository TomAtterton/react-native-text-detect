import React from 'react';
import { Image, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-text-detect' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const TextDetectModule = isTurboModuleEnabled
  ? require('./NativeTextDetect').default
  : NativeModules.TextDetect;

const TextDetect = TextDetectModule
  ? TextDetectModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

// export function multiply(a: number, b: number): Promise<number> {
//   return TextDetect.multiply(a, b);
// }

const ImageToTextView = ({}) => {
  return (
    <Image
      source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
      style={{ width: 200, height: 200 }}
    />
  );
};

export default ImageToTextView;
