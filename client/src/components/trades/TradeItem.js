import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import "moment-timezone";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import { deleteTrade } from "../../actions/trade";

const getStrategy = (type) => {
  switch (type) {
    case "csp":
      return "Cash-Secured Put";
    case "pcs":
      return "Put Credit Spread";
    case "ccs":
      return "Call Credit Spread";
    case "straddle":
      return "Straddle";
    case "longcall":
      return "Long Call";
    case "longput":
      return "Long Put";
    case "coveredcall":
      return "Covered Call";
    default:
      return "";
  }
};

const TradeItem = ({ key, trade, deleteTrade }) => {
  return (
    <tr key={key}>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 hidden">
            <img
              className="h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
              alt=""
            />
          </div>
          <div className="">
            <div className="text-sm leading-5 font-medium text-gray-900">
              {trade.company}{" "}
              <Moment utc format="MM/DD">
                {trade.open.legs[0].expiry}
              </Moment>{" "}
              <NumberFormat
                value={trade.open.legs[0].strikePrice}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
                fixedDecimalScale={true}
                decimalScale="2"
              />
              {trade.open.legs[1] ? (
                <NumberFormat
                  value={trade.open.legs[1].strikePrice}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                  fixedDecimalScale={true}
                  decimalScale="2"
                />
              ) : null}
            </div>
            <div className="text-sm leading-5 text-gray-500 capitalize">
              {trade.tradeType.strategy
                ? getStrategy(trade.tradeType.strategy)
                : trade.tradeType.type}{" "}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm capitalize">
        {trade.buySell} ({trade.quantity})
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="text-sm leading-5 text-gray-900">
          <NumberFormat
            value={trade.open.price}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            fixedDecimalScale={true}
            decimalScale="2"
          />
        </div>
        <div className="text-sm leading-5 text-gray-500">
          <Moment format="YYYY/MM/DD" utc>
            {trade.open.date}
          </Moment>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="text-sm leading-5 text-gray-900">
          <NumberFormat
            value={trade.close.price}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
            fixedDecimalScale={true}
            decimalScale="2"
          />
        </div>
        <div className="text-sm leading-5 text-gray-500">
          <Moment format="YYYY/MM/DD" utc>
            {trade.close.date}
          </Moment>
        </div>
      </td>
      <td
        className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-lg text-right ${
          trade.totals.profit > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        <NumberFormat
          value={parseFloat(trade.totals.profit).toFixed(2)}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
          fixedDecimalScale={true}
          decimalScale="2"
        />
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        {trade.totals.profit > 0 ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            WIN
          </span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            LOSS
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
        <button
          className="pl-4 text-gray-400 hover:text-indigo-900 focus:outline-none"
          type="button"
          onClick={() => console.log(trade._id)}
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="pl-4 text-gray-400 hover:text-indigo-900 focus:outline-none"
          type="button"
          // onClick={() => getTrades()}
          onClick={() => deleteTrade(trade._id)}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
};

TradeItem.propTypes = {
  trade: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteTrade: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteTrade })(TradeItem);
