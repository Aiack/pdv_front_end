import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import parsers from '../../utils/parsers'
import commonStyles from '../../commonStyle'


export default props => {
    const setComplemento = (complemento) => {
        if(complemento){
            return complemento
        }
        return 'SEM COMPLEMENTO'
    }

    const setNumLogra = (num) => {
        if(num){
            return num
        }
        return 'S/N'
    }

    const setBoderColor = (flag) => {
        if(flag === 'S'){
            return commonStyles.colors.alertColors.faturado
        }
        return commonStyles.colors.alertColors.error
    }

    const CNPJorCPF = (flag) => {
        if(flag === 'S'){
            return parsers.parseCPF(props.CPF)
        }
        return parsers.parseCNPJ(props.CNPJ)
    }


    return (
        <TouchableOpacity style={[styles.container, {borderLeftColor: setBoderColor(props.FLAGFISICA)}]}>
            <View style={styles.dataContainer}>
                <Text style={styles.cod}>{props.CODIGO + ', criado ' + parsers.parseDate(props.DATCAD)}</Text>
                <Text style={styles.NOMECLI}>{props.NOMECLI}</Text>
                <Text style={styles.NOMECLI}>{CNPJorCPF(props.FLAGFISICA) + ', FONE: ' + props.TELEFONE}</Text>
                <Text style={styles.adresstext}>{props.ENDERECO + ' Nº ' + setNumLogra(props.NUMEROLOGRADOURO)}</Text>
                <Text style={styles.adresstext}>{props.BAIRRO}</Text>
                <Text style={styles.adresstext}>{setComplemento(props.COMPLEMENTOLOGRADOURO)}</Text>
                <Text style={styles.adresstext}>{props.CIDADE + ', ' + props.ESTADO + ' - ' + parsers.parseCEP(props.CEP)}</Text>
            </View>
            <View style={styles.iconContainer}>
                <Icon name='chevron-right' color={commonStyles.colors.terciary} size={commonStyles.iconSizes.main}/>
            </View>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        borderBottomWidth: 1,
        borderBottomColor: commonStyles.colors.separator,
        backgroundColor: 'white',
        flexDirection: 'row',
        marginHorizontal: commonStyles.spacers.margin.horizontal,
        borderLeftWidth: 10,
        paddingLeft: commonStyles.spacers.padding.horizontal,
        paddingBottom: commonStyles.spacers.padding.vertical
    },
    NOMECLI:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.title,
        fontWeight: 'bold',
    },
    dataContainer:{
        flex: 1,
    },
    iconContainer:{
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cod:{
        paddingTop: commonStyles.spacers.padding.vertical,
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.secondaryText,
        color: 'gray'
    },
    adresstext:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.secondaryText,
    }
})