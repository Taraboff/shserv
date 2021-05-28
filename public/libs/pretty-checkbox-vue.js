/*!
 * pretty-checkbox-vue v1.1.9
 * (c) 2017-2018 Hamed Ehtesham
 * Released under the MIT License.
 */
!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define("pretty-checkbox-vue", [], t)
    : "object" == typeof exports
    ? (exports["pretty-checkbox-vue"] = t())
    : (e["pretty-checkbox-vue"] = t());
})("undefined" != typeof self ? self : this, function () {
  return (function (e) {
    var t = {};
    function i(n) {
      if (t[n]) return t[n].exports;
      var s = (t[n] = { i: n, l: !1, exports: {} });
      return e[n].call(s.exports, s, s.exports, i), (s.l = !0), s.exports;
    }
    return (
      (i.m = e),
      (i.c = t),
      (i.d = function (e, t, n) {
        i.o(e, t) ||
          Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: n,
          });
      }),
      (i.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return i.d(t, "a", t), t;
      }),
      (i.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (i.p = ""),
      i((i.s = 2))
    );
  })([
    function (e, t, i) {
      var n = i(1)(i(3), i(4), !1, null, null, null);
      (n.options.__file = "src/PrettyInput.vue"), (e.exports = n.exports);
    },
    function (e, t) {
      e.exports = function (e, t, i, n, s, r) {
        var o,
          u = (e = e || {}),
          a = typeof e.default;
        ("object" !== a && "function" !== a) || ((o = e), (u = e.default));
        var l,
          h = "function" == typeof u ? u.options : u;
        if (
          (t &&
            ((h.render = t.render),
            (h.staticRenderFns = t.staticRenderFns),
            (h._compiled = !0)),
          i && (h.functional = !0),
          s && (h._scopeId = s),
          r
            ? ((l = function (e) {
                (e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent &&
                    this.parent.$vnode &&
                    this.parent.$vnode.ssrContext)) ||
                  "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                  (e = __VUE_SSR_CONTEXT__),
                  n && n.call(this, e),
                  e &&
                    e._registeredComponents &&
                    e._registeredComponents.add(r);
              }),
              (h._ssrRegister = l))
            : n && (l = n),
          l)
        ) {
          var d = h.functional,
            c = d ? h.render : h.beforeCreate;
          d
            ? ((h._injectStyles = l),
              (h.render = function (e, t) {
                return l.call(t), c(e, t);
              }))
            : (h.beforeCreate = c ? [].concat(c, l) : [l]);
        }
        return { esModule: o, exports: u, options: h };
      };
    },
    function (e, t, i) {
      var n = i(0),
        s = i(5),
        r = i(7);
      e.exports = {
        install: function (e, t) {
          e.component("p-input", n),
            e.component("p-check", s),
            e.component("p-radio", r);
        },
      };
    },
    function (e, t, i) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = {
          name: "pretty-input",
          model: { prop: "modelValue", event: "change" },
          props: {
            type: String,
            name: String,
            value: {},
            modelValue: {},
            trueValue: {},
            falseValue: {},
            checked: {},
            disabled: {},
            required: {},
            indeterminate: {},
            color: String,
            offColor: String,
            hoverColor: String,
            indeterminateColor: String,
            toggle: {},
            hover: {},
            focus: {},
          },
          data: function () {
            return { m_checked: void 0, default_mode: !1 };
          },
          computed: {
            _type: function () {
              return this.$options.input_type
                ? this.$options.input_type
                : this.type
                ? this.type
                : "checkbox";
            },
            shouldBeChecked: function () {
              return void 0 !== this.modelValue
                ? "radio" === this._type
                  ? this.modelValue === this.value
                  : this.modelValue instanceof Array
                  ? this.modelValue.includes(this.value)
                  : this._trueValue
                  ? this.modelValue === this.trueValue
                  : "string" == typeof this.modelValue || !!this.modelValue
                : void 0 === this.m_checked
                ? (this.m_checked =
                    "string" == typeof this.checked || !!this.checked)
                : this.m_checked;
            },
            _disabled: function () {
              return "string" == typeof this.disabled || !!this.disabled;
            },
            _required: function () {
              return "string" == typeof this.required || !!this.required;
            },
            _indeterminate: function () {
              return (
                "string" == typeof this.indeterminate || !!this.indeterminate
              );
            },
            _trueValue: function () {
              return "string" == typeof this.trueValue
                ? this.trueValue
                : !!this.trueValue;
            },
            _falseValue: function () {
              return "string" == typeof this.falseValue
                ? this.falseValue
                : !!this.falseValue;
            },
            _toggle: function () {
              return "string" == typeof this.toggle || !!this.toggle;
            },
            _hover: function () {
              return "string" == typeof this.hover || !!this.hover;
            },
            _focus: function () {
              return "string" == typeof this.focus || !!this.focus;
            },
            classes: function () {
              return {
                pretty: !0,
                "p-default": this.default_mode,
                "p-round": "radio" === this._type && this.default_mode,
                "p-toggle": this._toggle,
                "p-has-hover": this._hover,
                "p-has-focus": this._focus,
                "p-has-indeterminate": this._indeterminate,
              };
            },
            onClasses: function () {
              var e = { state: !0, "p-on": this._toggle };
              return this.color && (e["p-" + this.color] = !0), e;
            },
            offClasses: function () {
              var e = { state: !0, "p-off": !0 };
              return this.offColor && (e["p-" + this.offColor] = !0), e;
            },
            hoverClasses: function () {
              var e = { state: !0, "p-is-hover": !0 };
              return this.hoverColor && (e["p-" + this.hoverColor] = !0), e;
            },
            indeterminateClasses: function () {
              var e = { state: !0, "p-is-indeterminate": !0 };
              return (
                this.indeterminateColor &&
                  (e["p-" + this.indeterminateColor] = !0),
                e
              );
            },
          },
          watch: {
            checked: function (e) {
              this.m_checked = e;
            },
            indeterminate: function (e) {
              this.$refs.input.indeterminate = e;
            },
          },
          mounted: function () {
            this.$vnode.data &&
              !this.$vnode.data.staticClass &&
              (this.default_mode = !0),
              this._indeterminate && (this.$refs.input.indeterminate = !0),
              this.$el.setAttribute("p-" + this._type, "");
          },
          methods: {
            updateInput: function (e) {
              if ("radio" !== this._type) {
                this.$emit("update:indeterminate", !1);
                var t = e.target.checked;
                if (((this.m_checked = t), this.modelValue instanceof Array)) {
                  var i = [].concat(
                    (function (e) {
                      if (Array.isArray(e)) {
                        for (var t = 0, i = Array(e.length); t < e.length; t++)
                          i[t] = e[t];
                        return i;
                      }
                      return Array.from(e);
                    })(this.modelValue)
                  );
                  t ? i.push(this.value) : i.splice(i.indexOf(this.value), 1),
                    this.$emit("change", i);
                } else
                  this.$emit(
                    "change",
                    t
                      ? !this._trueValue || this.trueValue
                      : !!this._falseValue && this.falseValue
                  );
              } else this.$emit("change", this.value);
            },
          },
        });
    },
    function (e, t, i) {
      var n = function () {
        var e = this.$createElement,
          t = this._self._c || e;
        return t("div", { class: this.classes }, [
          t("input", {
            ref: "input",
            attrs: {
              type: this._type,
              name: this.name,
              disabled: this._disabled,
              required: this._required,
            },
            domProps: { checked: this.shouldBeChecked, value: this.value },
            on: { change: this.updateInput },
          }),
          this._v(" "),
          t(
            "div",
            { class: this.onClasses },
            [
              this._t("extra"),
              this._v(" "),
              t("label", [this._t("default")], 2),
            ],
            2
          ),
          this._v(" "),
          this._toggle
            ? t(
                "div",
                { class: this.offClasses },
                [this._t("off-extra"), this._v(" "), this._t("off-label")],
                2
              )
            : this._e(),
          this._v(" "),
          this._hover
            ? t(
                "div",
                { class: this.hoverClasses },
                [this._t("hover-extra"), this._v(" "), this._t("hover-label")],
                2
              )
            : this._e(),
          this._v(" "),
          this._indeterminate
            ? t(
                "div",
                { class: this.indeterminateClasses },
                [
                  this._t("indeterminate-extra"),
                  this._v(" "),
                  this._t("indeterminate-label"),
                ],
                2
              )
            : this._e(),
        ]);
      };
      (n._withStripped = !0), (e.exports = { render: n, staticRenderFns: [] });
    },
    function (e, t, i) {
      var n = i(1)(i(6), null, !1, null, null, null);
      (n.options.__file = "src/PrettyCheckbox.vue"), (e.exports = n.exports);
    },
    function (e, t, i) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var n = i(0),
        s = {
          name: "pretty-checkbox",
          input_type: "checkbox",
          model: n.model,
          props: n.props,
          data: n.data,
          computed: n.computed,
          watch: n.watch,
          mounted: n.mounted,
          methods: n.methods,
          render: n.render,
        };
      t.default = s;
    },
    function (e, t, i) {
      var n = i(1)(i(8), null, !1, null, null, null);
      (n.options.__file = "src/PrettyRadio.vue"), (e.exports = n.exports);
    },
    function (e, t, i) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var n = i(0),
        s = {
          name: "pretty-radio",
          input_type: "radio",
          model: n.model,
          props: n.props,
          data: n.data,
          computed: n.computed,
          watch: n.watch,
          mounted: n.mounted,
          methods: n.methods,
          render: n.render,
        };
      t.default = s;
    },
  ]);
});
