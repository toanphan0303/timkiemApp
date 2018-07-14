import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import GoogleSearch from '../components/GoogleSearchBar';

class RoomSearch extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <GoogleSearch navigation={this.props.navigation} />
      </View>
    );
  }
}

export default RoomSearch;
