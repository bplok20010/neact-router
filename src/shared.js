'use strict';

var objToString = Object.prototype.toString;

export var isArray = Array.isArray || function(s) {
    return objToString.call(s) === '[object Array]';
};

export function isUndefined(obj) {
    return obj === undefined;
}

export function isNull(obj) {
    return obj === null;
}

export function isNullOrUndef(obj) {
    return isUndefined(obj) || isNull(obj);
}

export function isObject(o) {
    return typeof o === 'object';
}

function trimDots(ary) {
    let i, part;
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

export function normalizeUrl(path, baseName = '/', delimiter = '/') {
    const baseParts = baseName.split(delimiter);

    if (isUndefined(path)) { return path; }

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

export function parsePath(path) {
    var pathname = path || '/';
    var search = '';
    var hash = '';

    var hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex);
        pathname = pathname.substr(0, hashIndex);
    }

    var searchIndex = pathname.indexOf('?');
    if (searchIndex !== -1) {
        search = pathname.substr(searchIndex);
        pathname = pathname.substr(0, searchIndex);
    }

    pathname = decodeURI(pathname);

    return {
        pathname: pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash
    };
}