import React, {useState, useRef, useEffect} from 'react';
import {View, Image, StyleSheet, Text as RNText} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import ViewShot from 'react-native-view-shot';
import {log} from '../utils/logger';

export default function CameraInput({onCapture, watermarkText = 'Opname'}) {
  const [rawPhotoUri, setRawPhotoUri] = useState(null); // aslinya dari kamera
  const [finalPhotoUri, setFinalPhotoUri] = useState(null); // hasil viewShot
  const [timestamp, setTimestamp] = useState('');
  const viewShotRef = useRef();

  const handleCapture = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
      },
      async response => {
        if (response.didCancel) {
          log.info('Camera - Component: ', 'User cancelled camera');
        } else if (response.errorCode) {
          log.error('Camera error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setRawPhotoUri(uri);

          const now = new Date();
          const formattedDate = now.toLocaleString();
          setTimestamp(formattedDate);
        }
      },
    );
  };

  useEffect(() => {
    if (rawPhotoUri && viewShotRef.current) {
      const timer = setTimeout(() => {
        viewShotRef.current.capture().then(markedUri => {
          setFinalPhotoUri(markedUri);
          log.info('📸 ViewShot captured URI:', markedUri);
          onCapture && onCapture(markedUri);
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [rawPhotoUri]);

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="camera"
        onPress={handleCapture}
        style={styles.captureButton}
        contentStyle={styles.captureButtonContent}>
        Ambil Foto
      </Button>

      {rawPhotoUri && (
        <ViewShot
          ref={viewShotRef}
          options={{format: 'jpg', quality: 1.0}}
          style={styles.viewShot}>
          <Image source={{uri: rawPhotoUri}} style={styles.preview} />
          <View style={styles.watermarkContainer}>
            <RNText style={styles.watermarkText}>{watermarkText}</RNText>
            <RNText style={styles.watermarkText}>{timestamp}</RNText>
          </View>
        </ViewShot>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  captureButton: {
    backgroundColor: '#6366f1',
    borderRadius: 2,
    marginBottom: 12,
  },
  captureButtonContent: {
    height: 48,
  },
  viewShot: {
    width: '100%',
    aspectRatio: 3 / 2,
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  watermarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
