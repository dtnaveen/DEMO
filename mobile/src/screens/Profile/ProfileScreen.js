import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useUser} from '../../context/UserContext';
import {useAuth} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({navigation}) {
  const {currentUser} = useUser();
  const {logout} = useAuth();
  const [editing, setEditing] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{uri: currentUser?.photoUrl}}
          style={styles.avatar}
        />
        <Text style={styles.name}>{currentUser?.name}</Text>
        <Text style={styles.details}>
          {currentUser?.age} • {currentUser?.location}
        </Text>
        {currentUser?.isVerified && (
          <View style={styles.verifiedBadge}>
            <Icon name="verified" size={20} color="#10B981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setEditing(true)}>
          <Icon name="edit" size={24} color="#6B7280" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Subscription')}>
          <Icon name="star" size={24} color="#6B7280" />
          <Text style={styles.menuText}>Subscription</Text>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Groups')}>
          <Icon name="group" size={24} color="#6B7280" />
          <Text style={styles.menuText}>Groups</Text>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#EF4444" />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 16,
  },
  logoutText: {
    color: '#EF4444',
  },
});

