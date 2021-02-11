import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyles from '../../commonStyle'

import parsers from '../../utils/parsers'

const formatValue = (value) => {
    if(value){
        const valueAr = value.split('.')
        if(valueAr.length === 1){
            return value + '.00'
        }
        else{
            if(valueAr[1].length == 1){
                return value + '0'
            }
        }
    }
    return value
}

const BudgetItem = props => {
    let iconName = ''
    let statusColor = ''
    let textStatus = ''
    const getStatus = () => {
        if(props.data.DATAFATURADO != "None"){
            statusColor = commonStyles.colors.alertColors.faturado
            textStatus = 'Faturado'
            iconName = 'check-double'
        }
        else{
            if(props.data.QNTPRODS === '0'){
                statusColor = commonStyles.colors.alertColors.alert
                textStatus = 'REFEITO'
                iconName = 'retweet'
            }
            else{
                statusColor = commonStyles.colors.alertColors.enviado
                textStatus = 'Enviado'
                iconName = 'check'
            }
        }
    }

    getStatus()

    const isOpen = () => {
        if(props.isOpen){
            return (
                null
            )
        }
        return null
    }

    return (
        <TouchableOpacity onLongPress={() => props.onLongPressBudgetItem(props.data.CODORC)}>
            <View style={[styles.container, {borderLeftColor: statusColor}]}>
                <View style={{flexDirection:'column', flex: 8}}>
                    <Text style={styles.codigo}>
                        <Text>{'Cod: '}</Text>
                        <Text style={{fontWeight:'bold',
                            color:'black',
                            fontSize: commonStyles.fontSize.listItem.secondaryText * 1.3}}>
                                {parseInt(props.data.NUMEROORCAMENTO) + ' '}</Text>
                        <Text>{parsers.parseDate(props.data.DATA) + ' ' + props.data.HORA}</Text>
                    </Text>
                    <Text style={styles.cliente}>{
                        props.data.NOMECLI != '' || props.data.NOMECLI != 'None' ?
                        (props.data.CODCLI != 'None' ? parseInt(props.data.CODCLI) + ' - ' : '') + 
                        (props.data.NOMECLI.length > 22 ? props.data.NOMECLI.substr(0, 22) + '...' : props.data.NOMECLI)
                        : '...'
                    }</Text>
                    <Text style={styles.tipoMovimento}>{props.data.NOMETIPOMOVIMENTO}</Text>
                </View>
                <View style={{ flex: 4, paddingRight: 10}}>
                    <View style={styles.statusContainer}>
                        <Icon name={iconName} color={statusColor}/>
                        <Text style={[styles.statusText, {color:statusColor}]}>{textStatus}</Text>
                    </View>
                    <View style={[styles.valueContainer]}>
                        <Text style={[styles.value, {color: statusColor}]}>{'R$ ' + formatValue(props.data.VALORTOTALORCAMENTO)}</Text>
                    </View>
                </View>
            </View>
            {isOpen()}
            {/* <View style={[styles.openMore, {borderLeftColor: statusColor}]}>
                <Icon name={props.isOpen ? 'chevron-up' : 'chevron-down'} size={commonStyles.iconSizes.main * .5}/>
            </View> */}
        </TouchableOpacity>
    )
}

const isEqual = (prevProps, nextProps) => {
    const isDataEqual = JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
    const isOpenEqual = prevProps.isOpen === nextProps.isOpen
    return isDataEqual && isOpenEqual
}

export default React.memo(BudgetItem, isEqual)


const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        backgroundColor: 'white',
        borderLeftWidth: 10,
        paddingHorizontal: commonStyles.spacers.padding.horizontal,
        paddingVertical: commonStyles.spacers.padding.vertical,
        borderBottomWidth: 1,
        borderBottomColor: commonStyles.colors.separator,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    codigo:{
        fontFamily: commonStyles.fontFamily,
        color: 'gray',
        fontSize: commonStyles.fontSize.listItem.secondaryText,
    },
    cliente:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.title,
        fontWeight: 'bold',
    },
    tipoMovimento:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.secondaryText,
    },
    statusContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.errorText,
    },
    valueContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    value:{
        fontSize: commonStyles.fontSize.listItem.title * 1.3,
        fontFamily: commonStyles.fontFamily,
        color: 'green',
        fontWeight: 'bold'
    },
    openMore:{
        alignItems: 'center',
        borderLeftWidth: 10
    }
})