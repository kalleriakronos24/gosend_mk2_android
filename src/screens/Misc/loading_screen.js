import React, { useEffect, useLayoutEffect } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

const LoadingScreen = ({ navigation }) => {
    const orderReducer = useSelector((state) => state.orders);

    useEffect(() => {
        addOrder();
        setTimeout(() => {
            navigation.push('find_courier');
        }, 2000)
    }, [])


    const addOrder = async () => {

        await AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then(res => {
                console.log('is this wokring ??')
                let obj = {
                    token: res,
                    coords: orderReducer.costumer_coordinate,
                    item: orderReducer.orders
                };

                fetch('http://192.168.43.178:8000/add-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        navigation.push('find_courier');
                        console.log('fetched successfully');
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            })
            .catch(err => {
                throw new Error(err);
            })
    }
    return (
        <View style={{ flex: 1, backgroundColor:'white',justifyContent:'center', alignItems:'center' }}>
            <StatusBar barStyle='default' backgroundColor='rgba(0,0,0,0.251)' translucent animated/>
            <Text style={{ fontWeight: '600', fontSize: 18, letterSpacing: .5 }}>Mengalihkan ...</Text>
        </View>
    )
}

export default LoadingScreen
