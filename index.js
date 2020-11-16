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
import { fetchOrder } from './src/utils/notification_actions';
import { formatRupiah } from './src/utils/functionality';

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

        if (notification.data.type === "ORDER_DIBATALKAN_KURIR") {

            PushNotification.localNotification({
                channelId: "not1",
                subText: notification.data.subtext,
                title: notification.data.title,
                message: `Order dibatalkan oleh kurir ${notification.data.dari}`,
                bigText: `Orderan dibatalkan oleh kurir ${notification.data.dari} dengan ${notification.data.alasan}`,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                actions: '["SELESAI"]',
                invokeApp: false
            });

        } else if (notification.data.type === "ORDERAN_SELESAI_DIKIRIM") {

            PushNotification.localNotification({
                channelId: "not1",
                subText: notification.data.subtext,
                title: notification.data.title,
                message: `Order Telah Selesai Selesai oleh kurir ${notification.data.dari}`,
                bigText: `
                Ongkir : ${formatRupiah(notification.data.ongkir, 'Rp. ')} \n
                Barang yg di kirim : ${notification.data.barang}
                Status : Barang Telah Sampai Ke Penerima | Selesai
            `,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                actions: '["SELESAI"]',
                invokeApp: false
            });

        } else if(notification.data.type === "KURIR_ACCEPT_ORDER") {

            PushNotification.localNotification({
                channelId: "not1",
                subText: notification.data.subtext,
                title: notification.data.title,
                message: `Order mu diterima oleh kurir ${notification.data.kurir}`,
                bigText: `
                Kurir : ${notification.data.kurir} \n
                No HP : ${notification.data.no_hp} \n
            `,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                actions: '["OK"]',
                invokeApp: false
            });

        } else {


            PushNotification.localNotification({
                channelId: "not1",
                subText: notification.data.subtext,
                title: notification.data.title,
                message: `${notification.data.title} `,
                bigText: `${notification.data.title}`,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                actions: '["OK"]',
                invokeApp: false
            });

            // ????
        }



        // (required) Called when a remote is received or opened, or local notification is opened
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: async function (notification) {

        console.log("onAction() NOTIFICATIONS:", notification.data);


        await AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => {

            if (r) {

                if (notification.action === 'SELESAI') {
                    // do OK Action
                    fetchOrder(r, navRef.current, "finish order")
                } else {
                    // do something else
                    navRef.current.navigate('home');
                }

            } else {
                // do something when login token is null
            }

        })
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
