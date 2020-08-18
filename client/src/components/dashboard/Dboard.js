import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTrades } from "../../actions/trade";
import TradeItem from "../trades/TradeItem";
import NumberFormat from "react-number-format";
import * as moment from "moment";

const Dboard = ({ getTrades, trade: { trades } }) => {
  useEffect(() => {
    getTrades();
  }, [getTrades]);
  let filteredTrades = [];
  let totals = {
    wins: 0,
    losses: 0,
    profit: 0,
  };
  const processTrades = (tradesList) => {
    tradesList.map((trade) => {
      totals.profit += trade.totals.profit;
      trade.totals.profit > 0 ? totals.wins++ : totals.losses++;
    });
    console.log(totals);
  };
  if (trades) {
    // const startWeek = new Date(moment().startOf("week").format("YYYY-MM-DD"));
    let startWeek = moment().startOf("week");
    filteredTrades = trades
      .filter(function (item) {
        let itemDate = new Date(item.close.date);
        return itemDate > startWeek;
      })
      .sort((a, b) => new Date(b.close.date) - new Date(a.close.date));
    processTrades(filteredTrades);
    console.log(filteredTrades);
  }
  return (
    <Fragment>
      <div className="h-screen">
        <header className="at-header">
          <div className="at-header-inner">
            <h1 className="text-3xl font-light leading-tight text-gray-900">
              This Week
            </h1>
          </div>
        </header>
        <main>
          <div className="flex flex-wrap max-w-7xl mx-auto pt-6 pb-0 px-2 sm:px-4 lg:px-6">
            <div className="w-full md:w-1/3 md:mb-0 px-2">
              <div className="shadow bg-white px-6 py-4 rounded">
                <div className="uppercase text-gray-400 text-sm font-semibold mb-2">
                  Realized profit/loss
                </div>
                <div
                  className={`whitespace-no-wrap text-3xl ${
                    totals.profit > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <NumberFormat
                    value={parseFloat(totals.profit.toFixed(2))}
                    displayType={"text"}
                    thousandSeparator={true}
                    allowLeadingZeros={false}
                    prefix={"$"}
                    fixedDecimalScale={true}
                    decimalScale="2"
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 md:mb-0 px-2">
              <div className="shadow bg-white px-6 py-4 rounded">
                <div className="uppercase text-gray-400 text-sm font-semibold mb-2">
                  Wins/Losses
                </div>
                <div className="whitespace-no-wrap text-3xl text-gray-200">
                  <span
                    className={` ${totals.wins > 0 ? "text-green-500" : null} `}
                  >
                    {totals.wins}
                  </span>
                  {" / "}
                  <span
                    className={` ${totals.losses > 0 ? "text-red-500" : null} `}
                  >
                    {totals.losses}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 md:mb-0 px-2">
              <div className="shadow bg-white p-6 rounded">1</div>
            </div>
          </div>

          <div className="flex flex-col max-w-7xl mx-auto py-6 px-4 sm:px-4 lg:px-6">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="at-tableheader">Info</th>
                      <th className="at-tableheader">Bul/Sell (Qty)</th>
                      <th className="at-tableheader">Open</th>
                      <th className="at-tableheader">Close</th>
                      <th className="at-tableheader text-right">Profit/Loss</th>
                      <th className="at-tableheader"></th>
                      <th className="at-tableheader"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTrades.length == 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center bg-white">
                          waiting...
                        </td>
                      </tr>
                    ) : filteredTrades ? (
                      filteredTrades.map((trade) => (
                        <TradeItem key={trade._id} trade={trade} />
                      ))
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Fragment>
  );
};

Dboard.propTypes = {
  getTrades: PropTypes.func.isRequired,
  trade: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  trade: state.trade,
});
export default connect(mapStateToProps, { getTrades })(Dboard);

// at-tableheader
