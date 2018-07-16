import {
  ERROR_AUTH
} from '../actions/types';

const INIATIAL_STATE = {};

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case ERROR_AUTH:
      return action.payload;
    default:
      return state;
  }
}
