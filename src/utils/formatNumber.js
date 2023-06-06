function formatNumber(numerStr, defaultValue) {
    if (numerStr === 0) return 0;
    if (!numerStr) return defaultValue;
    return parseFloat(numerStr).toLocaleString('en');
}

export default formatNumber;
