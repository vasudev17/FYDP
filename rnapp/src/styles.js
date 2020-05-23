import { StyleSheet } from 'react-native';

export const colours = {
    mintGreen: '#90EDBF',
    blue: '#0000ff',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colours.mintGreen,
    },
    homeText: {
        fontSize: 32,
    },
    loginText: {
        fontSize: 16,
        textAlign: 'justify',
        width: '70%',
    },
    resultsContainer: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    resultsHeader: {
        fontSize: 18,
        textAlign: 'left',
        paddingLeft: 60,
        paddingRight: 60,
    },
    resultsText: {
        fontSize: 18,
        textAlign: 'left',
        paddingLeft: 60,
        paddingRight: 60,
    },
    spacer: {
        paddingTop: 20,
        paddingBottom: 20,
    }
});
