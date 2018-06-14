import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

class Rooms extends Component {
  static navigationOptions = {
    title: 'Rooms',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='room' size={25} color={tintColor} />
        );
    },
  };
  render() {
    return (
      <View>
        <Text>Rooms Components</Text>
        <Text>Rooms Components</Text>
        <Text>Rooms Components</Text>
        <Text>Rooms Components</Text>
        <Text>Rooms Components</Text>
      </View>
    );
  }
}

export default Rooms;
