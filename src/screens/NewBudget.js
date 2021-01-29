import React, { useState, useEffect } from 'react'
import {
    View,
    Text, 
    StyleSheet, 
    TextInput,
    TouchableOpacity,
    FlatList,
    Keyboard,
} from 'react-native'

import CustomPicker from '../components/customPicker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Autocomplete from 'react-native-autocomplete-input'

import commonStyle from '../commonStyle'
import parsers from '../utils/parsers'
import budgetListCalculation from '../utils/budgetListCalculation'
import CustomHeader from '../components/customHeader'

import BudgetProduct from '../components/NewBudget/BudgetProduct'
import CustomerSearchModal from '../components/NewBudget/customerSearch/CustomerSearchModal'
import CustomerCreateModal from '../components/NewBudget/customerCreate/CustomerCreateModal'
import TotalValueButtonsModal from '../components/NewBudget/totalValueButtonsModal/totalValueButtonsModal'
import ItemSearchModal from '../components/NewBudget/ItemSearch/itemSearchModal'
import ExtraInfoModal from '../components/NewBudget/extraInfo/extraInfoModal'

import Toast from 'react-native-toast-message';

import AxiosHelper from '../utils/axiosHelper'

const pickerItens = [
    {label:'Vai Levar', value:'000000035'},
    {label:'Vem Avisar', value:'000000025'},
    {label:'Entregar', value:'000000027'}
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

let ToastRef = null
let refBugetItens = []
let newItemkey = 0
let flatListRef = null
let scrollFlatListToEnd = false
let startTime = null
let fromBudget = ''

export default props => {
    const [pickerItem, setPickerItem] = useState('000000035')
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
    const [showTotalValueButton, setShowTotalValueButtons] = useState(false)
    const [showExtraInfoModal, setShowExtraInfoModal] = useState(false)
    const [itemSearchResult, setItemSearchResult] = useState([])
    const [extraInfo, setExtraInfo] = useState({
        OBS: '',
        OBSNOTAFISCAL: '',
        VALORFRETE: '0.00'
    })

    const addBudgetItem = (index) => {
        newItemkey += 1
        newBudgetItens = [ ...refBugetItens ]
        newBudgetItens.push({ ...itemSearchResult[index], key: newItemkey})
        refBugetItens = newBudgetItens
        scrollFlatListToEnd = true
        setBugetItens(refBugetItens)
        setshowItemSearchModal(false)
        setProductIndex(null)
    }

    const closeAllItens = () => {
        setProductIndex(null)
        setBugetItens(bugetItens)
    }

    const deleteBudgetItem = (key) => {
        index = refBugetItens.findIndex((item) => item.key === key)
        newBudgetItens = [ ...refBugetItens ]
        newBudgetItens.splice(index, 1)
        refBugetItens = newBudgetItens
        setBugetItens(refBugetItens)
    }

    const onChangeData = (newItem, key) => {
        index = refBugetItens.findIndex((item) => item.key === key)
        newBudgetItens = [ ...refBugetItens ]
        newBudgetItens[index] = {...newBudgetItens[index], ...newItem}
        refBugetItens = newBudgetItens
        setBugetItens(refBugetItens)
    }

    const renderBudgetProduct = ({ item, index }) => {
        const isOpen = item.key === productIndex ? true : false
        return (
            <BudgetProduct data={item}
                            onChangeData={onChangeData}
                            isOpen={isOpen}
                            deleteBudgetItem={deleteBudgetItem}
                            index={index}
                            setOpen={(key) => setProductIndex(key)}
                            closeItem={closeAllItens}/>
        )
    }

    useEffect(() => {
        totalValue = 0
        bugetItens.forEach((item) => {
            totalValue += parseFloat(item.VALORTOTAL)
        })
        setTotalPrice(totalValue.toFixed(2))
        if(scrollFlatListToEnd){
            setTimeout(() => {
                flatListRef.scrollToEnd()
                scrollFlatListToEnd = false
            }, 400);
        }
    }, [bugetItens])

    const itensListFromServer = async () => {
        try{
            const res = await AxiosHelper({
                method: 'GET',
                url: 'products/',
                params: {query: itemSearchInput},
            }, ToastRef)
            setItemSearchResult(res)
            setshowItemSearchModal(true)
        }
        catch{
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
            fromDatabase: data.fromDatabase,
            data:{...data.data}
        })
    }

    const changeToCustomerCreateModal = () => {
        setCustomer({
            fromDatabase:false,
            data:{...CustomerinitialState}
        })
        setShowCustomerSearchModal(false)
        setShowCustomerCreateModal(true)
    }

    const changeToCustomerAfterChange = (message, newData) => {
        setShowCustomerCreateModal(false)
        setCustomer({
            fromDatabase:true,
            data:{...newData}
        })
        Toast.setRef(ToastRef)
        Toast.show({
            text1: 'Sucesso',
            text2: message,
            type: 'success',
            position: 'bottom'
        })
    }

    const neogciate10percent = (remove = false) => {
        newBudgetItens = [...refBugetItens]
        calculatedBudgetItens = newBudgetItens.map((item, index) => {
            newItem = budgetListCalculation.recalculateBudgetList({
                ...item, ALIQDESCONTOITEM: remove ? '0.00' : '10.00'
                }, 'discountAliquo')
            return {...newBudgetItens[index], ...newItem}
        })
        setProductIndex(null)
        refBugetItens = calculatedBudgetItens
        setBugetItens([])
        setBugetItens(refBugetItens)
    }

    const deleteBudget = () => {
        setCustomer({
            fromDatabase:false,
            data:{...CustomerinitialState}
        })
        setItemSearchInput('')
        refBugetItens = []
        setBugetItens(refBugetItens)
        props.navigation.navigate('budget')
    }

    useEffect(() => {
        fromBudget = ''
        refBugetItens = []
        startTime = new Date();
            if(typeof props.route.params != 'undefined'){
                if(typeof props.route.params.budgetItensRes != 'undefined' && typeof props.route.params.customerRes != 'undefined'){
                    refBugetItens = props.route.params.budgetItensRes
                    refBugetItens = refBugetItens.map((item, index) => {return { ...item, key:index}})
                    newItemkey = refBugetItens.length
                    setBugetItens(refBugetItens)
                    if(typeof props.route.params.extraData === 'object'){
                        setExtraInfo(extraData)
                    }
                    if(props.route.params.CODTIPOMOVIMENTO){
                        setPickerItem(props.route.params.CODTIPOMOVIMENTO)
                    }
                    if(typeof props.route.params.customerRes === 'object'){
                        setCustomer({
                            fromDatabase:true,
                            data:{...props.route.params.customerRes}
                        })
                    }
                    else{
                        setCustomer({
                            fromDatabase:false,
                            data:{...CustomerinitialState, NOMECLI: props.route.params.customerRes}
                        })
                    }
                    fromBudget = props.route.params.fromBudget
                }
            }
    }, [])

    const toBudgetScreenOnAdd = async (ToastRefModal) => {
        endTime = new Date();
        const timeDiff = endTime - startTime
        if(bugetItens.length > 0){
            try {
                await AxiosHelper({
                    method: 'POST',
                    url: 'budget',
                    data: {data: JSON.stringify({
                        ...extraInfo,
                        TEMPO: timeDiff,
                        movimento: pickerItem,
                        customer,
                        products: refBugetItens,
                        fromBudget
                    })},
                }, ToastRefModal)
                setShowExtraInfoModal(!showExtraInfoModal)
                props.navigation.navigate('budget')
                props.route.params.onGoBack()
            } catch (error) {
                
            }
        }

    }

    return (
        <View style={{flex:1, backgroundColor: commonStyle.colors.background}}>
            <CustomHeader title={
                props.route.params.fromBudget ? 'Edição de orçamento' : 'Novo orçamento'
            } />
            <CustomerSearchModal isVisible={showCustomerSearchModal} onSetCustomerData={setCustomerData}
                                onLongPress={(data) => {
                                    setCustomerData(data)
                                    setShowCustomerSearchModal(false)
                                    setShowCustomerCreateModal(true)
                                }}
                                onCancel={() => setShowCustomerSearchModal(!showCustomerSearchModal)}
                                onCustomerCreate={changeToCustomerCreateModal}/>
            <CustomerCreateModal isVisible={showCustomerCreateModal} setCustomerCreateData={setCustomerCreateData} data={customer}
                                onCancel={() => setShowCustomerCreateModal(!showCustomerCreateModal)}
                                changeToCustomerAfterChange={changeToCustomerAfterChange}/>
            <ItemSearchModal isVisible={showItemSearchModal} itemSearchResult={itemSearchResult}
                                onCancel={() => setshowItemSearchModal(!showItemSearchModal)} addBudgetItem={addBudgetItem}/>
            <TotalValueButtonsModal isVisible={showTotalValueButton} onCancel={() => setShowTotalValueButtons(!showTotalValueButton)}
                                remove10Percent={() => neogciate10percent(true)} add10Percent={() => neogciate10percent(false)}/>
            <ExtraInfoModal isVisible={showExtraInfoModal} onCancel={() => setShowExtraInfoModal(!showExtraInfoModal)}
            values={extraInfo} setValue={(val) => setExtraInfo(oldState => { return { ...oldState, ...val }})}
            totalValue={totalPrice} numItens={refBugetItens.length} toBudgetScreenOnAdd={toBudgetScreenOnAdd}/>
            <View style={styles.containers}>
                <Text style={styles.containerPlaceholder}>Operação</Text>
                
                <CustomPicker items={pickerItens}
                defaultValue={pickerItem}
                onChangeItem={item => {setPickerItem(item)}}/>
            </View>

            <View style={styles.customerContainer}>
                <View style={styles.customerNameContainer}>
                    <Text style={styles.containerPlaceholder}>Cliente</Text>
                    <TouchableOpacity style={{flex: 1}} disabled={!customer.fromDatabase}
                    onLongPress={() => setCustomer({
                        fromDatabase: false,
                        data:{...CustomerinitialState}
                    })}
                    onPress={() => setShowCustomerCreateModal(true)}>
                        <TextInput style={styles.customerInput}
                                value={
                                    customer.fromDatabase ? 
                                    parsers.parseLongName(customer.data.NOMECLI) + ' - ' +  customer.data.CODIGO : 
                                    customer.data.NOMECLI}
                                onChangeText={val => setCustomer({ ...customer, data:{...customer.data, NOMECLI:val} })}
                                autoCapitalize='words'
                                placeholder='Nome do Cliente'
                                editable={!customer.fromDatabase}/>
                    </TouchableOpacity>

                </View>
                <TouchableOpacity style={styles.customerIconContainer}
                                    onPress={() => {
                                        setShowCustomerSearchModal(!showCustomerSearchModal)
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
                        keyExtractor={(item) => item.key + ''}
                        renderItem={renderBudgetProduct}
                        removeClippedSubviews={false}
                        ref={ref => {flatListRef = ref}}/>
            </View>

            <View style={styles.totalContainer}>
                <TouchableOpacity style={styles.trashContainer}
                onPress={deleteBudget}>
                    <Icon name='trash-alt' color='white' size={commonStyle.iconSizes.bigger}/>
                </TouchableOpacity>
                <TouchableOpacity style={{height: '100%'}} onLongPress={() => setShowTotalValueButtons(!showTotalValueButton)}>
                    <Text style={styles.totalValueText}>{'R$ ' + totalPrice}</Text>
                    <Text style={styles.totalItensText}>{bugetItens.length + ' itens'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyContainer}
                onPress={() => {
                    Keyboard.dismiss()
                    if(bugetItens.length > 0){
                        setShowExtraInfoModal(oldState => !oldState)
                    }
                    else{
                        Toast.setRef(ToastRef)
                        Toast.show({
                            text1: 'Alerta',
                            text2: 'Nenhum item adicionado!',
                            type: 'info',
                            position: 'bottom'
                        })
                    }
                    }}>
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
        alignItems: 'center',
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
    },
    tittleText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle * 1.4,
        fontWeight: 'bold',
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical
    },
})