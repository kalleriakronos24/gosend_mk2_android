import React, { useRef, useState } from 'react';
import { Modalize } from 'react-native-modalize'
import {
    View,
    Text,
    TextInput,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    PermissionsAndroid,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { selectContactPhone } from 'react-native-select-contact';
export const SendPackageModal = ({ index, modalHeight, isRegionRunning }) => {

    const modalizeRef = useRef(null);
    let { width, height } = Dimensions.get('window');
    let [phone, setPhone] = useState('');
    let [contactName, setContactName] = useState('')

    const selectContactHandler = () => {
        if(Platform.OS === 'android'){
            const granted = PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title : 'Test App Read Contact Permission',
                    message : 'Test App needs access to your contact',
                    buttonPositive : 'OK',
                    buttonNegative: 'CANCEL'
                }
            ).then(res => {
                if(res)
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
    
            if(granted === PermissionsAndroid.RESULTS.GRANTED){ 
                console.log('you can now access contact');
            }else{
                console.log(' user do not have a grant access to access contact ');
            }
        }else{
            console.log('non Android User can access contact');
        }
    }

    const modalContent = () => {
        return (
            <View style={{ flex: 1, backgroundColor:'white' }}>
                <View style={{
                    padding: 16,
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Delivery {index + 1} details</Text>
                    {
                        isRegionRunning ? (
                            <View style={{ paddingTop: 15, paddingHorizontal : 4, justifyContent:'center', alignItems:'center' }}>
                                <ActivityIndicator color='blue' size='large'/>
                            </View>
                        ) : (
                        <View style={{ paddingTop: 15, paddingHorizontal: 4 }}>
                            <View style={{ flexDirection: 'row', alignItems:'center', paddingHorizontal: 10 }}>
                                <Icon size={30} color='red' name='location-sharp'/>
                                <View style={{ justifyContent:'center', flexDirection:'column', margin: 6 }}>
                                    <View style={{ justifyContent:'space-between', flexDirection:'row'}}>
                                        <Text style={{ fontSize: 17.2, fontWeight:'bold' }}>Gg. Kasah 11 no.1</Text>
                                        <View style={{ padding: 2 , borderWidth: 0.4, borderColor: 'blue', borderRadius: 5, width: 60 }}>
                                            <Text style={{ fontSize: 16, fontWeight:'bold', textAlign:'center', color:'blue' }}>Edit</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 14 }}>Gg. Kasah no.11, Sungai Kapih, Kec. Sambutan, Samarinda, Kalimantan Timur, Indonesia.</Text>
                                </View>
                            </View>
                        </View>
                        )
                    }
                   

                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Detail Alamat</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, borderWidth: 1, borderColor: 'silver', height: 45 }}>
                            <TextInput style={{ height: '100%' , width: '100%'}} placeholder={'e.g dekat patung kuda di taman samarendah'}/>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Penerima (Nama Lengkap)</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection:'row', borderWidth: 1, borderColor: 'silver', height: 45 }}>
                            <TextInput 
                            value={contactName}
                            style={{
                                width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 20,
                                height:'100%',
                            }} placeholder={'e.g Nona Srikaya'}/>
                            <TouchableOpacity activeOpacity={0.3} onPress={() => selectContactHandler()} style={{ padding: 6, justifyContent:'center',alignItems:'center', borderRadius: 4, width: 40 }}>
                                <Icon name='call-outline' size={16}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Penerima (No. HP)</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection:'row', borderWidth: 1, borderColor: 'silver', height: 45 }}>
                            <TextInput 
                            value={phone}
                            style={{
                                width: width - ((16 * 2) + (6 * 2) + (6 * 2)) - 20,
                                height:'100%',
                            }} placeholder={'e.g Nona Srikaya'}/>
                            <TouchableOpacity activeOpacity={0.3} style={{ padding: 6, justifyContent:'center',alignItems:'center', borderRadius: 4, width: 40}}>
                                <Icon name='call-outline' size={16}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ fontSize: 16, letterSpacing: 0.5 }}>Mau Ngirim Apa ?</Text>
                        <View style={{ marginTop: 4, borderRadius: 5, flexDirection:'row', borderWidth: 1, borderColor: 'silver', height: 45 }}>
                            <TextInput style={{
                                height:'100%',
                            }} placeholder={'e.g nasi goreng ayam, ayam kecap, nasi bungkus'}/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    console.log(modalHeight);
    return (
        <Modalize
            ref={modalizeRef}
            alwaysOpen={modalHeight ? modalHeight : 300}
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