import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';

export default function OnboardingScreen({navigation}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const {signUp} = useAuth();

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.name) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setStep(2);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!formData.age || !formData.gender || !formData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const result = await signUp(formData);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'Could not create account');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {step === 1 ? 'Create Your Account' : 'Tell Us About Yourself'}
        </Text>

        {step === 1 ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholderTextColor="#9CA3AF"
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={formData.age}
              onChangeText={(text) => setFormData({...formData, age: text})}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={formData.gender}
              onChangeText={(text) => setFormData({...formData, gender: text})}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
              placeholderTextColor="#9CA3AF"
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : step === 1 ? 'Next' : 'Complete'}
          </Text>
        </TouchableOpacity>

        {step === 2 && (
          <TouchableOpacity
            onPress={() => setStep(1)}
            style={styles.linkButton}>
            <Text style={styles.linkText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#8B5CF6',
    fontSize: 14,
  },
});

