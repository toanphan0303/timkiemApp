import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
  Card,
  Text
} from 'react-native-elements';
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
    this.props.logInCognitoPool(email, password, () => {
      this.props.navigation.navigate('rooms');
    });
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
    return (
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 50 }}>
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
              />
            </View>
          </Card>
          <View style={styles.styles}>
            <Button
              title='Login With Facebook'
              icon={{ name: 'facebook-square', type: 'font-awesome' }}
              backgroundColor='rgb(59, 89, 152)'
            />
            <Button
              buttonStyle={{ marginTop: 10 }}
              title='Login With Google'
              icon={{ name: 'google', type: 'font-awesome' }}
              backgroundColor='rgb(72, 133, 237)'
            />
          </View>
        </View>
        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity>
            <Text h5>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  }
};


export default connect(null, actions)(LogIn);
