import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ActivityIndicator, StatusBar, Image, ScrollView, RefreshControl, Alert, TextInput, ToastAndroid, TouchableOpacity, Platform, Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatRupiah } from '../../utils/functionality';

import RBSheet from "react-native-raw-bottom-sheet";


const FindCourer = ({ navigation, route }) => {


    let [initText, setInitText] = useState('Searching for nearest Courier...')
    let [isLoading, setIsLoading] = useState(false);

    let userReducer = useSelector(state => state.orders);
    let dispatch = useDispatch();

    let [courierData, setCourierData] = useState({});
    let [userData, setUserData] = useState({});
    let [orderItems, setOrderItems] = useState([]);
    let [notFound, setDataNotFound] = useState(false);
    let [type, setType] = useState('antar');
    let [pickup, setPickup] = useState({});
    let [deliveryStatus, setDeliveryStatus] = useState("belum di ambil");
    let [ambilStatus, setAmbilStatus] = useState(false);
    let [penerima, setPenerima] = useState({});
    let [alasan, setAlasan] = useState("");
    let [orderId, setOrderId] = useState("");
    let [cancelable, setCancelAble] = useState(true);

    useEffect(() => {
        console.log('mounted, find courier');
        // let intervalOrder = setInterval(() => {
        //     console.log('this is running every 10 s');
        //     getUserOrder();
        // }, 1000 * 10) // 10 seconds

        // return () => {
        //     console.log('un mounted find order');
        //     clearInterval(intervalOrder);
        // };

    }, []);

    useEffect(() => {
        // getUserOrder();
        // dispatch({ type: 'reset' });
    }, [])


    const getUserOrder = () => {
        AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then((res) => {
                console.log('USER TOKEN :::: ', res);
                let body = {
                    token: res
                }
                fetch('http://192.168.43.178:8000/user/order/get', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                    .then(result => {
                        return result.json();
                    })
                    .then((result) => {

                        if (result.msg === 'not found') {
                            setDataNotFound(true);
                        } else {
                            setDataNotFound(false);
                            setCourierData(result.courier);
                            setUserData(result.user);
                            setOrderItems(result.items);
                            setPickup(result.pickup);
                            setType(result.type);
                            setDeliveryStatus(result.delivery_status);
                            setAmbilStatus(result.status);
                            setPenerima(result.penerima);
                            setOrderId(result.id);
                            setCancelAble(result.cancelable);
                            console.log('cancelable ?? ', result.cancelable);
                            setTimeout(() => {
                                setIsLoading(false);
                            }, 2000)
                        }
                    })
                    .catch(error => {
                        throw new Error(error);
                    })
            })
            .catch(err => {
                throw new Error(err);
            })
    }
    let [refresh, setRefresh] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefresh(true);
        getUserOrder();
        wait(2000).then(() => setRefresh(false))
    }, [refresh])

    const wait = (timeout) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timeout);
        })
    };

    let [alasan1, setAlasan1] = useState(true);
    let [alasan2, setAlasan2] = useState(false);
    let [alasan3, setAlasan3] = useState(false);
    let [alasan4, setAlasan4] = useState(false);
    let [selectedAlasan, setSelectedAlasan] = useState("");



    const alasanOneHandler = () => {
        setAlasan1(true);
        setAlasan2(false);
        setAlasan3(false);
        setAlasan4(false);

        setSelectedAlasan("Driver terlalu lama");
    }

    const alasanTwoHandler = () => {
        setAlasan1(false);
        setAlasan2(true);
        setAlasan3(false);
        setAlasan4(false);

        setSelectedAlasan("Driver minta di batalkan");
    }
    const alasanThreeHandler = () => {
        setAlasan1(false);
        setAlasan2(false);
        setAlasan3(true);
        setAlasan4(false);

        setSelectedAlasan("Ingin merubah alamat pengiriman");
    }
    const alasanFourHandler = () => {
        setAlasan1(false);
        setAlasan2(false);
        setAlasan3(false);
        setAlasan4(true);

        setSelectedAlasan("Lain lain");
    }


    const sendAlasan = async () => {

        let body = {
            id: orderId,
            alasan: alasan
        }
        await fetch('http://192.168.43.178:8000/order/set/alasan_user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                //
            })
            .catch(err => {
                throw new Error(err);
            })
    };


    const callNumber = (phone) => {
        console.log('callNumber ----> ', phone);
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        }
        else {
            phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    };


    const actionSheetRef = useRef();

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" />
            <View style={{ padding: 16, flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ height: 80, width: 120, borderRadius: 10 }}>
                        <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10 }} source={require('../../assets/banner/q3.png')} />
                    </View>
                    <View style={{ paddingHorizontal: 40, flex: 1 }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', letterSpacing: .5, textAlign: 'justify' }}>Data orderan belum bisa di ambil dari server.</Text>
                    </View>
                </View>

                <View style={{
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'black'
                }} />

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ height: 140, width: 140, borderRadius: 10 }}>
                        <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10 }} source={require('../../assets/banner/warlock.jpg')} />
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 20, letterSpacing: .6 }}>KT 1717 NA</Text>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: .5 }}>Testing</Text>
                        <View style={{ padding: 16, flexDirection: 'row' }}>
                            <TouchableOpacity activeOpacity={.8} onPress={() => callNumber("081253077489")} style={{ padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', width: 80 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Call</Text>
                            </TouchableOpacity>
                            <View style={{ padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green', width: 80, marginLeft: 10 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Chat</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: 'black'
                }} />

                <View style={{ marginTop: 40 }}>
                    <View>
                        <Text style={{ fontSize: 20, letterSpacing: .4 }}>Pengirim</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>John</Text>
                        <Text style={{ fontSize: 14.4, letterSpacing: .5 }}>Jalan testing kaarena blum ada kartu kredit buat google map</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 20, letterSpacing: .4 }}>Penerima</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Doe</Text>
                        <Text style={{ fontSize: 14.4, letterSpacing: .5 }}>Jalan testing kaarena blum ada kartu kredit buat google map</Text>
                    </View>

                    <View style={{ marginTop: 40 }}>
                        <Text
                            style={{
                                padding: 10,
                                borderRadius: 7,
                                borderWidth: 1,
                                textAlign: 'center',
                                fontSize: 20
                            }}>
                            Baju
                            </Text>
                    </View>

                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Biaya Ongkir</Text>
                        <View>
                            <View style={{ padding: 20 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: .5 }}>{formatRupiah(String(12000), "Rp. ")}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => actionSheetRef.current.open()} activeOpacity={.8} style={{ marginTop: 30, padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>Batalkan</Text>
                    </TouchableOpacity>

                    <RBSheet
                        ref={actionSheetRef}
                        height={350}
                        openDuration={250}
                        animationType="fade"
                        customStyles={{
                            container: {
                                padding: 16,
                                flex: 1
                            }
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 26, letterSpacing: .5 }}>Alasan : </Text>
                        <View style={{ padding: 10, marginTop: 10 }}>
                            <TouchableOpacity onPress={() => alasanOneHandler()} activeOpacity={.8} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 22, fontWeight: '400' }}>Driver terlalu lama</Text>
                                <Icon size={22} style={{ marginLeft: 10 }} name={alasan1 ? "checkmark-circle-outline" : "ellipse-outline"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => alasanTwoHandler()} activeOpacity={.8} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 22, fontWeight: '400' }}>Driver minta di batalkan</Text>
                                <Icon size={22} style={{ marginLeft: 10 }} name={alasan2 ? "checkmark-circle-outline" : "ellipse-outline"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => alasanThreeHandler()} activeOpacity={.8} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 22, fontWeight: '400' }}>Ingin merubah alamat Pengiriman</Text>
                                <Icon size={22} style={{ marginLeft: 10 }} name={alasan3 ? "checkmark-circle-outline" : "ellipse-outline"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => alasanFourHandler()} activeOpacity={.8} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 22, fontWeight: '400' }}>Lain lain</Text>
                                <Icon size={22} style={{ marginLeft: 10 }} name={alasan4 ? "checkmark-circle-outline" : "ellipse-outline"} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => actionSheetRef.current.open()} activeOpacity={.8} style={{ marginTop: 30, padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>Batalkan</Text>
                        </TouchableOpacity>
                    </RBSheet>
                </View>

            </View>
        </View>
    )
}

export default FindCourer
