import {
  FETCH_DETAIL_ROOM,
} from '../actions/types';

const INIATIAL_STATE = {};

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DETAIL_ROOM:
      return action.payload;
    default:
      return state;
  }
}
