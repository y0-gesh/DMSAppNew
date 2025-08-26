// app/login.tsx
import { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button, ActivityIndicator, HelperText } from 'react-native-paper';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: mobile, 2: otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const sendOTP = async () => {
    if (!mobile) return setError('Enter mobile number');
    setLoading(true);
    try {
      await api.generateOTP(mobile);
      setStep(2);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) return setError('Enter OTP');
    setLoading(true);
    try {
      const data = await api.validateOTP(mobile, otp);
      await login(data.token, data.user_id || mobile); // Fallback to mobile if user_id not provided
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput label="Mobile Number" value={mobile} onChangeText={setMobile} disabled={step === 2} keyboardType="phone-pad" />
      {step === 2 && <TextInput label="OTP" value={otp} onChangeText={setOtp} keyboardType="numeric" />}
      {error && <HelperText type="error">{error}</HelperText>}
      {loading ? <ActivityIndicator /> : (
        <Button mode="contained" onPress={step === 1 ? sendOTP : verifyOTP} style={{ marginTop: 20 }}>
          {step === 1 ? 'Send OTP' : 'Verify OTP'}
        </Button>
      )}
    </View>
  );
}