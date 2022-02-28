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
        <Stack.Screen name='Routine' component={HomeScreen} options={({navigation}) => ({ headerStyle: {backgroundColor: '#fff'},  
          headerRight: () => ( 
            <View style={styles.statusBtnContainer}>
              <TouchableOpacity style={styles.exListBtn} onPress={() => {navigation.navigate('Exercise List')}}></TouchableOpacity>
              <TouchableOpacity style={styles.noteBtn} onPress={() => {navigation.navigate('Notes')}}></TouchableOpacity>
            </View>
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
  statusBtnContainer: {
    flexDirection: 'row',
  },
  exListBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    margin: 10,
  },
  noteBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#af216e',
    margin: 10,
  }
});
