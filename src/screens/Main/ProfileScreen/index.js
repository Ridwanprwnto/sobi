import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Appbar,
  Text,
  List,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../../../contexts/AuthContext';
import {log} from '../../../utils/logger';

export default function ProfileScreen() {
  const {user, loading, logout, checkAndRefreshToken} = useContext(AuthContext);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await checkAndRefreshToken();
          log.info('Profile - Screen:', 'Success get refresh token');
        } catch (error) {
          log.error('Profile - Screen', error.message || error);
        }
      };
      fetchData();
    }, []),
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="logout" onPress={logout} />
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
                  name="warehouse"
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
                  name="account-tie"
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
    borderRadius: 2,
    fontSize: 14,
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
