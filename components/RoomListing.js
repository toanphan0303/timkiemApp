import React, { Component } from 'react';
import _ from 'lodash';
import { ScrollView, View, Text, TouchableOpacity, Dimensions, Image, StyleSheet, Alert } from 'react-native';
import ImageSlider from 'react-native-image-slider';
import moment from 'moment';
import { Card, Icon } from 'react-native-elements';
import { material } from 'react-native-typography';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import EitherLikeIcon from './HOC/EitherLikeIcon';
import withFullScreenSpinnerView from './HOC/FullScreenSpinner';
import { defaultImage } from '../key/default';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FullScreenSpinnerView = withFullScreenSpinnerView(View);
const RenderEitherLikeIcon = EitherLikeIcon(<View />);

const RoomList = (props) => {
  return (
    <View>
      <Text style={[material.body, { fontWeight: 'bold', fontSize: 17 }]}>Sorry there is no room in this area</Text>
      <Text style={[material.body, { fontWeight: 'bold', fontSize: 17 }]}>Please search other areas</Text>
    </View>
  );
};
const RoomPostSummary = (props) => {
  return (
    <View>
      <Text style={[material.body, { fontWeight: 'bold', fontSize: 17 }]}>You have not posted any room yet</Text>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('roomPost')}
      >
        <Text style={[material.body, { fontWeight: 'bold', fontSize: 18, color: '6633FF' }]}>Click to post room</Text>
      </TouchableOpacity>
    </View>
  );
};


class RoomListing extends Component {
  state={
    listing: [],
    roomLikes: [],
    user: {},
    loading: false,
    keyId: null
  }
  componentWillMount = async() => {
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
    if (!_.isEqual(nextProps.listing, this.state.listing)) {
      this.setState({ listing: nextProps.listing });
    }
  }
  onPressImage(zip, id) {
    this.setState({ loading: true, keyId: id });
    this.props.fetchDetailRoom(zip, id, () => {
      this.props.navigation.navigate('roomDetail');
      this.setState({ loading: false, keyId: null });
    });
  }
  onPressEditIcon = async(zip, id) => {
    this.setState({ loading: true, keyId: id });
    this.props.fetchDetailRoom(zip, id, () => {
      this.props.navigation.navigate('roomUpdate');
      this.setState({ loading: false, keyId: null });
    });
  }
  onPressDeleteIcon(user, id, email, roomIndex, zip, likeIndex) {
    Alert.alert(
      'Delete this post',
      'Are you sure you want to delete this room post',
    [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'OK', onPress: async () => await this.onPressDelete(user, id, email, roomIndex, zip, likeIndex) }
    ],
  { cancelable: false }
);
  }
  onPressDelete = async (user, id, email, roomIndex, zip, likeIndex) => {
    this.setState({ loading: true, keyId: id });
    await this.props.romvePostRoom(user, id, email, roomIndex, zip);
    if (likeIndex >= 0) {
      await this.props.romveLikeRoom(user, email, likeIndex);
    }
    await this.props.getPostRoom(user, email, () => {
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
    return listing.map(({ id, images, room: { price, type }, zip, timeStamp, expire, email, user }, roomIndex) => {
      const creatorEmail = email;
      const roomImages = !_.isEmpty(images) ? images : [defaultImage];
      const listInfo = { id, creatorEmail, price, type, zip, expire };
      const date = moment(timeStamp * 1000).format('MM-DD-YYYY');
      const likeIndex = _.findIndex(roomLikes, { roomId: id })
      return (
        <View style={styles.container} key={id}>
          <FullScreenSpinnerView
            style={{ flex: 1, backgroundColor: 'white' }}
            spinner={this.state.loading && this.state.keyId === id}
          >
            <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.content1}>
              <Text style={[styles.contentText, material.body2White, { marginLeft: 20, paddingTop: 5 }]}>List: {date}</Text>
              { this.props.user.sub === user && this.props.component === 'myPost' &&
                <View style={{ flexDirection: 'row', marginLeft: 50, paddingTop: 5 }}>
                  <View style={{ marginRight: 20 }}>
                    <Icon
                      name='delete'
                      type='font-awsome'
                      color='#FFFFFF'
                      onPress={this.onPressDeleteIcon.bind(this, user, id, email, roomIndex, zip, likeIndex)}
                    />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Icon
                      name='edit'
                      type='font-awsome'
                      color='#FFFFFF'
                      onPress={this.onPressEditIcon.bind(this, zip, id)}
                    />
                  </View>
                </View>
                }
              <View style={[styles.contentText, { marginRight: 30, width: 40 }]}>
                <RenderEitherLikeIcon
                  login={this.state.login}
                  index={likeIndex}
                  {...this.props}
                  listInfo={listInfo}
                  {...this.state}
                />
              </View>
          </LinearGradient>
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
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.content2}>
            <View style={{ flexDirection: 'column', paddingLeft: 20 }}>
              <Text style={[styles.contentText, material.buttonWhite, { marginTop: 5, fontWeight: 'bold', fontSize: 16 }]}>$Price: {price}</Text>
              <Text style={material.body2White}>Zip Code: {zip}</Text>
            </View>
            <Text style={[material.buttonWhite, { fontWeight: 'bold', fontSize: 16, marginRight: 20, paddingTop: 10 }]}>Room Type: {type}</Text>
          </LinearGradient>
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
    height: 255
  },
  content1: {
    height: 50,
    width: '100%',
    marginTop: 2,
    paddingTop: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    zIndex: 5,
  },
  content2: {
    width: '100%',
    height: 70,
    marginTop: 190,
    marginBottom: 10,
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
    width: '100%',
    height: 250,
  },
});
const mapStateToProps = ({ user, userInfo }) => {
  return { user, userInfo };
};

export default connect(mapStateToProps)(RoomListing);
