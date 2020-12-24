import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import commonStyle from '../../commonStyle'

import BudgetItem from '../../components/budget/BudgetItem'
import ButtonFilter from '../../components/budget/ButtonFilter'

import testLists from '../../tmp/testLists'

export default props => {
    const [itemList, setItemList] = useState()
    const [filterState, setFilterState] = useState({
        'FATURADO': true,
        'ENVIADO': true,
        'EM ESPERA': true,
        'ERRO': true
    })

    useEffect(() => {
        setItemList(addStatusToItemList(testLists.orcamentsList))
    }, [])

    const changeFilterState = (state) => {
        states = filterState
        states[state] = !filterState[state]
        setFilterState(states)

        list = addStatusToItemList(testLists.orcamentsList)
        list = list.filter((item) => {
            return filterState[item.status]
        })
        setItemList(list)
    }

    const addStatusToItemList = (listOfItens) => {
        let list = listOfItens
        list = list.map((item) => {
            if(item.DATAFATURADO != null){
                item['status'] = 'FATURADO'
                return item
            }
            else{
                if(item.sended){
                    item['status'] = 'ENVIADO'
                    return item
                }
                else {
                    item['status'] = 'EM ESPERA'
                    return item
                }
            }
        })
        return list
    }

    return (
        <View style={{flex:1}}>
            <View style={styles.filterContainer}>
                <ButtonFilter onClick={changeFilterState} iconName='check-double' color={commonStyle.colors.alertColors.faturado} text='FATURADO'/>
                <ButtonFilter onClick={changeFilterState} iconName='check' color={commonStyle.colors.alertColors.enviado} text='ENVIADO'/>
                <ButtonFilter onClick={changeFilterState} iconName='clock' color={commonStyle.colors.alertColors.espera} text='EM ESPERA'/>
                <ButtonFilter onClick={changeFilterState} iconName='exclamation' color={commonStyle.colors.alertColors.error} text='ERRO'/>
            </View>
            <View style={styles.container}>
                <FlatList data={itemList}
                            keyExtractor={item => item.ID}
                            renderItem={({item}) => <BudgetItem {...item}/>}/>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: commonStyle.colors.background
    },
    buttonContainer:{
        position: 'absolute',
        marginHorizontal: 0,
        backgroundColor: commonStyle.colors.terciary,
        alignSelf: 'center',
        bottom: 20,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 60
    },
    buttonText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    filterContainer:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: 10
    }
})