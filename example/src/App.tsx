import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageToTextView from 'react-native-text-detect';

const screenHeight = Dimensions.get('window').height;

export default function App() {
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [textValue, setTextValue] = React.useState<string>('');

  // TODO
  const onCrop = (value) => {
    // console.log('value', value);
    setTextValue(value);
  };

  const ref = React.useRef(null);

  const onSelectImage = async () => {
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    });

    console.log('Selecting Image', result.assets[0].uri);
    setImageUri(result.assets[0].uri);
  };

  const onRemoveImage = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <ImageToTextView ref={ref} imageUri={imageUri} onCrop={onCrop} />
      ) : (
        <View style={{ flex: 1 }} />
      )}
      <View style={{ height: screenHeight / 4 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            title={imageUri ? 'Generate Text' : 'On Select Image'}
            onPress={async () => {
              if (imageUri) {
                ref?.current?.focus();
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
          style={{
            backgroundColor: 'white',
            padding: 20,
          }}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
            Image to text result:
          </Text>
          <Text style={{ fontSize: 16, color: 'gray', marginTop: 10 }}>
            {textValue}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
