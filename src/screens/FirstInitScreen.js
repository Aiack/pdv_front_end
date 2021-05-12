import React, { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
} from "react-native"

import commonStyle from "../commonStyle"

import Icon from "react-native-vector-icons/Feather"
import QRCodeScanner from "react-native-qrcode-scanner"
import { RNCamera } from "react-native-camera"

const FirstInitScreen = (props) => {
    const [screenStep, setScreenStep] = useState(0)
    const [haverError, setHaveError] = useState(false)

    const getScreen = (step) => {
        if (step === 0) {
            return (
                <View style={styles.step0Container}>
                    <View
                        style={[
                            { alignSelf: "center", flex: 1 },
                            styles.centerContent,
                        ]}
                    >
                        <Text
                            style={[
                                styles.title,
                                {
                                    fontSize: 24,
                                    color:
                                        commonStyle.firstInitScreen.statusSphere
                                            .activeBorder,
                                },
                            ]}
                        >
                            Seja Bem Vindo ao PDV!
                        </Text>
                        <Text style={styles.title}>
                            Vamos te deixar pronto para realizar vendas logo
                            após estes passos
                        </Text>
                        <Icon
                            name="thumbs-up"
                            size={60}
                            color={
                                commonStyle.firstInitScreen.statusSphere
                                    .activeBorder
                            }
                        />
                    </View>
                </View>
            )
        } else if (step === 1) {
            return (
                <View style={styles.centerContent}>
                    <QRCodeScanner></QRCodeScanner>
                </View>
            )
        } else if (step === 2) {
            return (
                <View>
                    <Text>Stepp 2</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <Text>Stepp else</Text>
                </View>
            )
        }
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <View style={styles.statusBar}>
                {/* Sphere container index 1 */}
                <View style={styles.sphereContainer}>
                    <Text
                        style={[
                            styles.statusSphereLabel,
                            styles.labelInactive,
                            haverError && screenStep === 1
                                ? styles.labelError
                                : screenStep === 1
                                ? styles.labelActive
                                : screenStep > 1
                                ? styles.labelDone
                                : null,
                        ]}
                    >
                        Servidor
                    </Text>
                    <View
                        style={[
                            styles.sphere,
                            styles.sphereInactive,
                            haverError && screenStep === 1
                                ? styles.sphereError
                                : screenStep === 1
                                ? styles.sphereActive
                                : screenStep > 1
                                ? styles.sphereDone
                                : null,
                        ]}
                    >
                        {haverError && screenStep === 1 ? (
                            <Icon
                                name="x"
                                size={30}
                                color={
                                    commonStyle.firstInitScreen.bottomButtons
                                        .error
                                }
                            />
                        ) : screenStep > 1 ? (
                            <Icon
                                name="check"
                                size={30}
                                color={
                                    commonStyle.firstInitScreen.bottomButtons
                                        .done
                                }
                            />
                        ) : null}
                    </View>
                </View>
                <View style={[styles.divider, screenStep === 2 ? styles.dividerDone : null]} />
                {/* Sphere container index 2 */}
                <View style={styles.sphereContainer}>
                    <Text
                        style={[
                            styles.statusSphereLabel,
                            styles.labelInactive,
                            haverError && screenStep === 2
                                ? styles.labelError
                                : screenStep === 2
                                ? styles.labelActive
                                : screenStep > 2
                                ? styles.labelDone
                                : null,
                        ]}
                    >
                        Usuário
                    </Text>
                    <View
                        style={[
                            styles.sphere,
                            styles.sphereInactive,
                            haverError && screenStep === 2
                                ? styles.sphereError
                                : screenStep === 2
                                ? styles.sphereActive
                                : screenStep > 2
                                ? styles.sphereDone
                                : null,
                        ]}
                    >
                        {haverError && screenStep === 2 ? (
                            <Icon
                                name="x"
                                size={30}
                                color={
                                    commonStyle.firstInitScreen.bottomButtons
                                        .error
                                }
                            />
                        ) : screenStep > 2 ? (
                            <Icon
                                name="check"
                                size={30}
                                color={
                                    commonStyle.firstInitScreen.bottomButtons
                                        .done
                                }
                            />
                        ) : null}
                    </View>
                </View>
            </View>
            {getScreen(screenStep)}
            <View style={styles.bottomButonsContainer}>
                {/* Back button */}
                <TouchableOpacity
                    style={[styles.bottomButtons, screenStep != 0 ? styles.bottomButtonsActive : styles.bottomButtonsInactive]}
                    onPress={() => setScreenStep((oldState) => oldState - 1)}
                    disabled={screenStep === 0}
                >
                    <Icon
                        name="chevron-left"
                        size={50}
                        color={
                            commonStyle.firstInitScreen.bottomButtons
                                .inactiveBorder
                        }
                    />
                </TouchableOpacity>
                {/* Forward button */}
                <TouchableOpacity
                    style={[
                        styles.bottomButtons,
                        screenStep != 2
                            ? styles.bottomButtonsActive
                            : styles.bottomButtonsDone,
                        haverError ? styles.bottomButtonsError : null,
                    ]}
                    onPress={() => setScreenStep((oldState) => oldState + 1)}
                    disabled={haverError}
                >
                    {haverError ? (
                        <Icon name="x" size={50} color={"white"} />
                    ) : screenStep != 2 ? (
                        <Icon name="chevron-right" size={50} color={"white"} />
                    ) : (
                        <Icon name="check" size={50} color={"white"} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "white",
        flex: 1,
    },
    step0Container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
        flex:1
    },
    title: {
        textAlign: "center",
        fontFamily: commonStyle.fontFamilyExtraBold,
        fontSize: commonStyle.fontSize.pageTitle,
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    statusBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    sphereContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    sphere: {
        width: commonStyle.firstInitScreen.statusSphere.size,
        height: commonStyle.firstInitScreen.statusSphere.size,
        borderRadius: commonStyle.firstInitScreen.statusSphere.size / 2,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: commonStyle.firstInitScreen.statusSphere.boderWidth,
    },
    sphereActive: {
        borderColor: commonStyle.firstInitScreen.statusSphere.activeBorder,
    },
    sphereDone: {
        borderColor: commonStyle.firstInitScreen.bottomButtons.done,
    },
    sphereInactive: {
        borderColor: commonStyle.firstInitScreen.statusSphere.inactiveBorder,
    },
    sphereError: {
        borderColor: commonStyle.firstInitScreen.bottomButtons.error,
    },
    statusSphereLabel: {
        fontFamily: commonStyle.fontFamilyExtraBold,
        fontSize: commonStyle.fontSize.pageTitle,
        textAlign: "center",
    },
    labelActive: {
        color: commonStyle.firstInitScreen.statusSphere.activeBorder,
    },
    labelDone: {
        color: commonStyle.firstInitScreen.bottomButtons.done,
    },
    labelError: {
        color: commonStyle.firstInitScreen.bottomButtons.error,
    },
    labelInactive: {
        color: commonStyle.firstInitScreen.statusSphere.inactiveBorder,
    },
    divider: {
        width: "30%",
        height: commonStyle.firstInitScreen.divider.height,
        backgroundColor:
            commonStyle.firstInitScreen.statusSphere.inactiveBorder,
        alignSelf: "flex-end",
        marginBottom:
            commonStyle.firstInitScreen.statusSphere.size / 2 -
            commonStyle.firstInitScreen.divider.height / 2,
        marginHorizontal: 5,
    },
    dividerDone : {
        backgroundColor: commonStyle.firstInitScreen.bottomButtons.done,
    },
    bottomButonsContainer: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    bottomButtons: {
        width: commonStyle.firstInitScreen.bottomButtons.size,
        height: commonStyle.firstInitScreen.bottomButtons.size,
        borderRadius: commonStyle.firstInitScreen.bottomButtons.size / 2,
        justifyContent: "center",
        alignItems: "center",
        elevation: 1,
    },
    bottomButtonsInactive: {
        backgroundColor: commonStyle.firstInitScreen.bottomButtons.inactive,
        borderColor: commonStyle.firstInitScreen.bottomButtons.inactiveBorder,
    },
    bottomButtonsActive: {
        backgroundColor: commonStyle.firstInitScreen.statusSphere.activeBorder,
    },
    bottomButtonsDone: {
        backgroundColor: commonStyle.firstInitScreen.bottomButtons.done,
    },
    bottomButtonsError: {
        backgroundColor: commonStyle.firstInitScreen.bottomButtons.error,
    },
})

export default FirstInitScreen
