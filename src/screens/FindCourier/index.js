import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ActivityIndicator, StatusBar, Image, ScrollView, RefreshControl, Alert, TextInput, ToastAndroid, TouchableOpacity, Platform, Linking, PermissionsAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatRupiah } from '../../utils/functionality';

import RBSheet from "react-native-raw-bottom-sheet";
import { SERVER_URL } from '../../utils/constants';
import NetworkIndicator from '../../components/NetworkIndicator';
import SupportSection from '../../components/Support';


const FindCourer = ({ navigation, route }) => {


    let [initText, setInitText] = useState('Searching for nearest Courier...')
    let [isLoading, setIsLoading] = useState(false);

    let userReducer = useSelector(state => state.orders);
    let dispatch = useDispatch();

    let [courierData, setCourierData] = useState({});
    let [userData, setUserData] = useState({});
    let [orderItems, setOrderItems] = useState([]);
    let [notFound, setDataNotFound] = useState(true);
    let [type, setType] = useState('antar');
    let [pickup, setPickup] = useState({});
    let [deliveryStatus, setDeliveryStatus] = useState("belum di ambil");
    let [ambilStatus, setAmbilStatus] = useState(false);
    let [penerima, setPenerima] = useState({});
    let [pengirim, setPengirim] = useState({});

    let [ongkir, setOngkir] = useState(0);
    let [barang, setBarang] = useState("");

    let [alasan, setAlasan] = useState("");
    let [orderId, setOrderId] = useState("");
    let [cancelable, setCancelAble] = useState(true);
    let [kurirAccept, setKurirAccept] = useState(false);
    let [isCourierCancel, setIsCourierCancel] = useState(false);


    useEffect(() => {
        console.log('mounted, find courier');
        let intervalOrder = setInterval(() => {
            getUserOrder();
        }, 1000 * 10) // 10 seconds

        return () => {
            console.log('un mounted find order');
            clearInterval(intervalOrder);
        };

    }, []);

    useEffect(() => {
        getUserOrder();
        // dispatch({ type: 'reset' });
    }, [])



    // const requestLocationPermission = () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //             {
    //                 'title': 'Example App',
    //                 'message': 'Example App access to your location '
    //             }
    //         )
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log("You can use the location")
    //             alert("You can use the location");
    //         } else {
    //             console.log("location permission denied")
    //             alert("Location permission denied");
    //         }
    //     } catch (err) {
    //         console.warn(err)
    //     }
    // }


    const getUserOrder = () => {
        AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then((res) => {
                console.log('USER TOKEN :::: ', res);
                let body = {
                    token: res
                }
                fetch(`${SERVER_URL}/user/order/get`, {
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
                            setUserData(result.user);
                        } else {
                            /**
                             * penerima: resu.penerima,
                                    courier: r2,
                                    pengirim: resu.pengirim,
                                    delivery_status: resu.delivery_status,
                                    id: resu._id,
                                    cancelable: resu.cancelable,
                                    ongkir: resu.ongkir,
                                    barang: resu.barang_yg_dikirim,
                             */
                            setDataNotFound(false);
                            setCourierData(result.courier);
                            setUserData(result.user);
                            setPengirim(result.pengirim);
                            setOngkir(result.ongkir);
                            setBarang(result.barang);
                            setDeliveryStatus(result.delivery_status);
                            setAmbilStatus(result.status);
                            setPenerima(result.penerima);
                            setOrderId(result.id);
                            setCancelAble(result.cancelable);
                            setKurirAccept(result.kurir_accept);
                            setIsCourierCancel(result.is_kurir_cancel);

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
            alasan: selectedAlasan,
            user_id: userData._id,
            courier_id: courierData._id
        };

        console.log('isi submit alasan :: ', body);

        await fetch(`${SERVER_URL}/order/set/alasan_user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => {
                //
                console.log('cancel ? : ', res)
                if (res.msg === "success canceled") {
                    actionSheetRef.current.close()
                    return navigation.navigate('pilih_lewat_map', { data: { name: userData.fullname, no_hp: userData.no_hp, fotoDiri: userData.foto_diri } });
                }

                // do nothing here;
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


    const finishOrderan = async () => {

        let body = {
            id: orderId,
            alasan: "orderan di tolak sama si kurir",
            user_id: userData._id,
            courier_id: courierData._id
        };

        await fetch(`${SERVER_URL}/order/set/alasan_user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => {
                //
                if (res.msg === "success canceled") {
                    actionSheetRef.current.close()
                    return navigation.navigate('pilih_lewat_map', { data: { name: userData.fullname, no_hp: userData.no_hp, fotoDiri: userData.foto_diri } });
                }

                // do nothing here;
            })
            .catch(err => {
                throw new Error(err);
            })
    };

    const verifCheck = () => {
        if(!userData.verified) { 
            ToastAndroid.showWithGravity('Email mu belum di verifikasi, silahkan verifikasi terlebih dahulu', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            return;
        } else {
            navigation.navigate('pilih_lewat_map', { data: { name: userData.fullname, no_hp: userData.no_hp, fotoDiri: userData.foto_diri } })
        }
    }

    const actionSheetRef = useRef();

    return notFound ? (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" />
            <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ fontWeight: 'bold', letterSpacing: .5, fontSize: 22, textAlign: 'center' }}>Kamu tidak punya Orderan Aktif untuk saat ini :(</Text>
                <TouchableOpacity activeOpacity={.8} onPress={() => verifCheck()} style={{ padding: 12, borderRadius: 6, marginTop: 10, backgroundColor: 'blue' }}>
                    <Text style={{ color: 'white', fontSize: 19 }}>Order Sekarang</Text>
                </TouchableOpacity>
            </View>
        </View>
    ) : (
            <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight, paddingBottom: 50 }}>
                <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" />
                <NetworkIndicator/>
                <View style={{ padding: 16, flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ height: 80, width: 120, borderRadius: 10 }}>
                            <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10 }} source={require('../../assets/logos/1.png')} />
                        </View>
                        {
                            kurirAccept ? (
                                <View style={{ paddingHorizontal: 40, flex: 1 }}>
                                    <Text style={{ fontSize: 17, fontWeight: '700', letterSpacing: .5, textAlign: 'justify' }}>{deliveryStatus === "belum di ambil" ? "Orderan belum di Ambil" : deliveryStatus === "otw" ? "Kurir sedang menuju ke lokasi pengambilan Barang" : deliveryStatus === "sudah di ambil" ? "Orderan sudah di Ambil, menunggu kurir mengantar barangmu.." : deliveryStatus === "sedang di antar" ? "Orderan sedang di Antar" : null}</Text>
                                </View>
                            ) : (
                                    <View style={{ paddingHorizontal: 40, flex: 1 }}>
                                        <Text style={{ fontSize: 17, fontWeight: '700', letterSpacing: .5, textAlign: 'justify' }}>{isCourierCancel ? 'Kurir Mengcancel orderan mu, klik Batalkan untuk mengakhiri' : 'Menunggu Kurir Menerima Orderan mu'}</Text>
                                    </View>
                                )
                        }
                    </View>

                    <View style={{
                        marginTop: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: 'black'
                    }} />

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View style={{ height: 140, width: 140, borderRadius: 10 }}>
                            <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10 }} source={{ uri: courierData.foto_diri }} />
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 20, letterSpacing: .6 }}>{courierData.no_hp}</Text>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: .5, textTransform:'capitalize' }}>{courierData.fullname}</Text>
                            <Text style={{ fontSize: 20, letterSpacing: .6 }}>Driver / Kurir</Text>
                            <View style={{ padding: 16, flexDirection: 'row', flex: 1, justifyContent:'center', alignItems:'center' }}>
                                {
                                    kurirAccept ? (
                                        <>
                                            <TouchableOpacity activeOpacity={.8} onPress={() => callNumber("081253077489")} style={{ padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', width: 80 }}>
                                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Call</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => Alert.alert('Pesan Sistem', 'Fitur Chat Belum Tersedia')} style={{ padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green', width: 80, marginLeft: 10 }}>
                                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Chat</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : null
                                }

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
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pengirim.name}</Text>
                            <Text style={{ fontSize: 14.4, letterSpacing: .5 }}>{pengirim.address}</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 20, letterSpacing: .4 }}>Penerima</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{penerima.name}</Text>
                            <Text style={{ fontSize: 14.4, letterSpacing: .5 }}>{penerima.address}</Text>
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
                                {barang}
                            </Text>
                        </View>

                        <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Biaya Ongkir</Text>
                            <View>
                                <View style={{ padding: 20 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: .5 }}>{formatRupiah(String(ongkir), "Rp. ")}</Text>
                                </View>
                            </View>
                        </View>

                        {
                            cancelable ? (

                                isCourierCancel ? (
                                    <TouchableOpacity onPress={() => finishOrderan()} activeOpacity={.8} style={{ marginTop: 30, padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>Selesai</Text>
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity onPress={() => actionSheetRef.current.open()} activeOpacity={.8} style={{ marginTop: 30, padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>Batalkan</Text>
                                        </TouchableOpacity>
                                    )
                            ) : (
                                    <View style={{ flex: 1, marginBottom: 50 }}>
                                        <Text style={{ textAlign: 'center', fontSize: 19 }}>- Kamu tidak dapat mengcancel orderan jika barang telah di ambil atau sedang dalam pengantaran -</Text>
                                    </View>
                                )
                        }

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

                            <TouchableOpacity onPress={() => sendAlasan()} activeOpacity={.8} style={{ marginTop: 30, padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', marginBottom: 40 }}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>Batalkan</Text>
                            </TouchableOpacity>

                        </RBSheet>
                    </View>

                    <SupportSection/>
                </View>
            </ScrollView>
        )
}

export default FindCourer
