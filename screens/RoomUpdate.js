import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import WithTimKiemHeader from '../components/HOC/WithTimKiemHeader';
import PostRoomForm from '../components/PostRoomForm';
import * as actions from '../actions';


class UpdateRoom extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <PostRoomForm navigation={this.props.navigation} />
      </View>
    );
  }
}
const mapStateToProps = ({ userRoom, user }) => {
  return { userRoom, user };
};

export default connect(mapStateToProps, actions)(WithTimKiemHeader(UpdateRoom));
