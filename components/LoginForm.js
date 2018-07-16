import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { compose, withReducer } from 'recompose';
import { connect } from 'react-redux';
import {
  FormLabel,
  Button
} from 'react-native-elements';
import FormValidation from './HOC/FormValidationEnhance';
import * as actions from '../actions';


class LoginForm extends Component {
  state= {
    loading: false
  }
  onPressSubmit = async() => {
    this.setState({ loading: true });
    const { email, password } = this.props;
    try {
      await this.props.loginPoolWraper('login', email, password, () => {
        this.setState({ loading: false });
        this.props.navigation.navigate('myProfile');
      });
    } catch (e) {
      this.setState({ loading: false });
    }
  }
  ableToSubmit() {
    const {
      hasEmailError,
      hasPassWordError
    } = this.props;
    const intialState = this.checkInitalState();
    if (hasEmailError === false && hasPassWordError === false && intialState === false) {
        return true;
      }
    return false;
  }
  checkInitalState() {
    const {
      email,
      password,
    } = this.props;
    if (email === '' || password === '') {
      return true;
    }
    return false;
  }

  render() {
    const submitEnable = this.ableToSubmit();
    return (
      <View style={{ flex: 1 }}>
        <FormLabel>Email</FormLabel>
        <FormValidation inputName='email' {...this.props} />
        <FormLabel>Password</FormLabel>
        <FormValidation inputName='password' secureTextEntry {...this.props} />
        <View style={{ marginTop: 20 }}>
        <Button
          title='Submit'
          onPress={this.onPressSubmit.bind(this)}
          buttonStyle={styles.buttonStyle}
          disabled={!submitEnable}
          icon={{ name: 'sc-telegram', type: 'evilicon' }}
          backgroundColor='#008CBA'
          loading={this.state.loading}
        />
        </View>
      </View>
    );
  }
}
const emailReducer = (email = '', action) => {
  switch (action.type) {
    case 'EMAIL':
      return action.payload;
    default:
      return email;
  }
};
const errorEmailReducer = (error, action) => {
  switch (action.type) {
    case 'EMAIL_ERROR':
      return true;
    case 'NONE':
      return false;
    default:
      return false;
  }
};
const passwordReducer = (password = '', action) => {
  switch (action.type) {
    case 'PASSWORD':
      return action.payload;
    default:
      return password;
  }
};
const errorPasswordReducer = (error, action) => {
  switch (action.type) {
    case 'PASSWORD_ERROR':
      return true;
    case 'NONE':
      return false;
    default:
      return false;
  }
};
const styles = {
  buttonStyle: {
    shadowOpacity: 1.0,
    borderRadius: 5,
  }
};

const enhanceForm = compose(
  withReducer('hasEmailError', 'dispatchErrorEmail', errorEmailReducer, false),
  withReducer('hasPassWordError', 'dispatchErrorPassword', errorPasswordReducer, false),
  withReducer('email', 'dispatchEmail', emailReducer, ''),
  withReducer('password', 'dispatchPassword', passwordReducer, '')
);

export default connect(null, actions)(enhanceForm(LoginForm));
