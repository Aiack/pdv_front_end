import React, { useState } from "react"
import { StyleSheet, View, Text, Button } from "react-native"

import commonStyle from "../commonStyle"
import CustomHeader from "../components/customHeader"

import NetworkDiscoverer from "../utils/NetworkDiscoverer"

const networkDiscoverer = new NetworkDiscoverer(50, [5151], 21212121)

export default (props) => {
    const [results, setResults] = useState("")
    const [checkingDevice, setCheckingDevice] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [newDevice, setNewDevice] = useState()

    const setDefault = () => {
        setCheckingDevice(null)
        setErrorMsg("")
        setLoading(false)
    }

    const getLocalDevices = async () => {
        const ipAdress = await networkDiscoverer.getLocalDevices()
        setResults(ipAdress)
    }

    const cancelDiscovering = () => {
        networkDiscoverer.cancelDiscovering(setDefault)
    }

    return (
        <View style={styles.mainContainer}>
            <CustomHeader title={"Minhas configurações"} />
            <Button title="wow" onPress={() => {
                setDefault()
                getLocalDevices()
                }} />
            <Button title="cancel" onPress={() => cancelDiscovering()} />
            <Text>{results}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: commonStyle.colors.background,
    },
    tittleText: {
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.pageTitle * 1.4,
        fontWeight: "bold",
        marginHorizontal: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
    },
})
