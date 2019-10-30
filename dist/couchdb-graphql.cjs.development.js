'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var apolloServerCore = require('apollo-server-core');
var axios = _interopDefault(require('axios'));
var queryString = _interopDefault(require('query-string'));
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
    put: function (parent, _ref, context, info) {
      var input = _ref.input,
          upsert = _ref.upsert,
          new_edits = _ref.new_edits;

      try {
        var _temp3 = function _temp3(_result2) {
          return _exit2 ? _result2 : Promise.resolve(axios.post(url, {
            docs: [_extends({}, input, {
              _rev: rev
            })],
            new_edits: new_edits
          })).then(function (response) {
            var _response$data = response.data,
                result = _response$data[0];

            if (result.error) {
              console.error(result.error + ': ' + result.reason);
              throw new Error(result.reason);
            }

            return {
              _id: result.id,
              _rev: result.rev,
              document: _extends({}, input, {
                _id: result.id,
                _rev: result.rev
              })
            };
          });
        };

        var _exit2 = false;
        var url = context.dbUrl + "/" + context.dbName + "/_bulk_docs";
        var rev = input._rev; // get previous _rev for upsert

        var _temp4 = function () {
          if (upsert) {
            if (!input._id) {
              throw Error('upsert option requires input to contain _id');
            }

            return _catch(function () {
              return Promise.resolve(axios.get(context.dbUrl + "/" + context.dbName + "/" + input._id)).then(function (_ref2) {
                var _rev = _ref2.data._rev;
                rev = _rev;
              });
            }, function (e) {
              if (e.status !== 404) {
                throw e;
              }
            });
          }
        }();

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
};

var put = ({
  __proto__: null,
  typeDefs: typeDefs,
  resolvers: resolvers
});

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
    bulkDocs: function (parent, _ref, context, info) {
      var input = _ref.input,
          upsert = _ref.upsert,
          new_edits = _ref.new_edits;

      try {
        var _temp3 = function _temp3() {
          return Promise.resolve(axios.post(url, {
            docs: input.map(function (i) {
              return _extends({}, i, {
                _rev: upsert && i._id ? previousRevs[i._id] : i._rev
              });
            }),
            new_edits: new_edits
          })).then(function (response) {
            var results = response.data;
            return results.map(function (result, index) {
              var document = input[index];

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
          });
        };

        var url = context.dbUrl + "/" + context.dbName + "/_bulk_docs";
        var previousRevs = {}; // get previous _revs for upsert

        var _temp4 = function () {
          if (upsert) {
            var ids = input.map(function (i) {
              return i._id;
            }).filter(function (id) {
              return !!id;
            });
            return Promise.resolve(axios.post(context.dbUrl + "/" + context.dbName + "/_all_docs", {
              keys: ids
            })).then(function (_ref2) {
              var allDocs = _ref2.data;
              allDocs.rows.forEach(function (row) {
                previousRevs[row.id] = row.value.rev;
              });
            });
          }
        }();

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
};

var bulkDocs = ({
  __proto__: null,
  typeDefs: typeDefs$1,
  resolvers: resolvers$1
});



var mutations = ({
  __proto__: null,
  put: put,
  bulkDocs: bulkDocs
});

function createResolver(resolver) {
  return resolver;
}

function _templateObject$3() {
  var data = _taggedTemplateLiteralLoose(["\n  type GetResponse {\n    _id: String!\n    _rev: String\n    document: JSON\n  }\n\n  extend type Query {\n    get(\n      id: String!\n      rev: String\n      revs: Boolean\n      revs_info: Boolean\n      open_revs: Boolean\n      conflicts: Boolean\n      attachments: Boolean\n      latest: Boolean\n    ): GetResponse\n  }\n"]);

  _templateObject$3 = function _templateObject() {
    return data;
  };

  return data;
}
/**
 * Generic GET on a document
 */

var typeDefs$2 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$3());
var resolvers$2 =
/*#__PURE__*/
createResolver({
  Query: {
    get: function (parent, _ref, context, info) {
      var id = _ref.id,
          args = _objectWithoutPropertiesLoose(_ref, ["id"]);

      try {
        var hasArgs = Object.keys(args).length > 0;
        var url = context.dbUrl + "/" + context.dbName + "/" + id;

        if (hasArgs) {
          url += "?" + queryString.stringify(args);
        }

        return Promise.resolve(axios.get(url)).then(function (response) {
          return {
            _id: response.data._id,
            _rev: response.data._rev,
            document: response.data
          };
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var get = ({
  __proto__: null,
  typeDefs: typeDefs$2,
  resolvers: resolvers$2
});

function _templateObject$4() {
  var data = _taggedTemplateLiteralLoose(["\n  type Change {\n    rev: String\n  }\n  type ChangesResult {\n    changes: [Change]\n    id: String\n    seq: JSON\n    doc: JSON\n    deleted: Boolean\n  }\n\n  type ChangesResponse {\n    last_seq: JSON\n    pending: Int\n    results: [ChangesResult]\n  }\n\n  extend type Query {\n    changes(\n      doc_ids: [String!]\n      conflicts: Boolean\n      descending: Boolean\n      feed: String\n      filter: String\n      heartbeat: Int\n      include_docs: Boolean\n      attachments: Boolean\n      att_encoding_info: Boolean\n      lastEventId: Int\n      limit: Int\n      since: String\n      timeout: Int\n      view: String\n      seq_interval: Int\n    ): ChangesResponse\n  }\n"]);

  _templateObject$4 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$3 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$4());
var resolvers$3 =
/*#__PURE__*/
createResolver({
  Query: {
    changes: function (parent, args, context, info) {
      try {
        var hasArgs = Object.keys(args).length > 0;
        var url = context.dbUrl + "/" + context.dbName + "/_changes";

        if (hasArgs) {
          if (args.lastEventId) {
            delete args.lastEventId;
            args['last-event-id'] = args.lastEventId;
          } // if args.since is not 'now', convert to number


          if (args.since) {
            if (args.since !== 'now') {
              args.since = parseInt(args.since);
            }
          }

          url += "?" + queryString.stringify(args);
        }

        return Promise.resolve(axios.get(url)).then(function (response) {
          return response.data;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var changes = ({
  __proto__: null,
  typeDefs: typeDefs$3,
  resolvers: resolvers$3
});

function _templateObject$5() {
  var data = _taggedTemplateLiteralLoose(["\n  input BulkGetInput {\n    id: String!\n    rev: String\n  }\n\n  type BulkGetResponse {\n    results: [BulkGetResult]\n  }\n\n  type BulkGetResult {\n    id: String\n    docs: [BulkGetDocs!]!\n  }\n\n  type BulkGetDocs {\n    ok: JSON\n    error: BulkGetError\n  }\n\n  type BulkGetError {\n    id: String\n    rev: String\n    error: String\n    reason: String\n  }\n\n  extend type Query {\n    bulkGet(docs: [BulkGetInput!]!, revs: Boolean): BulkGetResponse\n  }\n"]);

  _templateObject$5 = function _templateObject() {
    return data;
  };

  return data;
}
/**
 * Generic GET on a document
 */

var typeDefs$4 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$5());
var resolvers$4 =
/*#__PURE__*/
createResolver({
  Query: {
    bulkGet: function (parent, _ref, context, info) {
      var docs = _ref.docs,
          revs = _ref.revs;

      try {
        var url = context.dbUrl + "/" + context.dbName + "/_bulk_get";

        if (revs) {
          url += "?" + queryString.stringify({
            revs: revs
          });
        }

        return Promise.resolve(axios.post(url, {
          docs: docs,
          revs: revs
        })).then(function (response) {
          return response.data;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var bulkGet = ({
  __proto__: null,
  typeDefs: typeDefs$4,
  resolvers: resolvers$4
});

function _templateObject$6() {
  var data = _taggedTemplateLiteralLoose(["\n  type Sizes {\n    file: Int\n    external: Int\n    active: Int\n  }\n\n  type Other {\n    data_size: Int\n  }\n\n  type Cluster {\n    q: Int\n    n: Int\n    w: Int\n    r: Int\n  }\n\n  type InfoResponse {\n    db_name: String\n    update_seq: String\n    sizes: Sizes\n    purge_seq: Int\n    other: Other\n    doc_del_count: Int\n    doc_count: Int\n    disk_size: Int\n    disk_format_version: Int\n    data_size: Int\n    compact_running: Boolean\n    cluster: Cluster\n    instance_start_time: Int\n  }\n\n  extend type Query {\n    info: InfoResponse\n  }\n"]);

  _templateObject$6 = function _templateObject() {
    return data;
  };

  return data;
}
/**
 * Generic GET on a document
 */

var typeDefs$5 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$6());
var resolvers$5 =
/*#__PURE__*/
createResolver({
  Query: {
    info: function (parent, args, context, _info) {
      try {
        var url = "" + context.dbUrl;
        return Promise.resolve(axios.get(url)).then(function (response) {
          return response.data;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var info = ({
  __proto__: null,
  typeDefs: typeDefs$5,
  resolvers: resolvers$5
});

function _templateObject$7() {
  var data = _taggedTemplateLiteralLoose(["\n  type SearchResponse {\n    total_rows: Int\n    bookmark: String\n    rows: [SearchRow]\n    counts: JSON\n  }\n\n  type SearchRow {\n    id: String\n    order: [Int]\n    fields: JSON\n  }\n\n  extend type Query {\n    search(\n      index: String!\n      ddoc: String!\n      bookmark: String\n      counts: [String!]\n      drilldown: JSON\n      group_field: String\n      group_limit: Int\n      group_sort: JSON\n      highlight_fields: [String!]\n      highlight_pre_tag: String\n      highlight_post_tag: String\n      highlight_number: Int\n      highlight_size: Int\n      include_docs: Boolean\n      include_fields: [String]\n      limit: Int\n      query: String!\n      ranges: JSON\n      sort: String\n      stale: String\n    ): SearchResponse\n  }\n"]);

  _templateObject$7 = function _templateObject() {
    return data;
  };

  return data;
}
var typeDefs$6 =
/*#__PURE__*/
apolloServerCore.gql(
/*#__PURE__*/
_templateObject$7());
var resolvers$6 =
/*#__PURE__*/
createResolver({
  Query: {
    search: function (parent, _ref, context, info) {
      var index = _ref.index,
          ddoc = _ref.ddoc,
          typename = _ref.typename,
          args = _objectWithoutPropertiesLoose(_ref, ["index", "ddoc", "typename"]);

      try {
        var url = context.dbUrl + "/" + context.dbName + "/_design/" + ddoc + "/_search/" + index;
        var hasArgs = Object.keys(args).length > 0;

        if (hasArgs) {
          url += "?" + queryString.stringify(args);
        }

        return Promise.resolve(axios.get(url)).then(function (response) {
          return response.data;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var search = ({
  __proto__: null,
  typeDefs: typeDefs$6,
  resolvers: resolvers$6
});

function _templateObject$8() {
  var data = _taggedTemplateLiteralLoose(["\n  type FindResponse {\n    execution_stats: JSON\n    bookmark: String\n    warning: String\n    docs: [JSON!]\n  }\n\n  type FindRow {\n    id: String\n    order: [Int!]\n    fields: JSON\n  }\n\n  extend type Query {\n    find(\n      selector: JSON!\n      limit: Int\n      skip: Int\n      sort: Int\n      fields: [String!]\n      use_index: [String!]\n      r: Int\n      bookmark: String\n      update: Boolean\n      stable: Boolean\n      stale: String\n      execution_stats: Boolean\n    ): FindResponse\n  }\n"]);

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
    find: function (parent, _ref, context, info) {
      var index = _ref.index,
          ddoc = _ref.ddoc,
          args = _objectWithoutPropertiesLoose(_ref, ["index", "ddoc"]);

      try {
        var url = context.dbUrl + "/" + context.dbName + "/_find";
        return Promise.resolve(axios.post(url, args)).then(function (response) {
          return response.data;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var find = ({
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
    query: function (parent, _ref, context, info) {
      var view = _ref.view,
          ddoc = _ref.ddoc,
          args = _objectWithoutPropertiesLoose(_ref, ["view", "ddoc"]);

      try {
        var url = context.dbUrl + "/" + context.dbName + "/_design/" + ddoc + "/_view/" + view;
        var hasArgs = Object.keys(args).length > 0;

        if (hasArgs) {
          url += "?" + queryString.stringify(args);
        }

        return Promise.resolve(axios.get(url)).then(function (response) {
          return response.data;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
});

var query = ({
  __proto__: null,
  typeDefs: typeDefs$8,
  resolvers: resolvers$8
});



var queries = ({
  __proto__: null,
  get: get,
  info: info,
  bulkGet: bulkGet,
  changes: changes,
  search: search,
  find: find,
  query: query
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

  return federation.buildFederatedSchema([base].concat(Object.keys(cloudant ? couchdbQueries : queries).map(function (key) {
    return queries[key];
  }), Object.keys(mutations).map(function (key) {
    return mutations[key];
  }), schemas));
}

exports.base = base;
exports.createSchema = createSchema;
exports.mutations = mutations;
exports.queries = queries;
//# sourceMappingURL=couchdb-graphql.cjs.development.js.map
