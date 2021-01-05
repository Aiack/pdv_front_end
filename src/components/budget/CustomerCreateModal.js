import React, { useState, useEffect } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Text
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'
import axios from 'axios'
import portInfo from '../../utils/portInfo'

import commonStyle from '../../commonStyle'
import FormItem from '../../components/budget/FormItem'
import TypeOfFormButton from '../../components/budget/TypeOfFormButton'

import Toast from 'react-native-toast-message';
let ToastRef = null


export default props => {
    const onCustomerFlagPress = (flag) => {
        console.log(flag)
        if(flag === 'Y'){
            setCustomerInfoFunc('Y', 'FLAGFISICA')
        }
        else{
            setCustomerInfoFunc('N', 'FLAGFISICA')
        }
    }

    const setCustomerInfoFunc = (data, varName) => {
        newCustomerInfo = { ...props.data }
        newCustomerInfo[varName] = data
        props.setCustomerCreateData(newCustomerInfo)
    }

    const CNPJorCPF = () => {
        let attributes = null
        if(props.data.FLAGFISICA === 'Y'){
            attributes = {
                placeholder:'CPF:',
                inputPlaceholder:'000.000.000-00',
                mask: '[000].[000].[000]-[00]',
                varName:'CPF',
                keyboardType: 'phone-pad'
            }
        }
        else{
            attributes = {
                placeholder:'CNPJ:',
                inputPlaceholder:'00.000.000/0000-00',
                mask: '[00].[000].[000]/[0000]-00',
                varName:'CPF',
                keyboardType: 'phone-pad'
            }
        }
        return (
            <View style={{flexDirection: 'row'}}>
                <FormItem data={props.data} flex={1} { ...attributes } setInfo={setCustomerInfoFunc}/>
                <FormItem data={props.data} flex={1} placeholder='Fone:' inputPlaceholder='(00)00000-0000' mask='([00])[00000]-[0000]'
                            setInfo={setCustomerInfoFunc} varName='TELEFONE' keyboardType='phone-pad'/>
            </View>

        )
    }

    const customerOfCompany = () => {
        let attributes = null
        if(props.data.FLAGFISICA === 'Y'){
            attributes = {
                placeholder:'Nome:',
                inputPlaceholder:'Nome do cliente',
                varName:'NOMECLI',
            }
        }
        else{
            attributes = {
                placeholder:'Nome:',
                inputPlaceholder:'Nome da empresa',
                varName:'NOMECLI',
            }
        }
        return (
            <View>
                <FormItem data={props.data} { ...attributes } setInfo={setCustomerInfoFunc} maxLength={50}/>
                {props.data.FLAGFISICA === 'Y' ? null : (
                    <FormItem data={props.data} placeholder='Nome Fantasia:' inputPlaceholder='Nome Fantasia da Empresa' maxLength={100}
                    setInfo={setCustomerInfoFunc} varName='CONJFANTASIA'/>
                )}
            </View>
        )
    }

    const onCustomerCreateUpdate = async () => {
        console.log(props.data)
        try {
            const res = await axios({
                method: 'POST',
                url: (portInfo.port + 'customer'),
                data: {data: JSON.stringify(props.data)},
                timeout: portInfo.timeout
            })
        }
        catch (error) {
            if (error.response) {
                errorMessage = error.response.data.message + ''
                errorError = error.response.data.error + ''
            } else if (error.request) {
                console.log(error.request)
                errorMessage = 'Erro'
                errorError = error.request['_response'] + ''
            } else {
                errorMessage = 'Erro'
                errorError = error.message + ''
            }
            Toast.setRef(ToastRef)
            Toast.show({
                text1: errorMessage,
                text2: errorError,
                type: 'error',
                position: 'bottom'
            })
            console.log(error.response)
        }
    }

    return (
        <Modal transparent={true}
                visible={props.isVisible}
                onRequestClose={props.onCancel}
                animationType='none'>
            <View style={styles.background}></View>

            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TypeOfFormButton title='Física' flag={props.data.FLAGFISICA} onPress={onCustomerFlagPress}/>
                    <TypeOfFormButton title='Jurídica' flag={props.data.FLAGFISICA} onPress={onCustomerFlagPress}/>
                </View>
                <ScrollView style={{flex: 1}}>
                    <Text style={styles.title}>Informações Pessoais</Text>

                    {CNPJorCPF()}
                    {props.data.FLAGFISICA === 'Y' ? null : (
                        <FormItem data={props.data} placeholder='Inscrição Estadual' inputPlaceholder='000.000.000' mask= '[000].[000].[000]'
                        setInfo={setCustomerInfoFunc} varName='INSCR' keyboardType='phone-pad'/>
                    )}
                    {customerOfCompany()}

                    <Text style={styles.title}>Endereço</Text>
                    <View style={{flexDirection:'row'}}>
                        <FormItem data={props.data} flex={4} placeholder='Rua:' inputPlaceholder='Nome da Rua' maxLength={55}
                            setInfo={setCustomerInfoFunc} varName='ENDERECO'/>
                        <FormItem data={props.data} flex={1} placeholder='Nº:' inputPlaceholder='00' maxLength={10}
                            setInfo={setCustomerInfoFunc} varName='NUMEROLOGRADOURO' keyboardType='phone-pad'/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <FormItem data={props.data} flex={2} placeholder='Bairro:' inputPlaceholder='Nome do Bairro' maxLength={30}
                            setInfo={setCustomerInfoFunc} varName='BAIRRO'/>
                        <FormItem data={props.data} flex={1} placeholder='CEP:' inputPlaceholder='00.000-00' mask= '[00].[000]-[00]'
                            setInfo={setCustomerInfoFunc} varName='CEP' keyboardType='phone-pad'/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <FormItem data={props.data} flex={2} placeholder='Cidade:' inputPlaceholder='Nome da Cidade' maxLength={40}
                            setInfo={setCustomerInfoFunc} varName='CIDADE'/>
                        <FormItem data={props.data} flex={1} placeholder='Estado:' inputPlaceholder='AA' maxLength={2}
                            setInfo={setCustomerInfoFunc} varName='ESTADO'/>
                    </View>
                    <FormItem data={props.data} placeholder='Complemento:' inputPlaceholder='Complemento de entrega' maxLength={50}
                            setInfo={setCustomerInfoFunc} varName='COMPLEMENTOLOGRADOURO'/>
                    <Text style={styles.title}>Informações Complementares</Text>
                    <FormItem data={props.data} placeholder='Email:' inputPlaceholder='cliente@empresa.com.br' maxLength={100}
                            setInfo={setCustomerInfoFunc} varName='EMAIL'/>

                    
                </ScrollView>
                <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.error}]}
                                                onPress={props.onCancel}>
                                <Icon name='user-slash' size={commonStyle.iconSizes.bigger} color='white'/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.faturado}]}
                                                onPress={() => onCustomerCreateUpdate()}>
                                <Icon name='check' size={commonStyle.iconSizes.bigger} color='white'/>
                            </TouchableOpacity>
                        </View>
            </View>

            <View style={styles.background}></View>
            <Toast ref={(ref) => {ToastRef = ref}} style={{elevation:2}}/>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container:{
        flex: 20,
        backgroundColor: commonStyle.colors.background,
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
        height: commonStyle.heighs.buttons.height,
        width: commonStyle.heighs.buttons.width,
        borderRadius: commonStyle.borderRadius.main
    },
    title:{
        fontSize: commonStyle.fontSize.pageTitle,
        fontFamily: commonStyle.fontFamily,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
    }
})