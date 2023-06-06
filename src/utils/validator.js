/**
 * Validate that the input value is not empty or only contains whitespace characters.
 *
 * @param {Object} rule - The validation rule object in antd.
 * @param {String} value - The value to validate.
 * @param {function} callback - Function, the callback function to trigger upon validation completion.
 */
export const notBeEmpty = (rule, value, callback) => {
    if (value && value.trim() === '') {
        callback(`${rule.field} must not be empty`);
    } else {
        callback();
    }
};