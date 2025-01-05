/**
 * Utility function to round fields in an aggregation pipeline.
 * @param {string[]} fields - Array of field names to round.
 * @returns {Object} - MongoDB $addFields stage for rounding specified fields.
 */
const roundFields = (fields) => ({
    $addFields: fields.reduce((acc, field) => {
        acc[field] = { $round: [`$${field}`, 2] };
        return acc;
    }, {})
});

module.exports = {
    roundFields
};
