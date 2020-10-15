import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, StatusBar, Image, ScrollView, RefreshControl, Alert, TextInput, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        let intervalOrder = setInterval(() => {
            console.log('this is running every 10 s');
            getUserOrder();
        }, 1000 * 10) // 10 seconds


        if (orderItems.length > 0) {
            console.log('this working ?');
            clearInterval(intervalOrder);
        };

        return () => {
            console.log('un mounted find order');
            clearInterval(intervalOrder);
        };

    }, []);

    useEffect(() => {
        getUserOrder();
        dispatch({ type: 'reset' });
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


    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <StatusBar barStyle='dark-content' translucent backgroundColor='rgba(0,0,0,0.251)' animated />
            {
                isLoading ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: 0.5 }}>Loading...</Text>
                        <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color='blue' />
                        </View>
                    </View>
                ) : (
                        <>
                            <ScrollView style={{ flex: 1 }} scrollEventThrottle={16} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>

                                <View style={{ padding: 10 }}>
                                    <View style={{ padding: 6, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('home')} style={{ padding: 6 }}>
                                            <Icon name='home-outline' size={25} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 17, letterSpacing: .5, fontWeight: 'bold' }}> Your Orders </Text>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => console.log('no effect')} style={{ padding: 6 }}>
                                            <Icon name='help-circle-outline' size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    notFound ? (
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 80, padding: 16 }}>
                                            <Text style={{ fontSize: 17, fontWeight: 'bold', letterSpacing: .6, textAlign: 'center' }}>Kamu tidak punya order aktif untuk sekarang ini.</Text>
                                        </View>
                                    ) : (
                                            <View style={{ padding: 16, marginTop: 10, flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Menunggu Kurir sampai di Tempat Pengambilan</Text>
                                                    <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <View>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{courierData.fullname}</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 10 }}>Sebagai {courierData.type}</Text>
                                                        </View>
                                                        <View style={{ height: 100, width: 100, borderWidth: 1, borderRadius: 10 }}>
                                                            <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10, flex: 1 }} source={{ uri: courierData.foto_diri }} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 15 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Detail Kurir</Text>
                                                    <View style={{ padding: 6 }}>
                                                        {/* <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, textDecorationLine: 'line-through' }}> Estimate time to arrive : 0 ~ 4 mins at 40km/h</Text> */}
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 10, textDecorationLine: 'line-through' }}>Lacak Lokasi Kurir di Google Maps </Text>
                                                            <Text style={{ marginLeft: 5, color: 'red', fontSize: 15, fontWeight: 'bold', letterSpacing: .4, textAlign: 'center' }}>Belum Tersedia</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{ margin: 6, fontWeight: 'bold' }}>Orderan mu akan otomatis terupdate setiap 10 Detik !</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                                    <Text style={{ fontWeight: 'bold', letterSpacing: .5, fontSize: 18 }}>Status : </Text>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', textDecorationLine: 'underline' }}>{deliveryStatus === "belum di ambil" ? "Orderan belum di Ambil" : deliveryStatus === "sudah sampai" ? "Kurir sudah sampai di lokasi pengambilan Barang" : deliveryStatus === "sudah di ambil" ? "Orderan sudah di Ambil" : deliveryStatus === "sedang di antar" ? "Orderan sedang di Antar" : null}</Text>
                                                </View>
                                                <View style={{ marginTop: 15, flex: 1 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{type === 'antar' ? 'Detail Pengambilan Barang' : 'Detail Penerima Barang'} </Text>
                                                    <View key={10} style={{ padding: 6, borderWidth: 1, borderRadius: 10, borderColor: 'blue', marginBottom: 20 }}>
                                                        <View style={{ padding: 4 }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                                                <Text>-</Text>
                                                                <Text>-----</Text>
                                                            </View>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>{userData.fullname}</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>No.HP : {userData.no_hp}</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Detail Alamat : {pickup.detailAlamat}</Text>

                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Order Tipe : {type === 'antar' ? 'Antar Barang' : 'Ambil Barang'}</Text>
                                                            {
                                                                type === "ambil" ? (
                                                                    <>
                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Ongkir : Rp.{penerima.ongkir},-</Text>
                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Jarak : {penerima.distance} km</Text>
                                                                        <TouchableOpacity onPress={() => Alert.alert('Detail Jarak', `Jarak antara Pengirim ke Penerima adalah ${penerima.distance} kilometer`)} activeOpacity={.7} style={{ padding: 6, marginLeft: 15, borderColor: 'blue', borderRadius: 6, borderWidth: 1 }}>
                                                                            <Text style={{ letterSpacing: .5, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Cek</Text>
                                                                        </TouchableOpacity>
                                                                    </>
                                                                ) : null
                                                            }
                                                            {
                                                                type === "ambil" ? (
                                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Status : {ambilStatus ? "barang sudah diterima" : "barang belum diterima"}</Text>
                                                                ) : (
                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Status : {deliveryStatus === "belum di ambil" ? "Orderan belum di Ambil" : deliveryStatus === "sudah sampai" ? "Kurir sudah sampai di lokasi pengambilan Barang" : deliveryStatus === "sudah di ambil" ? "Orderan sudah di Ambil" : deliveryStatus === "sedang di antar" ? "Orderan sedang di Antar" : null}</Text>
                                                                    )
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 15, flex: 1 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{type === "antar" ? "Target Alamat / Penerima" : "Detail Pengambilan Barang"} </Text>
                                                    {
                                                        orderItems.map((v, i) => {
                                                            return (
                                                                <View key={i} style={{ padding: 6, borderWidth: 1, borderRadius: 10, borderColor: 'blue', marginBottom: 20 }}>
                                                                    <View style={{ padding: 4 }}>
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                                                            <Text>{v.order_id}</Text>
                                                                            <Text>{v.date}</Text>
                                                                        </View>
                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Barang yang di {type === "antar" ? "Antar" : "Ambil"} : {v.send_item}</Text>
                                                                        {
                                                                            type === "antar" ? (
                                                                                <>
                                                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Ongkir : Rp.{v.ongkir},-</Text>

                                                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Jarak : {v.distance} km</Text>
                                                                                </>
                                                                            ) : null
                                                                        }

                                                                        <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{type === 'antar' ? 'Kirim Paket ke' : 'Ambil Paket dari '}(Alamat) : </Text>
                                                                            <View style={{ padding: 2 }}>
                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.address_detail}</Text>
                                                                            </View>
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{type === 'antar' ? 'Kirim Paket ke' : 'Ambil Paket dari '} (Orang) : </Text>
                                                                            <View style={{ padding: 2, flexDirection: 'column' }}>
                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.to.contact_name}</Text>

                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.to.phone}</Text>
                                                                            </View>
                                                                        </View>
                                                                        {
                                                                            type === "antar" ? (
                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Status : {v.status ? "sudah dikirim" : "belum dikirim"}</Text>
                                                                            ) : (
                                                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Status : {deliveryStatus === "belum di ambil" ? "Orderan belum di Ambil" : deliveryStatus === "sudah sampai" ? "Kurir sudah sampai di lokasi pengambilan Barang" : deliveryStatus === "sudah di ambil" ? "Orderan sudah di Ambil" : deliveryStatus === "sedang di antar" ? "Orderan sedang di Antar" : null}</Text>
                                                                                )
                                                                        }

                                                                    </View>
                                                                </View>
                                                            )
                                                        })
                                                    }

                                                </View>
                                                {
                                                    cancelable ? (
                                                        <>
                                                            <Text>*Isi Input isi dengan Alasan yang tepat dan masuk akal jika anda ingin membatalkan orderan ini.</Text>
                                                            <Text>*Tombol Batalkan Orderan akan hilang setelah si Kurir sampai di lokasi pengambilan Barang.</Text>
                                                            <View style={{ flex: 1, borderRadius: 10, borderWidth: 1 }}>
                                                                <TextInput style={{
                                                                    flex: 1,
                                                                    borderRadius: 10,
                                                                    padding: 8
                                                                }}
                                                                    value={alasan}
                                                                    onChangeText={(v) => setAlasan(v)} multiline={true} />
                                                            </View>
                                                            <TouchableOpacity onPress={() => alasan.length < 16 || alasan === "" ? ToastAndroid.showWithGravity("Alasan harus setidaknya 15 huruf atau lebih, dan tidak boleh kosong sama sekali", ToastAndroid.LONG, ToastAndroid.BOTTOM) : sendAlasan()} activeOpacity={.7} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', height: 45, borderRadius: 10, marginBottom: 10, marginTop: 10 }}>
                                                                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16, letterSpacing: .5 }}>Batalkan Orderan</Text>
                                                            </TouchableOpacity>
                                                        </>
                                                    ) : null
                                                }
                                            </View>
                                        )
                                }
                                <View style={{ marginHorizontal: 15, marginBottom: 5 }}>
                                    <TouchableOpacity onPress={() => navigation.push('user_order_history')} activeOpacity={.7} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue', height: 45, borderRadius: 10 }}>
                                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16, letterSpacing: .5 }}>Lihat History</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </>
                    )
            }
        </View>
    )
}

export default FindCourer
