import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
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
  componentWillMount() {
    this.setState({
      listing: this.props.roomsInZips.Items
    });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader {...this.props} go='rooms' title='Map' />
        <ListingComponent {...this.props} listing={this.state.listing} component='roomList' />
      </View>
    );
  }
};

const mapStateToProps = ({ roomsInZips }) => {
  return { roomsInZips };
};
export default connect(mapStateToProps, actions)(RoomList(Listing));
