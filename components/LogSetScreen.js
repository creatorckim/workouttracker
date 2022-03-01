import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';

function LogSetScreen({navigation, route}) {

    const[setArray, setSetArray] = useState([]);

    useEffect(() => {
        // console.log(route.params.array);

        setSetArray(route.params.array);

    }, [])

    const addSet = () => {
        let tempArray = [...setArray, ...[['0', '0']]];
        setSetArray(tempArray);
        // console.log(tempArray)
    }

    const deleteSet = () => {
        let tempArray = [...setArray];
        tempArray.splice(-1);
        setSetArray(tempArray);
        // console.log(tempArray)
    }

    const updateRep = (index, value) => {
        let tempArray = [...setArray];
        tempArray[index][0] = `${value}`;
        setSetArray(tempArray);
    }

    const updateWeight = (index, value) => {
        let tempArray = [...setArray];
        tempArray[index][1] = `${value}`;
        setSetArray(tempArray);
    }


    return (
        <View>
            <Text>{route.params.id}</Text>
            <Text>{route.params.name}</Text>
            <TouchableOpacity onPress={() => addSet()}>
                <Text>Add a set</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteSet()}>
                <Text>delete a set</Text>
            </TouchableOpacity>
            {/* {setArray.map((set, index) => {
                console.log(set);
                    <View key={index} style={styles.setContainer}><Text>1sfthrhd</Text></View>
                })} */}
            <ScrollView style={styles.scrollview}>
                {setArray.map((set, index) => 
                    // <Text>afgadfgsa</Text>
                    <View key={index} style={styles.setContainer}>
                        {/* <Text>{set}</Text> */}
                        <Text>Reps: </Text>
                        <TextInput value={set[0]} selectTextOnFocus keyboardType='numeric' placeholder='0' onChangeText={(value) => updateRep(index, value)}/>
                        <Text>Weight: </Text>
                        <TextInput value={set[1]} selectTextOnFocus keyboardType='numeric' placeholder='0' onChangeText={(value) => updateWeight(index, value)}/>
                    </View>
                )}
            </ScrollView>
            {/* {setArray.length != 0 ? 
                <ScrollView style={styles.scrollview}>
                    {setArray.map((set, index) => {
                        console.log(set);
                        <Text key={index}>{set}</Text>
                    })}
                </ScrollView> : <Text>No Exercises</Text>
            } */}
            
            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate({name: 'Routine', params: {id: route.params.id, setArray: setArray}, merge: true})}
                >
                    <Text>Log</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollview: {
        width: '100%',
        height: 500,
        backgroundColor: 'blue',
    },
    setContainer: {
        width: '90%',
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
})

export default LogSetScreen;