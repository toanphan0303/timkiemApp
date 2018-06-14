import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View, Text } from 'react-native';
import Map from '../components/Map';

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='home' size={25} color={tintColor} />
        );
    },
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map />
      </View>
    );
  }
}

export default Home;
