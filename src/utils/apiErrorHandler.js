export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 401:
        return 'Please login again';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.response.data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection';
  } else {
    // Other errors
    return 'An unexpected error occurred';
  }
}; 