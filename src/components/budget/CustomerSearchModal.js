import React, { useState } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../../commonStyle'
import testLists from '../../tmp/testLists'
import CustomerItem from './Customeritem'

const tempCustomerList = testLists.customerList

export default props => {
    const [customerSearchInput, setCustomerSearchInput] = useState('')
    const [customerList, setCustomerList] = useState(tempCustomerList)

    const renderCustomerItem = ({item}) => {
        return (
            <CustomerItem {...item} />
        )
    }

    return (
        <Modal transparent={true}
                visible={props.isVisible}
                onRequestClose={props.onCancel}
                animationType='fade'>
            <View style={styles.background}></View>

            <View style={styles.container}>
                <View style={styles.customerSearchContainer}>
                        <TextInput style={styles.customerTextInput}
                                    value={customerSearchInput}
                                    onChangeText={text => setCustomerSearchInput(text)}
                                    placeholder='Nome do cliente'/>
                        <Icon name='search' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>
                    </View>
                    <FlatList style={styles.flatList}
                                data={customerList}
                                renderItem={renderCustomerItem}
                                keyExtractor={(item) => item.CODIGO}/>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.error}]}
                                            onPress={props.onCancel}>
                            <Icon name='user-slash' size={commonStyle.iconSizes.bigger} color='white'/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.alert}]}
                                            onPress={() => props.onCustomerCreate()}>
                            <Icon name='user-plus' size={commonStyle.iconSizes.bigger} color='white'/>
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
        flex: 4,
        backgroundColor: 'white'
    },
    customerSearchContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: commonStyle.colors.separator,
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical
    },
    customerTextInput:{
        fontSize: commonStyle.fontSize.formText,
        flex: 1,
        fontFamily: commonStyle.fontFamily,
    },
    flatList:{
        flex: 1,
        borderBottomWidth: 1,
        borderColor: commonStyle.colors.separator,
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
    }
})