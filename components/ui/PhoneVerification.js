'use client';

import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

/**
 * Phone Number Verification Component
 * Verifies user phone number via SMS code
 */
export default function PhoneVerification({ 
  phoneNumber = '', 
  onVerified, 
  onCancel,
  className = '' 
}) {
  const [phone, setPhone] = useState(phoneNumber);
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleSendCode = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In production, call API to send SMS code
      // await sendVerificationCode(phone);
      
      // Mock: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('code');
      setError('');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In production, call API to verify code
      // await verifyCode(phone, code);
      
      // Mock: Accept any 6-digit code for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerified(true);
      if (onVerified) {
        onVerified(phone);
      }
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Verified!</h3>
          <p className="text-gray-600">Your phone number has been verified successfully.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Phone Number</h3>
        <p className="text-gray-600">
          {step === 'phone' 
            ? 'We'll send you a verification code via SMS'
            : 'Enter the 6-digit code sent to your phone'
          }
        </p>
      </div>

      {step === 'phone' ? (
        <div className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
            error={error}
          />
          <div className="flex gap-3">
            <Button
              onClick={handleSendCode}
              disabled={loading || !phone}
              className="flex-1"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Verification Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            required
            error={error}
          />
          <div className="flex gap-3">
            <Button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <Button
              onClick={() => {
                setStep('phone');
                setCode('');
                setError('');
              }}
              variant="outline"
            >
              Change Number
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Didn't receive the code?{' '}
            <button
              onClick={handleSendCode}
              className="text-primary-600 hover:underline font-medium"
            >
              Resend
            </button>
          </p>
        </div>
      )}
    </Card>
  );
}

