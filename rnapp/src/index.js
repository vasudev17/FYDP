import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Button, Text, View } from 'react-native';
import { styles } from './styles';
import LoginScreen from './components/LoginScreen';
import RecommendationsScreen from './components/RecommendationsScreen';

class HomeScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.homeText}>Soil Detectron</Text>
        <View style={styles.spacer}>
          <Button
            onPress={() => navigate('Login')}
            title="Authenticate"
          />
          <Button
            onPress={() => navigate('Recommend')}
            title="Bypass"
          />
        </View>
      </View>
    );
  }
};

const AppNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Recommend: { screen: RecommendationsScreen },
});

const App = createAppContainer(AppNavigator);

export default App;