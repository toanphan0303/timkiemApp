import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { material } from 'react-native-typography';
import { Icon, Header, Button, Card, List, ListItem } from 'react-native-elements';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import TimKiemHeader from '../components/TimKiemHeader';
import FullScreenSpinner from '../components/HOC/FullScreenSpinner';
import Fade from '../components/HOC/FadeAnimate';

const FullScreenSpinnerView = FullScreenSpinner(View);

class MyProfile extends Component {
  static navigationOptions = {
    title: 'My Profile',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='person' size={25} color={tintColor} />
        );
    },
  };
  state = {
    loading: false,
    visible: false
  };
  componentDidMount = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      if (accessToken) {
        await this.props.getUser(accessToken);
      }
    } catch (e) {
      console.log(e);
    }
  }
  onPressLogIn() {
    this.props.navigation.navigate('login');
  }
  onPressSignUp() {
    this.props.navigation.navigate('signup');
  }
  onPressSignOut() {
    this.props.signOut();
  }
  onPressMyRoomPost = async() => {
    this.setState({ loading: true });
    const { email, sub } = this.props.user;
    await this.props.getPostRoom(sub, email, () => {
      this.setState({ loading: false });
      this.props.navigation.navigate('roomPostSummary');
    });
  }
  onPressFavoriteRoom = async() => {
    this.setState({ loading: true });
    const { email, sub } = this.props.user;
    await this.props.getLikeRooms(sub, email, () => {
      this.setState({ loading: false });
      this.props.navigation.navigate('roomFavorite');
    });
  }
  render() {
    return (
      <FullScreenSpinnerView
        spinner={this.state.loading}
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        <TimKiemHeader {...this.props} parentScreen='rooms'/>
        <View>
          { !_.isEmpty(this.props.user) &&
            <View>
              <Fade visible={true}>
                <Text style={[material.title, { fontWeight: 'bold', paddingTop: 20, paddingLeft: 20 }]}>Hi {this.props.user.given_name} !</Text>
              </Fade>
            </View>
          }
          <View style={{ marginTop: 10 }}>
            { _.isEmpty(this.props.user) &&
              <View style={{ height: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white' }}>
                  <Button
                    title='Login'
                    icon={{ name: 'sign-in', type: 'font-awesome' }}
                    buttonStyle={styles.buttonStyle}
                    backgroundColor='rgb(59, 89, 152)'
                    onPress={this.onPressLogIn.bind(this)}
                  />
                  <Button
                    title='SignUp'
                    icon={{ name: 'user-plus', type: 'font-awesome' }}
                    backgroundColor='rgb(60, 186, 84)'
                    buttonStyle={styles.buttonStyle}
                    onPress={this.onPressSignUp.bind(this)}
                  />
                </View>
              </View>
            }
          </View>
        </View>
        {
          !_.isEmpty(this.props.user) &&
          <List style={styles.listStyle}>
            <ListItem
              title='Favorite Room'
              leftIcon={{ name: 'thumbs-o-up', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
              containerStyle={{ backgroundColor: 'rgb(240,240,240)' }}
              onPress={() => this.props.navigation.navigate('roomFavorite')}
              onPress={this.onPressFavoriteRoom.bind(this)}
            />
            <ListItem
              title='My Post Room'
              leftIcon={{ name: 'folder', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
              onPress={this.onPressMyRoomPost.bind(this)}
            />
            <ListItem
              title='Post room'
              leftIcon={{ name: 'book', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
              containerStyle={{ backgroundColor: 'rgb(240,240,240)' }}
              onPress={() => this.props.navigation.navigate('roomPost')}
            />
          </List>
        }
        { !_.isEmpty(this.props.user) &&
          <View style={{ marginTop: 10, height: '100%' }}>
            <Button
              title='Log out'
              backgroundColor='rgb(59, 89, 152)'
              buttonStyle={styles.buttonStyle}
              onPress={this.onPressSignOut.bind(this)}
            />
          </View>
        }
      </FullScreenSpinnerView>
    );
  }
}
const styles = {
  text: {
   color: '#333',
   marginBottom: 5,
 },
 listStyle: {
   paddingTop: 25
 },
 buttonStyle: {
   borderRadius: 5,
   elevation: 1
 },
};

const mapStateToProps = ({ user }) => {
  return { user };
};

export default connect(mapStateToProps, actions)(MyProfile);
