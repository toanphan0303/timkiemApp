import React, { Component } from 'react';
import { Icon, Card } from 'react-native-elements';
import _ from 'lodash';
import Communications from 'react-native-communications';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ImageSlider from 'react-native-image-slider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const defaultImage = 'https://s3.amazonaws.com/timkiem-data/basicbed.jpg';

class RoomDetail extends Component {

  onPressBackIcon() {
    this.props.navigation.navigate('roomList');
  }

  render() {
    const roomInfo = this.props.roomDetail.Items[0];
    const { images, address, zip, phone, description, room: { price, type } } = roomInfo;
    const roomImages = !_.isEmpty(images) ? images : [defaultImage];
    return (
      <View style={{ flex: 1, marginTop: 25 }}>
        <ScrollView style={styles.container}>
          <View style={styles.container1}>
            <ImageSlider
              style={[styles.imageStyle, styles.shawdowImage]}
              images={roomImages}
            />
            <View style={{ marginLeft: 10, marginTop: 10, position: 'absolute', zIndex: 6 }}>
              <Icon name='arrow-left' type='material-community' onPress={this.onPressBackIcon.bind(this)} size={35} />
            </View>
          </View>
            <View style={styles.overImage}>
              <View stye={{ flexDirection: 'column' }}>
                <Text>$ {price}</Text>
                <Text>{address}</Text>
                <Text>Zip Code: {zip}</Text>
              </View>
              <View stye={{ flexDirection: 'row', justifyContent: 'flex-end', width: 200 }}>
                <TouchableOpacity
                  onPress={() => console.log('image press')}
                >
                  <Icon name='heart-outline' type='material-community' size={35} />
                </TouchableOpacity>
                <Text style={{ marginTop: 5 }}>Room Type: {type}</Text>
              </View>
            </View>
            <Card>
              <Text>DESCIPTION</Text>
              <Text>{description}</Text>
            </Card>
            <Card style={{ flexDirection: 'column', justifyContent: 'space-around', alignContent: 'space-around' }}>
              <View>
                <TouchableOpacity onPress={() => Communications.phonecall(phone, true)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Icon name='phone' />
                    <Text style={{ paddingLeft: 20 }}>Make phonecall: {phone}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 10}}>
                <TouchableOpacity onPress={() => Communications.text(phone)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Icon name='message' />
                    <Text style={{ paddingLeft: 20 }} >Send a text/iMessage</Text>
                  </View>
                </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 15
  },
  container1: {
    flex: 1,
  },
  imageStyle: {
    width: SCREEN_WIDTH,
    height: 200,
    position: 'relative',
    flexGrow: 1,
  },
  overImage: {
    justifyContent: 'space-around',
    alignContent: 'space-around',
    flexDirection: 'row',
    paddingTop: 5,
    width: SCREEN_WIDTH
  },
  shawdowImage: {
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowColor: 'gray',
    shadowOffset: { width: 5, height: 5 }
  }
});

const mapStateToProps = ({ roomDetail }) => {
  return { roomDetail };
};

export default connect(mapStateToProps)(RoomDetail);
