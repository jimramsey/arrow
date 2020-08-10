import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_TRADES,
  GET_TRADES_BY_DATE,
  TRADE_ERROR,
  DELETE_TRADE,
  ADD_TRADE,
} from "./types";

// get trades

export const getTrades = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/trades");
    dispatch({
      type: GET_TRADES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TRADE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// get trades by timeframe

export const getTradesByDate = (startWeek, endWeek) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/trades/dates/${startWeek}/${endWeek}`);
    dispatch({
      type: GET_TRADES_BY_DATE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: TRADE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// add trades

export const addTrade = (formData, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post("/api/trades/", formData, config);
    dispatch({
      type: ADD_TRADE,
      payload: res.data,
    });

    history.push("/trades");
    dispatch(setAlert("Trade added"), "success");
  } catch (err) {
    console.log(err);
    dispatch({
      type: TRADE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// delete trades

export const deleteTrade = (id) => async (dispatch) => {
  if (
    window.confirm(
      "Are you sure you want to delete this trade? It cannot be undone."
    )
  ) {
    try {
      await axios.delete(`/api/trades/${id}`);
      dispatch({
        type: DELETE_TRADE,
        payload: id,
      });
      dispatch(setAlert("Trade removed"), "success");
    } catch (err) {
      dispatch({
        type: TRADE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
