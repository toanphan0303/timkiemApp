import React, { Component } from 'react';
import _ from 'lodash';
import { material } from 'react-native-typography';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import { Button, Header } from 'react-native-elements';
import ZipMarker from './ZipMarker';
import SearchTabBar from './SearchTabBar';
import * as actions from '../actions';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Map extends Component {
  // IOS does not have initial location && map does not zoom in or our
  state = {
    region: {
      latitude: 37.3382,
      longitude: -121.8863,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    mapLoaded: false,
    searching: false
  }
  componentDidMount = async () => {
    this.setState({ mapLoaded: true });
    const { latitude, longitude } = this.state.region;
    this.setState({ searching: true });
    this.props.fetchRoomsAmountInZip(latitude, longitude);
    this.setState({ searching: false });
  }

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  }

  onButtonSearchPress = async () => {
    const { latitude, longitude } = this.state.region;
    this.setState({ searching: true });
    // const radius = this.getBoundsRadius();
    await this.props.fetchRoomsAmountInZip(latitude, longitude);
    this.setState({ searching: false });
  }

  onPressMarker(zip) {
    this.props.fetchRoomsInSingleZip(zip, () => {
      this.props.navigation.navigate('roomList');
    });
  }
  onPressList() {
    const { zip, state } = this.props.roomsZips;
    this.props.fetchRoomInMultiZips(zip, state, () => {
      this.props.navigation.navigate('roomList');
    });
  }
  getBoundsRadius() {
    const { longitudeDelta } = this.state.region;
    return parseInt((longitudeDelta * 69), 10);
  }
  renderRoomZips() {
    return this.props.roomsZips.data.map(({ latitude, longitude, Count, zip_code }) => {
      const coords = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      return (
        <MapView.Marker
          key={zip_code}
          coordinate={coords}
          onPress={() => this.onPressMarker(zip_code)}
          tracksViewChanges={false}
        >
          <ZipMarker
            amount={Count.toString()}
          />
        </MapView.Marker>
      );
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
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          outerContainerStyles={{ backgroundColor: 'white', marginTop: 25, paddingTop: 5, paddingBottom: -5 }}
          innerContainerStyles={{ backgroundColor: 'white', justifyContent: 'space-around', alignItems: 'flex-start' }}
          rightComponent={<Button title='List' backgroundColor='white' buttonStyle={{ paddingTop: 15 }} color='black' onPress={this.onPressList.bind(this)}/>}
          leftComponent={<SearchTabBar navigation={this.props.navigation} />}
        />
        <MapView
          style={{ flex: 1 }}
          provider="google"
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
          minZoomLevel={12}
          maxZoomLevel={14}
        >
          {this.props.roomsZips && !_.isEmpty(this.props.roomsZips) && this.renderRoomZips()}
        </MapView>
        <View>
          <Button
            small
            title="Search this area"
            onPress={this.onButtonSearchPress.bind(this)}
            loading={this.state.searching}
            disabled={this.state.searching}
            icon={{ name: 'search', type: 'font-awsome' }}
            backgroundColor='#008CBA'
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    marginTop: 23,
    width: SCREEN_WIDTH,
  },
  listButton: {
    marginTop: 4,
  },
  buttonStyle: {
    shadowOpacity: 1.0,
    borderRadius: 5,
  },
};
const mapStateToProps = ({ roomsZips }) => {
  return { roomsZips };
};

export default connect(mapStateToProps, actions)(Map);
