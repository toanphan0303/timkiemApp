import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import {
  Button,
  Card
} from 'react-native-elements';
import TimKiemHeader from '../components/TimKiemHeader';
import * as actions from '../actions';
import LogInForm from '../components/LoginForm';

class LogIn extends Component {

  componentWillMount() {
    const setParamsAction = this.props.navigation.setParams({
    params: { showTabBar: false },
    key: this.props.navigation.state.key,
    });
    this.props.navigation.dispatch(setParamsAction);
  }
  onPressSignUpPage() {
    this.props.navigation.navigate('signup');
  }
  handleFaceBookAuth() {
    this.props.facebookAuth('login', () => {
      this.props.navigation.navigate('myProfile');
    });
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} keyboardShouldPersistTaps='handled'>
          <TimKiemHeader {...this.props} parentScreen='myProfile'/>
          <View style={{ marginTop: 10 }}>
            <Card>
              <LogInForm {...this.props} />
            </Card>
            <View style={{ marginTop: 20 }}>
              <Button
                title='Login With Facebook'
                icon={{ name: 'facebook-square', type: 'font-awesome' }}
                backgroundColor='rgb(59, 89, 152)'
                buttonStyle={styles.buttonStyle}
                onPress={this.handleFaceBookAuth.bind(this)}
              />
              <Button
                title='Login With Google'
                icon={{ name: 'google', type: 'font-awesome' }}
                backgroundColor='rgb(72, 133, 237)'
                buttonStyle={[styles.buttonStyle, { marginTop: 10 }]}
              />
            </View>
          </View>
      </ScrollView>
    );
  }
}

const styles = {
  buttonRow: {
    justifyContent: 'space-between',
    alignItems: 'space-around',
    flexDirection: 'column',
    margin: 20,
    marginBottom: 30,
    marginTop: 20
  },
  buttonStyle: {
    shadowOpacity: 1.0,
    borderRadius: 5,
  },
};


export default connect(null, actions)(LogIn);
