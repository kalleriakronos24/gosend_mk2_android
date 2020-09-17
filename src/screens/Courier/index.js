import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

const OrderFind = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const barHeight = StatusBar.currentHeight;
    const isPending = true;
    let [data, setData] = useState([]);

    useEffect(() => {

    }, [data])
    const fetchOrder = () => {
        
        fetch('http://192.168.43.178:8000', {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                Authorization : 'Bearer' + Math.round(Math.random() * 9999)
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            throw new Error(err);
        })

    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingTop: barHeight }}>
            <StatusBar barStyle='dark-content' />
            <View style={{ padding: 16 }}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()} style={{ padding:6 }}>
                    <Icon name='arrow-back-outline' size={30}/>
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 20 }}>Cek Orderan masuk di bawah ini..</Text>
                </View>
                <View style={{ padding: 20, borderRadius: 10, marginTop: 20, width: width - (20 * 2) }}>
                    <View style={{ padding: 6 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>09/10/2020/12398123</Text>
                            <Text>{new Date().toDateString()}</Text>
                        </View>
                        <View style={{ paddingTop: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Status : </Text>
                                <Text style={{ borderBottomWidth: 1, borderColor: isPending ? 'red' : 'blue', color: isPending ? 'red' : 'blue' }}>Pending</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                <Text>From : </Text>
                                <Text style={{}}>User Test</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                                <Text>Item : </Text>
                            </View>
                            <View style={{ padding: 8 }}>
                                {
                                    Array.from({ length: 2 }).map((_,i)=> (
                                        <View key={i} style={{ padding: 4 }}>
                                            <Text>Nasi goreng bumbu pedas</Text>
                                            <Text>Ke Alamat : Perum PKL blok d rt 14 no 510 sungai kapih</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 5, borderColor: 'red', borderWidth: .5 }}>
                                                    <Text style={{ color: 'black', marginRight: 10 }}>status : belum dikirim</Text>
                                                    <Icon name='alert-circle-outline' size={17} color='black' />
                                                </View>
                                                <TouchableOpacity activeOpacity={.6} onPress={() => navigation.push('courier_order_detail')} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: 'blue', borderRadius: 5 }}>
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
                        <View style={{ borderBottomWidth: 2, borderBottomRightRadius : 10, borderBottomLeftRadius: 10 }}/>
                        <View style={{ paddingTop: 10, justifyContent:'center', alignItems:'center' }}>
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
            </View>
        </ScrollView>
    )
}

export default OrderFind;
