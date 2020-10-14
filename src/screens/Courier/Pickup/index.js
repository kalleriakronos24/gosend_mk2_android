import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StatusBar, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useIsFocused } from '@react-navigation/native';

const PickupDetail = ({ navigation, route }) => {

    const { width, height } = Dimensions.get('window');
    const barHeight = StatusBar.currentHeight;
    const isPending = true;
    let [isLoading, setIsLoading] = useState(true);
    let { data, tipe, order_id, date, pickup, user_no_hp, user_name } = route.params;
    let [coords, setCoords] = useState(0);
    let [ishide, setIsHide] = useState(true);

    let mapRef = useRef(null);

    let region = {
        latitude: -0.454063,
        longitude: 117.167437,
        longitudeDelta: 0.005,
        latitudeDelta: 0.005
    };

    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('mounted pickup');
        Geolocation.getCurrentPosition(
            (position) => {
                console.log('pickup not working', position.coords);
                setCoords(position.coords);
                setTimeout(() => {
                    setIsLoading(false)
                }, 3000)
            },
            (err) => {
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: false, distanceFilter: 100, timeout: 8000 }
        )
    }, []);

    const setDoneOrder = async () => {

        let body = {
            order_id: _id,
            id: id
        }

        return await fetch('http://192.168.43.178:8000/order/single/set-to-done', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(async res => {
                return await res.json();
            })
            .then(async res => {
                return await navigation.goBack();
            })
            .catch(err => {
                console.log('error occured ?');
                throw new Error(err);
            })
    };

    const mapFitToCoordinates = () => {
        return mapRef.fitToSuppliedMarkers(
            [
                'kurir',
                'penerima'
            ],
            {
                edgePadding: {
                    top: 150,
                    right: 150,
                    left: 150,
                    bottom: 150
                }
            }
        );
    };

    return isLoading ? (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <ActivityIndicator color='blue' size='large' />
        </View>
    ) : (
            <>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
                    <MapView
                        style={{ height: (height / 2) + 50 }}
                        initialRegion={{
                            latitude: pickup.coords.latitude,
                            longitude: pickup.coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }}

                        showsCompass={false}
                        onLayout={() => mapFitToCoordinates()}
                        ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true} loadingEnabled={true} showsUserLocation={true}>
                        <MapView.Marker
                            identifier={'kurir'}
                            title='You'
                            key={1}
                            description='Lokasi anda'
                            coordinate={{
                                latitude: coords.latitude,
                                longitude: coords.longitude
                            }}
                        />
                        <MapView.Marker
                            identifier='penerima'
                            title={tipe === 'antar' ? 'Lokasi Pengambilan Barang' : 'Lokasi Penerima Barang'}
                            description={tipe === 'antar' ? 'Lokasi Pengambilan Barang' : 'Lokasi Penerima Barang'}
                            coordinate={{ latitude: pickup.coords.latitude, longitude: pickup.coords.longitude }}
                            key={2}
                        />
                    </MapView>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ padding: 16, flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Order ID : </Text>
                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>{order_id}</Text>
                                </View>
                                <Text style={{ textDecorationLine: 'underline', textDecorationColor: 'blue' }}>{date}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <Text style={{ fontSize: 18 }}>{tipe === 'antar' ? 'Pengirim' : 'Penerima'} Barang : </Text>
                                <Text style={{ marginLeft: 10, fontSize: 16, textTransform: 'capitalize' }}>{user_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <Text style={{ fontSize: 18 }}>No.Hp {tipe === 'antar' ? 'Pengirim' : 'Penerima'} : </Text>
                                <Text style={{ marginLeft: 10, fontSize: 16, textTransform: 'capitalize' }}>{user_no_hp}</Text>
                            </View>

                            {
                                tipe === 'ambil' ? (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                            <Text style={{ fontSize: 18 }}>Jarak : </Text>
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{data.distance} km</Text>
                                            <TouchableOpacity onPress={() => Alert.alert('Detail Jarak', `Jarak antara Pengirim ke Penerima adalah ${data.distance} kilometer`)} activeOpacity={.7} style={{ padding: 6, marginLeft: 15, borderColor: 'blue', borderRadius: 6, borderWidth: 1 }}>
                                                <Text style={{ letterSpacing: .5, fontSize: 16, fontWeight: 'bold' }}>Cek</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                            <Text style={{ fontSize: 18 }}>Ongkir : </Text>
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>Rp. {data.ongkir}</Text>
                                        </View>
                                    </>
                                ) : null
                            }

                            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 10 }}>Informasi {tipe === 'antar' ? 'Penerima' : 'Pengirim'} : </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <Text style={{ fontSize: 18 }}>Nama {tipe === 'antar' ? 'Penerima' : 'Pengirim'} : </Text>
                                <Text style={{ marginLeft: 10, fontSize: 16 }}>{data.to.contact_name}</Text>
                            </View>

                            <TouchableOpacity onPress={() => setIsHide(!ishide)} activeOpacity={.7} style={{ justifyContent: 'center', alignItems: 'center', padding: 7, borderRadius: 6, borderWidth: 1, borderColor: 'blue', marginVertical: 6 }}>
                                <Text>Klik untuk Detail</Text>
                                <Icon name={ishide ? "chevron-down-outline" : "chevron-up-outline"} size={25} color="blue" />
                            </TouchableOpacity>

                            {
                                ishide ? null : (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                            <Text style={{ fontSize: 18 }}>No.HP : </Text>
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{data.to.phone}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                            <Text style={{ fontSize: 18 }}>Detail Alamat : </Text>
                                            <View style={{ padding: 4, flex: 1 }}>
                                                <Text style={{ textAlign: 'justify', fontSize: 16 }}>{data.address_detail}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                            <Text style={{ fontSize: 18 }}>Brg yg {tipe === 'antar' ? 'bakal di kirim' : 'bakal di ambil'} : </Text>
                                            <View style={{ padding: 4, flex: 1 }}>
                                                <Text style={{ textAlign: 'justify', fontSize: 16 }}>{data.send_item}</Text>
                                            </View>
                                        </View>
                                    </>
                                )
                            }

                            <TouchableOpacity activeOpacity={.7} onPress={() => data.status ? console.log('no action') : setDoneOrder()} style={{ justifyContent: 'center', alignItems: "center", padding: 16, backgroundColor: data.status ? '#28DF99' : 'blue', borderRadius: 5, height: '15%', marginTop: 10 }}>
                                <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 17, marginRight: 10 }}>{data.status ? 'Selesai' : 'Ttpkan sbg telah selesai'}</Text>
                                    <Icon name={`${data.status ? 'checkmark-circle' : 'alert-circle'}-outline`} size={30} color='white' />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ position: 'absolute', left: 0, top: 0, paddingTop: barHeight + 16, paddingHorizontal: 16, }}>
                    <TouchableOpacity onPress={() => navigation.navigate('find_order')} activeOpacity={.7} style={{ padding: 6 }}>
                        <Icon name='arrow-back-outline' size={30} />
                    </TouchableOpacity>
                </View>
            </>
        )
}

export default PickupDetail;