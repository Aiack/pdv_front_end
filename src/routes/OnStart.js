import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage'
// import codePush from 'react-native-code-push'

import Splash from '../screens/Splash'
import FirstInitScreen from '../screens/FirstInitScreen'
import MainTabNavigation from './MainTabNavigation'

const SplashToApp = props => {
    const [isApp, setIsApp] = useState(false)

    const changeToApp = () => {
        setTimeout(() => {
            setIsApp(true)
        }, 1000)
    }

    const isFirstInit = async () => {
        const firstInit = await AsyncStorage.getItem('portInfo')
        if(firstInit != null){
            return firstInit
        }
        return true
    }

    const getScreen = () => {
        if(isFirstInit()){
            return <FirstInitScreen/>
        }
        if(!isApp){
            return <Splash changeToApp={changeToApp}/>
        }
        return <MainTabNavigation/>
    }

    return (
        <NavigationContainer>
            {getScreen()}
        </NavigationContainer>
    )
}

// const codePushOptions = {
//     checkFrequency: codePush.CheckFrequency.ON_APP_START
// }

// export default codePush(codePushOptions)(SplashToApp)
export default SplashToApp