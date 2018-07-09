import { StackActions, NavigationActions } from 'react-navigation';

import {
  LOGIN_SUCCESS
} from '../actions/types';

const INIATIAL_STATE = {};
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'rooms' })],
});

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
