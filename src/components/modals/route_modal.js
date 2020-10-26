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
import { formatRupiah } from '../../utils/functionality';

export const RouteModal = ({ index,
    modalHeight,
    swipeHandler,
    totalIndex,
    navigation,
    isRouteMap,
}) => {

    const modalizeRef = useRef(null);
    let { width, height } = Dimensions.get('window');
    let [phone, setPhone] = useState('');
    let [contactName, setContactName] = useState('');
    let [addrDetail, setAddrDetail] = useState('');
    let [orderDetail, setOrderDetail] = useState('');
    const orderReducer = useSelector(state => state.orders);

    const { ongkir, distance } = orderReducer;

    const nextScreenHandler = (id) => {

        // const ongkir = distance < 5000 ? 10000 : (Math.round((distance / 1000) / 5) * 5000) + 5000;
        // const dist = Math.round(distance / 1000);

        // dispatch({ type: 'update_distance', id : index, distance : dist, ongkir: ongkir });

            navigation.push('confirm_order');

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
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Estimasi Jarak dan Ongkir</Text>

                    {
                        isRouteMap ? (
                            <>
                                <View style={{ paddingTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, letterSpacing: .5 }}>Jarak : </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{distance + ' km'}</Text>
                                </View>
                                <View style={{ paddingTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, letterSpacing: .5 }}>Ongkir : </Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{formatRupiah(String(ongkir), "Rp. ")},-</Text>
                                </View>
                            </>
                        ) : null
                    }

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
            alwaysOpen={200}
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