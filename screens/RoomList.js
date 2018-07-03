import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import ImageSlider from 'react-native-image-slider';
import { Icon, Header, Button, Card } from 'react-native-elements';
import SearchBar from '../components/SearchTabBar';
import * as actions from '../actions';

const defaultImage = 'https://s3.amazonaws.com/timkiem-data/basicbed.jpg';
const SCREEN_WIDTH = Dimensions.get('window').width;
class RoomList extends Component {
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
  onPressImage(zip, id) {
    this.props.fetchDetailRoom(zip, id, () => {
      this.props.navigation.navigate('roomDetail');
    });
  }
  renderRoomList() {
    const roomList = this.props.roomsInZips.Items;
    if (_.isEmpty(roomList)) {
      return (
        <Card>
          <Text>Sorry there is no room in this area</Text>
          <Text>Please search other areas</Text>
        </Card>
      );
    }
    return roomList.map(({ id, address, images, room: { price, type }, zip }) => {
      const roomImages = !_.isEmpty(images) ? images : [defaultImage];
      return (
        <View style={styles.container} key={id}>
          <ImageSlider
            style={[styles.imageStyle, styles.shawdowImage]}
            images={roomImages}
            onPress={this.onPressImage.bind(this, zip, id)}
          />
            <View style={styles.overImage}>
              <View stye={{ flex: 1 }}>
                <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
                  <Text>$Mo {price}</Text>
                  <Text>{address}</Text>
                  <Text>Zip Code: {zip}</Text>
                </View>
              </View>
              <View stye={{ flex: 3}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginRight: 50  }}>
                  <View>
                    <TouchableOpacity
                      onPress={() => console.log('image press')}
                    >
                      <Icon name='heart-outline' type='material-community' size={30} />
                    </TouchableOpacity>
                    <Text style={{ marginTop: 5 }}>Room Type: {type}</Text>
                  </View>
                </View>
              </View>
            </View>
        </View>
      );
    });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          outerContainerStyles={{ height: 65, backgroundColor: 'white', marginTop: 25, paddingTop: 5, paddingBottom: -5 }}
          innerContainerStyles={{ backgroundColor: 'white', alignItems: 'flex-start', justifyContent: 'space-around' }}
          rightComponent={<Button title='Map' backgroundColor='white' buttonStyle={{ paddingTop: 15 }} color='black' onPress={this.onPressMap.bind(this)} />}
          leftComponent={<SearchBar navigation={this.props.navigation} />}
        />
        <ScrollView style={{ flex: 1 }}>
          {this.renderRoomList()}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingBottom: 15
  },
  imageStyle: {
    width: SCREEN_WIDTH,
    height: 200,
    position: 'relative',
    flexGrow: 1
  },
  overImage: {
    flexDirection: 'row',
    paddingTop: 5,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between'
  },
  shawdowImage: {
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowColor: 'gray',
    shadowOffset: { width: 3, height: 3 }
  }
};
const mapStateToProps = ({ roomsInZips }) => {
  return { roomsInZips };
};
export default connect(mapStateToProps, actions)(RoomList);
