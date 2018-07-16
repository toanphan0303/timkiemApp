import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { compose, withReducer } from 'recompose';
import { connect } from 'react-redux';
import {
  FormLabel,
  Button
} from 'react-native-elements';
import FormValidation from './HOC/withRoomFormValidation';
import Picker from './HOC/withPicker';
import * as actions from '../actions';


class LoginForm extends Component {
  state= {
    loading: false
  }
  onPressSubmit = async() => {
    let roomInfo = {};
    if (this.props.roomDetail && this.props.roomDetail.Items && this.props.roomDetail.Items[0]) {
      roomInfo = this.props.roomDetail.Items[0];
    }
    const { id, email, user } = roomInfo;
    const { phone, zip, type, price, description } = this.props;
    this.setState({ loading: true });
    await this.props.updateRoom(id, email, description, phone, zip, type, price);
    await this.props.getPostRoom(user, email, () => {
      this.setState({ loading: false });
      this.props.navigation.navigate('roomPostSummary');
    });
  }
  ableToSubmit() {
    const {
      hasPhoneError,
      hasPriceError,
      hasDescriptionError,
      hasTypeError
    } = this.props;
    if (hasDescriptionError === false
      && hasPriceError === false
      && hasPhoneError === false
      && hasTypeError === false) {
        return true;
      }
    return false;
  }
  checkInitalState() {
    const {
      zip,
      phone,
      price,
      description
    } = this.props;
    if (zip === '' || phone === '' || price === '' || description === '') {
      return true;
    }
    return false;
  }

  render() {
    let roomInfo = {};
    if (this.props.roomDetail && this.props.roomDetail.Items && this.props.roomDetail.Items[0]) {
      roomInfo = this.props.roomDetail.Items[0];
    }
    const submitEnable = this.ableToSubmit();
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} keyboardShouldPersistTaps='handled'>
        <View style={{ marginBottom: 0 }} >
          <FormLabel>Description</FormLabel>
          <FormValidation inputName='description' multiline initialValue={roomInfo.description} {...this.props} />
        </View>
        <View style={{ marginBottom: -20 }}>
          <FormLabel>Phone</FormLabel>
          <FormValidation inputName='phone' keyboardType={'phone-pad'} initialValue={roomInfo.phone} {...this.props} />
        </View>
        <FormLabel style={{ marginBottom: 0 }}>Price</FormLabel>
        <FormValidation inputName='price' keyboardType={'phone-pad'} initialValue={roomInfo.room.price} {...this.props} />
        <FormLabel style={{ marginBottom: 0 }}>Room Type</FormLabel>
        <Picker initialValue={roomInfo.room.type} {...this.props} />
        <FormLabel style={{ marginBottom: 0 }}>Zip Code</FormLabel>
        <FormValidation editable={false} inputName='zip' keyboardType={'phone-pad'} initialValue={roomInfo.zip} {...this.props} />
        <Button
          title='Submit'
          onPress={this.onPressSubmit.bind(this)}
          buttonStyle={styles.buttonStyle}
          disabled={!submitEnable}
          icon={{ name: 'sc-telegram', type: 'evilicon' }}
          backgroundColor='#008CBA'
          loading={this.state.loading}
        />
      </ScrollView>
    );
  }
}
const zipReducer = (zip = '', action) => {
  switch (action.type) {
    case 'ZIP':
      return action.payload;
    default:
      return zip;
  }
};
const errorZipReducer = (error, action) => {
  switch (action.type) {
    case 'ZIP_ERROR':
      return true;
    case 'NONE':
      return false;
    default:
      return false;
  }
};
const phoneReducer = (phone = '', action) => {
  switch (action.type) {
    case 'PHONE':
      return action.payload;
    default:
      return phone;
  }
};
const errorPhoneReducer = (error, action) => {
  switch (action.type) {
    case 'PHONE_ERROR':
      return true;
    case 'NONE':
      return false;
    default:
      return false;
  }
};
const priceReducer = (price = '', action) => {
  switch (action.type) {
    case 'PRICE':
      return action.payload;
    default:
      return price;
  }
};
const errorPriceReducer = (error, action) => {
  switch (action.type) {
    case 'PRICE_ERROR':
      return true;
    case 'NONE':
      return false;
    default:
      return false;
  }
};
const descriptionReducer = (description = '', action) => {
  switch (action.type) {
    case 'DESCRIPTION':
      return action.payload;
    default:
      return description;
  }
};
const errorDescReducer = (error, action) => {
  switch (action.type) {
    case 'DESCRIPTION_ERROR':
      return true;
    case 'NONE':
      return false;
    default:
      return false;
  }
};
const typeReducer = (type = '', action) => {
  switch (action.type) {
    case 'TYPE':
      return action.payload;
    default:
      return type;
  }
};
const errorTypeReducer = (error, action) => {
  switch (action.type) {
    case 'TYPE_ERROR':
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
  withReducer('hasZipError', 'dispatchErrorZip', errorZipReducer, false),
  withReducer('hasPhoneError', 'dispatchErrorPhone', errorPhoneReducer, false),
  withReducer('hasPriceError', 'dispatchErrorPrice', errorPriceReducer, false),
  withReducer('hasDescriptionError', 'dispatchErrorDesc', errorDescReducer, false),
  withReducer('hasTypeError', 'dispatchErrorType', errorTypeReducer, false),
  withReducer('zip', 'dispatchZip', zipReducer, ''),
  withReducer('phone', 'dispatchPhone', phoneReducer, ''),
  withReducer('price', 'dispatchPrice', priceReducer, ''),
  withReducer('description', 'dispatchDesc', descriptionReducer, ''),
  withReducer('type', 'dispatchType', typeReducer, '')
);
const mapStateToProps = ({ roomDetail }) => {
  return { roomDetail };
};
export default connect(mapStateToProps, actions)(enhanceForm(LoginForm));
