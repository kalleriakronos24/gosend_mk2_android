import React from 'react'
import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export const Landing = ({ navigation }) => {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white'
        }}>
            <StatusBar barStyle='dark-content' animated backgroundColor='white' />
            <Text>Welcome Screen</Text>
            <View style={{ paddingTop: 5 }}>
                <TouchableOpacity onPress={() => navigation.navigate('new_login')} style={{
                    padding: 16,
                    borderRadius: 4,
                    borderColor: 'blue',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
