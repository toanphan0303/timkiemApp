import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './store';
import Jobs from './screens/Jobs';
import Home from './screens/Home';
import Rooms from './screens/Rooms';
import MyProfile from './screens/MyProfile';

const MainNavigator = createBottomTabNavigator({
  home: { screen: Home },
  jobs: { screen: Jobs },
  rooms: { screen: Rooms },
  myProfile: { screen: MyProfile }
},
{
  navigationOptions: {
    tabBarOptions: {
      activeTintColor: '#rgb(90, 200, 250)',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 12
      }
    }
  }
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
