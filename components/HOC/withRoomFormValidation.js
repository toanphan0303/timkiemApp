import React, { Component } from 'react';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';
import { View } from 'react-native';

const PHONE_PATTERN = /^\d{3}\d{3}\d{4}$/;
const ZIP_PATTERN = /^\d{5}$|^\d{5}-\d{4}$/;
const PRICE_PATTERN = /^[0-9]*$/;

const ERROR_MESSAGE = {
  emptyError: 'This filed is required',
  errorZip: 'Provided zip code is invalid',
  errorPhone: 'Provided phone is invalid',
  errorPrice: 'Provided room price is invalid'
};

const Form = ({ onChangeText, onEndEditing, value, error, multiline, keyboardType, editable }) => (
  <View>
    <FormInput
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
      value={value}
      multiline={multiline}
      keyboardType={keyboardType}
      editable={editable}
    />
    <FormValidationMessage>{error}</FormValidationMessage>
  </View>
);
const FormValidation = compose(
  withState('error', 'setError', null),
  withState('value', 'setValue', ''),
  withHandlers({
    onEndEditing: props => e => {
      const {
        value, inputName,
        dispatchErrorZip, dispatchZip,
        dispatchErrorPhone, dispatchPhone,
        dispatchErrorPrice, dispatchPrice,
        dispatchErrorDesc, dispatchDesc
      } = props;
     if (inputName === 'zip') {
        if (value.length === 0){
          dispatchErrorZip({ type: 'ZIP_ERROR' });
          return props.setError(ERROR_MESSAGE.emptyError);
        }
        if (!ZIP_PATTERN.test(value)) {
          dispatchErrorZip({ type: 'ZIP_ERROR' });
          return props.setError(ERROR_MESSAGE.errorZip);
        } else {
          dispatchErrorZip({ type: 'NONE' });
          dispatchZip({ type: 'ZIP', payload: value });
          return props.setError(null);
        }
      } else if (inputName === 'phone') {
        if (value.length === 0) {
          dispatchErrorPhone({ type: 'PHONE_ERROR' });
          return props.setError(ERROR_MESSAGE.emptyError);
        } else if (!PHONE_PATTERN.test(value)) {
          dispatchErrorPhone({ type: 'PHONE_ERROR' });
          return props.setError(ERROR_MESSAGE.errorPhone);
        } else {
          dispatchErrorPhone({ type: 'NONE' });
          dispatchPhone({ type: 'PHONE', payload: value });
          return props.setError(null);
        }
      } else if (inputName === 'price') {
        if (value.length === 0) {
          dispatchErrorPrice({ type: 'PRICE_ERROR' });
          return props.setError(ERROR_MESSAGE.emptyError);
        } else if (!PRICE_PATTERN.test(value)) {
          dispatchErrorPrice({ type: 'PRICE_ERROR' });
          return props.setError(ERROR_MESSAGE.errorPrice);
        } else {
          dispatchErrorPrice({ type: 'NONE' });
          dispatchPrice({ type: 'PRICE', payload: value });
          return props.setError(null);
        }
      } else if (inputName === 'description') {
        if (value.length === 0) {
          dispatchErrorDesc({ type: 'DESCRIPTION_ERROR' });
          return props.setError(ERROR_MESSAGE.emptyError);
        } else {
          dispatchErrorDesc({ type: 'NONE' });
          dispatchDesc({ type: 'DESCRIPTION', payload: value });
          return props.setError(null);
        }
      }
    },
    onChangeText: props => event => {
      props.setValue(event);
    },
  }),
  lifecycle({
    async componentWillMount() {
      await this.props.setValue(this.props.initialValue);
      this.props.onEndEditing(this.props);
    }
  })
);

export default (FormValidation)(Form);
