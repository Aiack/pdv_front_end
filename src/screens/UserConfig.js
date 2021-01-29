import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import commonStyle from '../commonStyle'
import CustomHeader from '../components/customHeader'

export default props => {
    return (
        <View style={styles.mainContainer}>
            <CustomHeader title={'Minhas configurações'}/>
            <View style={{flex:1, justifyContent: 'center', alignItems:'center', transform: [{rotate: '-45deg'}]}}>
                <Text style={{
                    fontFamily: commonStyle.fontFamily,
                    fontSize: commonStyle.fontSize.pageTitle * 1.7,
                    color: 'red',
                    fontWeight: 'bold'
                }}>Ainda não implementado!</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor: commonStyle.colors.background
    },
    tittleText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle * 1.4,
        fontWeight: 'bold',
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical
    },
})
