// app/index.tsx
import { useContext } from 'react';
import { Redirect } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function Index() {
  const { token } = useContext(AuthContext);
  if (token) {
    return <Redirect href="/(main)" />;
  } else {
    return <Redirect href="/login" />;
  }
}