import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import * as Animateable from 'react-native-animatable'

const colors = {
    sucess: '#7DDF64',
    error: '#D8315B',
    info: '#78C0E0',
    warning: '#F0C808'
}

export let showToast = (type, title, content) => {}

export const Toast = props => {
    const [animation, setAnimation] = useState('bounceIn')
    const [toastContent, setToastContent] = useState({
        type: '',
        title: '',
        content: ''
    })

    const showOfAnimation = async () => {
        await setTimeout(() => {
            setAnimation('bounceOutDown')
        }, 5000)
    }

    showToast = (type, title, content) => {
        try {
            setToastContent({
                type, title: '' + title, content: '' + content
            })
            setAnimation('bounceIn')
        } catch (error) {
            throw error
        }

    }

    return (
        <Animateable.View animation={animation} onAnimationBegin={showOfAnimation}>
            <View style={[styles.container, { backgroundColor: colors[toastContent.type] }]}>
                <Text style={styles.title}>{toastContent.title}</Text>
                <Text style={styles.content}>{toastContent.content}</Text>
            </View>
        </Animateable.View>

    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#ec524b',
        position: 'absolute',
        alignSelf: 'center',
        bottom: 30,
        width: '75%',
        padding: 10,
        borderRadius: 10
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

