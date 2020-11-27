import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, ScrollView, ActivityIndicator, Touchable, TouchableOpacity, Dimensions, ToastAndroid, Alert } from 'react-native'
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { useIsFocused } from '@react-navigation/native';
import io from 'socket.io-client';
import { formatRupiah, requestLocationPermission } from '../../utils/functionality';
import Geolocation from '@react-native-community/geolocation';
import { SERVER_URL } from '../../utils/constants';


const socket = io(SERVER_URL, {
    "transports": ['websocket'],
    upgrade: false
});


const GOOGLE_MAPS_APIKEY = 'AIzaSyCbgXJ_ueIa0jryLcfkmX1LaJ7Eo29hqEM';


const Home = ({ navigation }) => {

    // vars and invoked function
    const dispatch = useDispatch();
    const barHeight = StatusBar.currentHeight;
    const device = useSelector(state => state.device);

    // state
    let [index, setIndex] = useState(0);
    let [isLoading, setIsLoading] = useState(true);
    let [userData, setUserData] = useState({});
    let [id, setId] = useState('');
    let [name, setName] = useState('');

    const logoutHandler = async () => {
        console.log('logged out');

        await AsyncStorage.removeItem('LOGIN_TOKEN')

        dispatch({ type: 'LOGOUT' });

        await navigation.replace('new_login');
    };

    let [address, setAddress] = useState("");

    const isFocused = useIsFocused();

    // lifecycle method;

    useEffect(() => {

        AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => {
            socket.emit('userConnected', r);
            return fetchUserByToken(r)
        });

        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {
                if (data === 'already-enabled')
                    return
                console.log('is this running ?')
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            }).catch(err => {
                console.log(err.msg);
                // The user has not accepted to enable the location services or something went wrong during the process
                // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                // codes : 
                //  - ERR00 : The user has clicked on Cancel button in the popup
                //  - ERR01 : If the Settings change are unavailable
                //  - ERR02 : If the popup has failed to open
            });
        return () => {
            console.log('unmounted home');
        }

    }, [isFocused]);


    useEffect(() => {
        Geolocation.getCurrentPosition(
            async (position) => {
                await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + GOOGLE_MAPS_APIKEY)
                    .then((response) => response.json())
                    .then((res) => {
                        setAddress(res.results[0]["address_components"][1]["short_name"]);
                    })
            },
            (err) => {
                // setError('Terjadi kesalahan koneksi dalam memproses lokasi anda. tidak dapat melanjutkan')
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: false, timeout: 8000, distanceFilter: 1000 }
        )
    }, [isFocused])

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const fetchUserByToken = async (token) => {

        await fetch(`${SERVER_URL}/user/single/` + token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log('this too ?');
                if (res)
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 2000)
                setUserData(res.data);
                console.log('count ?? ', res.data.count);
            })
            .catch(err => {
                throw new Error(err);
            })
    };


    const { type, fullname } = userData;
    const { width, height } = Dimensions.get('window');

    const switchScreenHandler = () => {
        if (userData.user_order === "" || userData.user_order === null || userData.user_order === undefined) {
            navigation.navigate('pilih_lewat_map', { data: { name: userData.fullname, no_hp: userData.no_hp, fotoDiri: userData.fotoDiri } });
        } else {
            ToastAndroid.showWithGravity('Tidak dapat membuat order, kamu masih punya order aktif', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            return;
        }
    };


    const test = async () => {


        let body = {
            message: {
                data: {
                    testing: 'HELLOOOO BROOO KIMMMMM'
                }
            },
            device_token: 'cR8QRvlJRxSYX-WqzLWDh-:APA91bGc2yQAvMR28L4-yTv9q-UPmcsDYYHrBOHhW8CmArfSIPvf3b0brdCrsZMzEvgcc7JWl8YrKikCwAs5XkOCYalgxAFplmV-i30YHEtPUdyJNQb54QHEwnPdjsbmtdq0Lls3FscC'
        };

        return await fetch(`${SERVER_URL}/testing123`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                console.log('berhasil ', res);
            })
            .catch(err => {
                console.log('error :: ', err);
            })
    };

    return isLoading ?
        (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator color='blue' size='large' />
            </View>
        ) : (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar animated translucent={true} barStyle='default' backgroundColor='transparent' />
                <Swiper bounces={true} loadMinimalLoader={<ActivityIndicator />} showsPagination={false} loop={false} index={0}>
                    {/* Main Feature */}
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ height: 300, backgroundColor: '#1F4788', borderBottomRightRadius: 70, paddingTop: barHeight }}>

                            <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="location-outline" size={20} color='white' />
                                    <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing: 0.7, color: 'white' }}>{address || "Lokasi tidak ditemukan."}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => Alert.alert('Pesan Sistem', 'Fitur Pencarian Belum Tersedia')} style={{ marginHorizontal: 10 }}>
                                        <Icon name="search-outline" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onLongPress={() => ToastAndroid.showWithGravity('Cek Orderan', ToastAndroid.LONG, ToastAndroid.BOTTOM)} onPress={() => navigation.push('find_courier')} activeOpacity={.7}>
                                        <Icon name="basket-outline" size={20} color='white' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{ fontSize: 30, fontWeight: '600', letterSpacing: 0.5, color: 'white' }}>Ongqir v0.1 Release!</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ backgroundColor: '#1F4788', height: 70, width: 70, position: 'absolute', zIndex: -10, borderBottomRightRadius: 200 }} />
                            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 70, flex: 1, zIndex: 10 }}>
                                <View style={{ paddingTop: 20, paddingHorizontal: 32 }}>
                                    <View style={{ padding: 16 }}>
                                        <Text style={{ fontSize: 23, letterSpacing: 0.5, fontWeight: '600' }}>Fitur Kami</Text>

                                        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => switchScreenHandler()} style={{ backgroundColor: '#1F4788', padding: 6, height: 150, width: 150, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 20, borderTopRightRadius: 20 }}>
                                                <View style={{ padding: 6, height: 55, width: 55, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'white' }}>
                                                    <Icon name="bicycle-outline" size={35} color='white' />
                                                </View>
                                                <View style={{ paddingTop: 20 }}>
                                                    <Text style={{ fontSize: 17, letterSpacing: .5, fontWeight: '500', color: 'white' }}>Kirim Barang</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.4} onPress={() => test()} style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon size={40} name="arrow-forward-circle-outline" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{ padding: 16 }}>
                                        <Text style={{ fontSize: 23, letterSpacing: 0.5, fontWeight: '600', textAlign: 'center' }}>{'\u00A9'}Copyright Ongqir 2020. All Rights Reserved</Text>
                                        <View style={{ padding: 6 }}>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {/* Account Page including check order */}
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ height: 300, backgroundColor: '#1F4788', borderBottomRightRadius: 70, paddingTop: barHeight }}>

                            <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="person-outline" size={20} color='white' />
                                    <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing: 0.7, color: 'white' }}>Account Type : {userData.type === 'user' ? 'User' : 'Courier'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity activeOpacity={.8} onPress={() => Alert.alert('Pesan Sistem', 'fitur setting belum tersedia')} style={{ paddingHorizontal: 5 }}>
                                        <Icon name="settings-outline" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingHorizontal: 5 }} activeOpacity={.7} onPress={() => logoutHandler()}>
                                        <Icon name="exit-outline" size={20} color='white' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{ fontSize: 30, fontWeight: '600', letterSpacing: 0.5, color: 'white' }}>My Account</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ backgroundColor: '#1F4788', height: 70, width: 70, position: 'absolute', zIndex: -10, borderBottomRightRadius: 200 }} />
                            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 70, flex: 1, zIndex: 10 }}>
                                <View style={{ paddingTop: 20, paddingHorizontal: 32 }}>
                                    <View style={{ padding: 16 }}>
                                        <View style={{ paddingTop: 16 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Menu</Text>
                                            {/* <View style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon name='basket-outline' color='blue' size={25} />
                                                <Text style={{ marginLeft: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{userData.count}</Text>
                                            </View> */}
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('user_order_history')} style={{ padding: 8, borderWidth: 1, borderRadius: 8, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', width: (width - 8 - 16 - 32) / 2 - 12 }}>
                                            <Text style={{ fontSize: 18, textAlign: 'center' }}>Cek Riwayat Order</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ padding: 16, marginTop: 10 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Notes : </Text>
                                        <View style={{ padding: 6 }}>
                                            <Text>N/B</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Swiper>
            </View>
        )
}

export default Home
