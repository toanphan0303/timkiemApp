import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Listing from '../components/RoomListing';
import * as actions from '../actions';
import TimKiemHeader from '../components/TimKiemHeader';

const RoomPostSummary = ListingComponent =>
  class extends Component {
    componentWillMount() {
      const setParamsAction = this.props.navigation.setParams({
      params: { showTabBar: false },
      key: this.props.navigation.state.key,
      });
      this.props.navigation.dispatch(setParamsAction);
    }
    render() {
      return (
        <View style={{ flex: 1 }}>
          <TimKiemHeader {...this.props} parentScreen='myProfile'/>
          <ListingComponent {...this.props} listing={this.props.userRoom.result} />
        </View>
      );
    }
  };

const mapStateToProps = ({ userRoom }) => {
  return { userRoom };
};

export default connect(mapStateToProps, actions)(RoomPostSummary(Listing));
