import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('exercise-db');

function NoteScreen() {

    const [note, setNote] = useState('');
    const [id, setId] = useState(1);
    // const [notes, setNotes] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists notes (id integer primary key not null, note text);"
            );
            // tx.executeSql("replace into notes (id, note) values (?, ?)", [id, note]);
            tx.executeSql("select * from notes", [], (_, { rows: { _array } }) => {
                console.log(_array);
                // let temp = [];
                // for (let i = 0; i < _array.length; ++i) {
                //     temp.push(_array[i]);
                // }
                // setNotes(temp);
                if (_array.length != 0) {
                    setNote(_array[0].note);
                    // setId(_array[0].id);
                }
            });
            tx.executeSql("replace into notes (id, note) values (?, ?)", [id, note]);
            // tx.executeSql("select * from notes", [], (_, { rows: { _array } }) => {
            //     // setNotes(_array);
            //     setNote(_array[0].note);
            //     setId(_array[0].id);
            //     // console.log(_array[0].note);
            // });
        });

        // return () => {
        //     console.log("note: ", note);
        //     // updateNote(id, note);
        //     // db.transaction((tx) => {
        //     //     tx.executeSql("update notes set note = ? where id = 1", [note]);
        //     // });
        //     // console.log(id)
        //     // if (id == 0) {
        //     //     addToDB(note);
        //     // } else {
        //     //     // console.log('dffj')
        //     //     updateNote(id, note);
        //     // }
        // }
      }, []);

    //   useEffect(() => {
    //     addToDB(note);
    //   }, setNote);

    // const addToDB = (note) => {

    //     db.transaction((tx) => {
    //         tx.executeSql("insert into notes (note) values (?)", [note]);
    //     });

    // };

    const updateNote = (id, note) => {
        // console.log("id: ", id);
        db.transaction((tx) => {
            tx.executeSql("update notes set note = ? where id = ?", [note, id]);
        });
    }

    return (
        <View>
            <TextInput multiline style={styles.container} value={note} placeholder='Note' onChangeText={setNote} />
            <TouchableOpacity onPress={() => {
                updateNote(id, note);
                // if (id == 0) {
                //     addToDB(note);
                // } else {
                //     updateNote(id, note);
                // }
            }}><Text>add</Text></TouchableOpacity> 
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '50%',
        textAlignVertical: 'top',
        fontSize: 30,
    }
});

export default NoteScreen;