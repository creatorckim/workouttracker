import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import ExListScreen from './components/ExListScreen';
import NoteScreen from './components/NoteScreen';
import LogSetScreen from './components/LogSetScreen';
import { FontAwesome5 } from '@expo/vector-icons'; 

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer style={styles.container}>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName='Routine'>
        <Stack.Screen name='Routine' component={HomeScreen} options={({navigation}) => ({ headerTitle: 'Routine', headerTitleStyle: {color: '#fff'}, headerStyle: {backgroundColor: '#1e1e1e'},
          headerRight: () => ( 
            <View style={styles.statusBtnContainer}>
              <TouchableOpacity style={styles.exListBtn} onPress={() => {navigation.navigate({name: 'Exercise List', params: { toAdd : false },merge: true,})}}>
                <FontAwesome5 name="list-alt" size={25} color='#fc4d32' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.noteBtn} onPress={() => {navigation.navigate('Notes')}}>
                <FontAwesome5 name="sticky-note" size={25} color='#fc4d32' />
              </TouchableOpacity>
            </View>
        )})}/>
        <Stack.Screen name='Exercise List' component={ExListScreen} options={() => ({ headerTitle: 'Exercise List', headerTitleStyle: {color: '#fff'}, headerStyle: {backgroundColor: '#1e1e1e'}, headerTintColor: '#fff'})}/>
        <Stack.Screen name='Notes' component={NoteScreen} options={() => ({ headerTitle: 'Notes', headerTitleStyle: {color: '#fff'}, headerStyle: {backgroundColor: '#1e1e1e'}, headerTintColor: '#fff'})}/>
        <Stack.Screen name='Log Set' component={LogSetScreen} options={() => ({ headerTitle: 'Log Set', headerTitleStyle: {color: '#fff'}, headerStyle: {backgroundColor: '#1e1e1e'}, headerTintColor: '#fff'})}/>
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
    margin: 10,
  },
  noteBtn: {
    margin: 10,
  }
});
