/**
 * Utility functions for IP address validation.
 */

/**
 * Checks if the given IP address is valid.
 *
 * @param {string} ip - The IP address to validate.
 * @returns {boolean} - Returns true if the IP address is valid, otherwise false.
 */
export const isValidIP = (ip) => {
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipPattern.test(ip);
};

/**
 * Checks if the given subnet mask is valid.
 *
 * @param {string} mask - The subnet mask to validate.
 * @returns {boolean} - Returns true if the subnet mask is valid, otherwise false.
 */
export const isValidSubnetMask = (mask) => {
  const maskPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  return maskPattern.test(mask);
};
