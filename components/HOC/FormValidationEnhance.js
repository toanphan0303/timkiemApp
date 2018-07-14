import React, { Component } from 'react';
import { compose, withState, withHandlers, hoistStatics } from 'recompose';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import { View } from 'react-native';

const NAME_PATTERN = /^[a-zA-Z]*$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,26}/;
const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ERROR_MESSAGE = {
  emptyError: 'This filed is required',
  errorPasswordMatched: 'Retype password is unmatched',
  errorEmail: 'Provided email is invalid',
  errorPassword: 'Minimum 8 and maximum 26 characters, at least one upprcase letter, one lowercase letter, one number and one special character:',
  errorName: 'Provided name is invalid'
};

const Form = ({ onChangeText, onEndEditing, value, error, secureTextEntry }) => (
  <View>
    <FormInput
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      value={value}
      secureTextEntry={secureTextEntry}
    />
    <FormValidationMessage>{error}</FormValidationMessage>
  </View>
);
const FormValidation = compose(
  withState('error', 'setError', null),
  withState('value', 'setValue', ''),
  withHandlers({
    onEndEditing: props => e => {
      const { value, dispatchErrorEmail, dispatchErrorPassword, dispatchEmail, dispatchPassword, inputName } = props;
     if (inputName === 'email') {
        if (!EMAIL_PATTERN.test(value)) {
          dispatchErrorEmail({ type: 'EMAIL_ERROR' });
          return props.setError(ERROR_MESSAGE.errorEmail);
        } else {
          dispatchErrorEmail({ type: 'NONE' });
          dispatchEmail({ type: 'EMAIL', payload: value });
          return props.setError(null);
        }
      } else if (inputName === 'password') {
        if (!PASSWORD_PATTERN.test(value)) {
          dispatchErrorPassword({ type: 'PASSWORD_ERROR' });
          return props.setError(ERROR_MESSAGE.errorPassword);
        } else {
          dispatchErrorPassword({ type: 'NONE' });
          dispatchPassword({ type: 'PASSWORD', payload: value });
          return props.setError(null);
        }
      }
    },
    onChangeText: props => event => {
      if (props.inputName === 'email') {
          props.setValue(event.toLowerCase());
      } else {
        props.setValue(event);
      }
    },
  })
);

export default hoistStatics(FormValidation)(Form);
