import {
  ERROR_SIGN_UP,
  SIGN_UP_SUCCESS
} from '../actions/types';

const INIATIAL_STATE = {};

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case ERROR_SIGN_UP:
      return action.payload;
    case SIGN_UP_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
