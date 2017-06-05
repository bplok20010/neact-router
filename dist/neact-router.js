(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('neact')) :
	typeof define === 'function' && define.amd ? define(['exports', 'neact'], factory) :
	(factory((global.NeactRouter = global.NeactRouter || {}),global.Neact));
}(this, (function (exports,Neact) { 'use strict';

/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var __DEV__ = "production" !== 'production';

var warning = function () {};

if (__DEV__) {
  warning = function (condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error('The warning format should be able to uniquely identify this ' + 'warning. Please, use a more descriptive format than: ' + format);
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    }
  };
}

var warning_1 = warning;

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

































var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};



















var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)',
// Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options));
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (_typeof(tokens[i]) === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue;
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue;
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined');
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
        }

        if (value.length === 0) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
      }

      path += token.prefix + segment;
    }

    return path;
  };
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys(re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags(options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys);
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */keys);
  }

  if (index$1(path)) {
    return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
  }

  return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

var patternCache = {};
var cacheLimit = 10000;
var cacheCount = 0;

var compilePath = function (pattern, options) {
    var cacheKey = '' + options.end + options.strict;
    var cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

    if (cache[pattern]) {
        return cache[pattern];
    }

    var keys = [];
    var re = index(pattern, keys, options);
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
var matchPath = function (pathname) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof options === 'string') {
        options = { path: options };
    }

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

    if (!match) {
        return null;
    }

    var _match = toArray(match),
        url = _match[0],
        values = _match.slice(1);

    var isExact = pathname === url;

    if (exact && !isExact) {
        return null;
    }

    return {
        path: path, // the path pattern used to match
        url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
        isExact: isExact, // whether or not we matched exactly
        params: keys.reduce(function (memo, key, index$$1) {
            memo[key.name] = values[index$$1];
            return memo;
        }, {})
    };
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$3 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var objToString = Object.prototype.toString;

var isArray = Array.isArray || function (s) {
    return objToString.call(s) === '[object Array]';
};

function isUndefined(obj) {
    return obj === undefined;
}

function isNull(obj) {
    return obj === null;
}

function isNullOrUndef(obj) {
    return isUndefined(obj) || isNull(obj);
}

function isObject(o) {
    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object';
}

function trimDots(ary) {
    var i = void 0,
        part = void 0;
    for (i = 0; i < ary.length; i++) {
        part = ary[i];

        if (part === '' && i > 0 || part === '.') {
            ary.splice(i, 1);
            i -= 1;
        } else if (part === '..') {
            if (i === 0) {
                ary.splice(0, 1);
                i = -1;
            } else if (i === 1 && ary[0] === '') {
                ary.splice(i, 1);
                i -= 1;
            } else {
                ary.splice(i - 1, 2);
                i -= 2;
            }
        }
    }
}

function normalizeUrl(path) {
    var baseName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
    var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';

    var baseParts = baseName.split(delimiter);

    if (isUndefined(path)) {
        return path;
    }

    if (path) {
        path = path.split(delimiter);

        if (path[0].charAt(0) === '.' || path[0] !== '') {
            path = baseParts.concat(path);
        }

        trimDots(path);

        if (path.length === 1 && path[0] === '') {
            path.push('');
        }

        path = path.join(delimiter);
    } else {
        path = baseName + path;
    }

    return path;
}

var Route = Neact.createClass({
    construct: function (props, context) {
        this.normalizePath(props, context);

        this.state.match = this.computeMatch(props, context.router);
    },
    normalizePath: function (props, context) {
        var router = context.router;
        var baseUrl = router.route.match ? router.route.match.url : '/';

        props.path = normalizeUrl(props.path, baseUrl);
    },
    computeMatch: function (_ref, _ref2) {
        var location = _ref.location,
            path = _ref.path,
            strict = _ref.strict,
            exact = _ref.exact,
            computedMatch = _ref.computedMatch;
        var route = _ref2.route;

        if (computedMatch) {
            return computedMatch;
        }

        var pathname = (location || route.location).pathname;

        return path ? matchPath(pathname, { path: path, strict: strict, exact: exact }) : route.match;
    },
    getChildContext: function () {
        return {
            router: index$3({}, this.context.router, {
                route: {
                    location: this.props.location || this.context.router.route.location,
                    match: this.state.match
                }
            })
        };
    },
    componentWillMount: function () {
        var _props = this.props,
            component = _props.component,
            render = _props.render,
            children = _props.children;


        warning_1(!(component && render), 'You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored');

        warning_1(!(component && children), 'You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored');

        warning_1(!(render && children), 'You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored');
    },
    componentWillReceiveProps: function (nextProps, nextContext) {
        warning_1(!(nextProps.location && !this.props.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.');

        warning_1(!(!nextProps.location && this.props.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.');

        this.normalizePath(nextProps, nextContext);

        this.setState({
            match: this.computeMatch(nextProps, nextContext.router)
        });
    },
    render: function () {
        var match = this.state.match;
        var _props2 = this.props,
            children = _props2.children,
            component = _props2.component,
            render = _props2.render;
        var _context$router = this.context.router,
            history = _context$router.history,
            route = _context$router.route,
            staticContext = _context$router.staticContext;

        var location = this.props.location || route.location;
        var props = { match: match, location: location, history: history, staticContext: staticContext };

        return component ? // component prop gets first priority, only called if there's a match
        match ? Neact.createElement(component, props, children) : null : render ? // render prop is next, only called if there's a match
        match ? render(props) : null : children ? // children come last, always called
        typeof children === 'function' ? children(props) : !isArray(children) || children.length ? // Preact defaults to empty children array
        Neact.Children.only(children) : null : null;
    }
});

var Router = Neact.createClass({
    construct: function (props) {
        if (!props.history) {
            throw new TypeError('history must be required!');
        }

        this.state.match = this.computeMatch(props.history.location.pathname);
    },
    getChildContext: function () {
        return {
            router: index$3({}, this.context.router, {
                history: this.props.history,
                route: {
                    location: this.props.history.location,
                    match: this.state.match
                }
            })
        };
    },
    computeMatch: function (pathname) {
        return {
            path: '/',
            url: '/',
            params: {},
            isExact: pathname === '/'
        };
    },
    render: function () {
        var children = this.props.children;

        return children ? Neact.Children.only(children) : null;
    },
    componentWillMount: function () {
        var _this = this;

        var _props = this.props,
            children = _props.children,
            history = _props.history;


        this.unlisten = history.listen(function () {
            _this.setState({
                match: _this.computeMatch(history.location.pathname)
            });
        });
    },
    componentWillReceiveProps: function (nextProps) {
        warning_1(this.props.history === nextProps.history, 'You cannot change <Router history>');
    },
    componentWillUnmount: function () {
        this.unlisten();
    }
});

var isModifiedEvent = function (event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

var Link = Neact.createClass({
    handleClick: function (event) {
        if (this.props.onClick) {
            this.props.onClick(event);
        }

        if (!event.defaultPrevented && // onClick prevented default
        event.button === 0 && // ignore right clicks
        !this.props.target && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
                event.preventDefault();

                var _context$router = this.context.router,
                    history = _context$router.history,
                    route = _context$router.route;

                var baseUrl = route.match ? route.match.url : '/';
                var _props = this.props,
                    replace = _props.replace,
                    to = _props.to;


                if (typeof to === 'string') {
                    to = { pathname: to };
                }

                to.pathname = normalizeUrl(to.pathname || '/', baseUrl);

                if (replace) {
                    history.replace(to);
                } else {
                    history.push(to);
                }
            }
    },
    render: function () {
        var _this = this;

        var _props2 = this.props,
            replace = _props2.replace,
            to = _props2.to,
            props = objectWithoutProperties(_props2, ['replace', 'to']);

        var baseUrl = this.context.router.route.match ? this.context.router.route.match.url : '/';

        if (typeof to === 'string') {
            to = { pathname: to };
        }

        to.pathname = normalizeUrl(to.pathname || '/', baseUrl);

        var href = this.context.router.history.createHref(typeof to === 'string' ? { pathname: to } : to);

        return Neact.createElement('a', index$3({}, props, {
            onClick: function (e) {
                return _this.handleClick(e);
            },
            href: href
        }));
    }
});

Link.defaultProps = {
    replace: false
};

var Switch = Neact.createClass({
    componentWillReceiveProps: function (nextProps) {
        warning_1(!(nextProps.location && !this.props.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.');

        warning_1(!(!nextProps.location && this.props.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.');
    },
    render: function () {
        var route = this.context.router.route;
        var children = this.props.children;

        var location = this.props.location || route.location;
        var baseName = route.match ? route.match.url : '/';

        var match = void 0,
            child = void 0;
        Neact.Children.forEach(children, function (element) {
            if (!Neact.isValidElement(element)) {
                return;
            }

            var _element$props = element.props,
                pathProp = _element$props.path,
                exact = _element$props.exact,
                strict = _element$props.strict,
                from = _element$props.from;

            var path = pathProp || from;

            if (isNullOrUndef(match)) {
                child = element;
                match = path ? matchPath(location.pathname, { path: normalizeUrl(path, baseName), exact: exact, strict: strict }) : route.match;
            }
        });

        child.props = index$3(child.props || (child.props = {}), { location: location, computedMatch: match });

        return match ? child : null;
    }
});

var NavLink = function (_ref) {
    var to = _ref.to,
        exact = _ref.exact,
        strict = _ref.strict,
        activeClassName = _ref.activeClassName,
        className = _ref.className,
        activeStyle = _ref.activeStyle,
        style = _ref.style,
        getIsActive = _ref.isActive,
        rest = objectWithoutProperties(_ref, ['to', 'exact', 'strict', 'activeClassName', 'className', 'activeStyle', 'style', 'isActive']);
    return Neact.createElement(Route, {
        path: isObject(to) ? to.pathname : to,
        exact: exact,
        strict: strict,
        children: function (_ref2) {
            var location = _ref2.location,
                match = _ref2.match;

            var isActive = !!(getIsActive ? getIsActive(match, location) : match);

            return Neact.createElement(Link, index$3({}, rest, {
                to: to,
                className: isActive ? [activeClassName, className].join(' ') : className,
                style: isActive ? index$3({}, style, activeStyle) : style
            }));
        }
    });
};

NavLink.defaultProps = {
    activeClassName: 'active'
};

var Redirect = Neact.createClass({
    isStatic: function () {
        return this.context.router && this.context.router.staticContext;
    },
    componentWillMount: function () {
        if (this.isStatic()) {
            this.perform();
        }
    },
    componentDidMount: function () {
        if (!this.isStatic()) {
            this.perform();
        }
    },
    perform: function () {
        var history = this.context.router.history;
        var _props = this.props,
            push = _props.push,
            to = _props.to;
        //setTimeout(() => {

        if (push) {
            history.push(to);
        } else {
            history.replace(to);
        }
        //}, 0);
    },
    render: function () {
        return null;
    }
});

Redirect.displayName = "Redirect";

Redirect.defaultProps = {
    push: false
};

exports.Route = Route;
exports.Router = Router;
exports.Link = Link;
exports.Switch = Switch;
exports.NavLink = NavLink;
exports.Redirect = Redirect;

})));
//# sourceMappingURL=neact-router.js.map
