import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

const FindCourer = () => {
    
    let [initText, setInitText] = useState('Searching for nearest Courier...')
    useEffect(() => {
        setTimeout(() => {
            setInitText('Failed to get courier');
        }, 4000)
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor:'white', justifyContent:'center', alignItems:'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: 0.5 }}>{initText}</Text>
            {
                initText === 'Searching for nearest Courier...' && <View style={{ padding: 16, justifyContent:'center', alignItems:'center' }}>
                <ActivityIndicator size='large' color='blue'/>
            </View>
            }
        </View>
    )
}

export default FindCourer
