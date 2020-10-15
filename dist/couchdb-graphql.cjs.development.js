'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var apolloServerCore = require('apollo-server-core');
var queryString = _interopDefault(require('qs'));
var core = require('@graphql-modules/core');
require('isomorphic-fetch');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n    scalar JSON\n\n    type Query\n    type Mutation\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var base = {
  typeDefs:
  /*#__PURE__*/
  apolloServerCore.gql(
  /*#__PURE__*/
  _templateObject())
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

function createResolver(resolver) {
  return resolver;
}

function parseFetchResponse(_x) {
  return _parseFetchResponse.apply(this, arguments);
}

function _parseFetchResponse() {
  _parseFetchResponse = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(response) {
    var error;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(response.status >= 200 && response.status < 300)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", response.json());

          case 4:
            error = new Error(response.statusText); // @ts-ignore

            _context.next = 7;
            return response.json();

          case 7:
            error.response = _context.sent;
            throw error;

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _parseFetchResponse.apply(this, arguments);
}

/**
 * Returns an object where the key is the doc id and the value is the rejected document
 * and full conflicting documents
 */

function getConflictsByDocument(_x, _x2) {
  return _getConflictsByDocument.apply(this, arguments);
}
/**
 * Resolves conflicts by calling context.onResolveConflict and saving its result
 */


function _getConflictsByDocument() {
  _getConflictsByDocument = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(documents, context) {
    var _context$couchDb, fetch, dbUrl, dbName, documentsWithConflictRevs, conflictingDocuments, result;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName; // get _conflicts for each document

            _context.next = 3;
            return fetch(dbUrl + "/" + dbName + "/_all_docs?conflicts=true&include_docs=true", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                keys: documents.map(function (doc) {
                  return doc._id;
                })
              })
            }).then(parseFetchResponse).then(function (res) {
              return res.rows.map(function (row) {
                return row.doc;
              }).filter(function (doc) {
                return !!doc;
              });
            });

          case 3:
            documentsWithConflictRevs = _context.sent;
            _context.next = 6;
            return fetch(dbUrl + "/" + dbName + "/_bulk_get", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                docs: documentsWithConflictRevs.reduce(function (conflicts, doc) {
                  return [].concat(conflicts, (doc && doc._conflicts || []).map(function (rev) {
                    return {
                      id: doc._id,
                      rev: rev
                    };
                  }));
                }, [])
              })
            }).then(parseFetchResponse).then(function (res) {
              return res.results.map(function (row) {
                return row.docs[0].ok;
              }).filter(function (doc) {
                return !!doc;
              });
            });

          case 6:
            conflictingDocuments = _context.sent;
            result = documentsWithConflictRevs.reduce(function (result, doc) {
              if (!result[doc._id]) {
                var conflictedDoc = documentsWithConflictRevs.find(function (d) {
                  return d._id === doc._id;
                });
                result[doc._id] = {
                  // the document rejected by the conflict
                  document: documents.find(function (original) {
                    return original._id === doc._id;
                  }),
                  // add the stored document in the conflicts array
                  conflicts: [doc],
                  revToSave: conflictedDoc._rev
                };
              } // check if any _conflicts were for this document


              var conflicts = conflictingDocuments.filter(function (d) {
                return d._id === doc._id;
              });

              if (conflicts) {
                var _extends2;

                return _extends({}, result, (_extends2 = {}, _extends2[doc._id] = _extends({}, result[doc._id], {
                  conflicts: [].concat(result[doc._id].conflicts, conflicts)
                }), _extends2));
              }

              return result;
            }, {});
            return _context.abrupt("return", result);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getConflictsByDocument.apply(this, arguments);
}

function resolveConflicts(_x3, _x4) {
  return _resolveConflicts.apply(this, arguments);
}

function _resolveConflicts() {
  _resolveConflicts = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee3(documents, context) {
    var _context$couchDb2, fetch, dbName, dbUrl, onResolveConflict, onConflictsResolved, conflictingDocuments, resolvedDocs, docsToSave, response, resolvedDocuments;

    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context$couchDb2 = context.couchDb, fetch = _context$couchDb2.fetch, dbName = _context$couchDb2.dbName, dbUrl = _context$couchDb2.dbUrl, onResolveConflict = _context$couchDb2.onResolveConflict, onConflictsResolved = _context$couchDb2.onConflictsResolved;

            if (onResolveConflict) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", null);

          case 3:
            _context3.next = 5;
            return getConflictsByDocument(documents, context);

          case 5:
            conflictingDocuments = _context3.sent;
            _context3.next = 8;
            return Promise.all(Object.keys(conflictingDocuments).map(
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              runtime_1.mark(function _callee2(id) {
                var resolvedDocument, resolved;

                return runtime_1.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return onResolveConflict({
                          document: conflictingDocuments[id].document,
                          conflicts: conflictingDocuments[id].conflicts,
                          context: context
                        });

                      case 2:
                        resolvedDocument = _context2.sent;

                        if (!resolvedDocument) {
                          _context2.next = 6;
                          break;
                        }

                        resolved = _objectWithoutPropertiesLoose(resolvedDocument, ["_conflicts"]);
                        return _context2.abrupt("return", _extends({}, resolved, {
                          _rev: conflictingDocuments[id].revToSave
                        }));

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x5) {
                return _ref.apply(this, arguments);
              };
            }())).then(function (res) {
              return res.filter(function (x) {
                return !!x;
              });
            });

          case 8:
            resolvedDocs = _context3.sent;
            docsToSave = [].concat(resolvedDocs, Object.keys(conflictingDocuments).reduce(function (deleted, docId) {
              return [].concat(deleted, conflictingDocuments[docId].conflicts.map(function (conflict) {
                return _extends({}, conflict, {
                  _deleted: true
                });
              }).filter(function (conflict) {
                return conflict._rev !== conflictingDocuments[docId].revToSave;
              }));
            }, []));
            _context3.next = 12;
            return fetch(dbUrl + "/" + dbName + "/_bulk_docs", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                docs: docsToSave
              })
            }).then(parseFetchResponse);

          case 12:
            response = _context3.sent;
            resolvedDocuments = response.filter(function (result) {
              return result.ok;
            }).map(function (result) {
              return _extends({}, docsToSave.find(function (doc) {
                return doc._id === result.id;
              }), {
                _rev: result.rev,
                _id: result.id
              });
            });

            if (onConflictsResolved && resolvedDocuments.length > 0) {
              onConflictsResolved({
                documents: resolvedDocuments,
                context: context
              });
            }

            return _context3.abrupt("return", response);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _resolveConflicts.apply(this, arguments);
}

function put(_x, _x2, _x3) {
  return _put.apply(this, arguments);
}

function _put() {
  _put = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee2(context, doc, options) {
    var _doc$_rev;

    var _context$couchDb, fetch, dbUrl, dbName, onDocumentsSaved, _options, upsert, _options$new_edits, new_edits, url, rev, _ref, _rev, result, savedDocument;

    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }

            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName, onDocumentsSaved = _context$couchDb.onDocumentsSaved;
            _options = options, upsert = _options.upsert, _options$new_edits = _options.new_edits, new_edits = _options$new_edits === void 0 ? true : _options$new_edits;
            url = dbUrl + "/" + dbName + "/_bulk_docs";
            rev = (_doc$_rev = doc._rev) != null ? _doc$_rev : undefined; // don't let it be null
            // couchdb errors if _deleted is null

            if (doc._deleted === null) {
              delete doc._deleted;
            } // get previous _rev for upsert


            if (!upsert) {
              _context2.next = 21;
              break;
            }

            if (doc._id) {
              _context2.next = 9;
              break;
            }

            throw Error('upsert option requires input to contain _id');

          case 9:
            _context2.prev = 9;
            _context2.next = 12;
            return fetch(dbUrl + "/" + dbName + "/" + encodeURIComponent(doc._id)).then(parseFetchResponse);

          case 12:
            _ref = _context2.sent;
            _rev = _ref._rev;
            rev = _rev;
            _context2.next = 21;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](9);

            if (!(!_context2.t0.response || _context2.t0.response.status !== 404)) {
              _context2.next = 21;
              break;
            }

            throw _context2.t0;

          case 21:
            _context2.next = 23;
            return fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                docs: [_extends({}, doc, {
                  _rev: rev
                })],
                new_edits: new_edits
              })
            }).then(parseFetchResponse).then(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              runtime_1.mark(function _callee(res) {
                var result, _ref3, resolved;

                return runtime_1.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        result = Array.isArray(res) ? res[0] : res; // resolve conflicts

                        if (!(result && result.id && result.error === 'conflict')) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 4;
                        return resolveConflicts([doc], context);

                      case 4:
                        _ref3 = _context.sent;
                        resolved = _ref3[0];

                        if (!resolved) {
                          _context.next = 8;
                          break;
                        }

                        return _context.abrupt("return", resolved);

                      case 8:
                        return _context.abrupt("return", result);

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 23:
            result = _context2.sent;

            if (!(result && result.error)) {
              _context2.next = 26;
              break;
            }

            throw new Error(result.reason);

          case 26:
            if (!result) {
              _context2.next = 32;
              break;
            }

            savedDocument = _extends({}, doc, {
              _id: result.id,
              _rev: result.rev
            });

            if (onDocumentsSaved) {
              onDocumentsSaved({
                documents: [savedDocument],
                context: context
              });
            }

            return _context2.abrupt("return", savedDocument);

          case 32:
            return _context2.abrupt("return", null);

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[9, 17]]);
  }));
  return _put.apply(this, arguments);
}

function _templateObject$1() {
  var data = _taggedTemplateLiteralLoose(["\n  type PutResponse {\n    _id: String!\n    _rev: String\n    document: JSON\n  }\n\n  extend type Mutation {\n    put(input: JSON, upsert: Boolean, new_edits: Boolean): PutResponse\n  }\n"]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}
/**
 * PUTs a document using _bulk_docs endpoint
 */

var typeDefs =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$1());
var resolvers = {
  Mutation: {
    put:
    /*#__PURE__*/
    createResolver(
    /*#__PURE__*/
    function () {
      var _ref2 =
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      runtime_1.mark(function _callee(parent, _ref, context, info) {
        var input, upsert, _ref$new_edits, new_edits, document;

        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                input = _ref.input, upsert = _ref.upsert, _ref$new_edits = _ref.new_edits, new_edits = _ref$new_edits === void 0 ? true : _ref$new_edits;
                _context.next = 3;
                return put(context, input, {
                  upsert: upsert,
                  new_edits: new_edits
                });

              case 3:
                document = _context.sent;
                return _context.abrupt("return", {
                  _id: document._id,
                  _rev: document._rev,
                  document: document
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }())
  }
};

var put$1 = {
  __proto__: null,
  typeDefs: typeDefs,
  resolvers: resolvers
};

function bulkDocs(_x, _x2, _x3) {
  return _bulkDocs.apply(this, arguments);
}

function _bulkDocs() {
  _bulkDocs = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee2(context, docs, options) {
    var _context$couchDb, fetch, dbUrl, dbName, onDocumentsSaved, _options, upsert, _options$new_edits, new_edits, url, previousRevs, ids, _ref, allDocs, saveResults, response;

    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }

            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName, onDocumentsSaved = _context$couchDb.onDocumentsSaved;
            _options = options, upsert = _options.upsert, _options$new_edits = _options.new_edits, new_edits = _options$new_edits === void 0 ? true : _options$new_edits;
            url = dbUrl + "/" + dbName + "/_bulk_docs";
            previousRevs = {}; // get previous _revs for upsert

            if (!upsert) {
              _context2.next = 12;
              break;
            }

            ids = docs.map(function (i) {
              return i._id;
            }).filter(function (id) {
              return !!id;
            });
            _context2.next = 9;
            return fetch(dbUrl + "/" + dbName + "/_all_docs", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                keys: ids
              })
            }).then(parseFetchResponse);

          case 9:
            _ref = _context2.sent;
            allDocs = _ref.data;
            allDocs.rows.forEach(function (row) {
              previousRevs[row.id] = row.value ? row.value.rev : null;
            });

          case 12:
            _context2.next = 14;
            return fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                docs: docs.map(function (doc) {
                  var _ref2;

                  var docToSave = _extends({}, doc, {
                    _rev: // fallback to undefined if it is null
                    (_ref2 = upsert && doc._id ? previousRevs[doc._id] : doc._rev) != null ? _ref2 : undefined
                  });

                  if (docToSave._deleted === null) {
                    delete docToSave._deleted;
                  }

                  return docToSave;
                }),
                new_edits: new_edits
              })
            }).then(parseFetchResponse).then(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              runtime_1.mark(function _callee(res) {
                var conflicts, resolved;
                return runtime_1.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // resolve conflicts
                        conflicts = res.filter(function (result) {
                          return result.error === 'conflict';
                        });

                        if (!(conflicts.length > 0)) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 4;
                        return resolveConflicts(docs.filter(function (doc) {
                          return conflicts.find(function (conflict) {
                            return conflict.id === doc._id;
                          });
                        }), context);

                      case 4:
                        resolved = _context.sent;

                        if (!resolved) {
                          _context.next = 7;
                          break;
                        }

                        return _context.abrupt("return", res.map(function (saveResult) {
                          var resolvedDoc = resolved.find(function (resolvedResult) {
                            return resolvedResult.id === saveResult.id;
                          });

                          if (saveResult.error === 'conflict' && resolvedDoc) {
                            return resolvedDoc;
                          }

                          return saveResult;
                        }));

                      case 7:
                        return _context.abrupt("return", res);

                      case 8:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 14:
            saveResults = _context2.sent;
            response = saveResults.map(function (result, index) {
              var document = docs[index];

              var _rev = result.error ? // if an error, return the last _rev
              previousRevs[document._id] || document._rev : // otherwise result.rev will be populated
              result.rev;

              return {
                _id: result.id,
                _rev: _rev,
                error: result.error,
                reason: result.reason,
                document: _extends({}, document, {
                  _id: result.id,
                  _rev: _rev
                })
              };
            });

            if (onDocumentsSaved) {
              onDocumentsSaved({
                documents: response.filter(function (res) {
                  return !res.error;
                }).map(function (res) {
                  return res.document;
                }),
                context: context
              });
            }

            return _context2.abrupt("return", response);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _bulkDocs.apply(this, arguments);
}

function _templateObject$2() {
  var data = _taggedTemplateLiteralLoose(["\n  type BulkDocsResponseObject {\n    _id: String\n    _rev: String\n    document: JSON\n    error: String\n    reason: String\n  }\n\n  extend type Mutation {\n    bulkDocs(\n      input: [JSON!]!\n      upsert: Boolean\n      new_edits: Boolean\n    ): [BulkDocsResponseObject]\n  }\n"]);

  _templateObject$2 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$1 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$2());
var resolvers$1 = {
  Mutation: {
    bulkDocs:
    /*#__PURE__*/
    createResolver(function (parent, _ref, context, info) {
      var input = _ref.input,
          upsert = _ref.upsert,
          _ref$new_edits = _ref.new_edits,
          new_edits = _ref$new_edits === void 0 ? true : _ref$new_edits;
      return bulkDocs(context, input, {
        upsert: upsert,
        new_edits: new_edits
      });
    })
  }
};

var bulkDocs$1 = {
  __proto__: null,
  typeDefs: typeDefs$1,
  resolvers: resolvers$1
};



var mutations = {
  __proto__: null,
  put: put$1,
  bulkDocs: bulkDocs$1
};

function allDocs(_x, _x2) {
  return _allDocs.apply(this, arguments);
}

function _allDocs() {
  _allDocs = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(context, _temp) {
    var _ref, keys, key, endkey, startkey, args, fetch, url, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref = _temp === void 0 ? {} : _temp, keys = _ref.keys, key = _ref.key, endkey = _ref.endkey, startkey = _ref.startkey, args = _objectWithoutPropertiesLoose(_ref, ["keys", "key", "endkey", "startkey"]);
            fetch = context.couchDb.fetch;
            url = context.couchDb.dbUrl + "/" + context.couchDb.dbName + "/_all_docs";

            if (args) {
              url += "?" + queryString.stringify(args);
            }

            _context.next = 6;
            return fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                keys: keys,
                key: key,
                endkey: endkey,
                startkey: startkey
              })
            }).then(parseFetchResponse);

          case 6:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _allDocs.apply(this, arguments);
}

function _templateObject$3() {
  var data = _taggedTemplateLiteralLoose(["\n  type AllDocsRow {\n    id: String!\n    rev: String\n    value: JSON\n    doc: JSON\n  }\n\n  type AllDocsResponse {\n    total_rows: Int!\n    offset: Int!\n    rows: [AllDocsRow!]!\n  }\n\n  extend type Query {\n    allDocs(\n      conflicts: Boolean\n      endkey: JSON\n      include_docs: Boolean\n      inclusive_end: Boolean\n      key: JSON\n      keys: [JSON!]\n      limit: Int\n      skip: Int\n      startkey: JSON\n      update_seq: Boolean\n    ): AllDocsResponse\n  }\n"]);

  _templateObject$3 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$2 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$3());
var resolvers$2 = {
  Query: {
    allDocs:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return allDocs(context, args);
    })
  }
};

var allDocs$1 = {
  __proto__: null,
  typeDefs: typeDefs$2,
  resolvers: resolvers$2
};

function bulkGet(_x, _x2, _x3) {
  return _bulkGet.apply(this, arguments);
}

function _bulkGet() {
  _bulkGet = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(docs, context, _temp) {
    var _ref, revs, _context$couchDb, fetch, dbUrl, dbName, url, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref = _temp === void 0 ? {} : _temp, revs = _ref.revs;
            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName;
            url = dbUrl + "/" + dbName + "/_bulk_get";

            if (revs) {
              url += "?" + queryString.stringify({
                revs: revs
              });
            }

            _context.next = 6;
            return fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                docs: docs,
                revs: revs
              })
            }).then(parseFetchResponse);

          case 6:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _bulkGet.apply(this, arguments);
}

function _templateObject$4() {
  var data = _taggedTemplateLiteralLoose(["\n  input BulkGetInput {\n    id: String!\n    rev: String\n  }\n\n  type BulkGetResponse {\n    results: [BulkGetResult!]!\n  }\n\n  type BulkGetResult {\n    id: String\n    docs: [BulkGetDocs!]!\n  }\n\n  type BulkGetDocs {\n    ok: JSON\n    error: BulkGetError\n  }\n\n  type BulkGetError {\n    id: String\n    rev: String\n    error: String\n    reason: String\n  }\n\n  extend type Query {\n    bulkGet(docs: [BulkGetInput!]!, revs: Boolean): BulkGetResponse\n  }\n"]);

  _templateObject$4 = function _templateObject() {
    return data;
  };

  return data;
}
/**
 * Generic GET on a document
 */

var typeDefs$3 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$4());
var resolvers$3 = {
  Query: {
    bulkGet:
    /*#__PURE__*/
    createResolver(function (parent, _ref, context, info) {
      var docs = _ref.docs,
          revs = _ref.revs;
      return bulkGet(docs, context, {
        revs: revs
      });
    })
  }
};

var bulkGet$1 = {
  __proto__: null,
  typeDefs: typeDefs$3,
  resolvers: resolvers$3
};

function changes(_x, _x2) {
  return _changes.apply(this, arguments);
}

function _changes() {
  _changes = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(context, options) {
    var _context$couchDb, fetch, dbName, hasArgs, url, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbName = _context$couchDb.dbName;
            hasArgs = Object.keys(options).length > 0;
            url = context + "/" + context + "/_changes";

            if (hasArgs) {
              if (options.lastEventId) {
                delete options.lastEventId;
                options['last-event-id'] = options.lastEventId;
              } // if options.since is not 'now', convert to number


              if (options.since && options.since !== 'now') {
                options.since = parseInt(options.since);
              }

              url += "?" + queryString.stringify(options);
            }

            _context.next = 6;
            return fetch(url).then(parseFetchResponse);

          case 6:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _changes.apply(this, arguments);
}

function _templateObject$5() {
  var data = _taggedTemplateLiteralLoose(["\n  type Change {\n    rev: String\n  }\n  type ChangesResult {\n    changes: [Change]\n    id: String\n    seq: JSON\n    doc: JSON\n    deleted: Boolean\n  }\n\n  type ChangesResponse {\n    last_seq: JSON\n    pending: Int\n    results: [ChangesResult]\n  }\n\n  extend type Query {\n    changes(\n      doc_ids: [String!]\n      conflicts: Boolean\n      descending: Boolean\n      feed: String\n      filter: String\n      heartbeat: Int\n      include_docs: Boolean\n      attachments: Boolean\n      att_encoding_info: Boolean\n      lastEventId: Int\n      limit: Int\n      since: String\n      timeout: Int\n      view: String\n      seq_interval: Int\n    ): ChangesResponse\n  }\n"]);

  _templateObject$5 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$4 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$5());
var resolvers$4 = {
  Query: {
    changes:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return changes(context, args);
    })
  }
};

var changes$1 = {
  __proto__: null,
  typeDefs: typeDefs$4,
  resolvers: resolvers$4
};

function find(_x, _x2) {
  return _find.apply(this, arguments);
}

function _find() {
  _find = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(context, options) {
    var _context$couchDb, fetch, dbUrl, dbName, url, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName;
            url = dbUrl + "/" + dbName + "/_find";
            _context.next = 4;
            return fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(options)
            }).then(parseFetchResponse);

          case 4:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _find.apply(this, arguments);
}

function get(_x, _x2, _x3) {
  return _get.apply(this, arguments);
}

function _get() {
  _get = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(context, id, options) {
    var _context$couchDb, fetch, dbUrl, dbName, hasArgs, url, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }

            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName;
            hasArgs = Object.keys(options).length > 0;
            url = dbUrl + "/" + dbName + "/" + encodeURIComponent(id);

            if (hasArgs) {
              url += "?" + queryString.stringify(options);
            }

            _context.next = 7;
            return fetch(url).then(parseFetchResponse);

          case 7:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _get.apply(this, arguments);
}

function info(_x) {
  return _info.apply(this, arguments);
}

function _info() {
  _info = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(context) {
    var _context$couchDb, fetch, dbUrl, dbName, url, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName;
            url = dbUrl + "/" + dbName;
            _context.next = 4;
            return fetch(url).then(parseFetchResponse);

          case 4:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _info.apply(this, arguments);
}

function query(_x, _x2) {
  return _query.apply(this, arguments);
}

function _query() {
  _query = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(context, _ref) {
    var view, ddoc, key, keys, options, _context$couchDb, fetch, dbUrl, dbName, onDocumentsSaved, postOptions, url, hasArgs, fetchOptions, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            view = _ref.view, ddoc = _ref.ddoc, key = _ref.key, keys = _ref.keys, options = _objectWithoutPropertiesLoose(_ref, ["view", "ddoc", "key", "keys"]);
            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName, onDocumentsSaved = _context$couchDb.onDocumentsSaved;
            postOptions = {
              key: key,
              keys: keys
            };
            url = dbUrl + "/" + dbName + "/_design/" + ddoc + "/_view/" + view;

            if (options) {
              url += "?" + queryString.stringify(options);
            }

            hasArgs = Object.keys(postOptions).length > 0;
            fetchOptions = {};

            if (hasArgs) {
              fetchOptions.method = 'POST';
              fetchOptions.body = JSON.stringify(postOptions);
              fetchOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              };
            }

            _context.next = 10;
            return fetch(url, fetchOptions).then(parseFetchResponse);

          case 10:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _query.apply(this, arguments);
}

function search(_x, _x2) {
  return _search.apply(this, arguments);
}

function _search() {
  _search = _asyncToGenerator(
  /*#__PURE__*/
  runtime_1.mark(function _callee(context, _ref) {
    var index, ddoc, options, _context$couchDb, fetch, dbUrl, dbName, url, response;

    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            index = _ref.index, ddoc = _ref.ddoc, options = _objectWithoutPropertiesLoose(_ref, ["index", "ddoc"]);
            _context$couchDb = context.couchDb, fetch = _context$couchDb.fetch, dbUrl = _context$couchDb.dbUrl, dbName = _context$couchDb.dbName;
            url = dbUrl + "/" + dbName + "/_design/" + ddoc + "/_search/" + index;
            _context.next = 5;
            return fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(options)
            }).then(parseFetchResponse);

          case 5:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _search.apply(this, arguments);
}

function _templateObject$6() {
  var data = _taggedTemplateLiteralLoose(["\n  type FindResponse {\n    execution_stats: JSON\n    bookmark: String\n    warning: String\n    docs: [JSON!]\n  }\n\n  extend type Query {\n    find(\n      selector: JSON!\n      limit: Int\n      skip: Int\n      sort: Int\n      fields: [String!]\n      use_index: [String!]\n      r: Int\n      bookmark: String\n      update: Boolean\n      stable: Boolean\n      stale: String\n      execution_stats: Boolean\n    ): FindResponse\n  }\n"]);

  _templateObject$6 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$5 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$6());
var resolvers$5 = {
  Query: {
    find:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return find(context, args);
    })
  }
};

var find$1 = {
  __proto__: null,
  typeDefs: typeDefs$5,
  resolvers: resolvers$5
};

function _templateObject$7() {
  var data = _taggedTemplateLiteralLoose(["\n  type GetResponse {\n    _id: String!\n    _rev: String\n    document: JSON\n  }\n\n  extend type Query {\n    get(\n      id: String!\n      rev: String\n      revs: Boolean\n      revs_info: Boolean\n      open_revs: Boolean\n      conflicts: Boolean\n      attachments: Boolean\n      latest: Boolean\n    ): GetResponse\n  }\n"]);

  _templateObject$7 = function _templateObject() {
    return data;
  };

  return data;
}
/**
 * Generic GET on a document
 */

var typeDefs$6 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$7());
var resolvers$6 = {
  Query: {
    get:
    /*#__PURE__*/
    createResolver(
    /*#__PURE__*/
    function () {
      var _ref2 =
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      runtime_1.mark(function _callee(parent, _ref, context, info) {
        var id, args, document;
        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = _ref.id, args =
                /*#__PURE__*/
                _objectWithoutPropertiesLoose(_ref, ["id"]);
                _context.next = 3;
                return get(context, id, args);

              case 3:
                document = _context.sent;
                return _context.abrupt("return", {
                  _id: document._id,
                  _rev: document._rev,
                  document: document
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }())
  }
};

var get$1 = {
  __proto__: null,
  typeDefs: typeDefs$6,
  resolvers: resolvers$6
};

function _templateObject$8() {
  var data = _taggedTemplateLiteralLoose(["\n  type Sizes {\n    file: Int\n    external: Int\n    active: Int\n  }\n\n  type Other {\n    data_size: Int\n  }\n\n  type Cluster {\n    q: Int\n    n: Int\n    w: Int\n    r: Int\n  }\n\n  type InfoResponse {\n    db_name: String\n    update_seq: String\n    sizes: Sizes\n    purge_seq: Int\n    other: Other\n    doc_del_count: Int\n    doc_count: Int\n    disk_size: Int\n    disk_format_version: Int\n    data_size: Int\n    compact_running: Boolean\n    cluster: Cluster\n    instance_start_time: Int\n  }\n\n  extend type Query {\n    info: InfoResponse\n  }\n"]);

  _templateObject$8 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$7 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$8());
var resolvers$7 = {
  Query: {
    info:
    /*#__PURE__*/
    createResolver(function (parent, args, context) {
      return info(context);
    })
  }
};

var info$1 = {
  __proto__: null,
  typeDefs: typeDefs$7,
  resolvers: resolvers$7
};

function _templateObject$9() {
  var data = _taggedTemplateLiteralLoose(["\n  type QueryResponse {\n    offset: Int\n    update_seq: JSON\n    total_rows: Int\n    rows: [QueryRow!]\n  }\n\n  type QueryRow {\n    id: String\n    key: JSON\n    value: JSON\n  }\n\n  extend type Query {\n    query(\n      ddoc: String!\n      view: String!\n      conflicts: Boolean\n      descending: Boolean\n      endkey: JSON\n      group: Boolean\n      group_level: Int\n      include_docs: Boolean\n      attachments: Boolean\n      att_encoding_info: Boolean\n      inclusive_end: Boolean\n      key: JSON\n      keys: [JSON!]\n      limit: Int\n      reduce: Boolean\n      skip: Int\n      sorted: Boolean\n      stable: Boolean\n      stale: String\n      startkey: JSON\n      update: String\n      update_seq: Boolean\n    ): QueryResponse\n  }\n"]);

  _templateObject$9 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$8 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$9());
var resolvers$8 = {
  Query: {
    query:
    /*#__PURE__*/
    createResolver(
    /*#__PURE__*/
    function () {
      var _ref =
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      runtime_1.mark(function _callee(parent, args, context, info) {
        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", query(context, args));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }())
  }
};

var query$1 = {
  __proto__: null,
  typeDefs: typeDefs$8,
  resolvers: resolvers$8
};

function _templateObject$a() {
  var data = _taggedTemplateLiteralLoose(["\n  type SearchResponse {\n    total_rows: Int!\n    bookmark: String!\n    rows: [SearchRow]!\n    counts: JSON\n  }\n\n  type SearchRow {\n    id: String!\n    order: [Int!]!\n    fields: JSON!\n    doc: JSON\n  }\n\n  extend type Query {\n    search(\n      index: String!\n      ddoc: String!\n      bookmark: String\n      counts: [String!]\n      drilldown: JSON\n      group_field: String\n      group_limit: Int\n      group_sort: JSON\n      highlight_fields: [String!]\n      highlight_pre_tag: String\n      highlight_post_tag: String\n      highlight_number: Int\n      highlight_size: Int\n      include_docs: Boolean\n      include_fields: [String!]\n      limit: Int\n      query: String!\n      ranges: JSON\n      sort: [String!]\n      stale: String\n    ): SearchResponse\n  }\n"]);

  _templateObject$a = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$9 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$a());
var resolvers$9 = {
  Query: {
    search:
    /*#__PURE__*/
    createResolver(
    /*#__PURE__*/
    function () {
      var _ref =
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      runtime_1.mark(function _callee(parent, args, context, info) {
        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", search(context, args));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }())
  }
};

var search$1 = {
  __proto__: null,
  typeDefs: typeDefs$9,
  resolvers: resolvers$9
};



var queries = {
  __proto__: null,
  get: get$1,
  info: info$1,
  bulkGet: bulkGet$1,
  changes: changes$1,
  search: search$1,
  find: find$1,
  query: query$1,
  allDocs: allDocs$1
};

function createCouchDbModule(_ref, moduleConfig) {
  var cloudant = _ref.cloudant,
      options = _objectWithoutPropertiesLoose(_ref, ["cloudant"]);

  // separate cloudant queries from couchdb
  var couchdbQueries = _objectWithoutPropertiesLoose(queries, ["search"]); // combine typeDefs


  var typeDefs = [base.typeDefs].concat(Object.keys(cloudant ? queries : couchdbQueries).map(function (key) {
    return queries[key].typeDefs;
  }), Object.keys(mutations).map(function (key) {
    return mutations[key].typeDefs;
  }));

  if (options.typeDefs) {
    if (Array.isArray(options.typeDefs)) {
      typeDefs.push.apply(typeDefs, options.typeDefs);
    } else {
      typeDefs.push(options.typeDefs);
    }
  } // combine resolvers


  var resolvers = [].concat(Object.keys(cloudant ? queries : couchdbQueries).map(function (key) {
    return queries[key].resolvers;
  }), Object.keys(mutations).map(function (key) {
    return mutations[key].resolvers;
  }));

  if (options.resolvers) {
    if (Array.isArray(options.resolvers)) {
      resolvers.push.apply(resolvers, options.resolvers);
    } else {
      resolvers.push(options.resolvers);
    }
  }

  return new core.GraphQLModule(_extends({}, options, {
    typeDefs: typeDefs,
    resolvers: resolvers
  }), moduleConfig);
}

function createContext(args) {
  return {
    couchDb: _extends({
      fetch: fetch
    }, args)
  };
}

exports.allDocs = allDocs;
exports.base = base;
exports.bulkDocs = bulkDocs;
exports.bulkGet = bulkGet;
exports.changes = changes;
exports.createContext = createContext;
exports.createCouchDbModule = createCouchDbModule;
exports.createResolver = createResolver;
exports.find = find;
exports.get = get;
exports.info = info;
exports.mutations = mutations;
exports.put = put;
exports.queries = queries;
exports.query = query;
exports.resolveConflicts = resolveConflicts;
exports.search = search;
//# sourceMappingURL=couchdb-graphql.cjs.development.js.map
