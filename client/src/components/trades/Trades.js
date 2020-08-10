import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import TradeItem from "./TradeItem";
import TradeForm from "./TradeForm";
import { getTrades } from "../../actions/trade";

const Trades = ({ getTrades, trade: { trades, loading } }) => {
  useEffect(() => {
    getTrades();
  }, [getTrades, loading]);

  return (
    <Fragment>
      <div className="h-screen">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-light leading-tight text-gray-900">
              Trades
            </h1>
          </div>
        </header>
        <main>
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
                        Bul/Sell
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
  getTrades: PropTypes.func.isRequired,
  trade: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  trade: state.trade,
});

export default connect(mapStateToProps, { getTrades })(Trades);
