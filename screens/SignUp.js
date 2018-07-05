import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, FormLabel, FormInput, FormValidationMessage, Card, Text, Icon } from 'react-native-elements';
import * as actions from '../actions';

const ERROR_MESSAGE = {
  emptyError: 'This filed is required',
  errorPasswordMatched: 'Retype password is unmatched',
  errorEmail: 'Provided email is invalid',
  errorPassword: 'Minimum 8 and maximum 26 characters, at least one upprcase letter, one lowercase letter, one number and one special character:',
  errorName: 'Provided name is invalid'
};
const NAME_PATTERN = /^[a-zA-Z]*$/;
const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,26}/
class SignUp extends Component {
  state = {
    user: undefined,
    errorFirstName: null,
    firstName: '',
    errorLastName: null,
    lastName: '',
    errorEmail: null,
    email: '',
    password: '',
    errorPassword: null,
    rePassword: '',
    errorRePassword: null,
  }
  onPressSubmit() {
    const { email, password, firstName, lastName } = this.state;
    this.props.signUpCognitoPool(email, password, firstName, lastName, () => {
      this.props.navigation.navigate('myProfile');
    });
  }
  facebookSignOut() {
    this.props.facebookSignOut();
  }
  handleFaceBookAuth() {
    this.props.facebookSignUp();
  }
  checkInputFirstName() {
    const { firstName } = this.state;
    if (firstName.length === 0) {
      this.formInputFirstName.shake();
      return this.setState({ errorFirstName: ERROR_MESSAGE.emptyError });
    } else if (!NAME_PATTERN.test(firstName)) {
      this.formInputFirstName.shake();
      return this.setState({ errorFirstName: ERROR_MESSAGE.errorName });
    }
      return this.setState({ errorFirstName: null });
  }
  checkInputLastName() {
    const { lastName } = this.state;
    if (lastName.length === 0) {
      this.formInputLastName.shake();
      return this.setState({ errorLastName: ERROR_MESSAGE.emptyError });
    } else if (!NAME_PATTERN.test(lastName)) {
      this.formInputLastName.shake();
      return this.setState({ errorLastName: ERROR_MESSAGE.errorName });
    }
      return this.setState({ errorLastName: null });
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
  checkInputRePassword() {
    const { rePassword, password } = this.state;
    if (password.length === 0) {
      this.formInputRePassword.shake();
      return this.setState({ errorRePassword: ERROR_MESSAGE.emptyError });
    } else if (rePassword !== password) {
      this.formInputRePassword.shake();
      return this.setState({ errorRePassword: ERROR_MESSAGE.errorPasswordMatched });
    }
      return this.setState({ errorRePassword: null });
  }
  checkInitalState() {
    const {
      firstName,
      lastName,
      email,
      password,
      rePassword
    } = this.state;
    if (firstName === ''
      || lastName === ''
      || email === ''
      || password === ''
      || rePassword === '') {
      return true;
    }
    return false;
  }
  ableToSubmit() {
    const {
      errorFirstName,
      errorLastName,
      errorEmail,
      errorPassword,
      errorRePassword
    } = this.state;
    const intialState = this.checkInitalState();
    if (errorFirstName === null && errorLastName === null && errorEmail === null && errorPassword === null && errorRePassword === null && intialState === false ) {
        return true;
      }
    return false;
  }
  render() {
    const submitEnable = this.ableToSubmit();
    const { signupReducer } = this.props;
    return (
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
        <View style={{ marginTop: 50 }}>
          <View>
            <Button
              title='Sign Up With Facebook'
              icon={{ name: 'facebook-square', type: 'font-awesome' }}
              backgroundColor='rgb(59, 89, 152)'
              onPress={this.handleFaceBookAuth.bind(this)}
            />
            <Button
              buttonStyle={{ marginTop: 10 }}
              title='Sign Up With Google'
              icon={{ name: 'google', type: 'font-awesome' }}
              backgroundColor='rgb(72, 133, 237)'
            />
            <Button
              title='Log out'
              backgroundColor='rgb(59, 89, 152)'
              onPress={this.facebookSignOut.bind(this)}
            />
          </View>
        </View>
        <View>
          { !_.isEmpty(signupReducer) &&
            <View style={{ marginLeft: 20, flexDirection: 'row' }}>
              <Icon iconStyle={{ paddingTop: 5, paddingLeft: 10 }} color='red' name='close' type='evilicon' />
              <FormValidationMessage>{signupReducer.message}</FormValidationMessage>
            </View>
          }
          <Card>
            <FormLabel>First Name</FormLabel>
            <FormInput
              onChangeText={(text) => this.setState({ firstName: text })}
              value={this.state.firstName}
              onBlur={this.checkInputFirstName.bind(this)}
              ref={ref => this.formInputFirstName = ref}
            />
            { this.state.errorFirstName &&
              <FormValidationMessage>{this.state.errorFirstName}</FormValidationMessage>
            }
            <FormLabel>Last Name</FormLabel>
            <FormInput
              onChangeText={(text) => this.setState({ lastName: text })}
              value={this.state.lastName}
              onEndEditing={this.checkInputLastName.bind(this)}
              ref={ref => this.formInputLastName = ref}
            />
            { this.state.errorLastName &&
              <FormValidationMessage>{this.state.errorLastName}</FormValidationMessage>
            }
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
            <FormLabel>Retype Password</FormLabel>
            <FormInput
              secureTextEntry
              onChangeText={(text) => this.setState({ rePassword: text })}
              value={this.state.rePassword}
              onEndEditing={this.checkInputRePassword.bind(this)}
              ref={ref => this.formInputRePassword = ref}
            />
            { this.state.errorRePassword &&
              <FormValidationMessage>{this.state.errorRePassword}</FormValidationMessage>
            }
            <View style={{ marginTop: 20 }}>
              <Button
                title='Submit'
                onPress={this.onPressSubmit.bind(this)}
                disabled={!submitEnable}
                icon={{ name: 'sc-telegram', type: 'evilicon' }}
                backgroundColor='#008CBA'
              />
            </View>
          </Card>
        </View>
        <View style={{ height: 200, marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity>
            <Text h5>Log In</Text>
          </TouchableOpacity>
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
    marginBottom: 30
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  }
};

const mapStateToProps = ({ signupReducer }) => {
  return { signupReducer };
};

export default connect(mapStateToProps, actions)(SignUp);
