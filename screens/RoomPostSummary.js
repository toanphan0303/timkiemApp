import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import { material } from 'react-native-typography';
import { connect } from 'react-redux';
import Listing from '../components/RoomListing';
import * as actions from '../actions';

const RoomPostSummary = ListingComponent =>
  class extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          outerContainerStyles={{ backgroundColor: 'white', marginTop: 25, height: 60 }}
          innerContainerStyles={{ backgroundColor: 'white' }}
          leftComponent={
            <View>
              <Text style={[material.title]}>Tim Kiem </Text>
            </View>
          }
        />
        <ListingComponent {...this.props} listing={this.props.userRoom.result} />
      </View>
    );
  }
};

const mapStateToProps = ({ userRoom }) => {
  return { userRoom };
};

export default connect(mapStateToProps, actions)(RoomPostSummary(Listing));
