import { SERVER_URL } from '../utils/constants';
import {
    Alert
} from 'react-native';

const fetchOrder = async (token, navigation, type) => {

    let body = {
        token

    }
    await fetch(`${SERVER_URL}/user/order/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(result => {
            return result.json();
        })
        .then((result) => {
            if (result.msg === 'not found') {
                // do action when not found
            } else {

                if (type === "finish order") {

                    finishOrder(result.id, result.user._id, result.courier._id, navigation);

                } else {

                    // other type
                }
                // do action when there's a order active
            }
        })

}

const finishOrder = async (orderId, userId, courierId, navigation) => {

    let body = {
        id: orderId,
        alasan: "orderan di tolak sama si kurir",
        user_id: userId,
        courier_id: courierId
    };

    await fetch(`${SERVER_URL}/order/set/alasan_user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(res => {
            //
            if (res.msg === "success canceled") {
                return navigation.navigate('home');
            }
            // do nothing here;
        })
        .catch(err => {
            throw new Error(err);
        })
}


export {
    fetchOrder
}