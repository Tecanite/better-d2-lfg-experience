/**
 * Implementation to get response bodies.
 * by IOL0ol1
 * src: https://github.com/IOL0ol1/GetResponse
 */

(function () {
    if (window.__injectInstalled) return;
    window.__injectInstalled = true;

    var XHR = XMLHttpRequest.prototype;
    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function (postData) {
        this.addEventListener('load', function () {
            window.postMessage({ type: 'xhr', data: this.response }, '*');
        });
        return send.apply(this, arguments);
    };

    const { fetch: origFetch } = window;
    window.fetch = async (...args) => {
        const response = await origFetch(...args);
        response
            .clone()
            .blob()
            .then(data => {
                window.postMessage({ type: 'fetch', data: data }, '*');
            })
            .catch(err => {
                if (debugEnabled) {
                    console.error(err)
                }
            });
        return response;
    };
})();