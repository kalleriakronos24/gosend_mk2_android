import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { View, Text, StatusBar, Dimensions, KeyboardAvoidingView } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

const Login = ({ navigation }) => {

    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();

    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('');

    let body = {
        email,
        password
    }
    const submitLogin = () => {
        fetch('http://192.168.43.178:8000/user/login', {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if(res) {
                const { token } = res;
                console.log('LOGIN TOKEN : ', token);
                dispatch({ type : 'LOGIN_TOKEN', token });
                AsyncStorage.setItem('LOGIN_TOKEN', token);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor:'white', paddingTop: '30%', alignItems:'center' }}>
            <StatusBar barStyle='dark-content' backgroundColor='white' animated/>
            <View style={{ paddingBottom: '20%', justifyContent:'center', alignItems:'center' }}>
                <Text style={{ fontSize: 30, fontWeight:'600' }}>Test App</Text>
            </View>
            <View>
                <View style={{ borderWidth: 1, borderColor:'blue', width: width - ( 16 * 2 ), borderRadius: 6 }}>
                    <TextInput onChangeText={(v) => setEmail(v)} style={{
                        height: 40,
                        width: width - ( 16 * 2)
                    }} placeholder={'Email'} />
                </View>

                <View style={{ borderWidth: 1, borderColor:'blue', width: width - ( 16 * 2 ), borderRadius: 6, marginTop: 6  }}>
                    <TextInput
                    onChangeText={(v) => setPassword(v)} style={{
                        height: 40,
                        width: width - ( 16 * 2)
                    }} placeholder={'Password'} />
                </View>
                <TouchableOpacity onPress={() => submitLogin()} activeOpacity={0.5} style={{ marginTop: 15, padding: 16, justifyContent:'center', alignItems:'center', borderRadius: 5, backgroundColor:'blue' }}>
                    <Text style={{ fontSize: 18, color:'white', fontWeight:'500'}}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={{ padding: 16 }}>
                    <Text>OR</Text>
            </View>

            <View>
            <TouchableOpacity activeOpacity={0.5} style={{ width: width - ( 16 * 2 ), padding: 10, justifyContent:'center', alignItems:'center', borderRadius: 5,borderColor:'blue',borderWidth: 1, flexDirection:'row' }}>
                    <Icon name='logo-google' size={20} color='blue'/>
                    <Text style={{ marginLeft: 4, fontSize: 16, color:'black', fontWeight:'500'}}>Login via Google</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} style={{ width: width - ( 16 * 2 ), marginTop: 8, padding: 10, justifyContent:'center', alignItems:'center', borderRadius: 5, borderColor:'blue', borderWidth: 1, flexDirection:'row' }}>
                    <Icon name='logo-facebook' size={20} color='blue'/>
                    <Text style={{ fontSize: 16, marginLeft: 4, color:'black', fontWeight:'500'}}>Login via Facebook</Text>
                </TouchableOpacity>
            </View>
            <View style={{ alignSelf:'flex-start'}}>
            <TouchableOpacity style={{ padding: 16, flexDirection:'row' }} activeOpacity={0.5} onPress={() => navigation.navigate('register')}>
                    <Text style={{ fontSize: 17 }}>Tidak punya akun ? </Text>
                    <Text style={{ textDecorationLine: 'underline', textDecorationColor: 'blue', fontSize: 17 }}>daftar sekarang!</Text>
            </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    )
}

export default Login;
