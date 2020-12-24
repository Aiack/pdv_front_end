import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { View } from 'react-native-animatable'
import Icon from 'react-native-vector-icons/FontAwesome5'
import commonStyle from '../../commonStyle'

export default props => {
    const [active, setActive] = useState(1)

    let opacity = 1
    if(!active){
        opacity = 0.2
    }

    const changeState = () => {
        setActive(!active)
        props.onClick(props.text)
    }

    return (
        <View opacity={opacity}>
            <TouchableOpacity onPress={changeState} style={[styles.buttonContainer, {backgroundColor:props.color}]}>
                <Icon name={props.iconName} color={'white'}/>
                <Text style={[styles.text]}>{props.text}</Text>
        </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 10,
    },
    text:{
        color: 'white',
        fontSize: commonStyle.fontSize.button,
        paddingLeft: 5,
        fontFamily: commonStyle.fontFamily
    }
})
