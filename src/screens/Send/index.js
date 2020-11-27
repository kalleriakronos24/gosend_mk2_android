import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StatusBar, Image, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
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
import { ViaMap } from '../../components/modals/via_map';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCbgXJ_ueIa0jryLcfkmX1LaJ7Eo29hqEM';

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

    const { data, _coords } = route.params;

    const isFocused = useIsFocused();


    let [defaultAddress, setDefaultAddress] = useState("");
    let [street, setStreet] = useState("");

    useEffect(() => {

        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + _coords.latitude + ',' + _coords.longitude + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((res) => {
                // console.log(res.results[0]);
                setDefaultAddress(res.results[0].formatted_address);
                setStreet(res.results[0].address_components[1].long_name);
            })

        // Geolocation.getCurrentPosition(
        //     (position) => {
        //         console.log('positions :: ', position);
        //         set_Coords(position.coords);
        //     },
        //     (err) => {
        //         console.log('failed to retreive user location', err)
        //     },
        //     { enableHighAccuracy: false, timeout: 2000, distanceFilter: 500 }
        // );

    }, []);

    let [regionChange, setRegionChange] = useState(0);
    let [isRegionMoving, setRegionMove] = useState(false);

    let [coords, setCoords] = useState({});

    let [distance, setDistance] = useState(0);

    const regionChangeHandler = async (coords) => {

        let { latitude, longitude } = coords;

        console.log('current coords', coords.latitude, " ", coords.longitude);


        await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + coords.latitude + ',' + coords.longitude + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.results[0].address_components[2].short_name);
                setDefaultAddress(res.results[0].formatted_address);
                setStreet(res.results[0].address_components[1].long_name);
            })


        setCoords(coords);

        setRegionChange(300)
        setRegionMove(false)
    };

    const onRegionChangeHandler = () => {
        setRegionChange(130)
        setRegionMove(true);
    };

    let mapRef = useRef(null);

    const mapFitToCoordinates = () => {

        console.log(' pengirim map onlayout working ?', _coords);
        // regionChangeHandler(i, coords);
        mapRef.fitToSuppliedMarkers(
            [
                "ke"
            ],
            {
                edgePadding: {
                    top: 250,
                    right: 250,
                    left: 250,
                    bottom: 250
                },
                animated: true
            }
        );
    };


    return (
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
                    style={{ flex: 1 }} />

                <MapView.Marker identifier="ke" coordinate={{ latitude: _coords.latitude, longitude: _coords.longitude }} />
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: -100, left: 0, bottom: 0, right: 0 }}>
                    <View style={{ padding: 10 }}>
                        <Icon name='pin-sharp' size={80} color='red' />
                    </View>
                </View>
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, marginTop: StatusBar.currentHeight }}>
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('user_order_history')} style={{ width: 80, height: 80, borderRadius: 40 }}>
                            <Image defaultSource={require('../../assets/banner/q3.png')} style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 40 }} source={{ cache: 'default', uri: data.fotoDiri }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <SendPackageModal
                    navigation={navigation}
                    modalHeight={regionChange}
                    isRegionRunning={isRegionMoving}
                    coordinate={_coords}
                    targetCoord={coords}
                    isRouteMap={false}
                    userData={data}
                    namaGang={street}
                    address={defaultAddress}
                />
            </View>
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

    const mapFitToCoordinates = (i, coords, distance) => {
        regionChangeHandler(i, coords, distance);

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


    const regionChangeHandler = (index, coords, distance) => {

        let { latitude, longitude } = coords;

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


        // const ongkeer = Math.floor(distance) < 5 ? 10000 : (Math.floor((Math.floor(distance) / 5)) * 5000) + 10000
        const ongkeer = Math.floor(distance) <= 10 ? 10000 : (Math.floor(Math.floor(Math.abs(distance - 10)) * 2000)) + 10000
        // const dist = Math.round(geolib.getDistance({
        //     latitude: pengirim.coords.latitude,
        //     longitude: pengirim.coords.longitude
        // }, {
        //     latitude: latitude,
        //     longitude: longitude
        // }) / 1000);


        dispatch({ type: 'update_distance', distance: Math.floor(distance), ongkir: ongkeer });

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
                    pitchEnabled={true}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    rotateEnabled={false}
                    ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true}>
                    <MapView.Marker title="Pengirim" description="titik pengirim" identifier="dari" coordinate={{ latitude: pengirim.coords.latitude, longitude: pengirim.coords.longitude }} />
                    <MapView.Marker title="Penerima" description="titik penerima" identifier="ke" coordinate={{ latitude: penerima.coords.latitude, longitude: penerima.coords.longitude }} />

                    <MapViewDirections
                        origin={pengirim.coords}
                        waypoints={[]}
                        destination={penerima.coords}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={7}
                        strokeColor="blue"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)

                            mapFitToCoordinates(0, penerima.coords, result.distance)
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />
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

    const { userData, userCoordinate, isPengirim } = route.params;

    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    let [coords, setCoords] = useState(0);




    let [defaultAddress, setDefaultAddress] = useState("");
    let [street, setStreet] = useState("");


    let [isRegionRunning, setIsRegionRunning] = useState(false);

    const regionChangeHandler = (coords) => {

        let { latitude, longitude } = coords;

        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + coords.latitude + ',' + coords.longitude + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((res) => {

                setDefaultAddress(res.results[0].formatted_address);
                setStreet(res.results[0].address_components[1].long_name);
            })

        // setDistance(distance = geolib.getDistance({
        //     latitude: userCoordinate.latitude,
        //     longitude: userCoordinate.longitude
        // }, {
        //     latitude: latitude,
        //     longitude: longitude
        // }));

        setIsRegionRunning(false);

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

        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + userCoordinate.latitude + ',' + userCoordinate.longitude + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((res) => {
                setDefaultAddress(res.results[0].formatted_address);
                setStreet(res.results[0].address_components[1].long_name);
            })
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
                    onRegionChange={() => setIsRegionRunning(true)}
                    ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true} cacheEnabled={false}>
                </MapView>
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: -100, left: 0, bottom: 0, right: 0 }}>
                    <View style={{ padding: 10 }}>
                        <Icon name='pin-sharp' size={80} color='red' />
                    </View>
                </View>
                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, marginTop: StatusBar.currentHeight }}>
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('user_order_history')} style={{ width: 80, height: 80, borderRadius: 40 }}>
                            <Image defaultSource={require('../../assets/banner/q3.png')} style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 40 }} source={{ cache: 'default', uri: userData.fotoDiri }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <PickupOrReceiverModal
                    navigation={navigation}
                    coordinate={coords}
                    params={route.params}
                    userData={userData}
                    address={defaultAddress}
                    isRegionRunning={isRegionRunning}
                    street={street}
                    isPengirim={isPengirim} />
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
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: barHeight, }}>
            <ScrollView style={{ padding: 16, flex: 1 }}>
                <View style={{ padding: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center', height: '20%', width: '100%' }}>
                    <Image source={require('../../assets/logos/4.png')} style={{ height: '100%', width: '100%', alignSelf: 'stretch' }} />
                </View>
                <View style={{ padding: 10, flex: 1 }}>

                    <View>
                        <Text style={{ fontSize: 20, letterSpacing: .4 }}>Pengirim</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pengirim.name}</Text>
                        <Text style={{ fontSize: 16, letterSpacing: .5 }}>{pengirim.address}</Text>
                        <Text>Detail Alamat : {pengirim.address_detail}</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 20, letterSpacing: .4 }}>Penerima</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{penerima.name}</Text>
                        <Text style={{ fontSize: 16, letterSpacing: .5 }}>{penerima.address}</Text>
                        <Text>Detail Alamat : {penerima.address_detail}</Text>
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
                            errMsg === "" ? null : <Text style={{ fontSize: 18, fontWeight: 'bold' }}>*{errMsg}</Text>
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
                    <TouchableOpacity onPress={() => nextScreenHandler()} activeOpacity={.8} style={{ marginTop: 30, padding: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue', marginBottom: 300 }}>
                        <Text style={{ fontSize: 17, fontWeight: '600', color: 'white' }}>Order Sekarang</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
};

const PilihLewatMap = ({ navigation, route }) => {

    let mapRef = useRef(null);

    const { width, height } = Dimensions.get('window');
    const { data } = route.params;
    const isFocused = useIsFocused();
    let [coords, setCoords] = useState({});
    let [isLoading, setIsLoading] = useState(true);

    const mapFitToCoordinates = () => {

        return mapRef.fitToSuppliedMarkers(
            [
                'dari'
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

        Geolocation.getCurrentPosition(
            (position) => {
                setCoords(position.coords);

                setTimeout(() => {
                    setIsLoading(false);
                }, 2000) // 2s
            },
            (err) => {
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: true, timeout: 2000 }
        )
    }, [isFocused]);

    let [regionChange, setRegionChange] = useState(0);
    let [isRegionMoving, setRegionMove] = useState(false);

    return isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color='blue' />
        </View>
    ) : (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
                <View key={1} style={{ flex: 1, position: 'relative' }}>
                    <MapView
                        initialRegion={{
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }}
                        onLayout={() => mapFitToCoordinates()}
                        pitchEnabled={true}
                        scrollEnabled={true}
                        zoomEnabled={true}
                        rotateEnabled={false}
                        ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true}>
                        <MapView.Marker identifier="dari" coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />
                    </MapView>
                    <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, marginTop: StatusBar.currentHeight }}>
                        <View style={{ padding: 10 }}>
                            <TouchableOpacity style={{ width: 80, height: 80, borderRadius: 40 }}>
                                <Image defaultSource={require('../../assets/banner/q3.png')} style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 40 }} source={{ cache: 'default', uri: data.fotoDiri }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ViaMap
                        navigation={navigation}
                        isRouteMap={false}
                        params={data}
                        coordinate={coords} />
                </View>
            </View>
        )
}

export {
    Send,
    SendStep,
    PickupOrReceiverScreen,
    RouteStep,
    ConfirmOrder,
    PilihLewatMap
};
