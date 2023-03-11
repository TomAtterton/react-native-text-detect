import { Dimensions, StyleSheet } from 'react-native';

const HANDLE_SIZE = 20;
const HANDLE_OFFSET = HANDLE_SIZE * 3;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderWidth: 4,
    borderColor: 'red',
    marginTop: 80,
  },
  contentContainer: {
    flex: 1,
  },
  image: {
    resizeMode: 'cover',
  },
  animatedSelectorContainer: {
    position: 'absolute',
  },
  polygonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  handlerRound: {
    width: HANDLE_SIZE,
    position: 'absolute',
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    borderWidth: 2,
  },
  handler: {
    height: HANDLE_OFFSET,
    width: HANDLE_OFFSET,
    left: -(HANDLE_OFFSET / 2),
    top: -(HANDLE_OFFSET / 2),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: HANDLE_OFFSET / 2,
  },
});
