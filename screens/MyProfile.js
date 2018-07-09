import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { material } from 'react-native-typography';
import { Icon, Header, Button, Card, List, ListItem } from 'react-native-elements';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import TimKiemHeader from '../components/TimKiemHeader';

class MyProfile extends Component {
  static navigationOptions = {
    title: 'My Profile',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='person' size={25} color={tintColor} />
        );
    },
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
    const { email, sub } = this.props.user;
    await this.props.getPostRoom(sub, email, () => {
      this.props.navigation.navigate('roomPostSummary');
    });
  }
  render() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <TimKiemHeader />
        <View>
          { !_.isEmpty(this.props.user) &&
            <Card>
              <Text style={material.headline}>Hi {this.props.user.given_name} !</Text>
            </Card>
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
            />
            <ListItem
              title='Favorite Job'
              leftIcon={{ name: 'heart', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
            />
            <ListItem
              title='My Post Room'
              leftIcon={{ name: 'book', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
              containerStyle={{ backgroundColor: 'rgb(240,240,240)' }}
              onPress={this.onPressMyRoomPost.bind(this)}
            />
            <ListItem
              title='My Post Job'
              leftIcon={{ name: 'folder', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
            />
            <ListItem
              title='Post room'
              leftIcon={{ name: 'book', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
              containerStyle={{ backgroundColor: 'rgb(240,240,240)' }}
              onPress={() => this.props.navigation.navigate('roomPost')}
            />
            <ListItem
              title='Post Job'
              leftIcon={{ name: 'folder', type: 'font-awesome' }}
              titleStyle={[material.caption2Emphasized, { paddingLeft: 20 }]}
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
      </View>
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
