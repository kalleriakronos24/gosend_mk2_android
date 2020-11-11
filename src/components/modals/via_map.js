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

export const ViaMap = ({
    navigation,
    isRouteMap,
    params,
    coordinate
}) => {

    const modalizeRef = useRef(null);
    let { width, height } = Dimensions.get('window');
    let [phone, setPhone] = useState('');
    let [contactName, setContactName] = useState('');
    let [addrDetail, setAddrDetail] = useState('');
    let [orderDetail, setOrderDetail] = useState('');
    const orderReducer = useSelector(state => state.orders);

    const { ongkir, distance } = orderReducer;



    useEffect(() => {
        console.log('params :: ', params);
    }, [])

    const modalContent = () => {
        return (
            <KeyboardAvoidingView removeClippedSubviews={true}
                style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{
                    padding: 16,
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Kirim barang ke</Text>
                    <View>
                        <TouchableOpacity onPress={() => navigation.push('send_step', { data: params, _coords : coordinate })} activeOpacity={.8} style={{ borderRadius: 8, borderWidth: 1, padding: 12, marginTop: 14 }}>
                            <Text style={{ color: 'silver' }}>Jl. Santi Murni perum pkl</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, padding: 6 }}>Pilih dari Peta</Text>
                    </View>
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