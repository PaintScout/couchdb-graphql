import { __makeTemplateObject, __awaiter, __generator, __assign, __spreadArrays, __rest } from 'tslib';
import { gql } from 'apollo-server-core';
import queryString from 'qs';
import { GraphQLModule } from '@graphql-modules/core';
import 'isomorphic-fetch';

var base = {
  typeDefs:
  /*#__PURE__*/
  gql(templateObject_1 || (templateObject_1 =
  /*#__PURE__*/
  __makeTemplateObject(["\n    scalar JSON\n\n    type Query\n    type Mutation\n  "], ["\n    scalar JSON\n\n    type Query\n    type Mutation\n  "])))
};
var templateObject_1;

function createResolver(resolver) {
  return resolver;
}

function parseFetchResponse(response) {
  return __awaiter(this, void 0, void 0, function () {
    var error, _a;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!(response.status >= 200 && response.status < 300)) return [3
          /*break*/
          , 1];
          return [2
          /*return*/
          , response.json()];

        case 1:
          error = new Error(response.statusText); // @ts-ignore

          _a = error;
          return [4
          /*yield*/
          , response.json()];

        case 2:
          // @ts-ignore
          _a.response = _b.sent();
          throw error;
      }
    });
  });
}

/**
 * Returns an object where the key is the doc id and the value is the rejected document
 * and full conflicting documents
 */

function getConflictsByDocument(documents, context) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, fetch, dbUrl, dbName, documentsWithConflictRevs, conflictingDocuments, result;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = context.couchDb, fetch = _a.fetch, dbUrl = _a.dbUrl, dbName = _a.dbName;
          return [4
          /*yield*/
          , fetch(dbUrl + "/" + dbName + "/_all_docs?conflicts=true&include_docs=true", {
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
          }) // get full document for each _conflict
          ];

        case 1:
          documentsWithConflictRevs = _b.sent();
          return [4
          /*yield*/
          , fetch(dbUrl + "/" + dbName + "/_bulk_get", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              docs: documentsWithConflictRevs.reduce(function (conflicts, doc) {
                return __spreadArrays(conflicts, (doc && doc._conflicts || []).map(function (rev) {
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
          })];

        case 2:
          conflictingDocuments = _b.sent();
          result = documentsWithConflictRevs.reduce(function (result, doc) {
            var _a;

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
              return __assign(__assign({}, result), (_a = {}, _a[doc._id] = __assign(__assign({}, result[doc._id]), {
                conflicts: __spreadArrays(result[doc._id].conflicts, conflicts)
              }), _a));
            }

            return result;
          }, {});
          return [2
          /*return*/
          , result];
      }
    });
  });
}
/**
 * Resolves conflicts by calling context.onResolveConflict and saving its result
 */


function resolveConflicts(documents, context) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, fetch, dbName, dbUrl, onResolveConflict, onConflictsResolved, conflictingDocuments, resolvedDocs, docsToSave, response, resolvedDocuments;

    var _this = this;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = context.couchDb, fetch = _a.fetch, dbName = _a.dbName, dbUrl = _a.dbUrl, onResolveConflict = _a.onResolveConflict, onConflictsResolved = _a.onConflictsResolved;

          if (!onResolveConflict) {
            return [2
            /*return*/
            , null];
          }

          return [4
          /*yield*/
          , getConflictsByDocument(documents, context)];

        case 1:
          conflictingDocuments = _b.sent();
          return [4
          /*yield*/
          , Promise.all(Object.keys(conflictingDocuments).map(function (id) {
            return __awaiter(_this, void 0, void 0, function () {
              var resolvedDocument, resolved;

              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [4
                    /*yield*/
                    , onResolveConflict({
                      document: conflictingDocuments[id].document,
                      conflicts: conflictingDocuments[id].conflicts,
                      context: context
                    })];

                  case 1:
                    resolvedDocument = _a.sent();

                    if (resolvedDocument) {
                      resolved = __rest(resolvedDocument, ["_conflicts"]);
                      return [2
                      /*return*/
                      , __assign(__assign({}, resolved), {
                        _rev: conflictingDocuments[id].revToSave
                      })];
                    }

                    return [2
                    /*return*/
                    ];
                }
              });
            });
          })).then(function (res) {
            return res.filter(function (x) {
              return !!x;
            });
          })];

        case 2:
          resolvedDocs = _b.sent();
          docsToSave = __spreadArrays(resolvedDocs, Object.keys(conflictingDocuments).reduce(function (deleted, docId) {
            return __spreadArrays(deleted, conflictingDocuments[docId].conflicts.map(function (conflict) {
              return __assign(__assign({}, conflict), {
                _deleted: true
              });
            }).filter(function (conflict) {
              return conflict._rev !== conflictingDocuments[docId].revToSave;
            }));
          }, []));
          return [4
          /*yield*/
          , fetch(dbUrl + "/" + dbName + "/_bulk_docs", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              docs: docsToSave
            })
          }).then(parseFetchResponse)];

        case 3:
          response = _b.sent();
          resolvedDocuments = response.filter(function (result) {
            return result.ok;
          }).map(function (result) {
            return __assign(__assign({}, docsToSave.find(function (doc) {
              return doc._id === result.id;
            })), {
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

          return [2
          /*return*/
          , response];
      }
    });
  });
}

function put(context, doc, options) {
  if (options === void 0) {
    options = {};
  }

  var _a;

  return __awaiter(this, void 0, void 0, function () {
    var _b, fetch, dbUrl, dbName, onDocumentsSaved, upsert, _c, new_edits, url, rev, _rev, e_1, result, savedDocument;

    var _this = this;

    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _b = context.couchDb, fetch = _b.fetch, dbUrl = _b.dbUrl, dbName = _b.dbName, onDocumentsSaved = _b.onDocumentsSaved;
          upsert = options.upsert, _c = options.new_edits, new_edits = _c === void 0 ? true : _c;
          url = dbUrl + "/" + dbName + "/_bulk_docs";
          rev = (_a = doc._rev, _a !== null && _a !== void 0 ? _a : undefined // don't let it be null
          );
          if (!upsert) return [3
          /*break*/
          , 4];

          if (!doc._id) {
            throw Error('upsert option requires input to contain _id');
          }

          _d.label = 1;

        case 1:
          _d.trys.push([1, 3,, 4]);

          return [4
          /*yield*/
          , fetch(dbUrl + "/" + dbName + "/" + encodeURIComponent(doc._id)).then(parseFetchResponse)];

        case 2:
          _rev = _d.sent()._rev;
          rev = _rev;
          return [3
          /*break*/
          , 4];

        case 3:
          e_1 = _d.sent();

          if (!e_1.response || e_1.response.status !== 404) {
            throw e_1;
          }

          return [3
          /*break*/
          , 4];

        case 4:
          return [4
          /*yield*/
          , fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              docs: [__assign(__assign({}, doc), {
                _rev: rev
              })],
              new_edits: new_edits
            })
          }).then(parseFetchResponse).then(function (res) {
            return __awaiter(_this, void 0, void 0, function () {
              var result, resolved;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    result = Array.isArray(res) ? res[0] : res;
                    if (!(result && result.id && result.error === 'conflict')) return [3
                    /*break*/
                    , 2];
                    return [4
                    /*yield*/
                    , resolveConflicts([doc], context)];

                  case 1:
                    resolved = _a.sent()[0];

                    if (resolved) {
                      return [2
                      /*return*/
                      , resolved];
                    }

                    _a.label = 2;

                  case 2:
                    return [2
                    /*return*/
                    , result];
                }
              });
            });
          })];

        case 5:
          result = _d.sent();

          if (result && result.error) {
            throw new Error(result.reason);
          }

          if (result) {
            savedDocument = __assign(__assign({}, doc), {
              _id: result.id,
              _rev: result.rev
            });

            if (onDocumentsSaved) {
              onDocumentsSaved({
                documents: [savedDocument],
                context: context
              });
            }

            return [2
            /*return*/
            , savedDocument];
          } else {
            // new_edits=false returns empty response
            return [2
            /*return*/
            , null];
          }
      }
    });
  });
}

/**
 * PUTs a document using _bulk_docs endpoint
 */

var typeDefs =
/*#__PURE__*/
gql(templateObject_1$1 || (templateObject_1$1 =
/*#__PURE__*/
__makeTemplateObject(["\n  type PutResponse {\n    _id: String!\n    _rev: String\n    document: JSON\n  }\n\n  extend type Mutation {\n    put(input: JSON, upsert: Boolean, new_edits: Boolean): PutResponse\n  }\n"], ["\n  type PutResponse {\n    _id: String!\n    _rev: String\n    document: JSON\n  }\n\n  extend type Mutation {\n    put(input: JSON, upsert: Boolean, new_edits: Boolean): PutResponse\n  }\n"])));
var resolvers = {
  Mutation: {
    put:
    /*#__PURE__*/
    createResolver(function (parent, _a, context, info) {
      var input = _a.input,
          upsert = _a.upsert,
          _b = _a.new_edits,
          new_edits = _b === void 0 ? true : _b;
      return __awaiter(void 0, void 0, void 0, function () {
        var document;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              return [4
              /*yield*/
              , put(context, input, {
                upsert: upsert,
                new_edits: new_edits
              })];

            case 1:
              document = _c.sent();
              return [2
              /*return*/
              , {
                _id: document._id,
                _rev: document._rev,
                document: document
              }];
          }
        });
      });
    })
  }
};
var templateObject_1$1;

var put$1 = {
  __proto__: null,
  typeDefs: typeDefs,
  resolvers: resolvers
};

function bulkDocs(context, docs, options) {
  if (options === void 0) {
    options = {};
  }

  return __awaiter(this, void 0, void 0, function () {
    var _a, fetch, dbUrl, dbName, onDocumentsSaved, upsert, _b, new_edits, url, previousRevs, ids, allDocs, saveResults, response;

    var _this = this;

    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _a = context.couchDb, fetch = _a.fetch, dbUrl = _a.dbUrl, dbName = _a.dbName, onDocumentsSaved = _a.onDocumentsSaved;
          upsert = options.upsert, _b = options.new_edits, new_edits = _b === void 0 ? true : _b;
          url = dbUrl + "/" + dbName + "/_bulk_docs";
          previousRevs = {};
          if (!upsert) return [3
          /*break*/
          , 2];
          ids = docs.map(function (i) {
            return i._id;
          }).filter(function (id) {
            return !!id;
          });
          return [4
          /*yield*/
          , fetch(dbUrl + "/" + dbName + "/_all_docs", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              keys: ids
            })
          }).then(parseFetchResponse)];

        case 1:
          allDocs = _c.sent().data;
          allDocs.rows.forEach(function (row) {
            previousRevs[row.id] = row.value ? row.value.rev : null;
          });
          _c.label = 2;

        case 2:
          return [4
          /*yield*/
          , fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              docs: docs.map(function (doc) {
                var _a;

                return __assign(__assign({}, doc), {
                  _rev: (_a = // fallback to undefined if it is null
                  upsert && doc._id ? previousRevs[doc._id] : doc._rev, _a !== null && _a !== void 0 ? _a : undefined)
                });
              }),
              new_edits: new_edits
            })
          }).then(parseFetchResponse).then(function (res) {
            return __awaiter(_this, void 0, void 0, function () {
              var conflicts, resolved_1;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    conflicts = res.filter(function (result) {
                      return result.error === 'conflict';
                    });
                    if (!(conflicts.length > 0)) return [3
                    /*break*/
                    , 2];
                    return [4
                    /*yield*/
                    , resolveConflicts(docs.filter(function (doc) {
                      return conflicts.find(function (conflict) {
                        return conflict.id === doc._id;
                      });
                    }), context)];

                  case 1:
                    resolved_1 = _a.sent();

                    if (resolved_1) {
                      // update any "conflict" results with the resolved result
                      return [2
                      /*return*/
                      , res.map(function (saveResult) {
                        var resolvedDoc = resolved_1.find(function (resolvedResult) {
                          return resolvedResult.id === saveResult.id;
                        });

                        if (saveResult.error === 'conflict' && resolvedDoc) {
                          return resolvedDoc;
                        }

                        return saveResult;
                      })];
                    }

                    _a.label = 2;

                  case 2:
                    // return bulkDocs data
                    return [2
                    /*return*/
                    , res];
                }
              });
            });
          })];

        case 3:
          saveResults = _c.sent();
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
              document: __assign(__assign({}, document), {
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

          return [2
          /*return*/
          , response];
      }
    });
  });
}

var typeDefs$1 =
/*#__PURE__*/
gql(templateObject_1$2 || (templateObject_1$2 =
/*#__PURE__*/
__makeTemplateObject(["\n  type BulkDocsResponseObject {\n    _id: String\n    _rev: String\n    document: JSON\n    error: String\n    reason: String\n  }\n\n  extend type Mutation {\n    bulkDocs(\n      input: [JSON!]!\n      upsert: Boolean\n      new_edits: Boolean\n    ): [BulkDocsResponseObject]\n  }\n"], ["\n  type BulkDocsResponseObject {\n    _id: String\n    _rev: String\n    document: JSON\n    error: String\n    reason: String\n  }\n\n  extend type Mutation {\n    bulkDocs(\n      input: [JSON!]!\n      upsert: Boolean\n      new_edits: Boolean\n    ): [BulkDocsResponseObject]\n  }\n"])));
var resolvers$1 = {
  Mutation: {
    bulkDocs:
    /*#__PURE__*/
    createResolver(function (parent, _a, context, info) {
      var input = _a.input,
          upsert = _a.upsert,
          _b = _a.new_edits,
          new_edits = _b === void 0 ? true : _b;
      return bulkDocs(context, input, {
        upsert: upsert,
        new_edits: new_edits
      });
    })
  }
};
var templateObject_1$2;

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

function allDocs(context, _a) {
  if (_a === void 0) {
    _a = {};
  }

  var keys = _a.keys,
      key = _a.key,
      endkey = _a.endkey,
      startkey = _a.startkey,
      args = __rest(_a, ["keys", "key", "endkey", "startkey"]);

  return __awaiter(this, void 0, void 0, function () {
    var fetch, url, response;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          fetch = context.couchDb.fetch;
          url = context.couchDb.dbUrl + "/" + context.couchDb.dbName + "/_all_docs";

          if (args) {
            url += "?" + queryString.stringify(args);
          }

          return [4
          /*yield*/
          , fetch(url, {
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
          }).then(parseFetchResponse)];

        case 1:
          response = _b.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

var typeDefs$2 =
/*#__PURE__*/
gql(templateObject_1$3 || (templateObject_1$3 =
/*#__PURE__*/
__makeTemplateObject(["\n  type AllDocsRow {\n    id: String!\n    rev: String\n    value: JSON\n    doc: JSON\n  }\n\n  type AllDocsResponse {\n    total_rows: Int!\n    offset: Int!\n    rows: [AllDocsRow!]!\n  }\n\n  extend type Query {\n    allDocs(\n      conflicts: Boolean\n      endkey: JSON\n      include_docs: Boolean\n      inclusive_end: Boolean\n      key: JSON\n      keys: [JSON!]\n      limit: Int\n      skip: Int\n      startkey: JSON\n      update_seq: Boolean\n    ): AllDocsResponse\n  }\n"], ["\n  type AllDocsRow {\n    id: String!\n    rev: String\n    value: JSON\n    doc: JSON\n  }\n\n  type AllDocsResponse {\n    total_rows: Int!\n    offset: Int!\n    rows: [AllDocsRow!]!\n  }\n\n  extend type Query {\n    allDocs(\n      conflicts: Boolean\n      endkey: JSON\n      include_docs: Boolean\n      inclusive_end: Boolean\n      key: JSON\n      keys: [JSON!]\n      limit: Int\n      skip: Int\n      startkey: JSON\n      update_seq: Boolean\n    ): AllDocsResponse\n  }\n"])));
var resolvers$2 = {
  Query: {
    allDocs:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return allDocs(context, args);
    })
  }
};
var templateObject_1$3;

var allDocs$1 = {
  __proto__: null,
  typeDefs: typeDefs$2,
  resolvers: resolvers$2
};

function bulkGet(docs, context, _a) {
  var revs = (_a === void 0 ? {} : _a).revs;
  return __awaiter(this, void 0, void 0, function () {
    var _b, fetch, dbUrl, dbName, url, response;

    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _b = context.couchDb, fetch = _b.fetch, dbUrl = _b.dbUrl, dbName = _b.dbName;
          url = dbUrl + "/" + dbName + "/_bulk_get";

          if (revs) {
            url += "?" + queryString.stringify({
              revs: revs
            });
          }

          return [4
          /*yield*/
          , fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              docs: docs,
              revs: revs
            })
          }).then(parseFetchResponse)];

        case 1:
          response = _c.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

/**
 * Generic GET on a document
 */

var typeDefs$3 =
/*#__PURE__*/
gql(templateObject_1$4 || (templateObject_1$4 =
/*#__PURE__*/
__makeTemplateObject(["\n  input BulkGetInput {\n    id: String!\n    rev: String\n  }\n\n  type BulkGetResponse {\n    results: [BulkGetResult!]!\n  }\n\n  type BulkGetResult {\n    id: String\n    docs: [BulkGetDocs!]!\n  }\n\n  type BulkGetDocs {\n    ok: JSON\n    error: BulkGetError\n  }\n\n  type BulkGetError {\n    id: String\n    rev: String\n    error: String\n    reason: String\n  }\n\n  extend type Query {\n    bulkGet(docs: [BulkGetInput!]!, revs: Boolean): BulkGetResponse\n  }\n"], ["\n  input BulkGetInput {\n    id: String!\n    rev: String\n  }\n\n  type BulkGetResponse {\n    results: [BulkGetResult!]!\n  }\n\n  type BulkGetResult {\n    id: String\n    docs: [BulkGetDocs!]!\n  }\n\n  type BulkGetDocs {\n    ok: JSON\n    error: BulkGetError\n  }\n\n  type BulkGetError {\n    id: String\n    rev: String\n    error: String\n    reason: String\n  }\n\n  extend type Query {\n    bulkGet(docs: [BulkGetInput!]!, revs: Boolean): BulkGetResponse\n  }\n"])));
var resolvers$3 = {
  Query: {
    bulkGet:
    /*#__PURE__*/
    createResolver(function (parent, _a, context, info) {
      var docs = _a.docs,
          revs = _a.revs;
      return bulkGet(docs, context, {
        revs: revs
      });
    })
  }
};
var templateObject_1$4;

var bulkGet$1 = {
  __proto__: null,
  typeDefs: typeDefs$3,
  resolvers: resolvers$3
};

function changes(context, options) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, fetch, dbName, hasArgs, url, response;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = context.couchDb, fetch = _a.fetch, dbName = _a.dbName;
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

          return [4
          /*yield*/
          , fetch(url).then(parseFetchResponse)];

        case 1:
          response = _b.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

var typeDefs$4 =
/*#__PURE__*/
gql(templateObject_1$5 || (templateObject_1$5 =
/*#__PURE__*/
__makeTemplateObject(["\n  type Change {\n    rev: String\n  }\n  type ChangesResult {\n    changes: [Change]\n    id: String\n    seq: JSON\n    doc: JSON\n    deleted: Boolean\n  }\n\n  type ChangesResponse {\n    last_seq: JSON\n    pending: Int\n    results: [ChangesResult]\n  }\n\n  extend type Query {\n    changes(\n      doc_ids: [String!]\n      conflicts: Boolean\n      descending: Boolean\n      feed: String\n      filter: String\n      heartbeat: Int\n      include_docs: Boolean\n      attachments: Boolean\n      att_encoding_info: Boolean\n      lastEventId: Int\n      limit: Int\n      since: String\n      timeout: Int\n      view: String\n      seq_interval: Int\n    ): ChangesResponse\n  }\n"], ["\n  type Change {\n    rev: String\n  }\n  type ChangesResult {\n    changes: [Change]\n    id: String\n    seq: JSON\n    doc: JSON\n    deleted: Boolean\n  }\n\n  type ChangesResponse {\n    last_seq: JSON\n    pending: Int\n    results: [ChangesResult]\n  }\n\n  extend type Query {\n    changes(\n      doc_ids: [String!]\n      conflicts: Boolean\n      descending: Boolean\n      feed: String\n      filter: String\n      heartbeat: Int\n      include_docs: Boolean\n      attachments: Boolean\n      att_encoding_info: Boolean\n      lastEventId: Int\n      limit: Int\n      since: String\n      timeout: Int\n      view: String\n      seq_interval: Int\n    ): ChangesResponse\n  }\n"])));
var resolvers$4 = {
  Query: {
    changes:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return changes(context, args);
    })
  }
};
var templateObject_1$5;

var changes$1 = {
  __proto__: null,
  typeDefs: typeDefs$4,
  resolvers: resolvers$4
};

function find(context, options) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, fetch, dbUrl, dbName, url, response;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = context.couchDb, fetch = _a.fetch, dbUrl = _a.dbUrl, dbName = _a.dbName;
          url = dbUrl + "/" + dbName + "/_find";
          return [4
          /*yield*/
          , fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
          }).then(parseFetchResponse)];

        case 1:
          response = _b.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

function get(context, id, options) {
  if (options === void 0) {
    options = {};
  }

  return __awaiter(this, void 0, void 0, function () {
    var _a, fetch, dbUrl, dbName, hasArgs, url, response;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = context.couchDb, fetch = _a.fetch, dbUrl = _a.dbUrl, dbName = _a.dbName;
          hasArgs = Object.keys(options).length > 0;
          url = dbUrl + "/" + dbName + "/" + encodeURIComponent(id);

          if (hasArgs) {
            url += "?" + queryString.stringify(options);
          }

          return [4
          /*yield*/
          , fetch(url).then(parseFetchResponse)];

        case 1:
          response = _b.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

function info(context) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, fetch, dbUrl, dbName, url, response;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = context.couchDb, fetch = _a.fetch, dbUrl = _a.dbUrl, dbName = _a.dbName;
          url = dbUrl + "/" + dbName;
          return [4
          /*yield*/
          , fetch(url).then(parseFetchResponse)];

        case 1:
          response = _b.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

function query(context, _a) {
  var view = _a.view,
      ddoc = _a.ddoc,
      key = _a.key,
      keys = _a.keys,
      options = __rest(_a, ["view", "ddoc", "key", "keys"]);

  return __awaiter(this, void 0, void 0, function () {
    var _b, fetch, dbUrl, dbName, onDocumentsSaved, postOptions, url, hasArgs, fetchOptions, response;

    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _b = context.couchDb, fetch = _b.fetch, dbUrl = _b.dbUrl, dbName = _b.dbName, onDocumentsSaved = _b.onDocumentsSaved;
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

          return [4
          /*yield*/
          , fetch(url, fetchOptions).then(parseFetchResponse)];

        case 1:
          response = _c.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

function search(context, _a) {
  var index = _a.index,
      ddoc = _a.ddoc,
      options = __rest(_a, ["index", "ddoc"]);

  return __awaiter(this, void 0, void 0, function () {
    var _b, fetch, dbUrl, dbName, url, response;

    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _b = context.couchDb, fetch = _b.fetch, dbUrl = _b.dbUrl, dbName = _b.dbName;
          url = dbUrl + "/" + dbName + "/_design/" + ddoc + "/_search/" + index;
          return [4
          /*yield*/
          , fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
          }).then(parseFetchResponse)];

        case 1:
          response = _c.sent();
          return [2
          /*return*/
          , response];
      }
    });
  });
}

var typeDefs$5 =
/*#__PURE__*/
gql(templateObject_1$6 || (templateObject_1$6 =
/*#__PURE__*/
__makeTemplateObject(["\n  type FindResponse {\n    execution_stats: JSON\n    bookmark: String\n    warning: String\n    docs: [JSON!]\n  }\n\n  extend type Query {\n    find(\n      selector: JSON!\n      limit: Int\n      skip: Int\n      sort: Int\n      fields: [String!]\n      use_index: [String!]\n      r: Int\n      bookmark: String\n      update: Boolean\n      stable: Boolean\n      stale: String\n      execution_stats: Boolean\n    ): FindResponse\n  }\n"], ["\n  type FindResponse {\n    execution_stats: JSON\n    bookmark: String\n    warning: String\n    docs: [JSON!]\n  }\n\n  extend type Query {\n    find(\n      selector: JSON!\n      limit: Int\n      skip: Int\n      sort: Int\n      fields: [String!]\n      use_index: [String!]\n      r: Int\n      bookmark: String\n      update: Boolean\n      stable: Boolean\n      stale: String\n      execution_stats: Boolean\n    ): FindResponse\n  }\n"])));
var resolvers$5 = {
  Query: {
    find:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return find(context, args);
    })
  }
};
var templateObject_1$6;

var find$1 = {
  __proto__: null,
  typeDefs: typeDefs$5,
  resolvers: resolvers$5
};

/**
 * Generic GET on a document
 */

var typeDefs$6 =
/*#__PURE__*/
gql(templateObject_1$7 || (templateObject_1$7 =
/*#__PURE__*/
__makeTemplateObject(["\n  type GetResponse {\n    _id: String!\n    _rev: String\n    document: JSON\n  }\n\n  extend type Query {\n    get(\n      id: String!\n      rev: String\n      revs: Boolean\n      revs_info: Boolean\n      open_revs: Boolean\n      conflicts: Boolean\n      attachments: Boolean\n      latest: Boolean\n    ): GetResponse\n  }\n"], ["\n  type GetResponse {\n    _id: String!\n    _rev: String\n    document: JSON\n  }\n\n  extend type Query {\n    get(\n      id: String!\n      rev: String\n      revs: Boolean\n      revs_info: Boolean\n      open_revs: Boolean\n      conflicts: Boolean\n      attachments: Boolean\n      latest: Boolean\n    ): GetResponse\n  }\n"])));
var resolvers$6 = {
  Query: {
    get:
    /*#__PURE__*/
    createResolver(function (parent, _a, context, info) {
      return __awaiter(void 0, void 0, void 0, function () {
        var document;

        var id = _a.id,
            args = __rest(_a, ["id"]);

        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              return [4
              /*yield*/
              , get(context, id, args)];

            case 1:
              document = _b.sent();
              return [2
              /*return*/
              , {
                _id: document._id,
                _rev: document._rev,
                document: document
              }];
          }
        });
      });
    })
  }
};
var templateObject_1$7;

var get$1 = {
  __proto__: null,
  typeDefs: typeDefs$6,
  resolvers: resolvers$6
};

var typeDefs$7 =
/*#__PURE__*/
gql(templateObject_1$8 || (templateObject_1$8 =
/*#__PURE__*/
__makeTemplateObject(["\n  type Sizes {\n    file: Int\n    external: Int\n    active: Int\n  }\n\n  type Other {\n    data_size: Int\n  }\n\n  type Cluster {\n    q: Int\n    n: Int\n    w: Int\n    r: Int\n  }\n\n  type InfoResponse {\n    db_name: String\n    update_seq: String\n    sizes: Sizes\n    purge_seq: Int\n    other: Other\n    doc_del_count: Int\n    doc_count: Int\n    disk_size: Int\n    disk_format_version: Int\n    data_size: Int\n    compact_running: Boolean\n    cluster: Cluster\n    instance_start_time: Int\n  }\n\n  extend type Query {\n    info: InfoResponse\n  }\n"], ["\n  type Sizes {\n    file: Int\n    external: Int\n    active: Int\n  }\n\n  type Other {\n    data_size: Int\n  }\n\n  type Cluster {\n    q: Int\n    n: Int\n    w: Int\n    r: Int\n  }\n\n  type InfoResponse {\n    db_name: String\n    update_seq: String\n    sizes: Sizes\n    purge_seq: Int\n    other: Other\n    doc_del_count: Int\n    doc_count: Int\n    disk_size: Int\n    disk_format_version: Int\n    data_size: Int\n    compact_running: Boolean\n    cluster: Cluster\n    instance_start_time: Int\n  }\n\n  extend type Query {\n    info: InfoResponse\n  }\n"])));
var resolvers$7 = {
  Query: {
    info:
    /*#__PURE__*/
    createResolver(function (parent, args, context) {
      return info(context);
    })
  }
};
var templateObject_1$8;

var info$1 = {
  __proto__: null,
  typeDefs: typeDefs$7,
  resolvers: resolvers$7
};

var typeDefs$8 =
/*#__PURE__*/
gql(templateObject_1$9 || (templateObject_1$9 =
/*#__PURE__*/
__makeTemplateObject(["\n  type QueryResponse {\n    offset: Int\n    update_seq: JSON\n    total_rows: Int\n    rows: [QueryRow!]\n  }\n\n  type QueryRow {\n    id: String\n    key: JSON\n    value: JSON\n  }\n\n  extend type Query {\n    query(\n      ddoc: String!\n      view: String!\n      conflicts: Boolean\n      descending: Boolean\n      endkey: JSON\n      group: Boolean\n      group_level: Int\n      include_docs: Boolean\n      attachments: Boolean\n      att_encoding_info: Boolean\n      inclusive_end: Boolean\n      key: JSON\n      keys: [JSON!]\n      limit: Int\n      reduce: Boolean\n      skip: Int\n      sorted: Boolean\n      stable: Boolean\n      stale: String\n      startkey: JSON\n      update: String\n      update_seq: Boolean\n    ): QueryResponse\n  }\n"], ["\n  type QueryResponse {\n    offset: Int\n    update_seq: JSON\n    total_rows: Int\n    rows: [QueryRow!]\n  }\n\n  type QueryRow {\n    id: String\n    key: JSON\n    value: JSON\n  }\n\n  extend type Query {\n    query(\n      ddoc: String!\n      view: String!\n      conflicts: Boolean\n      descending: Boolean\n      endkey: JSON\n      group: Boolean\n      group_level: Int\n      include_docs: Boolean\n      attachments: Boolean\n      att_encoding_info: Boolean\n      inclusive_end: Boolean\n      key: JSON\n      keys: [JSON!]\n      limit: Int\n      reduce: Boolean\n      skip: Int\n      sorted: Boolean\n      stable: Boolean\n      stale: String\n      startkey: JSON\n      update: String\n      update_seq: Boolean\n    ): QueryResponse\n  }\n"])));
var resolvers$8 = {
  Query: {
    query:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2
          /*return*/
          , query(context, args)];
        });
      });
    })
  }
};
var templateObject_1$9;

var query$1 = {
  __proto__: null,
  typeDefs: typeDefs$8,
  resolvers: resolvers$8
};

var typeDefs$9 =
/*#__PURE__*/
gql(templateObject_1$a || (templateObject_1$a =
/*#__PURE__*/
__makeTemplateObject(["\n  type SearchResponse {\n    total_rows: Int!\n    bookmark: String!\n    rows: [SearchRow]!\n    counts: JSON\n  }\n\n  type SearchRow {\n    id: String!\n    order: [Int!]!\n    fields: JSON!\n    doc: JSON\n  }\n\n  extend type Query {\n    search(\n      index: String!\n      ddoc: String!\n      bookmark: String\n      counts: [String!]\n      drilldown: JSON\n      group_field: String\n      group_limit: Int\n      group_sort: JSON\n      highlight_fields: [String!]\n      highlight_pre_tag: String\n      highlight_post_tag: String\n      highlight_number: Int\n      highlight_size: Int\n      include_docs: Boolean\n      include_fields: [String!]\n      limit: Int\n      query: String!\n      ranges: JSON\n      sort: [String!]\n      stale: String\n    ): SearchResponse\n  }\n"], ["\n  type SearchResponse {\n    total_rows: Int!\n    bookmark: String!\n    rows: [SearchRow]!\n    counts: JSON\n  }\n\n  type SearchRow {\n    id: String!\n    order: [Int!]!\n    fields: JSON!\n    doc: JSON\n  }\n\n  extend type Query {\n    search(\n      index: String!\n      ddoc: String!\n      bookmark: String\n      counts: [String!]\n      drilldown: JSON\n      group_field: String\n      group_limit: Int\n      group_sort: JSON\n      highlight_fields: [String!]\n      highlight_pre_tag: String\n      highlight_post_tag: String\n      highlight_number: Int\n      highlight_size: Int\n      include_docs: Boolean\n      include_fields: [String!]\n      limit: Int\n      query: String!\n      ranges: JSON\n      sort: [String!]\n      stale: String\n    ): SearchResponse\n  }\n"])));
var resolvers$9 = {
  Query: {
    search:
    /*#__PURE__*/
    createResolver(function (parent, args, context, info) {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2
          /*return*/
          , search(context, args)];
        });
      });
    })
  }
};
var templateObject_1$a;

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

function createCouchDbModule(_a, moduleConfig) {
  var cloudant = _a.cloudant,
      options = __rest(_a, ["cloudant"]); // separate cloudant queries from couchdb


  var couchdbQueries = __rest(queries // combine typeDefs
  , ["search"]); // combine typeDefs


  var typeDefs = __spreadArrays([base.typeDefs], Object.keys(cloudant ? queries : couchdbQueries).map(function (key) {
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


  var resolvers = __spreadArrays(Object.keys(cloudant ? queries : couchdbQueries).map(function (key) {
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

  return new GraphQLModule(__assign(__assign({}, options), {
    typeDefs: typeDefs,
    resolvers: resolvers
  }), moduleConfig);
}

function createContext(args) {
  return {
    couchDb: __assign({
      fetch: fetch
    }, args)
  };
}

export { allDocs, base, bulkDocs, bulkGet, changes, createContext, createCouchDbModule, createResolver, find, get, info, mutations, put, queries, query, resolveConflicts, search };
//# sourceMappingURL=couchdb-graphql.esm.js.map
