import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const mockGroups = [
  {id: '1', name: 'Music Lovers', members: 1250, description: 'Share your favorite tunes'},
  {id: '2', name: 'Fitness Enthusiasts', members: 890, description: 'Stay active together'},
  {id: '3', name: 'Foodies', members: 2100, description: 'Discover new restaurants'},
  {id: '4', name: 'Travelers', members: 1500, description: 'Plan your next adventure'},
];

export default function GroupsScreen() {
  const [groups, setGroups] = useState(mockGroups);
  const [joinedGroups, setJoinedGroups] = useState([]);

  const handleJoin = (groupId) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
    }
  };

  const renderGroup = ({item}) => {
    const isJoined = joinedGroups.includes(item.id);
    return (
      <View style={styles.groupCard}>
        <View style={styles.groupHeader}>
          <View style={styles.iconContainer}>
            <Icon name="group" size={32} color="#8B5CF6" />
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.memberCount}>{item.members} members</Text>
          </View>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity
          style={[styles.joinButton, isJoined && styles.joinedButton]}
          onPress={() => handleJoin(item.id)}>
          <Text style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>
            {isJoined ? 'Joined' : 'Join Group'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Interest Groups</Text>
        <Text style={styles.subtitle}>Connect with people who share your interests</Text>
      </View>
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  list: {
    padding: 16,
  },
  groupCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: '#D1FAE5',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#10B981',
  },
});

