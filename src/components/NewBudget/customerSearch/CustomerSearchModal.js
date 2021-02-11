import React, { useState, useEffect } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    TouchableWithoutFeedback,
    Text,
    ActivityIndicator
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import AxiosHelper from '../../../utils/axiosHelper'

import commonStyle from '../../../commonStyle'
import CustomerItem from './Customeritem'

import Toast from 'react-native-toast-message';

let flatListRef = null
let ToastRef = null
let textInputRef = null

export default props => {
    const [customerSearchInput, setCustomerSearchInput] = useState('')
    const [customerList, setCustomerList] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const renderCustomerItem = ({item, index}) => {
        return (
            <CustomerItem {...item} index={index} setCustomerData={setCustomerData} onLongPress={onLongPress}/>
        )
    }

    useEffect(() => {
        if(customerList && flatListRef){
            flatListRef.scrollToOffset({ animated: true, offset: 0 });
        }
    }, [customerList])

    const customerListFromServer = async () => {
        textInputRef.blur()
        try{
            const res = await AxiosHelper({
                method: 'GET',
                url: 'customers/',
                params: {query: customerSearchInput},
            }, ToastRef)
            setIsLoading(false)
            setCustomerList(res)
        }
        catch{
            setIsLoading(false)
            setCustomerList([])
        }
    }

    const onClose = () => {
        setCustomerSearchInput('')
        setCustomerList(null)
        props.onCancel()
    }

    const setCustomerData = (index) => {
        props.onSetCustomerData(customerList[index])
    }

    const onLongPress = (index) => {
        props.onLongPress(customerList[index])
    }

    const getMessageOrList = () => {
        if(customerList != null){
            if(customerList.length > 0){
                return (
                    <FlatList style={styles.flatList}
                    ref={(ref) => {flatListRef = ref}}
                    data={customerList}
                    renderItem={renderCustomerItem}
                    keyExtractor={(item) => item.CODIGO}/>
                )
            }
            return (
                <View style={styles.messageContainer}>
                    <Icon name='user-times' size={commonStyle.iconSizes.giant} color={commonStyle.colors.terciary}/>
                    <Text style={styles.messageText}>Nenhum cliente encontrado!</Text>
                </View>
            )
        }
        return (
            <View style={styles.messageContainer}/>
        )
    }

    return (
        <Modal transparent={true}
                visible={props.isVisible}
                onRequestClose={onClose}
                animationType='fade'
                onShow={() => {
                    textInputRef.focus()
                    setCustomerSearchInput('')
                    setCustomerList(null)
                }}>

            <TouchableWithoutFeedback onPress={onClose} >
                <View style={styles.background}/>
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <View style={styles.customerSearchContainer}>
                        <TextInput style={styles.customerTextInput}
                                    value={customerSearchInput}
                                    onChangeText={text => setCustomerSearchInput(text)}
                                    placeholder='Nome do cliente'
                                    onSubmitEditing={customerListFromServer}
                                    ref={(ref) => {
                                        textInputRef = ref
                                        }}/>
                        <TouchableOpacity disabled={isLoading} onPress={() => {
                                setIsLoading(true)
                                customerListFromServer()
                                }}>
                            {isLoading ?
                                <ActivityIndicator size="large" color={commonStyle.colors.secondary}/> :
                                <Icon name='search' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>}
                        </TouchableOpacity>
                    </View>
                    {getMessageOrList()}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.error}]}
                                            onPress={onClose}>
                            <Icon name='user-slash' size={commonStyle.iconSizes.bigger} color='white'/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, {backgroundColor: commonStyle.colors.alertColors.alert}]}
                                            onPress={() => props.onCustomerCreate()}>
                            <Icon name='user-plus' size={commonStyle.iconSizes.bigger} color='white'/>
                        </TouchableOpacity>
            
                    </View>
                    
            </View>
            
            <TouchableWithoutFeedback onPress={onClose} >
                <View style={styles.background}/>
            </TouchableWithoutFeedback>

            <Toast ref={(ref) => {ToastRef = ref}} style={{elevation:2}}/>
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
    },
    messageContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bigMessage,
        textAlign: 'center',
        color: commonStyle.colors.terciary
    },
})