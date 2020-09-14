import React, { useEffect, useCallback, useState } from 'react'
import { View, Text, Dimensions, ScrollView, KeyboardAvoidingView, Alert, Image } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import Checkbox from '@react-native-community/checkbox';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';

const Register = ({ navigation }) => {

    const { width, height } = Dimensions.get('window');

    let [email, setEmail] = useState('');
    let [name, setName] = useState('');
    let [alamat, setAlamat] = useState('');

    let [emailError, setEmailError] = useState(false);
    let [alamatError, setAlamatError] = useState(false);
    let [nameError, setNameError] = useState(false);

    let [emailErrMsg, setEmailErrMsg] = useState('');
    let [nameErrMsg, setNamaErrMsg] = useState('');
    let [alamatErrMsg, setAlamatErrMsg] = useState('');

    let data = {
        email,
        name,
        alamat
    }

    let emailValidation = email => {
        let reg = /^\w+([\,.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!reg.test(email)) {
            setEmailError(true)
            setEmailErrMsg('Email must be contain @ and must be a valid email')
        }

        setEmailError(false);
        setEmailErrMsg('');
        setEmail(email);
    }
    let [asDriver, setAsDriver] = useState(false);
    useEffect(() => {
        // fetch('http://192.168.43.178:8000/id', {
        //     method : 'GET',
        //     headers : {
        //         "Content-Type" : "application/json"
        //     }
        // })
        // .then(res => {
        //     return res.json();
        // })
        // .then(res => {
        //     Alert.alert('Result:: ',res.data);
        // })
        // .catch(err => {
        //     console.log('Err:: ',err);
        // })
    }, []);
    const navigateHandler = () => {
        return asDriver ? navigation.push('kurir_register', { data }) : navigation.push('password', { data });
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1, paddingTop: '30%', backgroundColor: 'white' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ paddingBottom: '10%' }}>
                    <Text style={{ fontSize: 30, fontWeight: '600' }}>Register</Text>
                </View>

                <View style={{ flexDirection: 'column' }}>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>Email</Text>
                        <View style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2) }}>
                            <TextInput value={email} onChangeText={(v) => emailValidation(v)} style={{ width: '100%' }} placeholder={'test@gmail.com'} />
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>Nama Lengkap</Text>
                        <View style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2) }}>
                            <TextInput value={name} style={{ width: '100%' }} onChangeText={(v) => setName(v)} placeholder={'e.g udin sedunia '} />
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>Alamat</Text>
                        <View style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2), height: 70 }}>
                            <TextInput
                                multiline={true}
                                value={alamat}
                                onChangeText={(v) => setAlamat(v)}
                                style={{ width: '100%', textAlign: 'justify', height: 70 }} placeholder={'e.g perum kuburan rt 19 no 09 sungai kunjang samarinda '} />
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 17 }}>I want to be driver instead </Text>
                        <Checkbox label='' value={asDriver} onValueChange={(n) => setAsDriver(n)} />
                    </View>
                </View>

                <TouchableOpacity onPress={() => navigateHandler()} activeOpacity={0.5} style={{ padding: 16, marginTop: 16, borderRadius: 4, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: 'white', width: width - (100 * 2), textAlign: 'center' }}>Next</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const CreatePassword = ({ navigation, route }) => {
    const { data } = route.params;

    const { width, height } = Dimensions.get('window');
    let [password, setPassword] = useState('');
    let [retype, setRetype] = useState('');

    let dat = {
        ...data,
        password
    };



    const submitRegistForm = async () => {
        console.log('test');
        
        let token = Math.random() * 9999 + 'abcd'

        // const formData = new FormData();

        // formData.append('name', data.name);
        // formData.append('email', data.email);
        // formData.append('alamat', data.alamat);
        // formData.append('nik', data.nik);

        // formData.append('type', data.type);
        // formData.append('password', password);

        // formData.append('fotoKtp', {
        //     uri: 'file://' + data.fotoKtp.path,
        //     filename: data.ktpFilename,
        //     type: data.ktpType
        // });
        // formData.append('fotoDiri', {
        //     uri: 'file://' + data.fotoDiri.path,
        //     filename: data.fotoDiriFilename,
        //     type: data.fotoDiriType
        // });

        await RNFetchBlob.fetch(
            "POST",
            "http://192.168.43.178:8000/user/add",
            {
                Authorization: 'Bearer' + token,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            [
                {
                    name: 'name', data: data.name
                }, 
                {
                    name: 'email', data: data.email
                }, 
                {
                    name: 'alamat', data: data.alamat
                }, 
                {
                    name: 'nik', data: data.nik
                }, 
                {
                    name: 'type', data: data.type
                },
                {
                    name: 'password', data: password
                },
                {
                    name: 'fotoKtp', filename: `foto-ktp-${data.name.split(' ')[0]}-${data.nik}-${Math.round(Math.random() * 9999)}.jpg`, data: data.fotoKtp.data, type: data.ktpType
                },
                {
                    name: 'fotoDiri', filename: `foto-ktp-${data.name.split(' ')[0]}-${data.nik}-${Math.round(Math.random() * 9999)}.jpg`, data: data.fotoDiri.data, type: data.fotoDiriType
                }
            ]
        )
            .then((res) => {
                return res.json();
            })
            .then(res => {
                console.log(res);
                navigation.push('login');
            })
            .catch(err => {
                console.log('ini error ', err);
            })
    }

    useEffect(() => {

    })

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: '30%' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ paddingBottom: '10%' }}>
                    <Text style={{ fontSize: 30, fontWeight: '600' }}>Create Password</Text>
                </View>

                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>Password</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2) }}>
                        <TextInput onChangeText={(v) => setPassword(v)} style={{ width: '100%' }} textContentType='password' />
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>Re-type Password</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2) }}>
                        <TextInput on style={{ width: '100%' }} onChangeText={(v) => setRetype(v)} textContentType='password' />
                    </View>
                </View>

                <TouchableOpacity onPress={() => submitRegistForm()} activeOpacity={0.5} style={{ padding: 16, marginTop: 16, borderRadius: 4, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: 'white', width: width - (100 * 2), textAlign: 'center' }}>Login now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const CourierRegister = ({ navigation, route }) => {

    const { data } = route.params;

    useEffect(() => {
        console.log('mounted ?')
    }, [])

    const options = {
        mediaType: 'photo',
        quality: 1.0,
        storageOptions: {
            skipBackup: true
        }
    };
    let [nik, setNik] = useState('');
    let [fotoKtp, setFotoKtp] = useState('');
    let [fotoDiri, setFotoDiri] = useState('');
    let [ktpFilename, setKtpFilename] = useState('');
    let [fotoDiriFilename, setFotoDiriFilename] = useState('');

    let [ktpType, setKtpType] = useState('');
    let [fotoDiriType, setFotoDiriType] = useState('');

    let dat = {
        ...data,
        nik,
        fotoKtp,
        fotoDiri,
        type: 'courier',
        ktpType,
        fotoDiriType,
        ktpFilename,
        fotoDiriFilename
    }

    const fotoKtpHandler = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setKtpFilename(response.fileName || response.uri.substr(response.uri.lastIndexOf('/') + 1));
                setFotoKtp(response);
                setKtpType(response.type);
            }
        });
    }
    const fotoDiriHandler = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                console.log(source);
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setFotoDiriFilename(response.fileName || response.uri.substr(response.uri.lastIndexOf('/') + 1));
                setFotoDiri(response);
                setFotoDiriType(response.type);
            }
        });
    }
    const { width, height } = Dimensions.get('window');
    return (
        <KeyboardAvoidingView style={{ flex: 1, paddingTop: '30%', backgroundColor: 'white' }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ paddingBottom: '10%' }}>
                    <Text style={{ fontSize: 30, fontWeight: '600' }}>Daftar sbg Kurir</Text>
                </View>

                <View style={{ flexDirection: 'column' }}>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>NIK</Text>
                        <View style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2) }}>
                            <TextInput value={nik} onChangeText={(v) => setNik(v)} style={{ width: '100%' }} placeholder={'671293812938192382'} />
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>Foto KTP</Text>
                        <TouchableOpacity onPress={() => fotoKtpHandler()} activeOpacity={0.7} style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2), padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ padding: 6, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='images-outline' size={20} />
                            </View>
                            <Text style={{ fontSize: 17, letterSpacing: .5 }}>{fotoKtp ? (ktpFilename.slice(0, 17) + '...' + ' dipilih') : 'Pilih gambar'}</Text>
                        </TouchableOpacity>
                        {
                            fotoKtp ? (
                                <View style={{ padding: 10, height: 100, width: 100, borderRadius: 10 }}>
                                    <Image source={fotoKtp} style={{ resizeMode: 'cover', flex: 1, height: '100%', width: '100%', borderRadius: 10 }} />
                                </View>
                            ) : null
                        }
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Text style={{ fontSize: 17, fontWeight: '400', marginBottom: 6 }}>Foto Diri</Text>
                        <TouchableOpacity onPress={() => fotoDiriHandler()} activeOpacity={0.7} style={{ borderRadius: 5, borderWidth: 1, width: width - ((16 + 10) * 2), padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ padding: 6, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='images-outline' size={20} />
                            </View>
                            <Text style={{ fontSize: 17, letterSpacing: .5 }}>{fotoDiri ? (fotoDiriFilename.slice(0, 17) + '...' + ' dipilih') : 'Pilih gambar'}</Text>
                        </TouchableOpacity>
                        {
                            fotoDiri ? (
                                <View style={{ padding: 10, height: 100, width: 100, borderRadius: 10 }}>
                                    <Image source={fotoDiri} style={{ resizeMode: 'cover', flex: 1, height: '100%', width: '100%', borderRadius: 10 }} />
                                </View>
                            ) : null
                        }

                    </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('password', {
                    data: dat
                })} activeOpacity={0.5} style={{ padding: 16, marginTop: 16, borderRadius: 4, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: 'white', width: width - (100 * 2), textAlign: 'center' }}>Next</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}
export {
    Register,
    CreatePassword,
    CourierRegister
};
