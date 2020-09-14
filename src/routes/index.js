import React, { useEffect, useRef, useState } from 'react';
import {
    createStackNavigator,
    TransitionSpecs,
    HeaderStyleInterpolators,
    CardStyleInterpolators,
    CardAnimationContext
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Landing } from '../screens/Landing/index';
import Login from '../screens/Login';
import { Register, CreatePassword, CourierRegister } from '../screens/Register';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { SplashScreen } from '../screens/Splash';
import Home from '../screens/Home';
import { Send, SendStep } from '../screens/Send';
import FindCourer from '../screens/FindCourier';
import OrderFind from '../screens/Courier';
import OrderDetailCourier from '../screens/Courier/DetailOrder';

const Stack = createStackNavigator();

const Router = React.memo((props) => {
    const ref = useRef(null);
    let [token, setToken] = useState(null);
    let login_token = useSelector(state => state.token);
    let [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        AsyncStorage.getItem('LOGIN_TOKEN', (err, res) => res)
            .then((res) => {
                console.log('ini res dari logintoken storage', res);
                setToken(res);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])


    return (
        <NavigationContainer>
            <Stack.Navigator headerMode='none'>

                {isLoading ? (
                    <Stack.Screen name='SplashScreen' component={SplashScreen} options={{
                        headerShown: true,
                        cardShadowEnabled: false,
                        cardOverlayEnabled: false,
                        cardOverlay : false
                    }} />
                ) : token !== null || login_token.token !== null ? (
                    // Regular Routes
                    <React.Fragment>
                        <Stack.Screen name="home" component={Home} options={{
                            headerShown: false,
                            cardShadowEnabled: false,
                            cardOverlayEnabled: false,
                            cardOverlay : false
                        }} />
                        <Stack.Screen name="send" component={Send} options={{
                            headerShown: false,
                            cardShadowEnabled: false,
                            cardOverlayEnabled: false,
                            cardOverlay : false
                        }} />
                        <Stack.Screen name="send_step" component={SendStep} options={{
                            headerShown: false,
                            cardShadowEnabled: false,
                            cardOverlayEnabled: false,
                            cardOverlay : false
                        }} />
                        <Stack.Screen name="find_courier" component={FindCourer} options={{
                            headerShown: false,
                            cardShadowEnabled: false,
                            cardOverlayEnabled: false,
                            cardOverlay : false
                        }} />
                        <Stack.Screen name="find_order" component={OrderFind} options={{
                            headerShown: false,
                            cardShadowEnabled: false,
                            cardOverlayEnabled: false,
                            cardOverlay : false
                        }} />
                         <Stack.Screen name="courier_order_detail" component={OrderDetailCourier} options={{
                            headerShown: false,
                            cardShadowEnabled: false,
                            cardOverlayEnabled: false,
                            cardOverlay : false
                        }} />
                    </React.Fragment>
                ) : (
                            // not logged in routes

                            <React.Fragment>

                                <Stack.Screen name="landing" component={Landing} options={{
                                    headerShown: false,
                                    cardShadowEnabled: false,
                                    cardOverlayEnabled: false,
                                    cardOverlay : false
                                }} />
                                <Stack.Screen name="login" component={Login} options={{
                                    headerShown: false,
                                    cardShadowEnabled: false,
                                    cardOverlayEnabled: false,
                                    cardOverlay : false
                                }} />
                                <Stack.Screen name="register" component={Register} options={{
                                    headerShown: false,
                                    cardShadowEnabled: false,
                                    cardOverlayEnabled: false,
                                    cardOverlay : false
                                }} />
                                <Stack.Screen name="password" component={CreatePassword} options={{
                                    headerShown: false,
                                    cardShadowEnabled: false,
                                    cardOverlayEnabled: false,
                                    cardOverlay : false
                                }} />
                                <Stack.Screen name="kurir_register" component={CourierRegister} options={{
                                    headerShown: false,
                                    cardShadowEnabled: false,
                                    cardOverlayEnabled: false,
                                    cardOverlay : false
                                }} />
                            </React.Fragment>
                        )}
            </Stack.Navigator>
        </NavigationContainer>
    )
})

export default Router;