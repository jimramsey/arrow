import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import TradeItem from "../trades/TradeItem";
import { getTradesByDate, getTotals } from "../../actions/trade";
import NumberFormat from "react-number-format";
import * as moment from "moment";
// import { static } from "express";

const startWeek = moment().startOf("week").format("YYYY-MM-DD");
const endWeek = moment().endOf("week").format("YYYY-MM-DD");

const Trades = ({
  getTotals,
  getTradesByDate,
  trade: { trades, totals, loading },
}) => {
  const [dashboardData, setDashboardData] = useState({
    trades: [],
    wins: 0,
    losses: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    getTotals();
  }, []);

  useEffect(() => {
    getTradesByDate(startWeek, endWeek);
  }, [getTradesByDate, loading]);

  useEffect(() => {
    if (trades) {
      dashboardData.totalProfit = 0;
      dashboardData.wins = 0;
      dashboardData.losses = 0;
      trades.map((trade) => {
        dashboardData.totalProfit += +trade.totals.profit;
        trade.totals.profit > 0 ? dashboardData.wins++ : dashboardData.losses++;
      });
      console.log(dashboardData.totalProfit);
    }
    if (totals) {
      console.log(totals.wins[0].totalWins);
      console.log(totals.losses[0].totalLosses);
      console.log(totals.totals[0].totalProfit);
      console.log(totals.totals[0].totalCount);
    }
  }, [trades]);

  return (
    <Fragment>
      <div className="h-screen">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-light leading-tight text-gray-900">
              This Week{" "}
              {totals ? (
                <NumberFormat
                  value={parseFloat(totals.totals[0].totalProfit).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  allowLeadingZeros={false}
                  prefix={"$"}
                  fixedDecimalScale={true}
                  decimalScale="2"
                />
              ) : null}
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
                    dashboardData.totalProfit > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <NumberFormat
                    value={parseFloat(dashboardData.totalProfit).toFixed(2)}
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
              <div className="shadow bg-white p-6 rounded">
                wins: {dashboardData.wins}
                losses: {dashboardData.losses}
              </div>
            </div>
            <div className="w-full md:w-1/3 md:mb-0 px-2">
              <div className="shadow bg-white p-6 rounded">1</div>
            </div>
          </div>
          <div className="flex flex-col max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Info
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Bul/Sell (Qty)
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Open
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Close
                      </th>

                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Profit/Loss
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading || !trades ? (
                      <tr>
                        <td colSpan="7" className="text-center bg-white">
                          <Spinner />
                        </td>
                      </tr>
                    ) : (
                      trades.map((trade) => (
                        <TradeItem key={trade._id} trade={trade} />
                      ))
                    )}
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

Trades.propTypes = {
  getTradesByDate: PropTypes.func.isRequired,
  getTotals: PropTypes.func.isRequired,
  trade: PropTypes.object.isRequired,
  // totals: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  trade: state.trade,
});

export default connect(mapStateToProps, { getTradesByDate, getTotals })(Trades);
