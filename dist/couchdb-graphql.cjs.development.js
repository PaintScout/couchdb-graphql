'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var apolloServerCore = require('apollo-server-core');
require('isomorphic-fetch');
var queryString = _interopDefault(require('qs'));
var federation = require('@apollo/federation');

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
  var data = _taggedTemplateLiteralLoose(["\n    scalar JSON\n  "]);

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

function createContext(args) {
  return {
    couchDb: _extends({
      fetch: fetch
    }, args)
  };
}

function createResolver(resolver) {
  return resolver;
}

// A type of promise-like that resolves synchronously and supports only one observer
const _iteratorSymbol =
/*#__PURE__*/
typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator"; // Asynchronously iterate through an object's values
const _asyncIteratorSymbol =
/*#__PURE__*/
typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator"; // Asynchronously iterate on a value using it's async iterator if present, or its synchronous iterator if missing

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
} // Asynchronously await a promise and pass the result to a finally continuation

function parseFetchResponse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    var error = new Error(response.statusText); // @ts-ignore

    error.response = response;
    throw error;
  }
}

/**
 * Returns an object where the key is the doc id and the value is the rejected document
 * and full conflicting documents
 */

/**
 * Resolves conflicts by calling context.onResolveConflict and saving its result
 */
var resolveConflicts = function resolveConflicts(documents, context) {
  try {
    var _context$couchDb2 = context.couchDb,
        fetch = _context$couchDb2.fetch,
        dbName = _context$couchDb2.dbName,
        dbUrl = _context$couchDb2.dbUrl,
        onResolveConflict = _context$couchDb2.onResolveConflict,
        onConflictsResolved = _context$couchDb2.onConflictsResolved;

    if (!onResolveConflict) {
      return Promise.resolve(null);
    }

    return Promise.resolve(getConflictsByDocument(documents, context)).then(function (conflictingDocuments) {
      return Promise.resolve(Promise.all(Object.keys(conflictingDocuments).map(function (id) {
        try {
          return Promise.resolve(onResolveConflict({
            document: conflictingDocuments[id].document,
            conflicts: conflictingDocuments[id].conflicts,
            context: context
          })).then(function (resolvedDocument) {
            if (!resolvedDocument) {
              throw new Error('onResolveConflict must return a document');
            }

            var _conflicts = resolvedDocument._conflicts,
                resolved = _objectWithoutPropertiesLoose(resolvedDocument, ["_conflicts"]);

            return _extends({}, resolved, {
              _rev: conflictingDocuments[id].revToSave
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }))).then(function (resolvedDocs) {
        var docsToSave = [].concat(resolvedDocs, Object.keys(conflictingDocuments).reduce(function (deleted, docId) {
          return [].concat(deleted, conflictingDocuments[docId].conflicts.map(function (conflict) {
            return _extends({}, conflict, {
              _deleted: true
            });
          }).filter(function (conflict) {
            return conflict._rev !== conflictingDocuments[docId].revToSave;
          }));
        }, []));
        return Promise.resolve(fetch(dbUrl + "/" + dbName + "/_bulk_docs", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            docs: docsToSave
          })
        }).then(parseFetchResponse)).then(function (response) {
          if (onConflictsResolved) {
            onConflictsResolved({
              documents: response.filter(function (result) {
                return result.ok;
              }).map(function (result) {
                return _extends({}, docsToSave.find(function (doc) {
                  return doc._id === result.id;
                }), {
                  _rev: result.rev,
                  _id: result.id
                });
              }),
              context: context
            });
          }

          return response;
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var getConflictsByDocument = function getConflictsByDocument(documents, context) {
  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName; // get _conflicts for each document

    return Promise.resolve(fetch(dbUrl + "/" + dbName + "/_all_docs?conflicts=true&include_docs=true", {
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
    })).then(function (documentsWithConflictRevs) {
      // get full document for each _conflict
      return Promise.resolve(fetch(dbUrl + "/" + dbName + "/_bulk_get", {
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
      })).then(function (conflictingDocuments) {
        var result = documentsWithConflictRevs.reduce(function (result, doc) {
          if (!result[doc._id]) {
            var conflictedDoc = documentsWithConflictRevs.find(function (d) {
              return d._id === doc._id;
            });
            result[doc._id] = {
              // the document rejected by the conflict
              document: documents.find(function (original) {
                return original._id === doc._id;
              }),
              // all conflicts in the db including the one with _conflicts
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
        return result;
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var put = function put(context, doc, options) {
  if (options === void 0) {
    options = {};
  }

  try {
    var _temp3 = function _temp3(_result2) {
      return _exit2 ? _result2 : Promise.resolve(fetch(url, {
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
      }).then(parseFetchResponse).then(function (res) {
        try {
          var _exit4 = false;
          var result = res[0]; // resolve conflicts

          var _temp6 = function () {
            if (result && result.id && result.error === 'conflict') {
              return Promise.resolve(resolveConflicts([doc], context)).then(function (resolved) {
                _exit4 = true;
                return resolved[0];
              });
            }
          }();

          return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function (_result3) {
            return _exit4 ? _result3 : result;
          }) : _exit4 ? _temp6 : result);
        } catch (e) {
          return Promise.reject(e);
        }
      })).then(function (result) {
        if (result && result.error) {
          throw new Error(result.reason);
        }

        if (result) {
          var savedDocument = _extends({}, doc, {
            _id: result.id,
            _rev: result.rev
          });

          if (onDocumentsSaved) {
            onDocumentsSaved({
              documents: [savedDocument],
              context: context
            });
          }

          return savedDocument;
        } else {
          // new_edits=false returns empty response
          return null;
        }
      });
    };

    var _exit2 = false;
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName,
        onDocumentsSaved = _context$couchDb.onDocumentsSaved;
    var _options = options,
        upsert = _options.upsert,
        _options$new_edits = _options.new_edits,
        new_edits = _options$new_edits === void 0 ? true : _options$new_edits;
    var url = dbUrl + "/" + dbName + "/_bulk_docs";
    var rev = doc._rev; // get previous _rev for upsert

    var _temp4 = function () {
      if (upsert) {
        if (!doc._id) {
          throw Error('upsert option requires input to contain _id');
        }

        return _catch(function () {
          return Promise.resolve(fetch(dbUrl + "/" + dbName + "/" + encodeURIComponent(doc._id)).then(parseFetchResponse)).then(function (_ref) {
            var _rev = _ref._rev;
            rev = _rev;
          });
        }, function (e) {
          if (!e.response || e.response.status !== 404) {
            throw e;
          }
        });
      }
    }();

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
};

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
var resolvers =
/*#__PURE__*/
createResolver({
  Mutation: {
    put: function (parent, _ref, context, info) {
      var input = _ref.input,
          upsert = _ref.upsert,
          _ref$new_edits = _ref.new_edits,
          new_edits = _ref$new_edits === void 0 ? true : _ref$new_edits;

      try {
        return Promise.resolve(put(context, input, {
          upsert: upsert,
          new_edits: new_edits
        })).then(function (document) {
          return {
            _id: document._id,
            _rev: document._rev,
            document: document
          };
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var put$1 = ({
  __proto__: null,
  typeDefs: typeDefs,
  resolvers: resolvers
});

var bulkDocs = function bulkDocs(context, docs, options) {
  if (options === void 0) {
    options = {};
  }

  try {
    var _temp3 = function _temp3() {
      return Promise.resolve(fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          docs: docs.map(function (doc) {
            return _extends({}, doc, {
              _rev: upsert && doc._id ? previousRevs[doc._id] : doc._rev
            });
          }),
          new_edits: new_edits
        })
      }).then(parseFetchResponse).then(function (res) {
        try {
          var _exit2 = false;
          // resolve conflicts
          var conflicts = res.filter(function (result) {
            return result.error === 'conflict';
          });

          var _temp6 = function () {
            if (conflicts.length > 0) {
              return Promise.resolve(resolveConflicts(docs.filter(function (doc) {
                return conflicts.find(function (conflict) {
                  return conflict.id === doc._id;
                });
              }), context)).then(function (resolved) {
                if (resolved) {
                  // update any "conflict" results with the resolved result
                  _exit2 = true;
                  return res.map(function (saveResult) {
                    var resolvedDoc = resolved.find(function (resolvedResult) {
                      return resolvedResult.id === saveResult.id;
                    });

                    if (saveResult.error === 'conflict' && resolvedDoc) {
                      return resolvedDoc;
                    }

                    return saveResult;
                  });
                }
              });
            }
          }();

          return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function (_result) {
            return _exit2 ? _result : res;
          }) : _exit2 ? _temp6 : res); // return bulkDocs data
        } catch (e) {
          return Promise.reject(e);
        }
      })).then(function (saveResults) {
        var response = saveResults.map(function (result, index) {
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

        return response;
      });
    };

    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName,
        onDocumentsSaved = _context$couchDb.onDocumentsSaved;
    var _options = options,
        upsert = _options.upsert,
        _options$new_edits = _options.new_edits,
        new_edits = _options$new_edits === void 0 ? true : _options$new_edits;
    var url = dbUrl + "/" + dbName + "/_bulk_docs";
    var previousRevs = {}; // get previous _revs for upsert

    var _temp4 = function () {
      if (upsert) {
        var ids = docs.map(function (i) {
          return i._id;
        }).filter(function (id) {
          return !!id;
        });
        return Promise.resolve(fetch(dbUrl + "/" + dbName + "/_all_docs", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            keys: ids
          })
        }).then(parseFetchResponse)).then(function (_ref) {
          var allDocs = _ref.data;
          allDocs.rows.forEach(function (row) {
            previousRevs[row.id] = row.value ? row.value.rev : null;
          });
        });
      }
    }();

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
};

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
var resolvers$1 =
/*#__PURE__*/
createResolver({
  Mutation: {
    bulkDocs: function (parent, _ref, context, info) {
      var input = _ref.input,
          upsert = _ref.upsert,
          _ref$new_edits = _ref.new_edits,
          new_edits = _ref$new_edits === void 0 ? true : _ref$new_edits;

      try {
        return Promise.resolve(bulkDocs(context, input, {
          upsert: upsert,
          new_edits: new_edits
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var bulkDocs$1 = ({
  __proto__: null,
  typeDefs: typeDefs$1,
  resolvers: resolvers$1
});



var mutations = ({
  __proto__: null,
  put: put$1,
  bulkDocs: bulkDocs$1
});

var allDocs = function allDocs(context, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      keys = _ref.keys,
      key = _ref.key,
      endkey = _ref.endkey,
      startkey = _ref.startkey,
      args = _objectWithoutPropertiesLoose(_ref, ["keys", "key", "endkey", "startkey"]);

  try {
    var fetch = context.couchDb.fetch;
    var url = context.couchDb.dbUrl + "/" + context.couchDb.dbName + "/_all_docs";

    if (args) {
      url += "?" + queryString.stringify(args);
    }

    return Promise.resolve(fetch(url, {
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
    }).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

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
var resolvers$2 =
/*#__PURE__*/
createResolver({
  Query: {
    allDocs: function (parent, args, context, info) {
      try {
        return Promise.resolve(allDocs(context, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var allDocs$1 = ({
  __proto__: null,
  typeDefs: typeDefs$2,
  resolvers: resolvers$2
});

var bulkGet = function bulkGet(docs, context, _ref) {
  var revs = _ref.revs;

  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName;
    var url = dbUrl + "/" + dbName + "/_bulk_get";

    if (revs) {
      url += "?" + queryString.stringify({
        revs: revs
      });
    }

    return Promise.resolve(fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        docs: docs,
        revs: revs
      })
    }).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

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
var resolvers$3 =
/*#__PURE__*/
createResolver({
  Query: {
    bulkGet: function (parent, _ref, context, info) {
      var docs = _ref.docs,
          revs = _ref.revs;

      try {
        return Promise.resolve(bulkGet(docs, context, {
          revs: revs
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var bulkGet$1 = ({
  __proto__: null,
  typeDefs: typeDefs$3,
  resolvers: resolvers$3
});

var changes = function changes(context, options) {
  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName;
    var hasArgs = Object.keys(options).length > 0;
    var url = context + "/" + context + "/_changes";

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

    return Promise.resolve(fetch(url).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

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
var resolvers$4 =
/*#__PURE__*/
createResolver({
  Query: {
    changes: function (parent, args, context, info) {
      try {
        return Promise.resolve(changes(context, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var changes$1 = ({
  __proto__: null,
  typeDefs: typeDefs$4,
  resolvers: resolvers$4
});

var find = function find(context, options) {
  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName;
    var url = dbUrl + "/" + dbName + "/_find";
    return Promise.resolve(fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    }).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

var get = function get(context, id, options) {
  if (options === void 0) {
    options = {};
  }

  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName;
    var hasArgs = Object.keys(options).length > 0;
    var url = dbUrl + "/" + dbName + "/" + encodeURIComponent(id);

    if (hasArgs) {
      url += "?" + queryString.stringify(options);
    }

    return Promise.resolve(fetch(url).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

var info = function info(context) {
  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName;
    var url = dbUrl + "/" + dbName;
    return Promise.resolve(fetch(url).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

var query = function query(context, _ref) {
  var view = _ref.view,
      ddoc = _ref.ddoc,
      options = _objectWithoutPropertiesLoose(_ref, ["view", "ddoc"]);

  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName,
        onDocumentsSaved = _context$couchDb.onDocumentsSaved;
    var url = dbUrl + "/" + dbName + "/_design/" + ddoc + "/_view/" + view;
    var hasArgs = Object.keys(options).length > 0;
    var fetchOptions = {};

    if (hasArgs) {
      fetchOptions.method = 'POST';
      fetchOptions.body = JSON.stringify(options);
      fetchOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };
    }

    return Promise.resolve(fetch(url, fetchOptions).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

var search = function search(context, _ref) {
  var index = _ref.index,
      ddoc = _ref.ddoc,
      options = _objectWithoutPropertiesLoose(_ref, ["index", "ddoc"]);

  try {
    var _context$couchDb = context.couchDb,
        fetch = _context$couchDb.fetch,
        dbUrl = _context$couchDb.dbUrl,
        dbName = _context$couchDb.dbName;
    var url = dbUrl + "/" + dbName + "/_design/" + ddoc + "/_search/" + index;
    return Promise.resolve(fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    }).then(parseFetchResponse));
  } catch (e) {
    return Promise.reject(e);
  }
};

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
var resolvers$5 =
/*#__PURE__*/
createResolver({
  Query: {
    find: function (parent, args, context, info) {
      try {
        return Promise.resolve(find(context, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var find$1 = ({
  __proto__: null,
  typeDefs: typeDefs$5,
  resolvers: resolvers$5
});

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
var resolvers$6 =
/*#__PURE__*/
createResolver({
  Query: {
    get: function (parent, _ref, context, info) {
      var id = _ref.id,
          args = _objectWithoutPropertiesLoose(_ref, ["id"]);

      try {
        return Promise.resolve(get(context, id, args)).then(function (document) {
          return {
            _id: document._id,
            _rev: document._rev,
            document: document
          };
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var get$1 = ({
  __proto__: null,
  typeDefs: typeDefs$6,
  resolvers: resolvers$6
});

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
var resolvers$7 =
/*#__PURE__*/
createResolver({
  Query: {
    info: function (parent, args, context) {
      try {
        return Promise.resolve(info(context));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var info$1 = ({
  __proto__: null,
  typeDefs: typeDefs$7,
  resolvers: resolvers$7
});

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
var resolvers$8 =
/*#__PURE__*/
createResolver({
  Query: {
    query: function (parent, args, context, info) {
      try {
        return Promise.resolve(query(context, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var query$1 = ({
  __proto__: null,
  typeDefs: typeDefs$8,
  resolvers: resolvers$8
});

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
var resolvers$9 =
/*#__PURE__*/
createResolver({
  Query: {
    search: function (parent, args, context, info) {
      try {
        return Promise.resolve(search(context, args));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var search$1 = ({
  __proto__: null,
  typeDefs: typeDefs$9,
  resolvers: resolvers$9
});



var queries = ({
  __proto__: null,
  get: get$1,
  info: info$1,
  bulkGet: bulkGet$1,
  changes: changes$1,
  search: search$1,
  find: find$1,
  query: query$1,
  allDocs: allDocs$1
});

/**
 * Creates a GraphQL Schema for CouchDB
 */

function createSchema(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$schemas = _ref.schemas,
      schemas = _ref$schemas === void 0 ? [] : _ref$schemas,
      _ref$cloudant = _ref.cloudant,
      cloudant = _ref$cloudant === void 0 ? true : _ref$cloudant;

  var couchdbQueries = _objectWithoutPropertiesLoose(queries, ["search"]);

  return federation.buildFederatedSchema([base].concat(Object.keys(cloudant ? queries : couchdbQueries).map(function (key) {
    return queries[key];
  }), Object.keys(mutations).map(function (key) {
    return mutations[key];
  }), schemas));
}

exports.allDocs = allDocs;
exports.base = base;
exports.bulkDocs = bulkDocs;
exports.bulkGet = bulkGet;
exports.changes = changes;
exports.createContext = createContext;
exports.createResolver = createResolver;
exports.createSchema = createSchema;
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
