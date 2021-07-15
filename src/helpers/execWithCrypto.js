import { webcrypto } from 'crypto';

const self = {
    crypto: webcrypto,
};

var t = {
        4963: t => {
            t.exports = function(t) {
                if ("function" != typeof t) throw TypeError(t + " is not a function!");
                return t
            }
        },
        6793: (t, e, r) => {
            "use strict";
            var n = r(4496)(!0);
            t.exports = function(t, e, r) {
                return e + (r ? n(t, e).length : 1)
            }
        },
        7007: (t, e, r) => {
            var n = r(5286);
            t.exports = function(t) {
                if (!n(t)) throw TypeError(t + " is not an object!");
                return t
            }
        },
        9315: (t, e, r) => {
            var n = r(2110),
                i = r(875),
                o = r(2337);
            t.exports = function(t) {
                return function(e, r, s) {
                    var a, u = n(e),
                        c = i(u.length),
                        f = o(s, c);
                    if (t && r != r) {
                        for (; c > f;)
                            if ((a = u[f++]) != a) return !0
                    } else
                        for (; c > f; f++)
                            if ((t || f in u) && u[f] === r) return t || f || 0;
                    return !t && -1
                }
            }
        },
        50: (t, e, r) => {
            var n = r(741),
                i = r(9797),
                o = r(508),
                s = r(875),
                a = r(6886);
            t.exports = function(t, e) {
                var r = 1 == t,
                    u = 2 == t,
                    c = 3 == t,
                    f = 4 == t,
                    l = 6 == t,
                    h = 5 == t || l,
                    p = e || a;
                return function(e, a, d) {
                    for (var b, w, v = o(e), y = i(v), g = n(a, d, 3), m = s(y.length), x = 0, E = r ? p(e, m) : u ? p(e, 0) : void 0; m > x; x++)
                        if ((h || x in y) && (w = g(b = y[x], x, v), t))
                            if (r) E[x] = w;
                            else if (w) switch (t) {
                        case 3:
                            return !0;
                        case 5:
                            return b;
                        case 6:
                            return x;
                        case 2:
                            E.push(b)
                    } else if (f) return !1;
                    return l ? -1 : c || f ? f : E
                }
            }
        },
        2736: (t, e, r) => {
            var n = r(5286),
                i = r(4302),
                o = r(6314)("species");
            t.exports = function(t) {
                var e;
                return i(t) && ("function" != typeof(e = t.constructor) || e !== Array && !i(e.prototype) || (e = void 0), n(e) && null === (e = e[o]) && (e = void 0)), void 0 === e ? Array : e
            }
        },
        6886: (t, e, r) => {
            var n = r(2736);
            t.exports = function(t, e) {
                return new(n(t))(e)
            }
        },
        1488: (t, e, r) => {
            var n = r(2032),
                i = r(6314)("toStringTag"),
                o = "Arguments" == n(function() {
                    return arguments
                }());
            t.exports = function(t) {
                var e, r, s;
                return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof(r = function(t, e) {
                    try {
                        return t[e]
                    } catch (t) {}
                }(e = Object(t), i)) ? r : o ? n(e) : "Object" == (s = n(e)) && "function" == typeof e.callee ? "Arguments" : s
            }
        },
        2032: t => {
            var e = {}.toString;
            t.exports = function(t) {
                return e.call(t).slice(8, -1)
            }
        },
        5645: t => {
            var e = t.exports = {
                version: "2.6.12"
            };
            "number" == typeof __e && (__e = e)
        },
        2811: (t, e, r) => {
            "use strict";
            var n = r(9275),
                i = r(681);
            t.exports = function(t, e, r) {
                e in t ? n.f(t, e, i(0, r)) : t[e] = r
            }
        },
        741: (t, e, r) => {
            var n = r(4963);
            t.exports = function(t, e, r) {
                if (n(t), void 0 === e) return t;
                switch (r) {
                    case 1:
                        return function(r) {
                            return t.call(e, r)
                        };
                    case 2:
                        return function(r, n) {
                            return t.call(e, r, n)
                        };
                    case 3:
                        return function(r, n, i) {
                            return t.call(e, r, n, i)
                        }
                }
                return function() {
                    return t.apply(e, arguments)
                }
            }
        },
        1355: t => {
            t.exports = function(t) {
                if (null == t) throw TypeError("Can't call method on  " + t);
                return t
            }
        },
        7057: (t, e, r) => {
            t.exports = !r(4253)((function() {
                return 7 != Object.defineProperty({}, "a", {
                    get: function() {
                        return 7
                    }
                }).a
            }))
        },
        2457: (t, e, r) => {
            var n = r(5286),
                i = r(3816).document,
                o = n(i) && n(i.createElement);
            t.exports = function(t) {
                return o ? i.createElement(t) : {}
            }
        },
        4430: t => {
            t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
        },
        5541: (t, e, r) => {
            var n = r(7184),
                i = r(4548),
                o = r(4682);
            t.exports = function(t) {
                var e = n(t),
                    r = i.f;
                if (r)
                    for (var s, a = r(t), u = o.f, c = 0; a.length > c;) u.call(t, s = a[c++]) && e.push(s);
                return e
            }
        },
        2985: (t, e, r) => {
            var n = r(3816),
                i = r(5645),
                o = r(7728),
                s = r(7234),
                a = r(741),
                u = function(t, e, r) {
                    var c, f, l, h, p = t & u.F,
                        d = t & u.G,
                        b = t & u.S,
                        w = t & u.P,
                        v = t & u.B,
                        y = d ? n : b ? n[e] || (n[e] = {}) : (n[e] || {}).prototype,
                        g = d ? i : i[e] || (i[e] = {}),
                        m = g.prototype || (g.prototype = {});
                    for (c in d && (r = e), r) l = ((f = !p && y && void 0 !== y[c]) ? y : r)[c], h = v && f ? a(l, n) : w && "function" == typeof l ? a(Function.call, l) : l, y && s(y, c, l, t & u.U), g[c] != l && o(g, c, h), w && m[c] != l && (m[c] = l)
                };
            n.core = i, u.F = 1, u.G = 2, u.S = 4, u.P = 8, u.B = 16, u.W = 32, u.U = 64, u.R = 128, t.exports = u
        },
        4253: t => {
            t.exports = function(t) {
                try {
                    return !!t()
                } catch (t) {
                    return !0
                }
            }
        },
        8082: (t, e, r) => {
            "use strict";
            r(8269);
            var n = r(7234),
                i = r(7728),
                o = r(4253),
                s = r(1355),
                a = r(6314),
                u = r(1165),
                c = a("species"),
                f = !o((function() {
                    var t = /./;
                    return t.exec = function() {
                        var t = [];
                        return t.groups = {
                            a: "7"
                        }, t
                    }, "7" !== "".replace(t, "$<a>")
                })),
                l = function() {
                    var t = /(?:)/,
                        e = t.exec;
                    t.exec = function() {
                        return e.apply(this, arguments)
                    };
                    var r = "ab".split(t);
                    return 2 === r.length && "a" === r[0] && "b" === r[1]
                }();
            t.exports = function(t, e, r) {
                var h = a(t),
                    p = !o((function() {
                        var e = {};
                        return e[h] = function() {
                            return 7
                        }, 7 != "" [t](e)
                    })),
                    d = p ? !o((function() {
                        var e = !1,
                            r = /a/;
                        return r.exec = function() {
                            return e = !0, null
                        }, "split" === t && (r.constructor = {}, r.constructor[c] = function() {
                            return r
                        }), r[h](""), !e
                    })) : void 0;
                if (!p || !d || "replace" === t && !f || "split" === t && !l) {
                    var b = /./ [h],
                        w = r(s, h, "" [t], (function(t, e, r, n, i) {
                            return e.exec === u ? p && !i ? {
                                done: !0,
                                value: b.call(e, r, n)
                            } : {
                                done: !0,
                                value: t.call(r, e, n)
                            } : {
                                done: !1
                            }
                        })),
                        v = w[0],
                        y = w[1];
                    n(String.prototype, t, v), i(RegExp.prototype, h, 2 == e ? function(t, e) {
                        return y.call(t, this, e)
                    } : function(t) {
                        return y.call(t, this)
                    })
                }
            }
        },
        3218: (t, e, r) => {
            "use strict";
            var n = r(7007);
            t.exports = function() {
                var t = n(this),
                    e = "";
                return t.global && (e += "g"), t.ignoreCase && (e += "i"), t.multiline && (e += "m"), t.unicode && (e += "u"), t.sticky && (e += "y"), e
            }
        },
        18: (t, e, r) => {
            t.exports = r(3825)("native-function-to-string", Function.toString)
        },
        3816: t => {
            var e = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
            "number" == typeof __g && (__g = e)
        },
        9181: t => {
            var e = {}.hasOwnProperty;
            t.exports = function(t, r) {
                return e.call(t, r)
            }
        },
        7728: (t, e, r) => {
            var n = r(9275),
                i = r(681);
            t.exports = r(7057) ? function(t, e, r) {
                return n.f(t, e, i(1, r))
            } : function(t, e, r) {
                return t[e] = r, t
            }
        },
        639: (t, e, r) => {
            var n = r(3816).document;
            t.exports = n && n.documentElement
        },
        1734: (t, e, r) => {
            t.exports = !r(7057) && !r(4253)((function() {
                return 7 != Object.defineProperty(r(2457)("div"), "a", {
                    get: function() {
                        return 7
                    }
                }).a
            }))
        },
        9797: (t, e, r) => {
            var n = r(2032);
            t.exports = Object("z").propertyIsEnumerable(0) ? Object : function(t) {
                return "String" == n(t) ? t.split("") : Object(t)
            }
        },
        4302: (t, e, r) => {
            var n = r(2032);
            t.exports = Array.isArray || function(t) {
                return "Array" == n(t)
            }
        },
        5286: t => {
            t.exports = function(t) {
                return "object" == typeof t ? null !== t : "function" == typeof t
            }
        },
        4461: t => {
            t.exports = !1
        },
        4728: (t, e, r) => {
            var n = r(3953)("meta"),
                i = r(5286),
                o = r(9181),
                s = r(9275).f,
                a = 0,
                u = Object.isExtensible || function() {
                    return !0
                },
                c = !r(4253)((function() {
                    return u(Object.preventExtensions({}))
                })),
                f = function(t) {
                    s(t, n, {
                        value: {
                            i: "O" + ++a,
                            w: {}
                        }
                    })
                },
                l = t.exports = {
                    KEY: n,
                    NEED: !1,
                    fastKey: function(t, e) {
                        if (!i(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
                        if (!o(t, n)) {
                            if (!u(t)) return "F";
                            if (!e) return "E";
                            f(t)
                        }
                        return t[n].i
                    },
                    getWeak: function(t, e) {
                        if (!o(t, n)) {
                            if (!u(t)) return !0;
                            if (!e) return !1;
                            f(t)
                        }
                        return t[n].w
                    },
                    onFreeze: function(t) {
                        return c && l.NEED && u(t) && !o(t, n) && f(t), t
                    }
                }
        },
        2503: (t, e, r) => {
            var n = r(7007),
                i = r(5588),
                o = r(4430),
                s = r(9335)("IE_PROTO"),
                a = function() {},
                u = function() {
                    var t, e = r(2457)("iframe"),
                        n = o.length;
                    for (e.style.display = "none", r(639).appendChild(e), e.src = "javascript:", (t = e.contentWindow.document).open(), t.write("<script>document.F=Object<\/script>"), t.close(), u = t.F; n--;) delete u.prototype[o[n]];
                    return u()
                };
            t.exports = Object.create || function(t, e) {
                var r;
                return null !== t ? (a.prototype = n(t), r = new a, a.prototype = null, r[s] = t) : r = u(), void 0 === e ? r : i(r, e)
            }
        },
        9275: (t, e, r) => {
            var n = r(7007),
                i = r(1734),
                o = r(1689),
                s = Object.defineProperty;
            e.f = r(7057) ? Object.defineProperty : function(t, e, r) {
                if (n(t), e = o(e, !0), n(r), i) try {
                    return s(t, e, r)
                } catch (t) {}
                if ("get" in r || "set" in r) throw TypeError("Accessors not supported!");
                return "value" in r && (t[e] = r.value), t
            }
        },
        5588: (t, e, r) => {
            var n = r(9275),
                i = r(7007),
                o = r(7184);
            t.exports = r(7057) ? Object.defineProperties : function(t, e) {
                i(t);
                for (var r, s = o(e), a = s.length, u = 0; a > u;) n.f(t, r = s[u++], e[r]);
                return t
            }
        },
        8693: (t, e, r) => {
            var n = r(4682),
                i = r(681),
                o = r(2110),
                s = r(1689),
                a = r(9181),
                u = r(1734),
                c = Object.getOwnPropertyDescriptor;
            e.f = r(7057) ? c : function(t, e) {
                if (t = o(t), e = s(e, !0), u) try {
                    return c(t, e)
                } catch (t) {}
                if (a(t, e)) return i(!n.f.call(t, e), t[e])
            }
        },
        9327: (t, e, r) => {
            var n = r(2110),
                i = r(616).f,
                o = {}.toString,
                s = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
            t.exports.f = function(t) {
                return s && "[object Window]" == o.call(t) ? function(t) {
                    try {
                        return i(t)
                    } catch (t) {
                        return s.slice()
                    }
                }(t) : i(n(t))
            }
        },
        616: (t, e, r) => {
            var n = r(189),
                i = r(4430).concat("length", "prototype");
            e.f = Object.getOwnPropertyNames || function(t) {
                return n(t, i)
            }
        },
        4548: (t, e) => {
            e.f = Object.getOwnPropertySymbols
        },
        189: (t, e, r) => {
            var n = r(9181),
                i = r(2110),
                o = r(9315)(!1),
                s = r(9335)("IE_PROTO");
            t.exports = function(t, e) {
                var r, a = i(t),
                    u = 0,
                    c = [];
                for (r in a) r != s && n(a, r) && c.push(r);
                for (; e.length > u;) n(a, r = e[u++]) && (~o(c, r) || c.push(r));
                return c
            }
        },
        7184: (t, e, r) => {
            var n = r(189),
                i = r(4430);
            t.exports = Object.keys || function(t) {
                return n(t, i)
            }
        },
        4682: (t, e) => {
            e.f = {}.propertyIsEnumerable
        },
        3160: (t, e, r) => {
            var n = r(2985),
                i = r(5645),
                o = r(4253);
            t.exports = function(t, e) {
                var r = (i.Object || {})[t] || Object[t],
                    s = {};
                s[t] = e(r), n(n.S + n.F * o((function() {
                    r(1)
                })), "Object", s)
            }
        },
        7643: (t, e, r) => {
            var n = r(616),
                i = r(4548),
                o = r(7007),
                s = r(3816).Reflect;
            t.exports = s && s.ownKeys || function(t) {
                var e = n.f(o(t)),
                    r = i.f;
                return r ? e.concat(r(t)) : e
            }
        },
        681: t => {
            t.exports = function(t, e) {
                return {
                    enumerable: !(1 & t),
                    configurable: !(2 & t),
                    writable: !(4 & t),
                    value: e
                }
            }
        },
        7234: (t, e, r) => {
            var n = r(3816),
                i = r(7728),
                o = r(9181),
                s = r(3953)("src"),
                a = r(18),
                u = "toString",
                c = ("" + a).split(u);
            r(5645).inspectSource = function(t) {
                return a.call(t)
            }, (t.exports = function(t, e, r, a) {
                var u = "function" == typeof r;
                u && (o(r, "name") || i(r, "name", e)), t[e] !== r && (u && (o(r, s) || i(r, s, t[e] ? "" + t[e] : c.join(String(e)))), t === n ? t[e] = r : a ? t[e] ? t[e] = r : i(t, e, r) : (delete t[e], i(t, e, r)))
            })(Function.prototype, u, (function() {
                return "function" == typeof this && this[s] || a.call(this)
            }))
        },
        7787: (t, e, r) => {
            "use strict";
            var n = r(1488),
                i = RegExp.prototype.exec;
            t.exports = function(t, e) {
                var r = t.exec;
                if ("function" == typeof r) {
                    var o = r.call(t, e);
                    if ("object" != typeof o) throw new TypeError("RegExp exec method returned something other than an Object or null");
                    return o
                }
                if ("RegExp" !== n(t)) throw new TypeError("RegExp#exec called on incompatible receiver");
                return i.call(t, e)
            }
        },
        1165: (t, e, r) => {
            "use strict";
            var n, i, o = r(3218),
                s = RegExp.prototype.exec,
                a = String.prototype.replace,
                u = s,
                c = (n = /a/, i = /b*/g, s.call(n, "a"), s.call(i, "a"), 0 !== n.lastIndex || 0 !== i.lastIndex),
                f = void 0 !== /()??/.exec("")[1];
            (c || f) && (u = function(t) {
                var e, r, n, i, u = this;
                return f && (r = new RegExp("^" + u.source + "$(?!\\s)", o.call(u))), c && (e = u.lastIndex), n = s.call(u, t), c && n && (u.lastIndex = u.global ? n.index + n[0].length : e), f && n && n.length > 1 && a.call(n[0], r, (function() {
                    for (i = 1; i < arguments.length - 2; i++) void 0 === arguments[i] && (n[i] = void 0)
                })), n
            }), t.exports = u
        },
        2943: (t, e, r) => {
            var n = r(9275).f,
                i = r(9181),
                o = r(6314)("toStringTag");
            t.exports = function(t, e, r) {
                t && !i(t = r ? t : t.prototype, o) && n(t, o, {
                    configurable: !0,
                    value: e
                })
            }
        },
        9335: (t, e, r) => {
            var n = r(3825)("keys"),
                i = r(3953);
            t.exports = function(t) {
                return n[t] || (n[t] = i(t))
            }
        },
        3825: (t, e, r) => {
            var n = r(5645),
                i = r(3816),
                o = "__core-js_shared__",
                s = i[o] || (i[o] = {});
            (t.exports = function(t, e) {
                return s[t] || (s[t] = void 0 !== e ? e : {})
            })("versions", []).push({
                version: n.version,
                mode: r(4461) ? "pure" : "global",
                copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
            })
        },
        7717: (t, e, r) => {
            "use strict";
            var n = r(4253);
            t.exports = function(t, e) {
                return !!t && n((function() {
                    e ? t.call(null, (function() {}), 1) : t.call(null)
                }))
            }
        },
        4496: (t, e, r) => {
            var n = r(1467),
                i = r(1355);
            t.exports = function(t) {
                return function(e, r) {
                    var o, s, a = String(i(e)),
                        u = n(r),
                        c = a.length;
                    return u < 0 || u >= c ? t ? "" : void 0 : (o = a.charCodeAt(u)) < 55296 || o > 56319 || u + 1 === c || (s = a.charCodeAt(u + 1)) < 56320 || s > 57343 ? t ? a.charAt(u) : o : t ? a.slice(u, u + 2) : s - 56320 + (o - 55296 << 10) + 65536
                }
            }
        },
        2337: (t, e, r) => {
            var n = r(1467),
                i = Math.max,
                o = Math.min;
            t.exports = function(t, e) {
                return (t = n(t)) < 0 ? i(t + e, 0) : o(t, e)
            }
        },
        1467: t => {
            var e = Math.ceil,
                r = Math.floor;
            t.exports = function(t) {
                return isNaN(t = +t) ? 0 : (t > 0 ? r : e)(t)
            }
        },
        2110: (t, e, r) => {
            var n = r(9797),
                i = r(1355);
            t.exports = function(t) {
                return n(i(t))
            }
        },
        875: (t, e, r) => {
            var n = r(1467),
                i = Math.min;
            t.exports = function(t) {
                return t > 0 ? i(n(t), 9007199254740991) : 0
            }
        },
        508: (t, e, r) => {
            var n = r(1355);
            t.exports = function(t) {
                return Object(n(t))
            }
        },
        1689: (t, e, r) => {
            var n = r(5286);
            t.exports = function(t, e) {
                if (!n(t)) return t;
                var r, i;
                if (e && "function" == typeof(r = t.toString) && !n(i = r.call(t))) return i;
                if ("function" == typeof(r = t.valueOf) && !n(i = r.call(t))) return i;
                if (!e && "function" == typeof(r = t.toString) && !n(i = r.call(t))) return i;
                throw TypeError("Can't convert object to primitive value")
            }
        },
        3953: t => {
            var e = 0,
                r = Math.random();
            t.exports = function(t) {
                return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++e + r).toString(36))
            }
        },
        6074: (t, e, r) => {
            var n = r(3816),
                i = r(5645),
                o = r(4461),
                s = r(8787),
                a = r(9275).f;
            t.exports = function(t) {
                var e = i.Symbol || (i.Symbol = o ? {} : n.Symbol || {});
                "_" == t.charAt(0) || t in e || a(e, t, {
                    value: s.f(t)
                })
            }
        },
        8787: (t, e, r) => {
            e.f = r(6314)
        },
        6314: (t, e, r) => {
            var n = r(3825)("wks"),
                i = r(3953),
                o = r(3816).Symbol,
                s = "function" == typeof o;
            (t.exports = function(t) {
                return n[t] || (n[t] = s && o[t] || (s ? o : i)("Symbol." + t))
            }).store = n
        },
        8837: (t, e, r) => {
            "use strict";
            var n = r(2985),
                i = r(50)(2);
            n(n.P + n.F * !r(7717)([].filter, !0), "Array", {
                filter: function(t) {
                    return i(this, t, arguments[1])
                }
            })
        },
        4336: (t, e, r) => {
            "use strict";
            var n = r(2985),
                i = r(50)(0),
                o = r(7717)([].forEach, !0);
            n(n.P + n.F * !o, "Array", {
                forEach: function(t) {
                    return i(this, t, arguments[1])
                }
            })
        },
        3369: (t, e, r) => {
            "use strict";
            var n = r(2985),
                i = r(9315)(!1),
                o = [].indexOf,
                s = !!o && 1 / [1].indexOf(1, -0) < 0;
            n(n.P + n.F * (s || !r(7717)(o)), "Array", {
                indexOf: function(t) {
                    return s ? o.apply(this, arguments) || 0 : i(this, t, arguments[1])
                }
            })
        },
        6059: (t, e, r) => {
            var n = r(9275).f,
                i = Function.prototype,
                o = /^\s*function ([^ (]*)/,
                s = "name";
            s in i || r(7057) && n(i, s, {
                configurable: !0,
                get: function() {
                    try {
                        return ("" + this).match(o)[1]
                    } catch (t) {
                        return ""
                    }
                }
            })
        },
        7470: (t, e, r) => {
            var n = r(2985);
            n(n.S + n.F * !r(7057), "Object", {
                defineProperties: r(5588)
            })
        },
        8388: (t, e, r) => {
            var n = r(2985);
            n(n.S + n.F * !r(7057), "Object", {
                defineProperty: r(9275).f
            })
        },
        4882: (t, e, r) => {
            var n = r(2110),
                i = r(8693).f;
            r(3160)("getOwnPropertyDescriptor", (function() {
                return function(t, e) {
                    return i(n(t), e)
                }
            }))
        },
        7476: (t, e, r) => {
            var n = r(508),
                i = r(7184);
            r(3160)("keys", (function() {
                return function(t) {
                    return i(n(t))
                }
            }))
        },
        8269: (t, e, r) => {
            "use strict";
            var n = r(1165);
            r(2985)({
                target: "RegExp",
                proto: !0,
                forced: n !== /./.exec
            }, {
                exec: n
            })
        },
        9357: (t, e, r) => {
            "use strict";
            var n = r(7007),
                i = r(508),
                o = r(875),
                s = r(1467),
                a = r(6793),
                u = r(7787),
                c = Math.max,
                f = Math.min,
                l = Math.floor,
                h = /\$([$&`']|\d\d?|<[^>]*>)/g,
                p = /\$([$&`']|\d\d?)/g;
            r(8082)("replace", 2, (function(t, e, r, d) {
                return [function(n, i) {
                    var o = t(this),
                        s = null == n ? void 0 : n[e];
                    return void 0 !== s ? s.call(n, o, i) : r.call(String(o), n, i)
                }, function(t, e) {
                    var i = d(r, t, this, e);
                    if (i.done) return i.value;
                    var l = n(t),
                        h = String(this),
                        p = "function" == typeof e;
                    p || (e = String(e));
                    var w = l.global;
                    if (w) {
                        var v = l.unicode;
                        l.lastIndex = 0
                    }
                    for (var y = [];;) {
                        var g = u(l, h);
                        if (null === g) break;
                        if (y.push(g), !w) break;
                        "" === String(g[0]) && (l.lastIndex = a(h, o(l.lastIndex), v))
                    }
                    for (var m, x = "", E = 0, _ = 0; _ < y.length; _++) {
                        g = y[_];
                        for (var k = String(g[0]), A = c(f(s(g.index), h.length), 0), S = [], O = 1; O < g.length; O++) S.push(void 0 === (m = g[O]) ? m : String(m));
                        var U = g.groups;
                        if (p) {
                            var M = [k].concat(S, A, h);
                            void 0 !== U && M.push(U);
                            var C = String(e.apply(void 0, M))
                        } else C = b(k, h, A, S, U, e);
                        A >= E && (x += h.slice(E, A) + C, E = A + k.length)
                    }
                    return x + h.slice(E)
                }];

                function b(t, e, n, o, s, a) {
                    var u = n + t.length,
                        c = o.length,
                        f = p;
                    return void 0 !== s && (s = i(s), f = h), r.call(a, f, (function(r, i) {
                        var a;
                        switch (i.charAt(0)) {
                            case "$":
                                return "$";
                            case "&":
                                return t;
                            case "`":
                                return e.slice(0, n);
                            case "'":
                                return e.slice(u);
                            case "<":
                                a = s[i.slice(1, -1)];
                                break;
                            default:
                                var f = +i;
                                if (0 === f) return r;
                                if (f > c) {
                                    var h = l(f / 10);
                                    return 0 === h ? r : h <= c ? void 0 === o[h - 1] ? i.charAt(1) : o[h - 1] + i.charAt(1) : r
                                }
                                a = o[f - 1]
                        }
                        return void 0 === a ? "" : a
                    }))
                }
            }))
        },
        5767: (t, e, r) => {
            "use strict";
            var n = r(3816),
                i = r(9181),
                o = r(7057),
                s = r(2985),
                a = r(7234),
                u = r(4728).KEY,
                c = r(4253),
                f = r(3825),
                l = r(2943),
                h = r(3953),
                p = r(6314),
                d = r(8787),
                b = r(6074),
                w = r(5541),
                v = r(4302),
                y = r(7007),
                g = r(5286),
                m = r(508),
                x = r(2110),
                E = r(1689),
                _ = r(681),
                k = r(2503),
                A = r(9327),
                S = r(8693),
                O = r(4548),
                U = r(9275),
                M = r(7184),
                C = S.f,
                T = U.f,
                B = A.f,
                j = n.Symbol,
                P = n.JSON,
                N = P && P.stringify,
                R = p("_hidden"),
                F = p("toPrimitive"),
                z = {}.propertyIsEnumerable,
                I = f("symbol-registry"),
                L = f("symbols"),
                K = f("op-symbols"),
                D = Object.prototype,
                q = "function" == typeof j && !!O.f,
                Y = n.QObject,
                V = !Y || !Y.prototype || !Y.prototype.findChild,
                G = o && c((function() {
                    return 7 != k(T({}, "a", {
                        get: function() {
                            return T(this, "a", {
                                value: 7
                            }).a
                        }
                    })).a
                })) ? function(t, e, r) {
                    var n = C(D, e);
                    n && delete D[e], T(t, e, r), n && t !== D && T(D, e, n)
                } : T,
                Z = function(t) {
                    var e = L[t] = k(j.prototype);
                    return e._k = t, e
                },
                W = q && "symbol" == typeof j.iterator ? function(t) {
                    return "symbol" == typeof t
                } : function(t) {
                    return t instanceof j
                },
                $ = function(t, e, r) {
                    return t === D && $(K, e, r), y(t), e = E(e, !0), y(r), i(L, e) ? (r.enumerable ? (i(t, R) && t[R][e] && (t[R][e] = !1), r = k(r, {
                        enumerable: _(0, !1)
                    })) : (i(t, R) || T(t, R, _(1, {})), t[R][e] = !0), G(t, e, r)) : T(t, e, r)
                },
                J = function(t, e) {
                    y(t);
                    for (var r, n = w(e = x(e)), i = 0, o = n.length; o > i;) $(t, r = n[i++], e[r]);
                    return t
                },
                H = function(t) {
                    var e = z.call(this, t = E(t, !0));
                    return !(this === D && i(L, t) && !i(K, t)) && (!(e || !i(this, t) || !i(L, t) || i(this, R) && this[R][t]) || e)
                },
                X = function(t, e) {
                    if (t = x(t), e = E(e, !0), t !== D || !i(L, e) || i(K, e)) {
                        var r = C(t, e);
                        return !r || !i(L, e) || i(t, R) && t[R][e] || (r.enumerable = !0), r
                    }
                },
                Q = function(t) {
                    for (var e, r = B(x(t)), n = [], o = 0; r.length > o;) i(L, e = r[o++]) || e == R || e == u || n.push(e);
                    return n
                },
                tt = function(t) {
                    for (var e, r = t === D, n = B(r ? K : x(t)), o = [], s = 0; n.length > s;) !i(L, e = n[s++]) || r && !i(D, e) || o.push(L[e]);
                    return o
                };
            q || (a((j = function() {
                if (this instanceof j) throw TypeError("Symbol is not a constructor!");
                var t = h(arguments.length > 0 ? arguments[0] : void 0),
                    e = function(r) {
                        this === D && e.call(K, r), i(this, R) && i(this[R], t) && (this[R][t] = !1), G(this, t, _(1, r))
                    };
                return o && V && G(D, t, {
                    configurable: !0,
                    set: e
                }), Z(t)
            }).prototype, "toString", (function() {
                return this._k
            })), S.f = X, U.f = $, r(616).f = A.f = Q, r(4682).f = H, O.f = tt, o && !r(4461) && a(D, "propertyIsEnumerable", H, !0), d.f = function(t) {
                return Z(p(t))
            }), s(s.G + s.W + s.F * !q, {
                Symbol: j
            });
            for (var et = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), rt = 0; et.length > rt;) p(et[rt++]);
            for (var nt = M(p.store), it = 0; nt.length > it;) b(nt[it++]);
            s(s.S + s.F * !q, "Symbol", {
                for: function(t) {
                    return i(I, t += "") ? I[t] : I[t] = j(t)
                },
                keyFor: function(t) {
                    if (!W(t)) throw TypeError(t + " is not a symbol!");
                    for (var e in I)
                        if (I[e] === t) return e
                },
                useSetter: function() {
                    V = !0
                },
                useSimple: function() {
                    V = !1
                }
            }), s(s.S + s.F * !q, "Object", {
                create: function(t, e) {
                    return void 0 === e ? k(t) : J(k(t), e)
                },
                defineProperty: $,
                defineProperties: J,
                getOwnPropertyDescriptor: X,
                getOwnPropertyNames: Q,
                getOwnPropertySymbols: tt
            });
            var ot = c((function() {
                O.f(1)
            }));
            s(s.S + s.F * ot, "Object", {
                getOwnPropertySymbols: function(t) {
                    return O.f(m(t))
                }
            }), P && s(s.S + s.F * (!q || c((function() {
                var t = j();
                return "[null]" != N([t]) || "{}" != N({
                    a: t
                }) || "{}" != N(Object(t))
            }))), "JSON", {
                stringify: function(t) {
                    for (var e, r, n = [t], i = 1; arguments.length > i;) n.push(arguments[i++]);
                    if (r = e = n[1], (g(e) || void 0 !== t) && !W(t)) return v(e) || (e = function(t, e) {
                        if ("function" == typeof r && (e = r.call(this, t, e)), !W(e)) return e
                    }), n[1] = e, N.apply(P, n)
                }
            }), j.prototype[F] || r(7728)(j.prototype, F, j.prototype.valueOf), l(j, "Symbol"), l(Math, "Math", !0), l(n.JSON, "JSON", !0)
        },
        8351: (t, e, r) => {
            var n = r(2985),
                i = r(7643),
                o = r(2110),
                s = r(8693),
                a = r(2811);
            n(n.S, "Object", {
                getOwnPropertyDescriptors: function(t) {
                    for (var e, r, n = o(t), u = s.f, c = i(n), f = {}, l = 0; c.length > l;) void 0 !== (r = u(n, e = c[l++])) && a(f, e, r);
                    return f
                }
            })
        },
        6885: function(t) {
            ! function(e, r) {
                "use strict";
                t.exports ? t.exports = r() : (e.nacl || (e.nacl = {}), e.nacl.util = r())
            }(this, (function() {
                "use strict";
                var t = {};

                function e(t) {
                    if (!/^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(t)) throw new TypeError("invalid encoding")
                }
                return t.decodeUTF8 = function(t) {
                    if ("string" != typeof t) throw new TypeError("expected string");
                    var e, r = unescape(encodeURIComponent(t)),
                        n = new Uint8Array(r.length);
                    for (e = 0; e < r.length; e++) n[e] = r.charCodeAt(e);
                    return n
                }, t.encodeUTF8 = function(t) {
                    var e, r = [];
                    for (e = 0; e < t.length; e++) r.push(String.fromCharCode(t[e]));
                    return decodeURIComponent(escape(r.join("")))
                }, "undefined" == typeof atob ? void 0 !== Buffer.from ? (t.encodeBase64 = function(t) {
                    return Buffer.from(t).toString("base64")
                }, t.decodeBase64 = function(t) {
                    return e(t), new Uint8Array(Array.prototype.slice.call(Buffer.from(t, "base64"), 0))
                }) : (t.encodeBase64 = function(t) {
                    return new Buffer(t).toString("base64")
                }, t.decodeBase64 = function(t) {
                    return e(t), new Uint8Array(Array.prototype.slice.call(new Buffer(t, "base64"), 0))
                }) : (t.encodeBase64 = function(t) {
                    var e, r = [],
                        n = t.length;
                    for (e = 0; e < n; e++) r.push(String.fromCharCode(t[e]));
                    return btoa(r.join(""))
                }, t.decodeBase64 = function(t) {
                    e(t);
                    var r, n = atob(t),
                        i = new Uint8Array(n.length);
                    for (r = 0; r < n.length; r++) i[r] = n.charCodeAt(r);
                    return i
                }), t
            }))
        },
        780: (t, e, r) => {
            ! function(t) {
                "use strict";
                var e = function(t) {
                        var e, r = new Float64Array(16);
                        if (t)
                            for (e = 0; e < t.length; e++) r[e] = t[e];
                        return r
                    },
                    n = function() {
                        throw new Error("no PRNG")
                    },
                    i = new Uint8Array(16),
                    o = new Uint8Array(32);
                o[0] = 9;
                var s = e(),
                    a = e([1]),
                    u = e([56129, 1]),
                    c = e([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
                    f = e([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
                    l = e([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
                    h = e([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
                    p = e([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

                function d(t, e, r, n) {
                    t[e] = r >> 24 & 255, t[e + 1] = r >> 16 & 255, t[e + 2] = r >> 8 & 255, t[e + 3] = 255 & r, t[e + 4] = n >> 24 & 255, t[e + 5] = n >> 16 & 255, t[e + 6] = n >> 8 & 255, t[e + 7] = 255 & n
                }

                function b(t, e, r, n, i) {
                    var o, s = 0;
                    for (o = 0; o < i; o++) s |= t[e + o] ^ r[n + o];
                    return (1 & s - 1 >>> 8) - 1
                }

                function w(t, e, r, n) {
                    return b(t, e, r, n, 16)
                }

                function v(t, e, r, n) {
                    return b(t, e, r, n, 32)
                }

                function y(t, e, r, n) {
                    ! function(t, e, r, n) {
                        for (var i, o = 255 & n[0] | (255 & n[1]) << 8 | (255 & n[2]) << 16 | (255 & n[3]) << 24, s = 255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24, a = 255 & r[4] | (255 & r[5]) << 8 | (255 & r[6]) << 16 | (255 & r[7]) << 24, u = 255 & r[8] | (255 & r[9]) << 8 | (255 & r[10]) << 16 | (255 & r[11]) << 24, c = 255 & r[12] | (255 & r[13]) << 8 | (255 & r[14]) << 16 | (255 & r[15]) << 24, f = 255 & n[4] | (255 & n[5]) << 8 | (255 & n[6]) << 16 | (255 & n[7]) << 24, l = 255 & e[0] | (255 & e[1]) << 8 | (255 & e[2]) << 16 | (255 & e[3]) << 24, h = 255 & e[4] | (255 & e[5]) << 8 | (255 & e[6]) << 16 | (255 & e[7]) << 24, p = 255 & e[8] | (255 & e[9]) << 8 | (255 & e[10]) << 16 | (255 & e[11]) << 24, d = 255 & e[12] | (255 & e[13]) << 8 | (255 & e[14]) << 16 | (255 & e[15]) << 24, b = 255 & n[8] | (255 & n[9]) << 8 | (255 & n[10]) << 16 | (255 & n[11]) << 24, w = 255 & r[16] | (255 & r[17]) << 8 | (255 & r[18]) << 16 | (255 & r[19]) << 24, v = 255 & r[20] | (255 & r[21]) << 8 | (255 & r[22]) << 16 | (255 & r[23]) << 24, y = 255 & r[24] | (255 & r[25]) << 8 | (255 & r[26]) << 16 | (255 & r[27]) << 24, g = 255 & r[28] | (255 & r[29]) << 8 | (255 & r[30]) << 16 | (255 & r[31]) << 24, m = 255 & n[12] | (255 & n[13]) << 8 | (255 & n[14]) << 16 | (255 & n[15]) << 24, x = o, E = s, _ = a, k = u, A = c, S = f, O = l, U = h, M = p, C = d, T = b, B = w, j = v, P = y, N = g, R = m, F = 0; F < 20; F += 2) x ^= (i = (j ^= (i = (M ^= (i = (A ^= (i = x + j | 0) << 7 | i >>> 25) + x | 0) << 9 | i >>> 23) + A | 0) << 13 | i >>> 19) + M | 0) << 18 | i >>> 14, S ^= (i = (E ^= (i = (P ^= (i = (C ^= (i = S + E | 0) << 7 | i >>> 25) + S | 0) << 9 | i >>> 23) + C | 0) << 13 | i >>> 19) + P | 0) << 18 | i >>> 14, T ^= (i = (O ^= (i = (_ ^= (i = (N ^= (i = T + O | 0) << 7 | i >>> 25) + T | 0) << 9 | i >>> 23) + N | 0) << 13 | i >>> 19) + _ | 0) << 18 | i >>> 14, R ^= (i = (B ^= (i = (U ^= (i = (k ^= (i = R + B | 0) << 7 | i >>> 25) + R | 0) << 9 | i >>> 23) + k | 0) << 13 | i >>> 19) + U | 0) << 18 | i >>> 14, x ^= (i = (k ^= (i = (_ ^= (i = (E ^= (i = x + k | 0) << 7 | i >>> 25) + x | 0) << 9 | i >>> 23) + E | 0) << 13 | i >>> 19) + _ | 0) << 18 | i >>> 14, S ^= (i = (A ^= (i = (U ^= (i = (O ^= (i = S + A | 0) << 7 | i >>> 25) + S | 0) << 9 | i >>> 23) + O | 0) << 13 | i >>> 19) + U | 0) << 18 | i >>> 14, T ^= (i = (C ^= (i = (M ^= (i = (B ^= (i = T + C | 0) << 7 | i >>> 25) + T | 0) << 9 | i >>> 23) + B | 0) << 13 | i >>> 19) + M | 0) << 18 | i >>> 14, R ^= (i = (N ^= (i = (P ^= (i = (j ^= (i = R + N | 0) << 7 | i >>> 25) + R | 0) << 9 | i >>> 23) + j | 0) << 13 | i >>> 19) + P | 0) << 18 | i >>> 14;
                        x = x + o | 0, E = E + s | 0, _ = _ + a | 0, k = k + u | 0, A = A + c | 0, S = S + f | 0, O = O + l | 0, U = U + h | 0, M = M + p | 0, C = C + d | 0, T = T + b | 0, B = B + w | 0, j = j + v | 0, P = P + y | 0, N = N + g | 0, R = R + m | 0, t[0] = x >>> 0 & 255, t[1] = x >>> 8 & 255, t[2] = x >>> 16 & 255, t[3] = x >>> 24 & 255, t[4] = E >>> 0 & 255, t[5] = E >>> 8 & 255, t[6] = E >>> 16 & 255, t[7] = E >>> 24 & 255, t[8] = _ >>> 0 & 255, t[9] = _ >>> 8 & 255, t[10] = _ >>> 16 & 255, t[11] = _ >>> 24 & 255, t[12] = k >>> 0 & 255, t[13] = k >>> 8 & 255, t[14] = k >>> 16 & 255, t[15] = k >>> 24 & 255, t[16] = A >>> 0 & 255, t[17] = A >>> 8 & 255, t[18] = A >>> 16 & 255, t[19] = A >>> 24 & 255, t[20] = S >>> 0 & 255, t[21] = S >>> 8 & 255, t[22] = S >>> 16 & 255, t[23] = S >>> 24 & 255, t[24] = O >>> 0 & 255, t[25] = O >>> 8 & 255, t[26] = O >>> 16 & 255, t[27] = O >>> 24 & 255, t[28] = U >>> 0 & 255, t[29] = U >>> 8 & 255, t[30] = U >>> 16 & 255, t[31] = U >>> 24 & 255, t[32] = M >>> 0 & 255, t[33] = M >>> 8 & 255, t[34] = M >>> 16 & 255, t[35] = M >>> 24 & 255, t[36] = C >>> 0 & 255, t[37] = C >>> 8 & 255, t[38] = C >>> 16 & 255, t[39] = C >>> 24 & 255, t[40] = T >>> 0 & 255, t[41] = T >>> 8 & 255, t[42] = T >>> 16 & 255, t[43] = T >>> 24 & 255, t[44] = B >>> 0 & 255, t[45] = B >>> 8 & 255, t[46] = B >>> 16 & 255, t[47] = B >>> 24 & 255, t[48] = j >>> 0 & 255, t[49] = j >>> 8 & 255, t[50] = j >>> 16 & 255, t[51] = j >>> 24 & 255, t[52] = P >>> 0 & 255, t[53] = P >>> 8 & 255, t[54] = P >>> 16 & 255, t[55] = P >>> 24 & 255, t[56] = N >>> 0 & 255, t[57] = N >>> 8 & 255, t[58] = N >>> 16 & 255, t[59] = N >>> 24 & 255, t[60] = R >>> 0 & 255, t[61] = R >>> 8 & 255, t[62] = R >>> 16 & 255, t[63] = R >>> 24 & 255
                    }(t, e, r, n)
                }

                function g(t, e, r, n) {
                    ! function(t, e, r, n) {
                        for (var i, o = 255 & n[0] | (255 & n[1]) << 8 | (255 & n[2]) << 16 | (255 & n[3]) << 24, s = 255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24, a = 255 & r[4] | (255 & r[5]) << 8 | (255 & r[6]) << 16 | (255 & r[7]) << 24, u = 255 & r[8] | (255 & r[9]) << 8 | (255 & r[10]) << 16 | (255 & r[11]) << 24, c = 255 & r[12] | (255 & r[13]) << 8 | (255 & r[14]) << 16 | (255 & r[15]) << 24, f = 255 & n[4] | (255 & n[5]) << 8 | (255 & n[6]) << 16 | (255 & n[7]) << 24, l = 255 & e[0] | (255 & e[1]) << 8 | (255 & e[2]) << 16 | (255 & e[3]) << 24, h = 255 & e[4] | (255 & e[5]) << 8 | (255 & e[6]) << 16 | (255 & e[7]) << 24, p = 255 & e[8] | (255 & e[9]) << 8 | (255 & e[10]) << 16 | (255 & e[11]) << 24, d = 255 & e[12] | (255 & e[13]) << 8 | (255 & e[14]) << 16 | (255 & e[15]) << 24, b = 255 & n[8] | (255 & n[9]) << 8 | (255 & n[10]) << 16 | (255 & n[11]) << 24, w = 255 & r[16] | (255 & r[17]) << 8 | (255 & r[18]) << 16 | (255 & r[19]) << 24, v = 255 & r[20] | (255 & r[21]) << 8 | (255 & r[22]) << 16 | (255 & r[23]) << 24, y = 255 & r[24] | (255 & r[25]) << 8 | (255 & r[26]) << 16 | (255 & r[27]) << 24, g = 255 & r[28] | (255 & r[29]) << 8 | (255 & r[30]) << 16 | (255 & r[31]) << 24, m = 255 & n[12] | (255 & n[13]) << 8 | (255 & n[14]) << 16 | (255 & n[15]) << 24, x = 0; x < 20; x += 2) o ^= (i = (v ^= (i = (p ^= (i = (c ^= (i = o + v | 0) << 7 | i >>> 25) + o | 0) << 9 | i >>> 23) + c | 0) << 13 | i >>> 19) + p | 0) << 18 | i >>> 14, f ^= (i = (s ^= (i = (y ^= (i = (d ^= (i = f + s | 0) << 7 | i >>> 25) + f | 0) << 9 | i >>> 23) + d | 0) << 13 | i >>> 19) + y | 0) << 18 | i >>> 14, b ^= (i = (l ^= (i = (a ^= (i = (g ^= (i = b + l | 0) << 7 | i >>> 25) + b | 0) << 9 | i >>> 23) + g | 0) << 13 | i >>> 19) + a | 0) << 18 | i >>> 14, m ^= (i = (w ^= (i = (h ^= (i = (u ^= (i = m + w | 0) << 7 | i >>> 25) + m | 0) << 9 | i >>> 23) + u | 0) << 13 | i >>> 19) + h | 0) << 18 | i >>> 14, o ^= (i = (u ^= (i = (a ^= (i = (s ^= (i = o + u | 0) << 7 | i >>> 25) + o | 0) << 9 | i >>> 23) + s | 0) << 13 | i >>> 19) + a | 0) << 18 | i >>> 14, f ^= (i = (c ^= (i = (h ^= (i = (l ^= (i = f + c | 0) << 7 | i >>> 25) + f | 0) << 9 | i >>> 23) + l | 0) << 13 | i >>> 19) + h | 0) << 18 | i >>> 14, b ^= (i = (d ^= (i = (p ^= (i = (w ^= (i = b + d | 0) << 7 | i >>> 25) + b | 0) << 9 | i >>> 23) + w | 0) << 13 | i >>> 19) + p | 0) << 18 | i >>> 14, m ^= (i = (g ^= (i = (y ^= (i = (v ^= (i = m + g | 0) << 7 | i >>> 25) + m | 0) << 9 | i >>> 23) + v | 0) << 13 | i >>> 19) + y | 0) << 18 | i >>> 14;
                        t[0] = o >>> 0 & 255, t[1] = o >>> 8 & 255, t[2] = o >>> 16 & 255, t[3] = o >>> 24 & 255, t[4] = f >>> 0 & 255, t[5] = f >>> 8 & 255, t[6] = f >>> 16 & 255, t[7] = f >>> 24 & 255, t[8] = b >>> 0 & 255, t[9] = b >>> 8 & 255, t[10] = b >>> 16 & 255, t[11] = b >>> 24 & 255, t[12] = m >>> 0 & 255, t[13] = m >>> 8 & 255, t[14] = m >>> 16 & 255, t[15] = m >>> 24 & 255, t[16] = l >>> 0 & 255, t[17] = l >>> 8 & 255, t[18] = l >>> 16 & 255, t[19] = l >>> 24 & 255, t[20] = h >>> 0 & 255, t[21] = h >>> 8 & 255, t[22] = h >>> 16 & 255, t[23] = h >>> 24 & 255, t[24] = p >>> 0 & 255, t[25] = p >>> 8 & 255, t[26] = p >>> 16 & 255, t[27] = p >>> 24 & 255, t[28] = d >>> 0 & 255, t[29] = d >>> 8 & 255, t[30] = d >>> 16 & 255, t[31] = d >>> 24 & 255
                    }(t, e, r, n)
                }
                var m = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);

                function x(t, e, r, n, i, o, s) {
                    var a, u, c = new Uint8Array(16),
                        f = new Uint8Array(64);
                    for (u = 0; u < 16; u++) c[u] = 0;
                    for (u = 0; u < 8; u++) c[u] = o[u];
                    for (; i >= 64;) {
                        for (y(f, c, s, m), u = 0; u < 64; u++) t[e + u] = r[n + u] ^ f[u];
                        for (a = 1, u = 8; u < 16; u++) a = a + (255 & c[u]) | 0, c[u] = 255 & a, a >>>= 8;
                        i -= 64, e += 64, n += 64
                    }
                    if (i > 0)
                        for (y(f, c, s, m), u = 0; u < i; u++) t[e + u] = r[n + u] ^ f[u];
                    return 0
                }

                function E(t, e, r, n, i) {
                    var o, s, a = new Uint8Array(16),
                        u = new Uint8Array(64);
                    for (s = 0; s < 16; s++) a[s] = 0;
                    for (s = 0; s < 8; s++) a[s] = n[s];
                    for (; r >= 64;) {
                        for (y(u, a, i, m), s = 0; s < 64; s++) t[e + s] = u[s];
                        for (o = 1, s = 8; s < 16; s++) o = o + (255 & a[s]) | 0, a[s] = 255 & o, o >>>= 8;
                        r -= 64, e += 64
                    }
                    if (r > 0)
                        for (y(u, a, i, m), s = 0; s < r; s++) t[e + s] = u[s];
                    return 0
                }

                function _(t, e, r, n, i) {
                    var o = new Uint8Array(32);
                    g(o, n, i, m);
                    for (var s = new Uint8Array(8), a = 0; a < 8; a++) s[a] = n[a + 16];
                    return E(t, e, r, s, o)
                }

                function k(t, e, r, n, i, o, s) {
                    var a = new Uint8Array(32);
                    g(a, o, s, m);
                    for (var u = new Uint8Array(8), c = 0; c < 8; c++) u[c] = o[c + 16];
                    return x(t, e, r, n, i, u, a)
                }
                var A = function(t) {
                    var e, r, n, i, o, s, a, u;
                    this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0, e = 255 & t[0] | (255 & t[1]) << 8, this.r[0] = 8191 & e, r = 255 & t[2] | (255 & t[3]) << 8, this.r[1] = 8191 & (e >>> 13 | r << 3), n = 255 & t[4] | (255 & t[5]) << 8, this.r[2] = 7939 & (r >>> 10 | n << 6), i = 255 & t[6] | (255 & t[7]) << 8, this.r[3] = 8191 & (n >>> 7 | i << 9), o = 255 & t[8] | (255 & t[9]) << 8, this.r[4] = 255 & (i >>> 4 | o << 12), this.r[5] = o >>> 1 & 8190, s = 255 & t[10] | (255 & t[11]) << 8, this.r[6] = 8191 & (o >>> 14 | s << 2), a = 255 & t[12] | (255 & t[13]) << 8, this.r[7] = 8065 & (s >>> 11 | a << 5), u = 255 & t[14] | (255 & t[15]) << 8, this.r[8] = 8191 & (a >>> 8 | u << 8), this.r[9] = u >>> 5 & 127, this.pad[0] = 255 & t[16] | (255 & t[17]) << 8, this.pad[1] = 255 & t[18] | (255 & t[19]) << 8, this.pad[2] = 255 & t[20] | (255 & t[21]) << 8, this.pad[3] = 255 & t[22] | (255 & t[23]) << 8, this.pad[4] = 255 & t[24] | (255 & t[25]) << 8, this.pad[5] = 255 & t[26] | (255 & t[27]) << 8, this.pad[6] = 255 & t[28] | (255 & t[29]) << 8, this.pad[7] = 255 & t[30] | (255 & t[31]) << 8
                };

                function S(t, e, r, n, i, o) {
                    var s = new A(o);
                    return s.update(r, n, i), s.finish(t, e), 0
                }

                function O(t, e, r, n, i, o) {
                    var s = new Uint8Array(16);
                    return S(s, 0, r, n, i, o), w(t, e, s, 0)
                }

                function U(t, e, r, n, i) {
                    var o;
                    if (r < 32) return -1;
                    for (k(t, 0, e, 0, r, n, i), S(t, 16, t, 32, r - 32, t), o = 0; o < 16; o++) t[o] = 0;
                    return 0
                }

                function M(t, e, r, n, i) {
                    var o, s = new Uint8Array(32);
                    if (r < 32) return -1;
                    if (_(s, 0, 32, n, i), 0 !== O(e, 16, e, 32, r - 32, s)) return -1;
                    for (k(t, 0, e, 0, r, n, i), o = 0; o < 32; o++) t[o] = 0;
                    return 0
                }

                function C(t, e) {
                    var r;
                    for (r = 0; r < 16; r++) t[r] = 0 | e[r]
                }

                function T(t) {
                    var e, r, n = 1;
                    for (e = 0; e < 16; e++) r = t[e] + n + 65535, n = Math.floor(r / 65536), t[e] = r - 65536 * n;
                    t[0] += n - 1 + 37 * (n - 1)
                }

                function B(t, e, r) {
                    for (var n, i = ~(r - 1), o = 0; o < 16; o++) n = i & (t[o] ^ e[o]), t[o] ^= n, e[o] ^= n
                }

                function j(t, r) {
                    var n, i, o, s = e(),
                        a = e();
                    for (n = 0; n < 16; n++) a[n] = r[n];
                    for (T(a), T(a), T(a), i = 0; i < 2; i++) {
                        for (s[0] = a[0] - 65517, n = 1; n < 15; n++) s[n] = a[n] - 65535 - (s[n - 1] >> 16 & 1), s[n - 1] &= 65535;
                        s[15] = a[15] - 32767 - (s[14] >> 16 & 1), o = s[15] >> 16 & 1, s[14] &= 65535, B(a, s, 1 - o)
                    }
                    for (n = 0; n < 16; n++) t[2 * n] = 255 & a[n], t[2 * n + 1] = a[n] >> 8
                }

                function P(t, e) {
                    var r = new Uint8Array(32),
                        n = new Uint8Array(32);
                    return j(r, t), j(n, e), v(r, 0, n, 0)
                }

                function N(t) {
                    var e = new Uint8Array(32);
                    return j(e, t), 1 & e[0]
                }

                function R(t, e) {
                    var r;
                    for (r = 0; r < 16; r++) t[r] = e[2 * r] + (e[2 * r + 1] << 8);
                    t[15] &= 32767
                }

                function F(t, e, r) {
                    for (var n = 0; n < 16; n++) t[n] = e[n] + r[n]
                }

                function z(t, e, r) {
                    for (var n = 0; n < 16; n++) t[n] = e[n] - r[n]
                }

                function I(t, e, r) {
                    var n, i, o = 0,
                        s = 0,
                        a = 0,
                        u = 0,
                        c = 0,
                        f = 0,
                        l = 0,
                        h = 0,
                        p = 0,
                        d = 0,
                        b = 0,
                        w = 0,
                        v = 0,
                        y = 0,
                        g = 0,
                        m = 0,
                        x = 0,
                        E = 0,
                        _ = 0,
                        k = 0,
                        A = 0,
                        S = 0,
                        O = 0,
                        U = 0,
                        M = 0,
                        C = 0,
                        T = 0,
                        B = 0,
                        j = 0,
                        P = 0,
                        N = 0,
                        R = r[0],
                        F = r[1],
                        z = r[2],
                        I = r[3],
                        L = r[4],
                        K = r[5],
                        D = r[6],
                        q = r[7],
                        Y = r[8],
                        V = r[9],
                        G = r[10],
                        Z = r[11],
                        W = r[12],
                        $ = r[13],
                        J = r[14],
                        H = r[15];
                    o += (n = e[0]) * R, s += n * F, a += n * z, u += n * I, c += n * L, f += n * K, l += n * D, h += n * q, p += n * Y, d += n * V, b += n * G, w += n * Z, v += n * W, y += n * $, g += n * J, m += n * H, s += (n = e[1]) * R, a += n * F, u += n * z, c += n * I, f += n * L, l += n * K, h += n * D, p += n * q, d += n * Y, b += n * V, w += n * G, v += n * Z, y += n * W, g += n * $, m += n * J, x += n * H, a += (n = e[2]) * R, u += n * F, c += n * z, f += n * I, l += n * L, h += n * K, p += n * D, d += n * q, b += n * Y, w += n * V, v += n * G, y += n * Z, g += n * W, m += n * $, x += n * J, E += n * H, u += (n = e[3]) * R, c += n * F, f += n * z, l += n * I, h += n * L, p += n * K, d += n * D, b += n * q, w += n * Y, v += n * V, y += n * G, g += n * Z, m += n * W, x += n * $, E += n * J, _ += n * H, c += (n = e[4]) * R, f += n * F, l += n * z, h += n * I, p += n * L, d += n * K, b += n * D, w += n * q, v += n * Y, y += n * V, g += n * G, m += n * Z, x += n * W, E += n * $, _ += n * J, k += n * H, f += (n = e[5]) * R, l += n * F, h += n * z, p += n * I, d += n * L, b += n * K, w += n * D, v += n * q, y += n * Y, g += n * V, m += n * G, x += n * Z, E += n * W, _ += n * $, k += n * J, A += n * H, l += (n = e[6]) * R, h += n * F, p += n * z, d += n * I, b += n * L, w += n * K, v += n * D, y += n * q, g += n * Y, m += n * V, x += n * G, E += n * Z, _ += n * W, k += n * $, A += n * J, S += n * H, h += (n = e[7]) * R, p += n * F, d += n * z, b += n * I, w += n * L, v += n * K, y += n * D, g += n * q, m += n * Y, x += n * V, E += n * G, _ += n * Z, k += n * W, A += n * $, S += n * J, O += n * H, p += (n = e[8]) * R, d += n * F, b += n * z, w += n * I, v += n * L, y += n * K, g += n * D, m += n * q, x += n * Y, E += n * V, _ += n * G, k += n * Z, A += n * W, S += n * $, O += n * J, U += n * H, d += (n = e[9]) * R, b += n * F, w += n * z, v += n * I, y += n * L, g += n * K, m += n * D, x += n * q, E += n * Y, _ += n * V, k += n * G, A += n * Z, S += n * W, O += n * $, U += n * J, M += n * H, b += (n = e[10]) * R, w += n * F, v += n * z, y += n * I, g += n * L, m += n * K, x += n * D, E += n * q, _ += n * Y, k += n * V, A += n * G, S += n * Z, O += n * W, U += n * $, M += n * J, C += n * H, w += (n = e[11]) * R, v += n * F, y += n * z, g += n * I, m += n * L, x += n * K, E += n * D, _ += n * q, k += n * Y, A += n * V, S += n * G, O += n * Z, U += n * W, M += n * $, C += n * J, T += n * H, v += (n = e[12]) * R, y += n * F, g += n * z, m += n * I, x += n * L, E += n * K, _ += n * D, k += n * q, A += n * Y, S += n * V, O += n * G, U += n * Z, M += n * W, C += n * $, T += n * J, B += n * H, y += (n = e[13]) * R, g += n * F, m += n * z, x += n * I, E += n * L, _ += n * K, k += n * D, A += n * q, S += n * Y, O += n * V, U += n * G, M += n * Z, C += n * W, T += n * $, B += n * J, j += n * H, g += (n = e[14]) * R, m += n * F, x += n * z, E += n * I, _ += n * L, k += n * K, A += n * D, S += n * q, O += n * Y, U += n * V, M += n * G, C += n * Z, T += n * W, B += n * $, j += n * J, P += n * H, m += (n = e[15]) * R, s += 38 * (E += n * z), a += 38 * (_ += n * I), u += 38 * (k += n * L), c += 38 * (A += n * K), f += 38 * (S += n * D), l += 38 * (O += n * q), h += 38 * (U += n * Y), p += 38 * (M += n * V), d += 38 * (C += n * G), b += 38 * (T += n * Z), w += 38 * (B += n * W), v += 38 * (j += n * $), y += 38 * (P += n * J), g += 38 * (N += n * H), o = (n = (o += 38 * (x += n * F)) + (i = 1) + 65535) - 65536 * (i = Math.floor(n / 65536)), s = (n = s + i + 65535) - 65536 * (i = Math.floor(n / 65536)), a = (n = a + i + 65535) - 65536 * (i = Math.floor(n / 65536)), u = (n = u + i + 65535) - 65536 * (i = Math.floor(n / 65536)), c = (n = c + i + 65535) - 65536 * (i = Math.floor(n / 65536)), f = (n = f + i + 65535) - 65536 * (i = Math.floor(n / 65536)), l = (n = l + i + 65535) - 65536 * (i = Math.floor(n / 65536)), h = (n = h + i + 65535) - 65536 * (i = Math.floor(n / 65536)), p = (n = p + i + 65535) - 65536 * (i = Math.floor(n / 65536)), d = (n = d + i + 65535) - 65536 * (i = Math.floor(n / 65536)), b = (n = b + i + 65535) - 65536 * (i = Math.floor(n / 65536)), w = (n = w + i + 65535) - 65536 * (i = Math.floor(n / 65536)), v = (n = v + i + 65535) - 65536 * (i = Math.floor(n / 65536)), y = (n = y + i + 65535) - 65536 * (i = Math.floor(n / 65536)), g = (n = g + i + 65535) - 65536 * (i = Math.floor(n / 65536)), m = (n = m + i + 65535) - 65536 * (i = Math.floor(n / 65536)), o = (n = (o += i - 1 + 37 * (i - 1)) + (i = 1) + 65535) - 65536 * (i = Math.floor(n / 65536)), s = (n = s + i + 65535) - 65536 * (i = Math.floor(n / 65536)), a = (n = a + i + 65535) - 65536 * (i = Math.floor(n / 65536)), u = (n = u + i + 65535) - 65536 * (i = Math.floor(n / 65536)), c = (n = c + i + 65535) - 65536 * (i = Math.floor(n / 65536)), f = (n = f + i + 65535) - 65536 * (i = Math.floor(n / 65536)), l = (n = l + i + 65535) - 65536 * (i = Math.floor(n / 65536)), h = (n = h + i + 65535) - 65536 * (i = Math.floor(n / 65536)), p = (n = p + i + 65535) - 65536 * (i = Math.floor(n / 65536)), d = (n = d + i + 65535) - 65536 * (i = Math.floor(n / 65536)), b = (n = b + i + 65535) - 65536 * (i = Math.floor(n / 65536)), w = (n = w + i + 65535) - 65536 * (i = Math.floor(n / 65536)), v = (n = v + i + 65535) - 65536 * (i = Math.floor(n / 65536)), y = (n = y + i + 65535) - 65536 * (i = Math.floor(n / 65536)), g = (n = g + i + 65535) - 65536 * (i = Math.floor(n / 65536)), m = (n = m + i + 65535) - 65536 * (i = Math.floor(n / 65536)), o += i - 1 + 37 * (i - 1), t[0] = o, t[1] = s, t[2] = a, t[3] = u, t[4] = c, t[5] = f, t[6] = l, t[7] = h, t[8] = p, t[9] = d, t[10] = b, t[11] = w, t[12] = v, t[13] = y, t[14] = g, t[15] = m
                }

                function L(t, e) {
                    I(t, e, e)
                }

                function K(t, r) {
                    var n, i = e();
                    for (n = 0; n < 16; n++) i[n] = r[n];
                    for (n = 253; n >= 0; n--) L(i, i), 2 !== n && 4 !== n && I(i, i, r);
                    for (n = 0; n < 16; n++) t[n] = i[n]
                }

                function D(t, r) {
                    var n, i = e();
                    for (n = 0; n < 16; n++) i[n] = r[n];
                    for (n = 250; n >= 0; n--) L(i, i), 1 !== n && I(i, i, r);
                    for (n = 0; n < 16; n++) t[n] = i[n]
                }

                function q(t, r, n) {
                    var i, o, s = new Uint8Array(32),
                        a = new Float64Array(80),
                        c = e(),
                        f = e(),
                        l = e(),
                        h = e(),
                        p = e(),
                        d = e();
                    for (o = 0; o < 31; o++) s[o] = r[o];
                    for (s[31] = 127 & r[31] | 64, s[0] &= 248, R(a, n), o = 0; o < 16; o++) f[o] = a[o], h[o] = c[o] = l[o] = 0;
                    for (c[0] = h[0] = 1, o = 254; o >= 0; --o) B(c, f, i = s[o >>> 3] >>> (7 & o) & 1), B(l, h, i), F(p, c, l), z(c, c, l), F(l, f, h), z(f, f, h), L(h, p), L(d, c), I(c, l, c), I(l, f, p), F(p, c, l), z(c, c, l), L(f, c), z(l, h, d), I(c, l, u), F(c, c, h), I(l, l, c), I(c, h, d), I(h, f, a), L(f, p), B(c, f, i), B(l, h, i);
                    for (o = 0; o < 16; o++) a[o + 16] = c[o], a[o + 32] = l[o], a[o + 48] = f[o], a[o + 64] = h[o];
                    var b = a.subarray(32),
                        w = a.subarray(16);
                    return K(b, b), I(w, w, b), j(t, w), 0
                }

                function Y(t, e) {
                    return q(t, e, o)
                }

                function V(t, e) {
                    return n(e, 32), Y(t, e)
                }

                function G(t, e, r) {
                    var n = new Uint8Array(32);
                    return q(n, r, e), g(t, i, n, m)
                }
                A.prototype.blocks = function(t, e, r) {
                    for (var n, i, o, s, a, u, c, f, l, h, p, d, b, w, v, y, g, m, x, E = this.fin ? 0 : 2048, _ = this.h[0], k = this.h[1], A = this.h[2], S = this.h[3], O = this.h[4], U = this.h[5], M = this.h[6], C = this.h[7], T = this.h[8], B = this.h[9], j = this.r[0], P = this.r[1], N = this.r[2], R = this.r[3], F = this.r[4], z = this.r[5], I = this.r[6], L = this.r[7], K = this.r[8], D = this.r[9]; r >= 16;) h = l = 0, h += (_ += 8191 & (n = 255 & t[e + 0] | (255 & t[e + 1]) << 8)) * j, h += (k += 8191 & (n >>> 13 | (i = 255 & t[e + 2] | (255 & t[e + 3]) << 8) << 3)) * (5 * D), h += (A += 8191 & (i >>> 10 | (o = 255 & t[e + 4] | (255 & t[e + 5]) << 8) << 6)) * (5 * K), h += (S += 8191 & (o >>> 7 | (s = 255 & t[e + 6] | (255 & t[e + 7]) << 8) << 9)) * (5 * L), l = (h += (O += 8191 & (s >>> 4 | (a = 255 & t[e + 8] | (255 & t[e + 9]) << 8) << 12)) * (5 * I)) >>> 13, h &= 8191, h += (U += a >>> 1 & 8191) * (5 * z), h += (M += 8191 & (a >>> 14 | (u = 255 & t[e + 10] | (255 & t[e + 11]) << 8) << 2)) * (5 * F), h += (C += 8191 & (u >>> 11 | (c = 255 & t[e + 12] | (255 & t[e + 13]) << 8) << 5)) * (5 * R), h += (T += 8191 & (c >>> 8 | (f = 255 & t[e + 14] | (255 & t[e + 15]) << 8) << 8)) * (5 * N), p = l += (h += (B += f >>> 5 | E) * (5 * P)) >>> 13, p += _ * P, p += k * j, p += A * (5 * D), p += S * (5 * K), l = (p += O * (5 * L)) >>> 13, p &= 8191, p += U * (5 * I), p += M * (5 * z), p += C * (5 * F), p += T * (5 * R), l += (p += B * (5 * N)) >>> 13, p &= 8191, d = l, d += _ * N, d += k * P, d += A * j, d += S * (5 * D), l = (d += O * (5 * K)) >>> 13, d &= 8191, d += U * (5 * L), d += M * (5 * I), d += C * (5 * z), d += T * (5 * F), b = l += (d += B * (5 * R)) >>> 13, b += _ * R, b += k * N, b += A * P, b += S * j, l = (b += O * (5 * D)) >>> 13, b &= 8191, b += U * (5 * K), b += M * (5 * L), b += C * (5 * I), b += T * (5 * z), w = l += (b += B * (5 * F)) >>> 13, w += _ * F, w += k * R, w += A * N, w += S * P, l = (w += O * j) >>> 13, w &= 8191, w += U * (5 * D), w += M * (5 * K), w += C * (5 * L), w += T * (5 * I), v = l += (w += B * (5 * z)) >>> 13, v += _ * z, v += k * F, v += A * R, v += S * N, l = (v += O * P) >>> 13, v &= 8191, v += U * j, v += M * (5 * D), v += C * (5 * K), v += T * (5 * L), y = l += (v += B * (5 * I)) >>> 13, y += _ * I, y += k * z, y += A * F, y += S * R, l = (y += O * N) >>> 13, y &= 8191, y += U * P, y += M * j, y += C * (5 * D), y += T * (5 * K), g = l += (y += B * (5 * L)) >>> 13, g += _ * L, g += k * I, g += A * z, g += S * F, l = (g += O * R) >>> 13, g &= 8191, g += U * N, g += M * P, g += C * j, g += T * (5 * D), m = l += (g += B * (5 * K)) >>> 13, m += _ * K, m += k * L, m += A * I, m += S * z, l = (m += O * F) >>> 13, m &= 8191, m += U * R, m += M * N, m += C * P, m += T * j, x = l += (m += B * (5 * D)) >>> 13, x += _ * D, x += k * K, x += A * L, x += S * I, l = (x += O * z) >>> 13, x &= 8191, x += U * F, x += M * R, x += C * N, x += T * P, _ = h = 8191 & (l = (l = ((l += (x += B * j) >>> 13) << 2) + l | 0) + (h &= 8191) | 0), k = p += l >>>= 13, A = d &= 8191, S = b &= 8191, O = w &= 8191, U = v &= 8191, M = y &= 8191, C = g &= 8191, T = m &= 8191, B = x &= 8191, e += 16, r -= 16;
                    this.h[0] = _, this.h[1] = k, this.h[2] = A, this.h[3] = S, this.h[4] = O, this.h[5] = U, this.h[6] = M, this.h[7] = C, this.h[8] = T, this.h[9] = B
                }, A.prototype.finish = function(t, e) {
                    var r, n, i, o, s = new Uint16Array(10);
                    if (this.leftover) {
                        for (o = this.leftover, this.buffer[o++] = 1; o < 16; o++) this.buffer[o] = 0;
                        this.fin = 1, this.blocks(this.buffer, 0, 16)
                    }
                    for (r = this.h[1] >>> 13, this.h[1] &= 8191, o = 2; o < 10; o++) this.h[o] += r, r = this.h[o] >>> 13, this.h[o] &= 8191;
                    for (this.h[0] += 5 * r, r = this.h[0] >>> 13, this.h[0] &= 8191, this.h[1] += r, r = this.h[1] >>> 13, this.h[1] &= 8191, this.h[2] += r, s[0] = this.h[0] + 5, r = s[0] >>> 13, s[0] &= 8191, o = 1; o < 10; o++) s[o] = this.h[o] + r, r = s[o] >>> 13, s[o] &= 8191;
                    for (s[9] -= 8192, n = (1 ^ r) - 1, o = 0; o < 10; o++) s[o] &= n;
                    for (n = ~n, o = 0; o < 10; o++) this.h[o] = this.h[o] & n | s[o];
                    for (this.h[0] = 65535 & (this.h[0] | this.h[1] << 13), this.h[1] = 65535 & (this.h[1] >>> 3 | this.h[2] << 10), this.h[2] = 65535 & (this.h[2] >>> 6 | this.h[3] << 7), this.h[3] = 65535 & (this.h[3] >>> 9 | this.h[4] << 4), this.h[4] = 65535 & (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14), this.h[5] = 65535 & (this.h[6] >>> 2 | this.h[7] << 11), this.h[6] = 65535 & (this.h[7] >>> 5 | this.h[8] << 8), this.h[7] = 65535 & (this.h[8] >>> 8 | this.h[9] << 5), i = this.h[0] + this.pad[0], this.h[0] = 65535 & i, o = 1; o < 8; o++) i = (this.h[o] + this.pad[o] | 0) + (i >>> 16) | 0, this.h[o] = 65535 & i;
                    t[e + 0] = this.h[0] >>> 0 & 255, t[e + 1] = this.h[0] >>> 8 & 255, t[e + 2] = this.h[1] >>> 0 & 255, t[e + 3] = this.h[1] >>> 8 & 255, t[e + 4] = this.h[2] >>> 0 & 255, t[e + 5] = this.h[2] >>> 8 & 255, t[e + 6] = this.h[3] >>> 0 & 255, t[e + 7] = this.h[3] >>> 8 & 255, t[e + 8] = this.h[4] >>> 0 & 255, t[e + 9] = this.h[4] >>> 8 & 255, t[e + 10] = this.h[5] >>> 0 & 255, t[e + 11] = this.h[5] >>> 8 & 255, t[e + 12] = this.h[6] >>> 0 & 255, t[e + 13] = this.h[6] >>> 8 & 255, t[e + 14] = this.h[7] >>> 0 & 255, t[e + 15] = this.h[7] >>> 8 & 255
                }, A.prototype.update = function(t, e, r) {
                    var n, i;
                    if (this.leftover) {
                        for ((i = 16 - this.leftover) > r && (i = r), n = 0; n < i; n++) this.buffer[this.leftover + n] = t[e + n];
                        if (r -= i, e += i, this.leftover += i, this.leftover < 16) return;
                        this.blocks(this.buffer, 0, 16), this.leftover = 0
                    }
                    if (r >= 16 && (i = r - r % 16, this.blocks(t, e, i), e += i, r -= i), r) {
                        for (n = 0; n < r; n++) this.buffer[this.leftover + n] = t[e + n];
                        this.leftover += r
                    }
                };
                var Z = U,
                    W = M,
                    $ = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

                function J(t, e, r, n) {
                    for (var i, o, s, a, u, c, f, l, h, p, d, b, w, v, y, g, m, x, E, _, k, A, S, O, U, M, C = new Int32Array(16), T = new Int32Array(16), B = t[0], j = t[1], P = t[2], N = t[3], R = t[4], F = t[5], z = t[6], I = t[7], L = e[0], K = e[1], D = e[2], q = e[3], Y = e[4], V = e[5], G = e[6], Z = e[7], W = 0; n >= 128;) {
                        for (E = 0; E < 16; E++) _ = 8 * E + W, C[E] = r[_ + 0] << 24 | r[_ + 1] << 16 | r[_ + 2] << 8 | r[_ + 3], T[E] = r[_ + 4] << 24 | r[_ + 5] << 16 | r[_ + 6] << 8 | r[_ + 7];
                        for (E = 0; E < 80; E++)
                            if (i = B, o = j, s = P, a = N, u = R, c = F, f = z, h = L, p = K, d = D, b = q, w = Y, v = V, y = G, S = 65535 & (A = Z), O = A >>> 16, U = 65535 & (k = I), M = k >>> 16, S += 65535 & (A = (Y >>> 14 | R << 18) ^ (Y >>> 18 | R << 14) ^ (R >>> 9 | Y << 23)), O += A >>> 16, U += 65535 & (k = (R >>> 14 | Y << 18) ^ (R >>> 18 | Y << 14) ^ (Y >>> 9 | R << 23)), M += k >>> 16, S += 65535 & (A = Y & V ^ ~Y & G), O += A >>> 16, U += 65535 & (k = R & F ^ ~R & z), M += k >>> 16, S += 65535 & (A = $[2 * E + 1]), O += A >>> 16, U += 65535 & (k = $[2 * E]), M += k >>> 16, k = C[E % 16], O += (A = T[E % 16]) >>> 16, U += 65535 & k, M += k >>> 16, U += (O += (S += 65535 & A) >>> 16) >>> 16, S = 65535 & (A = x = 65535 & S | O << 16), O = A >>> 16, U = 65535 & (k = m = 65535 & U | (M += U >>> 16) << 16), M = k >>> 16, S += 65535 & (A = (L >>> 28 | B << 4) ^ (B >>> 2 | L << 30) ^ (B >>> 7 | L << 25)), O += A >>> 16, U += 65535 & (k = (B >>> 28 | L << 4) ^ (L >>> 2 | B << 30) ^ (L >>> 7 | B << 25)), M += k >>> 16, O += (A = L & K ^ L & D ^ K & D) >>> 16, U += 65535 & (k = B & j ^ B & P ^ j & P), M += k >>> 16, l = 65535 & (U += (O += (S += 65535 & A) >>> 16) >>> 16) | (M += U >>> 16) << 16, g = 65535 & S | O << 16, S = 65535 & (A = b), O = A >>> 16, U = 65535 & (k = a), M = k >>> 16, O += (A = x) >>> 16, U += 65535 & (k = m), M += k >>> 16, j = i, P = o, N = s, R = a = 65535 & (U += (O += (S += 65535 & A) >>> 16) >>> 16) | (M += U >>> 16) << 16, F = u, z = c, I = f, B = l, K = h, D = p, q = d, Y = b = 65535 & S | O << 16, V = w, G = v, Z = y, L = g, E % 16 == 15)
                                for (_ = 0; _ < 16; _++) k = C[_], S = 65535 & (A = T[_]), O = A >>> 16, U = 65535 & k, M = k >>> 16, k = C[(_ + 9) % 16], S += 65535 & (A = T[(_ + 9) % 16]), O += A >>> 16, U += 65535 & k, M += k >>> 16, m = C[(_ + 1) % 16], S += 65535 & (A = ((x = T[(_ + 1) % 16]) >>> 1 | m << 31) ^ (x >>> 8 | m << 24) ^ (x >>> 7 | m << 25)), O += A >>> 16, U += 65535 & (k = (m >>> 1 | x << 31) ^ (m >>> 8 | x << 24) ^ m >>> 7), M += k >>> 16, m = C[(_ + 14) % 16], O += (A = ((x = T[(_ + 14) % 16]) >>> 19 | m << 13) ^ (m >>> 29 | x << 3) ^ (x >>> 6 | m << 26)) >>> 16, U += 65535 & (k = (m >>> 19 | x << 13) ^ (x >>> 29 | m << 3) ^ m >>> 6), M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, C[_] = 65535 & U | M << 16, T[_] = 65535 & S | O << 16;
                        S = 65535 & (A = L), O = A >>> 16, U = 65535 & (k = B), M = k >>> 16, k = t[0], O += (A = e[0]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[0] = B = 65535 & U | M << 16, e[0] = L = 65535 & S | O << 16, S = 65535 & (A = K), O = A >>> 16, U = 65535 & (k = j), M = k >>> 16, k = t[1], O += (A = e[1]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[1] = j = 65535 & U | M << 16, e[1] = K = 65535 & S | O << 16, S = 65535 & (A = D), O = A >>> 16, U = 65535 & (k = P), M = k >>> 16, k = t[2], O += (A = e[2]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[2] = P = 65535 & U | M << 16, e[2] = D = 65535 & S | O << 16, S = 65535 & (A = q), O = A >>> 16, U = 65535 & (k = N), M = k >>> 16, k = t[3], O += (A = e[3]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[3] = N = 65535 & U | M << 16, e[3] = q = 65535 & S | O << 16, S = 65535 & (A = Y), O = A >>> 16, U = 65535 & (k = R), M = k >>> 16, k = t[4], O += (A = e[4]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[4] = R = 65535 & U | M << 16, e[4] = Y = 65535 & S | O << 16, S = 65535 & (A = V), O = A >>> 16, U = 65535 & (k = F), M = k >>> 16, k = t[5], O += (A = e[5]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[5] = F = 65535 & U | M << 16, e[5] = V = 65535 & S | O << 16, S = 65535 & (A = G), O = A >>> 16, U = 65535 & (k = z), M = k >>> 16, k = t[6], O += (A = e[6]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[6] = z = 65535 & U | M << 16, e[6] = G = 65535 & S | O << 16, S = 65535 & (A = Z), O = A >>> 16, U = 65535 & (k = I), M = k >>> 16, k = t[7], O += (A = e[7]) >>> 16, U += 65535 & k, M += k >>> 16, M += (U += (O += (S += 65535 & A) >>> 16) >>> 16) >>> 16, t[7] = I = 65535 & U | M << 16, e[7] = Z = 65535 & S | O << 16, W += 128, n -= 128
                    }
                    return n
                }

                function H(t, e, r) {
                    var n, i = new Int32Array(8),
                        o = new Int32Array(8),
                        s = new Uint8Array(256),
                        a = r;
                    for (i[0] = 1779033703, i[1] = 3144134277, i[2] = 1013904242, i[3] = 2773480762, i[4] = 1359893119, i[5] = 2600822924, i[6] = 528734635, i[7] = 1541459225, o[0] = 4089235720, o[1] = 2227873595, o[2] = 4271175723, o[3] = 1595750129, o[4] = 2917565137, o[5] = 725511199, o[6] = 4215389547, o[7] = 327033209, J(i, o, e, r), r %= 128, n = 0; n < r; n++) s[n] = e[a - r + n];
                    for (s[r] = 128, s[(r = 256 - 128 * (r < 112 ? 1 : 0)) - 9] = 0, d(s, r - 8, a / 536870912 | 0, a << 3), J(i, o, s, r), n = 0; n < 8; n++) d(t, 8 * n, i[n], o[n]);
                    return 0
                }

                function X(t, r) {
                    var n = e(),
                        i = e(),
                        o = e(),
                        s = e(),
                        a = e(),
                        u = e(),
                        c = e(),
                        l = e(),
                        h = e();
                    z(n, t[1], t[0]), z(h, r[1], r[0]), I(n, n, h), F(i, t[0], t[1]), F(h, r[0], r[1]), I(i, i, h), I(o, t[3], r[3]), I(o, o, f), I(s, t[2], r[2]), F(s, s, s), z(a, i, n), z(u, s, o), F(c, s, o), F(l, i, n), I(t[0], a, u), I(t[1], l, c), I(t[2], c, u), I(t[3], a, l)
                }

                function Q(t, e, r) {
                    var n;
                    for (n = 0; n < 4; n++) B(t[n], e[n], r)
                }

                function tt(t, r) {
                    var n = e(),
                        i = e(),
                        o = e();
                    K(o, r[2]), I(n, r[0], o), I(i, r[1], o), j(t, i), t[31] ^= N(n) << 7
                }

                function et(t, e, r) {
                    var n, i;
                    for (C(t[0], s), C(t[1], a), C(t[2], a), C(t[3], s), i = 255; i >= 0; --i) Q(t, e, n = r[i / 8 | 0] >> (7 & i) & 1), X(e, t), X(t, t), Q(t, e, n)
                }

                function rt(t, r) {
                    var n = [e(), e(), e(), e()];
                    C(n[0], l), C(n[1], h), C(n[2], a), I(n[3], l, h), et(t, n, r)
                }

                function nt(t, r, i) {
                    var o, s = new Uint8Array(64),
                        a = [e(), e(), e(), e()];
                    for (i || n(r, 32), H(s, r, 32), s[0] &= 248, s[31] &= 127, s[31] |= 64, rt(a, s), tt(t, a), o = 0; o < 32; o++) r[o + 32] = t[o];
                    return 0
                }
                var it = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);

                function ot(t, e) {
                    var r, n, i, o;
                    for (n = 63; n >= 32; --n) {
                        for (r = 0, i = n - 32, o = n - 12; i < o; ++i) e[i] += r - 16 * e[n] * it[i - (n - 32)], r = Math.floor((e[i] + 128) / 256), e[i] -= 256 * r;
                        e[i] += r, e[n] = 0
                    }
                    for (r = 0, i = 0; i < 32; i++) e[i] += r - (e[31] >> 4) * it[i], r = e[i] >> 8, e[i] &= 255;
                    for (i = 0; i < 32; i++) e[i] -= r * it[i];
                    for (n = 0; n < 32; n++) e[n + 1] += e[n] >> 8, t[n] = 255 & e[n]
                }

                function st(t) {
                    var e, r = new Float64Array(64);
                    for (e = 0; e < 64; e++) r[e] = t[e];
                    for (e = 0; e < 64; e++) t[e] = 0;
                    ot(t, r)
                }

                function at(t, r, n, i) {
                    var o, s, a = new Uint8Array(64),
                        u = new Uint8Array(64),
                        c = new Uint8Array(64),
                        f = new Float64Array(64),
                        l = [e(), e(), e(), e()];
                    H(a, i, 32), a[0] &= 248, a[31] &= 127, a[31] |= 64;
                    var h = n + 64;
                    for (o = 0; o < n; o++) t[64 + o] = r[o];
                    for (o = 0; o < 32; o++) t[32 + o] = a[32 + o];
                    for (H(c, t.subarray(32), n + 32), st(c), rt(l, c), tt(t, l), o = 32; o < 64; o++) t[o] = i[o];
                    for (H(u, t, n + 64), st(u), o = 0; o < 64; o++) f[o] = 0;
                    for (o = 0; o < 32; o++) f[o] = c[o];
                    for (o = 0; o < 32; o++)
                        for (s = 0; s < 32; s++) f[o + s] += u[o] * a[s];
                    return ot(t.subarray(32), f), h
                }

                function ut(t, r, n, i) {
                    var o, u = new Uint8Array(32),
                        f = new Uint8Array(64),
                        l = [e(), e(), e(), e()],
                        h = [e(), e(), e(), e()];
                    if (n < 64) return -1;
                    if (function(t, r) {
                            var n = e(),
                                i = e(),
                                o = e(),
                                u = e(),
                                f = e(),
                                l = e(),
                                h = e();
                            return C(t[2], a), R(t[1], r), L(o, t[1]), I(u, o, c), z(o, o, t[2]), F(u, t[2], u), L(f, u), L(l, f), I(h, l, f), I(n, h, o), I(n, n, u), D(n, n), I(n, n, o), I(n, n, u), I(n, n, u), I(t[0], n, u), L(i, t[0]), I(i, i, u), P(i, o) && I(t[0], t[0], p), L(i, t[0]), I(i, i, u), P(i, o) ? -1 : (N(t[0]) === r[31] >> 7 && z(t[0], s, t[0]), I(t[3], t[0], t[1]), 0)
                        }(h, i)) return -1;
                    for (o = 0; o < n; o++) t[o] = r[o];
                    for (o = 0; o < 32; o++) t[o + 32] = i[o];
                    if (H(f, t, n), st(f), et(l, h, f), rt(h, r.subarray(32)), X(l, h), tt(u, l), n -= 64, v(r, 0, u, 0)) {
                        for (o = 0; o < n; o++) t[o] = 0;
                        return -1
                    }
                    for (o = 0; o < n; o++) t[o] = r[o + 64];
                    return n
                }
                var ct, ft = 64,
                    lt = 32,
                    ht = 64;

                function pt(t, e) {
                    if (32 !== t.length) throw new Error("bad key size");
                    if (24 !== e.length) throw new Error("bad nonce size")
                }

                function dt() {
                    for (var t = 0; t < arguments.length; t++)
                        if (!(arguments[t] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array")
                }

                function bt(t) {
                    for (var e = 0; e < t.length; e++) t[e] = 0
                }
                t.lowlevel = {
                    crypto_core_hsalsa20: g,
                    crypto_stream_xor: k,
                    crypto_stream: _,
                    crypto_stream_salsa20_xor: x,
                    crypto_stream_salsa20: E,
                    crypto_onetimeauth: S,
                    crypto_onetimeauth_verify: O,
                    crypto_verify_16: w,
                    crypto_verify_32: v,
                    crypto_secretbox: U,
                    crypto_secretbox_open: M,
                    crypto_scalarmult: q,
                    crypto_scalarmult_base: Y,
                    crypto_box_beforenm: G,
                    crypto_box_afternm: Z,
                    crypto_box: function(t, e, r, n, i, o) {
                        var s = new Uint8Array(32);
                        return G(s, i, o), Z(t, e, r, n, s)
                    },
                    crypto_box_open: function(t, e, r, n, i, o) {
                        var s = new Uint8Array(32);
                        return G(s, i, o), W(t, e, r, n, s)
                    },
                    crypto_box_keypair: V,
                    crypto_hash: H,
                    crypto_sign: at,
                    crypto_sign_keypair: nt,
                    crypto_sign_open: ut,
                    crypto_secretbox_KEYBYTES: 32,
                    crypto_secretbox_NONCEBYTES: 24,
                    crypto_secretbox_ZEROBYTES: 32,
                    crypto_secretbox_BOXZEROBYTES: 16,
                    crypto_scalarmult_BYTES: 32,
                    crypto_scalarmult_SCALARBYTES: 32,
                    crypto_box_PUBLICKEYBYTES: 32,
                    crypto_box_SECRETKEYBYTES: 32,
                    crypto_box_BEFORENMBYTES: 32,
                    crypto_box_NONCEBYTES: 24,
                    crypto_box_ZEROBYTES: 32,
                    crypto_box_BOXZEROBYTES: 16,
                    crypto_sign_BYTES: ft,
                    crypto_sign_PUBLICKEYBYTES: lt,
                    crypto_sign_SECRETKEYBYTES: ht,
                    crypto_sign_SEEDBYTES: 32,
                    crypto_hash_BYTES: 64,
                    gf: e,
                    D: c,
                    L: it,
                    pack25519: j,
                    unpack25519: R,
                    M: I,
                    A: F,
                    S: L,
                    Z: z,
                    pow2523: D,
                    add: X,
                    set25519: C,
                    modL: ot,
                    scalarmult: et,
                    scalarbase: rt
                }, t.randomBytes = function(t) {
                    var e = new Uint8Array(t);
                    return n(e, t), e
                }, t.secretbox = function(t, e, r) {
                    dt(t, e, r), pt(r, e);
                    for (var n = new Uint8Array(32 + t.length), i = new Uint8Array(n.length), o = 0; o < t.length; o++) n[o + 32] = t[o];
                    return U(i, n, n.length, e, r), i.subarray(16)
                }, t.secretbox.open = function(t, e, r) {
                    dt(t, e, r), pt(r, e);
                    for (var n = new Uint8Array(16 + t.length), i = new Uint8Array(n.length), o = 0; o < t.length; o++) n[o + 16] = t[o];
                    return n.length < 32 || 0 !== M(i, n, n.length, e, r) ? null : i.subarray(32)
                }, t.secretbox.keyLength = 32, t.secretbox.nonceLength = 24, t.secretbox.overheadLength = 16, t.scalarMult = function(t, e) {
                    if (dt(t, e), 32 !== t.length) throw new Error("bad n size");
                    if (32 !== e.length) throw new Error("bad p size");
                    var r = new Uint8Array(32);
                    return q(r, t, e), r
                }, t.scalarMult.base = function(t) {
                    if (dt(t), 32 !== t.length) throw new Error("bad n size");
                    var e = new Uint8Array(32);
                    return Y(e, t), e
                }, t.scalarMult.scalarLength = 32, t.scalarMult.groupElementLength = 32, t.box = function(e, r, n, i) {
                    var o = t.box.before(n, i);
                    return t.secretbox(e, r, o)
                }, t.box.before = function(t, e) {
                    dt(t, e),
                        function(t, e) {
                            if (32 !== t.length) throw new Error("bad public key size");
                            if (32 !== e.length) throw new Error("bad secret key size")
                        }(t, e);
                    var r = new Uint8Array(32);
                    return G(r, t, e), r
                }, t.box.after = t.secretbox, t.box.open = function(e, r, n, i) {
                    var o = t.box.before(n, i);
                    return t.secretbox.open(e, r, o)
                }, t.box.open.after = t.secretbox.open, t.box.keyPair = function() {
                    var t = new Uint8Array(32),
                        e = new Uint8Array(32);
                    return V(t, e), {
                        publicKey: t,
                        secretKey: e
                    }
                }, t.box.keyPair.fromSecretKey = function(t) {
                    if (dt(t), 32 !== t.length) throw new Error("bad secret key size");
                    var e = new Uint8Array(32);
                    return Y(e, t), {
                        publicKey: e,
                        secretKey: new Uint8Array(t)
                    }
                }, t.box.publicKeyLength = 32, t.box.secretKeyLength = 32, t.box.sharedKeyLength = 32, t.box.nonceLength = 24, t.box.overheadLength = t.secretbox.overheadLength, t.sign = function(t, e) {
                    if (dt(t, e), e.length !== ht) throw new Error("bad secret key size");
                    var r = new Uint8Array(ft + t.length);
                    return at(r, t, t.length, e), r
                }, t.sign.open = function(t, e) {
                    if (dt(t, e), e.length !== lt) throw new Error("bad public key size");
                    var r = new Uint8Array(t.length),
                        n = ut(r, t, t.length, e);
                    if (n < 0) return null;
                    for (var i = new Uint8Array(n), o = 0; o < i.length; o++) i[o] = r[o];
                    return i
                }, t.sign.detached = function(e, r) {
                    for (var n = t.sign(e, r), i = new Uint8Array(ft), o = 0; o < i.length; o++) i[o] = n[o];
                    return i
                }, t.sign.detached.verify = function(t, e, r) {
                    if (dt(t, e, r), e.length !== ft) throw new Error("bad signature size");
                    if (r.length !== lt) throw new Error("bad public key size");
                    var n, i = new Uint8Array(ft + t.length),
                        o = new Uint8Array(ft + t.length);
                    for (n = 0; n < ft; n++) i[n] = e[n];
                    for (n = 0; n < t.length; n++) i[n + ft] = t[n];
                    return ut(o, i, i.length, r) >= 0
                }, t.sign.keyPair = function() {
                    var t = new Uint8Array(lt),
                        e = new Uint8Array(ht);
                    return nt(t, e), {
                        publicKey: t,
                        secretKey: e
                    }
                }, t.sign.keyPair.fromSecretKey = function(t) {
                    if (dt(t), t.length !== ht) throw new Error("bad secret key size");
                    for (var e = new Uint8Array(lt), r = 0; r < e.length; r++) e[r] = t[32 + r];
                    return {
                        publicKey: e,
                        secretKey: new Uint8Array(t)
                    }
                }, t.sign.keyPair.fromSeed = function(t) {
                    if (dt(t), 32 !== t.length) throw new Error("bad seed size");
                    for (var e = new Uint8Array(lt), r = new Uint8Array(ht), n = 0; n < 32; n++) r[n] = t[n];
                    return nt(e, r, !0), {
                        publicKey: e,
                        secretKey: r
                    }
                }, t.sign.publicKeyLength = lt, t.sign.secretKeyLength = ht, t.sign.seedLength = 32, t.sign.signatureLength = ft, t.hash = function(t) {
                    dt(t);
                    var e = new Uint8Array(64);
                    return H(e, t, t.length), e
                }, t.hash.hashLength = 64, t.verify = function(t, e) {
                    return dt(t, e), 0 !== t.length && 0 !== e.length && t.length === e.length && 0 === b(t, 0, e, 0, t.length)
                }, t.setPRNG = function(t) {
                    n = t
                }, (ct = "undefined" != typeof self ? self.crypto || self.msCrypto : null) && ct.getRandomValues ? t.setPRNG((function(t, e) {
                    var r, n = new Uint8Array(e);
                    for (r = 0; r < e; r += 65536) ct.getRandomValues(n.subarray(r, r + Math.min(e - r, 65536)));
                    for (r = 0; r < e; r++) t[r] = n[r];
                    bt(n)
                })) : (ct = r(5024)) && ct.randomBytes && t.setPRNG((function(t, e) {
                    var r, n = ct.randomBytes(e);
                    for (r = 0; r < e; r++) t[r] = n[r];
                    bt(n)
                }))
            }(t.exports ? t.exports : self.nacl = self.nacl || {})
        },
        2238: function(t, e, r) {
            var n;
            ! function(i, o) {
                "use strict";
                var s = "function",
                    a = "undefined",
                    u = "object",
                    c = "string",
                    f = "model",
                    l = "name",
                    h = "type",
                    p = "vendor",
                    d = "version",
                    b = "architecture",
                    w = "console",
                    v = "mobile",
                    y = "tablet",
                    g = "smarttv",
                    m = "wearable",
                    x = "embedded",
                    E = {
                        extend: function(t, e) {
                            var r = {};
                            for (var n in t) e[n] && e[n].length % 2 == 0 ? r[n] = e[n].concat(t[n]) : r[n] = t[n];
                            return r
                        },
                        has: function(t, e) {
                            return typeof t === c && -1 !== e.toLowerCase().indexOf(t.toLowerCase())
                        },
                        lowerize: function(t) {
                            return t.toLowerCase()
                        },
                        major: function(t) {
                            return typeof t === c ? t.replace(/[^\d\.]/g, "").split(".")[0] : o
                        },
                        trim: function(t, e) {
                            return t = t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""), typeof e === a ? t : t.substring(0, 255)
                        }
                    },
                    _ = {
                        rgx: function(t, e) {
                            for (var r, n, i, a, c, f, l = 0; l < e.length && !c;) {
                                var h = e[l],
                                    p = e[l + 1];
                                for (r = n = 0; r < h.length && !c;)
                                    if (c = h[r++].exec(t))
                                        for (i = 0; i < p.length; i++) f = c[++n], typeof(a = p[i]) === u && a.length > 0 ? 2 == a.length ? typeof a[1] == s ? this[a[0]] = a[1].call(this, f) : this[a[0]] = a[1] : 3 == a.length ? typeof a[1] !== s || a[1].exec && a[1].test ? this[a[0]] = f ? f.replace(a[1], a[2]) : o : this[a[0]] = f ? a[1].call(this, f, a[2]) : o : 4 == a.length && (this[a[0]] = f ? a[3].call(this, f.replace(a[1], a[2])) : o) : this[a] = f || o;
                                l += 2
                            }
                        },
                        str: function(t, e) {
                            for (var r in e)
                                if (typeof e[r] === u && e[r].length > 0) {
                                    for (var n = 0; n < e[r].length; n++)
                                        if (E.has(e[r][n], t)) return "?" === r ? o : r
                                } else if (E.has(e[r], t)) return "?" === r ? o : r;
                            return t
                        }
                    },
                    k = {
                        browser: {
                            oldSafari: {
                                version: {
                                    "1.0": "/8",
                                    1.2: "/1",
                                    1.3: "/3",
                                    "2.0": "/412",
                                    "2.0.2": "/416",
                                    "2.0.3": "/417",
                                    "2.0.4": "/419",
                                    "?": "/"
                                }
                            },
                            oldEdge: {
                                version: {
                                    .1: "12.",
                                    21: "13.",
                                    31: "14.",
                                    39: "15.",
                                    41: "16.",
                                    42: "17.",
                                    44: "18."
                                }
                            }
                        },
                        os: {
                            windows: {
                                version: {
                                    ME: "4.90",
                                    "NT 3.11": "NT3.51",
                                    "NT 4.0": "NT4.0",
                                    2e3: "NT 5.0",
                                    XP: ["NT 5.1", "NT 5.2"],
                                    Vista: "NT 6.0",
                                    7: "NT 6.1",
                                    8: "NT 6.2",
                                    8.1: "NT 6.3",
                                    10: ["NT 6.4", "NT 10.0"],
                                    RT: "ARM"
                                }
                            }
                        }
                    },
                    A = {
                        browser: [
                            [/\b(?:crmo|crios)\/([\w\.]+)/i],
                            [d, [l, "Chrome"]],
                            [/edg(?:e|ios|a)?\/([\w\.]+)/i],
                            [d, [l, "Edge"]],
                            [/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]{3,6})\b.+version\/([\w\.-]+)/i, /(opera)(?:.+version\/|[\/\s]+)([\w\.]+)/i],
                            [l, d],
                            [/opios[\/\s]+([\w\.]+)/i],
                            [d, [l, "Opera Mini"]],
                            [/\sopr\/([\w\.]+)/i],
                            [d, [l, "Opera"]],
                            [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i, /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i, /(ba?idubrowser)[\/\s]?([\w\.]+)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i, /(rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([\w\.]+)/i, /(weibo)__([\d\.]+)/i],
                            [l, d],
                            [/(?:[\s\/]uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],
                            [d, [l, "UCBrowser"]],
                            [/(?:windowswechat)?\sqbcore\/([\w\.]+)\b.*(?:windowswechat)?/i],
                            [d, [l, "WeChat(Win) Desktop"]],
                            [/micromessenger\/([\w\.]+)/i],
                            [d, [l, "WeChat"]],
                            [/konqueror\/([\w\.]+)/i],
                            [d, [l, "Konqueror"]],
                            [/trident.+rv[:\s]([\w\.]{1,9})\b.+like\sgecko/i],
                            [d, [l, "IE"]],
                            [/yabrowser\/([\w\.]+)/i],
                            [d, [l, "Yandex"]],
                            [/(avast|avg)\/([\w\.]+)/i],
                            [
                                [l, /(.+)/, "$1 Secure Browser"], d
                            ],
                            [/focus\/([\w\.]+)/i],
                            [d, [l, "Firefox Focus"]],
                            [/opt\/([\w\.]+)/i],
                            [d, [l, "Opera Touch"]],
                            [/coc_coc_browser\/([\w\.]+)/i],
                            [d, [l, "Coc Coc"]],
                            [/dolfin\/([\w\.]+)/i],
                            [d, [l, "Dolphin"]],
                            [/coast\/([\w\.]+)/i],
                            [d, [l, "Opera Coast"]],
                            [/xiaomi\/miuibrowser\/([\w\.]+)/i],
                            [d, [l, "MIUI Browser"]],
                            [/fxios\/([\w\.-]+)/i],
                            [d, [l, "Firefox"]],
                            [/(qihu|qhbrowser|qihoobrowser|360browser)/i],
                            [
                                [l, "360 Browser"]
                            ],
                            [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],
                            [
                                [l, /(.+)/, "$1 Browser"], d
                            ],
                            [/(comodo_dragon)\/([\w\.]+)/i],
                            [
                                [l, /_/g, " "], d
                            ],
                            [/\s(electron)\/([\w\.]+)\ssafari/i, /(tesla)(?:\sqtcarbrowser|\/(20[12]\d\.[\w\.-]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/\s]?([\w\.]+)/i],
                            [l, d],
                            [/(MetaSr)[\/\s]?([\w\.]+)/i, /(LBBROWSER)/i],
                            [l],
                            [/;fbav\/([\w\.]+);/i],
                            [d, [l, "Facebook"]],
                            [/FBAN\/FBIOS|FB_IAB\/FB4A/i],
                            [
                                [l, "Facebook"]
                            ],
                            [/safari\s(line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/\s]([\w\.-]+)/i],
                            [l, d],
                            [/\bgsa\/([\w\.]+)\s.*safari\//i],
                            [d, [l, "GSA"]],
                            [/headlesschrome(?:\/([\w\.]+)|\s)/i],
                            [d, [l, "Chrome Headless"]],
                            [/\swv\).+(chrome)\/([\w\.]+)/i],
                            [
                                [l, "Chrome WebView"], d
                            ],
                            [/droid.+\sversion\/([\w\.]+)\b.+(?:mobile\ssafari|safari)/i],
                            [d, [l, "Android Browser"]],
                            [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
                            [l, d],
                            [/version\/([\w\.]+)\s.*mobile\/\w+\s(safari)/i],
                            [d, [l, "Mobile Safari"]],
                            [/version\/([\w\.]+)\s.*(mobile\s?safari|safari)/i],
                            [d, l],
                            [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                            [l, [d, _.str, k.browser.oldSafari.version]],
                            [/(webkit|khtml)\/([\w\.]+)/i],
                            [l, d],
                            [/(navigator|netscape)\/([\w\.-]+)/i],
                            [
                                [l, "Netscape"], d
                            ],
                            [/ile\svr;\srv:([\w\.]+)\).+firefox/i],
                            [d, [l, "Firefox Reality"]],
                            [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i, /(firefox)\/([\w\.]+)\s[\w\s\-]+\/[\w\.]+$/i, /(mozilla)\/([\w\.]+)\s.+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]*)/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i],
                            [l, d]
                        ],
                        cpu: [
                            [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                            [
                                [b, "amd64"]
                            ],
                            [/(ia32(?=;))/i],
                            [
                                [b, E.lowerize]
                            ],
                            [/((?:i[346]|x)86)[;\)]/i],
                            [
                                [b, "ia32"]
                            ],
                            [/\b(aarch64|armv?8e?l?)\b/i],
                            [
                                [b, "arm64"]
                            ],
                            [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
                            [
                                [b, "armhf"]
                            ],
                            [/windows\s(ce|mobile);\sppc;/i],
                            [
                                [b, "arm"]
                            ],
                            [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                            [
                                [b, /ower/, "", E.lowerize]
                            ],
                            [/(sun4\w)[;\)]/i],
                            [
                                [b, "sparc"]
                            ],
                            [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?:64|(?=v(?:[1-7]|[5-7]1)l?|;|eabi))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],
                            [
                                [b, E.lowerize]
                            ]
                        ],
                        device: [
                            [/\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus\s10)/i],
                            [f, [p, "Samsung"],
                                [h, y]
                            ],
                            [/\b((?:s[cgp]h|gt|sm)-\w+|galaxy\snexus)/i, /\ssamsung[\s-]([\w-]+)/i, /sec-(sgh\w+)/i],
                            [f, [p, "Samsung"],
                                [h, v]
                            ],
                            [/\((ip(?:hone|od)[\s\w]*);/i],
                            [f, [p, "Apple"],
                                [h, v]
                            ],
                            [/\((ipad);[\w\s\),;-]+apple/i, /applecoremedia\/[\w\.]+\s\((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i],
                            [f, [p, "Apple"],
                                [h, y]
                            ],
                            [/\b((?:agr|ags[23]|bah2?|sht?)-a?[lw]\d{2})/i],
                            [f, [p, "Huawei"],
                                [h, y]
                            ],
                            [/d\/huawei([\w\s-]+)[;\)]/i, /\b(nexus\s6p|vog-[at]?l\d\d|ane-[at]?l[x\d]\d|eml-a?l\d\da?|lya-[at]?l\d[\dc]|clt-a?l\d\di?|ele-l\d\d)/i, /\b(\w{2,4}-[atu][ln][01259][019])[;\)\s]/i],
                            [f, [p, "Huawei"],
                                [h, v]
                            ],
                            [/\b(poco[\s\w]+)(?:\sbuild|\))/i, /\b;\s(\w+)\sbuild\/hm\1/i, /\b(hm[\s\-_]?note?[\s_]?(?:\d\w)?)\sbuild/i, /\b(redmi[\s\-_]?(?:note|k)?[\w\s_]+)(?:\sbuild|\))/i, /\b(mi[\s\-_]?(?:a\d|one|one[\s_]plus|note lte)?[\s_]?(?:\d?\w?)[\s_]?(?:plus)?)\sbuild/i],
                            [
                                [f, /_/g, " "],
                                [p, "Xiaomi"],
                                [h, v]
                            ],
                            [/\b(mi[\s\-_]?(?:pad)(?:[\w\s_]+))(?:\sbuild|\))/i],
                            [
                                [f, /_/g, " "],
                                [p, "Xiaomi"],
                                [h, y]
                            ],
                            [/;\s(\w+)\sbuild.+\soppo/i, /\s(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007)\b/i],
                            [f, [p, "OPPO"],
                                [h, v]
                            ],
                            [/\svivo\s(\w+)(?:\sbuild|\))/i, /\s(v[12]\d{3}\w?[at])(?:\sbuild|;)/i],
                            [f, [p, "Vivo"],
                                [h, v]
                            ],
                            [/\s(rmx[12]\d{3})(?:\sbuild|;)/i],
                            [f, [p, "Realme"],
                                [h, v]
                            ],
                            [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)\b[\w\s]+build\//i, /\smot(?:orola)?[\s-](\w*)/i, /((?:moto[\s\w\(\)]+|xt\d{3,4}|nexus\s6)(?=\sbuild|\)))/i],
                            [f, [p, "Motorola"],
                                [h, v]
                            ],
                            [/\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
                            [f, [p, "Motorola"],
                                [h, y]
                            ],
                            [/((?=lg)?[vl]k\-?\d{3})\sbuild|\s3\.[\s\w;-]{10}lg?-([06cv9]{3,4})/i],
                            [f, [p, "LG"],
                                [h, y]
                            ],
                            [/(lm-?f100[nv]?|nexus\s[45])/i, /lg[e;\s\/-]+((?!browser|netcast)\w+)/i, /\blg(\-?[\d\w]+)\sbuild/i],
                            [f, [p, "LG"],
                                [h, v]
                            ],
                            [/(ideatab[\w\-\s]+)/i, /lenovo\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+)|yt[\d\w-]{6}|tb[\d\w-]{6})/i],
                            [f, [p, "Lenovo"],
                                [h, y]
                            ],
                            [/(?:maemo|nokia).*(n900|lumia\s\d+)/i, /nokia[\s_-]?([\w\.-]*)/i],
                            [
                                [f, /_/g, " "],
                                [p, "Nokia"],
                                [h, v]
                            ],
                            [/droid.+;\s(pixel\sc)[\s)]/i],
                            [f, [p, "Google"],
                                [h, y]
                            ],
                            [/droid.+;\s(pixel[\s\daxl]{0,6})(?:\sbuild|\))/i],
                            [f, [p, "Google"],
                                [h, v]
                            ],
                            [/droid.+\s([c-g]\d{4}|so[-l]\w+|xq-a\w[4-7][12])(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i],
                            [f, [p, "Sony"],
                                [h, v]
                            ],
                            [/sony\stablet\s[ps]\sbuild\//i, /(?:sony)?sgp\w+(?:\sbuild\/|\))/i],
                            [
                                [f, "Xperia Tablet"],
                                [p, "Sony"],
                                [h, y]
                            ],
                            [/\s(kb2005|in20[12]5|be20[12][59])\b/i, /\ba000(1)\sbuild/i, /\boneplus\s(a\d{4})[\s)]/i],
                            [f, [p, "OnePlus"],
                                [h, v]
                            ],
                            [/(alexa)webm/i, /(kf[a-z]{2}wi)(\sbuild\/|\))/i, /(kf[a-z]+)(\sbuild\/|\)).+silk\//i],
                            [f, [p, "Amazon"],
                                [h, y]
                            ],
                            [/(sd|kf)[0349hijorstuw]+(\sbuild\/|\)).+silk\//i],
                            [
                                [f, "Fire Phone"],
                                [p, "Amazon"],
                                [h, v]
                            ],
                            [/\((playbook);[\w\s\),;-]+(rim)/i],
                            [f, p, [h, y]],
                            [/((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10;\s(\w+)/i],
                            [f, [p, "BlackBerry"],
                                [h, v]
                            ],
                            [/(?:\b|asus_)(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus\s7|padfone|p00[cj])/i],
                            [f, [p, "ASUS"],
                                [h, y]
                            ],
                            [/\s(z[es]6[027][01][km][ls]|zenfone\s\d\w?)\b/i],
                            [f, [p, "ASUS"],
                                [h, v]
                            ],
                            [/(nexus\s9)/i],
                            [f, [p, "HTC"],
                                [h, y]
                            ],
                            [/(htc)[;_\s-]{1,2}([\w\s]+(?=\)|\sbuild)|\w+)/i, /(zte)-(\w*)/i, /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],
                            [p, [f, /_/g, " "],
                                [h, v]
                            ],
                            [/droid[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],
                            [f, [p, "Acer"],
                                [h, y]
                            ],
                            [/droid.+;\s(m[1-5]\snote)\sbuild/i, /\bmz-([\w-]{2,})/i],
                            [f, [p, "Meizu"],
                                [h, v]
                            ],
                            [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i, /(microsoft);\s(lumia[\s\w]+)/i, /(lenovo)[_\s-]?([\w-]+)/i, /linux;.+(jolla);/i, /droid.+;\s(oppo)\s?([\w\s]+)\sbuild/i],
                            [p, f, [h, v]],
                            [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i, /[;\/]\s?(le[\s\-]+pan)[\s\-]+(\w{1,9})\sbuild/i, /[;\/]\s?(trinity)[\-\s]*(t\d{3})\sbuild/i, /\b(gigaset)[\s\-]+(q\w{1,9})\sbuild/i, /\b(vodafone)\s([\w\s]+)(?:\)|\sbuild)/i],
                            [p, f, [h, y]],
                            [/\s(surface\sduo)\s/i],
                            [f, [p, "Microsoft"],
                                [h, y]
                            ],
                            [/droid\s[\d\.]+;\s(fp\du?)\sbuild/i],
                            [f, [p, "Fairphone"],
                                [h, v]
                            ],
                            [/\s(u304aa)\sbuild/i],
                            [f, [p, "AT&T"],
                                [h, v]
                            ],
                            [/sie-(\w*)/i],
                            [f, [p, "Siemens"],
                                [h, v]
                            ],
                            [/[;\/]\s?(rct\w+)\sbuild/i],
                            [f, [p, "RCA"],
                                [h, y]
                            ],
                            [/[;\/\s](venue[\d\s]{2,7})\sbuild/i],
                            [f, [p, "Dell"],
                                [h, y]
                            ],
                            [/[;\/]\s?(q(?:mv|ta)\w+)\sbuild/i],
                            [f, [p, "Verizon"],
                                [h, y]
                            ],
                            [/[;\/]\s(?:barnes[&\s]+noble\s|bn[rt])([\w\s\+]*)\sbuild/i],
                            [f, [p, "Barnes & Noble"],
                                [h, y]
                            ],
                            [/[;\/]\s(tm\d{3}\w+)\sbuild/i],
                            [f, [p, "NuVision"],
                                [h, y]
                            ],
                            [/;\s(k88)\sbuild/i],
                            [f, [p, "ZTE"],
                                [h, y]
                            ],
                            [/;\s(nx\d{3}j)\sbuild/i],
                            [f, [p, "ZTE"],
                                [h, v]
                            ],
                            [/[;\/]\s?(gen\d{3})\sbuild.*49h/i],
                            [f, [p, "Swiss"],
                                [h, v]
                            ],
                            [/[;\/]\s?(zur\d{3})\sbuild/i],
                            [f, [p, "Swiss"],
                                [h, y]
                            ],
                            [/[;\/]\s?((zeki)?tb.*\b)\sbuild/i],
                            [f, [p, "Zeki"],
                                [h, y]
                            ],
                            [/[;\/]\s([yr]\d{2})\sbuild/i, /[;\/]\s(dragon[\-\s]+touch\s|dt)(\w{5})\sbuild/i],
                            [
                                [p, "Dragon Touch"], f, [h, y]
                            ],
                            [/[;\/]\s?(ns-?\w{0,9})\sbuild/i],
                            [f, [p, "Insignia"],
                                [h, y]
                            ],
                            [/[;\/]\s?((nxa|Next)-?\w{0,9})\sbuild/i],
                            [f, [p, "NextBook"],
                                [h, y]
                            ],
                            [/[;\/]\s?(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05]))\sbuild/i],
                            [
                                [p, "Voice"], f, [h, v]
                            ],
                            [/[;\/]\s?(lvtel\-)?(v1[12])\sbuild/i],
                            [
                                [p, "LvTel"], f, [h, v]
                            ],
                            [/;\s(ph-1)\s/i],
                            [f, [p, "Essential"],
                                [h, v]
                            ],
                            [/[;\/]\s?(v(100md|700na|7011|917g).*\b)\sbuild/i],
                            [f, [p, "Envizen"],
                                [h, y]
                            ],
                            [/[;\/]\s?(trio[\s\w\-\.]+)\sbuild/i],
                            [f, [p, "MachSpeed"],
                                [h, y]
                            ],
                            [/[;\/]\s?tu_(1491)\sbuild/i],
                            [f, [p, "Rotor"],
                                [h, y]
                            ],
                            [/(shield[\w\s]+)\sbuild/i],
                            [f, [p, "Nvidia"],
                                [h, y]
                            ],
                            [/(sprint)\s(\w+)/i],
                            [p, f, [h, v]],
                            [/(kin\.[onetw]{3})/i],
                            [
                                [f, /\./g, " "],
                                [p, "Microsoft"],
                                [h, v]
                            ],
                            [/droid\s[\d\.]+;\s(cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
                            [f, [p, "Zebra"],
                                [h, y]
                            ],
                            [/droid\s[\d\.]+;\s(ec30|ps20|tc[2-8]\d[kx])\)/i],
                            [f, [p, "Zebra"],
                                [h, v]
                            ],
                            [/\s(ouya)\s/i, /(nintendo)\s([wids3utch]+)/i],
                            [p, f, [h, w]],
                            [/droid.+;\s(shield)\sbuild/i],
                            [f, [p, "Nvidia"],
                                [h, w]
                            ],
                            [/(playstation\s[345portablevi]+)/i],
                            [f, [p, "Sony"],
                                [h, w]
                            ],
                            [/[\s\(;](xbox(?:\sone)?(?!;\sxbox))[\s\);]/i],
                            [f, [p, "Microsoft"],
                                [h, w]
                            ],
                            [/smart-tv.+(samsung)/i],
                            [p, [h, g]],
                            [/hbbtv.+maple;(\d+)/i],
                            [
                                [f, /^/, "SmartTV"],
                                [p, "Samsung"],
                                [h, g]
                            ],
                            [/(?:linux;\snetcast.+smarttv|lg\snetcast\.tv-201\d)/i],
                            [
                                [p, "LG"],
                                [h, g]
                            ],
                            [/(apple)\s?tv/i],
                            [p, [f, "Apple TV"],
                                [h, g]
                            ],
                            [/crkey/i],
                            [
                                [f, "Chromecast"],
                                [p, "Google"],
                                [h, g]
                            ],
                            [/droid.+aft([\w])(\sbuild\/|\))/i],
                            [f, [p, "Amazon"],
                                [h, g]
                            ],
                            [/\(dtv[\);].+(aquos)/i],
                            [f, [p, "Sharp"],
                                [h, g]
                            ],
                            [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
                            [
                                [p, E.trim],
                                [f, E.trim],
                                [h, g]
                            ],
                            [/[\s\/\(](android\s|smart[-\s]?|opera\s)tv[;\)\s]/i],
                            [
                                [h, g]
                            ],
                            [/((pebble))app\/[\d\.]+\s/i],
                            [p, f, [h, m]],
                            [/droid.+;\s(glass)\s\d/i],
                            [f, [p, "Google"],
                                [h, m]
                            ],
                            [/droid\s[\d\.]+;\s(wt63?0{2,3})\)/i],
                            [f, [p, "Zebra"],
                                [h, m]
                            ],
                            [/(tesla)(?:\sqtcarbrowser|\/20[12]\d\.[\w\.-]+)/i],
                            [p, [h, x]],
                            [/droid .+?; ([^;]+?)(?: build|\) applewebkit).+? mobile safari/i],
                            [f, [h, v]],
                            [/droid .+?;\s([^;]+?)(?: build|\) applewebkit).+?(?! mobile) safari/i],
                            [f, [h, y]],
                            [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
                            [
                                [h, E.lowerize]
                            ],
                            [/(android[\w\.\s\-]{0,9});.+build/i],
                            [f, [p, "Generic"]],
                            [/(phone)/i],
                            [
                                [h, v]
                            ]
                        ],
                        engine: [
                            [/windows.+\sedge\/([\w\.]+)/i],
                            [d, [l, "EdgeHTML"]],
                            [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
                            [d, [l, "Blink"]],
                            [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
                            [l, d],
                            [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
                            [d, l]
                        ],
                        os: [
                            [/microsoft\s(windows)\s(vista|xp)/i],
                            [l, d],
                            [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)(?!.+xbox)/i],
                            [l, [d, _.str, k.os.windows.version]],
                            [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                            [
                                [l, "Windows"],
                                [d, _.str, k.os.windows.version]
                            ],
                            [/ip[honead]{2,4}\b(?:.*os\s([\w]+)\slike\smac|;\sopera)/i, /cfnetwork\/.+darwin/i],
                            [
                                [d, /_/g, "."],
                                [l, "iOS"]
                            ],
                            [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)(?!.+haiku)/i],
                            [
                                [l, "Mac OS"],
                                [d, /_/g, "."]
                            ],
                            [/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/\s]([\w\.]+)/i, /\((series40);/i],
                            [l, d],
                            [/\(bb(10);/i],
                            [d, [l, "BlackBerry"]],
                            [/(?:symbian\s?os|symbos|s60(?=;)|series60)[\/\s-]?([\w\.]*)/i],
                            [d, [l, "Symbian"]],
                            [/mozilla.+\(mobile;.+gecko.+firefox/i],
                            [
                                [l, "Firefox OS"]
                            ],
                            [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
                            [d, [l, "webOS"]],
                            [/crkey\/([\d\.]+)/i],
                            [d, [l, "Chromecast"]],
                            [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                            [
                                [l, "Chromium OS"], d
                            ],
                            [/(nintendo|playstation)\s([wids345portablevuch]+)/i, /(xbox);\s+xbox\s([^\);]+)/i, /(mint)[\/\s\(\)]?(\w*)/i, /(mageia|vectorlinux)[;\s]/i, /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?=\slinux)|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus|raspbian)(?:\sgnu\/linux)?(?:\slinux)?[\/\s-]?(?!chrom|package)([\w\.-]*)/i, /(hurd|linux)\s?([\w\.]*)/i, /(gnu)\s?([\w\.]*)/i, /\s([frentopc-]{0,4}bsd|dragonfly)\s?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku)\s(\w+)/i],
                            [l, d],
                            [/(sunos)\s?([\w\.\d]*)/i],
                            [
                                [l, "Solaris"], d
                            ],
                            [/((?:open)?solaris)[\/\s-]?([\w\.]*)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i, /(unix)\s?([\w\.]*)/i],
                            [l, d]
                        ]
                    },
                    S = function(t, e) {
                        if ("object" == typeof t && (e = t, t = o), !(this instanceof S)) return new S(t, e).getResult();
                        var r = t || (void 0 !== i && i.navigator && i.navigator.userAgent ? i.navigator.userAgent : ""),
                            n = e ? E.extend(A, e) : A;
                        return this.getBrowser = function() {
                            var t = {
                                name: o,
                                version: o
                            };
                            return _.rgx.call(t, r, n.browser), t.major = E.major(t.version), t
                        }, this.getCPU = function() {
                            var t = {
                                architecture: o
                            };
                            return _.rgx.call(t, r, n.cpu), t
                        }, this.getDevice = function() {
                            var t = {
                                vendor: o,
                                model: o,
                                type: o
                            };
                            return _.rgx.call(t, r, n.device), t
                        }, this.getEngine = function() {
                            var t = {
                                name: o,
                                version: o
                            };
                            return _.rgx.call(t, r, n.engine), t
                        }, this.getOS = function() {
                            var t = {
                                name: o,
                                version: o
                            };
                            return _.rgx.call(t, r, n.os), t
                        }, this.getResult = function() {
                            return {
                                ua: this.getUA(),
                                browser: this.getBrowser(),
                                engine: this.getEngine(),
                                os: this.getOS(),
                                device: this.getDevice(),
                                cpu: this.getCPU()
                            }
                        }, this.getUA = function() {
                            return r
                        }, this.setUA = function(t) {
                            return r = typeof t === c && t.length > 255 ? E.trim(t, 255) : t, this
                        }, this.setUA(r), this
                    };
                S.VERSION = "0.7.28", S.BROWSER = {
                    NAME: l,
                    MAJOR: "major",
                    VERSION: d
                }, S.CPU = {
                    ARCHITECTURE: b
                }, S.DEVICE = {
                    MODEL: f,
                    VENDOR: p,
                    TYPE: h,
                    CONSOLE: w,
                    MOBILE: v,
                    SMARTTV: g,
                    TABLET: y,
                    WEARABLE: m,
                    EMBEDDED: x
                }, S.ENGINE = {
                    NAME: l,
                    VERSION: d
                }, S.OS = {
                    NAME: l,
                    VERSION: d
                }, typeof e !== a ? (t.exports && (e = t.exports = S), e.UAParser = S) : (n = function() {
                    return S
                }.call(e, r, e, t)) === o || (t.exports = n);
                var O = void 0 !== i && (i.jQuery || i.Zepto);
                if (O && !O.ua) {
                    var U = new S;
                    O.ua = U.getResult(), O.ua.get = function() {
                        return U.getUA()
                    }, O.ua.set = function(t) {
                        U.setUA(t);
                        var e = U.getResult();
                        for (var r in e) O.ua[r] = e[r]
                    }
                }
            }("object" == typeof window ? window : this)
        },
        5024: () => {}
    },
    e = {};

function r(n) {
    var i = e[n];
    if (void 0 !== i) return i.exports;
    var o = e[n] = {
        exports: {}
    };
    return t[n].call(o.exports, o, o.exports, r), o.exports
}

export default function execWithCrypto(cb) {
    "use strict";
    r(4336), r(3369), r(9357), r(8388), r(7476), r(5767), r(8837), r(4882), r(8351), r(7470);
    var t = r(780),
        e = r(6885);

    r(6059);

    return cb(t, e);
};
