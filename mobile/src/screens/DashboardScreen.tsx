import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '@/store/authStore';
import apiService from '@/services/api';
import locationService from '@/services/location';
import type { Attendance } from '@/types';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';

const DashboardScreen = ({ navigation }: any) => {
  const user = useAuthStore(state => state.user);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadTodayAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadTodayAttendance = async () => {
    try {
      const attendance = await apiService.getTodayAttendance();
      setTodayAttendance(attendance);
      setClockedIn(attendance !== null && !attendance.clockOut);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      // Get current location
      const location = await locationService.getCurrentLocation();

      // Check if within office radius (example: 37.7749, -122.4194 for SF)
      const { isWithin, distance } = await locationService.isWithinOfficeRadius(
        37.7749,
        -122.4194,
        100,
      );

      if (!isWithin) {
        Alert.alert(
          'Location Error',
          `You are ${Math.round(distance)}m away from the office. Please be within 100m to clock in.`,
        );
        setLoading(false);
        return;
      }

      // Clock in
      const attendance = await apiService.clockIn({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setTodayAttendance(attendance);
      setClockedIn(true);
      Alert.alert('Success', 'Clocked in successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    Alert.alert(
      'Clock Out',
      'Are you sure you want to clock out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clock Out',
          onPress: async () => {
            setLoading(true);
            try {
              const location = await locationService.getCurrentLocation();

              const attendance = await apiService.clockOut({
                latitude: location.latitude,
                longitude: location.longitude,
              });

              setTodayAttendance(attendance);
              setClockedIn(false);
              Alert.alert('Success', 'Clocked out successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to clock out');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const getWorkingTime = () => {
    if (!todayAttendance?.clockIn) return '00:00';

    const clockInTime = new Date(todayAttendance.clockIn);
    const endTime = todayAttendance.clockOut ? new Date(todayAttendance.clockOut) : currentTime;

    const hours = differenceInHours(endTime, clockInTime);
    const minutes = differenceInMinutes(endTime, clockInTime) % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>
            {user?.employee?.firstName} {user?.employee?.lastName}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.employee?.firstName?.[0]}
              {user?.employee?.lastName?.[0]}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Clock In/Out Card */}
      <View style={styles.clockCard}>
        <View style={styles.clockHeader}>
          <Icon name="clock-outline" size={24} color="#1A73E8" />
          <Text style={styles.clockTitle}>Attendance</Text>
        </View>

        <Text style={styles.currentTime}>{format(currentTime, 'HH:mm:ss')}</Text>
        <Text style={styles.currentDate}>{format(currentTime, 'EEEE, MMMM dd, yyyy')}</Text>

        {todayAttendance && (
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Clock In</Text>
              <Text style={styles.statusValue}>
                {format(new Date(todayAttendance.clockIn), 'HH:mm')}
              </Text>
            </View>
            {todayAttendance.clockOut && (
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Clock Out</Text>
                <Text style={styles.statusValue}>
                  {format(new Date(todayAttendance.clockOut), 'HH:mm')}
                </Text>
              </View>
            )}
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Working Time</Text>
              <Text style={styles.statusValue}>{getWorkingTime()}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.clockButton, clockedIn && styles.clockButtonOut]}
          onPress={clockedIn ? handleClockOut : handleClockIn}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon
                name={clockedIn ? 'logout' : 'login'}
                size={24}
                color="#FFFFFF"
                style={styles.clockButtonIcon}
              />
              <Text style={styles.clockButtonText}>
                {clockedIn ? 'Clock Out' : 'Clock In'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Attendance')}>
          <Icon name="history" size={32} color="#1A73E8" />
          <Text style={styles.actionText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Leaves')}>
          <Icon name="calendar" size={32} color="#34A853" />
          <Text style={styles.actionText}>Apply Leave</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Payroll')}>
          <Icon name="cash" size={32} color="#FBBC04" />
          <Text style={styles.actionText}>Payroll</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="account-group" size={32} color="#EA4335" />
          <Text style={styles.actionText}>Team</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  greeting: {
    fontSize: 14,
    color: '#5F6368',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  clockCard: {
    margin: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  clockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 8,
  },
  currentTime: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A73E8',
    textAlign: 'center',
    marginTop: 16,
  },
  currentDate: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8EAED',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  clockButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  clockButtonOut: {
    backgroundColor: '#EA4335',
    shadowColor: '#EA4335',
  },
  clockButtonIcon: {
    marginRight: 8,
  },
  clockButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 24,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: '1.5%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    textAlign: 'center',
  },
});

export default DashboardScreen;
