import React, { useEffect, useCallback, useState } from 'react'
import { View, Text, Dimensions, ScrollView, KeyboardAvoidingView, Alert } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import Checkbox from '@react-native-community/checkbox';

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

        if(!reg.test(email)){
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
    }, [])
    return (
        <KeyboardAvoidingView style={{ flex: 1, paddingTop: '30%', backgroundColor:'white' }}>
        <View style={{ alignItems:'center', flex: 1 }}>
            <View style={{ paddingBottom: '10%' }}>
                <Text style={{ fontSize: 30, fontWeight:'600'}}>Register</Text>
            </View>

            <View style={{ flexDirection:'column' }}>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Email</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2) }}>
                        <TextInput value={email} onChangeText={(v) => emailValidation(v)} style={{ width: '100%' }} placeholder={'test@gmail.com'}/>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Full Name</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2) }}>
                        <TextInput value={name} style={{ width: '100%' }} onChangeText={(v) => setName(v)} placeholder={'e.g udin sedunia '}/>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Address</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2), height: 70 }}>
                        <TextInput
                        multiline={true}
                        value={alamat}
                        onChangeText={(v) => setAlamat(v)}
                        style={{ width: '100%',textAlign:'justify', height: 70 }} placeholder={'e.g perum kuburan rt 19 no 09 sungai kunjang samarinda '}/>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems:'center' }}>
                    <Text style={{ fontSize: 17 }}>I want to be driver instead </Text>
                    <Checkbox label='' value={asDriver} onValueChange={(n) => setAsDriver(n)}/>
                </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('password', {
                data
            })} activeOpacity={0.5} style={{ padding: 16, marginTop: 16, borderRadius: 4, backgroundColor:'blue', justifyContent:'center', alignItems:'center' }}>
                <Text style={{ fontSize: 17, fontWeight:'600', color:'white', width: width - (100 * 2), textAlign:'center' }}>Next</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
    )
}

const CreatePassword = ({ navigation, route }) => {
    const { data } = route.params;
    console.log('data received: ', data);
    const { width, height } = Dimensions.get('window');
    let [password, setPassword] = useState('');
    let [retype, setRetype] = useState('');

    let dat = {
        ...data,
        password
    }
    const submitRegistForm = () => {
        console.log('test');
        fetch('http://192.168.43.178:8000/user/add', {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(dat)
        })
        .then((res) => {
            return res.json();
        })
        .then(res => {
            Alert.alert('Redirecting...');
            setTimeout(() => {
                navigation.navigate('login')
            }, 1000);
        })
        .catch(err => {
            console.log('ini error ',err);
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: '30%' }}>
            <View style={{ alignItems:'center', flex: 1}}>
                    <View style={{ paddingBottom: '10%' }}>
                        <Text style={{ fontSize: 30, fontWeight: '600' }}>Create Password</Text>
                    </View>

                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Password</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2) }}>
                        <TextInput onChangeText={(v) => setPassword(v)} style={{ width: '100%' }}  textContentType='password'/>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Re-type Password</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2) }}>
                        <TextInput on style={{ width: '100%' }} onChangeText={(v) => setRetype(v)} textContentType='password'/>
                    </View>
                </View>

                <TouchableOpacity onPress={() => submitRegistForm()} activeOpacity={0.5} style={{ padding: 16, marginTop: 16, borderRadius: 4, backgroundColor: 'blue', justifyContent:'center', alignItems:'center' }}>
                <Text style={{ fontSize: 17, fontWeight:'600', color:'white', width: width - (100 * 2), textAlign:'center' }}>Login now</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const CourierRegister = ({ navigation }) => {
    return (
        <KeyboardAvoidingView style={{ flex: 1, paddingTop: '30%', backgroundColor:'white' }}>
        <View style={{ alignItems:'center', flex: 1 }}>
            <View style={{ paddingBottom: '10%' }}>
                <Text style={{ fontSize: 30, fontWeight:'600'}}>Daftar sbg Kurir</Text>
            </View>

            <View style={{ flexDirection:'column' }}>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Email</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2) }}>
                        <TextInput value={email} onChangeText={(v) => emailValidation(v)} style={{ width: '100%' }} placeholder={'test@gmail.com'}/>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Full Name</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2) }}>
                        <TextInput value={name} style={{ width: '100%' }} onChangeText={(v) => setName(v)} placeholder={'e.g udin sedunia '}/>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontSize: 17, fontWeight:'400', marginBottom: 6 }}>Address</Text>
                    <View style={{ borderRadius: 5, borderWidth: 1, width : width - ((16 + 10) * 2), height: 70 }}>
                        <TextInput
                        multiline={true}
                        value={alamat}
                        onChangeText={(v) => setAlamat(v)}
                        style={{ width: '100%',textAlign:'justify', height: 70 }} placeholder={'e.g perum kuburan rt 19 no 09 sungai kunjang samarinda '}/>
                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('password', {
                data
            })} activeOpacity={0.5} style={{ padding: 16, marginTop: 16, borderRadius: 4, backgroundColor:'blue', justifyContent:'center', alignItems:'center' }}>
                <Text style={{ fontSize: 17, fontWeight:'600', color:'white', width: width - (100 * 2), textAlign:'center' }}>Next</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
    )
}
export {
    Register,
    CreatePassword,
    CourierRegister
} ;
