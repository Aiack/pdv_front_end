import React, { useState } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Text
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../../commonStyle'
import FormItem from '../../components/budget/FormItem'
import TypeOfFormButton from '../../components/budget/TypeOfFormButton'


export default props => {
    const [customerInfo, setCustomerInfo] = useState ({
        NOMECLI: '',
        ENDERECO: '',
        BAIRRO: '',
        CIDADE: '',
        ESTADO: '',
        CEP: '',
        TELEFONE: '',
        CNPJ: '',
        CPF: '',
        INSCR: '',
        FLAGFISICA: '',
        EMAIL: '',
        OBS: '',
        CONJFANTASIA: '',
        NUMEROLOGRADOURO: '',
        COMPLEMENTOLOGRADOURO: ''
    })

    return (
        <Modal transparent={true}
                visible={props.isVisible}
                onRequestClose={props.onCancel}
                animationType='none'>
            <View style={styles.background}></View>

            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <TypeOfFormButton />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>Informações Pessoais</Text>
                    <FormItem placeholder='Flex teste'/>
                    <View style={{flexDirection:'row'}}>
                        <FormItem flex={1} placeholder='Nome'/>
                        <FormItem flex={1} placeholder='Nome'/>
                    </View>
                    
                </View>
                <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.error}]}
                                                onPress={props.onCancel}>
                                <Icon name='user-slash' size={commonStyle.iconSizes.bigger} color='white'/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.faturado}]}
                                                onPress={() => props.onCustomerCreate()}>
                                <Icon name='check' size={commonStyle.iconSizes.bigger} color='white'/>
                            </TouchableOpacity>
                        </View>
            </View>

            <View style={styles.background}></View>
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
        width: '25%',
        height: commonStyle.heighs.BudgetProduct.customerButton,
        borderRadius: commonStyle.borderRadius.main
    },
    title:{
        fontSize: commonStyle.fontSize.pageTitle,
        fontFamily: commonStyle.fontFamily,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
    }
})