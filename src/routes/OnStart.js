import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage'
// import codePush from 'react-native-code-push'

import Splash from '../screens/Splash'
import FirstInitScreen from '../screens/FirstInitScreen'
import MainTabNavigation from './MainTabNavigation'

const SplashToApp = props => {
    const [screenName, setScreenName] = useState(null)

    const changeToScreen = (screen) => {
        setScreenName(screen)
    }

    useEffect(async () => {
        if(await AsyncStorage.getItem('serverInfo') != null){
            changeToScreen("splash")
        }
        else{
            changeToScreen("firstInit")
        }
    }, [])

    const getScreen = () => {
        if(screenName === "firstInit"){
            return <FirstInitScreen changeToScreen={changeToScreen}/>
        }
        else if(screenName === "splash"){
            return <Splash changeToScreen={changeToScreen}/>
        }
        else if(screenName === "app")
            return <MainTabNavigation/>
    }

    return (
        <NavigationContainer>
            {/* {getScreen()} */}
            <MainTabNavigation/>
        </NavigationContainer>
    )
}

// const codePushOptions = {
//     checkFrequency: codePush.CheckFrequency.ON_APP_START
// }

// export default codePush(codePushOptions)(SplashToApp)
export default SplashToApp