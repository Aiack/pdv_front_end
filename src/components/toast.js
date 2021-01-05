import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import * as Animateable from 'react-native-animatable'
import { FlatList } from 'react-native-gesture-handler'

const colors = {
    sucess: '#7DDF64',
    error: '#D8315B',
    info: '#78C0E0',
    warning: '#F0C808'
}

export let showToast = (type, title, content) => {}

export const Toast = props => {
    const [toasts, setToasts] = useState([])

    const showOffAnimation = async (key) => {
        await setTimeout(() => {
            index = toasts.findIndex(item => item.key == key)
            newToast = [ ...toasts ]
            newToast.splice(index, 1)
            setToasts(newToast)
        }, 2000)
    }

    const setAnimationToEmpty = (key) => {
        index = toasts.findIndex(item => item.key == key)
        newToast = [ ...toasts ]
        newToast[index] = { ...newToast[index], animation: ''}
        setToasts(newToast)
    }

    showToast = (type, title, content) => {
        key = 1
        if(toasts.length > 0){
            key = parseInt(toasts[toasts.length - 1].key) + 1
        }
        newToast = [ ...toasts ]
        newToast.push({
            type, title, content, key: key + '', animation: 'bounceInUp'
        })
        setToasts(newToast)
    }

    const renderToast = (item) => {
        console.log(item.item.animation)
        return (
            <Animateable.View animation={item.item.animation} onAnimationBegin={() => showOffAnimation(key)} onAnimationEnd={
                () => setAnimationToEmpty(key)
                }>
                <View style={[styles.container, { backgroundColor: colors['sucess'] }]}>
                    <Text style={styles.title}>{'asd'}</Text>
                    <Text style={styles.content}>{'asd'}</Text>
                </View>
            </Animateable.View>
        )
    }

    return (
        <View style={{position: 'absolute', alignSelf: 'center', bottom: 30, width: '75%', elevation: 1}}>
            <FlatList data={toasts}
            keyExtractor={(item) => item.key}
            renderItem={renderToast}
            extraData={toasts}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#ec524b',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5
    },
    title:{
        color: 'white',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold'
    },
    content:{
        color: 'white',
        fontFamily: 'Roboto',
        fontSize: 14,
        textAlign: 'justify'
    }
})

