import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Header, Button } from 'react-native-elements';
import SearchBar from '../components/SearchTabBar';
import * as actions from '../actions';
import Listing from '../components/RoomListing';
import SearchHeader from '../components/SearchHeader';

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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader {...this.props} go='rooms' title='Map' />
        <ListingComponent {...this.props} listing={this.props.roomsInZips.Items} component />
      </View>
    );
  }
};

const mapStateToProps = ({ roomsInZips }) => {
  return { roomsInZips };
};
export default connect(mapStateToProps, actions)(RoomList(Listing));
