import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { colours, styles } from './../styles';
import { SERVER_URL } from './../config';
import mockData from './../mock_data';

class RecommendationsScreen extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const fetchResult = this.state && this.state.ret ? this.state.ret : null;
        let ph, moisture, common_name, species;
        if (fetchResult) {
            const plant = fetchResult.plant;
            ph = parseFloat(fetchResult.ph).toFixed(2);
            moisture = parseFloat(fetchResult.moisture).toFixed(2);
            common_name = plant.common_name;
            species = plant.species;
        }

        return (
            <View style={styles.container}>
                <Text style={styles.resultsHeader}>
                    {`Welcome to SoilDetectron's Recommendations`}
                </Text>
                {fetchResult ?
                    <View style={styles.resultsContainer}>
                        <View style={styles.spacer}>
                            <Text style={styles.resultsText}>
                                {
                                    `Readings from Arduino sensors:`
                                    + `\nAverage pH: ${ph}`
                                    + `\nAverage moisture: ${moisture}`
                                }
                            </Text>
                        </View>
                        <View style={styles.spacer}>
                            <Text style={styles.resultsText}>
                                {
                                    `Based on the above values for the soil's pH and moisture,`
                                    + ` the following plant is suitable for growth:`
                                    + `\nCommon Name: ${common_name}`
                                    + `\nSpecies: ${species}`
                                }
                            </Text>
                        </View>
                    </View>
                    : null
                }
            </View>
        );
    }

    componentDidMount() {
        const phValues = mockData.ph;
        const mValues = mockData.moisture;
        const average = arr => arr.reduce((a, b) =>  parseFloat(a) + parseFloat(b), 0) / arr.length;
        const ph = average(phValues);
        const moisture = average(mValues);
        console.log("average ph: ", ph);
        console.log("average moisture: ", moisture);

        const ret = { ph, moisture };
        console.log("Attempting to fetch from host: ", SERVER_URL);
        fetch(`${SERVER_URL}/plant`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ph, moisture }),
        }).then((response) => response.json())
            .then((responseJson) => {
                ret['plant'] = responseJson;
                this.setState({ ret });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

export default RecommendationsScreen;