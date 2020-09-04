import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StatusBar, Image, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import MapView, { MarkerAnimated, AnimatedRegion } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { SendPackageModal } from '../../components/modals/sp_modal';
import Geolocation from '@react-native-community/geolocation';
Geocoder.init('AIzaSyCbpEHfzwBGfdSIfbFCODyH_muffddTZvg');

const Send = ({ navigation }) => {
    const { navigate, push } = navigation;
    const { width, height } = Dimensions.get('window');
    let [amount, setAmount] = useState('1');
    console.log('Current Device window height is ', height);

    return (
        <View style={{ flex: 1, backgroundColor:'white' }}>
            <StatusBar translucent backgroundColor='transparent' barStyle='default'/>
            <View style={{ flex: 1 }}>
                <View style={{ width: '100%', height: height - 500 }}>
                    <Image source={require('../../assets/banner/q3.png' )} style={{ alignSelf: 'stretch', width: '100%', height: height - 500 }}/>
                </View>
                <View style={{ padding: 16 }}>
                    <Text style={{ fontSize: 23, fontWeight:'600', letterSpacing: 0.5 }}>(Service title here)</Text>


                    <View style={{ paddingTop: 15 }}>
                            <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Enter the amount of package u want to send.</Text>

                            <View style={{ padding: 6, borderWidth: 1, marginTop: 8, borderRadius: 10, height: 50 }}>
                                <TextInput keyboardType='numeric' value={amount} onChangeText={(v) => v > 10 ? setAmount(10) : setAmount(v)} placeholder='default 1; max 10'/>
                            </View> 
                    </View>
                    <View style={{ paddingTop: 15 }}>
                            <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>From (your current location).</Text>

                            <View style={{ padding: 6, borderWidth: 1, marginTop: 8, borderRadius: 10, height: 50 }}>
                                <TextInput keyboardType='numeric' value={amount} onChangeText={(v) => v > 10 ? setAmount(10) : setAmount(v)} placeholder='default 1; max 10'/>
                            </View> 
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => push('send_step', { package_amount : amount })} style={{ position:'absolute', right: 0, bottom: 0, zIndex: 10, marginRight: 40, marginBottom: 40, justifyContent:'center', alignItems:'center' }}>
                <View style={{ padding : 8, height: 60, width: 60, justifyContent:'center', alignItems:'center', borderRadius: 30, backgroundColor:'#1F4788' ,shadowColor: "#000" }}>
                    <Icon name='arrow-forward-outline' size={40} color='white' />
                </View>
            </TouchableOpacity>
        </View>
    )
}


const SendStep = ({ navigation, route }) => {
    let mapRef = useRef(null);
    const { package_amount } = route.params;
    const mapFitToCoordinate = () => {}
    const { width, height } = Dimensions.get('window');

    const NextButton = () => (
       <View style={{ marginTop: height - 100, marginRight: 10 }}>
           <View style={{ padding: 6, justifyContent:'center', alignItems:'center', borderRadius: 30, height: 60, width: 60, backgroundColor: 'red' }}>
               <Icon name='arrow-forward-outline' color='white' size={30}/>
           </View>
       </View>
    )
    const PrevButton = () => (
        <View style={{ marginTop: height - 100, left: 10 }}>
           <View style={{ padding: 6, justifyContent:'center', alignItems:'center', borderRadius: 30, height: 60, width: 60, backgroundColor: 'red' }}>
               <Icon name='arrow-back-outline' color='white' size={30}/>
           </View>
       </View>
    )
    let region = {
        latitude : -0.454063,
        longitude : 117.167437,
        longitudeDelta: 0.005,
        latitudeDelta: 0.005
    }
    let [pos, setPos] = useState(0);

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
        Geolocation.getCurrentPosition(
            (position) => {
                setPos(pos = position.coords)
            },
            (err) => {
                console.log(err)
            },
            { enableHighAccuracy: false, distanceFilter: 100, timeout: 8000 }
        )
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor:'white' }}>
            <StatusBar animated translucent={true} barStyle='default' backgroundColor='transparent'/>
            <Swiper showsButtons={true} nextButton={<NextButton/>} prevButton={<PrevButton/>} bounces={true} loadMinimalLoader={<ActivityIndicator/>} showsPagination={false} loop={false}>
                    {
                        Array.from({ length : package_amount }).map((v,i) => {
                            return (
                                <>
                                <View style={{ flex: 1 }} key={i}> 
                                    <MapView
                                    initialRegion={region}
					                onLayout={() => mapFitToCoordinates()}
                                    ref={(ref) => mapRef = ref} style={{ flex: 1 }} zoomEnabled={true} loadingEnabled={true}>
                                        <MapView.Marker
                                        draggable coordinate={pos === 0 ? region : pos} identifier='tujuan' title='tujuan'/>
                                    </MapView>
                                </View>
                                <SendPackageModal index={i}/>
                                </>
                            )
                        })
                    }
            </Swiper>
        </View>
    )
}

export {
    Send,
    SendStep
};
