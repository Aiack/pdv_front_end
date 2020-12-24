import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import * as Animateable from 'react-native-animatable'

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
    return (
        <Animateable.View  animation='bounceIn' delay={props.delay}>
            <View style={styles.container}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{props.NOMEPROD}</Text>
                    <Text style={styles.cod}>{props.CODIGO}</Text>
                </View>
                <View style={styles.valueConainer}>
                    <Text style={styles.value}>{'R$ ' + formatValue(props.PRECO)}</Text>
                </View>
            </View>
        </Animateable.View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        marginHorizontal: 15,
        marginVertical: 5,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 10
    },
    nameContainer:{
        flex: 3,
        paddingLeft: 10,
        paddingVertical: 10
    },
    valueConainer:{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
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
        paddingBottom: 10
    },
    value:{
        fontFamily: commonStyles.fontFamily,
        textAlign: 'right',
        fontSize: commonStyles.fontSize.listItem.title,
        fontWeight: 'bold',
        color: 'green'
    }
})