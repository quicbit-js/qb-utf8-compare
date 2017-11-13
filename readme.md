# qb-utf8-compare

Compare selections of UTF8 bytes directly and without creating javascript strings.  

This is significantly more efficient than using strings for long or large numbers of buffer selections.

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
