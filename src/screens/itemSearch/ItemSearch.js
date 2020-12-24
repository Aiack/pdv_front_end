import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { FlatList, TextInput } from 'react-native-gesture-handler'

import Icon from 'react-native-vector-icons/FontAwesome5'
import commonStyle from '../../commonStyle'

import ProductPriceItem from '../../components/ItemSearch/ProductPriceItem'

import TestList from '../../tmp/testLists'

export default props => {
    let testList = TestList.productsList

    const getMessageOrList = () => {
        if(testList.length > 0){
            return (<FlatList data={testList} 
                             keyExtractor={item => item.CODIGO}
                             renderItem={({item}) => <ProductPriceItem {...item}/>}/>)
        }
        return (
            <View style={styles.messageContainer}>
                <Icon name='exclamation-triangle' size={100} color={commonStyle.colors.terciary}/>
                <Text style={styles.messageText}>Item não encontrado!</Text>
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput style={styles.input}/>
                <Icon name='search' color={commonStyle.colors.secondary} size={25}/>
            </View>
            {getMessageOrList()}
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
        marginVertical: 5,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        elevation: 2,
        borderRadius: 10
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
        fontSize: 50,
        textAlign: 'center',
        color: commonStyle.colors.terciary
    }
})