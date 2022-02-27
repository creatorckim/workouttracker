import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import ExListScreen from './components/ExListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator initialRouteName='Routine'>
        <Stack.Screen name='Routine' component={HomeScreen} options={({navigation}) => ({ headerStyle: {backgroundColor: '#fff'},  headerRight: () => ( <TouchableOpacity style={styles.exListBtn} onPress={() => {navigation.navigate('Exercise List')}}></TouchableOpacity>
        )})}/>
        <Stack.Screen name='Exercise List' component={ExListScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  exListBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#08964F',
  }
});
