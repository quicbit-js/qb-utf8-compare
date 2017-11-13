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

function compare (src1, off1, lim1, src2, off2, lim2) {
    lim1 > off1 && lim2 > off2 && off1 >= 0 && lim1 > 0 && off2 >= 0 && lim2 > 0 || err('bad range')
    var len1 = lim1 - off1
    var len2 = lim2 - off2
    var n = len1 < len2 ? len1 : len2
    var i = 0
    while (i < n && src1[i + off1] === src2[i + off2]) { i++ }
    if (i === n) {
        return len1 === len2 ? 0 : (len1 > len2 ? 1 : -1)
    } else {
        return codepoint(src1, off1, lim1, i + off1) > codepoint(src2, off2, lim2, i + off2) ? 1 : -1
    }
}

function err (msg) { throw Error (msg) }

// figure out the codepoint at the given index 'idx' of a UTF8 encoded character by
//  1   finding the index of the starting byte
//  2   reading the supposed byte length length from the starting byte
//  3   adding values of subsequent bytes
//
//  if the character is not complete (falls outside of off/lim) throw error
function codepoint (src, off, lim, idx) {
    var i = idx
    switch (src[i] & 0xC0) {
        case 0x00:                              // 00xxxxxx     // ASCII 0 - 63
        case 0x40:                              // 01xxxxxx     // ASCII 64-127
            return src[i]
        case 0x80:                              // 10xxxxxx     - trailing byte
            // find starting byte
            var min = i - 5                     // limit to largest possible unicode (6 bytes)
            if (min < off) { min = off }
            while (i > min && ((src[i] & 0xC0) === 0x80)) { i-- }
            (src[i] & 0xC0) === 0xC0 || err('no UTF8 starting byte in range: ' + idx + '..' + i )
            // fallthrough...
        case 0xC0:                              // 11xxxxxx     - starting byte
            var c = src[i]
            for (var n = 2; (c << n) & 0x80; n++) {}    // sequential 1's gives is number of bytes: (e.g. 1110xxxx has 3)
            i + n <= lim || err(n + ' indicated UTF8 bytes don\'t fit in range: ' + idx + '..' + lim)
            var ret =  c & (0xFF >> (n+1))       // start with (8 - (n+1)) LSBs
            for (var ni = 1; ni < n; ni++) {
                ret = (ret << 6) | (0x3F & src[i + ni])
            }
            return ret
    }
}

compare.codepoint = codepoint

module.exports = compare


