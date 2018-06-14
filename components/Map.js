import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import zipToLatLng from 'zipcodes';

import * as actions from '../actions';


class Map extends Component {
  state = {
    region: {
      latitude: 37.3382,
      longitude: -121.8863,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    mapLoaded: false,
    jobZip: []
  }
  componentDidMount() {
    this.setState({ mapLoaded: true });
  }

  onRegionChangeComplete = async (region) => {
    this.setState({ region });
  }
  onButtonPress() {
    this.props.fetchRooms();
  }
  renderMarkers() {
    this.props.roomsZip.map(({ zip, amount }) => {
      const location = zipToLatLng.lookup(parseInt(zip, 10));
      console.log(location);
    });
  }
  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {!_.isEmpty(this.props.roomsZip) && this.renderMarkers.bind(this)}
        </MapView>
        <View>
          <Button
            large
            title="Search this area"
            icon={{ name: 'search' }}
            onPress={this.onButtonPress.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ roomsZip }) => {
  return { roomsZip: roomsZip.results };
};

export default connect(mapStateToProps, actions)(Map);
