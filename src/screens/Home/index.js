import React, { useState, useEffect } from 'react'
import { View, Text, StatusBar, ScrollView, ActivityIndicator, Touchable, TouchableOpacity} from 'react-native'
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
const Home = ({ navigation }) => {
    const barHeight = StatusBar.currentHeight;
    let [index, setIndex] = useState(0);
    const dispatch = useDispatch();

    const logoutHandler = async () => {
		console.log('logged out');
		dispatch({ type: 'LOGOUT' });
		await AsyncStorage.removeItem('LOGIN_TOKEN');
    };
    
    useEffect(() => {

RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
  .then(data => {

    if(data === 'already-enabled')
        return
    console.log('is this running ?')
    // The user has accepted to enable the location services
    // data can be :
    //  - "already-enabled" if the location services has been already enabled
    //  - "enabled" if user has clicked on OK button in the popup
  }).catch(err => {
      console.log(err.msg);
    // The user has not accepted to enable the location services or something went wrong during the process
    // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
    // codes : 
    //  - ERR00 : The user has clicked on Cancel button in the popup
    //  - ERR01 : If the Settings change are unavailable
    //  - ERR02 : If the popup has failed to open
  });
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
            <StatusBar animated translucent={true} barStyle='default' backgroundColor='transparent'/>
            <Swiper bounces={true} loadMinimalLoader={<ActivityIndicator/>} showsPagination={false} loop={false} index={1}>
                    <View style={{ flex: 1, paddingTop: barHeight }}>
                        <View style={{ justifyContent:'space-between', alignItems:'center', paddingHorizontal: 32, paddingTop: 20, flexDirection:'row' }}>
                            <Icon name="menu-outline" size={20}/>
                            <Text style={{ fontSize: 19 }}>Dummy Screen</Text>
                            <TouchableOpacity activeOpacity={0.3}>
                                <Icon name="arrow-forward-outline" size={20}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Main Feature */}
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 300, backgroundColor:'#1F4788', borderBottomRightRadius: 70, paddingTop:barHeight }}>

                        <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection:'row', justifyContent:'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="location-outline" size={20} color='white'/>
                                <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing:0.7, color:'white'}}>(Nama Lokasi Sekarang)</Text>
                            </View>
                            <View style={{ flexDirection:'row' }}>
                                <View style={{ marginHorizontal: 10 }}>
                                    <Icon name="search-outline" size={20} color="white"/>
                                </View>
                                <Icon name="basket-outline" size={20} color='white'/>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 32, justifyContent:'center', alignItems:'center', flex: 1}}>
                            <Text style={{ fontSize: 30, fontWeight:'600', letterSpacing: 0.5, color: 'white' }}>Test App is Here!</Text>
                        </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ backgroundColor:'#1F4788', height: 70, width: 70, position:'absolute', zIndex: -10, borderBottomRightRadius: 200 }}/>
                            <View style={{ backgroundColor:'white', borderTopLeftRadius: 70, flex: 1, zIndex: 10 }}>
                                <View style={{ paddingTop: 20, paddingHorizontal: 32 }}>
                                    <View style={{ padding: 16 }}>
                                        <Text style={{ fontSize: 23, letterSpacing: 0.5, fontWeight: '600' }}>Our Service</Text>

                                        <View style={{ padding: 10, flexDirection: 'row', justifyContent:'space-between' }}>
                                                <View style={{ backgroundColor:'#1F4788',padding: 6, height: 150, width: 150, justifyContent:'center', alignItems:'center', borderBottomLeftRadius: 20, borderTopRightRadius: 20 }}>
                                                        <View style={{ padding: 6, height: 55, width: 55, borderRadius: 20, borderWidth: 1, justifyContent:'center', alignItems:'center', borderColor:'white' }}>
                                                            <Icon name="bicycle-outline" size={35} color='white'/>
                                                        </View>
                                                        <View style={{ paddingTop: 20 }}>
                                                            <Text style={{ fontSize: 17, letterSpacing: .5, fontWeight: '500', color:'white' }}>TEST SEND</Text>
                                                        </View>
                                                </View>
                                                <TouchableOpacity activeOpacity={0.4} onPress={() => navigation.navigate('send') } style={{ padding: 16, justifyContent:'center', alignItems:'center' }}>
                                                    <Icon size={40} name="arrow-forward-circle-outline"/>
                                                </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={{ padding: 16 }}>
                                        <Text style={{ fontSize: 23, letterSpacing: 0.5, fontWeight: '600' }}>About Our Service</Text>
                                        <View style={{ padding: 6 }}>
                                                <Text style={{ letterSpacing: 0.4, fontSize: 16 }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                                </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Account Page including check order */}
                    <View style={{ flex: 1, paddingTop: barHeight }}>
                    <View style={{ paddingHorizontal: 32, paddingTop: 20, flexDirection:'row', justifyContent:'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="person-outline" size={20}/>
                                <Text style={{ marginLeft: 10, fontSize: 18, letterSpacing:0.7}}>My Account</Text>
                            </View>
                            <View style={{ flexDirection:'row' }}>
                                <View style={{ marginHorizontal: 10 }}>
                                    <Icon name="settings-outline" size={20}/>
                                </View>
                                <TouchableOpacity activeOpacity={0.5} onPress={() => logoutHandler()}>
                                    <Icon name="log-out-outline" size={20}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Swiper>
        </View>
    )
}

export default Home
