import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import NumberFormat from "react-number-format";
import Trades from "../../components/trades/Trades";
import { getTrades } from "../../actions/trade";

const Dashboard = ({ getTrades, trade: { trades } }) => {
  const [dashboardData, setDashboardData] = useState({
    trades: [],
    wins: 0,
    losses: 0,
    totalProfit: 0,
  });

  /*
  useEffect(() => {
    getTrades();
    if (trades) {
      setTotals(trades);
    }
  }, [getTrades]);
  const setTotals = (trades) => {
    trades.forEach((trade) => {
      if (trade.totals.profit < 0) {
        dashboardData.losses++;
      } else {
        dashboardData.wins++;
      }
      dashboardData.totalProfit += trade.totals.profit;
    });
    
  };
  */
  /*
  useEffect(() => {
    getTrades();
    if (trades) {
      setTotals(trades);
    }
  }, []);
*/
  return (
    <div>
      <Fragment>
        <div className="h-screen">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-light leading-tight text-gray-900">
                Dashboard{" "}
                <NumberFormat
                  value={dashboardData.totalProfit}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                  fixedDecimalScale={true}
                  decimalScale="2"
                />
              </h1>
            </div>
          </header>
          <main>
            <div className="flex flex-col max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200"></div>
              </div>
            </div>
          </main>
        </div>
      </Fragment>
    </div>
  );
};

Dashboard.propTypes = {
  getTrades: PropTypes.func.isRequired,
  trade: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  trade: state.trade,
});

export default connect(mapStateToProps, { getTrades })(Dashboard);
