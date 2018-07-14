import React, { Component } from 'react';
import { View } from 'react-native';
import TimKiemHeader from '../TimKiemHeader';

const WithTimKiemHeader = (ComponentToWrap) => {
  return class AddHeader extends Component {
    render() {
      return (
        <View style={{ flex: 1 }}>
          <TimKiemHeader {...this.props} parentScreen='myProfile' />
          <ComponentToWrap {...this.props} listing={this.props.userRoom.result} />
        </View>
      );
    }
  };
};

export default WithTimKiemHeader;
