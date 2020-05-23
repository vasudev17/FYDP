const constants = {
    loginText: "Place your phone near in the device's vicinity to authenticate. " +
        "Ensure that bluethooth is turned on.",
};

const BLE = {
    DEVICE_NAME: 'DSD TECH',
    // DEVICE_NAME: 'Saahiti’s MacBook Pro',
    STATES: {
        UNKNOWN: 'Unknown',
        RESETTING: 'Resetting',
        UNSUPPORTED: 'Unsupported',
        UNAUTHORIZED: 'Unauthorized',
        POWERED_OFF: 'PoweredOff',
        POWERED_ON: 'PoweredOn'
    },
    DEVICE_UUID: 'A318ACED-F075-1026-87ED-B39F4BEDD45C',
    SERVICE_UUID: '0000FFE0-0000-1000-8000-00805F9B34FB',
    CHARACTERISTIC_UUID: '0000FFE1-0000-1000-8000-00805F9B34FB',
};

export { BLE };
export default constants;