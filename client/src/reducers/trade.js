import {
  GET_TRADES,
  GET_TRADES_BY_DATE,
  TRADE_ERROR,
  DELETE_TRADE,
  ADD_TRADE,
  GET_TOTALS,
} from "../actions/types";

const initialState = {
  trades: [],
  trade: null,
  totals: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_TRADES:
    case GET_TRADES_BY_DATE:
      return {
        ...state,
        trades: payload,
        loading: false,
      };
    case ADD_TRADE:
      return {
        ...state,
        // trades: [payload, ...state.trades],
        /// loading: false,
      };
    case GET_TOTALS:
      return {
        ...state,
        totals: payload,
      };
    case DELETE_TRADE:
      return {
        ...state,
        trades: state.trades.filter((trade) => trade._id !== payload),
        loading: false,
      };
    case TRADE_ERROR:
      return {
        ...state,
        trades: payload,
        loading: false,
      };
    default:
      return {
        state,
      };
  }
}
