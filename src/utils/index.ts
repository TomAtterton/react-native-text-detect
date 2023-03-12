import { Alert, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-text-detect' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export const HORIZONTAL_PADDING = 15;
export const VERTICAL_PADDING = 0;
// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const TextDetectModule = isTurboModuleEnabled
  ? require('../NativeTextDetect').default
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

export const detectTextFromImage = async ({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  imageWidth,
  imageHeight,
  imageUri,
}: {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  imageHeight: number;
  imageWidth: number;
  imageUri: string | undefined;
}) => {
  const coordinates = {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    height: imageHeight,
    width: imageWidth,
  };
  try {
    const value = await TextDetect.detectText(coordinates, imageUri);
    return value?.text ?? '';
  } catch (e) {
    Alert.alert('Error translating image', e?.message);
    throw e;
  }
};
