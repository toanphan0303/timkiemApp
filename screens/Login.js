import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Card
} from 'react-native-elements';
import TimKiemHeader from '../components/TimKiemHeader';
import * as actions from '../actions';

const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,26}/
const ERROR_MESSAGE = {
  emptyError: 'This filed is required',
  errorEmail: 'Provided email is invalid',
  errorPassword: 'Minimum 8 and maximum 26 characters, at least one upprcase letter, one lowercase letter, one number and one special character:'
};
class LogIn extends Component {
  state = {
    errorEmail: null,
    email: '',
    password: '',
    errorPassword: null,
  }
  onPressSubmit() {
    const { email, password } = this.state;
    this.props.loginPoolWraper('login', email, password, () => {
      this.props.navigation.navigate('myProfile');
    });
  }
  onPressSignUpPage() {
    this.props.navigation.navigate('signup');
  }
  handleFaceBookAuth() {
    this.props.facebookAuth('login', () => {
      this.props.navigation.navigate('myProfile');
    });
  }
  ableToSubmit() {
    const {
      errorEmail,
      errorPassword,
    } = this.state;
    const intialState = this.checkInitalState();
    if (errorEmail === null && errorPassword === null && intialState === false) {
        return true;
      }
    return false;
  }
  checkInitalState() {
    const {
      email,
      password
    } = this.state;
    if (email === ''
      || password === '') {
      return true;
    }
    return false;
  }
  checkInputEmail() {
    const { email } = this.state;
    if (email.length === 0) {
      this.formInputEmail.shake();
      return this.setState({ errorEmail: ERROR_MESSAGE.emptyError });
    } else if (!EMAIL_PATTERN.test(email)) {
      this.formInputEmail.shake();
      return this.setState({ errorEmail: ERROR_MESSAGE.errorEmail });
    }
      return this.setState({ errorEmail: null });
  }
  checkInputPassword() {
    const { password } = this.state;
    if (password.length === 0) {
      this.formInputPassword.shake();
      return this.setState({ errorPassword: ERROR_MESSAGE.emptyError });
    } else if (!PASSWORD_PATTERN.test(password)) {
      this.formInputPassword.shake();
      return this.setState({ errorPassword: ERROR_MESSAGE.errorPassword });
    }
      return this.setState({ errorPassword: null });
  }
  render() {
    const submitEnable = this.ableToSubmit();
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <TimKiemHeader />
        <View style={{ marginTop: 10 }}>
          <Card>
            <FormLabel>Email</FormLabel>
            <FormInput
              onChangeText={(text) => this.setState({ email: text.toLowerCase() })}
              value={this.state.email}
              onEndEditing={this.checkInputEmail.bind(this)}
              ref={ref => this.formInputEmail = ref}
            />
            { this.state.errorEmail &&
              <FormValidationMessage>{this.state.errorEmail}</FormValidationMessage>
            }
            <FormLabel>Password</FormLabel>
            <FormInput
              secureTextEntry
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
              onEndEditing={this.checkInputPassword.bind(this)}
              ref={ref => this.formInputPassword = ref}
            />
            { this.state.errorPassword &&
              <FormValidationMessage>{this.state.errorPassword}</FormValidationMessage>
            }
            <View style={{ marginTop: 20 }}>
              <Button
                title='Submit'
                onPress={this.onPressSubmit.bind(this)}
                icon={{ name: 'sc-telegram', type: 'evilicon' }}
                backgroundColor='#008CBA'
                buttonStyle={styles.buttonStyle}
                disabled={!submitEnable}
              />
            </View>
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
        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
          <Button
            title='SignUp'
            icon={{ name: 'user-plus', type: 'font-awesome' }}
            backgroundColor='rgb(60, 186, 84)'
            buttonStyle={styles.buttonStyle}
            onPress={this.onPressSignUpPage.bind(this)}
          />
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
