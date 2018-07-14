import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import Map from '../components/Map';
import * as actions from '../actions';

class Rooms extends Component {
  static navigationOptions = () => ({
    title: 'Rooms',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='home' size={25} color={tintColor} />
        );
    },
  });
  componentDidMount = async() => {
    const accessToken = await AsyncStorage.getItem('access_token');
    await this.props.getUser(accessToken);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map
          {...this.props}
        />
      </View>
    );
  }
}

export default connect(null, actions)(Rooms);
