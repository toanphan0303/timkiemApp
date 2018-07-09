import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Icon, Header, Button, Card } from 'react-native-elements';
import SearchBar from '../components/SearchTabBar';
import * as actions from '../actions';
import Listing from '../components/RoomListing';
import TimKiemHeader from '../components/TimKiemHeader';

const RoomList = ListingComponent =>
  class extends Component {
  static navigationOptions = {
    title: 'List',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='list' size={25} color={tintColor} />
        );
    },
  };

  onPressMap() {
    this.props.navigation.navigate('rooms');
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TimKiemHeader />
        <ListingComponent
          {...this.props}
          listing={this.props.roomsInZips.Items}
          component='roomList'
        />
      </View>
    );
  }
};

const styles = {

};
const mapStateToProps = ({ roomsInZips }) => {
  return { roomsInZips };
};
export default connect(mapStateToProps, actions)(RoomList(Listing));
