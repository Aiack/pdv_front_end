import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Text, ScrollView} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../../commonStyle'

export default props => {

    const numberWithCommas = (x) => {
        var parts = x.toString().split(".")
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return parts.join(".")
    }
    
    const getLayout = (dayly) => {
        column = 'month'
        if(dayly){
            column = 'today'
        }

        return (
            <View>
                <View>
                    <Text style={styles.descriptionText}>Vendas Totais</Text>
                    <Text style={[styles.DescriptionValue, {color:'green', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text>{props.data[column].totalSales}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Total vendas</Text>
                    <Text style={[styles.DescriptionValue, {color:'green', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].saleBruteTotal)}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Total vendas com comissão</Text>
                    <Text style={[styles.DescriptionValue, {color:'green', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].saleLiquidTotal)}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Desc. ou Acres. Nota</Text>
                    <Text style={[styles.DescriptionValue, {color:'green', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].saleBudgetDifer)}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Comissão das vendas total</Text>
                    <Text style={[styles.DescriptionValue, {color:'green', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].saleFinalComission)}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Devoluções Totais</Text>
                    <Text style={[styles.DescriptionValue, {color:'red', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text>{props.data[column].returns}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Total Devoluções</Text>
                    <Text style={[styles.DescriptionValue, {color:'red', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].returnBruteTotal)}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Total devoluões com comissão</Text>
                    <Text style={[styles.DescriptionValue, {color:'red', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].returnLiquidTotal)}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Desc. ou Acres. Nota</Text>
                    <Text style={[styles.DescriptionValue, {color:'red', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].returnBudgetDifer)}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionText}>Comissão das devoluões total</Text>
                    <Text style={[styles.DescriptionValue, {color:'red', fontSize: commonStyle.fontSize.pageTitle * 1.3}]}>
                        <Text style={{fontSize: commonStyle.fontSize.bodyText}}>{'R$ '}</Text>
                        <Text>{numberWithCommas(props.data[column].returnFinalComission)}</Text>
                    </Text>
                </View>
            </View>
        )
    }


    return (
        <Modal transparent={true}
        visible={props.isVisible}
        onRequestClose={props.onCancel}
        animationType='fade'>
            <TouchableWithoutFeedback onPress={props.onCancel} >
                <View style={styles.background}/>
            </TouchableWithoutFeedback>

            <View style={styles.mainContainer}>
                <ScrollView>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.columnContainer}>
                            <View style={styles.titleContainer}>
                                <Icon style={{alignSelf:'center'}} name='calendar-day' size={commonStyle.iconSizes.main} color={commonStyle.colors.alertColors.alert}/>
                                <Text style={styles.containerTitle}>Hoje</Text>     
                            </View>
                            {getLayout(true)}
                        </View>
                        <View style={styles.columnContainer}>
                            <View style={styles.titleContainer}>
                                <Icon style={{alignSelf:'center'}} name='calendar-alt' size={commonStyle.iconSizes.main} color={commonStyle.colors.alertColors.alert}/>
                                <Text style={styles.containerTitle}>Mês</Text>
                            </View>
                            {getLayout(false)}
                        </View>
                    </View>

                </ScrollView>

            </View>

            <TouchableWithoutFeedback onPress={props.onCancel} >
                <View style={styles.background}/>
            </TouchableWithoutFeedback>

        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    mainContainer:{
        backgroundColor: commonStyle.colors.background,
        flex: 5,
        flexDirection: 'row'
    },
    columnContainer:{
        flex: 1,
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical
    },
    titleContainer:{
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        paddingVertical: commonStyle.spacers.padding.vertical * 2,
        flexDirection:'row',
        alignItems: 'center'
    },
    containerTitle:{
        fontFamily: commonStyle.fontFamilyExtraBold,
        fontSize: commonStyle.fontSize.pageTitle,
        marginLeft: commonStyle.spacers.margin.horizontal,
        marginTop: commonStyle.spacers.margin.vertical,
        color: commonStyle.colors.alertColors.alert
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
})