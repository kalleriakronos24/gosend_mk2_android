import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StatusBar, Image, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import MapView, { MarkerAnimated, AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { SendPackageModal } from '../../components/modals/sp_modal';
import Geolocation from 'react-native-geolocation-service';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
Geocoder.init('AIzaSyCbpEHfzwBGfdSIfbFCODyH_muffddTZvg');
import * as geolib from 'geolib';
import { PickupOrReceiverModal } from '../../components/modals/pickup';
import { useIsFocused } from '@react-navigation/native';
import { RouteModal } from '../../components/modals/route_modal';
import { formatRupiah } from '../../utils/functionality';


//not used
const Send = ({ navigation, route }) => {

    const { data } = route.params;
    const { navigate, push } = navigation;
    const { width, height } = Dimensions.get('window');
    let [amount, setAmount] = useState('1');
    let [coords, setCoords] = useState(0);
    let dispatch = useDispatch();
    const isFocused = useIsFocused();

    let [error, setError] = useState('');


    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                setCoords(position);
            },
            (err) => {
                setError('Terjadi kesalahan koneksi dalam memproses lokasi anda. tidak dapat melanjutkan')
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: true, timeout: 2000 }
        )
    }, [isFocused]);

    let data1 = {
        amount,
        coords
    };

    const nextSreenHandler = () => {
        dispatch({ type: 'add_count', count: amount });
        push('pickup', { data: data1, userData: data, coordinate: coords })
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar translucent backgroundColor='transparent' barStyle='default' />
            <View style={{ flex: 1 }}>
                <View style={{ width: '100%', height: 220 }}>
                    <Image source={require('../../assets/banner/q3.png')} style={{ alignSelf: 'stretch', width: '100%', height: 220 }} />
                </View>
                <View style={{ padding: 16 }}>
                    <Text style={{ fontSize: 23, fontWeight: '600', letterSpacing: 0.5 }}>Ongqir Send</Text>


                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Input banyak item yg mau dikirim/ambil</Text>

                        <View style={{ padding: 6, borderWidth: 1, marginTop: 8, borderRadius: 10, height: 50 }}>
                            <TextInput keyboardType='numeric' value={amount} onChangeText={(v) => v > 10 ? setAmount(10) : setAmount(v)} placeholder='default 1; max 10' />
                        </View>
                    </View>

                    {error !== '' ? (
                        <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', letterSpacing: .5, color: 'red' }}>{error}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
            <TouchableOpacity disabled={coords === 0 || coords === undefined || coords === null ? true : false} onPress={() => nextSreenHandler()} style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 10, marginRight: 40, marginBottom: 40, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ padding: 8, height: 60, width: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: coords === 0 || coords === undefined || coords === null ? 'red' : '#1F4788', shadowColor: "#000" }}>
                    <Icon name='arrow-forward-outline' size={40} color='white' />
                </View>
            </TouchableOpacity>
        </View>
    )
}

// first 
const SendStep = ({ navigation, route }) => {

    const { data } = route.params;
    const { amount } = data;
    let [_coords, set_Coords] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {

        Geolocation.getCurrentPosition(
            (position) => {
                console.log('positions :: ', position);
                set_Coords(position.coords);
            },
            (err) => {
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: true, timeout: 2000, distanceFilter: 1000 }
        )
        SplashScreen.hide();
    }, [isFocused]);


    let [regionChange, setRegionChange] = useState(0);
    let [isRegionMoving, setRegionMove] = useState(false);

    let [coords, setCoords] = useState({});

    let [distance, setDistance] = useState(0);

    const regionChangeHandler = (coords) => {

        let { latitude, longitude } = coords;

        setDistance(distance = geolib.getDistance({
            latitude: _coords.latitude,
            longitude: _coords.longitude
        }, {
            latitude: latitude,
            longitude: longitude
        }));

        setCoords(coords);

        setRegionChange(300)
        setRegionMove(false)
    };

    const onRegionChangeHandler = () => {
        setRegionChange(130)
        setRegionMove(true);
    };

    let mapRef = useRef(null);
    const mapFitToCoordinates = (

    ) => {
        // regionChangeHandler(i, coords);
        return mapRef.fitToSuppliedMarkers(
            [
                'marker-move',
                'ke'
            ],
            {
                edgePadding: {
                    top: 250,
                    right: 250,
                    left: 250,
                    bottom: 250
                }
            }
        );
    };


    return _coords !== 0 ? (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <View style={{ flex: 1, position: 'relative' }}>
                <MapView
                    initialRegion={{
                        latitude: _coords.latitude,
                        longitude: _coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                    ref={(ref) => mapRef = ref}
                    onLayout={() => mapFitToCoordinates()}
                    onRegionChangeComplete={(e) => regionChangeHandler(e)}
                    onRegionChange={(e) => onRegionChangeHandler()}
                    style={{ flex: 1 }} zoomEnabled={true} />

                <MapView.Marker identifier="ke" coordinate={{ latitude: _coords.latitude, longitude: _coords.longitude }} />
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: -100, left: 0, bottom: 0, right: 0 }}>
                    <View style={{ padding: 10 }}>
                        <Icon name='pin-sharp' size={80} color='red' />
                    </View>
                </View>
                <SendPackageModal
                    navigation={navigation}
                    modalHeight={regionChange}
                    isRegionRunning={isRegionMoving}
                    coordinate={_coords}
                    distance={distance}
                    targetCoord={coords}
                    isRouteMap={false}
                    userData={data}
                />
            </View>
        </View>
    ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size='large' color='blue' />
            </View>
        )
}


// third

const RouteStep = ({ navigation, route }) => {

    let mapRef = useRef(null);

    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders);

    const isFocused = useIsFocused();

    const mapFitToCoordinates = (i, coords) => {
        regionChangeHandler(i, coords);

        return mapRef.fitToSuppliedMarkers(
            [
                'dari',
                'ke'
            ],
            {
                edgePadding: {
                    top: 250,
                    right: 250,
                    left: 250,
                    bottom: 250
                }
            }
        );
    };

    useEffect(() => {
        SplashScreen.hide();
    }, [isFocused]);

    let [regionChange, setRegionChange] = useState(0);
    let [isRegionMoving, setRegionMove] = useState(false);

    let [coords, setCoords] = useState({});

    let [distance, setDistance] = useState(0);

    const state = useSelector((state) => state.orders);
    const { pengirim, penerima } = state;


    const regionChangeHandler = (index, coords) => {

        let { latitude, longitude } = coords;


        setDistance(distance = geolib.getDistance({
            latitude: pengirim.coords.latitude,
            longitude: pengirim.coords.longitude
        }, {
            latitude: latitude,
            longitude: longitude
        }));

        const ongkir = geolib.getDistance({
            latitude: pengirim.coords.latitude,
            longitude: pengirim.coords.longitude
        }, {
            latitude: latitude,
            longitude: longitude
        }) < 5000 ? 10000 : (Math.round((geolib.getDistance({
            latitude: pengirim.coords.latitude,
            longitude: pengirim.coords.longitude
        }, {
            latitude: latitude,
            longitude: longitude
        }) / 1000) / 5) * 5000) + 5000;

        const dist = Math.round(geolib.getDistance({
            latitude: pengirim.coords.latitude,
            longitude: pengirim.coords.longitude
        }, {
            latitude: latitude,
            longitude: longitude
        }) / 1000);


        dispatch({ type: 'update_distance', distance: dist, ongkir: ongkir });

        setCoords(coords);

        setRegionChange(300)
    };

    const onRegionChangeHandler = () => {
        setRegionChange(130)
        setRegionMove(true);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <View key={1} style={{ flex: 1, position: 'relative' }}>
                <MapView
                    initialRegion={{
                        latitude: pengirim.coords.latitude,
                        longitude: pengirim.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                    onLayout={() => mapFitToCoordinates(0, penerima.coords)}
                    pitchEnabled={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    rotateEnabled={false}
                    ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true}>
                    <MapView.Marker identifier="dari" coordinate={{ latitude: pengirim.coords.latitude, longitude: pengirim.coords.longitude }} />
                    <MapView.Marker identifier="ke" coordinate={{ latitude: penerima.coords.latitude, longitude: penerima.coords.longitude }} />
                </MapView>
                <RouteModal
                    navigation={navigation}
                    modalHeight={regionChange}
                    isRegionRunning={isRegionMoving}
                    isRouteMap={true} />
            </View>
        </View>
    )
}


// second
const PickupOrReceiverScreen = ({ navigation, route }) => {

    let mapRef = useRef(null);

    const { data, userData, userCoordinate } = route.params;

    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    let [coords, setCoords] = useState(0);

    const regionChangeHandler = (coords) => {

        let { latitude, longitude } = coords;

        // setDistance(distance = geolib.getDistance({
        //     latitude: userCoordinate.latitude,
        //     longitude: userCoordinate.longitude
        // }, {
        //     latitude: latitude,
        //     longitude: longitude
        // }));

        setCoords({ latitude, longitude });
    };


    const mapFitToCoordinates = () => {
        return mapRef.fitToSuppliedMarkers(
            [
                'tujuan',
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

    useEffect(() => {

        console.log('Route params data :: ', route.params);
        // Geolocation.getCurrentPosition(
        //     (position) => {
        //         console.log('current location coords', position.coords);
        //         setPos(pos = position.coords)
        //     },
        //     (err) => {
        //         console.log('failed to retreive user location', err)
        //     },
        //     { enableHighAccuracy: true, distanceFilter: 900, timeout: 8000 }
        // )
        return () => {
            console.log('cleaned up');
        }
    }, [isFocused]);

    let [distance, setDistance] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <View key={1} style={{ flex: 1, position: 'relative' }}>
                <MapView
                    initialRegion={{
                        latitude: userCoordinate.latitude,
                        longitude: userCoordinate.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                    onLayout={() => mapFitToCoordinates()}
                    onRegionChangeComplete={(e) => regionChangeHandler(e)}
                    ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true} cacheEnabled={false}>
                </MapView>
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: -100, left: 0, bottom: 0, right: 0 }}>
                    <View style={{ padding: 10 }}>
                        <Icon name='pin-sharp' size={80} color='red' />
                    </View>
                </View>
                <PickupOrReceiverModal
                    navigation={navigation}
                    coordinate={coords}
                    params={route.params}
                    userData={userData} />
            </View>
        </View>
    )
}

const ConfirmOrder = ({ navigation }) => {
    const orders = useSelector(state => state.orders);
    const barHeight = StatusBar.currentHeight;
    const { pengirim, penerima, ongkir, distance } = orders;
    let [barang, setBarang] = useState("");
    let [errMsg, setErrMsg] = useState("");


    useEffect(() => {
        console.log('data orderan :: ', orders);
    });


    const nextScreenHandler = () => {

        if (barang === "") {
            console.log(true);
            setErrMsg("harap isi detail barang yg akan dikirim terlebih dahulu.");
            return;
        };

        navigation.navigate('redirect_screen', { detail: barang });

    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: barHeight }}>
            <View style={{ padding: 16, flex: 1 }}>
                <View style={{ padding: 50, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Tempat Icon disini</Text>
                </View>
                <View style={{ padding: 10 }}>
                    <View>
                        <Text style={{ fontSize: 20, letterSpacing: .4 }}>Pengirim</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pengirim.name}</Text>
                        <Text style={{ fontSize: 16, letterSpacing: .5 }}>Jalan testing kaarena blum ada kartu kredit buat google map</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 20, letterSpacing: .4 }}>Penerima</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{penerima.name}</Text>
                        <Text style={{ fontSize: 16, letterSpacing: .5 }}>Jalan testing kaarena blum ada kartu kredit buat google map</Text>
                    </View>


                    <View style={{ marginTop: 40 }}>
                        <TextInput
                            style={{
                                padding: 10,
                                borderRadius: 7,
                                borderWidth: 1
                            }}
                            onChangeText={(v) => setBarang(v)}
                            placeholder="Input Detail barang yg mau dikirim disini."
                            placeholderTextColor="black" />
                        {
                            errMsg === "" ? null : <Text style={{ fontSize: 18, fontWeight:'bold' }}>*{errMsg}</Text>
                        }
                    </View>

                    <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Biaya Ongkir</Text>
                        <View style={{ marginTop: 15 }}>
                            <View style={{ padding: 20 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: .5 }}>{formatRupiah(String(ongkir), "Rp. ")}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => nextScreenHandler()} activeOpacity={.8} style={{ marginTop: 30, padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue' }}>
                        <Text style={{ fontSize: 17, fontWeight: '600', color: 'white' }}>Order Sekarang</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export {
    Send,
    SendStep,
    PickupOrReceiverScreen,
    RouteStep,
    ConfirmOrder
};

//  {/* <MapView.Marker
//                                         draggable coordinate={pos === 0 ? region : pos} identifier='tujuan' title='tujuan'>
//                                             <View style={{ padding: 10 }}>
//                                                 <Icon name='pin-sharp' size={80} color='red'/>
//                                             </View>
//                                         </MapView.Marker> *

// (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//         <ActivityIndicator size='large' color='blue' />
//     </View>
// )