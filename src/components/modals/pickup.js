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
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { selectContactPhone } from 'react-native-select-contact';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as geolib from 'geolib';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';


export const PickupOrReceiverModal = ({ index,
    modalHeight,
    params,
    navigation,
    userData,
    coordinate }) => {

    const { data } = params;
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
    let [mHeight, setMHeight] = useState(modalHeight);
    const dispatch = useDispatch();

    let [selectedTipe, setSelectedTipe] = useState('antar');

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
        }
    }

    const orderDetailsHandler = () => {
        setMHeight(height);
    }
    const onFocusLeaveHandler = () => {
        setMHeight(memoized_modal_height);
    }

    const pickupDetail = {
        coords : coordinate.coords,
        detailAlamat : addrDetail
    }

    const nextScreenHandler = () => {
        navigation.navigate('send_step', { data: data, _coords : coordinate.coords, pickupDetail, type : selectedTipe })
    }

    useEffect(() => {

    }, [addrDetail, phone, contactName, orderDetail])

    const modalContent = () => {
        return (
            <KeyboardAvoidingView removeClippedSubviews={true}
                style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{
                    padding: 16,
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedTipe === 'antar' ? 'Detail Pengambilan' : 'Detail Penerima'}</Text>
                    <View style={{ paddingTop: 15, paddingHorizontal: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <Icon size={30} color='red' name='location-sharp' />
                            <View style={{ justifyContent: 'center', flexDirection: 'column', margin: 6 }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 17.2, fontWeight: 'bold' }}>Gg. Kasah 11 no.1</Text>
                                    <TouchableOpacity activeOpacity={.4} style={{ padding: 2, borderWidth: 0.4, borderColor: 'blue', borderRadius: 5, width: 60, marginRight: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'blue' }}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 14 }}>Gg. Kasah no.11, Sungai Kapih, Kec. Sambutan, Samarinda, Kalimantan Timur, Indonesia.</Text>
                            </View>
                        </View>
                    </View>
                    {
                        count === '1' ? (
                            <View style={{ paddingTop: 15 }}>
                                <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Tipe</Text>
                                <View style={{ marginTop: 4, borderRadius: 5, borderWidth: 1, borderColor: 'silver', height: 45, backgroundColor: '#F7F7F9' }}>
                                    <Picker selectedValue={selectedTipe} onValueChange={(v) => setSelectedTipe(v)} style={{ height: '100%', width: '100%' }}>
                                        <Picker.Item label="Antar" value="antar" />
                                        <Picker.Item label="Ambil" value="ambil" />
                                    </Picker>
                                </View>
                            </View>
                        ) : null
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
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>{selectedTipe === 'antar' ? 'Pengirim' : 'Penerima'}</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection: 'row', borderWidth: 1, borderColor: 'silver', height: 50, padding: 6, backgroundColor: '#F7F7F9', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text
                                style={{
                                    textAlign: 'center'
                                }}>{userData.name}</Text>
                            <TouchableOpacity disabled={true} activeOpacity={0.3} onPress={() => selectContactHandler()} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 4, width: 40, height: '100%' }}>
                                <Icon name='call-outline' size={16} color='blue' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>{selectedTipe === 'antar' ? 'Pengirim' : 'Penerima'} (No. HP)</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection: 'row', borderWidth: 1, borderColor: 'silver', height: 45, backgroundColor: '#F7F7F9', alignItems: 'center', justifyContent: 'space-between', padding: 6 }}>
                            <Text
                                style={{
                                    textAlign: 'center'
                                }}>{userData.no_hp}</Text>
                            <TouchableOpacity disabled={true} activeOpacity={0.3} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 4, width: 40 }}>
                                <Icon name='call-outline' size={16} color='blue' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ marginTop: 7 }}>*Note : Harap isi detail alamat karena terkadang google map tidak akurat dalam melacak lokasi anda.</Text>
                    <TouchableOpacity onPress={() => ToastAndroid.showWithGravity('Fitur non user penerima / pengirim belum tersedia', ToastAndroid.LONG, ToastAndroid.BOTTOM)} activeOpacity={.8} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 17 }}>Tetapkan saya sebagai {selectedTipe === 'antar' ? 'pengirim ' : 'penerima '}paket</Text>
                        <Icon style={{ marginLeft: 10 }} name="checkmark-circle-outline" size={26} color='blue' />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={addrDetail === '' ? true : false} onPress={() => nextScreenHandler()} style={{ padding: 16, borderRadius: 5, backgroundColor: addrDetail === '' ? 'red' : 'blue', marginTop: 40 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }

    return (
        <Modalize
            ref={modalizeRef}
            alwaysOpen={mHeight ? mHeight : 300}
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