import React from 'react'
import { View, Modal, TouchableWithoutFeedback, StyleSheet, TouchableOpacity } from 'react-native'

import commonStyle from '../../../commonStyle'

import Icon from 'react-native-vector-icons/FontAwesome5'
import * as Animatable from 'react-native-animatable'

let plusRef = null
let minusRef = null

export default props => {

    const onCancel = () => {
        minusRef.bounceOut()
        plusRef.bounceOut()
        setTimeout(() => {
            props.onCancel()
        }, 500)
    }

    const playAnimation = () => {
        minusRef.bounceIn()
        plusRef.bounceIn()
    }

    return (
        <Modal transparent={true}
        visible={props.isVisible}
        onRequestClose={onCancel}
        animationType='none'
        onShow={playAnimation}>

        <TouchableWithoutFeedback onPress={onCancel} >
                <View style={{flex:1}}/>
        </TouchableWithoutFeedback>

        <View style={styles.mainContainer}>

            <TouchableOpacity onLongPress={() => props.remove10Percent()} onPress={props.roundValuesFunctionDown}>
                <Animatable.View ref={ref => {minusRef = ref}} style={styles.buttonContainer}>
                    <Icon name='minus' size={commonStyle.iconSizes.main} color={commonStyle.colors.alertColors.error}/>
                </Animatable.View>
            </TouchableOpacity>

            <TouchableOpacity onLongPress={() => props.add10Percent()} onPress={props.roundValuesFunctionUp}>
                <Animatable.View ref={ref => {plusRef = ref}} style={styles.buttonContainer}>
                    <Icon name='plus' size={commonStyle.iconSizes.main} color={commonStyle.colors.alertColors.faturado}/>
                </Animatable.View>
            </TouchableOpacity>
        </View>
            
        </Modal>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        position: 'absolute',
        alignSelf: 'center',
        bottom: commonStyle.heighs.NewBudget.totalContainer * 1.7,
        flexDirection: 'row'
    },
    buttonContainer:{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: commonStyle.heighs.NewBudget.totalPriceButton,
        width: commonStyle.heighs.NewBudget.totalPriceButton,
        borderRadius: commonStyle.heighs.NewBudget.totalPriceButton,
        borderWidth: 1,
        borderColor: commonStyle.colors.separator,
        elevation: 1,
        marginHorizontal: commonStyle.spacers.margin.horizontal
    }
})
