import React, { Component } from 'react';
import _ from 'lodash';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, Image, StyleSheet } from 'react-native';
import ImageSlider from 'react-native-image-slider';
import moment from 'moment';
import { Card } from 'react-native-elements';
import { material } from 'react-native-typography';
import { connect } from 'react-redux';
import EitherLikeIcon from './HOC/EitherLikeIcon';
import withFullScreenSpinnerView from './HOC/FullScreenSpinner';

const defaultImage = 'https://s3.amazonaws.com/timkiem-data/basicbed.jpg';
const SCREEN_WIDTH = Dimensions.get('window').width;
const FullScreenSpinnerView = withFullScreenSpinnerView(View);
const RenderEitherLikeIcon = EitherLikeIcon(<View />);

const RoomList = (props) => {
  return (
    <View>
      <Text>Sorry there is no room in this area</Text>
      <Text>Please search other areas</Text>
    </View>
  );
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
    listing: [],
    roomLikes: [],
    user: {},
    loading: false
  }
  componentDidMount = async() => {
    const { user } = this.props;
    let roomLikes = [];
    if (!_.isEmpty(user)) {
      const { sub, email } = user;
      await this.props.fetchUserInfo(sub, email);
      roomLikes = _.compact(this.props.userInfo.room_likes);
    }
    this.setState({
      listing: this.props.listing,
      parentCom: this.props.component,
      login: !_.isEmpty(user),
      roomLikes,
      user
    });
  }
  componentWillReceiveProps(nextProps) {
    const user = _.isEmpty(nextProps.user) ? {} : nextProps.user;
    this.setState({
      login: !_.isEmpty(user),
      roomLikes: nextProps.userInfo.room_likes,
      user
    });
  }
  onPressImage(zip, id) {
    this.setState({ loading: true });
    this.props.fetchDetailRoom(zip, id, () => {
      this.props.navigation.navigate('roomDetail');
      this.setState({ loading: false });
    });
  }

  renderListing() {
    const { listing, parentCom, roomLikes } = this.state;
    if (_.isEmpty(listing)) {
      if (parentCom === 'roomList') {
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
      const creatorEmail = email;
      const roomImages = !_.isEmpty(images) ? images : [defaultImage];
      const listInfo = { id, creatorEmail, price, type, zip, expire };
      const date = moment(timeStamp * 1000).format('MM-DD-YYYY');
      const index = _.findIndex(roomLikes, { roomId: id })
      return (
        <View style={styles.container} key={id}>
          <FullScreenSpinnerView
            style={{ flex: 1, backgroundColor: 'white' }}
            spinner={this.state.loading}
          >
          <View style={styles.content1}>
            <Text style={[styles.contentText, material.body2, {marginLeft: 20 }]}>List: {date}</Text>
            <View style={[styles.contentText, { marginRight: 30, width: 40 }]}>
              <RenderEitherLikeIcon
                login={this.state.login}
                index={index}
                {...this.props}
                listInfo={listInfo}
                {...this.state}
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
          </FullScreenSpinnerView>
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
const mapStateToProps = ({ user, userInfo }) => {
  return { user, userInfo };
};

export default connect(mapStateToProps)(RoomListing);
