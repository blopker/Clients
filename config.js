var config = {
    log_in_as: 'bo'
};


// ----------------------------
// Do not edit below this line.
// ----------------------------
var defaults = {
    port: 3000,
    dev: true,
    secret: 'boisawesome',
    log_in_as: false,
    admin: {name: 'admin', pass: 'secret'}
};

function extend(target) {
    var i = 1, length = arguments.length, source;
    for ( ; i < length; i++ ) {
     // Only deal with defined values
        if ( (source = arguments[i]) != undefined ) {
            Object.getOwnPropertyNames(source).forEach(function(k){
                var d = Object.getOwnPropertyDescriptor(source, k) || {value:source[k]};
                if (d.get) {
                    target.__defineGetter__(k, d.get);
                    if (d.set) {target.__defineSetter__(k, d.set);}
                }
                else if (target !== d.value) {
                    target[k] = d.value;
                }
            });
        }
    }
    return target;
}

module.exports = extend(defaults, config);
