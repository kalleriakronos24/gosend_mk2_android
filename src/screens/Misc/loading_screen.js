import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import io from 'socket.io-client';

const LoadingScreen = ({ navigation }) => {
    const orderReducer = useSelector((state) => state.orders);
    let [error, setError] = useState(false);

    useEffect(() => {
        addOrder();
    }, [])

    const addOrder = async () => {
        await AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then(token => {
                console.log('is this wokring ??')
                let obj = {
                    token: token,
                    coords: orderReducer.costumer_coordinate,
                    item: orderReducer.orders,
                    type: orderReducer.type,
                    pickupDetail: orderReducer.pickupDetail
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
                        if (res.return === true) {
                            setError(true);
                            return;
                        };
                        navigation.push('find_courier');
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            })
            .catch(err => {
                throw new Error(err);
            })
    };



    return (
        error ? (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar barStyle='default' backgroundColor='rgba(0,0,0,0.251)' translucent animated />
                <Text style={{ fontWeight: '600', fontSize: 18, letterSpacing: .5, textAlign: 'center' }}>Tidak ada Kurir Ditemukan, klik Coba Lagi untuk mencari ulang</Text>
                <TouchableOpacity onPress={() => addOrder()} style={{ marginTop: 15, padding: 10, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderColor: 'blue' }}>
                    <Text style={{ letterSpacing: .5, fontWeight: 'bold', fontSize: 16 }}>Coba Lagi</Text>
                </TouchableOpacity>
            </View>
        ) : (
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <StatusBar barStyle='default' backgroundColor='rgba(0,0,0,0.251)' translucent animated />
                    <Text style={{ fontWeight: '600', fontSize: 18, letterSpacing: .5 }}>Mengalihkan ...</Text>
                </View>
            )
    )
}

export default LoadingScreen
