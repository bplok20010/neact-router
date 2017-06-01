'use strict';

var dots = '/'.split('/');
trimDots(dots);
console.log(dots.join('/'));

//1.
console.log(normalizePath('./hans', '/test/nobo') === '/test/nobo/hans');
//2.
console.log(normalizePath('../hans', '/test/nobo') === '/test/hans');
//2.1
console.log(normalizePath('../../../hans', '/test/nobo') === '/hans');
//3.
console.log(normalizePath('hans', '/test/nobo') === '/test/nobo/hans');
//4.
console.log(normalizePath('/hans', '/test/nobo') === '/hans');
//4.1
console.log(normalizePath('../../../../hans', 'test/nobo') === 'hans');
//5
console.log(normalizePath('/', '') === '/');
//5.1
console.log(normalizePath('', '/') === '/');
//5.2
console.log(normalizePath('/', '/') === '/');
//5.3
console.log(normalizePath('', '') === '');
//5.4
console.log(normalizePath('./', '/') === '/');
//5.5
console.log(normalizePath('../', '/') === '/');

function normalizePath(path, pathname) {
    var delimiter = '/';
    var baseName = pathname;
    var baseParts = baseName && baseName.split(delimiter);

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
        path = pathname + path;
    }

    return path;
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