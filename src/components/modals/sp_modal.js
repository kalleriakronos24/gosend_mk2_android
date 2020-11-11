import React, { useRef, useState, useEffect, memo } from 'react';
import { Modalize } from 'react-native-modalize'
import {
    View,
    Text,
    TextInput,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    KeyboardAvoidingView,
    StatusBar,
    ToastAndroid,
    Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { selectContactPhone } from 'react-native-select-contact';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as geolib from 'geolib';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';


export const SendPackageModal = ({ index,
    modalHeight,
    isRegionRunning,
    navigation,
    coordinate,
    targetCoord,
    isRouteMap,
    userData,
    address,
    namaGang
}) => {

    const modalizeRef = useRef(null);
    let { width, height } = Dimensions.get('window');
    let [phone, setPhone] = useState('');
    let [contactName, setContactName] = useState('')
    let [order, setOrder] = useState([]);
    let [addrDetail, setAddrDetail] = useState('');
    let [orderDetail, setOrderDetail] = useState('');
    let memoized_modal_height = modalHeight;
    const orderCount = useSelector(state => state.orders);
    const { count } = orderCount;
    let [mHeight, setMHeight] = useState(200);
    const orderReducer = useSelector(state => state.orders);
    const coordinateReducer = useSelector(state => state.coordinate);
    let [errMsg, setErrorMsg] = useState('');
    let [checked, setChecked] = useState(true);

    const dispatch = useDispatch();


    const selectContactHandler = () => {

        if (Platform.OS === 'android') {
            const granted = PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Test App Read Contact Permission',
                    message: 'Test App needs access to your contact',
                    buttonPositive: 'OK',
                    buttonNegative: 'CANCEL'
                }
            ).then(res => {
                if (res)
                    return selectContactPhone()
                        .then(selection => {
                            if (!selection) {
                                return null;
                            }
                            let { contact, selectedPhone } = selection;
                            console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
                            setContactName(contact.name);
                            setPhone(selectedPhone.number);
                        });
            })
                .catch(err => {
                    console.log('something went from when trying to granting access to read contact:: ', err);
                });

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('you can now access contact');
            } else {
                console.log(' user do not have a grant access to access contact ');
            }
        } else {
            console.log('non Android User can access contact');
        };


    }
    const orderDetailsHandler = () => {
        setMHeight(height);
    }
    const onFocusLeaveHandler = () => {
        setMHeight(200);
    }

    const nextScreenHandler = () => {

        let { latitude, longitude } = targetCoord;


        // PENGIRIM

        let obj = {
            coords: {
                latitude,
                longitude
            },
            address_detail: addrDetail,
            name: checked ? userData.name : contactName,
            phone: checked ? userData.no_hp : phone,
            address: address
        };

        // let check = orderReducer.orders.some((v, i) => i === index);
        // console.log(index === (idx - 1))
        // if (index === (idx - 1) && check) {
        //     navigation.navigate('route_step', { data: data, _coords: coordinate, pickupDetail });
        // }

        if (isRegionRunning) {
            Alert.alert('Pesan Sistem', 'Harap tunggu sampai kami me load data lokasi pilihan anda');
            return;
        }

        if (checked) {

            if (addrDetail === '') {
                Alert.alert('Pesan Sistem', 'Harap isi detail alamat terlebih dahulu untuk melanjutkan');
                return
            }

        } else if (checked === false && phone === '' || contactName === '' || addrDetail === '') {
            Alert.alert('Pesan Sistem', 'Harap isi semua field terlebih dahulu untuk melanjutkan');
            return
        };

        dispatch({ type: 'pengirim', pengirim: obj });

        navigation.navigate('pickup', { userData: userData, userCoordinate: coordinate, isPengirim: checked });
    };

    useEffect(() => {
        
    }, [addrDetail, phone, contactName, orderDetail]);

    const modalContent = () => {

        return (
            <KeyboardAvoidingView removeClippedSubviews={true}
                style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{
                    padding: 16,
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Detail Pengirim</Text>
                    {
                        isRegionRunning ? (
                            <View style={{ paddingTop: 15, paddingHorizontal: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator color='blue' size='large' />
                            </View>
                        ) : (
                                <View style={{ paddingTop: 15, paddingHorizontal: 4 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                                        <Icon size={30} color='red' name='location-sharp' />
                                        <View style={{ justifyContent: 'center', flexDirection: 'column', margin: 6 }}>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 17.2, fontWeight: 'bold' }}>{namaGang}</Text>
                                                <TouchableOpacity activeOpacity={.4} onPress={() => ToastAndroid.showWithGravity('Fitur ini belum tersedia', ToastAndroid.LONG, ToastAndroid.BOTTOM)} style={{ padding: 2, borderWidth: 0.4, borderColor: 'blue', borderRadius: 5, width: 60, marginRight: 10 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'blue' }}>Edit</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ fontSize: 14 }}>{address}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                    }

                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Detail Alamat</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, borderWidth: 1, borderColor: 'silver', height: 45, backgroundColor: '#F7F7F9' }}>
                            <TextInput
                                onFocus={() => orderDetailsHandler()}
                                onBlur={() => onFocusLeaveHandler()}
                                value={addrDetail} onChangeText={(e) => setAddrDetail(e)} style={{ height: '100%', width: '100%' }} placeholder={'e.g dekat patung kuda di taman samarendah'} />
                        </View>
                    </View>

                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Pengirim</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection: 'row', borderWidth: 1, borderColor: 'silver', height: 50, padding: 6, backgroundColor: '#F7F7F9' }}>
                            <TextInput
                                value={checked ? userData.name : contactName}
                                style={{
                                    width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 24,
                                    height: '100%'
                                }} placeholder={'e.g Nona Srikaya'}
                                onFocus={() => orderDetailsHandler()}
                                onBlur={() => onFocusLeaveHandler()}
                                onChangeText={(v) => setContactName(v)} />
                            <TouchableOpacity activeOpacity={0.3} disabled={checked ? true : false} onPress={() => selectContactHandler()} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 4, width: 40, height: '100%' }}>
                                <Icon name='person-outline' size={25} color='blue' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Pengirim (No. HP)</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection: 'row', borderWidth: 1, borderColor: 'silver', height: 45, backgroundColor: '#F7F7F9' }}>
                            <TextInput
                                value={checked ? userData.no_hp : phone}
                                style={{
                                    width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 20,
                                    height: '100%'
                                }} placeholder={'e.g +6289690636990'}
                                onFocus={() => orderDetailsHandler()}
                                onBlur={() => onFocusLeaveHandler()}

                                onChangeText={(v) => setPhone(v)} />
                            <TouchableOpacity disabled={checked ? true : false} onPress={() => selectContactHandler()} activeOpacity={0.3} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 4, width: 40 }}>
                                <Icon name='call-outline' size={25} color='blue' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Mau Kirim Apa ?</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection: 'row', borderWidth: 1, borderColor: 'silver', height: 70, backgroundColor: '#F7F7F9' }}>
                            <TextInput
                                value={orderDetail}
                                onFocus={() => orderDetailsHandler()}
                                onBlur={() => onFocusLeaveHandler()}
                                onChangeText={(v) => setOrderDetail(v)}
                                multiline={true} style={{
                                    height: '100%',
                                    width: '100%'
                                }} placeholder={'e.g nasi goreng ayam, ayam kecap, nasi bungkus'} />
                        </View>
                    </View> */}

                    <TouchableOpacity onPress={() => setChecked(!checked)} activeOpacity={.8} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 17 }}>Masukkan saya sebagai Pengirim </Text>
                        <Icon style={{ marginLeft: 10 }} name={`${checked ? "checkmark-circle-outline" : "ellipse-outline"}`} size={26} color='blue' />
                    </TouchableOpacity>
                    {errMsg === '' ? null : <Text>{errMsg}</Text>}
                    <TouchableOpacity onPress={() => nextScreenHandler()} style={{ padding: 16, borderRadius: 5, backgroundColor: 'blue', marginTop: 40 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }

    return (
        <Modalize
            ref={modalizeRef}
            alwaysOpen={mHeight}
            modalHeight={height - StatusBar.currentHeight}
            handlePosition='inside'
            scrollViewProps={{
                keyboardShouldPersistTaps: 'always',
                showsVerticalScrollIndicator: false
            }}
            modalStyle={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.45,
                shadowRadius: 16,
            }}
        >
            {modalContent()}
        </Modalize>
    )
}