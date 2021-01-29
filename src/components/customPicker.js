import React, {useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, TextInput, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../commonStyle'

export default props => {
    const [modal, setModal] = useState(false)

    const getLabel = () => {
        if(props.items){
            if(props.defaultValue){
                return props.items.find(item => item.value === props.defaultValue).label
            }
            else{
                props.onChangeItem(props.items[0].value)
                return props.items[0].label
            }
        }
    }

    const onChangeItem = (item) => {
        props.onChangeItem(item)
        setModal(prev => !prev)
    }

    return (
        <TouchableOpacity onPress={() => setModal(prev => !prev)} style={{flex:1}}>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                <Text style={style.labelText}>{getLabel()}</Text>
                <Icon style={style.icon} size={15} name='chevron-down'/>
            </View>
            <PickerModal visible={modal} onRequestClose={() => setModal(prev => !prev)} items={props.items}
            onChangeItem={onChangeItem}/>
        </TouchableOpacity>
    )
}

const PickerModal = props => {
    const [input, setInput] = useState('')
    const [items, setItems] = useState(null)

    const onRequestClose = () => {
        props.onRequestClose()
        setInput('')
    }

    const renderItem = ({item}) => {
        return (
            <Item {...item} onChangeItem={props.onChangeItem}/>
        )
    }

    const onChangeText = (val) => {
        res = props.items.filter((item) => {return item.label.toLowerCase().includes(val.toLowerCase())})
        setItems(res)
        setInput(val)
    }

    return (
        <Modal transparent={true}
        visible={props.visible}
        onRequestClose={onRequestClose}
        animationType='none'
        onShow={() => {
            setItems(props.items)
        }}>

            <TouchableWithoutFeedback onPress={onRequestClose} >
                <View style={[style.blackBackgroundOverlay, {flex:1}]}/>
            </TouchableWithoutFeedback>

            <View style={{flexDirection:'row', flex:1}}>
                
                <TouchableWithoutFeedback onPress={onRequestClose} >
                    <View style={[style.blackBackgroundOverlay, {flex:1}]}/>
                </TouchableWithoutFeedback>

                <View style={[style.modalContainer, {flex:8}]}>
                    <View style={{flex: 1}}>
                        <TextInput style={style.textInput} placeholder='Pesquisa'
                        value={input} onChangeText={onChangeText}/>
                        <FlatList
                        data={items}
                        keyExtractor={(item) => item.value}
                        renderItem={renderItem}/>
                    </View>
                </View>

                <TouchableWithoutFeedback onPress={onRequestClose} >
                    <View style={[style.blackBackgroundOverlay, {flex:1}]}/>
                </TouchableWithoutFeedback>

            </View>


            <TouchableWithoutFeedback onPress={onRequestClose} >
                <View style={[style.blackBackgroundOverlay, {flex:1}]}/>
            </TouchableWithoutFeedback>
            
        </Modal>
    )
}

const Item = props => {
    return (
        <TouchableOpacity style={{paddingVertical: commonStyle.spacers.padding.vertical * 1.5}}
        onPress={() => props.onChangeItem(props.value)}>
            <Text style={[style.labelText, {fontWeight:'normal', textAlign: 'center'}]}>{props.label}</Text>
        </TouchableOpacity>
        
    )
}


const style = StyleSheet.create({
    icon:{
        marginHorizontal: 10
    },
    labelText:{
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        textAlign: 'right',
        fontWeight: 'bold'
    },
    textInput:{
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        borderBottomWidth: 1,
        borderBottomColor: commonStyle.colors.separator
    },
    blackBackgroundOverlay:{
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    modalContainer:{
        backgroundColor:'white',
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        paddingVertical: commonStyle.spacers.padding.vertical,
    }
})