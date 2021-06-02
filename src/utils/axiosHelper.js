import Toast from 'react-native-toast-message';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default async (axiosObject, ToastRef) => {
    const serverAdress = await AsyncStorage.getItem("serverAdress")

    try{
        const res = await axios({
            ...axiosObject,
            url: (serverAdress + axiosObject.url),
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