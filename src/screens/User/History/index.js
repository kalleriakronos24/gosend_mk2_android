import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, StatusBar, Image, ScrollView, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const UserOrderHistory = ({ navigation, route }) => {


    let [initText, setInitText] = useState('Searching for nearest Courier...')
    let [isLoading, setIsLoading] = useState(false);

    let userReducer = useSelector(state => state.orders);
    let dispatch = useDispatch();

    let { orders, costumer_coordinate } = userReducer;
    let [courierData, setCourierData] = useState({});
    let [userData, setUserData] = useState({});
    let [orderItems, setOrderItems] = useState([]);
    let [count, setCount] = useState(0);
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
                fetch('http://192.168.43.178:8000/user/order/get/all', {
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
                        console.log('isi dari result :: ', result);
                        setCourierData(result.courier);
                        setUserData(result.user);
                        setOrderItems(result.items);
                        setCount(result.count);

                        setTimeout(() => {
                            setIsLoading(false);
                        }, 2000)
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
    }
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
                                        <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('home')} style={{ padding: 6 }}>
                                            <Icon name='home-outline' size={25} />
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 17, letterSpacing: .5, fontWeight: 'bold' }}> Your Orders History </Text>
                                        <TouchableOpacity activeOpacity={.7} onPress={() => console.log('no effect')} style={{ padding: 6 }}>
                                            <Icon name='help-circle-outline' size={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    false ? (
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                            <Text style={{ fontSize: 17, fontWeight: 'bold', letterSpacing: .6 }}>no orders found yet, go order some!</Text>
                                        </View>
                                    ) : (
                                            <View style={{ padding: 16, marginTop: 10, flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <View>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{userData.fullname}</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 10 }}>As {userData.type}</Text>
                                                        </View>
                                                        <View style={{ height: 100, width: 100, borderRadius: 10 }}>
                                                            <Icon name='person-outline' size={50} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 15 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>User details</Text>
                                                    <View style={{ padding: 6 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Statistic based on last orders</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 10 }}>total order count : </Text>
                                                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold', letterSpacing: .4, textAlign: 'center', marginTop: 10 }}>{count}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 15, flex: 1 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Your order history </Text>
                                                    {
                                                        orderItems.map((x, i) => {
                                                            return x.item.map((v, y) => {
                                                                return (
                                                                    <View key={y} style={{ padding: 6, borderWidth: 1, borderRadius: 10, borderColor: 'blue', marginBottom: 20 }}>
                                                                        <View style={{ padding: 4 }}>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                                                                <Text>{v.order_id}</Text>
                                                                                <Text>{v.date}</Text>
                                                                            </View>
                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>{v.send_item}</Text>

                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Ongkir : Rp.{v.ongkir},-</Text>

                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Jarak : {v.distance} km</Text>

                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Order tipe : {x.tipe}</Text>

                                                                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{x.tipe === 'antar' ? 'Antar ke ' : 'Ambil dari '}(Alamat) : </Text>
                                                                                <View style={{ padding: 2 }}>
                                                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.address_detail}</Text>
                                                                                </View>
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{x.tipe === 'antar' ? 'Antar ke ' : 'Ambil dari '}(No.Hp)</Text>
                                                                                <View style={{ padding: 2, flexDirection: 'column' }}>
                                                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.to.contact_name}</Text>

                                                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.to.phone}</Text>
                                                                                </View>
                                                                            </View>

                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Status : {v.status ? 'sudah dikirim' : 'belum terkirim'}</Text>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        )
                                }
                                <View style={{ marginTop: 15, marginHorizontal: 15, marginBottom: 5 }}>
                                    <TouchableOpacity activeOpacity={.7} onPress={() => navigation.push('home')} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue', height: 45, borderRadius: 10 }}>
                                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16, letterSpacing: .5 }}>Back to home</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </>
                    )
            }
        </View>
    )
}

export default UserOrderHistory
