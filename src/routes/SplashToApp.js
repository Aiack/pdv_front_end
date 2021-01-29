import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage'

import Splash from '../screens/Splash'
import MainTabNavigation from './MainTabNavigation'

export default props => {
    const [isApp, setIsApp] = useState(false)

    const changeToApp = () => {
        setTimeout(() => {
            setIsApp(true)
        }, 1000)
    }

    const setIpAdress = async () => {
        ipAdress = '10.0.0.103:5000'
        timeOut = '5000'
        const jsonValue = JSON.stringify({ipAdress, timeOut})
        await AsyncStorage.setItem('portInfo', jsonValue)
    }

    setIpAdress()

    return (
        <NavigationContainer>
            { !isApp && <Splash changeToApp={changeToApp}/>}
            { isApp && <MainTabNavigation/>}
        </NavigationContainer>
    )
}