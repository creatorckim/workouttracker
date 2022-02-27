import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('exercise-db');

function ExListScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setdeleteModalVisible] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [exerciseId, setExerciseId] = useState(0);
    const [exerciseName, setExerciseName] = useState('');
    const [muscleName, setMuscleName] = useState('');
    const [equipmentName, setEquipmentName] = useState('');
    const [exerciseList, setExerciseList] = useState([]);
    const [muscleFilter, setMuscleFilter] = useState('All');
    const [equipmentFilter, setEquipmentFilter] = useState('All');

    useEffect(() => {
        // db.transaction(transaction => {
        //     transaction.executeSql(`
        //       DROP TABLE exercises;`);
        // });
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists exercises (id integer primary key not null, name text, muscle text, equipment text);"
            );
            tx.executeSql("select * from exercises", [], (_, { rows: { _array } }) => {
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    temp.push(_array[i]);
                }
                setExerciseList(temp);
                // setExerciseList(res.rows._array);
                // console.log(temp)
            });
        });
      }, []);

    const addToDB = (name, muscle, equipment) => {

        db.transaction((tx) => {
            tx.executeSql("insert into exercises (name, muscle, equipment) values (?, ?, ?)", [name, muscle, equipment]);
            tx.executeSql("select * from exercises", [], (_, { rows: { _array } }) => {
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    temp.push(_array[i]);
                }
                setExerciseList(temp);
            });
        });

        setExerciseName('');
        setMuscleName('');
        setEquipmentName('');
    };

    const filterDB = (muscle, equipment) => {
        if (muscle == 'All' && equipment == 'All') {
            db.transaction((tx) => {
                tx.executeSql("select * from exercises", [], (_, { rows: { _array } }) => {
                    let temp = [];
                    for (let i = 0; i < _array.length; ++i) {
                        temp.push(_array[i]);
                    }
                    setExerciseList(temp);
                });
            });
        } else if (muscle == 'All' && equipment != 'All') {
            db.transaction((tx) => {
                tx.executeSql("select * from exercises where equipment = ?", [equipment], (_, { rows: { _array } }) => {
                    let temp = [];
                    for (let i = 0; i < _array.length; ++i) {
                        temp.push(_array[i]);
                    }
                    setExerciseList(temp);
                });
            });
        } else if (muscle != 'All' && equipment == 'All') {
            db.transaction((tx) => {
                tx.executeSql("select * from exercises where muscle = ?", [muscle], (_, { rows: { _array } }) => {
                    let temp = [];
                    for (let i = 0; i < _array.length; ++i) {
                        temp.push(_array[i]);
                    }
                    setExerciseList(temp);
                });
            });
        } else {
            db.transaction((tx) => {
                tx.executeSql("select * from exercises where muscle = ? and equipment = ?", [muscle, equipment], (_, { rows: { _array } }) => {
                    let temp = [];
                    for (let i = 0; i < _array.length; ++i) {
                        temp.push(_array[i]);
                    }
                    setExerciseList(temp);
                });
            });
        }

        setExerciseId(0);
        // setMuscleName('');
        // setEquipmentName('');

    }

    const updateExercise = (id, name, muscle, equipment) => {
        db.transaction((tx) => {
            tx.executeSql("update exercises set name = ? where id = ?", [name, id]);
            tx.executeSql("update exercises set muscle = ? where id = ?", [muscle, id]);
            tx.executeSql("update exercises set equipment = ? where id = ?", [equipment, id]);
            // tx.executeSql("update exercises set name = ? and muscle = ? and equipment = ? where id = ?", [name, muscle, equipment, id]);
            tx.executeSql("select * from exercises", [], (_, { rows: { _array } }) => {
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    temp.push(_array[i]);
                }
                setExerciseList(temp);
            });
        });
    }

    const deleteExercise = (id) => {

        db.transaction((tx) => {
            tx.executeSql("delete from exercises where id = ?", [id]);
            tx.executeSql("select * from exercises", [], (_, { rows: { _array } }) => {
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    temp.push(_array[i]);
                }
                setExerciseList(temp);
            });
        });

    };

    return (
        <View style={styles.container}>
            <View>
                <Picker selectedValue={muscleFilter} onValueChange={(itemValue, itemIndex) => setMuscleFilter(itemValue)}>
                    <Picker.Item label='All' value='All' />
                    <Picker.Item label='Trapezius' value='Trapezius'/>
                    <Picker.Item label='Latissimus Dorsi' value='Latissimus Dorsi'/>
                    <Picker.Item label='Bicep' value='Bicep'/>
                    <Picker.Item label='Forearms' value='Forearms'/>
                    <Picker.Item label='Upper Chest' value='Upper Chest'/>
                    <Picker.Item label='Chest' value='Chest'/>
                    <Picker.Item label='Tricep' value='Tricep'/>
                    <Picker.Item label='Anterior Deltoid' value='Anterior Deltoid'/>
                    <Picker.Item label='Lateral Deltoid' value='Lateral Deltoid'/>
                    <Picker.Item label='Posterior Deltoid' value='Posterior Deltoid'/>
                    <Picker.Item label='Quadricep' value='Quadricep'/>
                    <Picker.Item label='Abductor' value='Abductor'/>
                    <Picker.Item label='Adductor' value='Adductor'/>
                    <Picker.Item label='Hamstring' value='Hamstring'/>
                    <Picker.Item label='Glute' value='Glute'/>
                    <Picker.Item label='Calf' value='Calf'/>
                    <Picker.Item label='Erector Spinae' value='Erector Spinae'/>
                    <Picker.Item label='Oblique' value='Oblique'/>
                    <Picker.Item label='Rectus Abdominis (Spinal Flexion)' value='Rectus Abdominis (Spinal Flexion)'/>
                    <Picker.Item label='Rectus Abdominis (Hip Flexion)' value='Rectus Abdominis (Hip Flexion)'/>
                    <Picker.Item label='Heart' value='Heart'/>
                </Picker>
                <Picker selectedValue={equipmentFilter} onValueChange={(itemValue, itemIndex) => setEquipmentFilter(itemValue)}>
                    <Picker.Item label='All' value="All" />
                    <Picker.Item label='Dumbbells' value='Dumbbells'/>
                    <Picker.Item label='Barbell' value='Barbell'/>
                    <Picker.Item label='Machine' value='Machine'/>
                    <Picker.Item label='Bands' value='Bands'/>
                    <Picker.Item label='Pullup Bar' value='Pullup Bar'/>
                </Picker>
                <TouchableOpacity onPress={() => filterDB(muscleFilter, equipmentFilter)}>
                    <Text>Filter</Text>
                </TouchableOpacity>
            </View>
            {exerciseList.length != 0 ? 
                <ScrollView style={styles.listContainer}>
                    {exerciseList.map((exercise) =>
                        <TouchableOpacity key={exercise.id} style={styles.exerciseContainer} 
                            onPress={() => {
                                setExerciseId(exercise.id);
                                setExerciseName(exercise.name);
                                setMuscleName(exercise.muscle);
                                setEquipmentName(exercise.equipment);
                                setModalVisible(true);
                            }} 
                            onLongPress={() => {
                                setExerciseId(exercise.id); 
                                setdeleteModalVisible(true);
                            }}>
                            <Text>{exercise.name}</Text>
                            <Text>Muscle: {exercise.muscle}</Text>
                            <Text>Equipment: {exercise.equipment}</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView> : <Text>No Exercises</Text>
            }
             <View style={styles.actionBarContainer}>
                <TouchableOpacity 
                    onPress={() => {
                        setExerciseId(0);
                        setExerciseName('');
                        setMuscleName('');
                        setEquipmentName('');
                        setModalVisible(true)
                    }}>
                    <View style={styles.addButtonContainer}>
                    <Text style={styles.addButton}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Exercise Name: </Text>
                        <TextInput value={exerciseName} placeholder='Exercise Name' onChangeText={setExerciseName}/>
                        <Text>Muscle Targeted: </Text>
                        <Picker selectedValue={muscleName} onValueChange={(itemValue, itemIndex) => setMuscleName(itemValue)}>
                            <Picker.Item label='--Pick a value--' value={null} />
                            <Picker.Item label='Trapezius' value='Trapezius'/>
                            <Picker.Item label='Latissimus Dorsi' value='Latissimus Dorsi'/>
                            <Picker.Item label='Bicep' value='Bicep'/>
                            <Picker.Item label='Forearms' value='Forearms'/>
                            <Picker.Item label='Upper Chest' value='Upper Chest'/>
                            <Picker.Item label='Chest' value='Chest'/>
                            <Picker.Item label='Tricep' value='Tricep'/>
                            <Picker.Item label='Anterior Deltoid' value='Anterior Deltoid'/>
                            <Picker.Item label='Lateral Deltoid' value='Lateral Deltoid'/>
                            <Picker.Item label='Posterior Deltoid' value='Posterior Deltoid'/>
                            <Picker.Item label='Quadricep' value='Quadricep'/>
                            <Picker.Item label='Abductor' value='Abductor'/>
                            <Picker.Item label='Adductor' value='Adductor'/>
                            <Picker.Item label='Hamstring' value='Hamstring'/>
                            <Picker.Item label='Glute' value='Glute'/>
                            <Picker.Item label='Calf' value='Calf'/>
                            <Picker.Item label='Erector Spinae' value='Erector Spinae'/>
                            <Picker.Item label='Oblique' value='Oblique'/>
                            <Picker.Item label='Rectus Abdominis (Spinal Flexion)' value='Rectus Abdominis (Spinal Flexion)'/>
                            <Picker.Item label='Rectus Abdominis (Hip Flexion)' value='Rectus Abdominis (Hip Flexion)'/>
                            <Picker.Item label='Heart' value='Heart'/>
                        </Picker>
                        <Text>Equipment Needed: </Text>
                        <Picker selectedValue={equipmentName} onValueChange={(itemValue, itemIndex) => setEquipmentName(itemValue)}>
                            <Picker.Item label='--Pick a value--' value={null} />
                            <Picker.Item label='Dumbbells' value='Dumbbells'/>
                            <Picker.Item label='Barbell' value='Barbell'/>
                            <Picker.Item label='Machine' value='Machine'/>
                            <Picker.Item label='Bands' value='Bands'/>
                            <Picker.Item label='Pullup Bar' value='Pullup Bar'/>
                        </Picker>
                        <TouchableOpacity 
                            onPress={() => {
                                updateExercise(exerciseId, exerciseName, muscleName, equipmentName);
                                // if (exerciseId == 0) {
                                //     addToDB(exerciseName, muscleName, equipmentName); 
                                // } else {
                                //     updateExercise(exerciseName, muscleName, equipmentName, exerciseId);
                                // }
                                setModalVisible(!modalVisible);
                            }}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                    setdeleteModalVisible(!deleteModalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => {deleteExercise(exerciseId); setdeleteModalVisible(!deleteModalVisible)}}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setdeleteModalVisible(!deleteModalVisible)}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    listContainer: {
        width: '100%',
        height: '100%',
        // backgroundColor: '#af216e',
    },
    exerciseContainer: {
        width: '90%',
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#af216e',
    },
    actionBarContainer: {
        position: 'absolute',
        bottom: 0,
        padding: 15,
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
      },
      addButtonContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#af216e',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
      },
      addButton: {
        fontSize: 30,
        color: '#fff',
      },
  });

export default ExListScreen;