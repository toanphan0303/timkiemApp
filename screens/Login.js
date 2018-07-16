import React, { Component } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo';
import { connect } from 'react-redux';
import { material } from 'react-native-typography';
import _ from 'lodash';
import {
  Card,
  Icon,
  FormValidationMessage
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
  handleSocialAuth() {
    this.props.socialAuth('login', () => {
      this.props.navigation.navigate('myProfile');
    });
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} keyboardShouldPersistTaps='handled'>
        <TimKiemHeader {...this.props} parentScreen='myProfile'/>
        <View style={{ marginTop: 10 }}>
          { !_.isEmpty(this.props.errorAuth.message) &&
            <View style={{ marginLeft: 20, flexDirection: 'row' }}>
              <Icon iconStyle={{ paddingTop: 5, paddingLeft: 10 }} color='red' name='close' type='evilicon' />
              <FormValidationMessage inputStyle={[material.button, { fontSize: 17, fontWeight: 'bold'}]}>{this.props.errorAuth.message}</FormValidationMessage>
            </View>
          }
          <Card>
            <LogInForm {...this.props} />
          </Card>
          <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center'  }}>
            <LinearGradient
              colors={['#6600FF', '#0066FF']}
              start={{x: 0.1, y: 0.1}} end={{x: 1, y: 1}}
              style={{ height: 48, width: 350, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
            >
              <TouchableOpacity
                style={styles.buttonContainer1}
                onPress={this.handleSocialAuth.bind(this)}
              >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 10, marginLeft: 40, paddingLeft: 20, marginTop: 7 }}>
                      <Icon color='white' name='facebook' type='font-awesome' size={25} />
                    </View>
                    <View style={{ marginLeft: 10, marginRight: 10, marginTop: 7 }}>
                      <Icon color='white' name='google' type='font-awesome' size={25} />
                    </View>
                    <Text style={styles.buttonText1}>
                        Login With Facebook or Google
                    </Text>
                  </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        <View style={{ height: 200, marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
          <LinearGradient
            colors={['#00FFFF', '#17C8FF', '#329BFF', '#4C64FF', '#6536FF', '#8000FF']}
            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
            style={{ height: 48, width: 200, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.onPressSignUpPage.bind(this)}
            >
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ marginLeft: 40, paddingLeft: 70, paddingTop: 7 }}>
                    <Icon color='#4C64FF' name='user-plus' type='font-awesome' size={25} />
                  </View>
                  <Text style={styles.buttonText}>
                      SIGN UP PAGE
                  </Text>
                </View>
            </TouchableOpacity>
          </LinearGradient>
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
  buttonContainer: {
      width: 190,
      height: 40,
      alignItems: 'center',
      backgroundColor: 'white',
  },
  buttonText: {
      textAlign: 'center',
      color: '#4C64FF',
      padding: 10,
      marginLeft: -50,
      marginRight: 50,
      width: 200
  },
  buttonContainer1: {
      width: 400,
      height: 40,
      alignItems: 'center',
      backgroundColor: 'transparent',
  },
  buttonText1: {
      color: 'white',
      fontWeight: 'bold',
      padding: 10,
      width: 275
  }
};

const mapStateToProps = ({ errorAuth }) => {
  return { errorAuth };
};
export default connect(mapStateToProps, actions)(LogIn);
