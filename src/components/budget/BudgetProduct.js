import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'

import TextInputMask from 'react-native-text-input-mask'

import commonStyles from '../../commonStyle'

const basicInfo = {
    unitaryPrice: '0.50',
    maxDiscout: 0.20
}

import { Toast, showToast } from '../toast'

let onTextChange = false

export default props => {
    const [itemPrice, setItemPrice] = useState(basicInfo.unitaryPrice)
    const [totalPrice, setTotalPrice] = useState(basicInfo.unitaryPrice)
    const [quantity, setQuantity] = useState('1.0')
    const [discountValue, setDiscountValue] = useState('0.00')
    const [discountAliquo, setDiscountAliquo] = useState('0.00')
    const [acrescValue, setAcrescValue] = useState('0.00')
    const [acrescAliquo, setAcrescAliquo] = useState('0.00')

    ifEmptyReturnZero = (text) => {
        console.log('on ifempty')
        if(parseFloat(text)){
            return text
        }
        else{
            return '0'
        }
    }

    exceedMaxDiscount = (aliquote) => {
        if(aliquote < 1 && (1 - aliquote) > basicInfo.maxDiscout){
            console.log('here')
            return true
        }
        return false
    }

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
        console.log('on use effect')
        if(onTextChange){
            let aliquote = (itemPrice / basicInfo.unitaryPrice)
            console.log('aliquote:'+aliquote)
            item_price = itemPrice
            console.log('item_price:'+item_price)
            if(exceedMaxDiscount(aliquote)){
                item_price = (parseFloat(basicInfo.unitaryPrice) * (1 - basicInfo.maxDiscout)).toFixed(2)
                aliquote = (item_price / basicInfo.unitaryPrice)
                showToast('warning', 'Desconto excedido', 'Desconto maximo para o produto excedido')
            }

            total_price = parseFloat(item_price) * parseFloat(quantity)
            setItemPrice(item_price)
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
            console.log('discountPerItem:' + discountPerItem)
            item_price = parseFloat(basicInfo.unitaryPrice) - discountPerItem
            console.log('item_price:' + item_price)
            let aliquote = (item_price / basicInfo.unitaryPrice)
            console.log('aliquote:' + aliquote)
            if(exceedMaxDiscount(aliquote)){
                console.log('exceed')
                item_price = parseFloat(basicInfo.unitaryPrice) * (1 - basicInfo.maxDiscout)
                discountPerItem = parseFloat(basicInfo.unitaryPrice) - item_price
                setDiscountValue((discountPerItem * parseFloat(quantity)).toFixed(2))
            }
            discount_aliquo = ((discountPerItem)/parseFloat(basicInfo.unitaryPrice)) * 100
            console.log(discount_aliquo)
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
            console.log('discount_aliquo:' + discount_aliquo)
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
            console.log('discount_aliquo:' + acresc_aliquo)

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

    return (
        <View style={styles.mainContainer}>
            <View style={{flexDirection:'row', height: 70}}>
                <View style={{flex:6}}>
                    <Text style={styles.cod}>000003</Text>
                    <Text style={styles.name} numberOfLines={2}>PARAFUSADEIRA FURADEIRA COM FIO 220V 550 W BOSCH</Text>
                </View>
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
                                console.log('onblur:' + item_price)
                                onTextChange = true
                                console.log('after ontextChange')
                                setItemPrice(item_price)
                                console.log('after setitemprice')
                            }}
                        />
                        <Text style={styles.descriptionText}>{' ' + 'cx'}</Text>
                    </View>
                        <View style={{ justifyContent: 'space-evenly'}}>
                            <View style={{flexDirection:'row', alignItems:'center', height:50}}>
                                <Text style={styles.itemPrice}>R$ </Text>
                                <TextInputMask
                                    style={[styles.itemPrice, {fontSize:25}]}
                                    keyboardType='phone-pad'
                                    defaultValue={totalPrice}
                                    mask={"[999999].[99]"}
                                    selectTextOnFocus={true}
                                    onChangeText={(val) => setTotalPrice(val)}
                                    onBlur={() => {
                                        onTextChange = true
                                        setTotalPrice(parseFloat(ifEmptyReturnZero(totalPrice)).toFixed(2))
                                    }}
                                />
                            </View>
                        </View>
                </View>
            </View>

            <View style={styles.mainButtonContainer}>
                <View style={{height: 50}}>
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
        <Toast/>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        height: 190,
        borderBottomWidth: 1,
        borderBottomColor: commonStyles.colors.separator
    },
    cod:{
        paddingTop: 10,
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
        paddingTop: 10,
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
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#bbbbbb',
        paddingVertical: 5
    },
    minusBorder:{
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    plusBorder:{
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
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
    }
})