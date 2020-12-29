import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SERVER_URL } from '../../utils/constants';
import NetworkIndicator from '../../components/NetworkIndicator';
import SupportSection from '../../components/Support';

const LoadingScreen = ({ navigation, route }) => {
    const orderReducer = useSelector((state) => state.orders);
    let [error, setError] = useState(false);
    const { detail } = route.params;

    const dispatch = useDispatch();


    useEffect(() => {
        addOrder();
    }, [])

    const addOrder = async () => {
        await AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then(token => {
                console.log('is this wokring ??')
                let obj = {
                    token: token,
                    penerima: orderReducer.penerima,
                    pengirim: orderReducer.pengirim,
                    ongkirz: orderReducer.ongkir,
                    distance: orderReducer.distance,
                    brg: detail
                };

                fetch(`${SERVER_URL}/add-order`, {
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

    const backToHome = () => {
        dispatch({ type: 'reset' });
        navigation.navigate('home');
    }


    return (
        error ? (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar barStyle='default' backgroundColor='rgba(0,0,0,0.251)' translucent animated />
                <Text style={{ fontWeight: '600', fontSize: 18, letterSpacing: .5, textAlign: 'center' }}>Tidak ada Kurir Ditemukan, klik Coba Lagi untuk mencari ulang</Text>
                <TouchableOpacity onPress={() => addOrder()} style={{ marginTop: 15, padding: 10, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderColor: 'blue' }}>
                    <Text style={{ letterSpacing: .5, fontWeight: 'bold', fontSize: 16 }}>Coba Lagi</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => backToHome()} style={{ marginTop: 15, padding: 10, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderColor: 'blue' }}>
                    <Text style={{ letterSpacing: .5, fontWeight: 'bold', fontSize: 16 }}>Back to Home</Text>
                </TouchableOpacity>

                <SupportSection/>
            </View>
        ) : (
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <StatusBar barStyle='default' backgroundColor='rgba(0,0,0,0.251)' translucent animated />
                    <NetworkIndicator/>
                    <Text style={{ fontWeight: '600', fontSize: 18, letterSpacing: .5 }}>Mengalihkan ...</Text>
                </View>
            )
    )
}

export default LoadingScreen
