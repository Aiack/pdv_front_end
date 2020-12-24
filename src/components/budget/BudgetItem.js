import React from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyles from '../../commonStyle'

const formatValue = (value) => {
    const valueAr = value.split('.')
    if(valueAr.length === 1){
        return value + '.00'
    }
    else{
        if(valueAr[1].length == 1){
            return value + '0'
        }
    }
    return value
}

export default props => {
    let iconName = ''
    let statusColor = ''
    let textStatus = ''
    let codOrc = ''
    const getStatus = () => {
        props.CODORC === null ? codOrc = 'EM ESPERA ' : codOrc = props.CODORC

        if(props.DATAFATURADO != null){
            statusColor = commonStyles.colors.alertColors.faturado
            textStatus = 'Faturado'
            iconName = 'check-double'
        }
        else{
            if(props.sended){
                statusColor = commonStyles.colors.alertColors.enviado
                textStatus = 'Enviado'
                iconName = 'check'
            }
            else {
                statusColor = commonStyles.colors.alertColors.espera
                textStatus = 'Em espera'
                iconName = 'clock'
            }
        }
    }

    getStatus()

    return (
        <TouchableWithoutFeedback onLongPress={() => console.warn(props.CODORC)}>
            <View style={[styles.container, {borderLeftColor: statusColor}]}>
                <View style={{flexDirection:'column', flex: 8}}>
                    <Text style={styles.codigo}>{codOrc}</Text>
                    <Text style={styles.cliente}>{props.NOMECLI}</Text>
                    <Text style={styles.tipoMovimento}>{props.NOMETIPOMOVIMENTO}</Text>
                </View>
                <View style={{ flex: 3, paddingRight: 10}}>
                    <View style={styles.statusContainer}>
                        <Icon name={iconName} color={statusColor}/>
                        <Text style={[styles.statusText, {color:statusColor}]}>{textStatus}</Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Text style={styles.value}>{'R$ ' + formatValue(props.VALORTOTALPRODUTOS)}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 5,
        elevation: 2,
        backgroundColor: 'white',
        paddingLeft: 10,
        borderLeftWidth: 10,
        borderRadius: 10
    },
    codigo:{
        fontFamily: commonStyles.fontFamily,
        color: 'gray',
        fontSize: commonStyles.fontSize.listItem.secondaryText,
        paddingTop: 10
    },
    cliente:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.title,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    tipoMovimento:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.secondaryText,
        paddingBottom: 10
    },
    statusContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    statusText:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.errorText,
        marginLeft: 5
    },
    valueContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    value:{
        fontSize: commonStyles.fontSize.listItem.title,
        fontFamily: commonStyles.fontFamily,
        color: 'green',
        fontWeight: 'bold'
    }
})