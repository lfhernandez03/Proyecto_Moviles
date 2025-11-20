import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/FirebaseConfig';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { TouchableOpacity } from 'react-native';

export default function TabOneScreen() {

  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace('/')
  })
  return (
    <ThemedView>
      <ThemedText>Sign Out</ThemedText>
      <TouchableOpacity onPress={() => auth.signOut()}>
        <ThemedText>Sign Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
