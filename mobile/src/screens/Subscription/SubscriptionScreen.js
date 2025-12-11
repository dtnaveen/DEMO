import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useUser} from '../../context/UserContext';

export default function SubscriptionScreen() {
  const {currentUser} = useUser();
  const isPremium = currentUser?.subscriptionTier !== 'free';

  const tiers = [
    {
      name: 'Basic',
      price: 9.99,
      features: ['Unlimited likes', 'See who liked you', 'Advanced filters'],
    },
    {
      name: 'Plus',
      price: 19.99,
      features: [
        'Everything in Basic',
        'Read receipts',
        'Profile boost',
        'Priority support',
      ],
    },
    {
      name: 'VIP',
      price: 29.99,
      features: [
        'Everything in Plus',
        'VIP badge',
        'Exclusive events',
        'Dedicated support',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isPremium ? 'Your Subscription' : 'Upgrade to Premium'}
        </Text>
        {isPremium && (
          <Text style={styles.currentTier}>
            Current Plan: {currentUser?.subscriptionTier}
          </Text>
        )}
      </View>

      {!isPremium && (
        <View style={styles.tiersContainer}>
          {tiers.map((tier) => (
            <View key={tier.name} style={styles.tierCard}>
              <Text style={styles.tierName}>{tier.name}</Text>
              <Text style={styles.tierPrice}>${tier.price}/month</Text>
              <View style={styles.featuresList}>
                {tier.features.map((feature, index) => (
                  <Text key={index} style={styles.feature}>
                    ✓ {feature}
                  </Text>
                ))}
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
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
  currentTier: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  tiersContainer: {
    padding: 16,
  },
  tierCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  upgradeButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

