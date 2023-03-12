import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Dimensions,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageToTextView from 'react-native-text-detect';

const screenHeight = Dimensions.get('window').height;

export default function App() {
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [textValue, setTextValue] = React.useState<string>('');

  const ref = React.useRef<ImageToTextView>(null);

  const onSelectImage = async () => {
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    });
    setImageUri(result.assets[0].uri);
  };

  const onDetectText = async () => {
    return ref?.current?.detectText();
  };

  const onRemoveImage = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <ImageToTextView
          ref={ref}
          imageUri={imageUri}
          onGenerateText={(value) => {
            console.log('value', value);
            setTextValue(value);
          }}
        />
      ) : (
        <View style={styles.container} />
      )}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonsContainer}>
          <Button
            title={imageUri ? 'Generate Text' : 'On Select Image'}
            onPress={async () => {
              if (imageUri) {
                onDetectText();
                return;
              }
              onSelectImage();
            }}
          />
          {imageUri && (
            <Button title={'On Remove Image'} onPress={onRemoveImage} />
          )}
        </View>
        <ScrollView
          style={styles.textScrollView}
          contentContainerStyle={styles.textScrollContainerView}
        >
          <Text style={styles.title}>Image to text result:</Text>
          <Text style={styles.text}>{textValue}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: { height: screenHeight / 4 },
  textScrollView: {
    backgroundColor: 'white',
    padding: 20,
  },
  textScrollContainerView: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});
