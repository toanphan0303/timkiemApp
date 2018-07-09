import React, { Component } from 'react';
import _ from 'lodash';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, Image, StyleSheet } from 'react-native';
import ImageSlider from 'react-native-image-slider';
import moment from 'moment';
import { Card, Icon } from 'react-native-elements';
import { material } from 'react-native-typography';
import { connect } from 'react-redux';

const defaultImage = 'https://s3.amazonaws.com/timkiem-data/basicbed.jpg';
const SCREEN_WIDTH = Dimensions.get('window').width;

const RoomList = (props) => {
  return (
    <View>
      <Text>Sorry there is no room in this area</Text>
      <Text>Please search other areas</Text>
    </View>
  )
};
const RoomPostSummary = (props) => {
  return (
    <View>
      <Text>You have not post any room yet</Text>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('roomPost')}
      >
        <Text>Click to post room</Text>
      </TouchableOpacity>
    </View>
  );
};


class RoomListing extends Component {
  state={
    listing: []
  }
  componentDidMount() {
    this.setState({ listing: this.props.listing, component: this.props.component });
  }
  onPressImage(zip, id) {
    this.props.fetchDetailRoom(zip, id, () => {
      this.props.navigation.navigate('roomDetail');
      console.log('finish navigateing')
    });
  }
  onPressLike(userId, id, email, expire, price, type, zip) {
    this.props.addLikeRoom(userId, id, email, expire, price, type, zip);
  }
  renderListing() {
    const { listing, component } = this.state;
    if (_.isEmpty(listing)) {
      if (component === 'roomList') {
        return (
          <Card>
            <RoomList />
          </Card>
        );
      }
      return (
        <Card>
          <RoomPostSummary {...this.props} />
        </Card>
      );
    }
    return listing.map(({ id, images, room: { price, type }, zip, timeStamp, expire, email, user }) => {
      const roomImages = !_.isEmpty(images) ? images : [defaultImage];
      const date = moment(timeStamp * 1000).format('MM-DD-YYYY');
      return (
        <View style={styles.container} key={id}>
          <View style={styles.content1}>
            <Text style={[styles.contentText, material.body2, {marginLeft: 20 }]}>List: {date}</Text>
            <View style={[styles.contentText, { marginRight: 30, width: 40 }]}>
              <Icon
                name='heart-outline'
                type='material-community'
                size={35}
                onPress={this.onPressLike.bind(this, user, id, email, expire, price, type, zip)}
              />
            </View>
          </View>
          <ImageSlider
            images={roomImages}
            customSlide={({ index, item, style, width }) => (
              // It's important to put style here because it's got offset inside
              <TouchableOpacity
                key={index}
                style={[
                  style,
                  styles.customSlide,
                  { backgroundColor: index % 2 === 0 ? 'rgb(240,240,240)' : 'grey' },
                ]}
                onPress={this.onPressImage.bind(this, zip, id)}
              >
                <Image source={{ uri: item }} style={styles.customImage} />
              </TouchableOpacity>
            )}
          />
          <View style={styles.content2}>
            <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
              <Text style={[styles.contentText, material.button, { marginTop: 5, fontWeight: 'bold', fontSize: 16 }]}>$Price: {price}</Text>
              <Text style={material.body2}>Zip Code: {zip}</Text>
            </View>
            <Text style={[material.button, { fontWeight: 'bold', fontSize: 16, marginRight: 20, paddingTop: 10 }]}>Room Type: {type}</Text>
          </View>
        </View>
      );
    });
  }
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        {this.renderListing()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 205
  },
  content1: {
    width: '100%',
    height: 30,
    marginTop: 15,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    zIndex: 5,
  },
  content2: {
    width: '100%',
    height: 70,
    marginTop: 140,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    zIndex: 5,
  },

  contentText: {
    width: 150,
    backgroundColor: 'transparent'
  },
  customSlide: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0
  },
  customImage: {
    width: 400,
    height: 200,
  },
});

export default RoomListing;
