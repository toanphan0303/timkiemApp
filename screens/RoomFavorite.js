import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import { material } from 'react-native-typography';
import { connect } from 'react-redux';
import Listing from '../components/RoomListing';
import * as actions from '../actions';
import TimKiemHeader from '../components/TimKiemHeader';

const RoomPostSummary = ListingComponent =>
  class extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TimKiemHeader />
        <ListingComponent {...this.props} listing={this.props.userRoom.result} />
      </View>
    );
  }
};

const mapStateToProps = ({ userRoom }) => {
  return { userRoom };
};

export default connect(mapStateToProps, actions)(RoomPostSummary(Listing));
