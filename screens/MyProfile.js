import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, Header, Button, Card } from 'react-native-elements';

class MyProfile extends Component {
  static navigationOptions = {
    title: 'My Profile',
    tabBarIcon: ({ tintColor }) => {
        return (
          <Icon name='person' size={25} color={tintColor} />
        );
    },
  };
  onPressLogIn() {
    this.props.navigation.navigate('login');
  }
  onPressSignUp() {
    this.props.navigation.navigate('signup');
  }
  render() {
    return (
      <View>
        <Header
          leftComponent={
            <View>
              <Text>Tiem Kiem </Text>
            </View>
          }
        />
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button
              title='Login'
              icon={{ name: 'sign-in', type: 'font-awesome' }}
              backgroundColor='rgb(59, 89, 152)'
              onPress={this.onPressLogIn.bind(this)}
            />
            <Button
              title='SignUp'
              icon={{ name: 'user-plus', type: 'font-awesome' }}
              backgroundColor='rgb(60, 186, 84)'
              onPress={this.onPressSignUp.bind(this)}
            />
            </View>
        </View>
        <View>
          <Card style={styles.container}>
            <TouchableOpacity>
              <Text style={styles.text}>Favorite Room</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.text}>Favorite Job</Text>
            </TouchableOpacity>
          </Card>
          <Card style={styles.container}>
            <TouchableOpacity>
              <Text style={styles.text}>My Post Room</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.text}>My Post Job</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    );
  }
}
const styles = {
  text: {
   color: '#333',
   marginBottom: 5,
 },
 container: {
   flexDirection: 'column',
   justifyContent: 'flex-start'
 }
};
export default MyProfile;
