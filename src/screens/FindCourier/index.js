import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, StatusBar, Image, ScrollView, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const FindCourer = ({ navigation, route }) => {


    let [initText, setInitText] = useState('Searching for nearest Courier...')
    let [isLoading, setIsLoading] = useState(false);

    let userReducer = useSelector(state => state.orders);
    let dispatch = useDispatch();

    let { orders, costumer_coordinate } = userReducer;
    let [courierData, setCourierData] = useState({});
    let [userData, setUserData] = useState({});
    let [orderItems, setOrderItems] = useState([]);
    let [notFound, setDataNotFound] = useState(false);

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
                            console.log('isi dari result :: ', result);
                            setCourierData(result.courier);
                            setUserData(result.user);
                            setOrderItems(result.items);

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
                                            <Text style={{ fontSize: 17, fontWeight: 'bold', letterSpacing: .6, textAlign:'center' }}>Kamu tidak punya order aktif untuk sekarang ini.</Text>
                                        </View>
                                    ) : (
                                            <View style={{ padding: 16, marginTop: 10, flex: 1 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Waiting courier to arrive</Text>
                                                    <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <View>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{courierData.fullname}</Text>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 10 }}>As {courierData.type}</Text>
                                                        </View>
                                                        <View style={{ height: 100, width: 100, borderWidth: 1, borderRadius: 10 }}>
                                                            <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10, flex: 1 }} source={{ uri: courierData.foto_diri }} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 15 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Courier details</Text>
                                                    <View style={{ padding: 6 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}> Estimate time to arrive : 0 ~ 4 mins at 40km/h</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 10, textDecorationLine: 'line-through' }}> View courier location on maps </Text>
                                                            <Text style={{ marginLeft: 5, color: 'red', fontSize: 15, fontWeight: 'bold', letterSpacing: .4, textAlign: 'center' }}>not available yet</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 15, flex: 1 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Your items </Text>
                                                    {
                                                        orderItems.map((v, i) => {
                                                            return (
                                                                <View key={i} style={{ padding: 6, borderWidth: 1, borderRadius: 10, borderColor: 'blue', marginBottom: 20 }}>
                                                                    <View style={{ padding: 4 }}>
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                                                            <Text>{v.order_id}</Text>
                                                                            <Text>{v.date}</Text>
                                                                        </View>
                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>{v.send_item}</Text>

                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Ongkir : Rp.{v.ongkir},-</Text>

                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Jarak : {v.distance} km</Text>

                                                                        <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Ke (Alamat) : </Text>
                                                                            <View style={{ padding: 2 }}>
                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.address_detail}</Text>
                                                                            </View>
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                                                                            <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>Ke (Orang) : </Text>
                                                                            <View style={{ padding: 2, flexDirection: 'column' }}>
                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.to.contact_name}</Text>

                                                                                <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4 }}>{v.to.phone}</Text>
                                                                            </View>
                                                                        </View>

                                                                        <Text style={{ fontSize: 15, fontWeight: 'bold', letterSpacing: .4, marginTop: 5 }}>Status : {true ? 'belum dikirim' : 'sudah terkirim'}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        })
                                                    }

                                                </View>
                                            </View>
                                        )
                                }
                                <View style={{ marginTop: 15, marginHorizontal: 15, marginBottom: 5 }}>
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
