import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

// const db = openDatabase('exercise-db');

function ExListScreen() {
    return (
        <View>
            <ScrollView>

            </ScrollView>
            <TouchableOpacity><Text>ADD</Text></TouchableOpacity>
        </View>
    );
}

export default ExListScreen;