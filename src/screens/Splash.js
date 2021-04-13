import React, {useEffect, useState} from 'react'
import { 
    StyleSheet,
    View,
    StatusBar,
    Image,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    TextInput
} from 'react-native'

import logo from '../../assets/imgs/logowhite.png'
import commonStyles from '../commonStyle'
import CustomPicker from '../components/customPicker'

import Icon from 'react-native-vector-icons/FontAwesome5'
import Axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUniqueId, getSystemName, getBrand } from 'react-native-device-info';
// import codePush from 'react-native-code-push'

import packageJson from '../../package.json'

export default props => {
    const [windowState, setWindowState] = useState('loading')
    const [profileName, setProfileName] = useState('')
    const [pickerItem, setPickerItem] = useState(null)
    const [pickerList, setPickerList] = useState(null)

    // const [codePushVersion, setCodePushVersion] = useState('')

    const getIpAdress = async () => {
        const jsonValue = await AsyncStorage.getItem('portInfo')
        if(jsonValue != null){
            return JSON.parse(jsonValue)
        }
        else{
            ipAdress = '10.0.0.103:5000'
            timeOut = '5000'
            const jsonValue = JSON.stringify({ipAdress, timeOut})
            await AsyncStorage.setItem('portInfo', jsonValue)
            return {
                ipAdress: '10.0.0.103:5000',
                timeOut: '5000'
            }
        }
    }

    const getTopItems = async () => {
        const portInfo = await getIpAdress()
        try {
            const res = await Axios({
                method: 'GET',
                url: ('http://' + portInfo.ipAdress + '/topitems'),
                timeout: parseFloat(portInfo.timeOut),
            })
            data = res.data
            const jsonValue = JSON.stringify({data})
            await AsyncStorage.setItem('topItems', jsonValue)
        }
        catch (error) {
            console.log(error)
        }   
    }

    const signin = async () => {
        if(profileName.trim()){
            const portInfo = await getIpAdress()
            try {
                const res = await Axios({
                    method: 'PUT',
                    url: ('http://' + portInfo.ipAdress + '/user/'),
                    timeout: parseFloat(portInfo.timeOut),
                    data: {data: JSON.stringify({
                        userId: getUniqueId(),
                        profileName: profileName,
                        platform: getSystemName(),
                        phoneModel: getBrand(),
                        codvend: pickerItem,
                        nomeVend: pickerList.find((item) => item.value === pickerItem).label
                    })}
                })
                getUser()
            }
            catch (error) {
                console.log(error)
            }   
        }
    }

    const getSellersList = async () => {
        const portInfo = await getIpAdress()
        try {
            const res = await Axios({
                method: 'GET',
                url: ('http://' + portInfo.ipAdress + '/sellers'),
                timeout: parseFloat(portInfo.timeOut),
            })
            list = res.data.map((item) => {
                return {
                    label: item.NOMEVENDED,
                    value: item.CODVENDED
                }
            })
            console.log(list)
            setPickerList(list)
        }
        catch (error) {
            console.log(error)
        }   
    }

    const getUser = async () => {
        setWindowState('loading')
        const portInfo = await getIpAdress()
        while(true){
            try {
                const res = await Axios({
                    method: 'GET',
                    url: ('http://' + portInfo.ipAdress + '/user/'),
                    timeout: parseFloat(portInfo.timeOut),
                    params: {userId: getUniqueId()}
                })
                Axios.defaults.headers.common['Authorization'] = `Bearer ${res.data}`
                await getTopItems()
                props.changeToApp()
                return
            }
            catch (error) {
                if (error.response) {
                    if(error.request.status === 404){
                        setWindowState('newUser')
                        getSellersList()
                        return
                    }
                    else if(error.request.status === 401){
                        setWindowState('acessDenied')
                        return
                    }
                }
                else if (error.request) {
                    if(!error.request['_timedOut']){
                        setWindowState('connectionError')
                        return
                    }
                }
                else {
                    console.log('else')
                }
            }
        }
    }

    // useEffect(() => {
    //     getUser()
    //     codePush.getUpdateMetadata().then((metadata) => {
    //         setCodePushVersion(metadata.appVersion)
    //     })
    // }, [])

    const setLayout = () => {
        if(windowState === 'connectionError'){
            return (
                <View style={styles.container}>
                    <Icon name='wifi' color={commonStyles.colors.primary} size={commonStyles.iconSizes.bigger * 1.5}/>
                    <Text style={styles.errorText}>Ocorreu um erro!</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => {
                        getUser()
                        }}>
                        <Icon name='redo' size={commonStyles.iconSizes.main} />
                        <Text style={[styles.errorText, {
                            color:'black',
                            paddingLeft: commonStyles.spacers.padding.horizontal,
                            fontSize: commonStyles.fontSize.button,
                            textAlign: 'center'
                            }]}>Tentar novamente?</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if(windowState === 'newUser'){
            return (
                <View style={{width: '90%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.errorText}>Novo Vendedor</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.containerPlaceholder}>Nome do perfil:</Text>
                        <TextInput style={styles.input}
                        placeholder='Nome'
                        value={profileName}
                        onChangeText={(val) => setProfileName(val)}
                        maxLength={80}/>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.containerPlaceholder}>Vendedor:</Text>
                        <CustomPicker items={pickerList}
                        defaultValue={pickerItem}
                        onChangeItem={item => {setPickerItem(item)}}/>
                    </View>
                    <TouchableOpacity style={[styles.retryButton, {width: '70%'}]} onPress={() => {signin()}}>
                        <Icon name='check-circle' size={commonStyles.iconSizes.main} />
                        <Text style={[styles.errorText, {
                            color:'black',
                            paddingLeft: commonStyles.spacers.padding.horizontal,
                            fontSize: commonStyles.fontSize.button,
                            textAlign: 'center'
                            }]}>Pedir acesso</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if(windowState === 'acessDenied'){
            return (
                <View style={styles.container}>
                    <Icon name='hand-paper' color={commonStyles.colors.primary} size={commonStyles.iconSizes.bigger * 1.5}/>
                    <Text style={styles.errorText}>A espera de liberação!</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => {
                        getUser()
                        }}>
                        <Icon name='redo' size={commonStyles.iconSizes.main} />
                        <Text style={[styles.errorText, {
                            color:'black',
                            paddingLeft: commonStyles.spacers.padding.horizontal,
                            fontSize: commonStyles.fontSize.button,
                            textAlign: 'center'
                            }]}>Tentar novamente?</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={commonStyles.colors.primary}/>
            </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                {windowState === 'loading' ? (
                    <View>
                        <Text style={[styles.title, {fontSize: 20}]}>Powered by:</Text>
                        <Text style={[styles.title, {fontSize: 40}]}>Jhelison Uchoa</Text>
                        <Text style={[styles.title, {fontSize: 20}]}>{'Versão ' + packageJson.version}</Text>
                    </View>
                ) : null}

            </View>
            <View style={styles.container}>
                <StatusBar backgroundColor={commonStyles.colors.secondary}/>
                <Image source={logo} style={styles.logo}/>
                <Text style={styles.title}>O Tijolão PDV</Text>
            </View>
            <View style={styles.container}>
                {setLayout()}
            </View>
            {/* <Text style={[styles.title, {fontSize: 10}]}>{'Code Push v ' + codePushVersion}</Text> */}

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:commonStyles.colors.secondary,
    },
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
        height: 100,
        resizeMode: 'contain',
    },
    title:{
        fontSize: 30,
        color: 'white',
        fontFamily: commonStyles.fontFamily,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    errorText:{
        fontSize: 30,
        color: commonStyles.colors.primary,
        fontFamily: commonStyles.fontFamily,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    retryButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: commonStyles.spacers.padding.horizontal * 4,
        paddingVertical: commonStyles.spacers.padding.vertical * 4,
        backgroundColor: 'white',
        borderRadius: commonStyles.borderRadius.plusMinusButtons,
        borderWidth: 1,
        borderColor: commonStyles.colors.separator
    },
    inputContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: commonStyles.borderRadius.main,
        elevation:1,
        marginVertical: commonStyles.spacers.margin.vertical,
        height: commonStyles.heighs.NewBudget.customContainer,
    },
    containerPlaceholder:{
        fontSize: commonStyles.fontSize.formText,
        fontFamily: commonStyles.fontFamily,
        paddingLeft: commonStyles.spacers.padding.horizontal,
    },
    input:{
        flex: 1,
        fontSize: commonStyles.fontSize.formText,
        fontFamily: commonStyles.fontFamily,
        textAlign: 'right',
        fontWeight: 'bold',
        paddingRight: commonStyles.spacers.padding.horizontal,
    },
})
