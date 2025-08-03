import React, {useState, useContext} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Appbar, List, Divider} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../../contexts/AuthContext';
import {useLoading} from '../../../utils/loading';
import LoadingMain from '../../../components/Loading';
import {log} from '../../../utils/logger';

export default function HomeScreen() {
  const {user, logout, withValidToken, dataDraftSOContext} =
    useContext(AuthContext);
  const {loading, withLoading} = useLoading();

  const [dataDraftOpname, setDataDraftOpname] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await withLoading(async () => {
          try {
            const result = await withValidToken(() =>
              dataDraftSOContext(user.officeCode, user.deptCode),
            );
            setDataDraftOpname(result);
            log.info('Home - Screen:', 'Success get data draft opname');
          } catch (error) {
            log.error('Home - Screen', error.message || error);
          }
        });
      };
      fetchData();
    }, []),
  );

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
          <Appbar.Content title="Home" />
          <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>
        <LoadingMain text="Processing..." />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <View accessibilityRole="header">
          <View style={styles.header}>
            <Text style={styles.textHeader}>Stock Opname Progress Summary</Text>
          </View>
          <View style={styles.mainContent}>
            {dataDraftOpname && dataDraftOpname.length > 0 ? (
              <View style={styles.listContent}>
                <List.Item
                  title="Items"
                  titleStyle={styles.itemTitle}
                  right={() => <Text style={styles.itemRight}>Progress</Text>}
                />
                <Divider />
                {dataDraftOpname.map((item, index) => (
                  <React.Fragment key={index}>
                    <List.Item
                      title={`${item.noRefSO} | ${item.tglSO}`}
                      description={item.itemsSO}
                      titleStyle={styles.itemTitle}
                      descriptionStyle={styles.itemDescription}
                      right={() => (
                        <Text style={styles.itemRight}>
                          {item.persentaseSO}
                        </Text>
                      )}
                    />
                    <Divider />
                  </React.Fragment>
                ))}
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No draft stock opname available
                </Text>
              </View>
            )}
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
    marginBottom: 13,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'left',
  },
  mainContent: {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 2,
    fontSize: 14,
    marginBottom: 20,
  },
  listContent: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#a5b4fc',
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
  noDataContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#4b5563',
  },
});
