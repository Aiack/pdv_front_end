import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import commonStyle from '../../../commonStyle'

export default props => {
    let color = null
    let sphere = null
    let text = null
    if(props.title === 'Física' && props.flag === 'Y'){
        color = {
            borderColor: commonStyle.colors.alertColors.faturado,
            backgroundColor: 'rgba(51, 153, 0, 0.08)'
        }
        sphere = {
            backgroundColor: commonStyle.colors.alertColors.faturado,
            borderWidth: 0
        }
        text = {
            color: commonStyle.colors.alertColors.faturado
        }
    }

    if(props.title === 'Jurídica' && props.flag === 'N'){
        color = {
            borderColor: commonStyle.colors.alertColors.error,
            backgroundColor: 'rgba(237, 85, 59, 0.08)'
        }
        sphere = {
            backgroundColor: commonStyle.colors.alertColors.error,
            borderWidth: 0
        }
        text = {
            color: commonStyle.colors.alertColors.error
        }
    }

    let flag = null
    if(props.title === 'Física'){
        flag = 'Y'
    }
    else{
        flag = 'N'
    }

    return (
        <TouchableOpacity style={[styles.container, color]} onPress={() => props.onPress(flag)}>
            <View style={[styles.sphere, sphere]}>
                <View style={styles.smallSphere}/>
            </View>
            <Text style={[styles.title, text]}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        height: commonStyle.heighs.buttons.height,
        width: commonStyle.heighs.buttons.width,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: commonStyle.colors.separator,
        borderRadius: commonStyle.borderRadius.main,
        backgroundColor: 'white',
        marginVertical: commonStyle.spacers.margin.vertical
    },
    sphere:{
        height: commonStyle.heighs.sphere,
        width: commonStyle.heighs.sphere,
        borderRadius: commonStyle.heighs.sphere,
        borderWidth: 1,
        marginRight: commonStyle.spacers.margin.horizontal,
        justifyContent: 'center',
        alignItems: 'center'
    },
    smallSphere:{
        height: commonStyle.heighs.sphere / 3,
        width: commonStyle.heighs.sphere / 3,
        borderRadius: commonStyle.heighs.sphere / 3,
        backgroundColor: 'white'
    },
    title:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle,
        color: 'black'
    }

})
