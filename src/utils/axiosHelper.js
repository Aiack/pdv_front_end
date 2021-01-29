import Toast from 'react-native-toast-message';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const getPortInfo = async () => {
    const jsonValue = await AsyncStorage.getItem('portInfo')
    if(jsonValue != null){
        return JSON.parse(jsonValue)
    }
    else{
        return {
            ipAdress: '192.168.5.120:5000',
            timeOut: '1500'
        }
    }
}

export default async (axiosObject, ToastRef) => {
    const portInfo = await getPortInfo()

    try{
        const res = await axios({
            ...axiosObject,
            url: ('http://' + portInfo.ipAdress + '/' + axiosObject.url),
            timeout: parseFloat(portInfo.timeOut),
        })
        return res.data
    }
    catch (error) {
        if(ToastRef){
            if (error.response) {
                if(error.response.data.message){
                    errorMessage = error.response.data.message + ''
                    errorError = error.response.data.error + ''
                }
                else{
                    errorMessage = 'Error'
                    errorError = error.message
                }
            } else if (error.request) {
                errorMessage = 'Erro'
                errorError = error.request['_response'] + ''
            } else {
                errorMessage = 'Erro'
                errorError = error.message + ''
            }
            Toast.setRef(ToastRef)
            Toast.show({
                text1: errorMessage,
                text2: errorError,
                type: 'error',
                position: 'bottom'
            })
        }

        throw error
    }
}