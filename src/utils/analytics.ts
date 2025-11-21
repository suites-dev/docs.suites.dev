/**
 * Google Analytics event tracking utility
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event (e.g., 'button_click', 'cta_click')
 * @param params - Additional parameters to send with the event
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track button click events
 * @param buttonName - Name/label of the button clicked
 * @param location - Where the button is located (e.g., 'homepage', 'navbar')
 */
export const trackButtonClick = (
  buttonName: string,
  location: string = 'homepage'
): void => {
  trackEvent('button_click', {
    button_name: buttonName,
    location,
  });
};