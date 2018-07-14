import React, { Component } from 'react';
import { Icon, Card } from 'react-native-elements';
import _ from 'lodash';
import Communications from 'react-native-communications';
import moment from 'moment';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { material } from 'react-native-typography';
import ImageSlider from 'react-native-image-slider';
import * as actions from '../actions';
import EitherLikeIcon from '../components/HOC/EitherLikeIcon';


const SCREEN_WIDTH = Dimensions.get('window').width;
const defaultImage = 'https://s3.amazonaws.com/timkiem-data/basicbed.jpg';
const RenderEitherLikeIcon = EitherLikeIcon(<View />);

class RoomDetail extends Component {
  state={
    roomLikes: []
  }
  componentWillMount() {
    const setParamsAction = this.props.navigation.setParams({
    params: { showTabBar: false },
    key: this.props.navigation.state.key,
    });
    this.props.navigation.dispatch(setParamsAction);
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
  onPressBackIcon() {
    this.props.navigation.goBack();
  }
  onPressImage() {
    console.log('image press');
  }
  render() {
    const roomInfo = this.props.roomDetail.Items[0];
    const { roomLikes } = this.state;
    const { images, address, zip, phone, description, room: { price, type }, id, expire, email, timeStamp } = roomInfo;
    const creatorEmail = email;
    const roomImages = !_.isEmpty(images) ? images : [defaultImage];
    const index = _.findIndex(roomLikes, { roomId: id });
    const listInfo = { id, creatorEmail, price, type, zip, expire };
    const date = moment(timeStamp * 1000).format('MM-DD-YYYY');
    return (
      <View style={{ flex: 1, marginTop: 25, backgroundColor: 'white' }}>
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.content1}>
              <View style={[styles.contentText]}>
                <Icon iconStyle={{ paddingRight: 80 }} name='arrow-left' type='material-community' onPress={this.onPressBackIcon.bind(this)} size={35} />
              </View>
              <View style={[styles.contentText, { marginRight: 30, width: 40 }]}>
                <RenderEitherLikeIcon
                  {...this.props}
                  login={this.props.user}
                  index={index}
                  listInfo={listInfo}
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
                  onPress={this.onPressImage.bind(this)}
                >
                  <Image source={{ uri: item }} style={styles.customImage} />
                </TouchableOpacity>
              )}
            />
          </View>
            <View style={styles.textInfoStyle}>
              <View stye={{ flexDirection: 'column' }}>
                <Text style={[styles.contentText, material.button, { marginTop: 5, fontWeight: 'bold', fontSize: 16 }]}>$ {price}</Text>
                <Text style={material.body2}>{address}</Text>
                <Text style={material.body2}>Zip Code: {zip}</Text>
              </View>
              <View style={{ flexDirection: 'column', justifyContent: 'flex-end', width: 200, marginTop: 5 }}>
                <Text style={material.body2}>Room Type: {type}</Text>
                <Text style={material.body2}>Date Post: {date}</Text>
              </View>
            </View>
            <Card>
              <Text style={[material.body2, { fontWeight: 'bold', fontSize: 17 }]}>DESCIPTION</Text>
              <Text style={material.body2}>{description}</Text>
            </Card>
            <Card style={{ flexDirection: 'column', justifyContent: 'space-around', alignContent: 'space-around' }}>
              <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Icon name='phone' />
                    <Text style={[material.button, { paddingLeft: 20 }]}>Make phonecall: </Text>
                    <TouchableOpacity onPress={() => Communications.phonecall(phone, true)}>
                      <Text style={material.button}>{phone}</Text>
                    </TouchableOpacity>
                  </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Icon name='message' />
                  <TouchableOpacity onPress={() => Communications.text(phone)}>
                    <Text style={[material.button, { paddingLeft: 20 }]} >Send a text/iMessage</Text>
                  </TouchableOpacity>
                </View>
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
  content: {
    flex: 1,
    flexDirection: 'column',
    height: 255
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
  contentText: {
    width: 150,
    backgroundColor: 'transparent'
  },
  imageStyle: {
    width: SCREEN_WIDTH,
    height: 200,
    position: 'relative',
    flexGrow: 1,
  },
  customSlide: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0
  },
  customImage: {
    width: 400,
    height: 250,
  },
  textInfoStyle: {
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

const mapStateToProps = ({ roomDetail, user, userInfo }) => {
  return { roomDetail, user, userInfo };
};

export default connect(mapStateToProps, actions)(RoomDetail);
