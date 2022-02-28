import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

function HomeScreen({navigation}) {

    const [ selectedDate, setSelectedDate ] = useState('');
    

    return (
        <View>
            <CalendarStrip
                onDateSelected={day => {
                    setSelectedDate(day.toISOString().slice(0, 10));
                }}
                daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'black'}}
                style={{height:150, paddingTop: 20, paddingBottom: 10}}
            />
            <Text>{selectedDate}</Text>
        </View>
    );
}

export default HomeScreen;