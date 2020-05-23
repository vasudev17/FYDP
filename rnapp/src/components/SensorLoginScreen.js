import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    Button
} from "react-native";
import { BleManager, BleError } from "react-native-ble-plx";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: []
        };
    }

    componentDidMount() {
        const manager = new BleManager();
        manager.onStateChange(newState => {
            if (newState != "PoweredOn") return;
            this._log("Started scanning...");
            manager.startDeviceScan(
                null,
                {
                    allowDuplicates: true
                },
                (error, device) => {
                    if (error) {
                        this._logError("SCAN", error);
                        return;
                    }
                    this._log("Device: " + device.name, device);
                }
            );
        }, true);
    }

    _log = (text, ...args) => {
        const message = "[" + Date.now() % 10000 + "] " + text;
        this.setState({
            text: [message, ...this.state.text]
        });
    };

    _logError = (tag, error) => {
        this._log(
            tag +
            "ERROR(" +
            error.errorCode +
            "): " +
            error.message +
            "\nREASON: " +
            error.reason +
            " (att: " +
            error.attErrorCode +
            ", ios: " +
            error.iosErrorCode +
            ", and: " +
            error.androidErrorCode +
            ")"
        );
    };

    delay = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    };

    render() {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <Button
                    onPress={() => {
                        this.setState({
                            text: []
                        });
                    }}
                    title={"Clear"}
                />
                <FlatList
                    style={styles.container}
                    data={this.state.text}
                    renderItem={({ item }) => <Text> {item} </Text>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

