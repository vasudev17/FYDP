const ENV_MODES = {
    DEV: 'DEV',
    TEST: 'TEST',
    PROD: 'PROD',
};
const environmentMode = process.env.ENV_MODE || ENV_MODES.DEV;

// 10.0.2.2 -- alias to your host loopback interface
// 127.0.0.1 -- the emulated device's own loopback interface

// Use ngrok to expose local server (backend)
const NGROK_URL = '';

const SERVER_URL = environmentMode === ENV_MODES.PROD
    ? `${NGROK_URL || '10.0.2.2'}:8000`
    : 'http://soildetectron.herokuapp.com';

export { SERVER_URL };
