import React, { Component } from 'react';
import { Header, Button, Icon, Card } from 'react-native-elements';
import { View, Text, ActivityIndicator } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { connect } from 'react-redux';
import { googleAPI } from '../key/API_key';
import * as actions from '../actions';

class SearchTabBar extends Component {

  state = {
    Loaded: false
  }
  componentDidMount() {
    this.setState({ Loaded: false });
  }
  onPressBackIcon() {
    this.props.navigation.navigate('rooms');
  }
  onPressSearch(data) {
    const testValidData = data.split(',');
    if (this.isSearchInUSA(testValidData)) {
      const zipValue = this.isSearchZipCode(testValidData[1]);
      if (zipValue) {
        this.setState({ Loaded: true });
        this.props.fetchRoomsInSingleZip(zipValue, () => {
          this.setState({ Loaded: false });
          this.props.navigation.navigate('roomList');
        });
      } else {
        const city = testValidData[0];
        const state = testValidData[1].trim();
        this.setState({ Loaded: true });
        this.props.fetchRoomInCity(city, state, () => {
          this.setState({ Loaded: false });
          this.props.navigation.navigate('roomList');
        });
      }
    } else {
      return;
    }
  }
  isSearchZipCode(value) {
    const temp = value.trim().split(' ');
    if (temp.length > 1) {
      const zipValue = temp[1].trim();
      const isValid = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipValue);
      return isValid ? zipValue : null;
    }
    return null;
  }

  isSearchInUSA(value) {
    if (value.length >= 3) {
      const testValue = value[2].trim();
      if (testValue !== 'USA') {
        return false;
      }
      return true;
    }
    return false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{marginTop: 25, flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
          <View style={{ paddingLeft: 10, paddingTop: 15 }}>
            <Icon name='arrow-left' type='material-community' onPress={this.onPressBackIcon.bind(this)} size={35} />
          </View>
          <View style={{flex: 2, paddingLeft: 20}}>
            <GooglePlacesAutocomplete
              placeholder='City or Zip code'
              minLength={2}
              autoFocus={true}
              returnKeyType={'search'}
              listViewDisplayed='auto'
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                this.onPressSearch(data.description)
              }}
              getDefaultValue={() => ''}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: googleAPI,
                language: 'en',
                types: '(regions)'
              }}
              styles={{
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  shadowOpacity: 1.0,
                  shadowRadius: 3,
                  shadowColor: 'gray',
                  shadowOffset: { width: 6, height: 6 },
                  paddingTop: 10,
                  width: 300,
                  height: 60
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16
                },
                description: {
                  fontWeight: 'bold',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                }
              }}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
              debounce={200}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {this.state.Loaded ?
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
              </View>
              :
              <View />
          }
          <Card style={{ marginTop: 5 }}>
            <Text style={{ paddingLeft: 20 }}>Recent Search</Text>
          </Card>
        </View>
      </View>
    );
  }
}

export default connect(null, actions)(SearchTabBar);
