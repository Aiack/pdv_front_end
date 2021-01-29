import React, { useState, useEffect } from 'react'
import { Modal, View, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Icon from 'react-native-vector-icons/FontAwesome5'
import TextInputMask from 'react-native-text-input-mask'

import commonStyle from '../commonStyle'

export default props => {
    const [ipAdress, setIpAdress] = useState('')
    const [timeOut, setTimeOut] = useState('')

    const getPortInfo = async () => {
        res = await AsyncStorage.getItem('portInfo')
        setIpAdress(res ? JSON.parse(res).ipAdress : '192.168.5.120:5000')
        setTimeOut(res ? JSON.parse(res).timeOut : '1500')
    }

    const onSubmit = async () => {
        const jsonValue = JSON.stringify({ipAdress, timeOut})
        await AsyncStorage.setItem('portInfo', jsonValue)
        props.onClose()
    }

    return (
        <Modal transparent={true}
        visible={props.isVisible}
        onRequestClose={props.onClose}
        animationType='fade'
        onShow={getPortInfo}>
    
        <TouchableWithoutFeedback onPress={props.onClose} >
            <View style={styles.background}/>
        </TouchableWithoutFeedback>

        <View style={styles.container}>
            <View style={{flex:1}}>
                <View style={styles.formContainer}>
                    <Text style={styles.containerPlaceholder}>{'IP'}</Text>
                    <TextInputMask style={styles.input}
                    value={ipAdress}
                    onChangeText={(val) => setIpAdress(val)}
                    autoCapitalize='characters'
                    mask={'[999].[999].[999].[999]:[9999]'}
                    keyboardType='phone-pad'
                    placeholder='000.000.0000.000:0000'/>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.containerPlaceholder}>{'Timeout'}</Text>
                    <TextInputMask style={styles.input}
                    value={timeOut}
                    onChangeText={(val) => setTimeOut(val)}
                    autoCapitalize='characters'
                    mask={'[0000]'}
                    keyboardType='phone-pad'
                    placeholder='0000'/>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.error}]}
                                    onPress={props.onClose}>
                    <Icon name='window-close' size={commonStyle.iconSizes.bigger} color='white'/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.faturado}]}
                                    onPress={onSubmit}>
                    <Icon name='check' size={commonStyle.iconSizes.bigger} color='white'/>
                </TouchableOpacity>
            </View>
        </View>

        <TouchableWithoutFeedback onPress={props.onClose} >
            <View style={styles.background}/>
        </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        flex: 1,
        backgroundColor: commonStyle.colors.background
    },
    buttonsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button:{
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: commonStyle.spacers.margin.vertical,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        width: '25%',
        height: commonStyle.heighs.BudgetProduct.customerButton,
        borderRadius: commonStyle.borderRadius.main
    },
    formContainer:{
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
