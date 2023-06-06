const VALID_BROWSER_VERSION = {
    CHROME: 100,
    FIREFOX: 110
};

const getBrowserData = () => {
    const ua = navigator.userAgent;
    let browserName = '';
    let browserVersion = '';

    let match = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(match[1])) {
        const tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        browserName = 'Internet Explorer';
        browserVersion = tem[1] || '';
    } else if (match[1] === 'Chrome') {
        const tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) {
            browserName = tem[1].replace('OPR', 'Opera');
            browserVersion = tem[2] || '';
        } else {
            browserName = match[1];
            browserVersion = match[2];
        }
    } else {
        match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
        const tem = ua.match(/version\/(\d+)/i);
        if (tem != null) {
            match.splice(1, 1, tem[1]);
        }
        browserName = match[0];
        browserVersion = match[1];
    }

    return { name: browserName, version: browserVersion };
};

const checkVersion = () => {
    var browserData = getBrowserData();
    var browserName = browserData.name.toLowerCase();
    var browserVersion = Number(browserData.version);
    var result = true;

    switch (browserName) {
        case 'chrome':
        case 'edge':
            if (browserVersion < VALID_BROWSER_VERSION.CHROME) {
                result = false;
            }
            break;
        case 'firefox':
            if (browserVersion < VALID_BROWSER_VERSION.FIREFOX) {
                result = false;
            }
        default:
            break;
    }

    return result;
};

export { checkVersion, getBrowserData };
