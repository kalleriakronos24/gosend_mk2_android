import React, { useRef } from 'react';
import { Modalize } from 'react-native-modalize'
import {
    View,
    Text
} from 'react-native';

export const SendPackageModal = ({ index }) => {
    const modalizeRef = useRef(null);

    const modalContent = () => {
        return (
            <View style={{ flex: 1, backgroundColor:'white' }}>
                <View style={{
                    padding: 16
                }}>
                    <Text style={{ fontSize: 25, fontWeight: '600', letterSpacing: 0.4 }}>Package {index + 1}</Text>
                </View>
            </View>
        )
    }

    return (
        <Modalize
            ref={modalizeRef}
            alwaysOpen={300}
            handlePosition={'inside'}
            modalHeight={600}
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