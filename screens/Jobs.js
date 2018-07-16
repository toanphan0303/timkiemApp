import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import WithTimKiemHeader from '../components/HOC/WithTimKiemHeader';
import PostRoomForm from '../components/PostRoomForm';
import * as actions from '../actions';


class Test extends Component {
  render() {
    return (
      <PostRoomForm />
    );
  }
}
const mapStateToProps = ({ userRoom, user }) => {
  return { userRoom, user };
};

export default connect(mapStateToProps, actions)(WithTimKiemHeader(Test));
