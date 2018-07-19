import React, { Component } from 'react';
import _ from 'lodash';
import { View, ActivityIndicator, Dimensions, TouchableOpacity, Text } from 'react-native';
import { compose, withReducer } from 'recompose';
import { MapView, LinearGradient } from 'expo';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements';
import ZipMarker from './ZipMarker';
import SearchHeader from './SearchHeader';
import FullScreenSpinner from './HOC/FullScreenSpinner';
import * as actions from '../actions';


const SCREEN_WIDTH = Dimensions.get('window').width;
const FullScreenSpinnerView = FullScreenSpinner(View);
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
    searching: false,
    loading: false
  }
  componentDidMount = async () => {
    this.setState({ mapLoaded: true });
    const { latitude, longitude } = this.state.region;
    this.setState({ searching: true });
    this.props.fetchRoomsAmountInZip(latitude, longitude);
    this.setState({ searching: false });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.state.loading) {
      this.setState({ loading: nextProps.loading });
    }
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
    this.setState({ loading: true });
    this.props.fetchRoomsInSingleZip(zip, () => {
      this.setState({ loading: false });
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
      <FullScreenSpinnerView
        style={{ flex: 1, backgroundColor: 'white' }}
        spinner={this.state.loading}
      >
        <SearchHeader {...this.props} go='list' title='List' />
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
          <LinearGradient
            colors={['#FF6666', 'transparent','#FF6666']}
            start={{x: 0.1, y: 1}} end={{ x: 0.1, y: 0.1}}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.buttonContainer1}
              onPress={this.onButtonSearchPress.bind(this)}
              disabled={this.state.searching}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ marginLeft: 40, paddingLeft: 70, paddingTop: 5 }}>
                { this.state.searching ?
                  <Icon color='#4C64FF' name='spinner' type='evilicon' size={25} /> :
                  <Icon color='#4C64FF' name='search' type='font-awesome' size={25} />
                }
                </View>
                <Text style={styles.buttonText}>
                    Search this area
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
      </FullScreenSpinnerView>
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
  buttonContainer: {
    borderRadius: 5,
    position: 'absolute',
    zIndex: 9,
    marginTop: 600,
    marginLeft: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 200
  },
  buttonContainer1: {
      width: 190,
      height: 40,
      backgroundColor: 'transparent',
      alignItems: 'center',
  },
  buttonText: {
      textAlign: 'center',
      color: '#4C64FF',
      padding: 10,
      width: 190,
      paddingRight: 60,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
  }
};
const mapStateToProps = ({ roomsZips }) => {
  return { roomsZips };
};
const loadingReducer = (value, action) => {
  switch (action.type) {
    case 'LOADING':
      return true;
    case 'FINISH_LOADING':
      return false;
    default:
      return false;
  }
};

const enhance = compose(
    withReducer('loading', 'dispatchLoading', loadingReducer, false),
);
export default connect(mapStateToProps, actions)(enhance(Map));
