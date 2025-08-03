import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Appbar, Text, List, Divider} from 'react-native-paper';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../../contexts/AuthContext';
import DropdownSelect from '../../../components/DropdownSelect';
import FormInput from '../../../components/FormInput';
import {useLoading} from '../../../utils/loading';
import LoadingMain from '../../../components/Loading';
import {log} from '../../../utils/logger';

export default function OpnameScreen() {
  const {user, logout, withValidToken, dataDraftSOContext, dataItemsSOContext} =
    useContext(AuthContext);

  const navigation = useNavigation();

  const {loading, withLoading} = useLoading();
  const [dataDraftOpname, setDataDraftOpname] = useState([]);
  const [dataItemsOpname, setDataItemsOpname] = useState([]);
  const [dateSO, setDateSO] = useState('');
  const [resetCount, setResetCount] = useState(0);
  const [selectedOptionNoref, setSelectedOptionNoref] = useState(null);
  const [dataNoref, setDataNoref] = useState([]);

  const resetInput = () => {
    setDateSO('');
    setSelectedOptionNoref(null);
    setResetCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    const norefOptions = dataDraftOpname.map(item => ({
      label: item.noRefSO,
      value: item.noRefSO,
    }));
    setDataNoref(prev => {
      const prevStr = JSON.stringify(prev);
      const nextStr = JSON.stringify(norefOptions);
      return prevStr !== nextStr ? norefOptions : prev;
    });
  }, [dataDraftOpname]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await withLoading(async () => {
          try {
            resetInput();
            const result = await withValidToken(() =>
              dataDraftSOContext(user.officeCode, user.deptCode),
            );
            setDataDraftOpname(result);
            log.info('Opname - Screen:', 'Success get data draft opname');
          } catch (error) {
            resetInput();
            log.error('Opname - Screen', error.message || error);
          }
        });
      };
      fetchData();
    }, []),
  );

  const handleSelectNoref = async option => {
    const selected = option ? option.value : null;
    setSelectedOptionNoref(selected);
    setDateSO('');
    setDataItemsOpname([]);

    if (selected) {
      await withLoading(async () => {
        try {
          const result = await withValidToken(() =>
            dataItemsSOContext(selected),
          );
          setDataItemsOpname(result);
          if (result?.date) {
            setDateSO(result.date);
          }
          log.info(
            'Opname - Screen:',
            `Success get data items for ${selected}`,
          );
        } catch (error) {
          log.error('Opname - Screen', error.message || error);
          Alert.alert('Error', 'Gagal mengambil data items');
        }
      });
    }
  };

  const handleProccessOpname = React.useCallback(async () => {
    if (selectedOptionNoref === null || dateSO.trim() === '') {
      log.info('Opname - Screen:', 'Noref belum ada yang dipilih');
      Alert.alert('Info', 'Noref belum ada yang dipilih');
      return;
    }
    try {
      const dataToPass = {
        noref: selectedOptionNoref,
      };
      navigation.navigate('ProcessOpname', {dataNoref: dataToPass});
    } catch (error) {
      log.error('Opname - Screen', error.message || error);
      Alert.alert('Info', error.message || error);
    }
  }, [selectedOptionNoref, dateSO, navigation]);

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
        <Appbar.Content title="Stock Opname" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <View accessibilityRole="header">
          <View style={styles.header}>
            <Text style={styles.textHeader}>Select Draft Opname</Text>
          </View>
          <View style={styles.mainContent}>
            <DropdownSelect
              key={`noref-${resetCount}`}
              options={dataNoref}
              placeholder="Select noref"
              onSelect={handleSelectNoref}
              selectedValue={dataNoref.find(
                option => option.value === selectedOptionNoref,
              )}
            />
            {selectedOptionNoref && (
              <>
                <FormInput placeholder="Date" value={dateSO} disabled />
                <View style={styles.listContent}>
                  <List.Item
                    title="Items"
                    titleStyle={styles.itemTitle}
                    right={() => <Text style={styles.itemRight}>Asset</Text>}
                  />
                  <Divider />
                  {Object.entries(dataItemsOpname?.data || {})
                    .filter(([key]) => key !== 'length')
                    .map(([key, item]) => (
                      <React.Fragment key={key}>
                        <List.Item
                          title={item.idBarang}
                          description={item.descBarang}
                          titleStyle={styles.itemTitle}
                          descriptionStyle={styles.itemDescription}
                          right={() => (
                            <Text style={styles.itemRight}>
                              {item.assetBarang}
                            </Text>
                          )}
                        />
                        <Divider />
                      </React.Fragment>
                    ))}
                </View>
              </>
            )}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleProccessOpname}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Opname button">
              <Text style={styles.buttonText}>Process Stock Opname</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    gap: 2,
    marginBottom: 20,
  },
  listContent: {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 2,
    fontSize: 14,
    marginTop: 6,
    borderColor: '#a5b4fc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#6366f1',
    height: 48,
    width: 110,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
});
