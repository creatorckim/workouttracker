import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

function LogSetScreen({navigation, route}) {
    return (
        <View>
            <Text>{route.params.id}</Text>
            <Text>{route.params.name}</Text>
            <TouchableOpacity>
                <Text>Add a set</Text>
            </TouchableOpacity>
            {/* <View>
                <TouchableOpacity onPress={() => {
                    // navigation.navigate({name: 'Routine', params: {deleted: true, id: route.params.id}, merge: true});
                }}>
                    <Text>Delete</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
}

export default LogSetScreen;