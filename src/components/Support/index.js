import React from 'react';

import {
    View,
    Text
} from 'react-native';


const SupportSection = () => {

    return (
        <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, letterSpacing: 0.5, fontWeight: '600', textAlign: 'center' }}>{'\u00A9'}Copyright Ongqir 2020. All Rights Reserved</Text>
            <Text style={{ fontSize: 17, letterSpacing: 0.5, fontWeight: '600', textAlign: 'center' }}>Support : 0896 9063 9639 | Whatsapp</Text>
        </View>
    )
};

export default SupportSection;