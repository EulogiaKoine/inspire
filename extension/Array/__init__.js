"use strict"
module.exports = function(path, r_inspire){
// prototype
['at', 'count', 'counts', 'findLast', 'findLastIndex', 'random', 'randomPop',
    'shake', 'toReversed', 'toShaken', 'toSorted', 'with']
    .forEach(v => r_inspire(v))
// static
return {
    range: r_inspire('range')
}
}