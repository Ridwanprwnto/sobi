import React, {useState, useRef, useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
  View,
  Image,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import ViewShot from 'react-native-view-shot';
import {log} from '../utils/logger';

export default function CameraInput({onCapture, watermarkText = 'Opname'}) {
  const [rawPhotoUri, setRawPhotoUri] = useState(null);
  const [finalPhotoUri, setFinalPhotoUri] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewShotError, setViewShotError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const viewShotRef = useRef();

  const captureViewShot = async () => {
    try {
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref not ready');
      }

      // Tambahkan delay untuk memastikan image sudah ter-render
      await new Promise(resolve => setTimeout(resolve, 1000));

      const uri = await viewShotRef.current.capture();
      if (!uri) {
        throw new Error('Failed to capture view shot');
      }

      log.info('ViewShot captured URI:', uri);

      // Untuk debugging - jika masih gagal, coba gunakan raw photo sebagai fallback
      if (!uri.includes('file://')) {
        log.warn('ViewShot URI tidak valid, menggunakan raw photo');
        setFinalPhotoUri(rawPhotoUri);
        onCapture?.(rawPhotoUri);
      } else {
        setFinalPhotoUri(uri);
        onCapture?.(uri);
      }

      setIsProcessing(false);
    } catch (error) {
      log.error('ViewShot Error:', error);
      // Fallback ke raw photo jika ViewShot gagal
      log.warn('ViewShot gagal, menggunakan raw photo sebagai fallback');
      setFinalPhotoUri(rawPhotoUri);
      onCapture?.(rawPhotoUri);
      setViewShotError(error.message);
      setIsProcessing(false);
    }
  };

  const handleCapture = async () => {
    try {
      setIsProcessing(true);
      setFinalPhotoUri(null);
      setViewShotError(null);
      setImageLoaded(false);

      if (Platform.OS === 'android') {
        const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];

        if (Platform.Version < 29) {
          permissions.push(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const cameraGranted =
          granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED;

        let writeGranted = true;
        let readGranted = true;

        if (Platform.Version < 29) {
          writeGranted =
            granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED;
          readGranted =
            granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED;
        }

        if (!cameraGranted || !writeGranted || !readGranted) {
          Alert.alert(
            'Izin Diperlukan',
            'Aplikasi memerlukan izin kamera dan penyimpanan untuk mengambil foto.',
          );
          setIsProcessing(false);
          return;
        }
        log.info('Granted Permissions:', granted);
      }

      launchCamera(
        {
          mediaType: 'photo',
          cameraType: 'back',
          saveToPhotos: false,
          includeBase64: false,
          quality: 0.8,
        },
        async response => {
          if (response.didCancel) {
            log.info('Camera - Component: ', 'User cancelled camera');
            setIsProcessing(false);
            return;
          }

          if (response.errorCode) {
            log.error('Camera error: ', response.errorMessage);
            Alert.alert(
              'Gagal mengambil foto',
              response.errorMessage || 'Terjadi kesalahan saat mengambil foto.',
            );
            setIsProcessing(false);
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            if (!uri) {
              log.error('Camera error: URI is undefined');
              Alert.alert('Gagal mengambil foto', 'File foto tidak tersedia.');
              setIsProcessing(false);
              return;
            }

            log.info('📸 Photo URI:', uri);
            setRawPhotoUri(uri);

            const now = new Date();
            const formattedDate = now.toLocaleString();
            setTimestamp(formattedDate);
          } else {
            log.error('Camera error: No assets returned');
            Alert.alert(
              'Gagal mengambil foto',
              'Tidak ada file foto yang dihasilkan.',
            );
            setIsProcessing(false);
          }
        },
      );
    } catch (error) {
      log.error('Camera - Permission Error:', error.message || error);
      Alert.alert(
        'Gagal mengambil foto',
        error.message || 'Terjadi kesalahan saat mengambil foto.',
      );
      setIsProcessing(false);
    }
  };

  // Trigger ViewShot capture hanya setelah image benar-benar loaded
  useEffect(() => {
    if (rawPhotoUri && imageLoaded && viewShotRef.current) {
      const timer = setTimeout(() => {
        captureViewShot();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [rawPhotoUri, imageLoaded]);

  const handleImageLoad = () => {
    log.info('Image loaded successfully');
    setImageLoaded(true);
  };

  const handleImageError = error => {
    log.error('Image load error:', error.nativeEvent.error);
    setViewShotError('Gagal memuat gambar');
    setIsProcessing(false);
  };

  const handlePreviewPress = () => {
    if (finalPhotoUri) {
      setModalVisible(true);
    } else if (viewShotError) {
      Alert.alert('Error', `Gagal memproses gambar: ${viewShotError}`);
    } else {
      Alert.alert(
        'Sedang Memproses',
        'Gambar masih dalam proses render. Silakan tunggu...',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="camera"
        onPress={handleCapture}
        style={styles.captureButton}
        contentStyle={styles.captureButtonContent}
        disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Take Photo'}
      </Button>

      {rawPhotoUri && (
        <>
          <TouchableOpacity
            onPress={handlePreviewPress}
            style={styles.attachmentWrapper}>
            {isProcessing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#1e40af" />
                <RNText style={styles.loadingText}>Processing photos...</RNText>
              </View>
            ) : (
              <RNText style={styles.attachmentText}>
                📎 Photo attached – click to view
              </RNText>
            )}
          </TouchableOpacity>
          <ViewShot
            ref={viewShotRef}
            options={{
              format: 'jpg',
              quality: 0.9,
              result: 'tmpfile',
              width: 1080,
              height: 720,
              fileName: `opname_${Date.now()}`,
            }}
            style={styles.viewShot}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: rawPhotoUri}}
                style={styles.hiddenImage}
                resizeMode="cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              <View style={styles.watermarkContainer}>
                <RNText style={styles.watermarkText}>{watermarkText}</RNText>
                <RNText style={styles.watermarkText}>{timestamp}</RNText>
              </View>
            </View>
          </ViewShot>

          <Modal
            visible={modalVisible}
            transparent={false}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              {finalPhotoUri ? (
                <Image
                  source={{uri: finalPhotoUri}}
                  style={styles.fullImage}
                  resizeMode="contain"
                  onError={e => {
                    log.error('Modal image error:', e.nativeEvent.error);
                    Alert.alert('Error', 'Gagal memuat gambar preview');
                  }}
                />
              ) : (
                <View style={styles.modalLoading}>
                  <ActivityIndicator size="large" color="white" />
                  <RNText style={styles.modalLoadingText}>
                    Loading image...
                  </RNText>
                </View>
              )}
              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                Close Preview
              </Button>
            </View>
          </Modal>
        </>
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
  attachmentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentText: {
    color: '#1e40af',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6366f1',
  },
  viewShot: {
    height: 720,
    width: 1080,
    position: 'absolute',
    top: -5000,
    left: -5000,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  hiddenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
  },
  watermarkText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#1e40af',
    fontSize: 14,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoadingText: {
    color: 'white',
    marginTop: 16,
  },
});
