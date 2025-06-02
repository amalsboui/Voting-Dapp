// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// src/setupTests.js
afterEach(async () => {
  // Close Web3 connections
  if (window.ethereum) {
    // MetaMask doesn't have disconnect method, just clear listeners
    window.ethereum.removeAllListeners?.();
  }
  if (global.web3) {
    global.web3.currentProvider?.removeAllListeners?.();
  }
  
  // Clear all timers
  const timerCount = jest.getTimerCount();
  if (timerCount > 0) {
    jest.runAllTimers();
    jest.useRealTimers();
  }
});