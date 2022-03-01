import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('exercise-db');

let date = new Date();
let isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

function HomeScreen({navigation, route}) {

    const [selectedDate, setSelectedDate] = useState(isoDateTime.toString());
    const [selectedName, setSelectedName] = useState('');
    const [selectedSetArray, setSelectedSetArray] = useState([]);
    const [routine, setRoutine] = useState([]);

    useEffect(() => {

        getRoutine(selectedDate);

    }, []);

    useEffect(() => {
        if (route.params?.name) {
        // console.log(route.params?.name)

    
        //   console.log(route.params?.name);
        //   addToRoutineArray(route.params?.name, route.params?.id);
        addRoutine(route.params?.name, selectedDate, []);
    
        }
    
      }, [route.params?.name]);

    //   const initialData = routine.map((exercise) => {
    //     return {
    //       key: exercise.id,
    //       label: exercise.name,
    //     };
    //   });

    // const initialData = routine.map(exercise, index) => {
    //     return {
    //       key: {exercise.id},
    //       label: {exercise.name},
    //     };
    //   });

    const getRoutine = ((date) => {
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists routines (id integer primary key not null, name text, date text, setarray text);"
            );
            tx.executeSql("select * from routines where date = ?", [date], (_, { rows: { _array } }) => {
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
                    };
                });
                setRoutine(initialData);
            });
        });
    })

    const addRoutine = (name, date, setarray) => {
        // console.log(date)
        let tempArray = convertArrayToString(setarray);
        db.transaction((tx) => {
            tx.executeSql("insert into routines (name, date, setarray) values (?, ?, ?)", [name, date, tempArray]);
            tx.executeSql("select * from routines where date = ?", [selectedDate], (_, { rows: { _array } }) => {
                let temp = [];
                // console.log('_array')
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
                    };
                });
                // console.log('initialData');
                setRoutine(initialData);
            });
        });
        
    }

    // const updateRoutine = (id, name, date, setarray) => {
    //     let tempArray = convertArrayToString(setarray);
    //     db.transaction((tx) => {
    //         tx.executeSql("update routines set name = ? where id = ?", [name, id]);
    //         tx.executeSql("update routines set date = ? where id = ?", [date, id]);
    //         tx.executeSql("update routines set setarray = ? where id = ?", [tempArray, id]);
    //         tx.executeSql("select * from routines", [], (_, { rows: { _array } }) => {
    //             let temp = [];
    //             for (let i = 0; i < _array.length; ++i) {
    //                 let element = _array[i];
    //                 let convertedArray = convertStringToArray(element.setarray);
    //                 element.setarray = convertedArray;
    //                 temp.push(element);
    //             }
    //             setRoutine(temp);
    //         });
    //     });
    // }

    const convertArrayToString = (array) => {
        let strSeparator = "__,__";
        let str = "";
        for (let i = 0;i<array.length; i++) {
            str = str+array[i];
            if(i<array.length-1){
                str = str+strSeparator;
            }
        }
        return str;
    }

    const convertStringToArray = (str) => {
        let strSeparator = "__,__";
        let arr = str.split(strSeparator);
        return arr;
    }

    // const addToRoutineArray = (exercise) => {
    //     let tempArray = [...routine, exercise];
    //     setRoutine(tempArray);
    // }

    const renderItem = ({ item, drag, isActive }) => {
        return (
          <ScaleDecorator>
            <TouchableOpacity
              onLongPress={drag}
              disabled={isActive}
              style={[
                styles.rowItem,
                { backgroundColor: isActive ? "red" : "blue" },
              ]}
            >
              <Text style={styles.text}>{item.label}</Text>
            </TouchableOpacity>
          </ScaleDecorator>
        );
      };
    

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
                // keyExtractor={(item) => index}
                renderItem={renderItem}
            />
            
        </GestureHandlerRootView>
    );
}

const styles= StyleSheet.create({
    rowItem: {
        height: 100,
        width: 100,
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