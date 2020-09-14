import React from 'react'
import { View, Text, StatusBar, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';

const OrderDetailCourier = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const barHeight = StatusBar.currentHeight;
    const isPending = true;

    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
                <MapView style={{ height: (height / 2) + 50 }} loadingEnabled={true}>

                </MapView>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ padding: 16, flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Order ID : </Text>
                                <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>XI/20201/1231239</Text>
                            </View>
                            <Text style={{ textDecorationLine: 'underline', textDecorationColor:'blue' }}>{new Date().toDateString()}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>Dari : </Text>
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>(Nama Pembeli)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>Jarak : </Text>
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>4km</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>Ongkir : </Text>
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>Rp.1239812938</Text>
                        </View>

                        <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 10 }}>Informasi Penerima : </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>Nama Penerima : </Text>
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{'(Nama Penerima123123123123123123123123123)'.slice(0, 23)}{true ? '...' : null}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>No.HP : </Text>
                            <Text style={{ marginLeft: 10, fontSize: 16 }}>(0814123123123)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>Detail Alamat : </Text>
                            <View style={{ padding: 4, flex: 1 }}>
                                <Text style={{ textAlign: 'justify', fontSize: 16 }}>Perum PKL Blok D Rt.14 No 510 sungai kapih samarinda ilir samarinda</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Text style={{ fontSize: 18 }}>Brg yg dikirim : </Text>
                            <View style={{ padding: 4, flex: 1 }}>
                                <Text style={{ textAlign: 'justify', fontSize: 16 }}>Nasi Goreng, nasi bungkus, kepiting bakar, ayam bakar</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: "center", padding: 16, backgroundColor: 'blue', borderRadius: 5, height: '15%', marginTop: 10 }}>
                            <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>Tetapkan sbg telah dikirim </Text>
                                <Icon name='checkmark-circle-outline' size={30} color='white' />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View style={{ position: 'absolute', left: 0, top: 0, paddingTop: barHeight + 16, paddingHorizontal: 16, }}>
                <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={.7} style={{ padding: 6 }}>
                    <Icon name='arrow-back-outline' size={30} />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default OrderDetailCourier;
