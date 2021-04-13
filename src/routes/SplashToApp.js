import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage'
// import codePush from 'react-native-code-push'

import Splash from '../screens/Splash'
import MainTabNavigation from './MainTabNavigation'

const SplashToApp = props => {
    const [isApp, setIsApp] = useState(false)

    const changeToApp = () => {
        setTimeout(() => {
            setIsApp(true)
        }, 1000)
    }

    const setIpAdress = async () => {
        ipAdress = '192.168.5.131:5000'
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

// const codePushOptions = {
//     checkFrequency: codePush.CheckFrequency.ON_APP_START
// }

// export default codePush(codePushOptions)(SplashToApp)
export default SplashToApp