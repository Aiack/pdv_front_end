import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'

import commonStyle from '../../commonStyle'

export default props => {
    const setFlex = () =>{
        if(!props.flex){
            return {}
        }
        return {flex: props.flex}
    }

    return (
        <View style={[setFlex(), styles.container]}>
            <Text style={styles.containerPlaceholder}>{props.placeholder}</Text>
            <TextInput style={styles.input}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    autoCapitalize='words'
                    placeholder={props.inputPlaceholder}/>
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
        marginHorizontal: commonStyle.spacers.margin.horizontal,
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