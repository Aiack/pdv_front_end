import React, { useState, useEffect } from 'react'
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
import parsers from '../../utils/parsers'
import budgetListCalculation from '../../utils/budgetListCalculation'

import BudgetProduct from '../../components/budget/BudgetProduct'
import { CustomerSearchModal, CustomerSearchModalOnOpen} from '../../components/budget/CustomerSearchModal'
import CustomerCreateModal from '../../components/budget/CustomerCreateModal'
import ItemSearchModal from '../../components/budget/itemSearchModal'

import Toast from 'react-native-toast-message';

import portInfo from '../../utils/portInfo'
import axios from 'axios'

let ToastRef = null
let customerSeachModalRef = null

const pickerItens = [
    {label: 'Vai Levar', value: 'VaiLevar'},
    {label: 'Vem Avisar', value: 'VemAvisar'},
    {label: 'Entregar', value: 'Entregar'},
]

const CustomerinitialState = {
    NOMECLI: '',
    ENDERECO: '',
    BAIRRO: '',
    CIDADE: '',
    ESTADO: '',
    CEP: '',
    TELEFONE: '',
    CNPJ: '',
    CPF: '',
    INSCR: '',
    FLAGFISICA: 'Y',
    EMAIL: '',
    CONJFANTASIA: '',
    NUMEROLOGRADOURO: '',
    COMPLEMENTOLOGRADOURO: ''
}

export default props => {
    const [pickerItem, setPickerItem] = useState('VaiLevar')
    const [customer, setCustomer] = useState({
        fromDatabase:false,
        data:{...CustomerinitialState}
    })
    const [itemSearchInput, setItemSearchInput] = useState('')
    const [productIndex, setProductIndex] = useState(null)
    const [totalPrice, setTotalPrice] = useState('0.00')
    const [bugetItens, setBugetItens] = useState([])
    const [showCustomerSearchModal, setShowCustomerSearchModal] = useState(false)
    const [showCustomerCreateModal, setShowCustomerCreateModal] = useState(false)
    const [showItemSearchModal, setshowItemSearchModal] = useState(false)
    const [itemSearchResult, setItemSearchResult] = useState([])

    const [rerenderTest, setRerenderTest] = useState(false)


    const deleteBudgetItem = (index) => {
        console.log(index)
        newBudgetItens = [ ...bugetItens ]
        newBudgetItens.splice(index, 1)
        setBugetItens(newBudgetItens)
    }

    const addBudgetItem = (index) => {
        if(bugetItens.length){
            key = bugetItens[bugetItens.length - 1].key + 1
        }
        else{
            key = 1
        }
        newBudgetItens = [ ...bugetItens ]
        newBudgetItens.push({ ...itemSearchResult[index], key})
        setBugetItens(newBudgetItens)
        setshowItemSearchModal(false)
        setProductIndex(null)
    }

    const closeAllItens = () => {
        setProductIndex(null)
        setBugetItens(bugetItens)
    }

    const renderBudgetProduct = ({ item, index }) => {
        const isOpen = index === productIndex ? true : false

        const onChangeData = (newItem) => {
            newBudgetItens = [...bugetItens]
            newBudgetItens[index] = {...newBudgetItens[index], ...newItem}
            setBugetItens(newBudgetItens)
        }

        return (
            <BudgetProduct {...item}
                            onChangeData={onChangeData}
                            isOpen={isOpen}
                            index={index}
                            onPress={() => setProductIndex(index)}
                            onDelete={deleteBudgetItem}
                            closeItem={closeAllItens}/>
        )
        
    }

    useEffect(() => {
        totalValue = 0
        bugetItens.forEach((item) => {
            totalValue += parseFloat(item.VALORTOTAL)
        })
        setTotalPrice(totalValue.toFixed(2))
    }, [bugetItens])

    const itensListFromServer = async () => {
        try {
            const res = await axios({
                method: 'GET',
                url: (portInfo.port + 'products/'),
                params: {query: itemSearchInput},
                timeout: portInfo.timeout
            })
            setItemSearchResult(res.data)
            setshowItemSearchModal(true)
        }
        catch (error) {
            if (error.response) {
                errorMessage = error.response.data.message + ''
                errorError = error.response.data.error + ''
            } else if (error.request) {
                console.log(error.request)
                errorMessage = 'Erro'
                errorError = error.request['_response'] + ''
            } else {
                errorMessage = 'Erro'
                errorError = error.message + ''
            }
            Toast.setRef(ToastRef)
            Toast.show({
                text1: errorMessage,
                text2: errorError,
                type: 'error',
                position: 'bottom'
            })
            console.log(error)
            setItemSearchResult([])
        }
    }

    const setCustomerData = (data) => {
        setCustomer({
            fromDatabase: true,
            data:{...data}
        })
        setShowCustomerSearchModal(false)
    }

    const setCustomerCreateData = (data) => {
        setCustomer({
            fromDatabase: true,
            data:{...data}
        })
    }

    const changeToCustomerCreateModal = () => {
        setShowCustomerSearchModal(false)
        setShowCustomerCreateModal(true)
    }

    const throw10Percent = () => {
        newBudgetItens = [...bugetItens]
        calculatedBudgetItens = newBudgetItens.map((item, index) => {
            newItem = budgetListCalculation.recalculateBudgetList({ ...item, ALIQDESCONTOITEM: '10.00'}, 'discountAliquo')
            return {...newBudgetItens[index], ...newItem}
        })
        setProductIndex(null)
        setBugetItens([]) 
        setBugetItens(calculatedBudgetItens)
    }

    return (
        <View style={{flex:1, backgroundColor: commonStyle.colors.background}}>
            <CustomerSearchModal isVisible={showCustomerSearchModal} onSetCustomerData={setCustomerData}
                                onLongPress={(data) => {
                                    setCustomerData(data)
                                    changeToCustomerCreateModal()
                                }}
                                onCancel={() => setShowCustomerSearchModal(!showCustomerSearchModal)}
                                onCustomerCreate={changeToCustomerCreateModal}/>
            <CustomerCreateModal isVisible={showCustomerCreateModal} setCustomerCreateData={setCustomerCreateData} data={customer.data}
                                onCancel={() => setShowCustomerCreateModal(!showCustomerCreateModal)}/>
            <ItemSearchModal isVisible={showItemSearchModal} itemSearchResult={itemSearchResult}
                                onCancel={() => setshowItemSearchModal(!showItemSearchModal)} addBudgetItem={addBudgetItem}/>
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
                    <TouchableOpacity style={{flex: 1}} disabled={!customer.fromDatabase}
                    onLongPress={() => setCustomer({
                        fromDatabase: false,
                        data:{...CustomerinitialState}
                    })}
                    onPress={() => changeToCustomerCreateModal()}>
                        <TextInput style={styles.customerInput}
                                value={
                                    customer.fromDatabase ? 
                                    parsers.parseLongName(customer.data.NOMECLI) + ' - ' +  customer.data.CODIGO : 
                                    customer.data.NOMECLI}
                                onChangeText={val => setCustomer({ ...customer, data:{NOMECLI:val} })}
                                autoCapitalize='words'
                                placeholder='Nome do Cliente'
                                editable={!customer.fromDatabase}/>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity style={styles.customerIconContainer}
                                    onPress={() => {
                                        setShowCustomerSearchModal(!showCustomerSearchModal)
                                        CustomerSearchModalOnOpen()
                                        }}>
                    <Icon name='user-tag' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>
                </TouchableOpacity>
            </View>

            <View style={styles.productsContainer}>
                <View style={styles.itemSearchContainer}>
                    <TextInput style={styles.itemTextInput}
                                value={itemSearchInput}
                                onChangeText={text => setItemSearchInput(text)}
                                placeholder='Nome ou código do produto'
                                onSubmitEditing={itensListFromServer}
                                maxLength={50}
                                selectTextOnFocus={true}/>
                    <TouchableOpacity onPress={itensListFromServer}>
                        <Icon name='search' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>
                    </TouchableOpacity>
                </View>
                <FlatList data={bugetItens}
                        keyExtractor={(item, index) => item.key + ''}
                        renderItem={renderBudgetProduct}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
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
                onPress={() => closeAllItens()}
                onLongPress={() => throw10Percent()}>
                    <Icon name='shopping-cart' color='white' size={commonStyle.iconSizes.bigger}/>
                </TouchableOpacity>
            </View>
            <Toast ref={(ref) => {ToastRef = ref}} style={{elevation:2}}/>
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
        height: commonStyle.heighs.buttons.height,
        width: commonStyle.heighs.buttons.width,
        alignItems: 'center'
    },
    buyContainer:{
        paddingVertical: commonStyle.spacers.padding.horizontal,
        backgroundColor: commonStyle.colors.terciary,
        borderRadius: commonStyle.borderRadius.main,
        height: commonStyle.heighs.buttons.height,
        width: commonStyle.heighs.buttons.width,
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
        height: commonStyle.heighs.NewBudget.customContainer,
        borderColor: commonStyle.colors.separator
    },
    itemTextInput:{
        fontSize: commonStyle.fontSize.formText,
        flex: 1,
        fontFamily: commonStyle.fontFamily,
    }
})