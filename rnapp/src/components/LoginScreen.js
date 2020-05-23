import React, { Component } from 'react';
import { ActivityIndicator, Button, Text, View, PermissionsAndroid, Platform } from 'react-native';
import { colours, styles } from './../styles';
import { BleManager } from 'react-native-ble-plx';
import constants, { BLE } from './../constants';

class LoginScreen extends Component {
    constructor() {
        super();
        this.state = { connected: false };
        this.manager = new BleManager();
        this.selectedDevice = null;
    }

    info(message) {
        this.setState({ info: message })
    }

    error(message) {
        this.setState({ info: "ERROR: " + message })
    }

    updateValue(key, value) {
        this.setState({ values: { ...this.state.values, [key]: value } })
    }
        
    componentDidMount() {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
                .then((result) => {
                    if (result === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log("User accepted.");
                    } else {
                        console.log("User refuseed.");
                    }
            });
        }

        const subscription = this.manager.onStateChange((state) => {
            console.log("State changed: ", state);
            if (state === BLE.STATES.POWERED_ON) {
                this.scanAndConnect();
                subscription.remove();
            }
        }, true);
    }

    scanAndConnect() {
        this.manager.startDeviceScan(null, null, (err, device) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Scanning devices...");
            
            if (device && device.name) {
                console.log("Found device(s) via bluetooth: ", device.name);

                if (device.name === BLE.DEVICE_NAME) {
                    console.log("Found target device: ", device.name);
                    this.manager.stopDeviceScan();
                    this.selectedDevice = device;

                    this.manager.connectToDevice(this.selectedDevice['id'])
                        .then((device) => {
                            console.log("Connected.");
                            return device.discoverAllServicesAndCharacteristics();
                        })
                        // .then((device) => {
                        //     console.log("Result from RSSI Read:: ", device['rssi']);
                        // })
                        .then((device) => {
                            this.info("Setting notifications")
                            return this.setupNotifications(device)
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                    this.setState({
                        connected: true,
                        device: device
                    });
                }
                return;
            }
            this.setState({ connected: false });
        });
    }

    async setupNotifications(device) {
        const serviceUUID = BLE.SERVICE_UUID;
        const notifyUUID = BLE.CHARACTERISTIC_UUID;
 
        device.monitorCharacteristicForService(serviceUUID, notifyUUID, (error, characteristic) => {
            if (error) {
                this.error(error.message)
                return
            }
            console.log('Characetristic value read: ', characteristic.value)
            this.updateValue(characteristic.uuid, characteristic.value)
        })
    }

    componentWillUnmount() {
        // TODO: Check if device still connected before attempting disconnect
        this.manager.stopDeviceScan();
        this.manager.cancelDeviceConnection(
            this.state.selectedDevice && this.state.selectedDevice.id || BLE.DEVICE_UUID
        ).then((device) => {
            console.log("Successfully closed connection to device.");
        });
    }

    render() {
        const connected = this.state.connected; 
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text style={styles.loginText}>
                    {constants.loginText}
                </Text>

                <View style={styles.spacer}>
                    <ActivityIndicator 
                        size="large"
                        color={colours.blue}
                        animating={!connected}
                        hidesWhenStopped={true}
                    />
                </View>

                <View style={styles.spacer}>
                    <Button
                        onPress={() => navigate('Recommend')}
                        title="Fetch Data"
                    />  
                </View>
            </View>
        );
    }
}

export default LoginScreen;