import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from "react-native"

import commonStyle from "../commonStyle"
import CustomPicker from "../components/customPicker"

import IconFeather from "react-native-vector-icons/Feather"
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons"

import TextInputMask from "react-native-text-input-mask"
import CameraModal from "../components/codeReaderModa"
import Axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUniqueId, getSystemName, getBrand } from 'react-native-device-info'

const FirstInitScreen = (props) => {
    const [screenStep, setScreenStep] = useState(0)
    const [haverError, setHaveError] = useState(false)
    const [isCameraModal, setIsCameraModal] = useState(false)
    const [cameraData, setCameraData] = useState(null)

    const [isQRValid, setIsQRValid] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const [formHostname, setFormHostname] = useState("")
    const [formIPAddr, setFormIPAddr] = useState("")

    const [sellersList, setSellersList] = useState(null)
    const [selectedSeller, setSelectedSeller] = useState(null)
    const [profileName, setProfileName] = useState('')

    //Check if the server and the user is setted, then redirects to the correct screen
    useEffect(async () => {
        const ip = await AsyncStorage.getItem("ipAdress")
        if(ip){
            try {
                const res = await Axios.get(ip)
                await getSellersList()
                setScreenStep(2)
            }
            catch (error) {
                console.log(error)
            }
        }
    }, [])

    //Verify the integrity of the camera data
    useEffect(() => {
        if (cameraData) {
            try {
                jsonData = JSON.parse(cameraData)
                if (jsonData.hostname && jsonData.IPAddr) {
                    setIsQRValid(true)
                    setFormHostname(jsonData.hostname)
                    setFormIPAddr(jsonData.IPAddr)
                } else {
                    setIsQRValid(false)
                }
            } catch (error) {
                setIsQRValid(false)
            }
        }
    }, [cameraData])

    //Removes the error when forms are filled
    useEffect(() => {
        setHaveError(false)
    }, [formIPAddr, profileName])

    //Returns the correct screen based on the screen level
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
                        <IconFeather
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
                <View style={[styles.centerContent]}>
                    <Text style={styles.title}>
                        Para configuração rápida do servidor, você pode:
                    </Text>
                    <TouchableOpacity
                        style={styles.centerContent}
                        onPress={() => setIsCameraModal(true)}
                    >
                        <Text
                            style={[
                                styles.title,
                                {
                                    fontSize: commonStyle.fontSize.modalText,
                                },
                            ]}
                        >
                            Ler QRCode
                        </Text>
                        <IconMaterial
                            name="qrcode"
                            size={150}
                            color={
                                isQRValid == null
                                    ? commonStyle.firstInitScreen.statusSphere
                                          .activeBorder
                                    : isQRValid
                                    ? commonStyle.firstInitScreen.bottomButtons
                                          .done
                                    : commonStyle.firstInitScreen.bottomButtons
                                          .error
                            }
                        />
                        <Text
                            style={[
                                styles.title,
                                {
                                    fontSize: commonStyle.fontSize.modalText,
                                },
                            ]}
                        >
                            {isQRValid == null
                                ? "Pressione para abrir a câmera"
                                : isQRValid
                                ? "QR lido com sucesso! 👍"
                                : "QR invalido 😞. Pressione para tentar novamente"}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        Ou inserir os dados manualmente:
                    </Text>
                    <View style={styles.centerContent}>
                        <View style={styles.formContainer}>
                            <Text style={styles.containerPlaceholder}>
                                {"IPAddr"}
                            </Text>
                            <TextInputMask
                                style={styles.input}
                                value={formIPAddr}
                                onChangeText={(val) => setFormIPAddr(val)}
                                autoCapitalize="characters"
                                mask={"[999].[999].[999].[999]:[9999]"}
                                keyboardType="phone-pad"
                                placeholder="000.000.0000.000:0000"
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <Text style={styles.containerPlaceholder}>
                                {"Hostname"}
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={formHostname}
                                onChangeText={(val) => setFormHostname(val)}
                                placeholder="Hostname"
                            />
                        </View>
                    </View>
                </View>
            )
        } else if (step === 2) {
            return (
                <View style={styles.centerContent}>
                    <Text style={styles.title}>
                        Agora vamos realizar a configuração do perfil do
                        vendedor:
                    </Text>
                    <View style={styles.centerContent}>
                        <View style={styles.formContainer}>
                            <Text style={styles.containerPlaceholder}>
                                Nome do perfil:
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome"
                                value={profileName}
                                onChangeText={(val) => setProfileName(val)}
                                maxLength={80}
                            />
                        </View>
                        <View style={styles.formContainer}>
                            <Text style={styles.containerPlaceholder}>
                                Vendedor:
                            </Text>
                            <CustomPicker
                                items={sellersList}
                                defaultValue={selectedSeller}
                                onChangeItem={(item) => {
                                    setSelectedSeller(item)
                                }}
                            />
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.centerContent}>
                    <Text style={styles.title}>ELSE!</Text>
                </View>
            )
        }
    }

    const advanceScreenStep = async () => {
        
        if (screenStep == 1) {
            testConnection()
        }
        else if (screenStep == 2) {
            await signin()

        }
        else {
            setScreenStep((oldState) => oldState + 1)
        }
    }

    //Test the connection and saves the ipAdress
    const testConnection = async () => {
        if (formIPAddr) {
            const ip = "http://" + formIPAddr + "/"
            console.log(ip)
            setIsLoading(true)
            try {
                const res = await Axios.get(ip)
                await AsyncStorage.setItem("ipAdress", ip)
                await getSellersList()
                setIsLoading(false)
                setScreenStep(2)
            } catch (error) {
                setIsLoading(false)
                setHaveError(true)
            }
        }
    }

    const getSellersList = async () => {
        const ip = await AsyncStorage.getItem("ipAdress")
        try {
            const res = await Axios({
                method: "GET",
                url: ip + "/sellers",
            })
            list = res.data.map((item) => {
                return {
                    label: item.NOMEVENDED,
                    value: item.CODVENDED,
                }
            })
            setSellersList(list)
        } catch (error) {
            console.log(error)
        }
    }

    const signin = async () => {
        const ip = await AsyncStorage.getItem("ipAdress")
        if(profileName.trim()){
            try {
                const res = await Axios({
                    method: 'POST',
                    url: (ip + '/user/'),
                    data: {content: {
                        id: getUniqueId(),
                        profile_name: profileName,
                        platform: getSystemName(),
                        phone_model: getBrand(),
                        cod_vend: selectedSeller,
                        nome_vend: sellersList.find((item) => item.value === selectedSeller).label
                    }}
                })
                setHaveError(false)
            }
            catch (error) {
                console.log(error)
            }   
        }
        else{
            setHaveError(true)
        }
    }

    return (
        <View style={styles.mainContainer}>
            <CameraModal
                isVisible={isCameraModal}
                onClose={() => setIsCameraModal(false)}
                onRead={(data) => setCameraData(data)}
            />
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
                            <IconFeather
                                name="x"
                                size={30}
                                color={
                                    commonStyle.firstInitScreen.bottomButtons
                                        .error
                                }
                            />
                        ) : screenStep > 1 ? (
                            <IconFeather
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
                <View
                    style={[
                        styles.divider,
                        screenStep === 2 ? styles.dividerDone : null,
                    ]}
                />
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
                            <IconFeather
                                name="x"
                                size={30}
                                color={
                                    commonStyle.firstInitScreen.bottomButtons
                                        .error
                                }
                            />
                        ) : screenStep > 2 ? (
                            <IconFeather
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
                {/* Forward button */}
                <TouchableOpacity
                    style={[
                        styles.bottomButtons,
                        screenStep != 2
                            ? styles.bottomButtonsActive
                            : styles.bottomButtonsDone,
                        haverError ? styles.bottomButtonsError : null,
                    ]}
                    onPress={advanceScreenStep}
                    disabled={haverError || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#00ff00" />
                    ) : haverError ? (
                        <IconFeather name="x" size={50} color={"white"} />
                    ) : screenStep != 2 ? (
                        <IconFeather
                            name="chevron-right"
                            size={50}
                            color={"white"}
                        />
                    ) : (
                        <IconFeather name="check" size={50} color={"white"} />
                    )}
                    {}
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
        flex: 1,
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
    dividerDone: {
        backgroundColor: commonStyle.firstInitScreen.bottomButtons.done,
    },
    bottomButonsContainer: {
        width: "100%",
        bottom: 0,
        paddingBottom: 10,
        left: "70%",
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
    cameraContainer: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
    serverScreenText: {
        fontFamily: commonStyle.fontFamily,
        fontSize: commonStyle.fontSize.bodyText,
    },
    formContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: commonStyle.borderRadius.main,
        elevation: 1,
        paddingHorizontal: commonStyle.spacers.padding.horizontal,
        marginLeft: commonStyle.spacers.margin.horizontal,
        marginRight: commonStyle.spacers.margin.horizontal,
        marginVertical: commonStyle.spacers.margin.vertical,
        height: commonStyle.heighs.NewBudget.customContainer,
    },
    containerPlaceholder: {
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
    },
    input: {
        flex: 1,
        fontSize: commonStyle.fontSize.formText,
        fontFamily: commonStyle.fontFamily,
        textAlign: "right",
        fontWeight: "bold",
    },
})

export default FirstInitScreen
