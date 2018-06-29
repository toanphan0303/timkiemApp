import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const propTypes = {
  amount: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};

const defaultProps = {
  fontSize: 13,
};

class ZipMarker extends React.Component {
  render() {
    const { fontSize, amount } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={[styles.amount, { fontSize }]}>{amount}</Text>
            <Text style={styles.rooms}> rooms</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

ZipMarker.propTypes = propTypes;
ZipMarker.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#1E90FF',
    padding: 2,
    borderRadius: 3,
    borderColor: '#00BFFF',
    borderWidth: 0.5,
  },
  rooms: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#00BFFF',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default ZipMarker;
