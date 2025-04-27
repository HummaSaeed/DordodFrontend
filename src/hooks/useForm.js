import { useState, useCallback } from 'react';

export const useForm = (initialState = {}, onSubmit = () => {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
      // Reset form after successful submission
      setValues(initialState);
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors
  };
}; 