import React from "react";
import { Form } from "react-bootstrap";

const InputField = ({
  label,
  name,
  value,
  placeholder = "",
  type = "text",
  isRequired = false,
  onChange,
  as = "input",
  options = [],
  disabled = false,
}) => {
  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label style={{ fontFamily: "Poppins", fontSize: "16px" }}>
          {label}
        </Form.Label>
      )}
      {as === "select" ? (
        <Form.Select
          name={name}
          value={value}
          onChange={onChange}
          required={isRequired}
          disabled={disabled}
          style={{ fontFamily: "Poppins" }}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          as={as}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={isRequired}
          onChange={onChange}
          disabled={disabled}
          style={{ fontFamily: "Poppins" }}
        />
      )}
    </Form.Group>
  );
};

export default InputField;
