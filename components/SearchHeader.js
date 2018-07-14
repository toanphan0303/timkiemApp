import React, { Component } from 'react';
import { Button, Header } from 'react-native-elements';
import SearchTabBar from './SearchTabBar';
import withButtonOnSearchHeader from './HOC/withButtonOnSearchHeader';

const ButtonHeader = withButtonOnSearchHeader((props) =>
  <Button
    title={props.title}
    backgroundColor='white'
    buttonStyle={{ paddingTop: 15 }}
    color='black'
    onPress={props.onPress}
  />
);

const SearchHeader = (props) => (
  <Header
    outerContainerStyles={{
      backgroundColor: 'white',
      marginTop: 25,
      paddingTop: 5,
      paddingBottom: -5
    }}
    innerContainerStyles={{
      backgroundColor: 'white',
      justifyContent: 'space-around',
      alignItems: 'flex-start'
    }}
    rightComponent={<ButtonHeader {...props} go={props.go} />}
    leftComponent={<SearchTabBar
      navigation={props.navigation}
    />}
  />
);
export default SearchHeader;
