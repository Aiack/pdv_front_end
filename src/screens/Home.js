import React from 'react'
import { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text, Dimensions, TouchableOpacity, RefreshControl } from 'react-native'

import moment from 'moment'
import 'moment/locale/pt-br'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Wave from 'react-native-waveview'
import Toast from 'react-native-toast-message'

import DetailsModal from '../components/Home/Details'

import commonStyle from '../commonStyle'
import CustomHeader from '../components/customHeader'
import AxiosHelper from '../utils/axiosHelper'

const waterWaveHeigth = Dimensions.get('window').width * 0.45 * 1.25
let waterWaveRef = null
let ToastRef = null

const informationInitialState = {
    name: '',
    lastUpdate: '',
    salary: '0.00',
    salaryDate: '',
    comissionMult: '',
    today: {
        totalSales: "0",
        objective: "0.00",
        returns: "0",
        saleFinalComission: "0.00",
        saleBruteTotal: "0.00",
        saleLiquidTotal: "0.00",
        saleBudgetDifer: "0.00",
        returnFinalComission: "0.00",
        returnBruteTotal: "0.00",
        returnLiquidTotal: "0.00",
        returnBudgetDifer: "0.00",
        finalComission: "0.00"
    },
    month: {
        totalSales: "0",
        objective: "0.00",
        returns: "0",
        saleFinalComission: "0.00",
        saleBruteTotal: "0.00",
        saleLiquidTotal: "0.00",
        saleBudgetDifer: "0.00",
        returnFinalComission: "0.00",
        returnBruteTotal: "0.00",
        returnLiquidTotal: "0.00",
        returnBudgetDifer: "0.00",
        finalComission: "0.00"
    },
    notice: " \"\""
}

export default props => {
    const [information, setInformation] = useState({ ...informationInitialState })
    const [objectiveData, setObjectiveData] = useState({
        totalSales: '0',
        comission: '0.00',
        objective: '0.00',
    })
    const [todayButton, setTodayButton] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        getDataFromServer()
    }
    const [isDetailsModal, setIsDetailsModal] = useState(false)

    const getDataFromServer = async () => {
        try{
            const res = await AxiosHelper({
                method: 'GET',
                url: 'userinfo',
            }, ToastRef)
            setRefreshing(false)
            setInformation(res)
        }
        catch{
            setRefreshing(false)
        }
    }

    useEffect(()=> {
        getDataFromServer()
    }, [])

    const changeObjectiveData = () => {
        if(todayButton){
            if(parseFloat(information.today.objective) === 0){
                percent = 0
            }
            else{
                percent = parseFloat(information.today.finalComission) / parseFloat(information.today.objective)
            }
            setObjectiveData({ ...information.today })
            if(waterWaveRef){

                waterWaveRef.setWaterHeight(waterWaveHeigth * percent)
            }
        }
        else{
            if(parseFloat(information.month.objective) === 0){
                percent = 0
            }
            else{
                percent = parseFloat(information.month.finalComission) / parseFloat(information.month.objective)
            }
            setObjectiveData({ ...information.month })
            if(waterWaveRef){
                waterWaveRef.setWaterHeight(waterWaveHeigth * percent)
            }
        }
    }

    useEffect(() => {
        changeObjectiveData()
    }, [todayButton])

    useEffect(() => {
        if(todayButton){
            changeObjectiveData()
        }
        else{
            setTodayButton(false)
        }
    }, [information])

    const capitalizeFirstLetter = (str) => {
        var splitStr = str.toLowerCase().split(' ')
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)  
        }
        return splitStr.join(' ')
    }

    return (
        <View style={styles.mainContainer}>
            <DetailsModal isVisible={isDetailsModal} onCancel={() => setIsDetailsModal(!isDetailsModal)} data={{...information}}/>
            <CustomHeader title={'Home'}/>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <Text style={styles.welcomeText}>
                    <Text style={{fontFamily: commonStyle.fontFamilyExtraBold}}>{'Bem vindo, '}</Text>
                    <Text style={{fontFamily: commonStyle.fontFamilyExtraBoldItalic}}>{capitalizeFirstLetter(information.name.toLowerCase())}</Text>
                </Text>
                <Text style={styles.welcomeText}>Minha comissão atual é:</Text>
                <TouchableOpacity onPress={() => setIsDetailsModal(!isDetailsModal)}
                    style={{height: commonStyle.heighs.BudgetProduct.main * 0.7, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{textAlign: 'center'}}>
                        <Text style={[styles.nameText, {color:'green', fontSize:commonStyle.fontSize.pageTitle}]}>
                            {'R$ '}
                        </Text>
                        <Text style={[styles.nameText, {
                            color:'green', fontSize:commonStyle.fontSize.pageTitle * 2.3,
                            fontFamily: commonStyle.fontFamilyExtraBold
                            }]}>
                            {information.month.finalComission}
                        </Text>
                        <Text style={[styles.nameText, {color:'black', fontSize:commonStyle.fontSize.pageTitle}]}>
                            {' x' + information.comissionMult}
                        </Text>
                    </Text>
                </TouchableOpacity>


                
                <View style={{justifyContent: 'space-evenly', flexDirection: 'row'}}>
                    <View style={styles.basicContainer}>
                        <View style={styles.containerBox}>
                            <Icon style={{alignSelf:'center'}} name='money-bill' size={commonStyle.iconSizes.main} color={commonStyle.colors.alertColors.alert}/>
                            <Text style={styles.containerTitle}>Sálario</Text>
                        </View>
                        
                        <View>
                            <View>
                                <Text style={styles.descriptionText}>Sálario Fixo:</Text>
                                <Text style={[styles.DescriptionValue, {color:'green'}]}>
                                    <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                                    <Text>{information.salary}</Text>
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.descriptionText}>Salário Final</Text>
                                <Text style={[styles.DescriptionValue, {color:'green', fontSize: commonStyle.fontSize.pageTitle * 1.5}]}>
                                    <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                                    <Text>{(parseFloat(information.salary) + parseFloat(information.month.finalComission)).toFixed(2)}</Text>
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.DescriptionValue, {color:'gray',
                                fontSize: commonStyle.fontSize.pageTitle * .7, textAlign: 'right',
                                paddingHorizontal: commonStyle.spacers.padding.horizontal * 1.8}]}>
                                    <Text>{
                                    'Fecha ' + moment(information.salaryDate).fromNow()
                                    }</Text>
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={styles.basicContainer}>
                        <View style={{position:'absolute', height: '100%', width: '100%'}}>
                            <Wave
                                style={styles.waveBall}
                                H={waterWaveHeigth * 0}
                                waveParams={commonStyle.waveProperty}
                                animated={true}
                                ref={(ref) => {waterWaveRef = ref}}
                            />
                        </View>
                        <View>
                            <View style={styles.containerBox}>
                                <Icon style={{alignSelf:'center'}} name='crosshairs' size={commonStyle.iconSizes.main} color={commonStyle.colors.alertColors.alert}/>
                                <Text style={styles.containerTitle}>Objetivo</Text>
                            </View>
                            <View style={styles.objectiveButtonsContainer}>
                                <TouchableOpacity 
                                    style={[styles.objectiveButton, {
                                    backgroundColor: todayButton ? 'rgba(0, 175, 145, 0.6)' : 'rgba(232, 234, 230, 0.6)'
                                }]}
                                    onPress={() => setTodayButton(true)}>
                                    <Text style={styles.objectiveButtonText}>Hoje</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.objectiveButton, {
                                        backgroundColor: !todayButton ? 'rgba(0, 175, 145, 0.6)' : 'rgba(232, 234, 230, 0.6)'
                                    }]}
                                    onPress={() => setTodayButton(false)}>
                                    <Text style={styles.objectiveButtonText}>Mês</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.descriptionText}>Vendas fechadas</Text>
                            <Text style={[styles.DescriptionValue, {color:commonStyle.colors.alertColors.alert}]}>
                                <Text>{objectiveData.totalSales}</Text>
                            </Text>
                            <Text style={styles.descriptionText}>Concluído</Text>
                            <Text style={[styles.DescriptionValue, {fontSize: commonStyle.fontSize.pageTitle * 1.5}]}>
                                <Text style={{color:'green'}}>{objectiveData.finalComission}</Text>
                                <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'/' + objectiveData.objective}</Text>
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={styles.noticesContainer}>
                        <View style={styles.containerBox}>
                            <Icon style={{alignSelf:'center'}} name='bell' size={commonStyle.iconSizes.main} color={commonStyle.colors.alertColors.alert}/>
                            <Text style={styles.containerTitle}>Aviso</Text>
                        </View>
                        <Text style={styles.noticeText}>{eval(information.notice)}</Text>
                    </View>
                </View>

            </ScrollView>
            <Text style={styles.lastUpdateText}>{
                'Ultima atualização: ' + moment(information.lastUpdate).startOf('hour').fromNow()
                }</Text>
            <Toast ref={(ref) => {ToastRef = ref}} style={{elevation:2}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor: commonStyle.colors.background
    },
    lastUpdateText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.modalText,
        textAlign: 'right',
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
        color: 'gray'
    },
    welcomeText:{
        fontSize: commonStyle.fontSize.pageTitle * 1,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical
    },
    nameText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle * 1.4,
        fontWeight: 'bold',
        marginHorizontal: commonStyle.spacers.margin.horizontal * 2,
        marginVertical: commonStyle.spacers.margin.vertical
    },
    basicContainer:{
        backgroundColor: 'white',
        width: '45%',
        aspectRatio: 0.8,
        borderRadius: commonStyle.borderRadius.plusMinusButtons,
        justifyContent: 'space-between',
    },
    noticesContainer:{
        backgroundColor: 'white',
        borderRadius: commonStyle.borderRadius.plusMinusButtons,
        width: '93%',
        height: commonStyle.heighs.home.noticeWindow,
        marginVertical: commonStyle.spacers.margin.vertical * 4
        },
    descriptionText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bodyText,
        marginLeft: commonStyle.spacers.margin.horizontal,
        marginTop: commonStyle.spacers.margin.vertical,
        fontWeight: 'bold'
    },
    DescriptionValue:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bodyText * 1.4,
        fontWeight: 'bold',
        marginLeft: commonStyle.spacers.margin.horizontal * 2
    },
    containerTitle:{
        fontFamily: commonStyle.fontFamilyExtraBold,
        fontSize: commonStyle.fontSize.pageTitle,
        marginLeft: commonStyle.spacers.margin.horizontal,
        marginTop: commonStyle.spacers.margin.vertical,
        color: commonStyle.colors.alertColors.alert
    },
    containerBox:{
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        paddingVertical: commonStyle.spacers.padding.vertical * 2,
        flexDirection:'row',
        alignItems: 'center'
    },
    waveBall: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: commonStyle.borderRadius.plusMinusButtons
    },
    objectiveButtonsContainer:{
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    objectiveButton:{
        height: commonStyle.heighs.buttons.height * 0.5,
        aspectRatio: 1.6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: commonStyle.borderRadius.main,
        marginLeft: commonStyle.spacers.margin.horizontal,
    },
    objectiveButtonText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bodyText,
    },
    noticeText:{
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bodyText,
        textAlign: 'justify',
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        paddingVertical: commonStyle.spacers.padding.vertical
    }
})
