import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';

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
        // console.log(route.params?.name)

    
        //   console.log(route.params?.name);
        //   addToRoutineArray(route.params?.name, route.params?.id);
        addRoutine(route.params?.name, selectedDate, [[0,0], [0,0], [0,0]]);
    
        }
    }, [route.params?.name]);

    useEffect(() => {
        if (route.params?.setArray) {
            updateSetArray(route.params?.id, route.params?.setArray);
        }

    }, [route.params?.setArray]);

    // useEffect(() => {
    //     // console.log(route.params?.id)
    //     if (route.params?.id) {
    //         deleteExercise(route.params?.id);
        
    //         }
    // }, [route.params?.id]);


    //   const initialData = routine.map((exercise) => {
    //     return {
    //       key: exercise.id,
    //       label: exercise.name,
    //     };
    //   });


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

    // const addToRoutineArray = (exercise) => {
    //     let tempArray = [...routine, exercise];
    //     setRoutine(tempArray);
    // }

    // const renderItem = ({ item, drag, isActive }) => {
    //     return (
    //       <ScaleDecorator>
    //         <TouchableOpacity
    //             onPress={() => navigation.navigate({name: 'Log Set', params: {id : item.key, name: item.label}, merge: true})}
    //             onLongPress={drag}
    //             disabled={isActive}
    //             style={[
    //                 styles.rowItem,
    //                 { backgroundColor: isActive ? "red" : "blue" },
    //             ]}
    //         >
    //           <Text style={styles.text}>{item.label}</Text>
    //         </TouchableOpacity>
    //       </ScaleDecorator>
    //     );
    //   };

    const rightAction = (item) => {
        return <TouchableOpacity 
                    style={{backgroundColor:'powderblue',height:100, width:80}} 
                    onPress={() => deleteExercise(item.key)}
                ><Text>delete</Text>
                </TouchableOpacity>
      }
      const leftAction = (item) => {
        return <TouchableOpacity 
                    style={{backgroundColor:'powderblue',height:100, width:80}} 
                    onPress={() => navigation.navigate({name: 'Log Set', params: {id : item.key, name: item.label, array: item.array, item: item}, merge: true})}
                ><Text>Update</Text>
                </TouchableOpacity>
      }
    

    return (
        <GestureHandlerRootView>
            <CalendarStrip
                onDateSelected={day => {
                    setSelectedDate(day.toISOString().slice(0, 10));
                    getRoutine(day.toISOString().slice(0, 10));
                }}
                daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'black'}}
                style={{height:150, paddingTop: 20, paddingBottom: 10}}
            />
            <Text>{selectedDate}</Text>
            
            <TouchableOpacity onPress={() => {navigation.navigate({name: 'Exercise List', params: {toAdd : true}, merge: true})}}><Text>Add an exercise</Text></TouchableOpacity>

            <DraggableFlatList
                data={routine}
                onDragEnd={({ data }) => setRoutine(data)}
                keyExtractor={(item) => item.key}
                // renderItem={renderItem}
                renderItem={({ item, drag, isActive }) => {
                        return (
                            <ScaleDecorator>
                                <Swipeable
                                    renderRightActions={() =>rightAction(item)}
                                    renderLeftActions={() => leftAction(item)}
                                >
                                    <TouchableHighlight
                                        // onPress={() => navigation.navigate({name: 'Log Set', params: {id : item.key, name: item.label}, merge: true})}
                                        onLongPress={drag}
                                        disabled={isActive}
                                        style={[
                                            styles.rowItem,
                                            { backgroundColor: isActive ? "red" : "blue" },
                                        ]}
                                    >
                                    <Text style={styles.text}>{item.label}</Text>
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
    rowItem: {
        height: 100,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
      },
      text: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
      },
})

export default HomeScreen;