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
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { selectContactPhone } from 'react-native-select-contact';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

export const SendPackageModal = ({ index,
    modalHeight,
    isRegionRunning,
    swipeHandler,
    totalIndex,
    navigation,
    coordinate
}) => {

    const modalizeRef = useRef(null);
    let { width, height } = Dimensions.get('window');
    let [phone, setPhone] = useState('');
    let [contactName, setContactName] = useState('')
    let [order, setOrder] = useState([]);
    let [addrDetail, setAddrDetail] = useState('');
    let [orderDetail, setOrderDetail] = useState('');
    let memoized_modal_height = modalHeight;

    let [mHeight, setMHeight] = useState(modalHeight);
    const orderReducer = useSelector(state => state.orders);

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
        }
    }
    const orderDetailsHandler = () => {
        console.log('is this even running lmao');
        setMHeight(height);
    }
    const onFocusLeaveHandler = () => {
        setMHeight(memoized_modal_height);
    }

    const nextScreenHandler = () => {

        let idx = index + 1;

        let { latitude, longitude } = coordinate;
        let obj = {
            id: index,
            coords: {
                latitude,
                longitude
            },
            ordered_by: 'test',
            to: {
                contact_name: contactName,
                phone,
                set_this_as_recipient: true
            },
            address_detail: addrDetail,
            send_item: orderDetail,
            date: moment().locale('id-ID').format('DD MMMM YYYY hh:mm'),
            order_id: moment().locale('id-ID').format('DD/MM/YY') + '/' + Math.round(Math.random() * 9999)
        }

        if (Number(idx) !== Number(totalIndex)) {

            dispatch({ type: 'add', item: obj });
            swipeHandler(idx, true);
        } else {
            navigation.push('find_courier', {
                data: obj
            });
        }
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Delivery {index + 1} details</Text>
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
                                                <Text style={{ fontSize: 17.2, fontWeight: 'bold' }}>Gg. Kasah 11 no.1</Text>
                                                <TouchableOpacity activeOpacity={.4} onPress={() => console.log(orderReducer)} style={{ padding: 2, borderWidth: 0.4, borderColor: 'blue', borderRadius: 5, width: 60, marginRight: 10 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: 'blue' }}>Edit</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={{ fontSize: 14 }}>Gg. Kasah no.11, Sungai Kapih, Kec. Sambutan, Samarinda, Kalimantan Timur, Indonesia.</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                    }
                    
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Detail Alamat</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, borderWidth: 1, borderColor: 'silver', height: 45, backgroundColor: '#F7F7F9' }}>
                            <TextInput value={addrDetail} onChangeText={(e) => setAddrDetail(e)} style={{ height: '100%', width: '100%' }} placeholder={'e.g dekat patung kuda di taman samarendah'} />
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Penerima (Nama Lengkap)</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection: 'row', borderWidth: 1, borderColor: 'silver', height: 50, padding: 6, backgroundColor: '#F7F7F9' }}>
                            <TextInput
                                value={contactName}
                                style={{
                                    width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 24,
                                    height: '100%'
                                }} placeholder={'e.g Nona Srikaya'} />
                            <TouchableOpacity activeOpacity={0.3} onPress={() => selectContactHandler()} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 4, width: 40, backgroundColor: 'yellow', height: '100%' }}>
                                <Icon name='call-outline' size={16} color='blue' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Penerima (No. HP)</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection: 'row', borderWidth: 1, borderColor: 'silver', height: 45, backgroundColor: '#F7F7F9' }}>
                            <TextInput
                                value={phone}
                                style={{
                                    width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 20,
                                    height: '100%'
                                }} placeholder={'e.g +6289690636990'} />
                            <TouchableOpacity activeOpacity={0.3} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', borderRadius: 4, width: 40 }}>
                                <Icon name='call-outline' size={16} color='blue' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Mau Ngirim Apa ?</Text>
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
                    </View>
                    <TouchableOpacity onPress={() => nextScreenHandler()} style={{ padding: 16, borderRadius: 5, backgroundColor: 'blue', marginTop: 40 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
    console.log(modalHeight);
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