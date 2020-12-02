import React, { useState, useEffect } from 'react';
import {
    View,
    Text
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {
    BallIndicator,
} from 'react-native-indicators';

const NetworkIndicator = () => {


    let [isConnected, setIsConnected] = useState(true);


    useEffect(() => {

        NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        })

    }, []);

    return isConnected ? null :
        (
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15, flexDirection: 'row' }}>
                <BallIndicator color="red" size={20} />
                <Text style={{ fontSize: 17, color:'black' }}>Tidak ada koneksi internet.</Text>
            </View>
        )
};

export default NetworkIndicator;