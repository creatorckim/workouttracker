import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const db = SQLite.openDatabase('exercise-db');

let date = new Date();
let isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

function HomeScreen({navigation, route}) {

    const [selectedDate, setSelectedDate] = useState(isoDateTime.toString());
    const [selectedName, setSelectedName] = useState('');
    const [selectedId, setSelectedId] = useState(0);
    const [selectedSetArray, setSelectedSetArray] = useState([]);
    const [routine, setRoutine] = useState([]);
    const [deleteModalVisible, setdeleteModalVisible] = useState(false);

    useEffect(() => {

        getRoutine(selectedDate);
        

    }, []);

    useEffect(() => {
        if (route.params?.name) {

        addRoutine(route.params?.name, selectedDate, [[0,0], [0,0], [0,0]]);
    
        }
    }, [route.params?.name]);

    useEffect(() => {
        if (route.params?.setArray) {
            updateSetArray(route.params?.id, route.params?.setArray);
        }

    }, [route.params?.setArray]);

    const getRoutine = ((date) => {
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists routines (id integer primary key not null, name text, date text, setarray text);"
            );
            tx.executeSql("select * from routines where date = ?", [date], (_, { rows: { _array } }) => {
                // console.log(_array)
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    let element = _array[i];
                    let convertedArray = convertStringToArray(element.setarray);
                    element.setarray = convertedArray;
                    temp.push(element);
                }
                // console.log(temp)

                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        array: exercise.setarray,
                    };
                });
                setRoutine(initialData);
            });
        });
    })

    const addRoutine = (name, date, setarray) => {
        // console.log(date)
        // console.log('setArray ', setarray)
        let tempArray = convertArrayToString(setarray);
        // console.log('temparray ', tempArray)

        db.transaction((tx) => {
            tx.executeSql("insert into routines (name, date, setarray) values (?, ?, ?)", [name, date, tempArray]);
            tx.executeSql("select * from routines where date = ?", [selectedDate], (_, { rows: { _array } }) => {
                let temp = [];
                // console.log('_array')
                for (let i = 0; i < _array.length; ++i) {
                    let element = _array[i];
                    let convertedArray = convertStringToArray(element.setarray);
                    // console.log(convertedArray)
                    element.setarray = convertedArray;
                    temp.push(element);
                }
                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        array: exercise.setarray,
                    };
                });
                // console.log('initialData');
                setRoutine(initialData);
            });
        });
        
    }

    const updateSetArray = (id, setarray) => {
        let tempArray = convertArrayToString(setarray);
        db.transaction((tx) => {
            tx.executeSql("update routines set setarray = ? where id = ?", [tempArray, id]);
            tx.executeSql("select * from routines where date = ?", [selectedDate], (_, { rows: { _array } }) => {
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    let element = _array[i];
                    let convertedArray = convertStringToArray(element.setarray);
                    element.setarray = convertedArray;
                    temp.push(element);
                }
                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        array: exercise.setarray,
                    };
                });
                // console.log(temp)
                setRoutine(initialData);
            });
        });
    }

    const deleteExercise = (id) => {

        db.transaction((tx) => {
            tx.executeSql("delete from routines where id = ?", [id]);
            tx.executeSql("select * from routines where date = ?", [selectedDate], (_, { rows: { _array } }) => {
                // console.log(_array)
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    let element = _array[i];
                    let convertedArray = convertStringToArray(element.setarray);
                    element.setarray = convertedArray;
                    temp.push(element);
                }
                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        array: exercise.setarray,
                    };
                });
                // console.log(temp)
                setRoutine(initialData);
            });
        });

    };

    const convertArrayToString = (array) => {
        let strSeparator = "/";
        let str = "";
        for (let i = 0; i < array.length; i++) {
            let strsep = ",";
            let str2 = "";
            for (let x = 0; x <array[i].length; x++) {
                str2 = str2 + array[i][x];
                if(x < array[i].length - 1){
                    str2 = str2 + strsep;
                }
            }
            str = str + str2;
            // str = str + array[i];
            if(i < array.length - 1){
                str = str + strSeparator;
            }
        }
        // console.log(str);
        return str;
    }

    const convertStringToArray = (str) => {
        let strSeparator = "/";
        let arr = str.split(strSeparator);

        let newArray = [];
        for (let i = 0; i < arr.length; i++) {
            let strsep = ",";
            let arr2 = arr[i].split(strsep);
            // console.log(arr2)
            newArray.push(arr2);
        }
        // console.log(newArray);
        return newArray;
    }

    const rightAction = (item) => {
        return <TouchableOpacity 
                    style={styles.rightAction} 
                    onPress={() => deleteExercise(item.key)}
                ><Text><AntDesign name="delete" size={30} color="#1e1e1e" /></Text>
                </TouchableOpacity>
      }
    //   const leftAction = (item) => {
    //     return <TouchableOpacity 
    //                 style={{backgroundColor:'powderblue',height:100, width:80}} 
    //                 onPress={() => navigation.navigate({name: 'Log Set', params: {id : item.key, name: item.label, array: item.array, item: item}, merge: true})}
    //             ><Text>Update</Text>
    //             </TouchableOpacity>
    //   }
    

    return (
        <GestureHandlerRootView style={styles.container}>
            
            <View style={styles.calendarContainer}>
                <CalendarStrip
                    scrollable
                    selectedDate={isoDateTime}
                    onDateSelected={day => {
                        setSelectedDate(day.toISOString().slice(0, 10));
                        getRoutine(day.toISOString().slice(0, 10));
                    }}
                    daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#fc4d32'}}
                    style={{height:100, width: '90%'}}
                    calendarHeaderStyle={{color: '#fff', fontSize: 20}}
                    dateNameStyle={{color: '#fff'}}
                    dateNumberStyle={{color: '#fff'}}
                    highlightDateNameStyle={{color: '#fc4d32'}}
                    highlightDateNumberStyle={{color: '#fc4d32'}}
                    leftSelector={[]}
                    rightSelector={[]}
                />
            </View>
            
            <TouchableOpacity style={styles.addExerciseBtn} onPress={() => {navigation.navigate({name: 'Exercise List', params: {toAdd : true}, merge: true})}}>
                <FontAwesome5 name="plus-circle" size={20} color="#fc4d32" />
                <Text style={styles.addExerciseBtnText}>Add an exercise</Text>
            </TouchableOpacity>

            <DraggableFlatList
                // ListHeaderComponent={
                //     <View>
                //         <View style={styles.calendarContainer}>
                //             <CalendarStrip
                //                 scrollable
                //                 selectedDate={isoDateTime}
                //                 onDateSelected={day => {
                //                     setSelectedDate(day.toISOString().slice(0, 10));
                //                     getRoutine(day.toISOString().slice(0, 10));
                //                 }}
                //                 daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#fc4d32'}}
                //                 style={{height:100, width: '90%'}}
                //                 calendarHeaderStyle={{color: '#fff', fontSize: 20}}
                //                 dateNameStyle={{color: '#fff'}}
                //                 dateNumberStyle={{color: '#fff'}}
                //                 highlightDateNameStyle={{color: '#fc4d32'}}
                //                 highlightDateNumberStyle={{color: '#fc4d32'}}
                //                 leftSelector={[]}
                //                 rightSelector={[]}
                //             />
                //         </View>
                        
                //         <TouchableOpacity style={styles.addExerciseBtn} onPress={() => {navigation.navigate({name: 'Exercise List', params: {toAdd : true}, merge: true})}}>
                //             <FontAwesome5 name="plus-circle" size={20} color="#fc4d32" />
                //             <Text style={styles.addExerciseBtnText}>Add an exercise</Text>
                //         </TouchableOpacity>
                //     </View>
                // }
                style={styles.routineContainer}
                data={routine}
                onDragEnd={({ data }) => setRoutine(data)}
                keyExtractor={(item) => item.key}
                // renderItem={renderItem}
                renderItem={({ item, drag, isActive }) => {
                    return (
                        <ScaleDecorator>
                            <Swipeable
                                disableLeftSwipe
                                renderRightActions={() =>rightAction(item)}
                                // renderLeftActions={() => leftAction(item)}
                            >
                                <TouchableHighlight
                                    onPress={() => navigation.navigate({name: 'Log Set', params: {id : item.key, name: item.label, array: item.array, item: item}, merge: true})}
                                    // onPress={() => navigation.navigate({name: 'Log Set', params: {id : item.key, name: item.label}, merge: true})}
                                    onLongPress={drag}
                                    disabled={isActive}
                                    style={[
                                        styles.rowItem,
                                        { backgroundColor: isActive ? '#fc4d32' : '#1e1e1e' },
                                    ]}
                                >
                                    <View>
                                        <Text style={styles.text}>{item.label}</Text>
                                        <Text style={styles.text2}>{item.array.length} Sets</Text>
                                    </View>
                                </TouchableHighlight>
                            </Swipeable>
                        </ScaleDecorator>
                    );
                }}
            />
        </GestureHandlerRootView>
    );
}

const styles= StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
    },
    calendarContainer: {
        marginVertical: 20,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    addExerciseBtn: {
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        marginLeft: 20,
        marginBottom: 20,
        alignItems: "center",
    },
    addExerciseBtnText:{
        color: '#fc4d32',
        fontSize: 20,
        paddingLeft: 10,
    },
    routineContainer: {
        height: '70%',
        // padding: 20,
        // marginBottom: 550,
    },
    rightAction: {
        backgroundColor:'#fc4d32',
        height: 80, 
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    rowItem: {
        height: 80,
        width: '100%',
        // alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        paddingLeft: 40
        // textAlign: "center",
    },
    text2: {
        color: "#A1A1A1",
        fontSize: 15,
        paddingLeft: 40
        // textAlign: "center",
    },
})

export default HomeScreen;