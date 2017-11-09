// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE
'use strict';

var Curry              = require("bs-platform/lib/js/curry.js");
var Respect            = require("../src/Respect.js");
var TestHelpers        = require("./TestHelpers.js");
var Caml_oo_curry      = require("bs-platform/lib/js/caml_oo_curry.js");
var Respect_matchersV2 = require("../src/Respect_matchersV2.js");

Curry._1(Respect.Dsl[/* Async */12][/* register */3], Curry._2(Respect.Dsl[/* Async */12][/* describe */2], "MatchersV2", /* :: */[
          Curry._2(Respect.Dsl[/* Async */12][/* describe */2], "equal", /* :: */[
                Curry._2(Respect.Dsl[/* Async */12][/* it */1], "matches when args are equal", (function () {
                        var tmp = Respect_matchersV2.expect(5);
                        var partial_arg = Caml_oo_curry.js2(5793412, 1, tmp, Respect_matchersV2.equal(5));
                        var partial_arg$1 = TestHelpers.MatchHelper[/* shouldMatch */0];
                        return (function (param) {
                            return partial_arg$1(partial_arg, param);
                          });
                      })),
                /* :: */[
                  Curry._2(Respect.Dsl[/* Async */12][/* it */1], "fails when args are not equal", (function () {
                          var tmp = Respect_matchersV2.expect(5);
                          var partial_arg = Caml_oo_curry.js2(5793412, 2, tmp, Respect_matchersV2.equal(6));
                          var partial_arg$1 = TestHelpers.MatchHelper[/* shouldNotMatch */1];
                          return (function (param) {
                              return partial_arg$1(partial_arg, param);
                            });
                        })),
                  /* [] */0
                ]
              ]),
          /* [] */0
        ]));

/*  Not a pure module */