import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'

import commonStyle from '../../commonStyle'
import TextInputMask from 'react-native-text-input-mask'

export default props => {
    const [value, setValue] = useState(props.value)

    const setFlex = () =>{
        if(!props.flex){
            return {}
        }
        return {flex: props.flex}
    }


    const haveMask = (mask) => {
        if(props.mask){
            return (
                <TextInputMask style={styles.input}
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
            <TextInput style={styles.input}
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
        <View style={[setFlex(), styles.container]}>
            <Text style={styles.containerPlaceholder}>{props.placeholder}</Text>
            {haveMask(props.mask)}
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
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        marginLeft: commonStyle.spacers.margin.horizontal,
        marginRight: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
        height: commonStyle.heighs.NewBudget.customContainer
    },
    containerPlaceholder:{
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
    },
    input:{
        flex: 1,
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        textAlign: 'right',
        fontWeight: 'bold'
    },
})