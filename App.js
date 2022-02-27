import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import ExListScreen from './components/ExListScreen';
import NoteScreen from './components/NoteScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator initialRouteName='Routine'>
        <Stack.Screen name='Routine' component={HomeScreen} options={({navigation}) => ({ headerStyle: {backgroundColor: '#fff'},  headerRight: () => ( <TouchableOpacity style={styles.exListBtn} onPress={() => {navigation.navigate('Notes')}}></TouchableOpacity>
        )})}/>
        <Stack.Screen name='Exercise List' component={ExListScreen}/>
        <Stack.Screen name='Notes' component={NoteScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  exListBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
  }
});
