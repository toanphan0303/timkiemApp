import React, { Component } from 'react';
import { ScrollView, View, Picker } from 'react-native';
import { FormLabel, FormInput, Button, FormValidationMessage } from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../actions';
import TimKiemHeader from '../components/TimKiemHeader';


const ERROR_MESSAGE = {
  emptyError: 'This filed is required',
  errorZip: 'Provided zip code is invalid',
  errorPhone: 'Provided phone is invalid',
  errorPrice: 'Provided room price is invalid'
};
class RoomPost extends Component {
  state = {
    roomType: 'regular',
    description: '',
    errorDescription: null,
    phone: '',
    errorPhone: null,
    zip: '',
    errorZip: null,
    price: '',
    errorPrice: null,
    loading: false
  }
  onPressSubmit() {
    this.setState({ loading: true })
    const { email, sub } = this.props.user;
    const { roomType, description, phone, zip, price } = this.state;
    this.props.postRoom(sub, email, description, phone, zip, roomType, price, () => {
      this.setState({ loading: false })
      this.props.navigation.navigate('myProfile');
    });
  }
  ableToSubmit() {
    const {
      errorDescription,
      errorPhone,
      errorZip,
      errorPrice
    } = this.state;
    const intialState = this.checkInitalState();
    if (errorDescription === null && errorPhone === null && errorZip === null && errorPrice === null && intialState === false ) {
        return true;
      }
    return false;
  }
  checkInitalState() {
    const { roomType, description, phone, zip, price } = this.state;
    if (roomType === '' && description === '' && phone === '' && zip === '' && price === '') {
      return true;
    }
    return false;
  }
  checkPrice() {
    const { price } = this.state;
    if (price.length === 0) {
      this.formInputPrice.shake();
      return this.setState({ priceError: ERROR_MESSAGE.emptyError });
    } else if (!/^[0-9]*$/.test(price)) {
      this.formInputPrice.shake();
      return this.setState({ errorPrice: ERROR_MESSAGE.errorPrice });
    }
      return this.setState({ errorPrice: null });
  }
  checkPhoneNumber() {
    const { phone } = this.state;
    if (phone.length === 0) {
      this.formInputPhone.shake();
      return this.setState({ errorPhone: ERROR_MESSAGE.emptyError });
    } else if (!/^\d{3}\d{3}\d{4}$/.test(phone)) {
      this.formInputPhone.shake();
      return this.setState({ errorPhone: ERROR_MESSAGE.errorPhone });
    }
      return this.setState({ errorPhone: null });
  }
  checkZipCode() {
    const { zip } = this.state;
    if (zip.length === 0) {
      this.formInputZip.shake();
      return this.setState({ errorZip: ERROR_MESSAGE.emptyError });
    } else if (!/^\d{5}$|^\d{5}-\d{4}$/.test(zip)) {
      this.formInputZip.shake();
      return this.setState({ errorZip: ERROR_MESSAGE.errorZip });
    }
      return this.setState({ errorZip: null });
  }
  checkDescription() {
    const { description } = this.state;
    if(description.length === 0) {
      this.formInputDescription.shake();
      return this.setState({ errorDescription: ERROR_MESSAGE.emptyError });
    }
    return this.setState({ errorDescription: null });
  }
  render() {
    const { roomType } = this.state;
    const submitEnable = this.ableToSubmit();
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} keyboardShouldPersistTaps='handled'>
        <TimKiemHeader {...this.props} parentScreen='myProfile' />
        <View>
          <View>
          <FormLabel>Description</FormLabel>
          <FormInput
            onChangeText={(text) => this.setState({ description: text })}
            multiline={true}
            value={this.state.description}
            onEndEditing={this.checkDescription.bind(this)}
            ref={ref => this.formInputDescription = ref}
          />
          { this.state.errorDescription &&
            <FormValidationMessage>{this.state.errorDescription}</FormValidationMessage>
          }
          <FormLabel>Phone</FormLabel>
          <FormInput
            onChangeText={(text) => this.setState({ phone: text })}
            keyboardType={'phone-pad'}
            value={this.state.phone}
            onEndEditing={this.checkPhoneNumber.bind(this)}
            ref={ref => this.formInputPhone= ref}
          />
          { this.state.errorPhone &&
            <FormValidationMessage>{this.state.errorPhone}</FormValidationMessage>
          }
          <FormLabel>Room Type</FormLabel>
          <Picker
            selectedValue={this.state.roomType}
            style={{ marginLeft: 10, paddingRight: 0, width: 165 }}
            onValueChange={(itemValue) => this.setState({ roomType: itemValue })}
          >
            <Picker.Item label="Regular room" value="regular" />
            <Picker.Item label="Master room" value="master" />
            <Picker.Item label="Entire house" value="house" />
            <Picker.Item label="Private unit" value="private" />
          </Picker>
          <FormLabel>Price</FormLabel>
          <FormInput
            onChangeText={(text) => this.setState({ price: text })}
            keyboardType={'phone-pad'}
            value={this.state.price}
            onEndEditing={this.checkPrice.bind(this)}
            ref={ref => this.formInputPrice = ref}
          />
          { this.state.errorPrice &&
            <FormValidationMessage>{this.state.errorPrice}</FormValidationMessage>
          }
          <FormLabel>Zip code</FormLabel>
          <FormInput
            onChangeText={(text) => this.setState({ zip: text })}
            keyboardType={'phone-pad'}
            value={this.state.zip}
            onEndEditing={this.checkZipCode.bind(this)}
            ref={ref => this.formInputZip = ref}
          />
          { this.state.errorZip &&
            <FormValidationMessage>{this.state.errorZip}</FormValidationMessage>
          }
          </View>
        </View>
        <View style={{ marginTop: 20, height: 200 }}>
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
      </ScrollView>
    );
  }
}

const styles = {
  buttonStyle: {
    shadowOpacity: 1.0,
    borderRadius: 5,
  }
};
const mapStateToProps = ({ user }) => {
  return { user };
};

export default connect(mapStateToProps, actions)(RoomPost);
