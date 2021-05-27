import React, { useEffect, useState } from "react"
import {
    StyleSheet,
    View,
    StatusBar,
    Image,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native"

import logo from "../../assets/imgs/logowhite.png"
import commonStyles from "../commonStyle"
import { getUser, haveConnection } from "../api/api"

import IconFontAwesome from "react-native-vector-icons/FontAwesome"
import IconFeather from "react-native-vector-icons/Feather"

// import codePush from 'react-native-code-push'

export default (props) => {
    const [windowState, setWindowState] = useState("loading")

    useEffect(() => {
        makeConnection()
    }, [])

    const changeToApp = () => {
        setTimeout(() => {
            props.changeToScreen("app")
        }, 3000)
    }

    const changeToFirstInit = () => {
        props.changeToScreen("firstInit")
    }

    const makeConnection = async () => {
        setWindowState("loading")
        if(await haveConnection()){
            const user = await getUser()

            if(!user){
                changeToFirstInit()
            }
            else if(user.flag_have_acess === null){
                setWindowState("newAcess")
            }
            else if(user.flag_have_acess === false){
                setWindowState("acessDenied")
            }
            else{
                changeToApp()
            }
        }
        else{
            setWindowState("connectionError")
        }
    }

    const setLayout = () => {
        if (windowState === "connectionError") {
            return (
                <View style={styles.containerSpaceAround}>
                    <View style={styles.container}>
                        <IconFeather
                            name="wifi"
                            color={commonStyles.colors.primary}
                            size={commonStyles.iconSizes.bigger * 1.5}
                        />
                        <Text style={styles.errorText}>Ocorreu um erro!</Text>
                    </View>

                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                makeConnection()
                            }}
                            onLongPress={() => {
                                changeToFirstInit()
                            }}
                        >
                            <IconFeather
                                name="rotate-ccw"
                                size={commonStyles.iconSizes.main}
                            />
                            <Text
                                style={[
                                    styles.errorText,
                                    {
                                        color: "black",
                                        paddingLeft:
                                            commonStyles.spacers.padding
                                                .horizontal,
                                        fontSize: commonStyles.fontSize.button,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Tentar novamente?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } 
        else if (windowState === "newAcess") {
            return (
                <View style={styles.containerSpaceAround}>
                    <View style={styles.container}>
                        <IconFontAwesome
                            name="hand-stop-o"
                            color={commonStyles.colors.primary}
                            size={commonStyles.iconSizes.bigger * 1.5}
                        />
                        <Text style={styles.errorText}>
                            A espera de liberação do perfil!
                        </Text>
                        <Text style={styles.errorText}>
                            Contate o administrador
                        </Text>
                    </View>

                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                makeConnection()
                            }}
                        >
                            <IconFeather
                                name="rotate-ccw"
                                size={commonStyles.iconSizes.main}
                            />
                            <Text
                                style={[
                                    styles.errorText,
                                    {
                                        color: "black",
                                        paddingLeft:
                                            commonStyles.spacers.padding
                                                .horizontal,
                                        fontSize: commonStyles.fontSize.button,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Tentar novamente?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else if (windowState === "acessDenied") {
            return (
                <View style={styles.containerSpaceAround}>
                    <View style={styles.container}>
                        <IconFeather
                            name="x"
                            color={commonStyles.colors.alertColors.error}
                            size={commonStyles.iconSizes.bigger * 1.5}
                        />
                        <Text style={styles.errorText}>
                            Seu acesso ao sistema foi bloquado!
                        </Text>
                        <Text style={styles.errorText}>
                            Contate o administrador
                        </Text>
                    </View>

                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                makeConnection()
                            }}
                        >
                            <IconFeather
                                name="rotate-ccw"
                                size={commonStyles.iconSizes.main}
                            />
                            <Text
                                style={[
                                    styles.errorText,
                                    {
                                        color: "black",
                                        paddingLeft:
                                            commonStyles.spacers.padding
                                                .horizontal,
                                        fontSize: commonStyles.fontSize.button,
                                        textAlign: "center",
                                    },
                                ]}
                            >
                                Tentar novamente?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    size="large"
                    color={commonStyles.colors.primary}
                />
            </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
            </View>
            <View style={styles.container}>
                <StatusBar backgroundColor={commonStyles.colors.secondary} />
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>O Tijolão PDV</Text>
            </View>
            <View style={styles.container}>{setLayout()}</View>
            {/* <Text style={[styles.title, {fontSize: 10}]}>{'Code Push v ' + codePushVersion}</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: commonStyles.colors.secondary,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    containerSpaceAround: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    logo: {
        height: 70,
        resizeMode: "contain",
    },
    title: {
        fontSize: 30,
        color: "white",
        fontFamily: commonStyles.fontFamily,
        fontWeight: "bold",
        textAlign: "center",
    },
    errorText: {
        fontSize: 30,
        color: commonStyles.colors.primary,
        fontFamily: commonStyles.fontFamily,
        fontWeight: "bold",
        textAlign: "center",
    },
    retryButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: commonStyles.spacers.padding.horizontal * 4,
        paddingVertical: commonStyles.spacers.padding.vertical * 4,
        backgroundColor: "white",
        borderRadius: commonStyles.borderRadius.plusMinusButtons,
        borderWidth: 1,
        borderColor: commonStyles.colors.separator,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: commonStyles.borderRadius.main,
        elevation: 1,
        marginVertical: commonStyles.spacers.margin.vertical,
        height: commonStyles.heighs.NewBudget.customContainer,
    },
    containerPlaceholder: {
        fontSize: commonStyles.fontSize.formText,
        fontFamily: commonStyles.fontFamily,
        paddingLeft: commonStyles.spacers.padding.horizontal,
    },
    input: {
        flex: 1,
        fontSize: commonStyles.fontSize.formText,
        fontFamily: commonStyles.fontFamily,
        textAlign: "right",
        fontWeight: "bold",
        paddingRight: commonStyles.spacers.padding.horizontal,
    },
})
