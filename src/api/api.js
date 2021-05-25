import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const getIpAdress = async () => {
    const ip = await AsyncStorage.getItem("ipAdress")
    return ip
}

//General Functions
const haveConnection = async () => {
    const ip = await getIpAdress()
    try {
        const res = await axios({
            method: "GET",
            url: ip
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
        throw null
    }
}

const userExists = async (id) => {
    const ip = await getIpAdress()

    try {
        const res = await axios({
            method: "GET",
            url: ip + "/user/",
            params: {id: id}
        })
        return true
    } 
    catch (error) {
        if (error.response) {
            if (error.request.status === 401) {
                return true
            }
            if (error.request.status === 404) {
                return false
            }
        }
        return null
    }
}

const getSellersList = async () => {
    const ip = await getIpAdress()

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
            params: {id: id}
        })
        Axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${res.data['acessToken']}`
        return res.data
    }
    catch (error) {
        return null
    }
}

export {
    haveConnection,
    createUser,
    userExists,
    getSellersList,
    getUser
}