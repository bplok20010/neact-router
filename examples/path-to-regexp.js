'use strict';

var pathToRegexp = require('path-to-regexp');

var patternCache = {};
var cacheLimit = 10000;
var cacheCount = 0;

var compilePath = function compilePath(pattern, options) {
    var cacheKey = '' + options.end + options.strict;
    var cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

    if (cache[pattern]) return cache[pattern];

    var keys = [];
    var re = pathToRegexp(pattern, keys, options);
    var compiledPattern = { re: re, keys: keys };

    if (cacheCount < cacheLimit) {
        cache[pattern] = compiledPattern;
        cacheCount++;
    }

    return compiledPattern;
};

/**
 * Public API for matching a URL pathname to a path pattern.
 */
var matchPath = function matchPath(pathname) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof options === 'string') options = { path: options };

    var _options = options,
        _options$path = _options.path,
        path = _options$path === undefined ? '/' : _options$path,
        _options$exact = _options.exact,
        exact = _options$exact === undefined ? false : _options$exact,
        _options$strict = _options.strict,
        strict = _options$strict === undefined ? false : _options$strict;

    var _compilePath = compilePath(path, { end: exact, strict: strict }),
        re = _compilePath.re,
        keys = _compilePath.keys;

    var match = re.exec(pathname);

    if (!match) return null;

    var url = match[0],
        values = match.slice(1);

    var isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
        path: path, // the path pattern used to match
        url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
        isExact: isExact, // whether or not we matched exactly
        params: keys.reduce(function(memo, key, index) {
            memo[key.name] = values[index];
            return memo;
        }, {})
    };
};

var r = matchPath('/t1/fa/f/f/c/ms.jpg', {
    path: '/:teea*/f'
});

console.log(r);

module.exports = matchPath;