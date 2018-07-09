import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Icon, Header, Button, Card } from 'react-native-elements';
import SearchBar from '../components/SearchTabBar';
import * as actions from '../actions';
import Listing from '../components/RoomListing';

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
        <Header
          outerContainerStyles={{
            height: 65,
            backgroundColor: 'white',
            marginTop: 25,
            paddingTop: 5,
            paddingBottom: -5
          }}
          innerContainerStyles={{
            backgroundColor: 'white',
            alignItems: 'flex-start',
            justifyContent: 'space-around'
          }}
          rightComponent={
            <Button
              title='Map'
              backgroundColor='white'
              buttonStyle={{ paddingTop: 15 }}
              color='black'
              onPress={this.onPressMap.bind(this)}
            />}
          leftComponent={
            <SearchBar
              navigation={this.props.navigation}
            />
          }
        />
        <ListingComponent {...this.props} listing={this.props.roomsInZips.Items} component />
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
