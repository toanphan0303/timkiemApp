import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import Listing from '../components/RoomListing';
import * as actions from '../actions';
import TimKiemHeader from '../components/TimKiemHeader';

const RoomPostSummary = ListingComponent =>
  class extends Component {
    state ={
      listing: {}
    }
    componentWillMount() {
      const setParamsAction = this.props.navigation.setParams({
      params: { showTabBar: false },
      key: this.props.navigation.state.key,
      });
      this.props.navigation.dispatch(setParamsAction);
      this.setState({
        listing: this.props.userRoom.result
      });
    }
    componentWillReceiveProps = async(nextProps) => {
      if (!_.isEqual(nextProps.userRoom.result, this.state.listing)) {
        await this.setState({ listing: nextProps.userRoom.result });
      }
    }
    render() {
      const { listing } = this.state;
      console.log('listing', listing);
      return (
        <View style={{ flex: 1 }}>
          <TimKiemHeader {...this.props} parentScreen='myProfile' />
          <ListingComponent {...this.props} listing={listing} component='myPost' />
        </View>
      );
    }
  };

const mapStateToProps = ({ userRoom }) => {
  return { userRoom };
};

export default connect(mapStateToProps, actions)(RoomPostSummary(Listing));
