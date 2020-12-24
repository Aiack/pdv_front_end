import React, { useState } from 'react'
import {
    View,
    Text, 
    StyleSheet, 
    TextInput,
    TouchableOpacity
} from 'react-native'

import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../../commonStyle'

import BudgetProduct from '../../components/budget/BudgetProduct'

const pickerItens = [
    {label: 'Vai Levar', value: 'VaiLevar'},
    {label: 'Vem Avisar', value: 'VemAvisar'},
    {label: 'Entregar', value: 'Entregar'},
]

const bugetItens = [
    {
        CODPROD: '000000880',
        QUANTIDADE: 1,
        VALORUNITARIO: 9.99,
        ALIQDESCONTOITEM: 0,
        VALORDESCONTOITEM: 0,
        ALIQACRESCIMOITEM: 0,
        VALORACRESCIMOITEM:0,
        VALORTOTAL: 9
    }
]

export default props => {
    const [pickerItem, setPickerItem] = useState('Entregar')
    const [customer, setCustomer] = useState({
        fromDatabase:false,
        name:''
    })
    const [itemSearchInput, setItemSearchInput] = useState('')

    return (
        <View style={{flex:1}}>

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
                <TouchableOpacity style={styles.customerIconContainer}>
                    <Icon name='user-tag' color={commonStyle.colors.secondary} size={28}/>
                </TouchableOpacity>
            </View>

            <View style={styles.productsContainer}>
                <View style={styles.itemSearchContainer}>
                    <TextInput style={styles.itemTextInput}
                               value={itemSearchInput}
                               onChangeText={text => setItemSearchInput(text)}
                               placeholder='Nome do item'/>
                    <Icon name='search' color={commonStyle.colors.secondary} size={25}/>
                </View>
                <BudgetProduct/>
            </View>

            <View style={styles.totalContainer}>
                <TouchableOpacity style={styles.trashContainer}>
                    <Icon name='trash-alt' color='white' size={30}/>
                </TouchableOpacity>
                <View>
                    <Text style={styles.totalValueText}>R$ 25.000,00</Text>
                    <Text style={styles.totalItensText}>25 itens</Text>
                </View>
                <TouchableOpacity style={styles.buyContainer}>
                    <Icon name='shopping-cart' color='white' size={30}/>
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
        marginVertical: 5,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        height: 50,
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
        marginVertical: 5,
        marginHorizontal: 15,
    },
    customerNameContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        height: 50,
        elevation:1,
        paddingHorizontal: 10,
    },
    customerIconContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        height: 50,
        elevation:1,
        paddingHorizontal: 10,
        marginLeft: 10
    },
    productsContainer:{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        height: 60,
        elevation:1,
        marginHorizontal: 15,
        marginVertical: 5,
        paddingHorizontal: 10,
        paddingTop: 10
    },
    totalContainer:{
        paddingHorizontal: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        height: 100,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    trashContainer:{
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: '#ff4646',
        width: 100,
        alignItems: 'center'
    },
    buyContainer:{
        paddingVertical: 15,
        backgroundColor: commonStyle.colors.terciary,
        borderRadius: 10,
        width: 100,
        alignItems: 'center'
    },
    totalValueText:{
        fontFamily: commonStyle.fontFamily,
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold',
        fontSize: 30
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