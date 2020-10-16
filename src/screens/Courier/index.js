import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, TouchableOpacity, Dimensions, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import io from 'socket.io-client';
import Geolocation from 'react-native-geolocation-service';

const OrderFind = ({ navigation, route }) => {

    const { width, height } = Dimensions.get('window');
    const barHeight = StatusBar.currentHeight;
    const isPending = true;
    const { id } = route.params;
    let [courierData, setCourierData] = useState({});
    let [userData, setUserData] = useState({});
    let [orderItems, setOrderItems] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [orderID, setOrderID] = useState(0);
    let [orderDate, setOrderDate] = useState(0);
    let [order_id, setOrderId] = useState(0);
    let [notFound, setNotFound] = useState(true);
    let [tipe, setTipe] = useState('');
    let [pickup, setPickup] = useState({});
    let [loop, setLoop] = useState();
    let [online, setOnline] = useState(false);
    let [isUserCancel, setIsUserCancel] = useState(false);
    let [deliveryStatus, setDeliveryStatus] = useState("");
    let [pickedUp, setPickedUp] = useState(false);

    const isFocused = useIsFocused();



    useEffect(() => {

        let intervalOrder = setInterval(() => {
            console.log('this is running every 10 s');
            fetchOrder();
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
        fetchOrder();
    }, [isFocused]);



    const updateLocation = (token) => {
        Geolocation.getCurrentPosition(
            async (position) => {
                await fetch('http://192.168.43.178:8000/courier/update/location', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + Math.floor(Math.random() * 9999 + 1000)
                    },
                    body: JSON.stringify({
                        token,
                        coords: position.coords
                    })
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        console.log(res.msg);
                    })
                    .catch(err => {
                        throw new Errror(err);
                    })
            },
            (err) => {
                console.log('failed to retreive user location', err);
            },
            { enableHighAccuracy: true, distanceFilter: 100, timeout: 8000 }
        )
    };


    const fetchOrder = () => {

        return AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then(async (res) => {
                let body = {
                    token: res
                }
                console.log('test');
                // updateLocation(res);
                return fetch('http://192.168.43.178:8000/courier/order/get', {
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
                        if (result.msg) {
                            console.log('this one working ?? ', result.online);
                            setOnline(result.online);
                            setNotFound(true);
                        } else {
                            setCourierData(result.courier);
                            setUserData(result.user);
                            setOrderItems(result.items);
                            setOrderID(result._id);
                            setOrderId(result.id);
                            setOrderDate(result.date);
                            setTipe(result.tipe);
                            setPickup(result.pickup);
                            setNotFound(false);
                            setOnline(result.courier.online);
                            setDeliveryStatus(result.delivery_status);
                            setIsUserCancel(result.user_cancel);
                            setPickedUp(result.pickedup);

                            setTimeout(() => {
                                setIsLoading(false);
                            }, 2000)
                        }
                    })
                    .catch(error => {
                        console.log('ERROR :: ', error);
                    })
            })
            .catch(err => {
                throw new Error(err);
            })
    }

    let [refresh, setRefresh] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefresh(true);
        fetchOrder();

        wait(2000).then(() => setRefresh(false))
    }, [refresh])

    const wait = (timeout) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timeout);
        })
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingTop: barHeight }} scrollEventThrottle={16} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>
            <StatusBar barStyle='dark-content' />
            <View style={{ padding: 16 }}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()} style={{ padding: 6 }}>
                    <Icon name='arrow-back-outline' size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 80 }}>
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 20 }}>Cek Orderan masuk di bawah ini..</Text>
                </View>

                {
                    notFound ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17, letterSpacing: .5, fontWeight: 'bold' }}>Kamu belum dapat orderan.. harap menunggu</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', letterSpacing: .5 }}>Status : </Text>
                                <Text style={{ marginLeft: 5, letterSpacing: .5, fontSize: 16, fontWeight: 'bold', color: online ? 'green' : 'red' }}>{online ? 'Online' : 'Disconnected'}</Text>
                            </View>
                            <View style={{ padding: 16 }}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold', letterSpacing: .5 }}>Catatan* : </Text>

                                <Text>1. Lokasi-mu akan ter update otomatis setiap 10 detik jika kamu berdiam di halaman ini.</Text>
                                <Text>2. Orderan akan masuk otomatis ke halaman ini, pastikan bertetap di halaman ini jika mencari orderan</Text>

                                <Text>3. Orderan masuk berdasarkan status Online kamu, jika statusmu Disconnected maka kamu tidak akan bisa mendapatkan orderan</Text>
                                <Text>4. Orderan masuk juga berdasarkan jumlah Wallet Kamu, jika kamu merasa walletmu sedikit , semisal di bawah Rp. 10,000 maka segera isi walletmu, karena walletmu juga termasuk faktor terbesar dalam mendapatkan orderam</Text>

                                <Text>5. Cek status online kamu di atas Catatan</Text>
                            </View>
                        </View>
                    ) : (
                            <View style={{ padding: 20, borderRadius: 10, marginTop: 20, width: width - (20 * 2) }}>
                                <View style={{ padding: 6 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text>{order_id}</Text>
                                        <Text>{orderDate}</Text>
                                    </View>
                                    <View style={{ paddingTop: 10 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>Status : </Text>
                                            <Text style={{ borderBottomWidth: 1, borderColor: isPending ? 'red' : 'blue', color: isPending ? 'red' : 'blue', textTransform: 'capitalize' }}>{deliveryStatus === "belum di ambil" ? "Orderan belum di Ambil" : deliveryStatus === "sudah sampai" ? "Kurir sudah sampai di lokasi pengambilan Barang" : deliveryStatus === "sudah di ambil" ? "Orderan sudah di Ambil" : deliveryStatus === "sedang di antar" ? "Orderan sedang di Antar" : null}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 8, alignItems: 'center' }}>
                                            <Text>Dari : </Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16.5, letterSpacing: .5, textTransform: 'capitalize' }}>{userData.fullname}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', paddingTop: 8, alignItems: 'center' }}>
                                            <Text>Tipe Orderan : </Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16.5, letterSpacing: .5, textTransform: 'capitalize' }}>{tipe} Barang</Text>
                                        </View>

                                        <View style={{ paddingTop: 8 }}>
                                            <Text>{tipe === 'antar' ? 'Detail Pengambilan Barang' : 'Detail Penerima Barang'} : </Text>
                                            <View style={{ padding: 6 }}>
                                                <Text>Detail Alamat : {pickup.detailAlamat} </Text>
                                                <Text style={{ marginTop: 10 }}>Lokasi : </Text>
                                                <TouchableOpacity onPress={() => navigation.navigate('pickup_detail', { data: orderItems[0], tipe, order_id: orderID, orderID: order_id, date: orderDate, pickup: pickup, user_no_hp: userData.no_hp, user_name: userData.fullname, status: deliveryStatus, id: 0, pickedup: pickedUp })} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: 'blue', borderRadius: 5, marginTop: 5 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .5, color: 'white', marginRight: 10 }}>Lihat di Map</Text>
                                                    <Icon name="map-outline" size={20} color='white' />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                            <Text>Item : </Text>
                                        </View>

                                        <View style={{ padding: 8 }}>
                                            {
                                                orderItems.map((v, i) => (
                                                    <View key={i} style={{ padding: 4 }}>
                                                        <Text>{v.send_item}</Text>
                                                        <Text>{tipe === 'antar' ? "Antar Ke " : "Ambil Dari "} Alamat : {v.address_detail}</Text>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 5, borderColor: 'red', borderWidth: .5 }}>
                                                                <Text style={{ color: v.status ? 'black' : 'red', marginRight: 10 }}>status : {v.status ? `sudah ${tipe === 'antar' ? 'di antar' : 'di ambil'}` : `belum ${tipe === 'antar' ? 'di antar' : 'di ambil'}`}</Text>
                                                                <Icon name={`${v.status ? 'checkmark-circle' : 'alert-circle'}-outline`} size={17} color='black' />
                                                            </View>
                                                            <TouchableOpacity activeOpacity={.6} onPress={() => navigation.navigate('courier_order_detail', { data: v, from: userData.fullname, _id: orderID, id: v.id, tipe: tipe, order_id: v.order_id, date: v.date, status: deliveryStatus, pickedup: pickedUp })} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: 'blue', borderRadius: 5 }}>
                                                                <Text style={{ color: 'white', marginRight: 10 }}>Lihat detail</Text>
                                                                <Icon name='eye-outline' size={17} color='white' />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))
                                            }

                                        </View>
                                    </View>
                                </View>

                                <View>
                                    <Text>
                                        *Tekan Teruskan jika kamu punya kendala dalam orderan ini.
                                    </Text>
                                    <TouchableOpacity activeOpacity={.7} onPress={() => isUserCancel ? Alert.alert('Pesan', 'Kamu tidak dapat meneruskan orderan ini karena telah di cancel oleh si yg order.') : null} style={{ justifyContent: 'center', alignItems: 'center', padding: 7, borderWidth: 1, borderRadius: 5, borderColor: isUserCancel ? 'red' : 'blue', marginTop: 4 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', letterSpacing: .5, textTransform: 'uppercase' }}>Teruskan</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <Text>
                                        *Jika si yg order nge cancel orderannya, maka akan muncul di bawah sini, dan kamu memiliki satu pilihan
                                    </Text>
                                    <View style={{ padding: 20, borderWidth: 1, borderRadius: 5, borderColor: 'red', marginTop: 4 }}>
                                        {isUserCancel ? (
                                            <>
                                                <View>
                                                    <Text>Alasan : Lu Bau</Text>
                                                </View>
                                                <Text style={{ marginTop: 10 }}>*Klik OK untuk mengakhiri order ini.</Text>
                                                <View style={{ padding: 10, borderRadius: 6, borderColor: 'blue', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text>OK</Text>
                                                </View>
                                            </>
                                        ) : (<Text style={{ fontSize: 16, fontWeight: 'bold', letterSpacing: .5, textTransform: 'uppercase', textAlign: 'center' }}>- Tidak Ada -</Text>)}
                                    </View>
                                </View>

                                <View style={{ padding: 20 }}>
                                    <View style={{ borderBottomWidth: 2, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }} />
                                    <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>List orderan masuk.</Text>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', letterSpacing: .5 }}>Status : </Text>
                                    <Text style={{ marginLeft: 5, letterSpacing: .5, fontSize: 16, fontWeight: 'bold', color: online ? 'green' : 'red' }}>{online ? 'Online' : 'Disconnected'}</Text>
                                </View>
                                <View style={{ padding: 16 }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold', letterSpacing: .5 }}>Catatan* : </Text>

                                    <Text>1. Lokasi-mu akan ter update otomatis setiap 10 detik jika kamu berdiam di halaman ini.</Text>
                                    <Text>2. Orderan akan masuk otomatis ke halaman ini, pastikan bertetap di halaman ini jika mencari orderan</Text>

                                    <Text>3. Orderan masuk berdasarkan status Online kamu, jika statusmu Disconnected maka kamu tidak akan bisa mendapatkan orderan</Text>
                                    <Text>4. Orderan masuk juga berdasarkan jumlah Wallet Kamu, jika kamu merasa walletmu sedikit , semisal di bawah Rp. 10,000 maka segera isi walletmu, karena walletmu juga termasuk faktor terbesar dalam mendapatkan orderam</Text>

                                    <Text>5. Cek status online kamu di atas Catatan</Text>
                                    <Text>6. Status akan terupdate otomatis</Text>
                                    <Text>7. Orderan tidak dapat di cancel oleh si PengOrder jika setelah kamu telah mengambil barang antaran tersebut</Text>
                                </View>
                                {/* <View style={{ padding: 20, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#91D18B', borderRadius: 4, height: 50, width: 100 }}>
                            <Text style={{ color: 'white' }}>Terima</Text>
                        </View>
                        <View style={{ padding: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center', height: 50, width: 100, backgroundColor: '#ea5455' }}>
                            <Text style={{ color: 'white' }}>Tolak</Text>
                        </View>
                    </View> */}
                            </View>
                        )
                }
            </View>
        </ScrollView >
    )
}

export default OrderFind;
