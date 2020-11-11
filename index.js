/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';
import {
    navRef,
    deviceTokenDispatch
} from './src/routes/index';
import AsyncStorage from '@react-native-community/async-storage';


PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
        AsyncStorage.getItem('LOGIN_TOKEN', async (e, r) => {
            if (r) {
                
                let body = {
                    token: r,
                    device_token: token.token
                };

                await fetch(`http://192.168.43.178:8000/update-device-token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                    .then(res => {
                        // do nothing
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            } else {
                return;
            }
        })
        deviceTokenDispatch({ type: 'add_device_token', token: token.token });
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification

        PushNotification.localNotification({
            channelId: "not1",
            subText: 'Local Notification Demo testestsetstest',
            title: notification.data.testing,
            message: 'Expand me to see more',
            vibrate: true,
            vibration: 300,
            playSound: true,
            soundName: 'default',
            actions: '["Yes", "No"]',
            invokeApp: false
        })

        // (required) Called when a remote is received or opened, or local notification is opened
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {

        console.log("ACTION:", notification.action);

        console.log("NOTIFICATION:", notification);

        if (notification.action === 'Yes') {
            console.log('navigate to order??');
            navRef.current.navigate('order');
        }
        // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
        console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
});

PushNotification.createChannel(
    {
        channelId: "not1", // (required)
        channelName: "Channel", // (required)
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);


AppRegistry.registerComponent(appName, () => App);
