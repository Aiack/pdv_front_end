import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import TextInputMask from 'react-native-text-input-mask'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyles from '../../commonStyle'

const basicInfo = {
    unitaryPrice: '0.50',
    maxDiscout: 0.20
}

import { Toast, showToast } from '../toast'

let onTextChange = false

export default props => {
    const basicInfo = {
        unitaryPrice: parseFloat(props.data.PRECOTABELA).toFixed(2),
        maxDiscout: props.data.DESCMAXIMO
    }

    console.log('Update!')

    const [itemPrice, setItemPrice] = useState(parseFloat(props.data.VALORUNITARIO).toFixed(2))
    const [totalPrice, setTotalPrice] = useState(parseFloat(props.data.VALORTOTAL).toFixed(2))
    const [quantity, setQuantity] = useState(parseFloat(props.data.QUANTIDADE).toFixed(1))
    const [discountValue, setDiscountValue] = useState(parseFloat(props.data.VALORDESCONTOITEM).toFixed(2))
    const [discountAliquo, setDiscountAliquo] = useState(parseFloat(props.data.ALIQDESCONTOITEM).toFixed(2))
    const [acrescValue, setAcrescValue] = useState(parseFloat(props.data.VALORACRESCIMOITEM).toFixed(2))
    const [acrescAliquo, setAcrescAliquo] = useState(parseFloat(props.data.ALIQACRESCIMOITEM).toFixed(2))

    const ifEmptyReturnZero = (text) => {
        if(parseFloat(text)){
            return text
        }
        else{
            return '0'
        }
    }

    const exceedMaxDiscount = (aliquote) => {
        if(aliquote < 1 && (1 - aliquote) > basicInfo.maxDiscout){
            return true
        }
        return false
    }

    useEffect(() => {
        newData = { ...props.data }
        newData.VALORUNITARIO = itemPrice
        newData.VALORTOTAL = totalPrice
        newData.QUANTIDADE = quantity
        newData.VALORDESCONTOITEM = discountValue
        newData.ALIQDESCONTOITEM = discountAliquo
        newData.VALORACRESCIMOITEM = acrescValue
        newData.ALIQACRESCIMOITEM = acrescAliquo
        props.onChangeData(props.index, newData)
    })

    updateDescAcres = (aliquote) => {
        if(aliquote > 1){
            setDiscountAliquo('0.00')
            setDiscountValue('0.00')
            acresAliq = (aliquote - 1) * 100
            setAcrescAliquo(acresAliq.toFixed(2))
            setAcrescValue(((acresAliq / 100) * basicInfo.unitaryPrice * parseFloat(quantity)).toFixed(2))
        }
        else{
            setAcrescAliquo('0.00')
            setAcrescValue('0.00')
            if(exceedMaxDiscount(aliquote)){
                discAliq = basicInfo.maxDiscout * 100
            }
            else{
                discAliq = (1 - aliquote) * 100
            }
            setDiscountAliquo(discAliq.toFixed(2))
            setDiscountValue(((discAliq / 100) * basicInfo.unitaryPrice * parseFloat(quantity)).toFixed(2))
        }
    }

    useEffect(() => {
        if(onTextChange){
            let aliquote = (itemPrice / basicInfo.unitaryPrice)
            item_price = parseFloat(itemPrice)
            if(exceedMaxDiscount(aliquote)){
                item_price = (parseFloat(basicInfo.unitaryPrice) * (1 - basicInfo.maxDiscout)).toFixed(2)
                aliquote = (item_price / basicInfo.unitaryPrice)
                showToast('warning', 'Desconto excedido', 'Desconto maximo para o produto excedido')
            }

            total_price = parseFloat(item_price) * parseFloat(quantity)
            setItemPrice(item_price.toFixed(2))
            setTotalPrice(total_price.toFixed(2))
            
            updateDescAcres(aliquote)
        }
        onTextChange = false
    }, [itemPrice])

    useEffect(() => {
        if(onTextChange){
            item_price = parseFloat(totalPrice) / parseFloat(quantity)
            let aliquote = (item_price / basicInfo.unitaryPrice)
            total_price = parseFloat(totalPrice)

            if(exceedMaxDiscount(aliquote)){
                item_price = parseFloat(basicInfo.unitaryPrice) * (1 - basicInfo.maxDiscout)
                total_price = item_price * parseFloat(quantity)
                aliquote = (item_price / basicInfo.unitaryPrice)
                showToast('warning', 'Desconto excedido', 'Desconto maximo para o produto excedido')
            }
            setItemPrice(item_price.toFixed(2))
            setTotalPrice(total_price.toFixed(2))

            updateDescAcres(aliquote)
        }
        onTextChange = false
    }, [totalPrice])

    useEffect(() => {
        if(onTextChange){
            let aliquote = (itemPrice / basicInfo.unitaryPrice)
            updateDescAcres(aliquote)
            total_price = parseFloat(itemPrice) * parseFloat(quantity)
            setTotalPrice(total_price.toFixed(2))
        }
        onTextChange = false
    }, [quantity])

    useEffect(() => {
        if(onTextChange){
            discountPerItem = parseFloat(discountValue) / parseFloat(quantity)
            item_price = parseFloat(basicInfo.unitaryPrice) - discountPerItem
            let aliquote = (item_price / basicInfo.unitaryPrice)
            if(exceedMaxDiscount(aliquote)){
                item_price = parseFloat(basicInfo.unitaryPrice) * (1 - basicInfo.maxDiscout)
                discountPerItem = parseFloat(basicInfo.unitaryPrice) - item_price
                setDiscountValue((discountPerItem * parseFloat(quantity)).toFixed(2))
            }
            discount_aliquo = ((discountPerItem)/parseFloat(basicInfo.unitaryPrice)) * 100
            item_price += (parseFloat(acrescValue) / parseFloat(quantity))
            setItemPrice(item_price.toFixed(2))
            setDiscountAliquo(discount_aliquo.toFixed(2))
            setTotalPrice((item_price * parseFloat(quantity)).toFixed(2))
        }
        onTextChange = false
    }, [discountValue])

    useEffect(() => {
        if(onTextChange){
            discount_aliquo = parseFloat(discountAliquo) / 100
            if(discount_aliquo > basicInfo.maxDiscout){
                discount_aliquo = basicInfo.maxDiscout
                setDiscountAliquo((discount_aliquo * 100).toFixed(2))
            }
            item_price = parseFloat(basicInfo.unitaryPrice) * ( 1 - discount_aliquo)
            discount_value = (basicInfo.unitaryPrice - item_price) * parseFloat(quantity)
            item_price += (parseFloat(acrescValue) / parseFloat(quantity))
            total_price = item_price * parseFloat(quantity)
        
            setItemPrice(item_price.toFixed(2))
            setTotalPrice(total_price.toFixed(2))
            setDiscountValue(discount_value.toFixed(2))
        }
        onTextChange = false
    }, [discountAliquo])

    useEffect(() => {
        if(onTextChange){
            acresPerItem = parseFloat(acrescValue) / parseFloat(quantity)
            item_price = parseFloat(basicInfo.unitaryPrice) + acresPerItem
            let aliquote = (item_price / basicInfo.unitaryPrice)
            acres_aliquo = ((acresPerItem)/parseFloat(basicInfo.unitaryPrice)) * 100
            item_price -= (parseFloat(discountValue) / parseFloat(quantity))
            setItemPrice(item_price.toFixed(2))
            setAcrescAliquo(acres_aliquo.toFixed(2))
            setTotalPrice((item_price * parseFloat(quantity)).toFixed(2))
        }
        onTextChange = false
    }, [acrescValue])

    useEffect(() => {
        if(onTextChange){
            acresc_aliquo = parseFloat(acrescAliquo) / 100

            item_price = parseFloat(basicInfo.unitaryPrice) * ( 1 + acresc_aliquo)
            acresc_value = (item_price - basicInfo.unitaryPrice) * parseFloat(quantity)
            item_price -= (parseFloat(discountValue) / parseFloat(quantity))
            total_price = item_price * parseFloat(quantity)
            
            setItemPrice(item_price.toFixed(2))
            setTotalPrice(total_price.toFixed(2))
            setAcrescValue(acresc_value.toFixed(2))
        }
        onTextChange = false
    }, [acrescAliquo])

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
                                            onTextChange = true
                                            parseFloat(quantity) > 1 ? setQuantity((Math.round((parseFloat(quantity) - 1)*10)/10).toFixed(1) + '') : null
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
                                    onTextChange = true
                                    if(parseFloat(quantity)){
                                        setQuantity(parseFloat(quantity).toFixed(2))
                                    }
                                    else{
                                        setQuantity(parseFloat('1').toFixed(2))
                                    }
                                }}
                                textAlign='center'
                        />
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.plusBorder]}
                                        onPress={() => {
                                            onTextChange = true
                                            setQuantity((Math.round((parseFloat(quantity) + 1)*10)/10).toFixed(1) + '')
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
                                            onTextChange = true
                                            parseFloat(acrescAliquo) - 1 >= 0 ? setAcrescAliquo((Math.round((parseFloat(acrescAliquo) - 1)*10)/10).toFixed(2) + '') : null
                                            }}
                                        onLongPress={() => {
                                            onTextChange = true
                                            parseFloat(acrescAliquo) - 10 >= 0 ? setAcrescAliquo((Math.round((parseFloat(acrescAliquo) - 10)*10)/10).toFixed(2) + '') : null
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
                                    onTextChange = true
                                    setAcrescValue(parseFloat(ifEmptyReturnZero(acrescValue)).toFixed(2))
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
                                    onTextChange = true
                                    setAcrescAliquo(parseFloat(ifEmptyReturnZero(acrescAliquo)).toFixed(2))
                                }}
                                textAlign='center'
                        />
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.plusBorder]}
                                        onPress={() => {
                                            onTextChange = true
                                            setAcrescAliquo((Math.round((parseFloat(acrescAliquo) + 1)*10)/10).toFixed(2) + '')
                                        }}
                                        onLongPress={() => {
                                            onTextChange = true
                                            setAcrescAliquo((Math.round((parseFloat(acrescAliquo) + 10)*10)/10).toFixed(2) + '')
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
                                            onTextChange = true
                                            parseFloat(discountAliquo) - 1 >= 0 ? setDiscountAliquo((Math.round((parseFloat(discountAliquo) - 1)*10)/10).toFixed(1) + '') : null
                                            }}
                                        onLongPress={() => {
                                            onTextChange = true
                                            parseFloat(discountAliquo) - 10 >= 0 ? setDiscountAliquo((Math.round((parseFloat(discountAliquo) - 10)*10)/10).toFixed(1) + '') : null
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
                                    onTextChange = true
                                    setDiscountValue(parseFloat(ifEmptyReturnZero(discountValue)).toFixed(2))
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
                                    onTextChange = true
                                    setDiscountAliquo(parseFloat(ifEmptyReturnZero(discountAliquo)).toFixed(2))
                                }}
                                textAlign='center'
                        />
                        <TouchableOpacity style={[styles.plusMinusContainer, styles.plusBorder]}
                                        onPress={() => {
                                            onTextChange = true
                                            setDiscountAliquo((Math.round((parseFloat(discountAliquo) + 1)*10)/10).toFixed(2) + '')
                                        }}
                                        onLongPress={() => {
                                            onTextChange = true
                                            setDiscountAliquo((Math.round((parseFloat(discountAliquo) + 10)*10)/10).toFixed(2) + '')
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
                        <Text style={styles.cod}>{props.data.CODPROD + ' - R$ ' + props.data.PRECOTABELA}</Text>
                        <Text style={styles.name} numberOfLines={2}>{props.data.NOMEPROD}</Text>
                    </TouchableOpacity>
                    <View style={[styles.itemPriceContainer]}>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text style={styles.itemPrice}>R$ </Text>
                            <TextInputMask
                                style={styles.itemPrice}
                                keyboardType='phone-pad'
                                defaultValue={itemPrice}
                                mask={"[999999].[99]"}
                                selectTextOnFocus={true}
                                onChangeText={(val) => {
                                    onTextChange = false
                                    setItemPrice(val)
                                }}
                                onBlur={() => {
                                    item_price = parseFloat(ifEmptyReturnZero(itemPrice)).toFixed(3)
                                    onTextChange = true
                                    setItemPrice(item_price)
                                }}
                                editable={props.isOpen}
                            />
                            <Text style={styles.descriptionText}>{' ' + props.data.UNIDADE}</Text>
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
                                            onTextChange = true
                                            setTotalPrice(parseFloat(ifEmptyReturnZero(totalPrice)).toFixed(2))
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
                        <Text style={[styles.descriptionText, {color:commonStyles.colors.alertColors.error}]}>{'R$ ' + acrescValue}</Text>
                        <Text style={[styles.descriptionText, {color:commonStyles.colors.alertColors.espera}]}>{'X ' + quantity}</Text>
                        <Text style={[styles.descriptionText, {color:commonStyles.colors.alertColors.faturado}]}>{'R$ ' + discountValue}</Text>
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
        fontFamily: commonStyles.fontFamily
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