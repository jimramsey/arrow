import React, { Fragment } from "react";

const InputCurrency = (props) => {
  return (
    <Fragment>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
        </div>
        <input
          id="price"
          name={props.name}
          className="form-input block w-full pl-7 pr-12"
          placeholder="0.00"
          onChange={props.onchange}
        />
      </div>
    </Fragment>
  );
};

export default InputCurrency;
