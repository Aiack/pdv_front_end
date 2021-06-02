import FindLocalDevices from "react-native-find-local-devices"
import { DeviceEventEmitter } from "react-native"
import axios from "axios"

const NEW_DEVICE_FOUND = "NEW_DEVICE_FOUND"
const CHECK = "CHECK"
const NO_DEVICES = "NO_DEVICES"
const NO_PORTS = "NO_PORTS"
const RESULTS = "RESULTS"
const CONNECTION_ERROR = "CONNECTION_ERROR"

class NetworkDiscoverer {
    Timeout = 50
    Ports = [5151]
    acessCode = null

    NewDeviceFoundSubscription = null
    ResultsSubscription = null
    CheckDeviceSubscription = null
    NoDevicesSubscription = null
    NoPortsSubscription = null
    ConnectionErrorSubscription = null

    isSearching = false
    serverUrl = null
    isPinging = false

    constructor(timeout = 50, ports = [], acessCode = null) {
        this.Timeout = timeout
        this.Ports = ports
        this.acessCode = acessCode
    }

    discoverLocalDevices = () => {
        this.NewDeviceFoundSubscription = DeviceEventEmitter.addListener(
            NEW_DEVICE_FOUND,
            async (device) => {
                if (device.ipAddress && device.port) {
                    this.serverUrl = await this.testConnection(device)
                    this.cancelDiscovering()
                }
            }
        )

        this.ResultsSubscription = DeviceEventEmitter.addListener(
            RESULTS,
            (devices) => {
                this.cancelDiscovering()
            }
        )

        this.CheckDeviceSubscription = DeviceEventEmitter.addListener(
            CHECK,
            (device) => {
                // On each device
            }
        )

        this.NoDevicesSubscription = DeviceEventEmitter.addListener(
            NO_DEVICES,
            () => {
                this.cancelDiscovering()
            }
        )

        this.NoPortsSubscription = DeviceEventEmitter.addListener(
            NO_PORTS,
            () => {
                this.cancelDiscovering()
            }
        )

        this.ConnectionErrorSubscription = DeviceEventEmitter.addListener(
            CONNECTION_ERROR,
            (error) => {
                // Handle error messages for each socket connection
                // console.log(error.message);
            }
        )

        FindLocalDevices.getLocalDevices({
            timeout: this.Timeout,
            ports: this.Ports,
        })
    }

    cancelDiscovering = () => {
        FindLocalDevices.cancelDiscovering()
        if (this.NewDeviceFoundSubscription) {
            this.NewDeviceFoundSubscription.remove()
        }
        if (this.CheckDeviceSubscription) {
            this.CheckDeviceSubscription.remove()
        }
        if (this.ResultsSubscription) {
            this.ResultsSubscription.remove()
        }
        if (this.NoDevicesSubscription) {
            this.NoDevicesSubscription.remove()
        }
        if (this.NoPortsSubscription) {
            this.NoPortsSubscription.remove()
        }
        if (this.ConnectionErrorSubscription) {
            this.ConnectionErrorSubscription.remove()
        }
        this.isSearching = false
    }

    getLocalDevicesPromisse = async () => {
        this.isSearching = true

        this.discoverLocalDevices()

        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if ((!this.isSearching && !this.isPinging) || this.serverUrl) {
                    resolve()
                    clearInterval(interval)
                }
            }, this.Timeout * 2)
        })
    }

    getLocalDevices = async () => {
        await this.getLocalDevicesPromisse()
        return this.serverUrl
    }

    testConnection = async (device) => {
        this.isPinging = true
        var serverUrl = null

        if(this.acessCode){
            try {
                testUrl = "http://" + device.ipAddress + ":" + device.port + "/"
                await axios({
                    method: "GET",
                    url: testUrl,
                    timeout: 2000,
                    params: {code: this.acessCode}
                })
                serverUrl = testUrl
            } catch (error) {
    
            }
        }
        this.isPinging = false
        return serverUrl
    }
}

export default NetworkDiscoverer
