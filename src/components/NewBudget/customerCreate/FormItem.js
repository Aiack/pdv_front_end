import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../../../commonStyle'
import TextInputMask from 'react-native-text-input-mask'

export default props => {
    const [value, setValue] = useState(props.value)

    const setFlex = () =>{
        if(!props.flex){
            return {}
        }
        return {flex: props.flex}
    }

    console.log('render')

    const haveMask = (mask) => {
        if(props.mask){
            return (
                <TextInputMask style={[styles.input, {
                    paddingRight: props.search ? null : commonStyle.spacers.padding.horizontal
                    }]}
                value={props.data[props.varName]}
                onChangeText={(val) => props.setInfo(val, props.varName)}
                autoCapitalize='characters'
                mask={props.mask}
                keyboardType={props.keyboardType}
                placeholder={props.inputPlaceholder}
                maxLength={props.maxLength}/>
                )
        }
        return (
            <TextInput style={[styles.input, {
                paddingRight: props.search ? null : commonStyle.spacers.padding.horizontal
                }]}
            value={props.data[props.varName]}
            onChangeText={(val) => props.setInfo(val, props.varName)}
            autoCapitalize='characters'
            mask={props.mask}
            keyboardType={props.keyboardType}
            placeholder={props.inputPlaceholder}
            maxLength={props.maxLength}/>
        )
    }

    const haveError = () => {
        if(props.isError){
            return (
                <View style={styles.error}/>
            )
        }
        return null
    }

    const isSearchable = () => {
        if(props.search){
            return (
                <TouchableOpacity onPress={props.search} style={{paddingLeft:commonStyle.spacers.padding.horizontal}}>
                    <Icon name='search' size={commonStyle.iconSizes.main} color={commonStyle.colors.secondary}
                    style={{paddingRight: commonStyle.spacers.padding.horizontal}}/>
                </TouchableOpacity>
            )
        }
        return null
    }

    return (
        <View style={[setFlex(), styles.container]}>
            {haveError()}
            <Text style={styles.containerPlaceholder}>{props.placeholder}</Text>
            {haveMask(props.mask)}
            {isSearchable()}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: commonStyle.borderRadius.main,
        elevation:1,
        marginLeft: commonStyle.spacers.margin.horizontal,
        marginRight: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
        height: commonStyle.heighs.NewBudget.customContainer
    },
    containerPlaceholder:{
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        paddingLeft: commonStyle.spacers.padding.horizontal,
    },
    input:{
        flex: 1,
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    error:{
        borderColor: commonStyle.colors.alertColors.error,
        borderWidth: 2,
        backgroundColor: 'rgba(237, 85, 59, 0.08)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: commonStyle.borderRadius.main,
    }
})