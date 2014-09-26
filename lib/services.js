var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

ejs.filters.str = function (obj) {
  return JSON.stringify(obj, null, 2);
};

// Helper for in-template service generation
// Returns an angular dependency-injection function opening block
//
// Example declareNgFunction(['$q', 'myDep'], false) :
// Returns : "['$q', 'myDep', function($q, myDep) {"
//
// Example declareNgFunction(['$q'], true) :
// Returns : "['$q', 'Restangular', function($q, Restangular) {"
function declareNgFunction(deps, includeRestangularDep) {
  deps = deps || [];
  if (includeRestangularDep) deps.push('Restangular');
  return '[' + deps.map(ejs.filters.str).join(',') + (deps.length ? ',' : '') +
    'function(' + deps.join(',') + ') {';
}

// Enrich model config with fields from app instance
function enrichModelConfig(app, config, sources) {
  function handleSource(source) {
    // ModelName will search for model-name.js
    var file = modelName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    file = path.join(source, file + '.js');
    if (fs.existsSync(file)) {
      cfg.extensions.push(require(file));
    }
  }

  for (var modelName in config) {
    var Model = app.models[modelName];
    var cfg = config[modelName];
    var shared = Model && Model.sharedClass.sharedCtor.shared;

    if ((!Model || !shared) && cfg.dataSource == 'remote') {
      console.log('Model ' + modelName + ' is expected to be REST exposed ' +
        ' but is not found in app, so it will not be included ' +
        ' in generated services file');
      delete config[modelName];
      continue;
    }

    cfg.extensions = [];
    sources.forEach(handleSource);

    cfg.modelTo = Model;
    try {
      cfg.apiEndPoint = Model.sharedClass.http.path.replace('/', '');
    } catch(e) {
      cfg.apiEndPoint = null;
    }
  }
  return config;
}

module.exports = function generateServices(opts) {
  var modelConfig;
  try {
    modelConfig = require(opts.clientModelConfig);
  } catch(err) {
    console.error('FATAL Provided client config file could not be loaded : ' +
                  opts.clientModelConfig, err);
    process.exit(1);
  }
  var sources = [
    '../common/models',
    './models'
  ];
  if (!!modelConfig._meta && Array.isArray(modelConfig._meta.sources)) {
    sources = modelConfig._meta.sources;
    delete modelConfig._meta;
  }
  sources = sources.map(function(source) {
    return path.join(path.dirname(opts.clientModelConfig), source);
  });

  modelConfig = enrichModelConfig(opts.app, modelConfig, sources);

  var ngModuleName = opts.ngModuleName || 'lbServices';
  var apiUrl = opts.apiUrl || '/';

  var servicesTemplate = fs.readFileSync(
    require.resolve('./services.template.ejs'), {
      encoding: 'utf-8'
    }
  );

  return ejs.render(servicesTemplate, {
    declareNgFunction: declareNgFunction,
    modelConfig: modelConfig,
    moduleName: ngModuleName,
    urlBase: apiUrl.replace(/\/+$/, '')
  });
};
