import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUniqueId } from "react-native-device-info"

const getIpAdress = async () => {
    const ip = await AsyncStorage.getItem("serverAdress")
    return ip
}

//General Functions
const haveConnection = async () => {
    const ip = await getIpAdress()
    try {
        const res = await axios({
            method: "GET",
            url: ip,
            timeout: 2000
        })
        return true
    }
    catch (error) {
        return false
    }
}

//User endpoint
const createUser = async (content) => {
    const ip = await getIpAdress()

    try {
        const res = await axios({
            method: "POST",
            url: ip + "/user/",
            data: {
                content: content
            }
        })
        return res.data
    }
    catch (error) {
        if (error.response) {
            if (error.request.status === 401) {
                return "User exists"
            }
        }
        return null
    }
}

const getSellersList = async () => {
    const ip = await getIpAdress()
    console.log(ip)

    try {
        const res = await axios({
            method: "GET",
            url: ip + "/sellers"
        })
        return res.data
    }
    catch (error) {
        return null
    }
}

const getUser = async () => {
    const ip = await getIpAdress()

    try {
        const res = await axios({
            method: "GET",
            url: ip + "/user/",
            params: {id: getUniqueId()}
        })

        if(res.data.flag_have_acess){
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${res.data.acessToken}`
        }

        return res.data
    }
    catch (error) {
        console.log(error)
        return null
    }
}

export {
    haveConnection,
    createUser,
    getSellersList,
    getUser
}