export const trackEvent = (eventName, properties = {}) => {
  // Integrate with your analytics service (Google Analytics, Mixpanel, etc.)
  console.log('Track Event:', eventName, properties);
};

export const trackPageView = (pageName) => {
  // Track page views
  console.log('Page View:', pageName);
}; 