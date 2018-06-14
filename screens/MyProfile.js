import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

class MyProfile extends Component {
  static navigationOptions = {
    title: 'My Profile',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='person' size={25} color={tintColor} />
        );
    },
  };
  render() {
    return (
      <View>
        <Text>MyProfile Components</Text>
        <Text>MyProfile Components</Text>
        <Text>MyProfile Components</Text>
        <Text>MyProfile Components</Text>
        <Text>MyProfile Components</Text>
      </View>
    );
  }
}

export default MyProfile;
