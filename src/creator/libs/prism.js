/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /npm/prismjs@1.28.0/prism.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var _self =
    "undefined" != typeof window
      ? window
      : "undefined" != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function (e) {
    var t = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
      n = 0,
      a = {},
      r = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler:
          e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
          encode: function e(t) {
            return t instanceof s
              ? new s(t.type, e(t.content), t.alias)
              : Array.isArray(t)
              ? t.map(e)
              : t
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/\u00a0/g, " ");
          },
          type: function (e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function (e) {
            return (
              e.__id || Object.defineProperty(e, "__id", { value: ++n }), e.__id
            );
          },
          clone: function e(t, n) {
            var a, s;
            switch (((n = n || {}), r.util.type(t))) {
              case "Object":
                if (((s = r.util.objId(t)), n[s])) return n[s];
                for (var i in ((a = {}), (n[s] = a), t))
                  t.hasOwnProperty(i) && (a[i] = e(t[i], n));
                return a;
              case "Array":
                return (
                  (s = r.util.objId(t)),
                  n[s]
                    ? n[s]
                    : ((a = []),
                      (n[s] = a),
                      t.forEach(function (t, r) {
                        a[r] = e(t, n);
                      }),
                      a)
                );
              default:
                return t;
            }
          },
          getLanguage: function (e) {
            for (; e; ) {
              var n = t.exec(e.className);
              if (n) return n[1].toLowerCase();
              e = e.parentElement;
            }
            return "none";
          },
          setLanguage: function (e, n) {
            (e.className = e.className.replace(RegExp(t, "gi"), "")),
              e.classList.add("language-" + n);
          },
          currentScript: function () {
            if ("undefined" == typeof document) return null;
            if ("currentScript" in document) return document.currentScript;
            try {
              throw new Error();
            } catch (a) {
              var e = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(a.stack) ||
                [])[1];
              if (e) {
                var t = document.getElementsByTagName("script");
                for (var n in t) if (t[n].src == e) return t[n];
              }
              return null;
            }
          },
          isActive: function (e, t, n) {
            for (var a = "no-" + t; e; ) {
              var r = e.classList;
              if (r.contains(t)) return !0;
              if (r.contains(a)) return !1;
              e = e.parentElement;
            }
            return !!n;
          },
        },
        languages: {
          plain: a,
          plaintext: a,
          text: a,
          txt: a,
          extend: function (e, t) {
            var n = r.util.clone(r.languages[e]);
            for (var a in t) n[a] = t[a];
            return n;
          },
          insertBefore: function (e, t, n, a) {
            var s = (a = a || r.languages)[e],
              i = {};
            for (var l in s)
              if (s.hasOwnProperty(l)) {
                if (l == t)
                  for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o]);
                n.hasOwnProperty(l) || (i[l] = s[l]);
              }
            var u = a[e];
            return (
              (a[e] = i),
              r.languages.DFS(r.languages, function (t, n) {
                n === u && t != e && (this[t] = i);
              }),
              i
            );
          },
          DFS: function e(t, n, a, s) {
            s = s || {};
            var i = r.util.objId;
            for (var l in t)
              if (t.hasOwnProperty(l)) {
                n.call(t, l, t[l], a || l);
                var o = t[l],
                  u = r.util.type(o);
                "Object" !== u || s[i(o)]
                  ? "Array" !== u || s[i(o)] || ((s[i(o)] = !0), e(o, n, l, s))
                  : ((s[i(o)] = !0), e(o, n, null, s));
              }
          },
        },
        plugins: {},
        highlightAll: function (e, t) {
          r.highlightAllUnder(document, e, t);
        },
        highlightAllUnder: function (e, t, n) {
          var a = {
            callback: n,
            container: e,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          r.hooks.run("before-highlightall", a),
            (a.elements = Array.prototype.slice.apply(
              a.container.querySelectorAll(a.selector)
            )),
            r.hooks.run("before-all-elements-highlight", a);
          for (var s, i = 0; (s = a.elements[i++]); )
            r.highlightElement(s, !0 === t, a.callback);
        },
        highlightElement: function (t, n, a) {
          var s = r.util.getLanguage(t),
            i = r.languages[s];
          r.util.setLanguage(t, s);
          var l = t.parentElement;
          l && "pre" === l.nodeName.toLowerCase() && r.util.setLanguage(l, s);
          var o = { element: t, language: s, grammar: i, code: t.textContent };
          function u(e) {
            (o.highlightedCode = e),
              r.hooks.run("before-insert", o),
              (o.element.innerHTML = o.highlightedCode),
              r.hooks.run("after-highlight", o),
              r.hooks.run("complete", o),
              a && a.call(o.element);
          }
          if (
            (r.hooks.run("before-sanity-check", o),
            (l = o.element.parentElement) &&
              "pre" === l.nodeName.toLowerCase() &&
              !l.hasAttribute("tabindex") &&
              l.setAttribute("tabindex", "0"),
            !o.code)
          )
            return r.hooks.run("complete", o), void (a && a.call(o.element));
          if ((r.hooks.run("before-highlight", o), o.grammar))
            if (n && e.Worker) {
              var g = new Worker(r.filename);
              (g.onmessage = function (e) {
                u(e.data);
              }),
                g.postMessage(
                  JSON.stringify({
                    language: o.language,
                    code: o.code,
                    immediateClose: !0,
                  })
                );
            } else u(r.highlight(o.code, o.grammar, o.language));
          else u(r.util.encode(o.code));
        },
        highlight: function (e, t, n) {
          var a = { code: e, grammar: t, language: n };
          if ((r.hooks.run("before-tokenize", a), !a.grammar))
            throw new Error(
              'The language "' + a.language + '" has no grammar.'
            );
          return (
            (a.tokens = r.tokenize(a.code, a.grammar)),
            r.hooks.run("after-tokenize", a),
            s.stringify(r.util.encode(a.tokens), a.language)
          );
        },
        tokenize: function (e, t) {
          var n = t.rest;
          if (n) {
            for (var a in n) t[a] = n[a];
            delete t.rest;
          }
          var r = new o();
          return (
            u(r, r.head, e),
            l(e, r, t, r.head, 0),
            (function (e) {
              var t = [],
                n = e.head.next;
              for (; n !== e.tail; ) t.push(n.value), (n = n.next);
              return t;
            })(r)
          );
        },
        hooks: {
          all: {},
          add: function (e, t) {
            var n = r.hooks.all;
            (n[e] = n[e] || []), n[e].push(t);
          },
          run: function (e, t) {
            var n = r.hooks.all[e];
            if (n && n.length) for (var a, s = 0; (a = n[s++]); ) a(t);
          },
        },
        Token: s,
      };
    function s(e, t, n, a) {
      (this.type = e),
        (this.content = t),
        (this.alias = n),
        (this.length = 0 | (a || "").length);
    }
    function i(e, t, n, a) {
      e.lastIndex = t;
      var r = e.exec(n);
      if (r && a && r[1]) {
        var s = r[1].length;
        (r.index += s), (r[0] = r[0].slice(s));
      }
      return r;
    }
    function l(e, t, n, a, o, c) {
      for (var d in n)
        if (n.hasOwnProperty(d) && n[d]) {
          var p = n[d];
          p = Array.isArray(p) ? p : [p];
          for (var m = 0; m < p.length; ++m) {
            if (c && c.cause == d + "," + m) return;
            var h = p[m],
              f = h.inside,
              v = !!h.lookbehind,
              b = !!h.greedy,
              y = h.alias;
            if (b && !h.pattern.global) {
              var F = h.pattern.toString().match(/[imsuy]*$/)[0];
              h.pattern = RegExp(h.pattern.source, F + "g");
            }
            for (
              var x = h.pattern || h, k = a.next, w = o;
              k !== t.tail && !(c && w >= c.reach);
              w += k.value.length, k = k.next
            ) {
              var A = k.value;
              if (t.length > e.length) return;
              if (!(A instanceof s)) {
                var P,
                  $ = 1;
                if (b) {
                  if (!(P = i(x, w, e, v)) || P.index >= e.length) break;
                  var S = P.index,
                    E = P.index + P[0].length,
                    _ = w;
                  for (_ += k.value.length; S >= _; )
                    _ += (k = k.next).value.length;
                  if (((w = _ -= k.value.length), k.value instanceof s))
                    continue;
                  for (
                    var j = k;
                    j !== t.tail && (_ < E || "string" == typeof j.value);
                    j = j.next
                  )
                    $++, (_ += j.value.length);
                  $--, (A = e.slice(w, _)), (P.index -= w);
                } else if (!(P = i(x, 0, A, v))) continue;
                S = P.index;
                var C = P[0],
                  L = A.slice(0, S),
                  z = A.slice(S + C.length),
                  O = w + A.length;
                c && O > c.reach && (c.reach = O);
                var T = k.prev;
                if (
                  (L && ((T = u(t, T, L)), (w += L.length)),
                  g(t, T, $),
                  (k = u(t, T, new s(d, f ? r.tokenize(C, f) : C, y, C))),
                  z && u(t, k, z),
                  $ > 1)
                ) {
                  var M = { cause: d + "," + m, reach: O };
                  l(e, t, n, k.prev, w, M),
                    c && M.reach > c.reach && (c.reach = M.reach);
                }
              }
            }
          }
        }
    }
    function o() {
      var e = { value: null, prev: null, next: null },
        t = { value: null, prev: e, next: null };
      (e.next = t), (this.head = e), (this.tail = t), (this.length = 0);
    }
    function u(e, t, n) {
      var a = t.next,
        r = { value: n, prev: t, next: a };
      return (t.next = r), (a.prev = r), e.length++, r;
    }
    function g(e, t, n) {
      for (var a = t.next, r = 0; r < n && a !== e.tail; r++) a = a.next;
      (t.next = a), (a.prev = t), (e.length -= r);
    }
    if (
      ((e.Prism = r),
      (s.stringify = function e(t, n) {
        if ("string" == typeof t) return t;
        if (Array.isArray(t)) {
          var a = "";
          return (
            t.forEach(function (t) {
              a += e(t, n);
            }),
            a
          );
        }
        var s = {
            type: t.type,
            content: e(t.content, n),
            tag: "span",
            classes: ["token", t.type],
            attributes: {},
            language: n,
          },
          i = t.alias;
        i &&
          (Array.isArray(i)
            ? Array.prototype.push.apply(s.classes, i)
            : s.classes.push(i)),
          r.hooks.run("wrap", s);
        var l = "";
        for (var o in s.attributes)
          l +=
            " " +
            o +
            '="' +
            (s.attributes[o] || "").replace(/"/g, "&quot;") +
            '"';
        return (
          "<" +
          s.tag +
          ' class="' +
          s.classes.join(" ") +
          '"' +
          l +
          ">" +
          s.content +
          "</" +
          s.tag +
          ">"
        );
      }),
      !e.document)
    )
      return e.addEventListener
        ? (r.disableWorkerMessageHandler ||
            e.addEventListener(
              "message",
              function (t) {
                var n = JSON.parse(t.data),
                  a = n.language,
                  s = n.code,
                  i = n.immediateClose;
                e.postMessage(r.highlight(s, r.languages[a], a)),
                  i && e.close();
              },
              !1
            ),
          r)
        : r;
    var c = r.util.currentScript();
    function d() {
      r.manual || r.highlightAll();
    }
    if (
      (c &&
        ((r.filename = c.src),
        c.hasAttribute("data-manual") && (r.manual = !0)),
      !r.manual)
    ) {
      var p = document.readyState;
      "loading" === p || ("interactive" === p && c && c.defer)
        ? document.addEventListener("DOMContentLoaded", d)
        : window.requestAnimationFrame
        ? window.requestAnimationFrame(d)
        : window.setTimeout(d, 16);
    }
    return r;
  })(_self);
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */ "undefined" != typeof module && module.exports && (module.exports = Prism),
  "undefined" != typeof global && (global.Prism = Prism),
  (Prism.languages.markup = {
    comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
    prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
    doctype: {
      pattern:
        /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: !0,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: !0,
          greedy: !0,
          inside: null,
        },
        string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
        punctuation: /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/i,
        name: /[^\s<>'"]+/,
      },
    },
    cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
    tag: {
      pattern:
        /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
          },
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: { namespace: /^[^\s>\/:]+:/ },
        },
      },
    },
    entity: [
      { pattern: /&[\da-z]{1,8};/i, alias: "named-entity" },
      /&#x?[\da-f]{1,8};/i,
    ],
  }),
  (Prism.languages.markup.tag.inside["attr-value"].inside.entity =
    Prism.languages.markup.entity),
  (Prism.languages.markup.doctype.inside["internal-subset"].inside =
    Prism.languages.markup),
  Prism.hooks.add("wrap", function (e) {
    "entity" === e.type &&
      (e.attributes.title = e.content.replace(/&amp;/, "&"));
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    value: function (e, t) {
      var n = {};
      (n["language-" + t] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: Prism.languages[t],
      }),
        (n.cdata = /^<!\[CDATA\[|\]\]>$/i);
      var a = {
        "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: n },
      };
      a["language-" + t] = { pattern: /[\s\S]+/, inside: Prism.languages[t] };
      var r = {};
      (r[e] = {
        pattern: RegExp(
          /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
            /__/g,
            function () {
              return e;
            }
          ),
          "i"
        ),
        lookbehind: !0,
        greedy: !0,
        inside: a,
      }),
        Prism.languages.insertBefore("markup", "cdata", r);
    },
  }),
  Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
    value: function (e, t) {
      Prism.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          /(^|["'\s])/.source +
            "(?:" +
            e +
            ")" +
            /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          "i"
        ),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [t, "language-" + t],
                inside: Prism.languages[t],
              },
              punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/],
            },
          },
        },
      });
    },
  }),
  (Prism.languages.html = Prism.languages.markup),
  (Prism.languages.mathml = Prism.languages.markup),
  (Prism.languages.svg = Prism.languages.markup),
  (Prism.languages.xml = Prism.languages.extend("markup", {})),
  (Prism.languages.ssml = Prism.languages.xml),
  (Prism.languages.atom = Prism.languages.xml),
  (Prism.languages.rss = Prism.languages.xml),
  (function (e) {
    var t =
      /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    (e.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
        inside: {
          rule: /^@[\w-]+/,
          "selector-function-argument": {
            pattern:
              /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: !0,
            alias: "selector",
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0,
          },
        },
      },
      url: {
        pattern: RegExp(
          "\\burl\\((?:" +
            t.source +
            "|" +
            /(?:[^\\\r\n()"']|\\[\s\S])*/.source +
            ")\\)",
          "i"
        ),
        greedy: !0,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: { pattern: RegExp("^" + t.source + "$"), alias: "url" },
        },
      },
      selector: {
        pattern: RegExp(
          "(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|" +
            t.source +
            ")*(?=\\s*\\{)"
        ),
        lookbehind: !0,
      },
      string: { pattern: t, greedy: !0 },
      property: {
        pattern:
          /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: !0,
      },
      important: /!important\b/i,
      function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
      punctuation: /[(){};:,]/,
    }),
      (e.languages.css.atrule.inside.rest = e.languages.css);
    var n = e.languages.markup;
    n && (n.tag.addInlined("style", "css"), n.tag.addAttribute("style", "css"));
  })(Prism),
  (Prism.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0,
        greedy: !0,
      },
      { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0,
    },
    "class-name": {
      pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ },
    },
    keyword:
      /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/,
  }),
  (Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [
      Prism.languages.clike["class-name"],
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: !0,
      },
    ],
    keyword: [
      { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
      {
        pattern:
          /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0,
      },
    ],
    function:
      /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp(
        /(^|[^\w$])/.source +
          "(?:" +
          /NaN|Infinity/.source +
          "|" +
          /0[bB][01]+(?:_[01]+)*n?/.source +
          "|" +
          /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
          "|" +
          /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
          "|" +
          /\d+(?:_\d+)*n/.source +
          "|" +
          /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
            .source +
          ")" +
          /(?![\w$])/.source
      ),
      lookbehind: !0,
    },
    operator:
      /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
  })),
  (Prism.languages.javascript["class-name"][0].pattern =
    /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: RegExp(
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
          /\//.source +
          "(?:" +
          /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/
            .source +
          "|" +
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
            .source +
          ")" +
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/
            .source
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: Prism.languages.regex,
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/,
      },
    },
    "function-variable": {
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function",
    },
    parameter: [
      {
        pattern:
          /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern:
          /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore("javascript", "string", {
    hashbang: { pattern: /^#!.*/, greedy: !0, alias: "comment" },
    "template-string": {
      pattern:
        /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": { pattern: /^`|`$/, alias: "string" },
        interpolation: {
          pattern:
            /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation",
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
    "string-property": {
      pattern:
        /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: "property",
    },
  }),
  Prism.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern:
        /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: "property",
    },
  }),
  Prism.languages.markup &&
    (Prism.languages.markup.tag.addInlined("script", "javascript"),
    Prism.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
        .source,
      "javascript"
    )),
  (Prism.languages.js = Prism.languages.javascript),
  (function () {
    if (void 0 !== Prism && "undefined" != typeof document) {
      Element.prototype.matches ||
        (Element.prototype.matches =
          Element.prototype.msMatchesSelector ||
          Element.prototype.webkitMatchesSelector);
      var e = {
          js: "javascript",
          py: "python",
          rb: "ruby",
          ps1: "powershell",
          psm1: "powershell",
          sh: "bash",
          bat: "batch",
          h: "c",
          tex: "latex",
        },
        t = "data-src-status",
        n = "loading",
        a = "loaded",
        r =
          "pre[data-src]:not([" +
          t +
          '="' +
          a +
          '"]):not([' +
          t +
          '="' +
          n +
          '"])';
      Prism.hooks.add("before-highlightall", function (e) {
        e.selector += ", " + r;
      }),
        Prism.hooks.add("before-sanity-check", function (s) {
          var i = s.element;
          if (i.matches(r)) {
            (s.code = ""), i.setAttribute(t, n);
            var l = i.appendChild(document.createElement("CODE"));
            l.textContent = "Loading…";
            var o = i.getAttribute("data-src"),
              u = s.language;
            if ("none" === u) {
              var g = (/\.(\w+)$/.exec(o) || [, "none"])[1];
              u = e[g] || g;
            }
            Prism.util.setLanguage(l, u), Prism.util.setLanguage(i, u);
            var c = Prism.plugins.autoloader;
            c && c.loadLanguages(u),
              (function (e, t, n) {
                var a = new XMLHttpRequest();
                a.open("GET", e, !0),
                  (a.onreadystatechange = function () {
                    4 == a.readyState &&
                      (a.status < 400 && a.responseText
                        ? t(a.responseText)
                        : a.status >= 400
                        ? n(
                            "✖ Error " +
                              a.status +
                              " while fetching file: " +
                              a.statusText
                          )
                        : n("✖ Error: File does not exist or is empty"));
                  }),
                  a.send(null);
              })(
                o,
                function (e) {
                  i.setAttribute(t, a);
                  var n = (function (e) {
                    var t = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(
                      e || ""
                    );
                    if (t) {
                      var n = Number(t[1]),
                        a = t[2],
                        r = t[3];
                      return a ? (r ? [n, Number(r)] : [n, void 0]) : [n, n];
                    }
                  })(i.getAttribute("data-range"));
                  if (n) {
                    var r = e.split(/\r\n?|\n/g),
                      s = n[0],
                      o = null == n[1] ? r.length : n[1];
                    s < 0 && (s += r.length),
                      (s = Math.max(0, Math.min(s - 1, r.length))),
                      o < 0 && (o += r.length),
                      (o = Math.max(0, Math.min(o, r.length))),
                      (e = r.slice(s, o).join("\n")),
                      i.hasAttribute("data-start") ||
                        i.setAttribute("data-start", String(s + 1));
                  }
                  (l.textContent = e), Prism.highlightElement(l);
                },
                function (e) {
                  i.setAttribute(t, "failed"), (l.textContent = e);
                }
              );
          }
        }),
        (Prism.plugins.fileHighlight = {
          highlight: function (e) {
            for (
              var t, n = (e || document).querySelectorAll(r), a = 0;
              (t = n[a++]);

            )
              Prism.highlightElement(t);
          },
        });
      var s = !1;
      Prism.fileHighlight = function () {
        s ||
          (console.warn(
            "Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."
          ),
          (s = !0)),
          Prism.plugins.fileHighlight.highlight.apply(this, arguments);
      };
    }
  })();
//# sourceMappingURL=/sm/a66a22d6472c716fab9dc7bfab251dcb55c1631dffb15a674737760fcd3d24f5.map
