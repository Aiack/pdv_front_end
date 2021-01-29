import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import commonStyle from '../commonStyle'
import LinearGradient from 'react-native-linear-gradient'

export default props => {
    return (
        <LinearGradient colors={['white', commonStyle.colors.background]} style={styles.mainContainer}>
            <Text style={styles.tittleText}>{props.title}</Text>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        width: '100%',
        elevation: 2
    },
    tittleText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle * 1.4,
        fontWeight: 'bold',
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
    },
})