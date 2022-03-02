import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('exercise-db');

function NoteScreen({navigation}) {

    const [note, setNote] = useState('');
    const [id, setId] = useState(1);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists notes (id integer primary key not null, note text);"
            );
            tx.executeSql("select * from notes", [], (_, { rows: { _array } }) => {
                if (_array.length != 0) {
                    setNote(_array[0].note);
                    setId(_array[0].id);
                }
            });
        });

    }, []);

    const updateNote = (id, note) => {
        db.transaction((tx) => {
            tx.executeSql("replace into notes (id, note) values (?, ?)", [id, note]);
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{width: '100%'}}>
                <TextInput multiline style={styles.textinput} value={note} placeholder='Note' onChangeText={setNote} />
            </ScrollView>
            <View style={styles.actionBarContainer}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    updateNote(id, note);
                    navigation.goBack();
                }}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtn: {
        width: '90%',
        height: '8%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fc4d32',
        borderRadius: 5,
        marginBottom: 25,
    },
    btnText: {
        color:  '#1e1e1e',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textinput: {
        width: '100%',
        textAlignVertical: 'top',
        fontSize: 17,
        padding: 20,
        color: '#fff',
        marginBottom: 100,
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
});

export default NoteScreen;