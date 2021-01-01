import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import commonStyle from '../../commonStyle'

export default props => {
    if(props.isSelected){
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.sphere}/>
            <Text style={styles.title}>Física</Text>    
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height: commonStyle.heighs.NewBudget.buttons / 2,
        width: commonStyle.heighs.NewBudget.buttons,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: commonStyle.colors.separator,
        borderRadius: commonStyle.borderRadius.main,
        backgroundColor: 'white'
    },
    sphere:{
        height: 15,
        width: 15,
        borderRadius: 15,
        borderWidth: 1,
        marginRight: commonStyle.spacers.margin.horizontal
    },
    title:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle
    }

})
