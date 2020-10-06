import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StatusBar, Image, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import MapView, { MarkerAnimated, AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { SendPackageModal } from '../../components/modals/sp_modal';
import Geolocation from '@react-native-community/geolocation';
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
Geocoder.init('AIzaSyCbpEHfzwBGfdSIfbFCODyH_muffddTZvg');
import * as geolib from 'geolib';
import { PickupOrReceiverModal } from '../../components/modals/pickup';
import { useIsFocused } from '@react-navigation/native';
import { RouteModal } from '../../components/modals/route_modal';


//first
const Send = ({ navigation, route }) => {

    const { data } = route.params;
    const { navigate, push } = navigation;
    const { width, height } = Dimensions.get('window');
    let [amount, setAmount] = useState('1');
    let [coords, setCoords] = useState(0);
    let dispatch = useDispatch();
    const isFocused = useIsFocused();
    console.log(data);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log('current region isz : ', position.coords)
                setCoords(position);
            },
            (err) => {
                console.log('failed to retreive user location', err)
            },
            { enableHighAccuracy: true, distanceFilter: 100, timeout: 8000 }
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
                <View style={{ width: '100%', height: height - 500 }}>
                    <Image source={require('../../assets/banner/q3.png')} style={{ alignSelf: 'stretch', width: '100%', height: height - 500 }} />
                </View>
                <View style={{ padding: 16 }}>
                    <Text style={{ fontSize: 23, fontWeight: '600', letterSpacing: 0.5 }}>Ongqir Send</Text>


                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Input banyak item yg mau dikirim/ambil</Text>

                        <View style={{ padding: 6, borderWidth: 1, marginTop: 8, borderRadius: 10, height: 50 }}>
                            <TextInput keyboardType='numeric' value={amount} onChangeText={(v) => v > 10 ? setAmount(10) : setAmount(v)} placeholder='default 1; max 10' />
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => nextSreenHandler()} style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 10, marginRight: 40, marginBottom: 40, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ padding: 8, height: 60, width: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: '#1F4788', shadowColor: "#000" }}>
                    <Icon name='arrow-forward-outline' size={40} color='white' />
                </View>
            </TouchableOpacity>
        </View>
    )
}

// third
const SendStep = ({ navigation, route }) => {

    const { data, _coords, pickupDetail, type } = route.params;
    const { amount } = data;
    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    console.log('coordinate :: ', _coords);


    useEffect(() => {
        SplashScreen.hide();
    }, [isFocused]);


    let [regionChange, setRegionChange] = useState(0);
    let [isRegionMoving, setRegionMove] = useState(false);

    let [coords, setCoords] = useState({});

    let [distance, setDistance] = useState(0);

    const regionChangeHandler = (coords) => {

        let { latitude, longitude } = coords;

        console.log('region changed, coords:::', coords);
        console.log('position :: ', _coords.latitude, _coords.longitude);

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
    }
    let swiperRef = useRef(null);

    const swipeRight = (index) => {
        swiperRef.scrollBy(index, true)
    }

    return _coords !== 0 ? (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <Swiper scrollEnabled={true} ref={(ref) => swiperRef = ref} bounces={true} loadMinimalLoader={<ActivityIndicator />} showsPagination={false} loop={false}>
                {
                    Array.from({ length: amount }).map((v, i) => {
                        return (
                            <View key={i} style={{ flex: 1, position: 'relative' }}>
                                <MapView
                                    initialRegion={{
                                        latitude: _coords.latitude,
                                        longitude: _coords.longitude,
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005
                                    }}
                                    onRegionChangeComplete={(e) => regionChangeHandler(e)}
                                    onRegionChange={(e) => onRegionChangeHandler()}
                                    style={{ flex: 1 }} zoomEnabled={true} />
                                <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: -100, left: 0, bottom: 0, right: 0 }}>
                                    <View style={{ padding: 10 }}>
                                        <Icon name='pin-sharp' size={80} color='red' />
                                    </View>
                                </View>
                                <SendPackageModal
                                    navigation={navigation}
                                    swipeHandler={swipeRight}
                                    index={i}
                                    totalIndex={amount}
                                    modalHeight={regionChange}
                                    isRegionRunning={isRegionMoving}
                                    coordinate={_coords}
                                    distance={distance}
                                    targetCoord={coords}
                                    type={type}
                                    pickupDetail={pickupDetail}
                                    isRouteMap={false}
                                    data={data}
                                />
                            </View>
                        )
                    })
                }
            </Swiper>
        </View>
    ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size='large' color='blue' />
            </View>
        )
}


// last / fourth

const RouteStep = ({ navigation, route }) => {

    let mapRef = useRef(null);
    const { data, _coords, pickupDetail, type } = route.params;
    const { amount } = data;
    console.log('count of map to render :: ', amount);
    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders);

    const isFocused = useIsFocused();
    console.log('coordinate :: ', _coords);

    const mapFitToCoordinates = (coords) => {
        regionChangeHandler(coords);
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
                },
                animated: true
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

    const regionChangeHandler = (coords) => {

        let { latitude, longitude } = coords;

        console.log('region changed, coords:::', coords);
        console.log('position :: ', _coords.latitude, _coords.longitude);

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
    }
    let swiperRef = useRef(null);

    const swipeRight = (index) => {
        swiperRef.scrollBy(index, true)
    }

    return _coords !== 0 ? (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <Swiper scrollEnabled={true} ref={(ref) => swiperRef = ref} bounces={true} loadMinimalLoader={<ActivityIndicator />} showsPagination={false} loop={false}>
                {
                    orders.orders.map((v, i) => {
                        console.log('order item :: ', v);
                        return (
                            <View key={i} style={{ flex: 1, position: 'relative' }}>
                                <MapView
                                    initialRegion={{
                                        latitude: _coords.latitude,
                                        longitude: _coords.longitude,
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005
                                    }}
                                    onLayout={() => mapFitToCoordinates(v.coords)}
                                    pitchEnabled={false}
                                    scrollEnabled={false}
                                    zoomEnabled={false}
                                    rotateEnabled={false}
                                    ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true}>

                                    <MapView.Marker identifier="dari" coordinate={{ latitude: _coords.latitude, longitude: _coords.longitude }} />
                                    <MapView.Marker identifier="ke" coordinate={{ latitude: v.coords.latitude, longitude: v.coords.longitude }} />
                                </MapView>

                                <RouteModal
                                    navigation={navigation}
                                    swipeHandler={swipeRight}
                                    index={i}
                                    totalIndex={amount}
                                    modalHeight={regionChange}
                                    isRegionRunning={isRegionMoving}
                                    coordinate={_coords}
                                    distance={distance}
                                    targetCoord={coords}
                                    type={type}
                                    pickupDetail={pickupDetail}
                                    isRouteMap={true}
                                    penerima={v.to.contact_name}
                                    nohp={v.to.phone}
                                    barang={v.send_item}
                                    alamat={v.address_detail} />
                            </View>

                        )
                    })
                }
            </Swiper>
        </View>
    ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size='large' color='blue' />
            </View>
        )
}


//second
const PickupOrReceiverScreen = ({ navigation, route }) => {

    let mapRef = useRef(null);

    const { data, userData, coordinate } = route.params;
    const { amount } = data;
    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    console.log('positions :: ', coordinate.coords);

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

        console.log('Route params data :: ', data);
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

    let [coords, setCoords] = useState({});

    let [distance, setDistance] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <View key={1} style={{ flex: 1, position: 'relative' }}>
                <MapView
                    initialRegion={{
                        latitude: coordinate.coords.latitude,
                        longitude: coordinate.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                    onLayout={() => mapFitToCoordinates()}
                    ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true}>
                    <MapView.Marker
                        identifier='Tujan'
                        title='Lokasi Mu'
                        description='Lokasi mu sekarang ini.'
                        coordinate={coordinate.coords}
                        key={2}
                    />
                </MapView>
                <PickupOrReceiverModal
                    navigation={navigation}
                    index={0}
                    totalIndex={amount}
                    coordinate={coordinate}
                    params={route.params}
                    userData={userData} />
            </View>
        </View>
    )
}

export {
    Send,
    SendStep,
    PickupOrReceiverScreen,
    RouteStep
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