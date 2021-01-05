import React, { useState, forwardRef } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'
import axios from 'axios'

import commonStyle from '../../commonStyle'
import CustomerItem from './Customeritem'
import portInfo from '../../utils/portInfo'

import Toast from 'react-native-toast-message';

let flatListRef = null
let ToastRef = null
let textInputRef = null

export let CustomerSearchModalOnOpen = () => {}

export const CustomerSearchModal = props => {
    const [customerSearchInput, setCustomerSearchInput] = useState('')
    const [customerList, setCustomerList] = useState([])

    const renderCustomerItem = ({item, index}) => {
        return (
            <CustomerItem {...item} index={index} setCustomerData={setCustomerData} onLongPress={onLongPress}/>
        )
    }

    const customerListFromServer = async () => {
        textInputRef.blur()
        try {
            const res = await axios({
                method: 'GET',
                url: (portInfo.port + 'customers/'),
                params: {query: customerSearchInput},
                timeout: portInfo.timeout
            })
            setCustomerList(res.data)
            flatListRef.scrollToOffset({ animated: true, offset: 0 });
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
            setCustomerList([])
        }
    }

    const onClose = () => {
        setCustomerSearchInput('')
        setCustomerList([])
        props.onCancel()
    }

    CustomerSearchModalOnOpen = async () => {
        await setTimeout(() => {
            if(textInputRef){
                textInputRef.focus()
            }
            setCustomerSearchInput('')
            setCustomerList([])
        }, 250)
    }

    const setCustomerData = (index) => {
        props.onSetCustomerData(customerList[index])
    }

    const onLongPress = (index) => {
        props.onLongPress(customerList[index])
    }

    return (
        <Modal transparent={true}
                visible={props.isVisible}
                onRequestClose={onClose}
                animationType='fade'>

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
                                        console.log(textInputRef)
                                        }}/>
                        <TouchableOpacity onPress={customerListFromServer}>
                            <Icon name='search' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>
                        </TouchableOpacity>
                    </View>
                    <FlatList style={styles.flatList}
                                ref={(ref) => {flatListRef = ref}}
                                data={customerList}
                                renderItem={renderCustomerItem}
                                keyExtractor={(item) => item.CODIGO}/>
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
    }
})