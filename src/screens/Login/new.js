import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_URL } from '../../utils/constants';

const NewLogin = ({ navigation }) => {

    let [password, setPassword] = useState("");
    let [email, setEmail] = useState("");

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
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
                        }}>Selamat datang di Onqir</Text>

                        <Text style={{ fontSize: 19, textAlign: 'center' }}>Kirim barang anda dalam satu genggaman tangan</Text>
                    </View>
                </View>

                <View style={{ paddingTop: 30, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={{
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            width: '100%'
                        }}
                        onChangeText={(v) => setEmail(v)}
                        placeholder="Ketik Email.."
                        placeholderTextColor="black" />
                    <TouchableOpacity activeOpacity={.8} onPress={() => email === '' ? Alert.alert('Pesan Sistem', 'Harap isi email yang valid terlebih dahulu') : navigation.navigate('login_pass', { email: email })} style={{ marginTop: 13, padding: 12, borderRadius: 10, width: '100%', backgroundColor: 'blue' }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'white'
                        }}>Masuk</Text>
                    </TouchableOpacity>

                    <View style={{ padding: 12, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Atau</Text>
                    </View>

                    <TouchableOpacity onPress={() => email === '' ? Alert.alert('Pesan Sistem', 'Harap isi email yang valid terlebih dahulu') : navigation.navigate('new_register', { email: email })} style={{ padding: 12, borderRadius: 10, width: '100%', backgroundColor: '#41CA3E' }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'white'
                        }}>Daftar</Text>
                    </TouchableOpacity>
                    <View style={{ padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>Dengan masuk, Anda menyetujui </Text>
                            <Text style={{ color: 'blue' }}>ketentuan pengguna</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>dan</Text>
                            <Text style={{ color: 'blue' }}> kebijakan privasi</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const LoginPassword = ({ navigation, route }) => {

    const { email } = route.params;
    const device = useSelector(state => state.device);
    const { device_token } = device;
    let [isLoginError, setIsLoginError] = useState(false);
    let [errMsg, setErrorMsg] = useState("");
    let [password, setPassword] = useState("");

    let [isPasswordHide, setPasswordHide] = useState(true);

    const body = {
        email,
        password,
        token: device_token
    };
    const dispatch = useDispatch();


    const submitLogin = () => {

        if (password === '') {
            setIsLoginError(true);
            setErrorMsg('Password tidak boleh kosong');
            return
        }

        fetch(`${SERVER_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.code === 'ERR_LOGIN_1') {
                    setIsLoginError(true);
                    setErrorMsg('Username atau password tidak ditemukan.');
                    return;
                }
                if (res.code === 'ERR_LOGIN_2') {
                    setIsLoginError(true);
                    setErrorMsg('Password do not match');
                    return;
                }

                const { tokenA } = res;
                console.log('LOGIN TOKEN : ', tokenA);
                dispatch({ type: 'LOGIN_TOKEN', tokenA });
                AsyncStorage.setItem('LOGIN_TOKEN', tokenA);
                navigation.replace('home');
            })
            .catch(err => {
                console.log('Login error ::: ', err);
                setIsLoginError(true);
                setErrorMsg('Network Error');
                return;
            })
    }



    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
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
                        }}>Selamat datang di Onqir</Text>

                        <Text style={{ fontSize: 19, textAlign: 'center' }}>Kirim barang anda dalam satu genggaman tangan</Text>
                    </View>
                </View>
                <View style={{ paddingTop: 30, paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 16, marginBottom: 5 }}>Email : {email}</Text>
                    <View style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderRadius: 8,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent:'space-between'
                    }}>

                        <TextInput
                            style={{
                                padding: 12,
                                width: '90%'
                            }}
                            placeholder="Input Password ..."
                            textContentType='password'
                            secureTextEntry={isPasswordHide ? true : false}
                            placeholderTextColor="black"
                            onChangeText={(v) => setPassword(v)} />
                        <TouchableOpacity onPress={() => setPasswordHide(!isPasswordHide)} activeOpacity={.7} style={{ padding: 6, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name={`eye${isPasswordHide ? '-off-' : '-'}outline`} color='blue' size={24} />
                        </TouchableOpacity>
                    </View>
                    {
                        isLoginError ? (
                            <Text style={{ fontSize: 16, fontWeight: 'bold', letterSpacing: .5, color: 'red' }}>{errMsg}</Text>
                        ) : null
                    }

                    <TouchableOpacity onPress={submitLogin} style={{ marginTop: 13, padding: 12, borderRadius: 10, width: '100%', backgroundColor: 'blue' }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'white'
                        }}>Masuk</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}
export {
    NewLogin,
    LoginPassword
};
