import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import Map from '../components/Map';

class Rooms extends Component {
  static navigationOptions = {
    title: 'Rooms',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='home' size={25} color={tintColor} />
        );
    },
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

export default Rooms;
