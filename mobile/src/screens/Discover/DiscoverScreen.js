import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {useUser} from '../../context/UserContext';
import {discoverUsers, likeUser, passUser} from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DiscoverScreen({navigation}) {
  const {currentUser} = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await discoverUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleLike = async (userId) => {
    try {
      await likeUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      // Show match animation if it's a match
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  const handlePass = async (userId) => {
    try {
      await passUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error passing user:', error);
    }
  };

  const renderUser = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.photoUrl}} style={styles.photo} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.age} • {item.location}
        </Text>
        {item.matchScore && (
          <Text style={styles.matchScore}>
            {item.matchScore.percentage}% Match
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handlePass(item.id)}>
          <Icon name="close" size={24} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleLike(item.id)}>
          <Icon name="favorite" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && users.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No more users to discover</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 400,
    backgroundColor: '#E5E7EB',
  },
  info: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  matchScore: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  passButton: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  likeButton: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

