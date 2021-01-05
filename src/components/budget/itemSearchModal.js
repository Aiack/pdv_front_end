import React from 'react'
import { Modal, View, FlatList, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../../commonStyle'

import ProductPriceItem from '../../components/ItemSearch/ProductPriceItem'

export default props => {
    const getMessageOrList = () => {
        if(props.itemSearchResult.length > 0){
            return (
                <FlatList data={props.itemSearchResult}
                    keyExtractor={item => item.CODIGO}
                    renderItem={({item, index}) => <ProductPriceItem {...item} isTouchable={true}
                    index={index} addBudgetItem={props.addBudgetItem}/>}/>
            )
        }
        return (
            <View style={styles.messageContainer}>
                <Icon name='exclamation-triangle' size={commonStyle.iconSizes.giant} color={commonStyle.colors.terciary}/>
                <Text style={styles.messageText}>Item não encontrado!</Text>
            </View>
        )
    }

    return (
        <Modal transparent={true}
        visible={props.isVisible}
        onRequestClose={props.onCancel}
        animationType='none'>
            <TouchableWithoutFeedback onPress={props.onCancel}>
                <View style={styles.background} />
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <View style={styles.flatlistContainer}>
                    {getMessageOrList()}
                </View>
            </View>

            <TouchableWithoutFeedback onPress={props.onCancel}>
                <View style={styles.background} />
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container:{
        flex: 4,
        backgroundColor: commonStyle.colors.background
    },
    flatlistContainer:{
        flex: 1,
        backgroundColor: 'white',
        marginVertical: commonStyle.spacers.margin.vertical,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        borderRadius: commonStyle.borderRadius.main,
        elevation: 1
    },
    messageText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bigMessage,
        textAlign: 'center',
        color: commonStyle.colors.terciary
    },
    messageContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})