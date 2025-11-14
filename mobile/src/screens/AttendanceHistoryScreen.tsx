import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiService from '@/services/api';
import type { Attendance } from '@/types';
import { format } from 'date-fns';

const AttendanceHistoryScreen = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const data = await apiService.getMyAttendance();
      setAttendances(data);
    } catch (error) {
      console.error('Error loading attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Attendance }) => (
    <View style={styles.card}>
      <View style={styles.dateContainer}>
        <Icon name="calendar" size={20} color="#1A73E8" />
        <Text style={styles.date}>{format(new Date(item.date), 'MMM dd, yyyy')}</Text>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Icon name="login" size={16} color="#34A853" />
          <Text style={styles.timeLabel}>In:</Text>
          <Text style={styles.timeValue}>{format(new Date(item.clockIn), 'HH:mm')}</Text>
        </View>

        {item.clockOut && (
          <View style={styles.timeItem}>
            <Icon name="logout" size={16} color="#EA4335" />
            <Text style={styles.timeLabel}>Out:</Text>
            <Text style={styles.timeValue}>
              {format(new Date(item.clockOut), 'HH:mm')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Working Hours</Text>
          <Text style={styles.statValue}>
            {item.workingHours?.toFixed(1) || '0.0'}h
          </Text>
        </View>
        {item.overtimeHours! > 0 && (
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Overtime</Text>
            <Text style={[styles.statValue, styles.overtimeValue]}>
              +{item.overtimeHours?.toFixed(1)}h
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={attendances}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-blank" size={64} color="#E8EAED" />
            <Text style={styles.emptyText}>No attendance records yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8EAED',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#5F6368',
    marginLeft: 4,
    marginRight: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A73E8',
  },
  overtimeValue: {
    color: '#FBBC04',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#5F6368',
    marginTop: 16,
  },
});

export default AttendanceHistoryScreen;
