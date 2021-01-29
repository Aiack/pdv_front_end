import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler'

import Icon from 'react-native-vector-icons/FontAwesome5'

import AxiosHelper from '../utils/axiosHelper'

import Toast from 'react-native-toast-message';

import commonStyle from '../commonStyle'
import ProductPriceItem from '../components/ItemSearch/ProductPriceItem'

let ToastRef = null

export default props => {
    const [itensList, setItensList] = useState(null)
    const [searchText, setSearchText] = useState('')
    
    const itensListFromServer = async () => {
        try{
            const res = await AxiosHelper({
                method: 'GET',
                url: 'products/',
                params: {query: searchText},
            }, ToastRef)
            setItensList(res)
        }
        catch{
            setItensList(null)
        }
    }

    const getMessageOrList = () => {
        if(itensList != null){
            if(itensList.length > 0){
                return (
                    <FlatList data={itensList} 
                        keyExtractor={item => item.CODIGO}
                        renderItem={({item}) => <ProductPriceItem {...item} isTouchable={false}/>}/>
                )
            }
            return (
                <View style={styles.messageContainer}>
                    <Icon name='exclamation-triangle' size={commonStyle.iconSizes.giant} color={commonStyle.colors.terciary}/>
                    <Text style={styles.messageText}>Item não encontrado!</Text>
                </View>
            )
        }

    }


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput style={styles.input} placeholder={"Nome ou código do produto"}
                value={searchText} onChangeText={(val) => setSearchText(val)}
                onSubmitEditing={itensListFromServer} maxLength={50}/>
                <TouchableOpacity onPress={itensListFromServer}>
                    <Icon name='search' color={commonStyle.colors.secondary} size={commonStyle.iconSizes.main}/>
                </TouchableOpacity>
            </View>
            <View style={styles.flatlistContainer}>
                {getMessageOrList()}
            </View>
            <Toast ref={(ref) => {ToastRef = ref}} style={{elevation:2}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: commonStyle.colors.background
    },
    searchContainer:{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: commonStyle.spacers.margin.vertical,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        elevation: 1,
        borderRadius: commonStyle.borderRadius.main
    },
    input:{
        fontSize: commonStyle.fontSize.formText,
        flex: 1,
        fontFamily: commonStyle.fontFamily,
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
    flatlistContainer:{
        flex: 1,
        backgroundColor: 'white',
        marginVertical: commonStyle.spacers.margin.vertical,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        borderRadius: commonStyle.borderRadius.main,
        elevation: 1
    }
})