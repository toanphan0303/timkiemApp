import {
  FETCH_ROOMS_AMOUNT_IN_ZIP,
} from '../actions/types';

const INIATIAL_STATE = [];

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ROOMS_AMOUNT_IN_ZIP:
      return action.payload;
    default:
      return state;
  }
}
