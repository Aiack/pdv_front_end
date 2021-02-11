import React, { useState } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Text,
    ActivityIndicator
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'
import Axios from 'axios'

import AxiosHelper from '../../../utils/axiosHelper'

import commonStyle from '../../../commonStyle'
import FormItem from './FormItem'
import TypeOfFormButton from './TypeOfFormButton'

import Toast from 'react-native-toast-message';
let ToastRef = null


export default props => {
    const [inputErrors, setInputErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const onCustomerFlagPress = (flag) => {
        if(flag === 'Y'){
            setCustomerInfoFunc('Y', 'FLAGFISICA')
        }
        else{
            setCustomerInfoFunc('N', 'FLAGFISICA')
        }
    }

    const setCustomerInfoFunc = (data, varName) => {
        let newCustomerInfo = { ...props.data.data }
        newCustomerInfo[varName] = data
        props.setCustomerCreateData({
            fromDatabase: props.data.fromDatabase,
            data: newCustomerInfo
        })
    }

    const CNPJorCPF = () => {
        let attributes = null
        if(props.data.data.FLAGFISICA === 'Y'){
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
                mask: '[00].[000].[000]/[0000]-[00]',
                varName:'CNPJ',
                keyboardType: 'phone-pad',
                search: getDataFromCNPJ
            }
        }
        return (
            <View style={{flexDirection: 'row'}}>
                <FormItem data={props.data.data} flex={8} { ...attributes } setInfo={setCustomerInfoFunc}
                isError={inputErrors.includes(attributes.varName)}/>
                <FormItem data={props.data.data} flex={6} placeholder='Fone:' inputPlaceholder='(00)00000-0000' mask='([00])[00000]-[0000]'
                            setInfo={setCustomerInfoFunc} varName='TELEFONE' keyboardType='phone-pad'
                            isError={inputErrors.includes('TELEFONE')}/>
            </View>

        )
    }

    const customerOfCompany = () => {
        let attributes = null
        if(props.data.data.FLAGFISICA === 'Y'){
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
                <FormItem data={props.data.data} { ...attributes } setInfo={setCustomerInfoFunc} maxLength={50}
                isError={inputErrors.includes('NOMECLI')}/>
                {props.data.data.FLAGFISICA === 'Y' ? null : (
                    <FormItem data={props.data.data} placeholder='Nome Fantasia:' inputPlaceholder='Nome Fantasia da Empresa' maxLength={100}
                    setInfo={setCustomerInfoFunc} varName='CONJFANTASIA'/>
                )}
            </View>
        )
    }

    const validateCustomerCreate = () => {
        const getNumLen = (val) => {
            return val.replace(/[^a-zA-Z0-9]/g, "").length
        }

        const customer = { ...props.data.data }
        haveError = []
        if(getNumLen(customer.CEP) > 0 && getNumLen(customer.CEP) < 8){
            haveError.push('CEP')
        }
        if(getNumLen(customer.TELEFONE) > 0 && getNumLen(customer.TELEFONE) < 11){
            haveError.push('TELEFONE')
        }
        if(customer.FLAGFISICA === 'Y'){
            if(getNumLen(customer.CPF) > 0 && getNumLen(customer.CPF) < 11){
                haveError.push('CPF')
            }
        }
        else{
            if(getNumLen(customer.CNPJ) > 0 && getNumLen(customer.CNPJ) < 11){
                haveError.push('CNPJ')
            }
        }

        setInputErrors(haveError)
        
        if(haveError.length === 0){
            return false
        }
        Toast.setRef(ToastRef)
        Toast.show({
            text1: 'Erro',
            text2: 'Campo incompleto encontrado',
            type: 'error',
            position: 'bottom'
        })
        return true
    }

    const onCustomerCreateUpdate = async () => {
        if(validateCustomerCreate()){
            setIsLoading(false)
            return
        }

        let newCustomer = { ...props.data.data }
        for(key in newCustomer){
            newCustomer[key] = newCustomer[key].trim()
            
        }

        if(props.data.fromDatabase){
            method = 'POST'
        }
        else{
            method = 'PUT'
        }
        try{
            const res = await AxiosHelper({
                method: method,
                url: 'customer/',
                data: {data: JSON.stringify(newCustomer)},
            }, ToastRef)
            setIsLoading(false)
            props.changeToCustomerAfterChange(res.message, res.data)
        }
        catch (error) {
            setIsLoading(false)
            if(error.response){
                if(error.response.data){
                    if(error.response.data.data){
                        setInputErrors([error.response.data.data])
                    }
                }
            }
        }
    }

    const getDataFromCep = async () => {
        const cep = props.data.data.CEP.replace(/[^a-zA-Z0-9]/g, "")
        if(cep.length === 8){
            try {
                const res = await Axios({
                    url: 'https://viacep.com.br/ws/' + cep + '/json'
                })
                if(!res.data.error){
                    let newCustomerInfo = { ...props.data.data }
                    props.setCustomerCreateData({
                        fromDatabase: props.data.fromDatabase,
                        data: {...newCustomerInfo,
                            CIDADE:res.data.localidade.toUpperCase(),
                            ESTADO:res.data.uf.toUpperCase()}
                    })
                    return
                }
            } 
            catch (error) {
            }
        }
        Toast.setRef(ToastRef)
        Toast.show({
            text1: 'Erro',
            text2: 'Erro ao carregar CEP',
            type: 'error',
            position: 'bottom'
        })
    }

    const getDataFromCNPJ = async () => {
        const toUpperLimited = (text, maxChar) => {
            if(text){
                return text.toUpperCase().substr(maxChar)
            }
            return text
        }

        const cnpj = props.data.data.CNPJ.replace(/[^a-zA-Z0-9]/g, "")

        if(cnpj.length === 14){
            try {
                const res = await Axios({
                    url: 'https://www.receitaws.com.br/v1/cnpj/' + cnpj
                })
                const data = res.data
                if(data.status === "OK"){
                    let newCustomerInfo = { ...props.data.data }
                    props.setCustomerCreateData({
                        fromDatabase: props.data.fromDatabase,
                        data: {...newCustomerInfo,
                            NOMECLI: toUpperLimited(data.nome),
                            CONJFANTASIA: data.fantasia ?  toUpperLimited(data.fantasia) : toUpperLimited(data.nome),
                            ENDERECO: toUpperLimited(data.logradouro),
                            BAIRRO: toUpperLimited(data.bairro),
                            CIDADE: toUpperLimited(data.municipio),
                            ESTADO: toUpperLimited(data.uf),
                            CEP: toUpperLimited(data.cep).replace(/[^a-zA-Z0-9]/g, ""),
                            TELEFONE: toUpperLimited(data.telefone).replace(/[^a-zA-Z0-9]/g, ""),
                            EMAIL: toUpperLimited(data.email),
                            NUMEROLOGRADOURO: toUpperLimited(data.numero).replace(/[^a-zA-Z0-9]/g, ""),
                            COMPLEMENTOLOGRADOURO: toUpperLimited(data.complemento)
                        }
                    })
                    return
                }
            }
            catch (error) {
            }
        }
        Toast.setRef(ToastRef)
        Toast.show({
            text1: 'Erro',
            text2: 'Erro ao carregar CNPJ',
            type: 'error',
            position: 'bottom'
        })
    }

    return (
        <Modal transparent={true}
                visible={props.isVisible}
                onRequestClose={props.onCancel}
                animationType='none'
                onDismiss={() => setInputErrors([])}>
            <View style={styles.background}></View>

            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <TypeOfFormButton title='Física' flag={props.data.data.FLAGFISICA} onPress={onCustomerFlagPress}/>
                    <TypeOfFormButton title='Jurídica' flag={props.data.data.FLAGFISICA} onPress={onCustomerFlagPress}/>
                </View>
                <ScrollView style={{flex: 1}}>
                    <Text style={styles.title}>Informações Pessoais</Text>

                    {CNPJorCPF()}
                    {props.data.data.FLAGFISICA === 'Y' ? null : (
                        <FormItem data={props.data.data} placeholder='Inscrição Estadual' inputPlaceholder='000000000' mask= '[9999999999999]'
                        setInfo={setCustomerInfoFunc} varName='INSCR' keyboardType='phone-pad'/>
                    )}
                    {customerOfCompany()}

                    <Text style={styles.title}>Endereço</Text>
                    <View style={{flexDirection:'row'}}>
                        <FormItem data={props.data.data} flex={4} placeholder='Rua:' inputPlaceholder='Nome da Rua' maxLength={55}
                            setInfo={setCustomerInfoFunc} varName='ENDERECO'/>
                        <FormItem data={props.data.data} flex={1} placeholder='Nº:' inputPlaceholder='00' maxLength={10}
                            setInfo={setCustomerInfoFunc} varName='NUMEROLOGRADOURO' keyboardType='phone-pad'/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <FormItem data={props.data.data} flex={6} placeholder='Bairro:' inputPlaceholder='Nome do Bairro' maxLength={30}
                            setInfo={setCustomerInfoFunc} varName='BAIRRO'/>
                        <FormItem data={props.data.data} flex={4} placeholder='CEP:' inputPlaceholder='00.000-000' mask= '[00].[000]-[000]'
                            setInfo={setCustomerInfoFunc} varName='CEP' keyboardType='phone-pad' search={getDataFromCep}
                            isError={inputErrors.includes('CEP')}/>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <FormItem data={props.data.data} flex={2} placeholder='Cidade:' inputPlaceholder='Nome da Cidade' maxLength={40}
                            setInfo={setCustomerInfoFunc} varName='CIDADE'/>
                        <FormItem data={props.data.data} flex={1} placeholder='Estado:' inputPlaceholder='AA' maxLength={2}
                            setInfo={setCustomerInfoFunc} varName='ESTADO'/>
                    </View>
                    <FormItem data={props.data.data} placeholder='Complemento:' inputPlaceholder='Complemento de entrega' maxLength={50}
                            setInfo={setCustomerInfoFunc} varName='COMPLEMENTOLOGRADOURO'/>
                    <Text style={styles.title}>Informações Complementares</Text>
                    <FormItem data={props.data.data} placeholder='Email:' inputPlaceholder='cliente@empresa.com.br' maxLength={100}
                            setInfo={setCustomerInfoFunc} varName='EMAIL'/>

                    
                </ScrollView>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity disabled={isLoading} style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.error}]}
                                        onPress={props.onCancel}>
                        <Icon name='user-slash' size={commonStyle.iconSizes.bigger} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={isLoading} style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.faturado}]}
                                        onPress={() => {
                                            setIsLoading(true)
                                            onCustomerCreateUpdate()
                                            }}>
                        {isLoading ?
                            <ActivityIndicator size="large" color={'white'}/> : 
                            <Icon name='check' size={commonStyle.iconSizes.bigger} color='white'/>}
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