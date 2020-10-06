import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, TouchableOpacity, Dimensions, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';

const OrderFind = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const barHeight = StatusBar.currentHeight;
    const isPending = true;

    let [courierData, setCourierData] = useState({});
    let [userData, setUserData] = useState({});
    let [orderItems, setOrderItems] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [orderID, setOrderID] = useState(0);
    let [orderDate, setOrderDate] = useState(0);
    let [order_id, setOrderId] = useState(0);
    let [notFound, setNotFound] = useState(false);
    let [tipe, setTipe] = useState('');

    const isFocused = useIsFocused();

    useEffect(() => {
        onRefresh()

        return () => {
            console.log('un mounted');
        }
    }, [isFocused])


    const fetchOrder = async () => {

        return await AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then( async (res) => {
                let body = {
                    token: res
                }
                return await fetch('http://192.168.43.178:8000/courier/order/get', {
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
                        console.log('is this worked ? ');

                        if (result.msg) {
                            setNotFound(true);
                        } else {
                            setCourierData(result.courier);
                            setUserData(result.user);
                            setOrderItems(result.items);
                            setOrderID(result._id);
                            setOrderId(result.id);
                            setOrderDate(result.date);
                            setTipe(result.tipe);
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
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 20 }}>Cek Orderan masuk di bawah ini..</Text>
                </View>
                {
                    notFound ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 17, letterSpacing: .5, fontWeight: 'bold' }}>u dont have an orders yet</Text>
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
                                            <Text style={{ borderBottomWidth: 1, borderColor: isPending ? 'red' : 'blue', color: isPending ? 'red' : 'blue' }}>{true ? 'menunggu' : 'di proses'}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                            <Text>From : </Text>
                                            <Text style={{}}>{userData.fullname}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                            <Text>Tipe Orderan : </Text>
                                            <Text style={{}}>{tipe}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                            <Text>Item : </Text>
                                        </View>
                                        <View style={{ padding: 8 }}>
                                            {
                                                orderItems.map((v, i) => (
                                                    <View key={i} style={{ padding: 4 }}>
                                                        <Text>{v.send_item}</Text>
                                                        <Text>Ke Alamat : {v.address_detail}</Text>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 5, borderColor: 'red', borderWidth: .5 }}>
                                                                <Text style={{ color: v.status ? 'black' : 'red', marginRight: 10 }}>status : {v.status ? `sudah ${tipe === 'antar' ? 'di antar' : 'di ambil'}` : `belum ${tipe === 'antar' ? 'di antar' : 'di ambil'}`}</Text>
                                                                <Icon name={`${v.status ? 'checkmark-circle' : 'alert-circle'}-outline`} size={17} color='black' />
                                                            </View>
                                                            <TouchableOpacity activeOpacity={.6} onPress={() => navigation.push('courier_order_detail', { data: v, from: userData.fullname, _id: orderID, id: v.id, tipe : tipe, order_id : v.order_id, date : v.date })} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: 'blue', borderRadius: 5 }}>
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
                                <View style={{ padding: 20 }}>
                                    <View style={{ borderBottomWidth: 2, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }} />
                                    <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>List orderan masuk.</Text>
                                    </View>
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
        </ScrollView>
    )
}

export default OrderFind;
