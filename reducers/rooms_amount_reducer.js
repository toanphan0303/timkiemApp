import {
  FETCH_ROOMS_AMOUNT_IN_ZIP,
  ERROR_FETCH
} from '../actions/types';

const INIATIAL_STATE = [];

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ROOMS_AMOUNT_IN_ZIP:
      return action.payload;
    case ERROR_FETCH:
      return state;
    default:
      return state;
  }
}
