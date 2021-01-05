import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import TextInputMask from 'react-native-text-input-mask'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyles from '../../commonStyle'
import budgetListCalculation from '../../utils/budgetListCalculation'
import parsers from '../../utils/parsers'

export default props => {
    const [itemPrice, setItemPrice] = useState(props.VALORUNITARIO)
    const [totalPrice, setTotalPrice] = useState(props.VALORTOTAL)
    const [quantity, setQuantity] = useState(props.QUANTIDADE)
    const [discountValue, setDiscountValue] = useState(props.VALORDESCONTOITEM)
    const [discountAliquo, setDiscountAliquo] = useState(props.ALIQDESCONTOITEM)
    const [acrescValue, setAcrescValue] = useState(props.VALORACRESCIMOITEM)
    const [acrescAliquo, setAcrescAliquo] = useState(props.ALIQACRESCIMOITEM)

    console.log("props: " + props.VALORUNITARIO + ', itemPrice: ' + itemPrice)

    const updateList = (changeBy, value=null) => {
        updatedItem = {
            PRECOTABELA: props.PRECOTABELA,
            VALORUNITARIO: itemPrice,
            VALORTOTAL: totalPrice,
            QUANTIDADE: value && changeBy === 'quantity' ? value : quantity,
            VALORDESCONTOITEM: discountValue,
            ALIQDESCONTOITEM: value && changeBy === 'discountAliquo' ? value : discountAliquo,
            VALORACRESCIMOITEM: acrescValue,
            ALIQACRESCIMOITEM: value && changeBy === 'acrescAliquo' ? value : acrescAliquo,
            DESCMAXIMO: props.DESCMAXIMO,
            updateCounter: props.updateCounter
        }

        calculatedItem = budgetListCalculation.recalculateBudgetList(updatedItem, changeBy)
        setItemPrice(calculatedItem.VALORUNITARIO)
        setTotalPrice(calculatedItem.VALORTOTAL)
        setQuantity(calculatedItem.QUANTIDADE)
        setDiscountValue(calculatedItem.VALORDESCONTOITEM)
        setDiscountAliquo(calculatedItem.ALIQDESCONTOITEM)
        setAcrescValue(calculatedItem.VALORACRESCIMOITEM)
        setAcrescAliquo(calculatedItem.ALIQACRESCIMOITEM)
        props.onChangeData(calculatedItem)
    }

    const isOpen = () => {
        if(props.isOpen){
            return (
            <View style={styles.mainButtonContainer}>
            <View style={{height: commonStyles.heighs.BudgetProduct.priceChangers}}>
                <View style={{flex:1}}>
                    <Text style={[styles.descriptionText, {textAlign:'center'}]}>Quant.</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={[styles.plusMinusContainer, , styles.minusBorder]}
                                        onPress={() => {
                                            quantityValue = parseFloat(quantity) > 1 ? (parseFloat(quantity) - 1).toFixed(1) : '1.0'
                                            updateList('quantity', quantityValue)
                                            }}
                                        onLongPress={() => {
                                            quantityValue = '1.0'
                                            updateList('quantity', quantityValue)
                                        }}>
                            <Text style={styles.plusMinusButtons}>-</Text>
                        </TouchableOpacity>
                        <TextInputMask
                                style={styles.textInputSelectors}
                                keyboardType='phone-pad'
                                defaultValue={quantity}
                                mask={"[999999].[9]"}
                                selectTextOnFocus={true}
                                onChangeText={(val) => setQuantity(val)}
                                onBlur={() => {
                                    updateList('quantity')
                                }}
                                textAlign='center'
                        />
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.plusBorder]}
                                        onPress={() => {
                                            quantityValue = (parseFloat(quantity) + 1).toFixed(1)
                                            updateList('quantity', quantityValue)
                                            }}>
                            <Text style={styles.plusMinusButtons}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{flexDirection:'row',}}>
            <View style={{flex:1}}>
                    <Text style={[styles.descriptionText, {textAlign:'center'}]}>Acres.</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.minusBorder]}
                                        onPress={() => {
                                            acrescAliquoValue = parseFloat(acrescAliquo) - 1 >= 0 ? (parseFloat(acrescAliquo) - 1).toFixed(2) : null
                                            updateList('acrescAliquo', acrescAliquoValue)
                                            }}
                                        onLongPress={() => {
                                            acrescAliquoValue = parseFloat(acrescAliquo) - 10 >= 0 ? (parseFloat(acrescAliquo) - 10).toFixed(2) : '0.00'
                                            updateList('acrescAliquo', acrescAliquoValue)
                                        }}
                                            >
                            <Text style={styles.plusMinusButtons}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.textInputSelectors}> R$</Text>
                        <TextInputMask
                                style={styles.textInputSelectors}
                                keyboardType='phone-pad'
                                defaultValue={acrescValue}
                                mask={"[9999].[99]"}
                                selectTextOnFocus={true}
                                onChangeText={(val) => setAcrescValue(val)}
                                onBlur={() => {
                                    updateList('acrescValue')
                                }}
                                textAlign='center'
                        />
                        <Text style={styles.textInputSelectors}>%</Text>
                        <TextInputMask
                                style={styles.textInputSelectors}
                                keyboardType='phone-pad'
                                defaultValue={acrescAliquo}
                                mask={"[99].[99]"}
                                selectTextOnFocus={true}
                                onChangeText={(val) => setAcrescAliquo(val)}
                                onBlur={() => {
                                    updateList('acrescAliquo')
                                }}
                                textAlign='center'
                        />
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.plusBorder]}
                                        onPress={() => {
                                            acrescAliquoValue = (parseFloat(acrescAliquo) + 1).toFixed(2)
                                            updateList('acrescAliquo', acrescAliquoValue)
                                        }}
                                        onLongPress={() => {
                                            acrescAliquoValue = (parseFloat(acrescAliquo) + 10).toFixed(2)
                                            updateList('acrescAliquo', acrescAliquoValue)
                                        }}>
                            <Text style={styles.plusMinusButtons}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={{flex:1}}>
                    <Text style={[styles.descriptionText, {textAlign:'center'}]}>Desc.</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.minusBorder]}
                                        onPress={() => {
                                            discountAliquoValue = parseFloat(discountAliquo) - 1 >= 0 ? (parseFloat(discountAliquo) - 1).toFixed(2) : null
                                            updateList('discountAliquo', discountAliquoValue)
                                            }}
                                        onLongPress={() => {
                                            discountAliquoValue = parseFloat(discountAliquo) - 10 >= 0 ? (parseFloat(discountAliquo) - 10).toFixed(2) : '0.00'
                                            updateList('discountAliquo', discountAliquoValue)
                                        }}
                                            >
                            <Text style={styles.plusMinusButtons}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.textInputSelectors}> R$</Text>
                        <TextInputMask
                                style={styles.textInputSelectors}
                                keyboardType='phone-pad'
                                defaultValue={discountValue}
                                mask={"[999999].[99]"}
                                selectTextOnFocus={true}
                                onChangeText={(val) => setDiscountValue(val)}
                                onBlur={() => {
                                    updateList('discountValue')
                                }}
                                textAlign='center'
                        />
                        <Text style={styles.textInputSelectors}>%</Text>
                        <TextInputMask
                                style={styles.textInputSelectors}
                                keyboardType='phone-pad'
                                defaultValue={discountAliquo}
                                mask={"[99].[99]"}
                                selectTextOnFocus={true}
                                onChangeText={(val) => setDiscountAliquo(val)}
                                onBlur={() => {
                                    updateList('discountAliquo')
                                }}
                                textAlign='center'
                        />
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.plusBorder]}
                                        onPress={() => {
                                            discountAliquoValue = (parseFloat(discountAliquo) + 1).toFixed(2)
                                            updateList('discountAliquo', discountAliquoValue)
                                        }}
                                        onLongPress={() => {
                                            discountAliquoValue = (parseFloat(discountAliquo) + 10).toFixed(2)
                                            updateList('discountAliquo', discountAliquoValue)
                                        }}>
                            <Text style={styles.plusMinusButtons}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
            )
        } 
    }

    const renderLeftContent = () => {
        return (
            <TouchableOpacity style={styles.leftContent}
                                onPress={() => props.onDelete(props.index)}>
                <Icon name='trash-alt' color='white' size={commonStyles.iconSizes.bigger}/>
            </TouchableOpacity>
        )
    }

    return(
        <Swipeable renderLeftActions={renderLeftContent}>
            <TouchableOpacity style={styles.mainContainer}
                            disabled={props.isOpen}
                            onPress={props.onPress}>
                <View style={{flexDirection:'row', height: commonStyles.heighs.BudgetProduct.name}}>
                    <TouchableOpacity style={{flex:6}}
                                        onPress={() => props.closeItem()}
                                        disabled={!props.isOpen}>
                        <Text style={styles.cod}>{
                        props.CODPROD + ' - R$ ' + props.PRECOTABELA + ', desc max: ' + parsers.parseDiscountMax(props.DESCMAXIMO) + ' %'
                        }</Text>
                        <Text style={styles.name} numberOfLines={2}>{props.NOMEPROD}</Text>
                    </TouchableOpacity>
                    <View style={[styles.itemPriceContainer]}>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text style={styles.itemPrice}>R$ </Text>
                            <TextInputMask
                                style={styles.itemPrice}
                                keyboardType='phone-pad'
                                value={itemPrice}
                                mask={"[999999].[99]"}
                                selectTextOnFocus={true}
                                onChangeText={(val) => {
                                    setItemPrice(val)
                                }}
                                onBlur={() => {
                                    updateList('itemPrice')
                                }}
                                editable={props.isOpen}
                            />
                            <Text style={styles.descriptionText}>{' ' + props.UNIDADE}</Text>
                        </View>
                            <View style={{ justifyContent: 'space-evenly'}}>
                                <View style={{flexDirection:'row', alignItems:'center', height:commonStyles.heighs.BudgetProduct.price}}>
                                    <Text style={styles.itemPrice}>R$ </Text>
                                    <TextInputMask
                                        style={[styles.itemPrice, {fontSize:commonStyles.fontSize.listItem.biggerText}]}
                                        keyboardType='phone-pad'
                                        defaultValue={totalPrice}
                                        mask={"[999999].[99]"}
                                        selectTextOnFocus={true}
                                        onChangeText={(val) => setTotalPrice(val)}
                                        onBlur={() => {
                                            updateList('totalPrice')
                                        }}
                                        editable={props.isOpen}
                                    />
                                </View>
                            </View>
                    </View>
                </View>
                {props.isOpen ? null : (
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom:commonStyles.spacers.padding.vertical}}>
                        <Text style={[styles.descriptionText, {color:commonStyles.colors.alertColors.error}]}>{
                        'R$ ' + acrescValue + ' - R$ ' + ((parseFloat(acrescValue) / parseFloat(quantity)).toFixed(2) + ' p/ ' + props.UNIDADE)
                        }</Text>
                        <Text style={[styles.descriptionText, {color:commonStyles.colors.alertColors.espera}]}>{'X ' + quantity}</Text>
                        <Text style={[styles.descriptionText, {color:commonStyles.colors.alertColors.faturado}]}>{
                        'R$ ' + discountValue + ' - R$ ' + ((parseFloat(discountValue) / parseFloat(quantity)).toFixed(2) + ' p/ ' + props.UNIDADE)
                        }</Text>
                    </View>
                )}
                {isOpen()}
            </TouchableOpacity>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        borderBottomWidth: 1,
        borderBottomColor: commonStyles.colors.separator,
        backgroundColor: 'white'
    },
    cod:{
        paddingTop: commonStyles.spacers.padding.vertical,
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.secondaryText,
        color: 'gray'
    },
    name:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.title,
        fontWeight: 'bold',
    },
    itemPriceContainer:{
        flex: 4,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingTop: commonStyles.spacers.padding.vertical,
    },
    itemPrice:{
        color: 'green',
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.pageTitle,
        fontWeight: 'bold',
    },
    mainButtonContainer:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
    },
    quantityContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusMinusContainer:{
        paddingHorizontal: commonStyles.spacers.padding.plusMinusButtons,
        borderWidth: 1,
        borderColor: '#bbbbbb',
        paddingVertical: commonStyles.spacers.padding.vertical
    },
    minusBorder:{
        borderTopLeftRadius: commonStyles.borderRadius.plusMinusButtons,
        borderBottomLeftRadius: commonStyles.borderRadius.plusMinusButtons,
    },
    plusBorder:{
        borderTopRightRadius: commonStyles.borderRadius.plusMinusButtons,
        borderBottomRightRadius: commonStyles.borderRadius.plusMinusButtons,
    },
    plusMinusButtons:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.formText,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    descriptionText:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.listItem.secondaryText
    },
    textInputSelectors:{
        fontFamily: commonStyles.fontFamily,
        fontSize: commonStyles.fontSize.formText
    },
    leftContent:{
        backgroundColor: commonStyles.colors.alertColors.error,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: commonStyles.spacers.padding.horizontal * 4
    }
})