import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Text, TextInput, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'
import TextInputMask from 'react-native-text-input-mask'

import Toast from 'react-native-toast-message';

import commonStyle from '../../../commonStyle'

let ToastRef = null

export default props => {
    const [isLoading, setIsLoading] = useState(false)

    const parseFrete = (val) => {
        if(val){
            if(val != '.'){
                return parseFloat(val)
            }
        }
        return 0
    }

    const onCancel = () => {
        if(!isLoading){
            props.onCancel()
        }
    }

    return (
        <Modal transparent={true}
        visible={props.isVisible}
        onRequestClose={props.onCancel}
        animationType='fade'>

            <TouchableWithoutFeedback onPress={onCancel} >
                <View style={styles.background}/>
            </TouchableWithoutFeedback>

            <View style={styles.mainContainer}>
                <View style={[styles.infoContainer, {
                    height: commonStyle.heighs.NewBudget.customContainer * 2,
                    paddingTop: commonStyle.spacers.padding.vertical
                    }]}>
                    <Text style={styles.textPlaceholder}>Observação:</Text>
                    <TextInput style={styles.textInput}
                    multiline={true}
                    numberOfLines={3}
                    placeholder='Observação da nota'
                    value={props.values.OBS}
                    onChangeText={(val) => props.setValue({OBS:val})}/>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.textPlaceholder}>Observação NFE:</Text>
                    <TextInput style={styles.textInput}
                    placeholder='Obervação para Nota Fiscal'
                    value={props.values.OBSNOTAFISCAL}
                    onChangeText={(val) => props.setValue({OBSNOTAFISCAL:val})}/>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.textPlaceholder}>Frete:</Text>
                    <TextInputMask style={styles.textInput}
                    keyboardType='phone-pad'
                    mask={"[999999].[99]"}
                    selectTextOnFocus={true}
                    value={props.values.VALORFRETE}
                    onChangeText={(val) => props.setValue({VALORFRETE:val})}
                    onBlur={() => props.setValue({VALORFRETE: (parseFloat(props.values.VALORFRETE).toFixed(2))})}
                    />
                </View>

                <View style={styles.totalValueContainer}>
                    <Text style={styles.labels}>Valor Final:</Text>
                    <Text style={styles.totalValue}>{
                    'R$ ' + (parseFloat(props.totalValue) + parseFrete(props.values.VALORFRETE)).toFixed(2)
                    }</Text>
                    <Text style={styles.labels}>{'Em ' + props.numItens + ' itens'}</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.error}]}
                                        onPress={() => {
                                            props.setValue({VALORFRETE: (parseFloat(props.values.VALORFRETE).toFixed(2))})
                                            onCancel()
                                            }}>
                        <Icon name='times' size={commonStyle.iconSizes.bigger} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.terciary}]}
                                        onPress={() => {
                                            setIsLoading(oldState => !oldState)
                                            Keyboard.dismiss()
                                            props.toBudgetScreenOnAdd(ToastRef)
                                        }}
                                        disabled={isLoading}>
                        {isLoading ?
                        <ActivityIndicator size="large" color={commonStyle.colors.primary} /> :
                        <Icon name='shopping-cart' size={commonStyle.iconSizes.bigger} color='white'/>
                        }
                    </TouchableOpacity>
                </View>

            </View>



            <TouchableWithoutFeedback onPress={onCancel} >
                <View style={styles.background}/>
            </TouchableWithoutFeedback>
            <Toast ref={(ref) => {ToastRef = ref}} style={{elevation:2}}/>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    mainContainer:{
        backgroundColor: commonStyle.colors.background,
        flex: 3
    },
    infoContainer:{
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
    textPlaceholder:{
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        paddingLeft: commonStyle.spacers.padding.horizontal,
    },
    textInput:{
        flex: 1,
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    buttonsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: commonStyle.colors.background
    },
    button:{
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: commonStyle.spacers.margin.vertical,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        height: commonStyle.heighs.buttons.height,
        width: commonStyle.heighs.buttons.width,
        borderRadius: commonStyle.borderRadius.main
    },
    totalValueContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalValue:{
        color: 'green',
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle * 2,
        fontWeight: 'bold',
    },
    labels:{
        paddingTop: commonStyle.spacers.padding.vertical,
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.listItem.secondaryText,
        color: 'gray'
    },
})