import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StatusBar, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useIsFocused } from '@react-navigation/native';
import * as geolib from 'geolib';

const OrderDetailCourier = ({ navigation, route }) => {

    const { width, height } = Dimensions.get('window');
    const barHeight = StatusBar.currentHeight;
    const isPending = true;
    let [isLoading, setIsLoading] = useState(true);
    let { data, from, _id, id, tipe, order_id, date, status, pickedup } = route.params;
    console.log('pickedup ', pickedup);
    let [coords, setCoords] = useState(0);
    let [isWithinRadius, setIsWithinRadius] = useState(false);
    let mapRef = useRef(null);

    console.log('DELIVERY STATUS :: ', status);

    let [sudahSampai, setSudahSampai] = useState(status === "belum di ambil" ? true : false);
    let [sudahDiAmbil, setSudahDiAmbil] = useState(status === "sudah sampai" ? true : false);
    let [sedangDiAntar, setSedangDiAntar] = useState(status === "sudah di ambil" ? true : false);

    let region = {
        latitude: -0.454063,
        longitude: 117.167437,
        longitudeDelta: 0.005,
        latitudeDelta: 0.005
    };


    const isFocused = useIsFocused();

    useEffect(() => {

        let interval = setInterval(() => Geolocation.getCurrentPosition(
            (position) => {
                // console.log('watch for position running every 5s', position.coords);
                let check = geolib.getDistance(position.coords,
                    {
                        latitude: data.coords.latitude,
                        longitude: data.coords.longitude,
                    }) // checks if courier is within 20m radius of the target destination
                setIsWithinRadius(check < 60 ? true : false);

            },
            (err) => {
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: true, distanceFilter: 500, timeout: 8000 }
        ), 1000 * 5) // 5s;

        return () => {
            clearInterval(interval);
        };
    }, [])

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                setCoords(position.coords);
            },
            (err) => {
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: true, distanceFilter: 500, timeout: 8000 })
    }, [])

    // let teetee = "/order/courier/set/deliver/status";

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
            });

    };

    const setDeliverStatusToSudahSampai = async (status) => {

        setSudahSampai(false);
        setSudahDiAmbil(true);
        setSedangDiAntar(false);

        let body = {
            order_id: _id,
            status: status
        }

        await fetch('http://192.168.43.178:8000/order/courier/set/deliver/status', {
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
                // return await navigation.goBack();
                console.log('return dari set deliver status', res);
            })
            .catch(err => {
                console.log('error occured ?');
                throw new Error(err);
            })
    };

    const setDeliverStatusToSudahDiAmbil = async (status) => {


        setSudahSampai(false);
        setSudahDiAmbil(false);
        setSedangDiAntar(true);


        let body = {
            order_id: _id,
            status: status
        }

        await fetch('http://192.168.43.178:8000/order/courier/set/deliver/status', {
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
                // return await navigation.goBack();
                console.log('return dari set deliver status', res);
            })
            .catch(err => {
                console.log('error occured ?');
                throw new Error(err);
            })
    };

    const setDeliverStatusToSedangDiAntar = async (status) => {


        setSudahSampai(false);
        setSudahDiAmbil(false);
        setSedangDiAntar(false);

        let body = {
            order_id: _id,
            status: status
        }

        await fetch('http://192.168.43.178:8000/order/courier/set/deliver/status', {
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
                // return await navigation.goBack();
                console.log('return dari set deliver status', res);
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

    return coords === 0 ? (
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
                            latitude: data.coords.latitude,
                            longitude: data.coords.longitude,
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
                            title={tipe === 'antar' ? 'Titik Penerima' : 'Titik Ambil Barang'}
                            description={tipe === 'antar' ? 'Lokasi Penerima Barang' : 'Titik Pengambilan Barang'}
                            coordinate={{ latitude: data.coords.latitude, longitude: data.coords.longitude }}
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
                                <Text style={{ fontSize: 18 }}>{tipe === 'antar' ? 'Pengirim' : 'Penerima'} : </Text>
                                <Text style={{ marginLeft: 10, fontSize: 16, textTransform: 'capitalize' }}>{from}</Text>
                            </View>

                            {
                                tipe === 'antar' ? (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                            <Text style={{ fontSize: 18 }}>Ongkir : </Text>
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>Rp. {data.ongkir}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                            <Text style={{ fontSize: 18 }}>Jarak : </Text>
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{data.distance} km</Text>
                                        </View>
                                    </>
                                ) : null
                            }

                            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 10 }}>Informasi {tipe === 'antar' ? 'Penerima' : 'Pengirim'} ({tipe === 'antar' ? 'Kirim Barang' : 'Ambil Barang'}): </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <Text style={{ fontSize: 18 }}>Nama {tipe === 'antar' ? 'Penerima' : 'Pengirim'} : </Text>
                                <Text style={{ marginLeft: 10, fontSize: 16, textTransform: 'capitalize' }}>{data.to.contact_name}</Text>
                            </View>
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
                            {
                                isWithinRadius ? (
                                    <>
                                        {tipe === 'antar' && pickedup ? (
                                            <TouchableOpacity activeOpacity={.7} onPress={() => data.status ? console.log('no action') : setDoneOrder()} style={{ justifyContent: 'center', alignItems: "center", padding: 16, backgroundColor: data.status ? '#28DF99' : 'blue', borderRadius: 5, height: '15%', marginTop: 10 }}>
                                                <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ color: 'white', fontSize: 17, marginRight: 10 }}>{data.status ? 'Selesai' : 'Ttpkan sbg telah di Antar'}</Text>
                                                    <Icon name={`${data.status ? 'checkmark-circle' : 'alert-circle'}-outline`} size={30} color='white' />
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                                <>
                                                    {
                                                        sudahSampai ? (
                                                            <>
                                                                <Text style={{ marginTop: 20 }}>*Tekan TELAH SAMPAI jika kamu sudah sampai di lokasi pengambilan Barang.</Text>
                                                                <TouchableOpacity activeOpacity={.7} onPress={() => setDeliverStatusToSudahSampai('sudah sampai')} style={{ justifyContent: 'center', alignItems: "center", padding: 16, backgroundColor: data.status ? '#28DF99' : 'blue', borderRadius: 5, height: '15%', marginTop: 10 }}>
                                                                    <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Text style={{ color: 'white', fontSize: 17, marginRight: 10 }}>Telah Sampai</Text>
                                                                        <Icon name={`${data.status ? 'checkmark-circle' : 'alert-circle'}-outline`} size={30} color='white' />
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </>
                                                        ) : null
                                                    }
                                                    {
                                                        sudahDiAmbil ? (
                                                            <>

                                                                <Text style={{ marginTop: 20 }}>*Tekan BARANG TELAH DI AMBIL jika kamu sudah Mengambil Barang dari si Pengirim.</Text>
                                                                <TouchableOpacity activeOpacity={.7} onPress={() => setDeliverStatusToSudahDiAmbil('sudah di ambil')} style={{ justifyContent: 'center', alignItems: "center", padding: 16, backgroundColor: data.status ? '#28DF99' : 'blue', borderRadius: 5, height: '15%', marginTop: 10 }}>
                                                                    <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Text style={{ color: 'white', fontSize: 17, marginRight: 10 }}>Barang Telah Di Ambil</Text>
                                                                        <Icon name={`${data.status ? 'checkmark-circle' : 'alert-circle'}-outline`} size={30} color='white' />
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </>
                                                        ) : null
                                                    }
                                                    {
                                                        sedangDiAntar ? (
                                                            <>

                                                                <Text style={{ marginTop: 20 }}>*Tekan BARANG SEDANG DI KIRIM KE TUJUAN jika kamu siap Mengantar Barang Tersebut Ke Target Tujuan.</Text>
                                                                <TouchableOpacity activeOpacity={.7} onPress={() => setDeliverStatusToSedangDiAntar("sedang di antar")} style={{ justifyContent: 'center', alignItems: "center", padding: 16, backgroundColor: data.status ? '#28DF99' : 'blue', borderRadius: 5, height: '15%', marginTop: 10 }}>
                                                                    <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Text style={{ color: 'white', fontSize: 17, marginRight: 10 }}>Barang sedang Di Kirim ke tujuan</Text>
                                                                        <Icon name={`${data.status ? 'checkmark-circle' : 'alert-circle'}-outline`} size={30} color='white' />
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </>
                                                        ) : null
                                                    }
                                                </>
                                            )}
                                    </>
                                ) : (
                                        <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 17, fontWeight: 'bold', letterSpacing: .5, textAlign: 'center' }}>Tombol " {tipe === "antar" ? "Ttpkan sbg telah di Antar" : "TELAH SAMPAI DI TEMPAT PENGAMBILAN BARANG"} " Akan muncul otomatis disini jika kamu sudah di lokasi {tipe === "antar" ? "Pengantaran" : "Pengambilan"} dan pastikan kamu jujur dan {tipe === "antar" ? "Mengantar Barang Tsb." : "Mengambil Barang tsb"} sebelum menekan tombol </Text>
                                        </View>
                                    )
                            }

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

export default OrderDetailCourier;
