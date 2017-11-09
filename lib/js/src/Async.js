// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE
'use strict';

var Curry           = require("bs-platform/lib/js/curry.js");
var Js_exn          = require("bs-platform/lib/js/js_exn.js");
var Caml_exceptions = require("bs-platform/lib/js/caml_exceptions.js");

function $$return(x, param) {
  return Curry._1(param[0], x);
}

var JsError = Caml_exceptions.create("Async.JsError");

function bind(f, x, param) {
  var errorCB = param[1];
  var successCb = param[0];
  return Curry._1(x, /* tuple */[
              (function (a) {
                  try {
                    return Curry._2(f, a, /* tuple */[
                                successCb,
                                errorCB
                              ]);
                  }
                  catch (raw_x){
                    return Curry._1(errorCB, Js_exn.internalToOCamlException(raw_x));
                  }
                }),
              errorCB
            ]);
}

function map(f, x, param) {
  var errorCb = param[1];
  var successCb = param[0];
  return Curry._1(x, /* tuple */[
              (function (a) {
                  var exit = 0;
                  var x;
                  try {
                    x = Curry._1(f, a);
                    exit = 1;
                  }
                  catch (raw_x){
                    return Curry._1(errorCb, Js_exn.internalToOCamlException(raw_x));
                  }
                  if (exit === 1) {
                    return Curry._1(successCb, x);
                  }
                  
                }),
              errorCb
            ]);
}

function from_js(jsAsync, param) {
  var errorCb = param[1];
  var successCb = param[0];
  return Curry._1(jsAsync, (function (err, s) {
                if (err !== null) {
                  return Curry._1(errorCb, [
                              JsError,
                              err
                            ]);
                } else {
                  return Curry._1(successCb, s);
                }
              }));
}

function from_callback(fn, param) {
  return Curry._1(fn, param[0]);
}

function run(f, x) {
  return Curry._1(x, /* tuple */[
              f,
              (function () {
                  return /* () */0;
                })
            ]);
}

function runExn(fs, fe, x) {
  return Curry._1(x, /* tuple */[
              fs,
              fe
            ]);
}

exports.$$return      = $$return;
exports.JsError       = JsError;
exports.bind          = bind;
exports.map           = map;
exports.from_js       = from_js;
exports.from_callback = from_callback;
exports.run           = run;
exports.runExn        = runExn;
/* No side effect */