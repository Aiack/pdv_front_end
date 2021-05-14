import React, {useState} from "react"
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native"

import commonStyle from "../commonStyle"

import QRCodeScanner from "react-native-qrcode-scanner"
import { RNCamera } from "react-native-camera"

const CameraModal = (props) => {
    const [cameraReady, setCameraReady] = useState(true)


    const onCameraRead = (data) => {
        setCameraReady(false)
        props.onClose()
        props.onRead(data)
    }

    return (
        <Modal
            transparent={true}
            visible={props.isVisible}
            onRequestClose={props.onClose}
            animationType="fade"
            onShow={() => setCameraReady(true)}
        >
            <TouchableWithoutFeedback onPress={props.onClose}>
                <View style={styles.background} />
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <QRCodeScanner onRead={(e) => onCameraRead(e.data)}/>
            </View>

            <TouchableWithoutFeedback onPress={props.onClose}>
                <View style={styles.background} />
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default CameraModal

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    container: {
        flex: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: commonStyle.colors.background,
    },
})
