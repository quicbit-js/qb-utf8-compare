// Software License Agreement (ISC License)
//
// Copyright (c) 2017, Matthew Voss
//
// Permission to use, copy, modify, and/or distribute this software for
// any purpose with or without fee is hereby granted, provided that the
// above copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

var test = require('test-kit').tape()
var utf8 = require('qb-utf8-ez')
var cmp = require('.')

test('codepoint', function (t) {
  t.table_assert([
        [ 'src', 'off', 'lim', 'idx', 'exp' ],

        // ASCII
        [ ' ', 0, 1, 0, '0x20' ],
        [ 'a', 0, 1, 0, '0x61' ],
        [ 'abc', 0, 3, 0, '0x61' ],
        [ 'abc', 0, 3, 1, '0x62' ],
        [ 'abc', 0, 3, 2, '0x63' ],

        // 2-byte min value  (11000000 10000000)
        [ [0xC0, 0x80], 0, 2, 0, '0x0' ],
        [ [0xC0, 0x80], 0, 2, 1, '0x0' ],
        // 2 byte max value (11011111 10111111)
        [ [0xDF, 0xBF], 0, 2, 0, '0x7FF' ],
        [ [0xDF, 0xBF], 0, 2, 1, '0x7FF' ],

        // 3 byte min value  (11100000 10000000 10000000)
        [ [0xE0, 0x80, 0x80], 0, 3, 0, '0x0' ],
        [ [0xE0, 0x80, 0x80], 0, 3, 1, '0x0' ],
        [ [0xE0, 0x80, 0x80], 0, 3, 2, '0x0' ],
        // 3 byte max value (11101111 10111111 10111111)
        [ [0xEF, 0xBF, 0xBF], 0, 3, 0, '0xFFFF' ],
        [ [0xEF, 0xBF, 0xBF], 0, 3, 1, '0xFFFF' ],
        [ [0xEF, 0xBF, 0xBF], 0, 3, 2, '0xFFFF' ],

        // 4 byte min value  (11110000 10000000 10000000 10000000)
        [ [0xF0, 0x80, 0x80, 0x80], 0, 4, 0, '0x0' ],
        [ [0xF0, 0x80, 0x80, 0x80], 0, 4, 1, '0x0' ],
        [ [0xF0, 0x80, 0x80, 0x80], 0, 4, 2, '0x0' ],
        [ [0xF0, 0x80, 0x80, 0x80], 0, 4, 3, '0x0' ],
        // 4 byte max value (11110111 10111111 10111111 10111111)
        [ [0xF7, 0xBF, 0xBF, 0xBF], 0, 4, 0, '0x1FFFFF' ],
        [ [0xF7, 0xBF, 0xBF, 0xBF], 0, 4, 1, '0x1FFFFF' ],
        [ [0xF7, 0xBF, 0xBF, 0xBF], 0, 4, 2, '0x1FFFFF' ],
        [ [0xF7, 0xBF, 0xBF, 0xBF], 0, 4, 3, '0x1FFFFF' ],

        // 3-byte
        [ '吃飲', 0, 6, 0, '0x5403' ],
        [ '吃飲', 0, 6, 1, '0x5403' ],
        [ '吃飲', 0, 6, 2, '0x5403' ],
        [ '吃飲', 0, 6, 3, '0x98F2' ],
        [ '吃飲', 0, 6, 4, '0x98F2' ],
        [ '吃飲', 0, 6, 5, '0x98F2' ]

  ], function (src, off, lim, idx) {
    src = typeof src === 'string' ? utf8.buffer(src) : src
    var cp = cmp.codepoint(src, off, lim, idx)
    return '0x' + cp.toString(16).toUpperCase()
  })
})

test('codepoint errors', function (t) {
  t.table_assert([
        [ 'src', 'off', 'lim', 'idx', 'exp' ],
        [ [0xF7, 0xBF, 0xBF, 0xBF], 0, 3, 0, /bytes don.t fit in range: 0..3/],
        [ [0xF7, 0xBF, 0xBF, 0xBF], 1, 4, 1, /no UTF8 starting byte in range: 1..1/]
  ], function (src, off, lim, idx) {
    src = typeof src === 'string' ? utf8.buffer(src) : src
    return cmp.codepoint(src, off, lim, idx)
  }, { assert: 'throws' })
})

test('compare', function (t) {
  t.table_assert([
        [ 'src1', 'off1', 'lim1', 'src2', 'off2', 'lim2', 'exp' ],
        [ 'abcd', 0, 4, 'abcd', 0, 4, 0 ],
        [ 'abcd', 1, 4, 'abcd', 0, 4, 1 ],
        [ 'abcd', 0, 4, 'abcd', 1, 4, -1 ],

        // all else equal, longer means greater
        [ 'abcd', 0, 4, 'abcd', 0, 3, 1 ],
        [ 'abcd', 0, 3, 'abcd', 0, 4, -1 ],
        [ 'abc', 0, 3, 'abc飲', 0, 6, -1 ],
        [ 'abc飲', 0, 6, 'abc', 0, 3, 1 ],

        [ 'ab 吃', 0, 6, 'ab 飲', 0, 6, -1 ],
        [ 'ab 飲', 0, 6, 'ab 吃', 0, 6, 1 ],

        [ '吃飲，好吃', 0, 15, '吃飲，好吃', 0, 15, 0 ],
        [ '吃飲，好吃!', 0, 16, '吃飲，好吃!', 0, 15, 1 ],
        [ '吃飲，好吃!', 0, 15, '吃飲，好吃', 0, 16, -1 ]

  ], function (src1, off1, lim1, src2, off2, lim2) {
    return cmp(utf8.buffer(src1), off1, lim1, utf8.buffer(src2), off2, lim2)
  })
})

test('compare errors', function (t) {
  t.table_assert([
        [ 'src1', 'off1', 'lim1', 'src2', 'off2', 'lim2', 'exp' ],
        [ 'abcd', 0, 0, 'abcd', 0, 4, /bad range/ ]

  ], function (src1, off1, lim1, src2, off2, lim2) {
    return cmp(utf8.buffer(src1), off1, lim1, utf8.buffer(src2), off2, lim2)
  }, { assert: 'throws' })
})
