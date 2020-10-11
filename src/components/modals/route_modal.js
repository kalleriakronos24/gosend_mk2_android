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
import * as geolib from 'geolib';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';


export const RouteModal = ({ index,
    modalHeight,
    isRegionRunning,
    swipeHandler,
    totalIndex,
    navigation,
    coordinate,
    distance,
    targetCoord,
    type,
    pickupDetail,
    isRouteMap,
    alamat,
    penerima,
    nohp,
    barang,
    ongkirz
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
    console.log('order Count ', count);
    let [mHeight, setMHeight] = useState(modalHeight);
    const orderReducer = useSelector(state => state.orders);
    const coordinateReducer = useSelector(state => state.coordinate);

    const dispatch = useDispatch();

    let [selectedTipe, setSelectedTipe] = useState(type);

    const nextScreenHandler = (id) => {

        let idx = index + 1;

        // const ongkir = distance < 5000 ? 10000 : (Math.round((distance / 1000) / 5) * 5000) + 5000;
        // const dist = Math.round(distance / 1000);

        // dispatch({ type: 'update_distance', id : index, distance : dist, ongkir: ongkir });

        if (Number(idx) !== Number(totalIndex)) {
            swipeHandler(idx, true);
        } else {
            navigation.push('redirect_screen');
        };
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Delivery {index + 1}</Text>
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
                                            </View>
                                            <Text style={{ fontSize: 14 }}>Gg. Kasah no.11, Sungai Kapih, Kec. Sambutan, Samarinda, Kalimantan Timur, Indonesia.</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                    }

                    {
                        isRouteMap ? (
                            <>
                                <View style={{ paddingTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, letterSpacing: .5 }}>Jarak : </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{distance + ' km'}</Text>
                                </View>
                                <View style={{ paddingTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, letterSpacing: .5 }}>Ongkir : </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Rp.{ongkirz},-</Text>
                                </View>
                            </>
                        ) : null
                    }
                    <View style={{ paddingTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, letterSpacing: .5 }}>{selectedTipe === 'antar' ? 'Kirim' : 'Ambil'} paket {selectedTipe === 'antar' ? 'ke' : 'dari'} alamat ini : </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', textDecorationLine: 'underline' }}>Iya</Text>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight:'bold', letterSpacing: .5 }}>Detail Alamat</Text>
                        <View style={{ padding: 17 }}>
                            <Text>{alamat}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight:'bold', letterSpacing: .5 }}>{selectedTipe === 'antar' ? 'Penerima Barang' : 'Pengirim Barang'}</Text>
                        <View style={{ padding: 17 }}>
                            <Text>{penerima}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight:'bold', letterSpacing: .5 }}>{selectedTipe === 'antar' ? 'Penerima No.HP' : 'Pengirim No.HP'}</Text>
                        <View style={{ padding: 17 }}>
                            <Text>{nohp}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight:'bold', letterSpacing: .5 }}>{selectedTipe === 'antar' ? 'Barang yg dikirim' : 'Barang yg mau diambil'}</Text>
                        <View style={{ padding: 17 }}>
                            <Text>{barang}</Text>
                        </View>
                    </View>

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