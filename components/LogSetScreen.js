import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';


function LogSetScreen({navigation, route}) {

    const [setArray, setSetArray] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {

        setSetArray(route.params.array);

    }, [])

    const addSet = () => {
        let tempArray = [...setArray, ...[['0', '0']]];
        setSetArray(tempArray);
    }

    const deleteSet = (index) => {
        let tempArray = [...setArray];
        tempArray.splice(index, 1);
        setSetArray(tempArray);
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

    const initialData = setArray.map((set, index) => {
        return {
          key: index,
          reps: set[0],
          weight: set[1],
        };
    });

    const rightAction = (item) => {
        return <TouchableOpacity 
                    style={styles.rightAction} 
                    onPress={() => deleteSet(item.key)}
                ><Text><AntDesign name="delete" size={30} color="#1e1e1e" /></Text>
                </TouchableOpacity>
    }


    return (
        <GestureHandlerRootView style={styles.container}>
            <DraggableFlatList
                ListHeaderComponent={
                    <View>
                        <Text style={styles.titleName}>{route.params.name}</Text>
                        <View>
                            <TouchableOpacity 
                                style={styles.addSetBtn}
                                onPress={() => addSet()}>
                                <FontAwesome5 name="plus-circle" size={20} color="#fc4d32" />
                                <Text style={styles.addSetBtnText}>Add a set</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                style={styles.flatList}
                data={initialData}
                onDragEnd={({ initialData }) => setData(initialData)}
                keyExtractor={(item) => item.key}
                renderItem={({ item, isActive }) => {
                    return (
                        <ScaleDecorator>
                            <Swipeable
                                disableLeftSwipe
                                renderRightActions={() =>rightAction(item)}
                            >
                                <TouchableOpacity
                                disabled={isActive}
                                style={[
                                    { backgroundColor: isActive ? "red" : item.backgroundColor },
                                ]}
                                >
                                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={styles.textInputContainer}>
                                            <Text style={styles.index}>{item.key + 1}</Text>
                                            <TextInput style={styles.textInput} value={setArray[item.key][0]} selectTextOnFocus keyboardType='numeric' placeholder='0' onChangeText={(value) => updateRep(item.key, value)}/>
                                            <Text style={styles.text}>REPS</Text>
                                            <Text style={styles.text}>/</Text>
                                            <TextInput style={styles.textInput} value={setArray[item.key][1]} selectTextOnFocus keyboardType='numeric' placeholder='0' onChangeText={(value) => updateWeight(item.key, value)}/>
                                            <Text style={styles.text}>LBS</Text>    
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        </ScaleDecorator>
                    )
                }}
            />       
            
            <View style={styles.actionBarContainer}>
                <TouchableOpacity
                style={styles.button}
                    onPress={() => navigation.navigate({name: 'Routine', params: {id: route.params.id, setArray: setArray}, merge: true})}
                >
                    <Text style={styles.buttonText}>Log Exercise</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
    },
    titleName: {
        fontSize: 20,
        margin: 20,
        color: '#fff',
    },
    addSetBtn: {
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        marginLeft: 20,
        marginBottom: 20,
        alignItems: "center",
    },
    addSetBtnText:{
        color: '#fc4d32',
        fontSize: 20,
        paddingLeft: 10,
    },
    flatList: {
        width: '100%',
        height: '100%',
    },
    setBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    setBtn: {
        height: 50,
        width: 100,
        backgroundColor: '#fc4d32',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    scrollview: {
        width: '100%',
        marginBottom: 80,
    },
    setContainer: {
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    actionBarContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: '100%',
        width: '90%',
        backgroundColor: '#fc4d32',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 5,
    },
    buttonText: {
          color: '#1e1e1e',
          fontSize: 20,
          fontWeight: 'bold',
    },
    textInputContainer: {
        width: '90%',
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    index: {
        height: 30,
        width: 30,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 30,
        textAlign: 'center',
        fontSize: 20,
    },
    text: {
        width: 50,
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
    },
    textInput: {
        width: 50,
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
    },
    rightAction: {
        backgroundColor:'#fc4d32',
        height: 80, 
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
})

export default LogSetScreen;