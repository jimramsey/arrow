import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import { useFormik } from "formik";
import { connect } from "react-redux";
import InputCurrency from "../form-elements/InputCurrency";

const TradeFormOptions = (props) => {
  if (props.tradeType === "option" && props.strategy === "pcs") {
    return (
      <Fragment>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              htmlFor="open.legs[0].expiry"
              className="block text-sm leading-5 font-medium text-gray-700 mb-2"
            >
              Expiry Date
            </label>
            <div className="mb-4">
              <input
                type="date"
                placeholder=""
                name="open.legs[0].expiry"
                value={props.formik.values.open.legs[0].expiry}
                onChange={props.handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <div className="mb-4">
              <label
                htmlFor="open.legs[0].strikePrice"
                className="block text-sm leading-5 font-medium text-gray-700 mb-2"
              >
                Short Strike Price (sell)
              </label>
              <InputCurrency
                name="open.legs[0].strikePrice"
                onchange={props.handleChange}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <div className="mb-4">
              <label
                htmlFor="open.legs[1].strikePrice"
                className="block text-sm leading-5 font-medium text-gray-700 mb-2"
              >
                Long Strike Price (buy)
              </label>
              <InputCurrency
                name="open.legs[1].strikePrice"
                onchange={props.handleChange}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  } else if (
    props.tradeType === "option" &&
    (props.strategy === "csp" || props.strategy === "straddle")
  ) {
    return (
      <Fragment>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label htmlFor="close.date" className="at-label">
              Expiry Date
            </label>
            <div className="mb-4">
              <input
                type="date"
                placeholder=""
                name="open.legs[0].expiry"
                value={props.formik.values.open.legs[0].expiry}
                onChange={props.handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label htmlFor="open.legs[0].strikePrice" className="at-label">
              Strike Price
            </label>
            <InputCurrency
              name="open.legs[0].strikePrice"
              onchange={props.handleChange}
            />
          </div>
        </div>
      </Fragment>
    );
  } else {
    console.log(props);
    return null;
  }
};

TradeFormOptions.propTypes = {};

export default connect()(TradeFormOptions);
