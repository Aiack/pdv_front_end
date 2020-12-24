import React, {useEffect} from 'react'
import { StyleSheet, View, StatusBar, Image, Text } from 'react-native'

import logo from '../../assets/imgs/logowhite.png'
import commonStyles from '../commonStyle'

export default props => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={commonStyles.colors.primary}/>
            <Image source={logo} style={styles.logo}/>
            <Text style={styles.title}>O Tijolão PDV</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:commonStyles.colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo:{
        height: 200,
        resizeMode: 'contain',
    },
    title:{
        fontSize: 50,
        color: 'white',
        fontFamily: commonStyles.fontFamily,
        fontWeight: 'bold',
    }
})
