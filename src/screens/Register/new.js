import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { requestStoragePermission } from '../../utils/functionality';
import { SERVER_URL } from '../../utils/constants';


const NewRegister = ({ navigation, route }) => {

    const { email } = route.params;

    const type = 'user';

    let [name, setName] = useState('');
    let [fotoDiri, setFotoDiri] = useState('');
    let [noHp, setNoHp] = useState('');
    let [pass, setPass] = useState('');
    let [reTypePass, setReTypePass] = useState('');
    let [fotoDiriType, setFotoDiriType] = useState('');
    let [err, setErr] = useState(false);
    let [registerError, setRegisterErrror] = useState('');


    // image picker options

    const options = {
        mediaType: 'photo',
        quality: 1.0,
        storageOptions: {
            skipBackup: true
        }
    };

    const submitRegistForm = async () => {

        if (reTypePass !== pass) {
            setErr(true);
            return;
        }

        let token = Math.random() * 9999 + 'abcd';

        await RNFetchBlob.fetch(
            "POST",
            `${SERVER_URL}/user/add`,
            {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            [
                {
                    name: 'name', data: name
                },
                {
                    name: 'email', data: email
                },
                {
                    name: 'nohp', data: noHp
                },
                {
                    name: 'type', data: type
                },
                {
                    name: 'password', data: pass
                },
                {
                    name: 'fotoDiri', filename: `foto-diri-${noHp}-${Math.round(Math.random() * 9999)}.jpg`, data: fotoDiri.data, type: fotoDiriType
                }
            ]
        )
            .then((res) => {
                return res.json();
            })
            .then(async res => {
                console.log('ini res ', res);
                if (res.code === 1) {
                    setRegisterErrror(res.msg);
                    return;
                }

                await navigation.navigate('email_verif', { email: email })
            })
            .catch(err => {
                console.log('ini error ', err);
                setRegisterErrror("Ada Masalah koneksi, silahkan coba lagi");
            })
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
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setFotoDiri(response);
                setFotoDiriType(response.type);
            }
        });
    };


    useEffect(() => {
        requestStoragePermission();
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 16, flex: 1 }}>
                <View style={{ paddingTop: 30 }}>
                    <View style={{ height: 200, width: '100%', borderRadius: 10 }}>
                        <Image style={{
                            height: '100%',
                            width: '100%',
                            alignSelf: 'stretch',
                            borderRadius: 10
                        }} source={require('../../assets/logos/1.png')} />
                    </View>
                </View>
                <View style={{ paddingTop: 30 }}>
                    <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 26,
                            fontWeight: 'bold',
                            letterSpacing: .5
                        }}>Daftar</Text>
                    </View>
                </View>
                <KeyboardAvoidingView behavior="height" style={{ paddingTop: 30, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', paddingBottom: 30 }}>
                    <TouchableOpacity
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            width: '100%'
                        }}
                        activeOpacity={.8}
                        onPress={() => fotoDiriHandler()}>
                        <Text>{fotoDiri !== "" ? "Selected " : "Upload Pass Photo"}</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={{
                            padding: 8,
                            borderWidth: 1,
                            borderRadius: 8,
                            width: '100%',
                            marginTop: 10
                        }}
                        onChangeText={(v) => setName(v)}
                        placeholder="Nama Lengkap"
                        placeholderTextColor="black" />
                    <TextInput
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            width: '100%',
                            marginTop: 10
                        }}
                        onChangeText={(v) => setNoHp(v)}
                        placeholder="Nomor HP"
                        placeholderTextColor="black" />
                    <TextInput
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            width: '100%',
                            marginTop: 10
                        }}
                        onChangeText={(v) => setPass(v)}
                        placeholder="Password"
                        placeholderTextColor="black"
                        textContentType="password" />
                    <TextInput
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            width: '100%',
                            marginTop: 10
                        }}
                        placeholder="Ketik ulang Password"
                        placeholderTextColor="black"
                        textContentType="password"
                        onChangeText={(v) => setReTypePass(v)}
                        onEndEditing={(v) => reTypePass === pass ? setErr(false) : null} />
                    {err ? (
                        <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>Password tidak sama.</Text>
                    ) : null}
                    {
                        registerError ? (
                            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>{registerError}</Text>
                        ) : null
                    }
                    <TouchableOpacity activeOpacity={.8} onPress={() => fotoDiri.data === '' || name === '' || noHp === '' || pass === '' ? Alert.alert('Pesan Sistem', 'Pastikan ada menginput semua kolom untuk mendaftar') : submitRegistForm()} style={{ marginTop: 13, padding: 12, borderRadius: 10, width: '100%', backgroundColor: 'blue' }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'white'
                        }}>Daftar & Verifikasi Email</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

const EmailVerification = ({ navigation, route }) => {

    const { email } = route.params;
    let [pin, setPin] = useState("");
    let [errMsg, setErrMsg] = useState("");
    let [succMsg, setSuccMsg] = useState("");


    const resendEmail = async () => {


        let body = {
            email: email
        };

        await fetch(`${SERVER_URL}/user/resend-verification`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log('response resend email', res);
                if (res.code === 1) {
                    setErrMsg(res.msg);
                    return;
                }

                setSuccMsg(res.msg);
            })
            .catch(err => {
                console.log('err resend email ', err)

                setErrMsg("Ada masalah koneksi, silahkan coba lagi");
            })

    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 16, flex: 1, backgroundColor: 'white' }}>
                <View style={{ paddingTop: 30 }}>
                    <View style={{ height: 200, width: '100%', borderRadius: 10 }}>
                        <Image style={{
                            height: '100%',
                            width: '100%',
                            alignSelf: 'stretch',
                            borderRadius: 10
                        }} source={require('../../assets/logos/1.png')} />
                    </View>
                </View>
                <View style={{ paddingTop: 30, flex: 1, marginTop: 50 }}>
                    <View style={{ padding: 16, justifyContent: 'center' }}>
                        <Text style={{
                            fontSize: 26,
                            fontWeight: 'bold',
                            letterSpacing: .5
                        }}>Hai,</Text>
                        <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'blue' }}>{email || "John Doe"}</Text>
                        <Text style={{ fontSize: 19, marginTop: 10 }}>Silahkan cek email anda dan klik link yg kita kirim di email tersebut.</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('new_login')} style={{ marginTop: 12, padding: 10, borderRadius: 7, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: .5, color: 'white' }}>Menuju Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => resendEmail()} style={{ marginTop: 12, padding: 10, borderRadius: 7, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: .5, color: 'white' }}>Kirim ulang Verifikasi</Text>
                    </TouchableOpacity>

                    {
                        errMsg ? (
                            <Text style={{ fontSize: 20, color: 'red', fontWeight: 'bold', marginTop: 10 }}>{errMsg}</Text>
                        ) : null
                    }

                    {
                        succMsg ? (
                            <Text style={{ fontSize: 20 }}>{succMsg}</Text>
                        ) : null
                    }
                </View>
            </View>
        </View>
    )
}

export {
    NewRegister,
    EmailVerification
}