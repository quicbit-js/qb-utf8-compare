# qb-utf8-compare

[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![dependencies][proddep-image]][proddep-link]
[![dev dependencies][devdep-image]][devdep-link]
[![code analysis][code-image]][code-link]

[npm-image]:       https://img.shields.io/npm/v/qb-utf8-compare.svg
[downloads-image]: https://img.shields.io/npm/dm/qb-utf8-compare.svg
[npm-url]:         https://npmjs.org/package/qb-utf8-compare
[proddep-image]:   https://www.bithound.io/github/quicbit-js/qb-utf8-compare/badges/dependencies.svg
[proddep-link]:    https://www.bithound.io/github/quicbit-js/qb-utf8-compare/master/dependencies/npm
[devdep-image]:    https://www.bithound.io/github/quicbit-js/qb-utf8-compare/badges/devDependencies.svg
[devdep-link]:     https://www.bithound.io/github/quicbit-js/qb-utf8-compare/master/dependencies/npm
[code-image]:      https://www.bithound.io/github/quicbit-js/qb-utf8-compare/badges/code.svg
[code-link]:       https://www.bithound.io/github/quicbit-js/qb-utf8-compare

Compare selections of UTF8 bytes directly and without creating javascript strings.  

This is significantly more efficient than using strings for long or large numbers of buffer selections.

**Complies with the 100% test coverage and minimum dependency requirements** of 
[qb-standard](http://github.com/quicbit-js/qb-standard) . 

# Install:

    npm install qb-utf8-compare
    
# Usage

## compare( [src1][src-link], [off1][off-link], [lim1][lim-link],[src2][src-link], [off2][off-link], [lim2][lim-link] )

Compare code points of two byte ranges holding UTF8-encoded data.  The function works similarly
to the sort comparator in javascript.

return

* **1** if src1 selection is greater
* **-1** if src2 selection is greater
* **0** if selections are equal

 
[src-link]: https://github.com/quicbit-js/qb-standard/blob/master/doc/variable-glossary.md#src-source
[off-link]: https://github.com/quicbit-js/qb-standard/blob/master/doc/variable-glossary.md#off-offset
[lim-link]: https://github.com/quicbit-js/qb-standard/blob/master/doc/variable-glossary.md#lim-limit
