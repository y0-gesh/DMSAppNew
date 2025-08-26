// app/(main)/_layout.tsx
import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Redirect } from 'expo-router';

export default function MainLayout() {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen name="upload" options={{ title: 'Upload' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
    </Tabs>
  );
}