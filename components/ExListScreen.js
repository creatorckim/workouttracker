import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, TextInput, TouchableHighlight } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const db = SQLite.openDatabase('exercise-db');

let muscleArray = ['All', 'Trapezius', 'Latissimus Dorsi', 'Bicep', 'Forearms', 'Upper Chest', 'Chest', 'Tricep', 'Anterior Deltoid', 'Lateral Deltoid', 'Posterior Deltoid', 'Quadricep', 'Abductor', 'Adductor', 'Hamstring', 'Glute', 'Calf', 'Erector Spinae', 'Oblique', 'Rectus Abdominis (Spinal Flexion)', 'Rectus Abdominis (Hip Flexion)', 'Heart'];
let equipmentArray = ['All', 'Barbell', 'Dumbbells', 'Machine', 'Bands', 'Pullup Bar'];


function ExListScreen({navigation, route}) {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMuscleFilterVisible, setModalMuscleFilterVisible] = useState(false);
    const [modalEquipFilterVisible, setModalEquipFilterVisible] = useState(false);
    const [exerciseId, setExerciseId] = useState(0);
    const [exerciseName, setExerciseName] = useState('');
    const [muscleName, setMuscleName] = useState('');
    const [equipmentName, setEquipmentName] = useState('');
    const [exerciseList, setExerciseList] = useState([]);
    const [muscleFilter, setMuscleFilter] = useState('All');
    const [equipmentFilter, setEquipmentFilter] = useState('All');

    useEffect(() => {

        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists exercises (id integer primary key not null, name text, muscle text, equipment text);"
            );
            tx.executeSql("select * from exercises", [], (_, { rows: { _array } }) => {
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    temp.push(_array[i]);
                }
                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        muscle: exercise.muscle,
                        equipment: exercise.equipment
                    };
                });
                setExerciseList(initialData);
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
                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        muscle: exercise.muscle,
                        equipment: exercise.equipment
                    };
                });
                setExerciseList(initialData);
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
                    let initialData = temp.map((exercise) => {
                        return {
                            key: exercise.id,
                            label: exercise.name,
                            muscle: exercise.muscle,
                            equipment: exercise.equipment
                        };
                    });
                    setExerciseList(initialData);
                });
            });
        } else if (muscle == 'All' && equipment != 'All') {
            db.transaction((tx) => {
                tx.executeSql("select * from exercises where equipment = ?", [equipment], (_, { rows: { _array } }) => {
                    let temp = [];
                    for (let i = 0; i < _array.length; ++i) {
                        temp.push(_array[i]);
                    }
                    let initialData = temp.map((exercise) => {
                        return {
                            key: exercise.id,
                            label: exercise.name,
                            muscle: exercise.muscle,
                            equipment: exercise.equipment
                        };
                    });
                    setExerciseList(initialData);
                });
            });
        } else if (muscle != 'All' && equipment == 'All') {
            db.transaction((tx) => {
                tx.executeSql("select * from exercises where muscle = ?", [muscle], (_, { rows: { _array } }) => {
                    let temp = [];
                    for (let i = 0; i < _array.length; ++i) {
                        temp.push(_array[i]);
                    }
                    let initialData = temp.map((exercise) => {
                        return {
                            key: exercise.id,
                            label: exercise.name,
                            muscle: exercise.muscle,
                            equipment: exercise.equipment
                        };
                    });
                    setExerciseList(initialData);
                });
            });
        } else {
            db.transaction((tx) => {
                tx.executeSql("select * from exercises where muscle = ? and equipment = ?", [muscle, equipment], (_, { rows: { _array } }) => {
                    let temp = [];
                    for (let i = 0; i < _array.length; ++i) {
                        temp.push(_array[i]);
                    }
                    let initialData = temp.map((exercise) => {
                        return {
                            key: exercise.id,
                            label: exercise.name,
                            muscle: exercise.muscle,
                            equipment: exercise.equipment
                        };
                    });
                    setExerciseList(initialData);
                });
            });
        }

        setExerciseId(0);

    }

    const updateExercise = (id, name, muscle, equipment) => {
        db.transaction((tx) => {
            tx.executeSql("update exercises set name = ? where id = ?", [name, id]);
            tx.executeSql("update exercises set muscle = ? where id = ?", [muscle, id]);
            tx.executeSql("update exercises set equipment = ? where id = ?", [equipment, id]);
            tx.executeSql("select * from exercises", [], (_, { rows: { _array } }) => {
                let temp = [];
                for (let i = 0; i < _array.length; ++i) {
                    temp.push(_array[i]);
                }
                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        muscle: exercise.muscle,
                        equipment: exercise.equipment
                    };
                });
                setExerciseList(initialData);
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
                let initialData = temp.map((exercise) => {
                    return {
                        key: exercise.id,
                        label: exercise.name,
                        muscle: exercise.muscle,
                        equipment: exercise.equipment
                    };
                });
                setExerciseList(initialData);
            });
        });

    };

    const rightAction = (item) => {
        return <TouchableOpacity 
                    style={styles.rightAction} 
                    onPress={() => deleteExercise(item.key)}
                ><Text><AntDesign name="delete" size={30} color="#1e1e1e" /></Text>
                </TouchableOpacity>
    }

    const MuscleFilterButton = (muscle) => {
        return (
            <TouchableOpacity onPress={() => {filterDB(muscle, equipmentFilter); setModalMuscleFilterVisible(!modalMuscleFilterVisible)}} style={styles.filterBtn}>
                <Text style={styles.filterText}>{muscle}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <DraggableFlatList
                ListHeaderComponent={
                    <View>
                        <View style={styles.filterContainer}>
                            <View>
                                <Text style={styles.filterText}>Muscle</Text>
                                <TouchableOpacity onPress={() => setModalMuscleFilterVisible(true)} style={styles.filterBtn}><Text style={styles.filterText}>{muscleFilter}</Text></TouchableOpacity>
                            </View>
                            <View>
                                <Text style={styles.filterText}>Equipment</Text>
                                <TouchableOpacity onPress={() => setModalEquipFilterVisible(true)} style={styles.filterBtn}><Text style={styles.filterText}>{equipmentFilter}</Text></TouchableOpacity>
                            </View>
                        </View>
            
                        <View>
                            <TouchableOpacity 
                                style={styles.addExerciseBtn}
                                onPress={() => {
                                    setExerciseId(0);
                                    setExerciseName('');
                                    setMuscleName('');
                                    setEquipmentName('');
                                    setModalVisible(true)
                                }}>
                                <FontAwesome5 name="plus-circle" size={20} color="#fc4d32" />
                                <Text style={styles.addExerciseBtnText}>Add an exercise</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                style={styles.routineContainer}
                data={exerciseList}
                onDragEnd={({ data }) => setExerciseList(data)}
                keyExtractor={(item) => item.key}
                renderItem={({ item, drag, isActive }) => {
                    return (
                        <ScaleDecorator>
                            <Swipeable
                                disableLeftSwipe
                                renderRightActions={() =>rightAction(item)}
                            >
                                <TouchableHighlight
                                    onPress={() => {
                                        if (route.params.toAdd) {
                                            navigation.navigate({name: 'Routine', params: { name: item.label },merge: true});
                                        } else {
                                            setExerciseId(item.key);
                                            setExerciseName(item.label);
                                            setMuscleName(item.muscle);
                                            setEquipmentName(item.equipment);
                                            setModalVisible(true);
                                        }
                                        
                                    }} 
                                    onLongPress={drag}
                                    disabled={isActive}
                                    style={[
                                        styles.rowItem,
                                        { backgroundColor: isActive ? '#fc4d32' : '#1e1e1e' },
                                    ]}
                                >
                                    <View>
                                        <Text style={styles.text}>{item.label}</Text>
                                        <Text style={styles.text2}>Muscle: {item.muscle}</Text>
                                        <Text style={styles.text2}>Equipment: {item.equipment}</Text>
                                    </View>
                                </TouchableHighlight>
                            </Swipeable>
                        </ScaleDecorator>
                    );
                }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={{height: '100%', width: '100%'}}>
                        <TextInput style={styles.nameInput} value={exerciseName} placeholder='Exercise Name' placeholderTextColor = "#A1A1A1" onChangeText={setExerciseName}/>
                        <Text style={styles.textInput}>Muscle Targeted: </Text>
                        <Picker style={{color: '#fc4d32', marginLeft: 45}} selectedValue={muscleName} onValueChange={(itemValue, itemIndex) => setMuscleName(itemValue)}>
                            <Picker.Item style={styles.pickerItem} label='--Pick a value--' value={null} />
                            <Picker.Item style={styles.pickerItem} label='Trapezius' value='Trapezius'/>
                            <Picker.Item style={styles.pickerItem} label='Latissimus Dorsi' value='Latissimus Dorsi'/>
                            <Picker.Item style={styles.pickerItem} label='Bicep' value='Bicep'/>
                            <Picker.Item style={styles.pickerItem} label='Forearms' value='Forearms'/>
                            <Picker.Item style={styles.pickerItem} label='Upper Chest' value='Upper Chest'/>
                            <Picker.Item style={styles.pickerItem} label='Chest' value='Chest'/>
                            <Picker.Item style={styles.pickerItem} label='Tricep' value='Tricep'/>
                            <Picker.Item style={styles.pickerItem} label='Anterior Deltoid' value='Anterior Deltoid'/>
                            <Picker.Item style={styles.pickerItem} label='Lateral Deltoid' value='Lateral Deltoid'/>
                            <Picker.Item style={styles.pickerItem} label='Posterior Deltoid' value='Posterior Deltoid'/>
                            <Picker.Item style={styles.pickerItem} label='Quadricep' value='Quadricep'/>
                            <Picker.Item style={styles.pickerItem} label='Abductor' value='Abductor'/>
                            <Picker.Item style={styles.pickerItem} label='Adductor' value='Adductor'/>
                            <Picker.Item style={styles.pickerItem} label='Hamstring' value='Hamstring'/>
                            <Picker.Item style={styles.pickerItem} label='Glute' value='Glute'/>
                            <Picker.Item style={styles.pickerItem} label='Calf' value='Calf'/>
                            <Picker.Item style={styles.pickerItem} label='Erector Spinae' value='Erector Spinae'/>
                            <Picker.Item style={styles.pickerItem} label='Oblique' value='Oblique'/>
                            <Picker.Item style={styles.pickerItem} label='Rectus Abdominis (Spinal Flexion)' value='Rectus Abdominis (Spinal Flexion)'/>
                            <Picker.Item style={styles.pickerItem} label='Rectus Abdominis (Hip Flexion)' value='Rectus Abdominis (Hip Flexion)'/>
                            <Picker.Item style={styles.pickerItem} label='Heart' value='Heart'/>
                        </Picker>
                        <Text style={styles.textInput}>Equipment Needed: </Text>
                        <Picker style={{color: '#fc4d32', marginLeft: 45,}} selectedValue={equipmentName} onValueChange={(itemValue, itemIndex) => setEquipmentName(itemValue)}>
                            <Picker.Item style={styles.pickerItem} label='--Pick a value--' value={null} />
                            <Picker.Item style={styles.pickerItem} label='Dumbbells' value='Dumbbells'/>
                            <Picker.Item style={styles.pickerItem} label='Barbell' value='Barbell'/>
                            <Picker.Item style={styles.pickerItem} label='Machine' value='Machine'/>
                            <Picker.Item style={styles.pickerItem} label='Bands' value='Bands'/>
                            <Picker.Item style={styles.pickerItem} label='Pullup Bar' value='Pullup Bar'/>
                        </Picker>
                        <View style={styles.actionBarContainer}>
                            <TouchableOpacity
                            style={styles.button}
                                onPress={() => {
                                    if (exerciseId == 0) {
                                        addToDB(exerciseName, muscleName, equipmentName); 
                                    } else {
                                        updateExercise(exerciseId, exerciseName, muscleName, equipmentName);
                                    }
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalMuscleFilterVisible}
                onRequestClose={() => {
                setModalMuscleFilterVisible(!modalMuscleFilterVisible);
                }}
            >
                <ScrollView style={styles.modalContainer}>
                    <Text style={styles.modalText}>Muscle</Text>
                    <View style={styles.modalFilterContainer}>
                        {muscleArray.map((muscle, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => {setMuscleFilter(muscle); filterDB(muscle, equipmentFilter); setModalMuscleFilterVisible(!modalMuscleFilterVisible)}} style={styles.filterBtn}>
                                    <Text style={styles.filterText}>{muscle}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEquipFilterVisible}
                onRequestClose={() => {
                setModalEquipFilterVisible(!modalEquipFilterVisible);
                }}
            >
                <ScrollView style={styles.modalContainer}>
                <Text style={styles.modalText}>Equipment</Text>
                    <View style={styles.modalFilterContainer}>
                        {equipmentArray.map((equipment, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => {setEquipmentFilter(equipment); filterDB(muscleFilter, equipment); setModalEquipFilterVisible(!modalEquipFilterVisible)}} style={styles.filterBtn}>
                                    <Text style={styles.filterText}>{equipment}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
    },
    listContainer: {
        width: '100%',
        height: '100%',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-evenly",
        textAlign: 'center',
    },
    filterBtn: {
        width: 80,
        height: 80,
        backgroundColor: '#fc4d32',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        margin: 20,
    },
    filterText: {
        color: '#fff',
        textAlign: 'center',
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
        height: '100%',
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
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        paddingLeft: 40
    },
    text2: {
        color: "#A1A1A1",
        fontSize: 15,
        paddingLeft: 40
    },
    exerciseContainer: {
        width: '90%',
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
    },
    modalFilterContainer: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 25,
        margin: 30,
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
    nameInput: {
        width: '100%',
        height: 80,
        padding: 20,
        fontSize: 20,
        color: '#fff',
        marginVertical: 20,
    },
    textInput: {
        width: '100%',
        padding: 20,
        fontSize: 15,
        color: '#fff',
    },
    pickerItem: {
        backgroundColor: '#1e1e1e',
        color: '#fc4d32',
    }
  });

export default ExListScreen;