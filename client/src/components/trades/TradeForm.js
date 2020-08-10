import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useFormik } from "formik";
// import Moment from "react-moment";
import InputCurrency from "../form-elements/InputCurrency";
import { addTrade } from "../../actions/trade";
import TradeFormOptions from "./TradeFormOptions";

var todayDate = new Date().toISOString().slice(0, 10);

const TradeForm = ({ addTrade, history }) => {
  const formik = useFormik({
    initialValues: {
      company: "",
      brokerageAcct: "5f208747501a6365e84a0a5e",
      tradeType: { type: "option", strategy: "csp" },
      status: false,
      buySell: "sell",
      quantity: 1,
      open: {
        date: todayDate,
        price: 0,
        fees: 0,
        legs: [{ strikePrice: 0, expiry: todayDate }],
      },
      close: {
        date: todayDate,
        price: 0,
        fees: 0,
        legs: [{ strikePrice: 0, expiry: todayDate }],
      },
      notes: "",
    },
    onSubmit: (values) => {
      // e.preventDefault();
      addTrade(values, history);
    },
  });

  return (
    <div className="h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-light leading-tight text-gray-900">
            Add a Trade
          </h1>
        </div>
      </header>
      <main>
        <div className="flex flex-col max-w-7xl w-2/3 mx-auto py-6 px-12 sm:px-6 lg:px-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200 px-6">
              <form className="mt-8" onSubmit={formik.handleSubmit}>
                <div className="w-full mb-4">
                  <label htmlFor="tradeType.strategy" className="at-label">
                    Trade Type
                  </label>
                  <div className="inline-block relative w-full">
                    <select
                      name="tradeType.strategy"
                      onChange={formik.handleChange}
                      className="block appearance-none w-full bg-white border hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="csp">Cash-Secured Put</option>
                      <option value="pcs">Put Credit Spread</option>
                      <option value="straddle">Straddle</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <input
                    type="hidden"
                    name="buySell"
                    onChange={formik.handleChange}
                    value={
                      formik.values.tradeType.strategy === "straddle"
                        ? (formik.values.buySell = "buy")
                        : (formik.values.buySell = "sell")
                    }
                  />
                </div>

                <div className="flex flex-wrap -mx-3">
                  <div className="w-full md:w-2/3 px-3 md:mb-0">
                    <div className="mb-4">
                      <label htmlFor="company" className="at-label">
                        Ticker Symbol
                      </label>
                      <input
                        type="text"
                        placeholder="AAPL"
                        name="company"
                        onChange={formik.handleChange}
                        value={formik.values.company}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <div className="mb-4">
                      <label
                        htmlFor="compquantityany"
                        className="block text-sm leading-5 font-medium text-gray-700 mb-2"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="Qty"
                        name="quantity"
                        onChange={formik.handleChange}
                        value={formik.values.quantity}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                </div>
                <TradeFormOptions
                  tradeType={formik.values.tradeType.type}
                  strategy={formik.values.tradeType.strategy}
                  formik={formik}
                  handleChange={formik.handleChange}
                />

                <hr className="my-5" />
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/2 px-3 md:mb-0">
                    <label htmlFor="open.date" className="at-label">
                      Open Date
                    </label>
                    <div className="mb-4">
                      <input
                        type="date"
                        placeholder=""
                        name="open.date"
                        value={formik.values.open.date}
                        onChange={formik.handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="open.price" className="at-label">
                        Opening Price
                      </label>
                      <InputCurrency
                        name="open.price"
                        onchange={formik.handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="open.fees" className="at-label">
                        Opening Fees
                      </label>
                      <InputCurrency
                        name="open.fees"
                        onchange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-3 md:mb-0">
                    <label htmlFor="close.date" className="at-label">
                      Close Date
                    </label>
                    <div className="mb-4">
                      <input
                        type="date"
                        placeholder=""
                        name="close.date"
                        value={formik.values.close.date}
                        onChange={formik.handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="close.price" className="at-label">
                        Closing Price
                      </label>
                      <InputCurrency
                        name="close.price"
                        onchange={formik.handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="close.fees" className="at-label">
                        Closing Fees
                      </label>
                      <InputCurrency
                        name="close.fees"
                        onchange={formik.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <hr className="my-5" />
                <div className="mb-4">
                  <textarea
                    placeholder="Notes"
                    name="notes"
                    onChange={formik.handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-blue">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/*



                  
                  <InputCurrency
                    name="open.price"
                    onchange={(e) => onChange(e)}
                  />

<div className="mb-4">
                  <div className="inline-block relative w-64">
                    <select
                      name="buySell"
                      onChange={formik.handleChange}
                      className="block appearance-none w-full bg-white border hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

<div className="mb-4">
                  <div className="inline-block relative w-64">
                    <select
                      name="tradeType.type"
                      onChange={formik.handleChange}
                      className="block appearance-none w-full bg-white border hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="option">Option</option>
                      <option value="stock">Stock</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
*/

TradeForm.propTypes = {
  addTrade: PropTypes.func.isRequired,
};

export default connect(null, { addTrade })(TradeForm);
