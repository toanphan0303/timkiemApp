import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';


const FullScreenSpinner = Comp =>
  class extends Component {
    render() {
      const { spinner, children } = this.props;
      return (
        <View style={{ flex: 1 }}>
          <Comp {...this.props}>
            {children}
          </Comp>
          {spinner &&
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center' }
              ]}
            >
              <ActivityIndicator size="large" />
            </View>
          }
        </View>
    );
  }
};
export default FullScreenSpinner;
