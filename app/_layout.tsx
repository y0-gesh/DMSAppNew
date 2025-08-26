// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import 'react-native-reanimated';

export default function RootLayout() {
  

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
