import React from 'react';
import { withState, withHandlers, lifecycle, compose } from 'recompose';
import { Picker, View } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';


const ERROR_MESSAGE = {
  emptyError: 'Please select room type'
};
const PickerComp = ({ value, error, onValueChange }) => (
  <View>
    <Picker
      selectedValue={value}
      style={{ marginLeft: 10, paddingRight: 0, width: 165 }}
      onValueChange={onValueChange}
    >
      <Picker.Item label="Select One" value="" />
      <Picker.Item label="Regular room" value="regular" />
      <Picker.Item label="Master room" value="master" />
      <Picker.Item label="Entire house" value="house" />
      <Picker.Item label="Private unit" value="private" />
    </Picker>
    <FormValidationMessage>{error}</FormValidationMessage>
  </View>
);


const withPicker = compose(
  withState('value', 'setValue', ''),
  withState('error', 'setError', null),
  withHandlers({
    onValueChange: props => async(event) => {
      if (event === '') {
        props.dispatchErrorType({ type: 'TYPE_ERROR' });
        props.setError(ERROR_MESSAGE.emptyError);
      } else {
        await props.setValue(event);
        props.dispatchErrorType({ type: 'NONE' });
        props.setError(null);
        props.dispatchType({ type: 'TYPE', payload: event });
      }
    }
  }),
  lifecycle({
    async componentWillMount() {
      this.props.dispatchType({ type: 'TYPE', payload: this.props.initialValue });
    }
  })
);

export default (withPicker)(PickerComp);
