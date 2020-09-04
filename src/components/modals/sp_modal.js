import React, { useRef } from 'react';
import { Modalize } from 'react-native-modalize'
import {
    View,
    Text,
    TextInput,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const SendPackageModal = ({ index }) => {
    const modalizeRef = useRef(null);
    let { width, height } = Dimensions.get('window');
    const modalContent = () => {
        return (
            <View style={{ flex: 1, backgroundColor:'white' }}>
                <View style={{
                    padding: 16
                }}>
                    <Text style={{ fontSize: 25, fontWeight: '600', letterSpacing: 0.4 }}>Package {index + 1}</Text>
                    
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Input Alamat</Text>
                        <View style={{ padding: 6, marginTop: 4, borderRadius: 5, borderWidth: 1, borderColor: 'silver' }}>
                            <TextInput placeholder={'test'}/>
                        </View>
                    </View>

                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Detail Alamat</Text>
                        <View style={{ padding: 6, marginTop: 4, borderRadius: 5, borderWidth: 1, borderColor: 'silver' }}>
                            <TextInput placeholder={'e.g dekat patung kuda di taman samarendah'}/>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Penerima (No. HP)</Text>
                        <View style={{ padding: 6, marginTop: 4, borderRadius: 5, flexDirection:'row', borderWidth: 1, borderColor: 'silver' }}>
                            <TextInput style={{
                                width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 30,
                                height:'100%',
                            }} placeholder={'e.g Nona Srikaya'}/>
                            <View style={{ padding: 6, justifyContent:'center',alignItems:'center', borderWidth: 1, borderRadius: 4, width: 40 }}>
                                <Icon name='call-outline' size={20}/>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Penerima (Nama Lengkap)</Text>
                        <View style={{ padding: 6, marginTop: 4, borderRadius: 5, flexDirection:'row', borderWidth: 1, borderColor: 'silver' }}>
                            <TextInput style={{
                                width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 30,
                                height:'100%',
                            }} placeholder={'e.g Nona Srikaya'}/>
                            <View style={{ padding: 6, justifyContent:'center',alignItems:'center', borderWidth: 1, borderRadius: 4, width: 40}}>
                                <Icon name='call-outline' size={20}/>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Mau Ngirim Apa ?</Text>
                        <View style={{ padding: 6, marginTop: 4, borderRadius: 5, flexDirection:'row', borderWidth: 1, borderColor: 'silver' }}>
                            <TextInput style={{
                                height:'100%',
                            }} placeholder={'e.g nasi goreng ayam, ayam kecap, nasi bungkus'}/>
                        </View>
                    </View>
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