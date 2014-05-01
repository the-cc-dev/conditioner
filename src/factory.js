(function(undefined){

    'use strict';

    // returns conditioner API
    var factory = function(require,Observer,Promise,contains,matchesSelector,mergeObjects) {

        var _monitorFactory;

        // FACTORY <%= contents %>

        // setup monitor factory
        _monitorFactory = new MonitorFactory();

        // conditioner options object
        var _options = {
            'paths':{
                'monitors':'./monitors/'
            },
            'attr':{
                'options':'data-options',
                'module':'data-module',
                'conditions':'data-conditions',
                'priority':'data-priority',
                'initialized':'data-initialized',
                'processed':'data-processed',
                'loading':'data-loading'
            },
            'loader':{
                'load':function(paths,callback){
                    require(paths,callback);
                },
                'config':function(path,options){
                    var config = {};
                    config[path] = options;
                    requirejs.config({
                        config:config
                    });
                },
                'toUrl':function(path) {
                    return requirejs.toUrl(path);
                }
            },
            'modules':{}
        };

        // setup loader instance
        var _loader =  new ModuleLoader();

        // expose API
        return {

            /**
             * Initialises the conditioner and parses the document for modules
             * @param {Object} [options] - optional options to override
             * @return {Array} of initialized nodes
             * @public
             */
            init:function(options){

                if (options) {
                    this.setOptions(options);
                }

                return _loader.parse(document);

            },

            /**
             * Set custom options
             * @param {Object} options - options to override
             * @public
             */
            setOptions:function(options){

                if (!options) {
                    throw new Error('Conditioner.setOptions(options): "options" is a required parameter.');
                }

                var config,path,mod,alias;

                // update options
                _options = mergeObjects(_options,options);

                // loop over modules
                for (path in _options.modules) {

                    if (!_options.modules.hasOwnProperty(path)){continue;}

                    // get module reference
                    mod = _options.modules[path];

                    // get alias
                    alias = typeof mod === 'string' ? mod : mod.alias;

                    // get config
                    config = typeof mod === 'string' ? null : mod.options || {};

                    // register this module
                    ModuleRegistry.registerModule(path,config,alias);

                }

            },

            /**
             * Loads all modules within the supplied dom tree
             * @param {Document|Element} context - Context to find modules in
             * @return {Array} - Array of found Nodes
             */
            parse:function(context) {

                if (!context) {
                    throw new Error('Conditioner.parse(context): "context" is a required parameter.');
                }

                return _loader.parse(context);

            },

            /**
             * Setup the given element with the passed module controller(s)
             * @param {Element} element - Element to bind the controllers to
             * @param {Array|ModuleController} controllers - module controller configurations
             * [
             *     {
             *         path: 'path/to/module',
             *         conditions: 'config',
             *         options: {
             *             foo: 'bar'
             *         }
             *     }
             * ]
             * @return {NodeController|null} - The newly created node or null if something went wrong
             */
            load:function(element,controllers) {

                return _loader.load(element,controllers);

            },

            /**
             * Returns a synced controller group which fires a load event once all modules have loaded
             * {ModuleController|NodeController} [arguments] - list of module controllers or node controllers to synchronize
             * @return SyncedControllerGroup.prototype
             */
            sync:function() {

                var group = Object.create(SyncedControllerGroup.prototype);

                // create synced controller group using passed arguments
                // test if user passed an array instead of separate arguments
                SyncedControllerGroup.apply(group,arguments.length === 1 && !arguments.slice ? arguments[0] : arguments);

                return group;

            },

            /**
             * Returns the first Node matching the selector
             * @param {String} [selector] - Selector to match the nodes to
             * @param {Document|Element} [context] - Context to search in
             * @return {Node|null} First matched node or null
             */
            getNode:function(selector,context) {

                return _loader.getNodes(selector,context,true);

            },

            /**
             * Returns all nodes matching the selector
             * @param {String} [selector] - Optional selector to match the nodes to
             * @param {Document|Element} [context] - Context to search in
             * @return {Array} Array containing matched nodes or empty Array
             */
            getNodes:function(selector,context) {

                return _loader.getNodes(selector,context,false);

            },

            /**
             * Destroy the passed node reference
             * @param node {NodeController}
             * @return {Boolean}
             * @public
             */
            destroyNode:function(node) {

                return _loader.destroyNode(node);

            },

            /**
             * Returns the first Module matching the selector
             * @param {String} path - Optional path to match the modules to
             * @param {String} selector - Optional selector to match the nodes to
             * @param {Document|Element} [context] - Context to search in
             * @public
             */
            getModule:function(path,selector,context){

                var i=0,results = this.getNodes(selector,context),l=results.length,module;
                for (;i<l;i++) {
                    module = results[i].getModule(path);
                    if (module) {
                        return module;
                    }
                }
                return null;

            },

            /**
             * Returns multiple modules matching the given path
             * @param {String} path - Optional path to match the modules to
             * @param {String} selector - Optional selector to match the nodes to
             * @param {Document|Element} [context] - Context to search in
             * @returns {Array|Node|null}
             * @public
             */
            getModules:function(path,selector,context) {

                var i=0,results = this.getNodes(selector,context),l=results.length,filtered=[],modules;
                for (;i<l;i++) {
                    modules = results[i].getModules(path);
                    if (modules.length) {
                        filtered = filtered.concat(modules);
                    }
                }
                return filtered;

            },

            /**
             * Manual run an expression
             * @param {String} conditions - Expression to test
             * @param {Element} [element] - Optional element to run the test on
             * @returns {Promise}
             */
            test:function(conditions,element) {

                if (!conditions) {
                    throw new Error('Conditioner.test(conditions): "conditions" is a required parameter.');
                }

                // run test and resolve with first received state
                var p = new Promise();
                WebContext.test(conditions,element,function(valid){
                    p[valid ? 'resolve' : 'reject']();
                });
                return p;

            }

        };

    };

    // CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require,
            require('./utils/Observer'),
            require('./utils/Promise'),
            require('./utils/contains'),
            require('./utils/matchesSelector'),
            require('./utils/mergeObjects')
        );
    }
    // AMD
    else if (typeof define === 'function' && define.amd) {
        define(['require','./utils/Observer','./utils/Promise','./utils/contains','./utils/matchesSelector','./utils/mergeObjects'], factory);
    }
    // Browser globals
    else {
        throw new Error('To use ConditionerJS you need to setup a module loader like RequireJS.');
    }

}());