import {
  FETCH_USER_POST_ROOM,
  FETCH_USER_LIKE_ROOM
} from '../actions/types';

const INIATIAL_STATE = {};

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER_POST_ROOM:
      return action.payload;
    case FETCH_USER_LIKE_ROOM:
      return action.payload;
    default:
      return state;
  }
}
