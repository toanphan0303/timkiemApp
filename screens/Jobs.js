import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

class Jobs extends Component {
  static navigationOptions = {
    title: 'Jobs',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='work' size={25} color={tintColor} />
        );
    },
  };
  render() {
    return (
      <View>
        <Text>Job Components</Text>
        <Text>Job Components</Text>
        <Text>Job Components</Text>
        <Text>Job Components</Text>
        <Text>Job Components</Text>
      </View>
    );
  }
}

export default Jobs;
