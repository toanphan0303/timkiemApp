import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import WithTimKiemHeader from '../components/HOC/WithTimKiemHeader';
import RoomListing from '../components/RoomListing';
import * as actions from '../actions';


class Test extends Component {
  componentWillMount() {
    const setParamsAction = this.props.navigation.setParams({
    params: { showTabBar: false },
    key: this.props.navigation.state.key,
    });
    this.props.navigation.dispatch(setParamsAction);
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <RoomListing {...this.props} />
      </View>
    );
  }
}
const mapStateToProps = ({ userRoom }) => {
  return { userRoom };
};

export default connect(mapStateToProps, actions)(WithTimKiemHeader(Test));
