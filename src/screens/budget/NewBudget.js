import React, { useState } from 'react'
import {
    View,
    Text, 
    StyleSheet, 
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native'

import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../../commonStyle'

import BudgetProduct from '../../components/budget/BudgetProduct'
import CustomerSeachModal from '../../components/budget/CustomerSearchModal'
import CustomerCreateModal from '../../components/budget/CustomerCreateModal'

import TestLists from '../../tmp/testLists'

const pickerItens = [
    {label: 'Vai Levar', value: 'VaiLevar'},
    {label: 'Vem Avisar', value: 'VemAvisar'},
    {label: 'Entregar', value: 'Entregar'},
]

bugetItensList = TestLists.bugetItens

export default props => {
    const [pickerItem, setPickerItem] = useState('Entregar')
    const [customer, setCustomer] = useState({
        fromDatabase:false,
        name:''
    })
    const [itemSearchInput, setItemSearchInput] = useState('')
    const [productIndex, setProductIndex] = useState(null)
    const [totalPrice, setTotalPrice] = useState('0.00')
    const [bugetItens, setBugetItens] = useState(bugetItensList)
    const [showCustomerSearchModal, setShowCustomerSearchModal] = useState(false)
    const [showCustomerCreateModal, setShowCustomerCreateModal] = useState(true)

    const deleteBudgetItem = (index) => {
        newBudgetItens = [ ...bugetItens ]
        newBudgetItens.splice(index, 1)
        setBugetItens(newBudgetItens)
    }

    const closeAllItens = () => {
        setProductIndex(null)
        setBugetItens(bugetItens)
    }

    const renderBudgetProduct = ({ item, index }) => {
        const isOpen = index === productIndex ? true : false

        const onChangeData = (index, newData) => {
            newBugetItem = bugetItens
            newBugetItem[index] = newData
            newTotalPrice = 0
            bugetItens.forEach((item) => {
                newTotalPrice += parseFloat(item.VALORTOTAL)
            })
            setBugetItens(newBugetItem)
            setTotalPrice(newTotalPrice.toFixed(2))
        }

        return (
            <BudgetProduct data={bugetItens[index]} 
                            index={index}
                            isOpen={isOpen} 
                            onPress={() => setProductIndex(index)}
                            onChangeData={onChangeData}
                            onDelete={deleteBudgetItem}
                            closeItem={closeAllItens}/>
        )
        
    }

    const changeToCustomerCreateModal = () => {
        setShowCustomerSearchModal(false)
        setShowCustomerCreateModal(true)
    }

    return (
        <View style={{flex:1, backgroundColor: commonStyle.colors.background}}>
            <CustomerSeachModal isVisible={showCustomerSearchModal} 
                                onCancel={() => setShowCustomerSearchModal(!showCustomerSearchModal)}
                                onCustomerCreate={changeToCustomerCreateModal}/>
            <CustomerCreateModal isVisible={showCustomerCreateModal} 
                                onCancel={() => setShowCustomerCreateModal(!showCustomerCreateModal)}/>
            <View style={styles.containers}>
                <Text style={styles.containerPlaceholder}>Operação</Text>
                <Picker selectedValue={pickerItem}
                        style={{flex:1}}
                        onValueChange={(item, index) => setPickerItem(item)}>
                    <Picker.Item label='Vai Levar' value='Vai Levar'/>
                    <Picker.Item label='Vem Avisar' value='VemAvisar'/>
                    <Picker.Item label='Entregar' value='Entregar'/>
                </Picker>
            </View>

            <View style={styles.customerContainer}>
                <View style={styles.customerNameContainer}>
                    <Text style={styles.containerPlaceholder}>Cliente</Text>
                    <TextInput style={styles.customerInput}
                            value={customer.name}
                            onChangeText={name => setCustomer({ ...customer, name })}
                            autoCapitalize='words'
                            placeholder='Nome do Cliente'/>
                </View>
                <TouchableOpacity style={styles.customerIconContainer}
                                    onPress={() => setShowCustomerSearchModal(!showCustomerSearchModal)}>
                    <Icon name='user-tag' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>
                </TouchableOpacity>
            </View>

            <View style={styles.productsContainer}>
                <View style={styles.itemSearchContainer}>
                    <TextInput style={styles.itemTextInput}
                                value={itemSearchInput}
                                onChangeText={text => setItemSearchInput(text)}
                                placeholder='Nome do item'/>
                    <Icon name='search' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>
                </View>
                <FlatList data={bugetItens}
                        keyExtractor={(item, index) => item.ITEMID + ''}
                        renderItem={renderBudgetProduct}
                        removeClippedSubviews={false}/>
            </View>

            <View style={styles.totalContainer}>
                <TouchableOpacity style={styles.trashContainer}>
                    <Icon name='trash-alt' color='white' size={commonStyle.iconSizes.bigger}/>
                </TouchableOpacity>
                <View>
                    <Text style={styles.totalValueText}>{'R$ ' + totalPrice}</Text>
                    <Text style={styles.totalItensText}>{bugetItens.length + ' itens'}</Text>
                </View>
                <TouchableOpacity style={styles.buyContainer}
                onPress={() => closeAllItens()}>
                    <Icon name='shopping-cart' color='white' size={commonStyle.iconSizes.bigger}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containers:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: commonStyle.spacers.margin.vertical,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        paddingHorizontal:commonStyle.spacers.padding.horizontal,
        borderRadius: commonStyle.borderRadius.main,
        height: commonStyle.heighs.NewBudget.customContainer,
        elevation:1
    },
    containerPlaceholder:{
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
    },
    pickerContainerText:{
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    customerInput:{
        flex: 1,
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    customerContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: commonStyle.spacers.margin.vertical,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        height: commonStyle.heighs.NewBudget.customContainer,
    },
    customerNameContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: commonStyle.borderRadius.main,
        height: commonStyle.heighs.NewBudget.customContainer,
        elevation:1,
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
    },
    customerIconContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: commonStyle.borderRadius.main,
        height: commonStyle.heighs.NewBudget.customContainer,
        elevation:1,
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        marginLeft: commonStyle.spacers.margin.horizontal
    },
    productsContainer:{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: commonStyle.borderRadius.main,
        elevation:1,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        paddingTop: commonStyle.spacers.padding.vertical
    },
    totalContainer:{
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        flexDirection: 'row',
        height: commonStyle.heighs.NewBudget.totalContainer,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    trashContainer:{
        paddingVertical: commonStyle.spacers.padding.horizontal,
        borderRadius: commonStyle.borderRadius.main,
        backgroundColor: '#ff4646',
        width: commonStyle.heighs.NewBudget.buttons,
        alignItems: 'center'
    },
    buyContainer:{
        paddingVertical: commonStyle.spacers.padding.horizontal,
        backgroundColor: commonStyle.colors.terciary,
        borderRadius: commonStyle.borderRadius.main,
        width: commonStyle.heighs.NewBudget.buttons,
        alignItems: 'center'
    },
    totalValueText:{
        fontFamily: commonStyle.fontFamily,
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        fontSize: commonStyle.fontSize.finalTotal
    },
    totalItensText:{
        fontFamily: commonStyle.fontFamily,
        textAlign: 'center',
        fontSize: commonStyle.fontSize.bodyText
    },
    itemSearchContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: commonStyle.colors.separator
    },
    itemTextInput:{
        fontSize: commonStyle.fontSize.formText,
        flex: 1,
        fontFamily: commonStyle.fontFamily,
    }
})