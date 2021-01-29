import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, RefreshControl, FlatList, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../commonStyle'

import AxiosHelper from '../utils/axiosHelper'

import BudgetItem from '../components/budget/BudgetItem'
import ButtonFilter from '../components/budget/ButtonFilter'
import CustomHeader from '../components/customHeader'

import Toast from 'react-native-toast-message';
let ToastRef = null
let flatListRef = null
let onEndReachedCalledDuringMomentum = false

export default props => {
    const [itemList, setItemList] = useState(null)
    const [filterState, setFilterState] = useState({
        'FATURADO': true,
        'ENVIADO': true,
        'REFEITO': true,
    })
    const [refreshing, setRefreshing] = useState(false)
    const [openItemIndex, setOpenItemIndex] = useState(1)
    const [flatListLoading, setFlatListLoading] = useState(false)
    const [page, setPage] = useState(1)

    const getBudgetsFromServer = async () => {
        try{
            const res = await AxiosHelper({
                method: 'GET',
                url: 'budgets/',
                params: {page, filters: filterState},
            }, ToastRef)
            setFlatListLoading(false)
            setRefreshing(false)
            if(page === 1){
                setItemList(res)
            }
            else{
                setItemList(prevState => prevState.concat(res))
            }
        }
        catch{
            setRefreshing(false)
            setFlatListLoading(false)
        }
    }

    useEffect(() => {
        setPage(1)
    }, [])

    useEffect(() => {
        onGobackFromAddNew()
    }, [filterState])

    const onRefresh = () => {
        setRefreshing(true)
        if(page != 1){
            setPage(1)
        }
        else{
            getBudgetsFromServer()
        }        
    }

    useEffect(() => {
        getBudgetsFromServer()
    }, [page])

    const renderBudgetItem = ({item, index}) => {
        const isOpen = openItemIndex === index ? true : false
        return (
            <BudgetItem data={{...item}} isOpen={isOpen} onLongPressBudgetItem={onLongPressBudgetItem}/>
        )
    }

    const changeScreenToNewBudget = () => {
        props.navigation.navigate('newBudget', {onGoBack: onGobackFromAddNew})
    }

    const onLongPressBudgetItem = async (CODORC) => {
        budgetItem = itemList.find(item => item.CODORC === CODORC)
        extraData={
            OBS: budgetItem.OBS === 'None' ? '' : budgetItem.OBS,
            OBSNOTAFISCAL: budgetItem.OBSNOTAFISCAL === 'None' ? '' : budgetItem.OBSNOTAFISCAL,
            VALORFRETE: parseFloat(budgetItem.VALORFRETE).toFixed(2)
        }
        try{
            if(budgetItem.CODCLI != 'None'){
                const res = await AxiosHelper({
                    method: 'GET',
                    url: 'customer/',
                    params: {query: budgetItem.CODCLI},
                }, ToastRef)
                customerRes = res
            }
            else{
                customerRes = budgetItem.NOMECLI
            }
            const budgetItensRes = await AxiosHelper({
                method: 'GET',
                url: 'orcamentoprod/',
                params: {query: budgetItem.CODORC},
            }, ToastRef)
            console.log(budgetItem)
            props.navigation.navigate('newBudget', {
                customerRes,
                budgetItensRes,
                extraData,
                CODTIPOMOVIMENTO: budgetItem.CODTIPOMOVIMENTO,
                onGoBack: onGobackFromAddNew,
                fromBudget: budgetItem.CODORC
            })
        }
        catch{
        }
    }

    const loadMoreOnEndList = () => {
        setFlatListLoading(true)
        setPage(oldState => oldState + 1)
    }

    const renderFoot = () => {
        return (
            <View style={{marginVertical: commonStyle.spacers.margin.vertical, alignItems: 'center'}}>
                <ActivityIndicator size="large" color={commonStyle.colors.secondary}/>
            </View>
        )
    }

    const onGobackFromAddNew = () => {
        flatListRef.scrollToOffset({offset:0, animated: true})
        if(page != 1){
            setPage(1)
        }
        else{
            setRefreshing(true)
            getBudgetsFromServer()
        }    
    }

    const renderEmptyList = () => {
        return(
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Icon name='creative-commons-nc' size={commonStyle.iconSizes.giant} color={commonStyle.colors.terciary}/>
                <Text style={styles.messageText}>Nenhum orçamento ainda hoje!</Text>
            </View>
            
        )
    }

    return (
        <View style={{flex:1, backgroundColor: commonStyle.colors.background}}>
            <CustomHeader title={'Meus orçamentos'}/>
            <View style={styles.filterContainer}>
                <ButtonFilter onClick={
                    () => setFilterState(oldState => {return {...oldState, FATURADO:!oldState.FATURADO}})
                    } iconName='check-double' color={commonStyle.colors.alertColors.faturado} text='FATURADO'/>
                <ButtonFilter onClick={
                    () => setFilterState(oldState => {return {...oldState, ENVIADO:!oldState.ENVIADO}})
                    } iconName='check' color={commonStyle.colors.alertColors.enviado} text='ENVIADO'/>
                <ButtonFilter onClick={
                    () => setFilterState(oldState => {return {...oldState, REFEITO:!oldState.REFEITO}})
                    } iconName='retweet' color={commonStyle.colors.alertColors.alert} text='REFEITO'/>
            </View>
            <View style={styles.flatlistContainer}>
                <FlatList data={itemList}
                            keyExtractor={item => item.CODORC}
                            ListEmptyComponent={renderEmptyList}
                            renderItem={renderBudgetItem}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                            onEndReached={() => {
                                if(!onEndReachedCalledDuringMomentum) {
                                    loadMoreOnEndList()
                                    onEndReachedCalledDuringMomentum = true
                                }
                            }}
                            onEndReachedThreshold={0.1}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={60}
                            initialNumToRender={30}
                            ListFooterComponent={flatListLoading ? renderFoot : null}
                            ref={ref => {flatListRef = ref}}
                            onMomentumScrollBegin={() => {onEndReachedCalledDuringMomentum = false}}/>
            </View>
            <Toast ref={(ref) => {ToastRef = ref}} style={{elevation:5}}/>
            <TouchableOpacity style={styles.buttonContainer} onPress={changeScreenToNewBudget}>
                    <Icon name='plus' size={commonStyle.iconSizes.bigger} color='white'/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    flatlistContainer:{
        flex: 1,
        marginVertical: commonStyle.spacers.margin.vertical,
        borderRadius: commonStyle.borderRadius.main,
    },
    buttonContainer:{
        position: 'absolute',
        backgroundColor: commonStyle.colors.terciary,
        alignSelf: 'flex-end',
        bottom: commonStyle.spacers.padding.horizontal * 2,
        right: commonStyle.spacers.padding.horizontal,
        padding: commonStyle.spacers.padding.horizontal,
        justifyContent: 'center',
        alignItems: 'center',
        width: commonStyle.heighs.buttons.height * 1.2,
        height: commonStyle.heighs.buttons.height * 1.2,
        borderRadius: commonStyle.heighs.buttons.height,
        elevation: 2
    },
    buttonText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bigMessage,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    filterContainer:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: commonStyle.spacers.margin.horizontal
    },
    messageText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bigMessage / 2,
        textAlign: 'center',
        color: commonStyle.colors.terciary
    },
})