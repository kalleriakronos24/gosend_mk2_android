import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, ToastAndroid, Alert } from 'react-native'
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { useIsFocused } from '@react-navigation/native';
import { requestLocationPermission } from '../../utils/functionality';
import Geolocation from '@react-native-community/geolocation';
import { SERVER_URL } from '../../utils/constants';
import NetworkIndicator from '../../components/NetworkIndicator';
import SupportSection from '../../components/Support';


const Home = ({ navigation }) => {

    // vars and invoked function
    const dispatch = useDispatch();
    const barHeight = StatusBar.currentHeight;

    let [GOOGLE_MAPS_APIKEY, setGmapKey] = useState(null);

    // state
    let [isLoading, setIsLoading] = useState(true);
    let [userData, setUserData] = useState({});
    let [errMsg, setErrMsg] = useState("");
    let [succMsg, setSuccMsg] = useState("");


    const logoutHandler = async () => {
        console.log('logged out');

        await AsyncStorage.removeItem('LOGIN_TOKEN')
        Alert.alert("Pesan Sistem | Log Out", "Jika tidak di alihkan, cukup tutup aplikasi ini dan coba lagi.");

        setTimeout(() => {
            dispatch({ type: 'LOGOUT' });
        }, 3000);


    };

    let [address, setAddress] = useState("");

    const isFocused = useIsFocused();

    // lifecycle method;

    useEffect(() => {

        AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => {
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

        fetch(`${SERVER_URL}/fetch-gmap-key`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                setGmapKey(res.key);
            })
            .catch(err => {
                throw new Error(err);
            })
        return () => {
            console.log('unmounted home');
        };

    }, [isFocused]);


    useEffect(() => {
        Geolocation.getCurrentPosition(
            async (position) => {
                await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + GOOGLE_MAPS_APIKEY)
                    .then((response) => response.json())
                    .then((res) => {
                        console.log('address component', res);
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

    const fetchUserByToken = async () => {

        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, token) => {



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
                    if (res.data.type === "courier") {
                        Alert.alert('Pesan Sistem', 'kurir tidak dapat mengakses aplikasi ini', [
                            {
                                text: "Keluar",
                                onPress: () => {
                                    logoutHandler();
                                }
                            }
                        ])
                    } else {
                        if (res)
                            setTimeout(() => {
                                setIsLoading(false);
                            }, 2000)
                        setUserData(res.data);
                    }
                })
                .catch(err => {
                    Alert.alert('Pesan Sistem', 'Koneksi tidak stabil, silahkan coba lagi', [
                        { text: "OK", onPress: () => fetchUserByToken() }
                    ])
                })

        });

    };


    const { type, fullname } = userData;
    const { width, height } = Dimensions.get('window');

    const switchScreenHandler = () => {

        if (!userData.verified) {
            ToastAndroid.showWithGravity('Email mu belum di verifikasi, silahkan verifikasi terlebih dahulu', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            return;
        }

        if (userData.user_order === "" || userData.user_order === null || userData.user_order === undefined || userData.verified) {
            navigation.navigate('pilih_lewat_map', { data: { name: userData.fullname, no_hp: userData.no_hp, fotoDiri: userData.fotoDiri } });
        } else {
            ToastAndroid.showWithGravity('Tidak dapat membuat order, kamu masih punya order aktif', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            return;
        }
    };

    const resendEmail = async () => {


        let body = {
            email: userData.email
        };

        await fetch(`${SERVER_URL}/user/resend-verification`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log('response resend email', res);
                if (res.code === 1) {
                    setErrMsg(res.msg);
                    return;
                }

                setSuccMsg(res.msg);
            })
            .catch(err => {
                console.log('err resend email ', err)

                setErrMsg("Ada masalah koneksi, silahkan coba lagi");
            })

    };

    return isLoading ?
        (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator color='blue' size='large' />
            </View>
        ) : (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <NetworkIndicator />
                <StatusBar animated translucent={true} barStyle='default' backgroundColor='transparent' />
                <Swiper bounces={true} loadMinimalLoader={<ActivityIndicator />} showsPagination={false} loop={false} index={0}>
                    {/* Main Feature */}
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ height: 300, backgroundColor: '#1F4788', borderBottomRightRadius: 70, paddingTop: barHeight }}>

                            <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="location-outline" size={20} color='white' />
                                    <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing: 0.7, color: 'white' }}>{address || "-"}</Text>
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
                                            <TouchableOpacity activeOpacity={0.4} onPress={() => switchScreenHandler()} style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon size={40} name="arrow-forward-circle-outline" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {
                                        !userData.verified ? (
                                            <>
                                                <Text style={{ marginHorizontal: 16, fontSize: 16 }}>*Klik untuk verifikasi email kamu</Text>
                                                <View style={{ padding: 6, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity onPress={() => resendEmail()} style={{ padding: 10, borderRadius: 6, backgroundColor: 'blue' }}>
                                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Verifikasi Email</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        ) : null
                                    }

                                    {
                                        errMsg ? (
                                            <Text style={{ fontSize: 20, color: 'red', fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>{errMsg}</Text>
                                        ) : null
                                    }

                                    {
                                        succMsg ? (
                                            <Text style={{ fontSize: 20, textAlign: 'center' }}>{succMsg}</Text>
                                        ) : null
                                    }

                                    <SupportSection />

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
                                <SupportSection />
                            </View>
                        </View>
                    </ScrollView>
                </Swiper>
            </View>
        )
}

export default Home
