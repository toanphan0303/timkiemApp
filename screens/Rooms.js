import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View, AsyncStorage } from 'react-native';
import Map from '../components/Map';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Rooms extends Component {
  static navigationOptions = {
    title: 'Rooms',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='home' size={25} color={tintColor} />
        );
    },
  };
  componentDidMount = async() => {
    const accessToken = await AsyncStorage.getItem('access_token');
    await this.props.getUser(accessToken);
  }
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

export default connect(null,actions)(Rooms);
