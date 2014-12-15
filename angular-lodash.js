(function (ng, _) {
  'use strict';

  var
    lodashModule = ng.module('angular-lodash', []),
    utilsModule = ng.module('angular-lodash/utils', []),
    filtersModule = ng.module('angular-lodash/filters', []);

  // begin custom _

  function propGetterFactory(prop) {
    return function(obj) {return obj[prop];};
  }

  _._ = _;

  // Shiv "min", "max" ,"sortedIndex" to accept property predicate.
  _.each(['min', 'max', 'sortedIndex'], function(fnName) {
    _[fnName] = _.wrap(_[fnName], function(fn) {
      var args = _.toArray(arguments).slice(1);

      if(_.isString(args[2])) {
        // for "sortedIndex", transmuting str to property getter
        args[2] = propGetterFactory(args[2]);
      }
      else if(_.isString(args[1])) {
        // for "min" or "max", transmuting str to property getter
        args[1] = propGetterFactory(args[1]);
      }

      return fn.apply(_, args);
    });
  });

  // Shiv "filter", "reject" to angular's built-in,
  // and reserve lodash's feature(works on obj).
  ng.injector(['ng']).invoke(['$filter', function($filter) {
    _.filter = _.select = _.wrap($filter('filter'), function(filter, obj, exp) {
      if(!(_.isArray(obj))) {
        obj = _.toArray(obj);
      }

      return filter(obj, exp);
    });

    _.reject = function(obj, exp) {
      // use angular built-in negated predicate
      if(_.isString(exp)) {
        return _.filter(obj, '!' + exp);
      }

      var diff = _.bind(_.difference, _, obj);

      return diff(_.filter(obj, exp));
    };
  }]);

  // end custom _


  // begin register angular-lodash/utils

  _.each(_.methods(_), function(methodName) {
    function register($rootScope) {$rootScope[methodName] = _.bind(_[methodName], _);}

    _.each([
      lodashModule,
      utilsModule,
      ng.module('angular-lodash/utils/' + methodName, [])
      ], function(module) {
        module.run(['$rootScope', register]);
    });
  });

  // end register angular-lodash/utils


  // begin register angular-lodash/filters

  var
    adapList = [
      ['map', 'collect'],
      ['reduce', 'inject', 'foldl'],
      ['reduceRight', 'foldr'],
      ['find', 'detect', 'findWhere'],
      ['filter', 'select'],
      ['all', 'every'],
      ['any', 'some'],
      'where',
      'reject',
      'invoke',
      'pluck',
      'max',
      'min',
      'sortBy',
      'groupBy',
      'countBy',
      'shuffle',
      'toArray',
      'size',
      ['first', 'head', 'take'],
      'initial',
      'last',
      ['rest', 'tail', 'drop'],
      'compact',
      'compose',
      'flatten',
      'without',
      'union',
      'intersection',
      'difference',
      ['uniq', 'unique'],
      ['unzip', 'zip'],
      ['object', 'zipObject'],
      'indexOf',
      'lastIndexOf',
      'sortedIndex',
      'keys',
      'values',
      'pairs',
      'invert',
      ['functions', 'methods'],
      'pick',
      'omit',
      'tap',
      'identity',
      'uniqueId',
      'escape',
      'result',
      'template',
      'at',
      'bindKey',
      'clone',
      'cloneDeep',
      'constant',
      'property',
      ['include', 'contains'],
      'create',
      'createCallback',
      'curry',
      'debounce',
      'defer',
      'delay',
      'throttle',
      'findIndex',
      'findKey',
      ['each', 'forEach'],
      'forIn',
      'forOwn',
      'isPlainObject',
      'mapValues',
      'memoize',
      'merge',
      'noop',
      'now',
      'parseInt',
      'pull',
      'remove',
      'random',
      'runInContext',
      'support',
      'transform',
      'xor',
      ['extend', 'assign'],
      'isEqual',
      'findLast',
      'findLastIndex',
      'findLastKey',
      ['eachRight', 'forEachRight'],
      'forInRight',
      'forOwnRight',
      'partialRight',
      'range',
      'chain',
      'indexBy',
      'sample',
      'after',
      'bind',
      'bindAll',
      'once',
      'partial',
      'wrap',
      'defaults',
      'has',
      'isArguments',
      'isArray',
      'isBoolean',
      'isDate',
      'isElement',
      'isEmpty',
      'isFinite',
      'isFunction',
      'isNaN',
      'isNull',
      'isNumber',
      'isObject',
      'isRegExp',
      'isUndefined',
      'mixin',
      'times',
      'unescape'
    ];

  _.each(adapList, function(filterNames) {
    if(!(_.isArray(filterNames))) {
      filterNames = [filterNames];
    }

    var
      filter = _.bind(_[filterNames[0]], _),
      filterFactory = function() {return filter;};

    _.each(filterNames, function(filterName) {
      _.each([
        lodashModule,
        filtersModule,
        ng.module('angular-lodash/filters/' + filterName, [])
        ], function(module) {
          module.filter(filterName, filterFactory);
      });
    });
  });

  // end register angular-lodash/filters

}(angular, _));
