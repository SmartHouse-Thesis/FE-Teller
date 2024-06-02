import React, { useState } from "react";

const FloatLabel = (props) => {
    const [focus, setFocus] = useState(false);
    let { children, label, value, onChange, placeholder, required } = props;
  
    if (!placeholder) placeholder = label;
  
    const isOccupied = focus || (value && value.length !== 0);
  
    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";
  
    const requiredMark = required ? <span className="text-danger">*</span> : null;
  
    return (
      <div
        className="float-label"
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
      >
        {React.cloneElement(children, { value, onChange })}
        <label className={labelClass}>
          {isOccupied ? label : placeholder} {requiredMark}
        </label>
      </div>
    );
  };
  
  export default FloatLabel;