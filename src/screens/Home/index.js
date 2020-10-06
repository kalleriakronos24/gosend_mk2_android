import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, ScrollView, ActivityIndicator, Touchable, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native'
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import SplashScreen from '../Splash/index';
import { useIsFocused } from '@react-navigation/native'
const Home = ({ navigation }) => {

    // vars and invoked function
    const dispatch = useDispatch();
    const barHeight = StatusBar.currentHeight;

    // state
    let [index, setIndex] = useState(0);
    let [isLoading, setIsLoading] = useState(true);
    let [userData, setUserData] = useState({});

    const logoutHandler = async () => {
        console.log('logged out');

        return await AsyncStorage.removeItem('LOGIN_TOKEN', (err) => {
            dispatch({ type: 'LOGOUT' })
        });
    };

    const isFocused = useIsFocused();

    // lifecycle method;

    useEffect(() => {

        AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => {
            console.log('does this fuckin working ', r)
            if (r)
                return fetchUserByToken(r)
            return new Error(e);
        })


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
    }, [isFocused])

    const fetchUserByToken = async (token) => {
        console.log('this running ?');
        await fetch('http://192.168.43.178:8000/user/single/' + token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log('this too as well ?');
                return res.json();
            })
            .then(res => {
                console.log('this too ?');
                if (res)
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 2000)
                console.log('user data fetched successfully', '\n');
                console.log('User Data :: ', res);
                setUserData(res.data);
            })
            .catch(err => {
                throw new Error(err);
            })
    }
    const { type, fullname } = userData;
    const { width, height } = Dimensions.get('window');

    const switchScreenHandler = () => {
        if (userData.user_order === "" || userData.user_order === null) {
            navigation.push('send', { data: { name: userData.fullname, no_hp: userData.no_hp } });
        } else {
            ToastAndroid.showWithGravity('Tidak dapat membuat order, kamu masih punya order aktif', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            return;
        }
    }

    return isLoading ?
        (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator color='blue' size='large' />
            </View>
        ) : type === 'courier' ? (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar animated translucent={true} barStyle='default' backgroundColor='transparent' />
                <Swiper bounces={true} loadMinimalLoader={<ActivityIndicator />} showsPagination={false} loop={false} index={1}>
                    {/* Main Feature */}
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 300, backgroundColor: '#1F4788', borderBottomRightRadius: 70, paddingTop: barHeight }}>

                            <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="location-outline" size={20} color='white' />
                                    <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing: 0.7, color: 'white' }}>(Nama Lokasi Sekarang)</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ marginHorizontal: 10 }}>
                                        <Icon name="search-outline" size={20} color="white" />
                                    </View>
                                    <Icon name="basket-outline" size={20} color='white' />
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
                                        <Text style={{ fontSize: 23, fontWeight: '300' }}>Welcome, {fullname.split(' ')[fullname.split(' ').length - 1]}, have a nice day!</Text>
                                        <View style={{ paddingTop: 16 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>My Wallet</Text>
                                            <View style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon name='wallet-outline' color='blue' size={25} />
                                                <Text style={{ marginLeft: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Rp.{userData.courier_info.balance},-</Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingTop: 16 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Item Dikirim Hari ini</Text>
                                            <View style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon name='bicycle-outline' color='blue' size={25} />
                                                <Text style={{ marginLeft: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>0</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('courier_balance')} style={{ padding: 8, borderWidth: 1, borderRadius: 8, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', width: (width - 8 - 16 - 32) / 2 - 12 }}>
                                            <Text style={{ fontSize: 18 }}>Isi Wallet</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('find_order')} style={{ padding: 8, borderWidth: 1, borderRadius: 8, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', width: (width - 8 - 16 - 32) / 2 - 12 }}>
                                            <Text style={{ fontSize: 18 }}>Cari Orderan {userData.active_order ? `( 1 )` : null}</Text>
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
                    </View>
                    {/* Account Page including check order */}
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 300, backgroundColor: '#1F4788', borderBottomRightRadius: 70, paddingTop: barHeight }}>

                            <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="person-outline" size={20} color='white' />
                                    <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing: 0.7, color: 'white' }}>Account Type : {userData.type === 'user' ? 'User' : 'Courier'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ paddingHorizontal: 5 }}>
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
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total Order Berhasil</Text>
                                            <View style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon name='bicycle-outline' color='blue' size={25} />
                                                <Text style={{ marginLeft: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>0</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('courier_balance')} style={{ padding: 8, borderWidth: 1, borderRadius: 8, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', width: (width - 8 - 16 - 32) / 2 - 12 }}>
                                            <Text style={{ fontSize: 18, textAlign: 'center' }}>Cek Riwayat Penggunaan Wallet</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('find_order')} style={{ padding: 8, borderWidth: 1, borderRadius: 8, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', width: (width - 8 - 16 - 32) / 2 - 12 }}>
                                            <Text style={{ fontSize: 18 }}>Cek Riwayat Order</Text>
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
                    </View>
                </Swiper>
            </View>
        ) : (
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                    <StatusBar animated translucent={true} barStyle='default' backgroundColor='transparent' />
                    <Swiper bounces={true} loadMinimalLoader={<ActivityIndicator />} showsPagination={false} loop={false} index={1}>
                        {/* Main Feature */}
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 300, backgroundColor: '#1F4788', borderBottomRightRadius: 70, paddingTop: barHeight }}>

                                <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="location-outline" size={20} color='white' />
                                        <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing: 0.7, color: 'white' }}>(Nama Lokasi Sekarang)</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ marginHorizontal: 10 }}>
                                            <Icon name="search-outline" size={20} color="white" />
                                        </View>
                                        <TouchableOpacity onPress={() => navigation.push('find_courier')} activeOpacity={.7}>
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
                                            <Text style={{ fontSize: 23, letterSpacing: 0.5, fontWeight: '600' }}>Our Service</Text>

                                            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity activeOpacity={0.7} onPress={() => switchScreenHandler()} style={{ backgroundColor: '#1F4788', padding: 6, height: 150, width: 150, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 20, borderTopRightRadius: 20 }}>
                                                    <View style={{ padding: 6, height: 55, width: 55, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: 'white' }}>
                                                        <Icon name="bicycle-outline" size={35} color='white' />
                                                    </View>
                                                    <View style={{ paddingTop: 20 }}>
                                                        <Text style={{ fontSize: 17, letterSpacing: .5, fontWeight: '500', color: 'white' }}>TEST SEND</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={0.4} onPress={() => switchScreenHandler()} style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Icon size={40} name="arrow-forward-circle-outline" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ padding: 16 }}>
                                            <Text style={{ fontSize: 23, letterSpacing: 0.5, fontWeight: '600' }}>About Our Service</Text>
                                            <View style={{ padding: 6 }}>
                                                <Text style={{ letterSpacing: 0.4, fontSize: 16 }}>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* Account Page including check order */}
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 300, backgroundColor: '#1F4788', borderBottomRightRadius: 70, paddingTop: barHeight }}>

                                <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="person-outline" size={20} color='white' />
                                        <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing: 0.7, color: 'white' }}>Account Type : {userData.type === 'user' ? 'User' : 'Courier'}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={{ paddingHorizontal: 5 }}>
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
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total Barang yg di kirim / ambil</Text>
                                                <View style={{ paddingTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                                    <Icon name='basket-outline' color='blue' size={25} />
                                                    <Text style={{ marginLeft: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>0</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('courier_balance')} style={{ padding: 8, borderWidth: 1, borderRadius: 8, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', width: (width - 8 - 16 - 32) / 2 - 12 }}>
                                                <Text style={{ fontSize: 18, textAlign: 'center' }}>Cek Riwayat Penggunaan Wallet</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('find_order')} style={{ padding: 8, borderWidth: 1, borderRadius: 8, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', width: (width - 8 - 16 - 32) / 2 - 12 }}>
                                                <Text style={{ fontSize: 18 }}>Cek Riwayat Order</Text>
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
                        </View>
                    </Swiper>
                </View>
            )
}

export default Home
