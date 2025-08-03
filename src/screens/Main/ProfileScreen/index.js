import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Appbar, Text, List, Divider} from 'react-native-paper';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../../contexts/AuthContext';
import {useLoading} from '../../../utils/loading';
import LoadingMain from '../../../components/Loading';
import {log} from '../../../utils/logger';

export default function ProfileScreen() {
  const {user, logout, refreshToken} = useContext(AuthContext);

  const {loading, withLoading} = useLoading();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await withLoading(async () => {
          try {
            await refreshToken();
            log.info('Profile - Screen:', 'Success get refresh token');
          } catch (error) {
            log.error('Profile - Screen', error.message || error);
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
          <Appbar.Content title="Profile" />
          <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>
        <LoadingMain text="Processing..." />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <View accessibilityRole="header">
          <View style={styles.header}>
            <Text style={styles.textHeader}>Profile Account</Text>
          </View>
          <View style={styles.mainContent}>
            <List.Item
              title={user.id}
              titleStyle={styles.itemTitle}
              left={() => (
                <MaterialDesignIcons
                  style={styles.iconItem}
                  name="identifier"
                  size={26}
                />
              )}
            />
            <Divider />
            <List.Item
              title={user.username.toUpperCase()}
              titleStyle={styles.itemTitle}
              left={() => (
                <MaterialDesignIcons
                  style={styles.iconItem}
                  name="clipboard-account-outline"
                  size={26}
                />
              )}
            />
            <Divider />
            <List.Item
              title={`${user.officeCode} - ${user.officeName.toUpperCase()}`}
              titleStyle={styles.itemTitle}
              left={() => (
                <MaterialDesignIcons
                  style={styles.iconItem}
                  name="office-building-marker-outline"
                  size={26}
                />
              )}
            />
            <Divider />
            <List.Item
              title={`${user.deptName.toUpperCase()}`}
              titleStyle={styles.itemTitle}
              left={() => (
                <MaterialDesignIcons
                  style={styles.iconItem}
                  name="warehouse"
                  size={26}
                />
              )}
            />
            <Divider />
            <List.Item
              title={`${user.groupName.toUpperCase()}`}
              titleStyle={styles.itemTitle}
              left={() => (
                <MaterialDesignIcons
                  style={styles.iconItem}
                  name="account-group-outline"
                  size={26}
                />
              )}
            />
            <Divider />
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
    marginBottom: 6,
  },
  mainContent: {
    overflow: 'hidden',
    backgroundColor: 'white',
    borderColor: '#a5b4fc',
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 14,
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 14,
    color: '#1f2937',
    marginRight: 8,
  },
  iconItem: {
    marginHorizontal: 12,
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
