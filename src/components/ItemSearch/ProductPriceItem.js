import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import * as Animateable from 'react-native-animatable'

import commonStyles from '../../commonStyle'

export default props => {
    const parseMaxDiscount = (value) => {
        if(value === '-1'){
            return '100'
        }
        return value
    }

    const parseUni = (value) => {
        if(value === 'None'){
            return 'UN'
        }
        return value
    }

    return (
        <TouchableOpacity style={styles.container} disabled={!props.isTouchable} onPress={() => props.addBudgetItem(props.index)}>
            <View style={styles.nameContainer}>
                <Text style={styles.cod}>{props.CODIGO + ', desc. max: ' + parseMaxDiscount(props.DESCMAXIMO) + ' %'}</Text>
                <Text style={styles.name} numberOfLines={2}>{props.NOMEPROD}</Text>
            </View>
            <View style={styles.valueConainer}>
                <Text style={styles.value}>{'R$ ' + props.VALORUNITARIO}</Text>
                <Text style={styles.name}>{'Estoque: ' + props.ESTATU + ' ' + parseUni(props.UNIDADE) + 's'}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        paddingHorizontal: commonStyles.spacers.padding.horizontal,
        paddingVertical: commonStyles.spacers.padding.vertical,
        borderBottomWidth: 1,
        borderBottomColor: commonStyles.colors.separator,
        height: commonStyles.heighs.NewBudget.customContainer * 1.5
    },
    nameContainer:{
        flex: 3,
    },
    valueConainer:{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cod:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.secondaryText,
        color: 'gray'
    },
    name:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.title,
        fontWeight: 'bold',
    },
    value:{
        fontFamily: commonStyles.fontFamily,
        textAlign: 'right',
        fontSize: commonStyles.fontSize.listItem.title * 1.3,
        fontWeight: 'bold',
        color: commonStyles.colors.alertColors.faturado
    }
})