import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Appbar,
  Text,
  Snackbar,
  ProgressBar,
  MD3Colors,
  List,
  Modal,
  Portal,
  Button,
  Divider,
} from 'react-native-paper';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {readFile} from 'react-native-fs';
import {AuthContext} from '../../../contexts/AuthContext';
import DropdownSelect from '../../../components/DropdownSelect';
import FormInput from '../../../components/FormInput';
import TextArea from '../../../components/TextArea';
import CameraInput from '../../../components/CameraInput';
import {useLoading} from '../../../utils/loading';
import LoadingMain from '../../../components/Loading';
import {log} from '../../../utils/logger';

export default function ProcessOpnameScreen() {
  const {
    user,
    logout,
    withValidToken,
    dataPersentaseSOContext,
    dataConditionContext,
    dataCheckItemSOContext,
    saveItemSOContext,
  } = useContext(AuthContext);

  const navigation = useNavigation();

  const route = useRoute();
  const {dataNoref} = route.params;

  const {loading, withLoading} = useLoading();
  const [dataSN, setDataSN] = useState();
  const [location, setLocation] = useState();
  const [dataKondisi, setDataKondisi] = useState([]);
  const [dataPersentaseOpname, setDataPersentaseOpname] = useState([]);
  const [selectedOptionKondisi, setSelectedOptionKondisi] = useState(null);
  const [persentaseSO, setPersentaseSO] = useState();
  const [dataCondition, setDataCondition] = useState([]);
  const [checkingItemOpname, setCheckingItemOpname] = useState([]);
  const [resetCount, setResetCount] = useState(0);
  const [photoUri, setPhotoUri] = useState(null);

  // State untuk modal
  const [modalVisible, setModalVisible] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const resetInput = () => {
    setDataSN('');
    setLocation('');
    setCheckingItemOpname([]);
    setSelectedOptionKondisi(null);
    setPhotoUri(null);
    setSelectedItem(null);
    setResetCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    const kondisiOptions = dataCondition.map(item => ({
      label: item.idKondisi + ' - ' + item.nameKondisi,
      value: item.idKondisi,
    }));
    setDataKondisi(kondisiOptions);
  }, [dataCondition]);

  const handleSelectKondisi = option => {
    setSelectedOptionKondisi(option ? option.value : null);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await withLoading(async () => {
          try {
            resetInput();
            await withValidToken(async () => {
              const resultCondition = await dataConditionContext();
              const resultPersentase = await dataPersentaseSOContext(
                dataNoref.noref,
              );
              setDataCondition(resultCondition);
              setDataPersentaseOpname(resultPersentase);
            });
            log.info(
              'Proccess Opname - Screen:',
              'Success get data persentase opname',
            );
          } catch (error) {
            resetInput();
            log.error('Proccess Opname - Screen', error.message || error);
          }
        });
      };
      fetchData();
    }, []),
  );

  useEffect(() => {
    if (dataPersentaseOpname?.data) {
      setPersentaseSO(dataPersentaseOpname.data);
    }
  }, [dataPersentaseOpname]);

  const data = dataPersentaseOpname?.data?.[0];
  const draft = parseInt(data?.itemDraft || 0, 10);
  const update = parseInt(data?.itemUpdate || 0, 10);
  const progress = draft > 0 ? update / draft : 0;

  const handleChangeSerialNumber = text => {
    setDataSN(text.toUpperCase());
  };

  const handleSubmitSerialNumber = async () => {
    if (dataSN.trim() === '') {
      Alert.alert('Info', 'Nomor serial number masih kosong');
      return;
    }
    await withLoading(async () => {
      try {
        const result = await withValidToken(() =>
          dataCheckItemSOContext(dataNoref.noref, dataSN),
        );
        if (Array.isArray(result) && result.length > 0) {
          // Tampilkan preview dalam modal
          setPreviewItems(result);
          setModalVisible(true);
          setDataSN('');
        } else {
          Alert.alert(
            'Info',
            'Tidak ada data yang ditemukan untuk serial number ini',
          );
        }
        log.info(
          'Check Item Opname - Screen:',
          `Berhasil mengambil data untuk SN: ${dataSN}`,
        );
      } catch (error) {
        setDataSN('');
        setCheckingItemOpname([]);
        Alert.alert(
          'Info',
          `Gagal mengambil data untuk SN atau DAT: ${dataSN}`,
        );
        log.error('Check Item Opname - Screen', error.message || error);
      }
    });
  };

  const handleSelectItem = item => {
    setSelectedItem(item);
    setCheckingItemOpname([item]);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setPreviewItems([]);
  };

  const convertImageToBase64 = async uri => {
    try {
      const base64 = await readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (err) {
      log.error('Gagal mengubah foto menjadi base64');
      throw new Error('Gagal mengubah foto menjadi base64');
    }
  };

  const handleSaveRecord = async () => {
    if (
      !selectedOptionKondisi ||
      !location ||
      checkingItemOpname.length === 0
    ) {
      Alert.alert('Info', 'Lengkapi semua data sebelum menyimpan.');
      return;
    }

    const item = checkingItemOpname[0];

    await withLoading(async () => {
      try {
        let base64Photo = null;

        if (photoUri) {
          const base64 = await convertImageToBase64(photoUri);
          base64Photo = base64.startsWith('data:image') ? base64 : null;
        }
        await withValidToken(async () => {
          const result = await saveItemSOContext(
            dataNoref.noref,
            item.idBarang,
            dataSN || item.snBarang,
            selectedOptionKondisi,
            location,
            user.username.toUpperCase(),
            photoUri ? base64Photo : null,
          );
          const resultCondition = await dataConditionContext();
          setDataCondition(resultCondition);
          setDataPersentaseOpname(result);
        });
        log.info('Save Opname - Screen', 'Success update data opname');
        setVisible(true);
        resetInput();
      } catch (error) {
        setPhotoUri(null);
        log.error('Save Opname - Screen', error.message || error);
        Alert.alert('Error', error.message || error);
      }
    });
  };

  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const backOpnameScreen = async () => {
    try {
      navigation.navigate('OpnameMain');
    } catch (error) {
      log.error('Opname - Screen', error.message || error);
      Alert.alert('Info', error.message || error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout Confirmation', 'Apakah Anda yakin ingin keluar?', [
      {
        text: 'Batal',
        onPress: () => log.info('Logout dibatalkan'),
        style: 'cancel',
      },
      {
        text: 'Keluar',
        onPress: () => logout(),
      },
    ]);
  };

  if (loading) {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={backOpnameScreen} />
          <Appbar.Content title="Stock Opname" />
          <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>
        <LoadingMain text="Processing..." />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={backOpnameScreen} />
        <Appbar.Content title="Stock Opname" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <View accessibilityRole="header">
          <View style={styles.header}>
            <Text style={styles.textHeader}>Process Opname</Text>
          </View>
          <View style={styles.mainContent}>
            <FormInput
              placeholder="Noref"
              value={dataNoref?.noref}
              disabled={true}
            />
            <FormInput
              placeholder="Enter DAT / Serial Number"
              value={dataSN}
              onChangeText={handleChangeSerialNumber}
              onSubmitEditing={handleSubmitSerialNumber}
              autoCapitalize="characters"
            />
            {Array.isArray(checkingItemOpname) &&
              checkingItemOpname.length > 0 && (
                <>
                  <View style={styles.listContent}>
                    {checkingItemOpname.map((item, index) => (
                      <List.Item
                        key={index}
                        title={`${item.idBarang} - ${item.descBarang}`}
                        description={`${item.datBarang} | ${item.snBarang}`}
                        titleStyle={styles.itemTitle}
                        descriptionStyle={styles.itemDescription}
                        right={props => (
                          <List.Icon
                            {...props}
                            icon={
                              item.konBarang === true
                                ? 'check-circle-outline'
                                : 'close-circle-outline'
                            }
                            color={item.konBarang === true ? 'green' : 'red'}
                          />
                        )}
                      />
                    ))}
                  </View>
                  <CameraInput
                    key={`camera-${resetCount}`}
                    watermarkText={`NOREF: ${
                      dataNoref?.noref
                    } - ${user?.username.toUpperCase()}`}
                    onCapture={setPhotoUri}
                  />
                  <DropdownSelect
                    key={`condition-${resetCount}`}
                    options={dataKondisi}
                    placeholder="Select kondisi"
                    onSelect={handleSelectKondisi}
                    selectedValue={dataKondisi.find(
                      option => option.value === selectedOptionKondisi,
                    )}
                  />
                  <TextArea
                    placeholder="Enter location"
                    value={location}
                    onChangeText={setLocation}
                  />
                </>
              )}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSaveRecord}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Save button">
              <Text style={styles.buttonText}>Save Record</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressContent}>
            <Text style={styles.textProgress}>
              {`${update} / ${draft} (${Math.round(progress * 100)}%)`}
            </Text>
          </View>
          <View style={styles.footerContent}>
            <ProgressBar progress={progress} color={MD3Colors.primary20} />
          </View>
        </View>
      </ScrollView>
      {/* Modal untuk preview dan pemilihan item */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Item</Text>
            <Text style={styles.modalSubtitle}>
              Ditemukan {previewItems.length} asset berikut:
            </Text>
            <Divider style={styles.modalDivider} />

            <ScrollView style={styles.modalScrollView}>
              {previewItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handleSelectItem(item)}>
                  <List.Item
                    title={`${item.idBarang} - ${item.descBarang}`}
                    description={`${item.datBarang} | ${item.snBarang}`}
                    titleStyle={styles.itemTitle}
                    descriptionStyle={styles.itemDescription}
                    right={props => (
                      <List.Icon
                        {...props}
                        icon={
                          item.konBarang === true
                            ? 'check-circle-outline'
                            : 'close-circle-outline'
                        }
                        color={item.konBarang === true ? 'green' : 'red'}
                      />
                    )}
                    style={styles.modalListItem}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <Button
                mode="outlined"
                onPress={handleCloseModal}
                style={styles.modalButton}>
                Batal
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            // Do something
          },
        }}
        style={styles.snackbar}>
        Data berhasil disimpan
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'left',
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 2,
  },
  mainContent: {
    width: '100%',
    alignItems: 'stretch',
  },
  listContent: {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#a5b4fc',
    fontSize: 12,
    marginTop: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  itemDescription: {
    fontSize: 12,
    color: '#4b5563',
  },
  itemRight: {
    fontSize: 13,
    color: '#1e40af',
    alignSelf: 'center',
    marginRight: 8,
  },
  button: {
    backgroundColor: '#6366f1',
    height: 48,
    width: 110,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressContent: {
    alignItems: 'center',
    marginVertical: 8,
  },
  footerContent: {
    marginBottom: 20,
  },
  textProgress: {
    fontSize: 14,
    color: '#1e293b',
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#1e293b',
  },
  // Modal styles
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#a5b4fc',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
  },
  modalDivider: {
    marginBottom: 16,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalItem: {
    marginBottom: 8,
    borderRadius: 4,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalListItem: {
    paddingVertical: 4,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    minWidth: 80,
  },
});
