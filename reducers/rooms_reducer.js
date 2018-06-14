import {
  FETCH_ROOMS_ZIP
} from '../actions/types';

const INIATIAL_STATE = {
  results: []
};

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ROOMS_ZIP:
      return action.payload;
    default:
      return state;
  }
}
