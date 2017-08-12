/** @module publish */

var isModulePath = function(path) {
    return path.match(/^module:.*/);
};
/**
 * Generate documentation output.
 *
 * @param {TAFFY} data - A TaffyDB collection representing
 *                       all the symbols documented in your code.
 * @param {object} opts - An object with options information.
 */
exports.publish = function(data, opts) {
    var global = {
        "modules": {}
    };

    var getParent = function(longname) {
        if (isModulePath(longname)) {
            var p = longname.substring(7);
            var endIdx = p.search(/([^a-zA-Z0-9\/]|\s|\n|\n|$)/);
            var pa = p.substring(0, endIdx);
            var split = pa.split("/");
            let par = global.modules;
            ////////////
            if (endIdx < p.length) {
                split.push(p.substring(endIdx + 1));
            }
            ////////////
            for (var i = 0; i < split.length; i++) {
                var key = split[i];
                par.childs = par.childs || {};
                var child = par.childs[key] = par.childs[key] || {};
                if (i == split.length - 1) {
                    return child;
                }
                delete par;
                par = child;
            }
        }
    };

    function splitModulePath(path) {
        if (path.match(/^module:.*/)) {
            return path.substring(7)
                .split("/");
        } else {
            return path.split("/");
        }
    }

    data()
        .each(function(doclet) {
            if (doclet.undocumented === true) {
                return;
            }
            console.log("===============================");
            console.log(doclet);
            console.log("-------------------------------");
            if (!doclet.comment || doclet.comment === "") {
                return;
            }
            var path;
            if (doclet.kind === "function") {
                var parent = getParent(doclet.longname);
                parent.type = "function";
                parent.name = doclet.name;
                parent = Object.assign(parent, doclet);

            } else if (doclet.kind === "module") {
                var parent = getParent(doclet.longname);
                parent.type = "module";
                parent.name = doclet.name;
                parent = Object.assign(parent, doclet);

            } else if (doclet.kind === "member") {
                var parent = getParent(doclet.longname);
                parent.type = "member";
                parent.name = doclet.name;
                parent = Object.assign(parent, doclet);
            }
        });

    console.log(JSON.stringify(global, null, 2));
};
