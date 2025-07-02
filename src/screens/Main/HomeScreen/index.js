import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Text,
  Appbar,
  List,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../../contexts/AuthContext';
import {log} from '../../../utils/logger';

export default function HomeScreen() {
  const {
    user,
    loading,
    logout,
    checkAndRefreshToken,
    dataDraftSOContext,
    dataDraftOpname,
  } = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await checkAndRefreshToken();
          await dataDraftSOContext(user.officeCode, user.deptCode);
          log.info('Home - Screen:', 'Success get data draft opname');
        } catch (error) {
          log.error('Home - Screen', error.message || error);
        }
      };
      fetchData();
    }, []),
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <View accessibilityRole="header">
          <View style={styles.header}>
            <Text style={styles.textHeader}>Opname Process</Text>
          </View>
          <View style={styles.mainContent}>
            {dataDraftOpname && dataDraftOpname.length > 0 ? (
              <View style={styles.mainContent}>
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
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Memproses...</Text>
          </View>
        </View>
      )}
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
});
