// OpenLayers 3. See http://openlayers.org/
// License: https://raw.githubusercontent.com/openlayers/ol3/master/LICENSE.md
// Version: v3.17.1

(function (root, factory) {
  if (typeof exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root.ol = factory();
  }
}(this, function () {
  var OPENLAYERS = {};
  var goog = this.goog = {};
this.CLOSURE_NO_DEPS = true;
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will write out Closure's deps file, unless the
 * global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects to
 * include their own deps file(s) from different locations.
 *
 * @author arv@google.com (Erik Arvidsson)
 *
 * @provideGoog
 */


/**
 * @define {boolean} Overridden to true by the compiler when
 *     --process_closure_primitives is specified.
 */
var COMPILED = false;


/**
 * Base namespace for the Closure library.  Checks to see goog is already
 * defined in the current scope before assigning to prevent clobbering if
 * base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {};


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * A hook for overriding the define values in uncompiled mode.
 *
 * In uncompiled mode, {@code CLOSURE_UNCOMPILED_DEFINES} may be defined before
 * loading base.js.  If a key is defined in {@code CLOSURE_UNCOMPILED_DEFINES},
 * {@code goog.define} will use the value instead of the default value.  This
 * allows flags to be overwritten without compilation (this is normally
 * accomplished with the compiler's "define" flag).
 *
 * Example:
 * <pre>
 *   var CLOSURE_UNCOMPILED_DEFINES = {'goog.DEBUG': false};
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_UNCOMPILED_DEFINES;


/**
 * A hook for overriding the define values in uncompiled or compiled mode,
 * like CLOSURE_UNCOMPILED_DEFINES but effective in compiled code.  In
 * uncompiled code CLOSURE_UNCOMPILED_DEFINES takes precedence.
 *
 * Also unlike CLOSURE_UNCOMPILED_DEFINES the values must be number, boolean or
 * string literals or the compiler will emit an error.
 *
 * While any @define value may be set, only those set with goog.define will be
 * effective for uncompiled code.
 *
 * Example:
 * <pre>
 *   var CLOSURE_DEFINES = {'goog.DEBUG': false} ;
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
goog.global.CLOSURE_DEFINES;


/**
 * Returns true if the specified value is not undefined.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  // void 0 always evaluates to undefined and hence we do not need to depend on
  // the definition of the global variable named 'undefined'.
  return val !== void 0;
};


/**
 * Builds an object structure for the provided namespace path, ensuring that
 * names that already exist are not overwritten. For example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 * @private
 */
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Certain browsers cannot parse code in the form for((a in b); c;);
  // This pattern is produced by the JSCompiler when it collapses the
  // statement above into the conditional loop below. To prevent this from
  // happening, use a for-loop and reserve the init logic as below.

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Defines a named value. In uncompiled mode, the value is retrieved from
 * CLOSURE_DEFINES or CLOSURE_UNCOMPILED_DEFINES if the object is defined and
 * has the property specified, and otherwise used the defined defaultValue.
 * When compiled the default can be overridden using the compiler
 * options or the value set in the CLOSURE_DEFINES object.
 *
 * @param {string} name The distinguished name to provide.
 * @param {string|number|boolean} defaultValue
 */
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else if (
        goog.global.CLOSURE_DEFINES &&
        Object.prototype.hasOwnProperty.call(
            goog.global.CLOSURE_DEFINES, name)) {
      value = goog.global.CLOSURE_DEFINES[name];
    }
  }
  goog.exportPath_(name, value);
};


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production js_binary can be easily stripped
 * by specifying --define goog.DEBUG=false to the JSCompiler. For example, most
 * toString() methods should be declared inside an "if (goog.DEBUG)" conditional
 * because they are generally used for debugging purposes and it is difficult
 * for the JSCompiler to statically determine whether they are used.
 */
goog.define('goog.DEBUG', true);


/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as JSCompiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he), see http://wiki/Main/IIISynonyms.
 */
goog.define('goog.LOCALE', 'en');  // default to en


/**
 * @define {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces closure to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define goog.TRUSTED_SITE=false" to the JSCompiler.
 */
goog.define('goog.TRUSTED_SITE', true);


/**
 * @define {boolean} Whether a project is expected to be running in strict mode.
 *
 * This define can be used to trigger alternate implementations compatible with
 * running in EcmaScript Strict mode or warn about unavailable functionality.
 * @see https://goo.gl/PudQ4y
 *
 */
goog.define('goog.STRICT_MODE_COMPATIBLE', false);


/**
 * @define {boolean} Whether code that calls {@link goog.setTestOnly} should
 *     be disallowed in the compilation unit.
 */
goog.define('goog.DISALLOW_TEST_ONLY_CODE', COMPILED && !goog.DEBUG);


/**
 * @define {boolean} Whether to use a Chrome app CSP-compliant method for
 *     loading scripts via goog.require. @see appendScriptSrcNode_.
 */
goog.define('goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING', false);


/**
 * Defines a namespace in Closure.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * The presence of one or more goog.provide() calls in a file indicates
 * that the file defines the given objects/namespaces.
 * Provided symbols must not be null or undefined.
 *
 * In addition, goog.provide() creates the object stubs for a namespace
 * (for example, goog.provide("goog.foo.bar") will create the object
 * goog.foo.bar if it does not already exist).
 *
 * Build tools also scan for provide/require/module statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 *
 * @see goog.require
 * @see goog.module
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (goog.isInModuleLoader_()) {
    throw Error('goog.provide can not be used within a goog.module.');
  }
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }

  goog.constructNamespace_(name);
};


/**
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 * @param {Object=} opt_obj The object to embed in the namespace.
 * @private
 */
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name, opt_obj);
};


/**
 * Module identifier validation regexp.
 * Note: This is a conservative check, it is very possible to be more lenient,
 *   the primary exclusion here is "/" and "\" and a leading ".", these
 *   restrictions are intended to leave the door open for using goog.require
 *   with relative file paths rather than module identifiers.
 * @private
 */
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;


/**
 * Defines a module in Closure.
 *
 * Marks that this file must be loaded as a module and claims the namespace.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * goog.module() has three requirements:
 * - goog.module may not be used in the same file as goog.provide.
 * - goog.module must be the first statement in the file.
 * - only one goog.module is allowed per file.
 *
 * When a goog.module annotated file is loaded, it is enclosed in
 * a strict function closure. This means that:
 * - any variables declared in a goog.module file are private to the file
 * (not global), though the compiler is expected to inline the module.
 * - The code must obey all the rules of "strict" JavaScript.
 * - the file will be marked as "use strict"
 *
 * NOTE: unlike goog.provide, goog.module does not declare any symbols by
 * itself. If declared symbols are desired, use
 * goog.module.declareLegacyNamespace().
 *
 *
 * See the public goog.module proposal: http://goo.gl/Va1hin
 *
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part", is expected but not required.
 */
goog.module = function(name) {
  if (!goog.isString(name) || !name ||
      name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error('Invalid module identifier');
  }
  if (!goog.isInModuleLoader_()) {
    throw Error('Module ' + name + ' has been loaded incorrectly.');
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error('goog.module may only be called once per module.');
  }

  // Store the module name for the loader.
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice.
    // A goog.module/goog.provide maps a goog.require to a specific file
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 *
 * Note: This is not an alternative to goog.require, it does not
 * indicate a hard dependency, instead it is used to indicate
 * an optional dependency or to access the exports of a module
 * that has already been loaded.
 * @suppress {missingProvide}
 */
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};


/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 * @private
 */
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      // goog.require only return a value with-in goog.module files.
      return name in goog.loadedModules_ ? goog.loadedModules_[name] :
                                           goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};


/**
 * @private {?{moduleName: (string|undefined), declareLegacyNamespace:boolean}}
 */
goog.moduleLoaderState_ = null;


/**
 * @private
 * @return {boolean} Whether a goog.module is currently being initialized.
 */
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};


/**
 * Provide the module's exports as a globally accessible object under the
 * module's declared name.  This is intended to ease migration to goog.module
 * for files that have existing usages.
 * @suppress {missingProvide}
 */
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error(
        'goog.module.declareLegacyNamespace must be called from ' +
        'within a goog.module');
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error(
        'goog.module must be called prior to ' +
        'goog.module.declareLegacyNamespace.');
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 *
 * In the case of unit tests, the message may optionally be an exact namespace
 * for the test (e.g. 'goog.stringTest'). The linter will then ignore the extra
 * provide (if not explicitly defined in the code).
 *
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || '';
    throw Error(
        'Importing test-only code into non-debug environment' +
        (opt_message ? ': ' + opt_message : '.'));
  }
};


/**
 * Forward declares a symbol. This is an indication to the compiler that the
 * symbol may be used in the source yet is not required and may not be provided
 * in compilation.
 *
 * The most common usage of forward declaration is code that takes a type as a
 * function parameter but does not need to require it. By forward declaring
 * instead of requiring, no hard dependency is made, and (if not required
 * elsewhere) the namespace may never be required and thus, not be pulled
 * into the JavaScript binary. If it is required elsewhere, it will be type
 * checked as normal.
 *
 *
 * @param {string} name The namespace to forward declare in the form of
 *     "goog.package.part".
 */
goog.forwardDeclare = function(name) {};


/**
 * Forward declare type information. Used to assign types to goog.global
 * referenced object that would otherwise result in unknown type references
 * and thus block property disambiguation.
 */
goog.forwardDeclare('Document');
goog.forwardDeclare('HTMLScriptElement');
goog.forwardDeclare('XMLHttpRequest');


if (!COMPILED) {
  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return (name in goog.loadedModules_) ||
        (!goog.implicitNamespaces_[name] &&
         goog.isDefAndNotNull(goog.getObjectByName(name)));
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares that 'goog' and
   * 'goog.events' must be namespaces.
   *
   * @type {!Object<string, (boolean|undefined)>}
   * @private
   */
  goog.implicitNamespaces_ = {'goog.module': true};

  // NOTE: We add goog.module as an implicit namespace as goog.module is defined
  // here and because the existing module package has not been moved yet out of
  // the goog.module namespace. This satisifies both the debug loader and
  // ahead-of-time dependency management.
}


/**
 * Returns an object based on its fully qualified external name.  The object
 * is not found if null or undefined.  If you are using a compilation pass that
 * renames property names beware that using this function will not find renamed
 * properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {!Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};


/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {!Array<string>} provides An array of strings with
 *     the names of the objects this file provides.
 * @param {!Array<string>} requires An array of strings with
 *     the names of the objects this file requires.
 * @param {boolean|!Object<string>=} opt_loadFlags Parameters indicating
 *     how the file must be loaded.  The boolean 'true' is equivalent
 *     to {'module': 'goog'} for backwards-compatibility.  Valid properties
 *     and values include {'module': 'goog'} and {'lang': 'es6'}.
 */
goog.addDependency = function(relPath, provides, requires, opt_loadFlags) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    if (!opt_loadFlags || typeof opt_loadFlags === 'boolean') {
      opt_loadFlags = opt_loadFlags ? {'module': 'goog'} : {};
    }
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      deps.loadFlags[path] = opt_loadFlags;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(nnaze): The debug DOM loader was included in base.js as an original way
// to do "debug-mode" development.  The dependency system can sometimes be
// confusing, as can the debug DOM loader's asynchronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the script
// will not load until some point after the current script.  If a namespace is
// needed at runtime, it needs to be defined in a previous script, or loaded via
// require() with its registered dependencies.
//
// User-defined namespaces may need their own deps file. For a reference on
// creating a deps file, see:
// Externally: https://developers.google.com/closure/library/docs/depswriter
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work is being done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */
goog.define('goog.ENABLE_DEBUG_LOADER', true);


/**
 * @param {string} msg
 * @private
 */
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console['error'](msg);
  }
};


/**
 * Implements a system for the dynamic resolution of dependencies that works in
 * parallel with the BUILD system. Note that all calls to goog.require will be
 * stripped by the JSCompiler when the --process_closure_primitives option is
 * used.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide()) in
 *     the form "goog.package.part".
 * @return {?} If called within a goog.module file, the associated namespace or
 *     module otherwise null.
 */
goog.require = function(name) {
  // If the object already exists we do not need do do anything.
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }

    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.writeScripts_(path);
        return null;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    goog.logToConsole_(errorMessage);

    throw Error(errorMessage);
  }
};


/**
 * Path for included scripts.
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to write out Closure's deps file. By default, the deps are written.
 * @type {boolean|undefined}
 */
goog.global.CLOSURE_NO_DEPS;


/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The function is passed the script source, which is a relative URI. It should
 * return true if the script was imported, false otherwise.
 * @type {(function(string): boolean)|undefined}
 */
goog.global.CLOSURE_IMPORT_SCRIPT;


/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
goog.nullFunction = function() {};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error will be thrown
 * when bar() is invoked.
 *
 * Note: This does not take the name of the function to override as an argument
 * because that would make it more difficult to obfuscate our JavaScript code.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be overridden.
 */
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always returns the same
 * instance object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};


/**
 * All singleton classes that have been instantiated, for testing. Don't read
 * it directly, use the {@code goog.testing.singleton} module. The compiler
 * removes this variable if unused.
 * @type {!Array<!Function>}
 * @private
 */
goog.instantiatedSingletons_ = [];


/**
 * @define {boolean} Whether to load goog.modules using {@code eval} when using
 * the debug loader.  This provides a better debugging experience as the
 * source is unmodified and can be edited using Chrome Workspaces or similar.
 * However in some environments the use of {@code eval} is banned
 * so we provide an alternative.
 */
goog.define('goog.LOAD_MODULE_USING_EVAL', true);


/**
 * @define {boolean} Whether the exports of goog.modules should be sealed when
 * possible.
 */
goog.define('goog.SEAL_MODULE_EXPORTS', goog.DEBUG);


/**
 * The registry of initialized modules:
 * the module identifier to module exports map.
 * @private @const {!Object<string, ?>}
 */
goog.loadedModules_ = {};


/**
 * True if goog.dependencies_ is available.
 * @const {boolean}
 */
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;


/**
 * @define {string} How to decide whether to transpile.  Valid values
 * are 'always', 'never', and 'detect'.  The default ('detect') is to
 * use feature detection to determine which language levels need
 * transpilation.
 */
// NOTE(user): we could expand this to accept a language level to bypass
// detection: e.g. goog.TRANSPILE == 'es5' would transpile ES6 files but
// would leave ES3 and ES5 files alone.
goog.define('goog.TRANSPILE', 'detect');


/**
 * @define {string} Path to the transpiler.  Executing the script at this
 * path (relative to base.js) should define a function $jscomp.transpile.
 */
goog.define('goog.TRANSPILER', 'transpile.js');


if (goog.DEPENDENCIES_ENABLED) {
  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts.
   * @private
   * @type {{
   *   loadFlags: !Object<string, !Object<string, string>>,
   *   nameToPath: !Object<string, string>,
   *   requires: !Object<string, !Object<string, boolean>>,
   *   visited: !Object<string, boolean>,
   *   written: !Object<string, boolean>,
   *   deferred: !Object<string, string>
   * }}
   */
  goog.dependencies_ = {
    loadFlags: {},  // 1 to 1

    nameToPath: {},  // 1 to 1

    requires: {},  // 1 to many

    // Used when resolving dependencies to prevent us from visiting file twice.
    visited: {},

    written: {},  // Used to keep track of script files we have written.

    deferred: {}  // Used to track deferred module evaluations in old IEs
  };


  /**
   * Tries to detect whether is in the context of an HTML document.
   * @return {boolean} True if it looks like HTML document.
   * @private
   */
  goog.inHtmlDocument_ = function() {
    /** @type {Document} */
    var doc = goog.global.document;
    return doc != null && 'write' in doc;  // XULDocument misses write.
  };


  /**
   * Tries to detect the base path of base.js script that bootstraps Closure.
   * @private
   */
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    /** @type {Document} */
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('SCRIPT');
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var script = /** @type {!HTMLScriptElement} */ (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };


  /**
   * Imports a script if, and only if, that script hasn't already been imported.
   * (Must be called at execution time)
   * @param {string} src Script source.
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @private
   */
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript =
        goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /**
   * Whether the browser is IE9 or earlier, which needs special handling
   * for deferred modules.
   * @const @private {boolean}
   */
  goog.IS_OLD_IE_ =
      !!(!goog.global.atob && goog.global.document && goog.global.document.all);


  /**
   * Given a URL initiate retrieval and execution of a script that needs
   * pre-processing.
   * @param {string} src Script source URL.
   * @param {boolean} isModule Whether this is a goog.module.
   * @param {boolean} needsTranspile Whether this source needs transpilation.
   * @private
   */
  goog.importProcessedScript_ = function(src, isModule, needsTranspile) {
    // In an attempt to keep browsers from timing out loading scripts using
    // synchronous XHRs, put each load in its own script block.
    var bootstrap = 'goog.retrieveAndExec_("' + src + '", ' + isModule + ', ' +
        needsTranspile + ');';

    goog.importScript_('', bootstrap);
  };


  /** @private {!Array<string>} */
  goog.queuedModules_ = [];


  /**
   * Return an appropriate module text. Suitable to insert into
   * a script tag (that is unescaped).
   * @param {string} srcUrl
   * @param {string} scriptText
   * @return {string}
   * @private
   */
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return '' +
          'goog.loadModule(function(exports) {' +
          '"use strict";' + scriptText +
          '\n' +  // terminate any trailing single line comment.
          ';return exports' +
          '});' +
          '\n//# sourceURL=' + srcUrl + '\n';
    } else {
      return '' +
          'goog.loadModule(' +
          goog.global.JSON.stringify(
              scriptText + '\n//# sourceURL=' + srcUrl + '\n') +
          ');';
    }
  };

  // On IE9 and earlier, it is necessary to handle
  // deferred module loads. In later browsers, the
  // code to be evaluated is simply inserted as a script
  // block in the correct order. To eval deferred
  // code at the right time, we piggy back on goog.require to call
  // goog.maybeProcessDeferredDep_.
  //
  // The goog.requires are used both to bootstrap
  // the loading process (when no deps are available) and
  // declare that they should be available.
  //
  // Here we eval the sources, if all the deps are available
  // either already eval'd or goog.require'd.  This will
  // be the case when all the dependencies have already
  // been loaded, and the dependent module is loaded.
  //
  // But this alone isn't sufficient because it is also
  // necessary to handle the case where there is no root
  // that is not deferred.  For that there we register for an event
  // and trigger goog.loadQueuedModules_ handle any remaining deferred
  // evaluations.

  /**
   * Handle any remaining deferred goog.module evals.
   * @private
   */
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0; i < count; i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };


  /**
   * Eval the named module if its dependencies are
   * available.
   * @param {string} name The module to load.
   * @private
   */
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };

  /**
   * @param {string} name The module to check.
   * @return {boolean} Whether the name represents a
   *     module whose evaluation has been deferred.
   * @private
   */
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    var loadFlags = path && goog.dependencies_.loadFlags[path] || {};
    if (path && (loadFlags['module'] == 'goog' ||
                 goog.needsTranspile_(loadFlags['lang']))) {
      var abspath = goog.basePath + path;
      return (abspath) in goog.dependencies_.deferred;
    }
    return false;
  };

  /**
   * @param {string} name The module to check.
   * @return {boolean} Whether the name represents a
   *     module whose declared dependencies have all been loaded
   *     (eval'd or a deferred module load)
   * @private
   */
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && (path in goog.dependencies_.requires)) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) &&
            !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };


  /**
   * @param {string} abspath
   * @private
   */
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };


  /**
   * Load a goog.module from the provided URL.  This is not a general purpose
   * code loader and does not support late loading code, that is it should only
   * be used during page load. This method exists to support unit tests and
   * "debug" loaders that would otherwise have inserted script tags. Under the
   * hood this needs to use a synchronous XHR and is not recommeneded for
   * production code.
   *
   * The module's goog.requires must have already been satisified; an exception
   * will be thrown if this is not the case. This assumption is that no
   * "deps.js" file exists, so there is no way to discover and locate the
   * module-to-be-loaded's dependencies and no attempt is made to do so.
   *
   * There should only be one attempt to load a module.  If
   * "goog.loadModuleFromUrl" is called for an already loaded module, an
   * exception will be throw.
   *
   * @param {string} url The URL from which to attempt to load the goog.module.
   */
  goog.loadModuleFromUrl = function(url) {
    // Because this executes synchronously, we don't need to do any additional
    // bookkeeping. When "goog.loadModule" the namespace will be marked as
    // having been provided which is sufficient.
    goog.retrieveAndExec_(url, true, false);
  };


  /**
   * Writes a new script pointing to {@code src} directly into the DOM.
   *
   * NOTE: This method is not CSP-compliant. @see goog.appendScriptSrcNode_ for
   * the fallback mechanism.
   *
   * @param {string} src The script URL.
   * @private
   */
  goog.writeScriptSrcNode_ = function(src) {
    goog.global.document.write(
        '<script type="text/javascript" src="' + src + '"></' +
        'script>');
  };


  /**
   * Appends a new script node to the DOM using a CSP-compliant mechanism. This
   * method exists as a fallback for document.write (which is not allowed in a
   * strict CSP context, e.g., Chrome apps).
   *
   * NOTE: This method is not analogous to using document.write to insert a
   * <script> tag; specifically, the user agent will execute a script added by
   * document.write immediately after the current script block finishes
   * executing, whereas the DOM-appended script node will not be executed until
   * the entire document is parsed and executed. That is to say, this script is
   * added to the end of the script execution queue.
   *
   * The page must not attempt to call goog.required entities until after the
   * document has loaded, e.g., in or after the window.onload callback.
   *
   * @param {string} src The script URL.
   * @private
   */
  goog.appendScriptSrcNode_ = function(src) {
    /** @type {Document} */
    var doc = goog.global.document;
    var scriptEl =
        /** @type {HTMLScriptElement} */ (doc.createElement('script'));
    scriptEl.type = 'text/javascript';
    scriptEl.src = src;
    scriptEl.defer = false;
    scriptEl.async = false;
    doc.head.appendChild(scriptEl);
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script url.
   * @param {string=} opt_sourceText The optionally source text to evaluate
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      /** @type {!HTMLDocument} */
      var doc = goog.global.document;

      // If the user tries to require a new symbol after document load,
      // something has gone terribly wrong. Doing a document.write would
      // wipe out the page. This does not apply to the CSP-compliant method
      // of writing script tags.
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING &&
          doc.readyState == 'complete') {
        // Certain test frameworks load base.js multiple times, which tries
        // to write deps.js each time. If that happens, just fail silently.
        // These frameworks wipe the page between each load of base.js, so this
        // is OK.
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }

      if (opt_sourceText === undefined) {
        if (!goog.IS_OLD_IE_) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            goog.appendScriptSrcNode_(src);
          } else {
            goog.writeScriptSrcNode_(src);
          }
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " +
              ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write(
              '<script type="text/javascript" src="' + src + '"' + state +
              '></' +
              'script>');
        }
      } else {
        doc.write(
            '<script type="text/javascript">' + opt_sourceText + '</' +
            'script>');
      }
      return true;
    } else {
      return false;
    }
  };


  /**
   * Determines whether the given language needs to be transpiled.
   * @param {string} lang
   * @return {boolean}
   * @private
   */
  goog.needsTranspile_ = function(lang) {
    if (goog.TRANSPILE == 'always') {
      return true;
    } else if (goog.TRANSPILE == 'never') {
      return false;
    } else if (!goog.transpiledLanguages_) {
      goog.transpiledLanguages_ = {'es5': true, 'es6': true, 'es6-impl': true};
      /** @preserveTry */
      try {
        // Perform some quick conformance checks, to distinguish
        // between browsers that support es5, es6-impl, or es6.

        // Identify ES3-only browsers by their incorrect treatment of commas.
        goog.transpiledLanguages_['es5'] = eval('[1,].length!=1');

        // As browsers mature, features will be moved from the full test
        // into the impl test.  This must happen before the corresponding
        // features are changed in the Closure Compiler's FeatureSet object.

        // Test 1: es6-impl [FF49, Edge 13, Chrome 49]
        //   (a) let/const keyword, (b) class expressions, (c) Map object,
        //   (d) iterable arguments, (e) spread operator
        var es6implTest =
            'let a={};const X=class{constructor(){}x(z){return new Map([' +
            '...arguments]).get(z[0])==3}};return new X().x([a,3])';

        // Test 2: es6 [FF50 (?), Edge 14 (?), Chrome 50]
        //   (a) default params (specifically shadowing locals),
        //   (b) destructuring, (c) block-scoped functions,
        //   (d) for-of (const), (e) new.target/Reflect.construct
        var es6fullTest =
            'class X{constructor(){if(new.target!=String)throw 1;this.x=42}}' +
            'let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof ' +
            'String))throw 1;for(const a of[2,3]){if(a==2)continue;function ' +
            'f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()' +
            '==3}';

        if (eval('(()=>{"use strict";' + es6implTest + '})()')) {
          goog.transpiledLanguages_['es6-impl'] = false;
        }
        if (eval('(()=>{"use strict";' + es6fullTest + '})()')) {
          goog.transpiledLanguages_['es6'] = false;
        }
      } catch (err) {
      }
    }
    return !!goog.transpiledLanguages_[lang];
  };


  /** @private {?Object<string, boolean>} */
  goog.transpiledLanguages_ = null;


  /** @private {number} */
  goog.lastNonModuleScriptIndex_ = 0;


  /**
   * A readystatechange handler for legacy IE
   * @param {!HTMLScriptElement} script
   * @param {number} scriptIndex
   * @return {boolean}
   * @private
   */
  goog.onScriptLoad_ = function(script, scriptIndex) {
    // for now load the modules when we reach the last script,
    // later allow more inter-mingling.
    if (script.readyState == 'complete' &&
        goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };

  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @param {string} pathToLoad The path from which to start discovering
   *     dependencies.
   * @private
   */
  goog.writeScripts_ = function(pathToLoad) {
    /** @type {!Array<string>} The scripts we need to write this time. */
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    /** @param {string} path */
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // We have already visited this one. We can get here if we have cyclic
      // dependencies.
      if (path in deps.visited) {
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    visitNode(pathToLoad);

    // record that we are going to load all these scripts.
    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }

    // If a module is loaded synchronously then we need to
    // clear the current inModuleLoader value, and restore it when we are
    // done loading the current "requires".
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;

    for (var i = 0; i < scripts.length; i++) {
      var path = scripts[i];
      if (path) {
        var loadFlags = deps.loadFlags[path] || {};
        var needsTranspile = goog.needsTranspile_(loadFlags['lang']);
        if (loadFlags['module'] == 'goog' || needsTranspile) {
          goog.importProcessedScript_(
              goog.basePath + path, loadFlags['module'] == 'goog',
              needsTranspile);
        } else {
          goog.importScript_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error('Undefined script input');
      }
    }

    // restore the current "module loading state"
    goog.moduleLoaderState_ = moduleState;
  };


  /**
   * Looks at the dependency rules and tries to determine the script file that
   * fulfills a particular rule.
   * @param {string} rule In the form goog.namespace.Class or project.script.
   * @return {?string} Url corresponding to the rule, or null.
   * @private
   */
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}


/**
 * @param {function(?):?|string} moduleDef The module definition.
 */
goog.loadModule = function(moduleDef) {
  // NOTE: we allow function definitions to be either in the from
  // of a string to eval (which keeps the original source intact) or
  // in a eval forbidden environment (CSP) we allow a function definition
  // which in its body must call {@code goog.module}, and return the exports
  // of the module.
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {
      moduleName: undefined,
      declareLegacyNamespace: false
    };
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(undefined, {});
    } else if (goog.isString(moduleDef)) {
      exports = goog.loadModuleFromSource_.call(undefined, moduleDef);
    } else {
      throw Error('Invalid module definition');
    }

    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw Error('Invalid module name \"' + moduleName + '\"');
    }

    // Don't seal legacy namespaces as they may be uses as a parent of
    // another namespace
    if (goog.moduleLoaderState_.declareLegacyNamespace) {
      goog.constructNamespace_(moduleName, exports);
    } else if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
      Object.seal(exports);
    }

    goog.loadedModules_[moduleName] = exports;
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};


/**
 * @private @const {function(string):?}
 *
 * The new type inference warns because this function has no formal
 * parameters, but its jsdoc says that it takes one argument.
 * (The argument is used via arguments[0], but NTI does not detect this.)
 * @suppress {newCheckTypes}
 */
goog.loadModuleFromSource_ = function() {
  // NOTE: we avoid declaring parameters or local variables here to avoid
  // masking globals or leaking values into the module definition.
  'use strict';
  var exports = {};
  eval(arguments[0]);
  return exports;
};


/**
 * Normalize a file path by removing redundant ".." and extraneous "." file
 * path components.
 * @param {string} path
 * @return {string}
 * @private
 */
goog.normalizePath_ = function(path) {
  var components = path.split('/');
  var i = 0;
  while (i < components.length) {
    if (components[i] == '.') {
      components.splice(i, 1);
    } else if (
        i && components[i] == '..' && components[i - 1] &&
        components[i - 1] != '..') {
      components.splice(--i, 2);
    } else {
      i++;
    }
  }
  return components.join('/');
};


/**
 * Loads file by synchronous XHR. Should not be used in production environments.
 * @param {string} src Source URL.
 * @return {?string} File contents, or null if load failed.
 * @private
 */
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    try {
      /** @type {XMLHttpRequest} */
      var xhr = new goog.global['XMLHttpRequest']();
      xhr.open('get', src, false);
      xhr.send();
      // NOTE: Successful http: requests have a status of 200, but successful
      // file: requests may have a status of zero.  Any other status, or a
      // thrown exception (particularly in case of file: requests) indicates
      // some sort of error, which we treat as a missing or unavailable file.
      return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null;
    } catch (err) {
      // No need to rethrow or log, since errors should show up on their own.
      return null;
    }
  }
};


/**
 * Retrieve and execute a script that needs some sort of wrapping.
 * @param {string} src Script source URL.
 * @param {boolean} isModule Whether to load as a module.
 * @param {boolean} needsTranspile Whether to transpile down to ES3.
 * @private
 */
goog.retrieveAndExec_ = function(src, isModule, needsTranspile) {
  if (!COMPILED) {
    // The full but non-canonicalized URL for later use.
    var originalPath = src;
    // Canonicalize the path, removing any /./ or /../ since Chrome's debugging
    // console doesn't auto-canonicalize XHR loads as it does <script> srcs.
    src = goog.normalizePath_(src);

    var importScript =
        goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;

    var scriptText = goog.loadFileSync_(src);
    if (scriptText == null) {
      throw new Error('Load of "' + src + '" failed');
    }

    if (needsTranspile) {
      scriptText = goog.transpile_.call(goog.global, scriptText, src);
    }

    if (isModule) {
      scriptText = goog.wrapModule_(src, scriptText);
    } else {
      scriptText += '\n//# sourceURL=' + src;
    }
    var isOldIE = goog.IS_OLD_IE_;
    if (isOldIE) {
      goog.dependencies_.deferred[originalPath] = scriptText;
      goog.queuedModules_.push(originalPath);
    } else {
      importScript(src, scriptText);
    }
  }
};


/**
 * Lazily retrieves the transpiler and applies it to the source.
 * @param {string} code JS code.
 * @param {string} path Path to the code.
 * @return {string} The transpiled code.
 * @private
 */
goog.transpile_ = function(code, path) {
  var jscomp = goog.global['$jscomp'];
  if (!jscomp) {
    goog.global['$jscomp'] = jscomp = {};
  }
  var transpile = jscomp.transpile;
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER;
    var transpilerCode = goog.loadFileSync_(transpilerPath);
    if (transpilerCode) {
      // This must be executed synchronously, since by the time we know we
      // need it, we're about to load and write the ES6 code synchronously,
      // so a normal script-tag load will be too slow.
      eval(transpilerCode + '\n//# sourceURL=' + transpilerPath);
      // Note: transpile.js reassigns goog.global['$jscomp'] so pull it again.
      jscomp = goog.global['$jscomp'];
      transpile = jscomp.transpile;
    }
  }
  if (!transpile) {
    // The transpiler is an optional component.  If it's not available then
    // replace it with a pass-through function that simply logs.
    var suffix = ' requires transpilation but no transpiler was found.';
    transpile = jscomp.transpile = function(code, path) {
      // TODO(user): figure out some way to get this error to show up
      // in test results, noting that the failure may occur in many
      // different ways, including in loadModule() before the test
      // runner even comes up.
      goog.logToConsole_(path + suffix);
      return code;
    };
  }
  // Note: any transpilation errors/warnings will be logged to the console.
  return transpile(code, path);
};


//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {?} value The value to get the type of.
 * @return {string} The name of the type.
 */
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals typeof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {!Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case.
           typeof value.length == 'number' &&
               typeof value.splice != 'undefined' &&
               typeof value.propertyIsEnumerable != 'undefined' &&
               !value.propertyIsEnumerable('splice')

               )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
           typeof value.call != 'undefined' &&
               typeof value.propertyIsEnumerable != 'undefined' &&
               !value.propertyIsEnumerable('call'))) {
        return 'function';
      }

    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Returns true if the specified value is null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property. As a special case, a function value is not array like, because its
 * length property is fixed to correspond to the number of expected arguments.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  // We do not use goog.isObject here in order to exclude function values.
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like the
 * value needs to be an object and have a getFullYear() function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a string.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays and
 * functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
  // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
};


/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. The unique ID is
 * guaranteed to be unique across the current session amongst objects that are
 * passed into {@code getUid}. There is no guarantee that the ID is unique or
 * consistent across sessions. It is unsafe to generate unique ID for function
 * prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Whether the given object is already assigned a unique ID.
 *
 * This does not modify the object.
 *
 * @param {!Object} obj The object to check.
 * @return {boolean} Whether there is an assigned unique id for the object.
 */
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In IE, DOM nodes are not instances of Object and throw an exception if we
  // try to delete.  Instead we try to use removeAttribute.
  if (obj !== null && 'removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  /** @preserveTry */
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};


/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure JavaScript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' + ((Math.random() * 1e9) >>> 0);


/**
 * Counter for UID.
 * @type {number}
 * @private
 */
goog.uidCounter_ = 0;


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */
goog.getHashCode = goog.getUid;


/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */
goog.removeHashCode = goog.removeUid;


/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};


/**
 * A native implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which this should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind is
 *     deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which this should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() { return fn.apply(selfObj, arguments); };
  }
};


/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of this 'pre-specified'.
 *
 * Remaining arguments specified at call-time are appended to the pre-specified
 * ones.
 *
 * Also see: {@link #partial}.
 *
 * Usage:
 * <pre>var barMethBound = goog.bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default Chrome
      // extension environment. This means that for Chrome extensions, they get
      // the implementation of Function.prototype.bind that calls goog.bind
      // instead of the native one. Even worse, we don't want to introduce a
      // circular dependency between goog.bind and Function.prototype.bind, so
      // we have to hack this to make sure it works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};


/**
 * Like goog.bind(), except that a 'this object' is not required. Useful when
 * the target function is already bound.
 *
 * Usage:
 * var g = goog.partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function goog.partial()
 *     was invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Clone the array (with slice()) and append additional arguments
    // to the existing arguments.
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};


/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};


/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
goog.now = (goog.TRUSTED_SITE && Date.now) || (function() {
             // Unary plus operator converts its operand to a number which in
             // the case of
             // a date is done by calling getTime().
             return +new Date();
           });


/**
 * Evals JavaScript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _evalTest_ = 1;');
      if (typeof goog.global['_evalTest_'] != 'undefined') {
        try {
          delete goog.global['_evalTest_'];
        } catch (ignore) {
          // Microsoft edge fails the deletion above in strict mode.
        }
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      /** @type {Document} */
      var doc = goog.global.document;
      var scriptElt =
          /** @type {!HTMLScriptElement} */ (doc.createElement('SCRIPT'));
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
};


/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */
goog.evalWorksForGlobals_ = null;


/**
 * Optional map of CSS class names to obfuscated names used with
 * goog.getCssName().
 * @private {!Object<string, string>|undefined}
 * @see goog.setCssNameMapping
 */
goog.cssNameMapping_;


/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMappingStyle_;


/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a hyphen and
 * passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which these
 * mappings are used. In the BY_PART style, each part (i.e. in between hyphens)
 * of the passed in css name is rewritten according to the map. In the BY_WHOLE
 * style, the full css name is looked up in the map directly. If a rewrite is
 * not specified by the map, the compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls to
 * goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x = 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed only the
 * modifier will be processed, as it is assumed the first argument was generated
 * as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (goog.cssNameMapping_) {
    rename =
        goog.cssNameMappingStyle_ == 'BY_WHOLE' ? getMapping : renameByParts;
  } else {
    rename = function(a) { return a; };
  }

  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
};


/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --process_closure_primitives flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};


/**
 * To use CSS renaming in compiled mode, one of the input files should have a
 * call to goog.setCssNameMapping() with an object literal that the JSCompiler
 * can extract and use to replace all calls to goog.getCssName(). In uncompiled
 * mode, JavaScript code should be loaded before this base.js file that declares
 * a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
 * to ensure that the mapping is loaded before any calls to goog.getCssName()
 * are made in uncompiled mode.
 *
 * A hook for overriding the CSS name mapping.
 * @type {!Object<string, string>|undefined}
 */
goog.global.CLOSURE_CSS_NAME_MAPPING;


if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  // This does not call goog.setCssNameMapping() because the JSCompiler
  // requires that goog.setCssNameMapping() be called with an object literal.
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}


/**
 * Gets a localized message.
 *
 * This function is a compiler primitive. If you give the compiler a localized
 * message bundle, it will replace the string at compile-time with a localized
 * version, and expand goog.getMsg call to a concatenated string.
 *
 * Messages must be initialized in the form:
 * <code>
 * var MSG_NAME = goog.getMsg('Hello {$placeholder}', {'placeholder': 'world'});
 * </code>
 *
 * This function produces a string which should be treated as plain text. Use
 * {@link goog.html.SafeHtmlFormatter} in conjunction with goog.getMsg to
 * produce SafeHtml.
 *
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object<string, string>=} opt_values Maps place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return (opt_values != null && key in opt_values) ? opt_values[key] :
                                                         match;
    });
  }
  return str;
};


/**
 * Gets a localized message. If the message does not have a translation, gives a
 * fallback message.
 *
 * This is useful when introducing a new message that has not yet been
 * translated into all languages.
 *
 * This function is a compiler primitive. Must be used in the form:
 * <code>var x = goog.getMsgWithFallback(MSG_A, MSG_B);</code>
 * where MSG_A and MSG_B were initialized with goog.getMsg.
 *
 * @param {string} a The preferred message.
 * @param {string} b The fallback message.
 * @return {string} The best translated message.
 */
goog.getMsgWithFallback = function(a, b) {
  return a;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated, unless they are
 * exported in turn via this function or goog.exportProperty.
 *
 * Also handy for making public items that are defined in anonymous closures.
 *
 * ex. goog.exportSymbol('public.path.Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction', Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is goog.global.
 */
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};


/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 */
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use goog.inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for goog.base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var args = new Array(arguments.length - 2);
    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * constructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass the name of the
 * method as the second argument to this function. If you do not, you will get a
 * runtime error. This calls the superclass' method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express inheritance
 * relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the compiler will do
 * macro expansion to remove a lot of the extra overhead that this function
 * introduces. The compiler will also enforce a lot of the assumptions that this
 * function makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 * @suppress {es5Strict} This method can not be used in strict mode, but
 *     all Closure Library consumers must depend on this file.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;

  if (goog.STRICT_MODE_COMPATIBLE || (goog.DEBUG && !caller)) {
    throw Error(
        'arguments.caller not defined.  goog.base() cannot be used ' +
        'with strict mode code. See ' +
        'http://www.ecma-international.org/ecma-262/5.1/#sec-C');
  }

  if (caller.superClass_) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }

  // Copying using loop to avoid deop due to passing arguments object to
  // function. This is faster in many JS engines as of late 2014.
  var args = new Array(arguments.length - 2);
  for (var i = 2; i < arguments.length; i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor; ctor;
       ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain, then one of two
  // things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the aliases
 * applied.  In uncompiled code the function is simply run since the aliases as
 * written are valid JavaScript.
 *
 *
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *     (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw Error('goog.scope is not supported within a goog.module.');
  }
  fn.call(goog.global);
};


/*
 * To support uncompiled, strict mode bundles that use eval to divide source
 * like so:
 *    eval('someSource;//# sourceUrl sourcefile.js');
 * We need to export the globally defined symbols "goog" and "COMPILED".
 * Exporting "goog" breaks the compiler optimizations, so we required that
 * be defined externally.
 * NOTE: We don't use goog.exportSymbol here because we don't want to trigger
 * extern generation when that compiler option is enabled.
 */
if (!COMPILED) {
  goog.global['COMPILED'] = COMPILED;
}


//==============================================================================
// goog.defineClass implementation
//==============================================================================


/**
 * Creates a restricted form of a Closure "class":
 *   - from the compiler's perspective, the instance returned from the
 *     constructor is sealed (no new properties may be added).  This enables
 *     better checks.
 *   - the compiler will rewrite this definition to a form that is optimal
 *     for type checking and optimization (initially this will be a more
 *     traditional form).
 *
 * @param {Function} superClass The superclass, Object or null.
 * @param {goog.defineClass.ClassDescriptor} def
 *     An object literal describing
 *     the class.  It may have the following properties:
 *     "constructor": the constructor function
 *     "statics": an object literal containing methods to add to the constructor
 *        as "static" methods or a function that will receive the constructor
 *        function as its only parameter to which static properties can
 *        be added.
 *     all other properties are added to the prototype.
 * @return {!Function} The class constructor.
 */
goog.defineClass = function(superClass, def) {
  // TODO(johnlenz): consider making the superClass an optional parameter.
  var constructor = def.constructor;
  var statics = def.statics;
  // Wrap the constructor prior to setting up the prototype and static methods.
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error('cannot instantiate an interface (no constructor defined).');
    };
  }

  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }

  // Remove all the properties that should not be copied to the prototype.
  delete def.constructor;
  delete def.statics;

  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }

  return cls;
};


/**
 * @typedef {{
 *   constructor: (!Function|undefined),
 *   statics: (Object|undefined|function(Function):void)
 * }}
 * @suppress {missingProvide}
 */
goog.defineClass.ClassDescriptor;


/**
 * @define {boolean} Whether the instances returned by goog.defineClass should
 *     be sealed when possible.
 *
 * When sealing is disabled the constructor function will not be wrapped by
 * goog.defineClass, making it incompatible with ES6 class methods.
 */
goog.define('goog.defineClass.SEAL_CLASS_INSTANCES', goog.DEBUG);


/**
 * If goog.defineClass.SEAL_CLASS_INSTANCES is enabled and Object.seal is
 * defined, this function will wrap the constructor in a function that seals the
 * results of the provided constructor function.
 *
 * @param {!Function} ctr The constructor whose results maybe be sealed.
 * @param {Function} superClass The superclass constructor.
 * @return {!Function} The replacement constructor.
 * @private
 */
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    // Do now wrap the constructor when sealing is disabled. Angular code
    // depends on this for injection to work properly.
    return ctr;
  }

  // Compute whether the constructor is sealable at definition time, rather
  // than when the instance is being constructed.
  var superclassSealable = !goog.defineClass.isUnsealable_(superClass);

  /**
   * @this {Object}
   * @return {?}
   */
  var wrappedCtr = function() {
    // Don't seal an instance of a subclass when it calls the constructor of
    // its super class as there is most likely still setup to do.
    var instance = ctr.apply(this, arguments) || this;
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];

    if (this.constructor === wrappedCtr && superclassSealable &&
        Object.seal instanceof Function) {
      Object.seal(instance);
    }
    return instance;
  };

  return wrappedCtr;
};


/**
 * @param {Function} ctr The constructor to test.
 * @returns {boolean} Whether the constructor has been tagged as unsealable
 *     using goog.tagUnsealableClass.
 * @private
 */
goog.defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype &&
      ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};


// TODO(johnlenz): share these values with the goog.object
/**
 * The names of the fields that are defined on Object.prototype.
 * @type {!Array<string>}
 * @private
 * @const
 */
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = [
  'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
  'toLocaleString', 'toString', 'valueOf'
];


// TODO(johnlenz): share this function with the goog.object
/**
 * @param {!Object} target The object to add properties to.
 * @param {!Object} source The object to copy properties from.
 * @private
 */
goog.defineClass.applyProperties_ = function(target, source) {
  // TODO(johnlenz): update this to support ES5 getters/setters

  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  // For IE the for-in-loop does not contain any properties that are not
  // enumerable on the prototype object (for example isPrototypeOf from
  // Object.prototype) and it will also not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
  for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};


/**
 * Sealing classes breaks the older idiom of assigning properties on the
 * prototype rather than in the constructor. As such, goog.defineClass
 * must not seal subclasses of these old-style classes until they are fixed.
 * Until then, this marks a class as "broken", instructing defineClass
 * not to seal subclasses.
 * @param {!Function} ctr The legacy constructor to tag as unsealable.
 */
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};


/**
 * Name for unsealable tag property.
 * @const @private {string}
 */
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable';

goog.provide('ol');


/**
 * Constants defined with the define tag cannot be changed in application
 * code, but can be set at compile time.
 * Some reduce the size of the build in advanced compile mode.
 */


/**
 * @define {boolean} Assume touch.  Default is `false`.
 */
ol.ASSUME_TOUCH = false;


/**
 * TODO: rename this to something having to do with tile grids
 * see https://github.com/openlayers/ol3/issues/2076
 * @define {number} Default maximum zoom for default tile grids.
 */
ol.DEFAULT_MAX_ZOOM = 42;


/**
 * @define {number} Default min zoom level for the map view.  Default is `0`.
 */
ol.DEFAULT_MIN_ZOOM = 0;


/**
 * @define {number} Default maximum allowed threshold  (in pixels) for
 *     reprojection triangulation. Default is `0.5`.
 */
ol.DEFAULT_RASTER_REPROJECTION_ERROR_THRESHOLD = 0.5;


/**
 * @define {number} Default tile size.
 */
ol.DEFAULT_TILE_SIZE = 256;


/**
 * @define {string} Default WMS version.
 */
ol.DEFAULT_WMS_VERSION = '1.3.0';


/**
 * @define {number} Hysteresis pixels.
 */
ol.DRAG_BOX_HYSTERESIS_PIXELS = 8;


/**
 * @define {boolean} Enable the Canvas renderer.  Default is `true`. Setting
 *     this to false at compile time in advanced mode removes all code
 *     supporting the Canvas renderer from the build.
 */
ol.ENABLE_CANVAS = true;


/**
 * @define {boolean} Enable the DOM renderer (used as a fallback where Canvas is
 *     not available).  Default is `true`. Setting this to false at compile time
 *     in advanced mode removes all code supporting the DOM renderer from the
 *     build.
 */
ol.ENABLE_DOM = true;


/**
 * @define {boolean} Enable rendering of ol.layer.Image based layers.  Default
 *     is `true`. Setting this to false at compile time in advanced mode removes
 *     all code supporting Image layers from the build.
 */
ol.ENABLE_IMAGE = true;


/**
 * @define {boolean} Enable Closure named colors (`goog.color.names`).
 *     Enabling these colors adds about 3KB uncompressed / 1.5KB compressed to
 *     the final build size.  Default is `false`. This setting has no effect
 *     with Canvas renderer, which uses its own names, whether this is true or
 *     false.
 */
ol.ENABLE_NAMED_COLORS = false;


/**
 * @define {boolean} Enable integration with the Proj4js library.  Default is
 *     `true`.
 */
ol.ENABLE_PROJ4JS = true;


/**
 * @define {boolean} Enable automatic reprojection of raster sources. Default is
 *     `true`.
 */
ol.ENABLE_RASTER_REPROJECTION = true;


/**
 * @define {boolean} Enable rendering of ol.layer.Tile based layers.  Default is
 *     `true`. Setting this to false at compile time in advanced mode removes
 *     all code supporting Tile layers from the build.
 */
ol.ENABLE_TILE = true;


/**
 * @define {boolean} Enable rendering of ol.layer.Vector based layers.  Default
 *     is `true`. Setting this to false at compile time in advanced mode removes
 *     all code supporting Vector layers from the build.
 */
ol.ENABLE_VECTOR = true;


/**
 * @define {boolean} Enable rendering of ol.layer.VectorTile based layers.
 *     Default is `true`. Setting this to false at compile time in advanced mode
 *     removes all code supporting VectorTile layers from the build.
 */
ol.ENABLE_VECTOR_TILE = true;


/**
 * @define {boolean} Enable the WebGL renderer.  Default is `true`. Setting
 *     this to false at compile time in advanced mode removes all code
 *     supporting the WebGL renderer from the build.
 */
ol.ENABLE_WEBGL = true;


/**
 * @define {number} The size in pixels of the first atlas image. Default is
 * `256`.
 */
ol.INITIAL_ATLAS_SIZE = 256;


/**
 * @define {number} The maximum size in pixels of atlas images. Default is
 * `-1`, meaning it is not used (and `ol.WEBGL_MAX_TEXTURE_SIZE` is
 * used instead).
 */
ol.MAX_ATLAS_SIZE = -1;


/**
 * @define {number} Maximum mouse wheel delta.
 */
ol.MOUSEWHEELZOOM_MAXDELTA = 1;


/**
 * @define {number} Mouse wheel timeout duration.
 */
ol.MOUSEWHEELZOOM_TIMEOUT_DURATION = 80;


/**
 * @define {number} Maximum width and/or height extent ratio that determines
 * when the overview map should be zoomed out.
 */
ol.OVERVIEWMAP_MAX_RATIO = 0.75;


/**
 * @define {number} Minimum width and/or height extent ratio that determines
 * when the overview map should be zoomed in.
 */
ol.OVERVIEWMAP_MIN_RATIO = 0.1;


/**
 * @define {number} Maximum number of source tiles for raster reprojection of
 *     a single tile.
 *     If too many source tiles are determined to be loaded to create a single
 *     reprojected tile the browser can become unresponsive or even crash.
 *     This can happen if the developer defines projections improperly and/or
 *     with unlimited extents.
 *     If too many tiles are required, no tiles are loaded and
 *     `ol.TileState.ERROR` state is set. Default is `100`.
 */
ol.RASTER_REPROJECTION_MAX_SOURCE_TILES = 100;


/**
 * @define {number} Maximum number of subdivision steps during raster
 *     reprojection triangulation. Prevents high memory usage and large
 *     number of proj4 calls (for certain transformations and areas).
 *     At most `2*(2^this)` triangles are created for each triangulated
 *     extent (tile/image). Default is `10`.
 */
ol.RASTER_REPROJECTION_MAX_SUBDIVISION = 10;


/**
 * @define {number} Maximum allowed size of triangle relative to world width.
 *     When transforming corners of world extent between certain projections,
 *     the resulting triangulation seems to have zero error and no subdivision
 *     is performed.
 *     If the triangle width is more than this (relative to world width; 0-1),
 *     subdivison is forced (up to `ol.RASTER_REPROJECTION_MAX_SUBDIVISION`).
 *     Default is `0.25`.
 */
ol.RASTER_REPROJECTION_MAX_TRIANGLE_WIDTH = 0.25;


/**
 * @define {number} Tolerance for geometry simplification in device pixels.
 */
ol.SIMPLIFY_TOLERANCE = 0.5;


/**
 * @define {number} Texture cache high water mark.
 */
ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK = 1024;


/**
 * The maximum supported WebGL texture size in pixels. If WebGL is not
 * supported, the value is set to `undefined`.
 * @const
 * @type {number|undefined}
 */
ol.WEBGL_MAX_TEXTURE_SIZE; // value is set in `ol.has`


/**
 * List of supported WebGL extensions.
 * @const
 * @type {Array.<string>}
 */
ol.WEBGL_EXTENSIONS; // value is set in `ol.has`


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 *
 *     function ParentClass(a, b) { }
 *     ParentClass.prototype.foo = function(a) { }
 *
 *     function ChildClass(a, b, c) {
 *       // Call parent constructor
 *       ParentClass.call(this, a, b);
 *     }
 *     ol.inherits(ChildClass, ParentClass);
 *
 *     var child = new ChildClass('a', 'b', 'see');
 *     child.foo(); // This works.
 *
 * @param {!Function} childCtor Child constructor.
 * @param {!Function} parentCtor Parent constructor.
 * @function
 * @api
 */
ol.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = Object.create(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
};


/**
 * A reusable function, used e.g. as a default for callbacks.
 *
 * @return {undefined} Nothing.
 */
ol.nullFunction = function() {};


ol.global = Function('return this')();

// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Provides a base class for custom Error objects such that the
 * stack is correctly maintained.
 *
 * You should never need to throw goog.debug.Error(msg) directly, Error(msg) is
 * sufficient.
 *
 */

goog.provide('goog.debug.Error');



/**
 * Base class for custom error objects.
 * @param {*=} opt_msg The message associated with the error.
 * @constructor
 * @extends {Error}
 */
goog.debug.Error = function(opt_msg) {

  // Attempt to ensure there is a stack trace.
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = new Error().stack;
    if (stack) {
      this.stack = stack;
    }
  }

  if (opt_msg) {
    this.message = String(opt_msg);
  }

  /**
   * Whether to report this error to the server. Setting this to false will
   * cause the error reporter to not report the error back to the server,
   * which can be useful if the client knows that the error has already been
   * logged on the server.
   * @type {boolean}
   */
  this.reportErrorToServer = true;
};
goog.inherits(goog.debug.Error, Error);


/** @override */
goog.debug.Error.prototype.name = 'CustomError';

// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Definition of goog.dom.NodeType.
 */

goog.provide('goog.dom.NodeType');


/**
 * Constants for the nodeType attribute in the Node interface.
 *
 * These constants match those specified in the Node interface. These are
 * usually present on the Node object in recent browsers, but not in older
 * browsers (specifically, early IEs) and thus are given here.
 *
 * In some browsers (early IEs), these are not defined on the Node object,
 * so they are provided here.
 *
 * See http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247
 * @enum {number}
 */
goog.dom.NodeType = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  CDATA_SECTION: 4,
  ENTITY_REFERENCE: 5,
  ENTITY: 6,
  PROCESSING_INSTRUCTION: 7,
  COMMENT: 8,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
  DOCUMENT_FRAGMENT: 11,
  NOTATION: 12
};

// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utilities for string manipulation.
 * @author arv@google.com (Erik Arvidsson)
 */


/**
 * Namespace for string utilities
 */
goog.provide('goog.string');
goog.provide('goog.string.Unicode');


/**
 * @define {boolean} Enables HTML escaping of lowercase letter "e" which helps
 * with detection of double-escaping as this letter is frequently used.
 */
goog.define('goog.string.DETECT_DOUBLE_ESCAPING', false);


/**
 * @define {boolean} Whether to force non-dom html unescaping.
 */
goog.define('goog.string.FORCE_NON_DOM_HTML_UNESCAPING', false);


/**
 * Common Unicode string characters.
 * @enum {string}
 */
goog.string.Unicode = {
  NBSP: '\xa0'
};


/**
 * Fast prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix A string to look for at the start of {@code str}.
 * @return {boolean} True if {@code str} begins with {@code prefix}.
 */
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};


/**
 * Fast suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of {@code str}.
 * @return {boolean} True if {@code str} ends with {@code suffix}.
 */
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};


/**
 * Case-insensitive prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix  A string to look for at the end of {@code str}.
 * @return {boolean} True if {@code str} begins with {@code prefix} (ignoring
 *     case).
 */
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(
             prefix, str.substr(0, prefix.length)) == 0;
};


/**
 * Case-insensitive suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of {@code str}.
 * @return {boolean} True if {@code str} ends with {@code suffix} (ignoring
 *     case).
 */
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(
             suffix, str.substr(str.length - suffix.length, suffix.length)) ==
      0;
};


/**
 * Case-insensitive equality checker.
 * @param {string} str1 First string to check.
 * @param {string} str2 Second string to check.
 * @return {boolean} True if {@code str1} and {@code str2} are the same string,
 *     ignoring case.
 */
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};


/**
 * Does simple python-style string substitution.
 * subs("foo%s hot%s", "bar", "dog") becomes "foobar hotdog".
 * @param {string} str The string containing the pattern.
 * @param {...*} var_args The items to substitute into the pattern.
 * @return {string} A copy of {@code str} in which each occurrence of
 *     {@code %s} has been replaced an argument from {@code var_args}.
 */
goog.string.subs = function(str, var_args) {
  var splitParts = str.split('%s');
  var returnString = '';

  var subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length &&
         // Replace up to the last split part. We are inserting in the
         // positions between split parts.
         splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }

  return returnString + splitParts.join('%s');  // Join unused '%s'
};


/**
 * Converts multiple whitespace chars (spaces, non-breaking-spaces, new lines
 * and tabs) to a single space, and strips leading and trailing whitespace.
 * @param {string} str Input string.
 * @return {string} A copy of {@code str} with collapsed whitespace.
 */
goog.string.collapseWhitespace = function(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
};


/**
 * Checks if a string is empty or contains only whitespaces.
 * @param {string} str The string to check.
 * @return {boolean} Whether {@code str} is empty or whitespace only.
 */
goog.string.isEmptyOrWhitespace = function(str) {
  // testing length == 0 first is actually slower in all browsers (about the
  // same in Opera).
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return /^[\s\xa0]*$/.test(str);
};


/**
 * Checks if a string is empty.
 * @param {string} str The string to check.
 * @return {boolean} Whether {@code str} is empty.
 */
goog.string.isEmptyString = function(str) {
  return str.length == 0;
};


/**
 * Checks if a string is empty or contains only whitespaces.
 *
 * TODO(user): Deprecate this when clients have been switched over to
 * goog.string.isEmptyOrWhitespace.
 *
 * @param {string} str The string to check.
 * @return {boolean} Whether {@code str} is empty or whitespace only.
 */
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;


/**
 * Checks if a string is null, undefined, empty or contains only whitespaces.
 * @param {*} str The string to check.
 * @return {boolean} Whether {@code str} is null, undefined, empty, or
 *     whitespace only.
 * @deprecated Use goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str))
 *     instead.
 */
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};


/**
 * Checks if a string is null, undefined, empty or contains only whitespaces.
 *
 * TODO(user): Deprecate this when clients have been switched over to
 * goog.string.isEmptyOrWhitespaceSafe.
 *
 * @param {*} str The string to check.
 * @return {boolean} Whether {@code str} is null, undefined, empty, or
 *     whitespace only.
 */
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;


/**
 * Checks if a string is all breaking whitespace.
 * @param {string} str The string to check.
 * @return {boolean} Whether the string is all breaking whitespace.
 */
goog.string.isBreakingWhitespace = function(str) {
  return !/[^\t\n\r ]/.test(str);
};


/**
 * Checks if a string contains all letters.
 * @param {string} str string to check.
 * @return {boolean} True if {@code str} consists entirely of letters.
 */
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
};


/**
 * Checks if a string contains only numbers.
 * @param {*} str string to check. If not a string, it will be
 *     casted to one.
 * @return {boolean} True if {@code str} is numeric.
 */
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
};


/**
 * Checks if a string contains only numbers or letters.
 * @param {string} str string to check.
 * @return {boolean} True if {@code str} is alphanumeric.
 */
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};


/**
 * Checks if a character is a space character.
 * @param {string} ch Character to check.
 * @return {boolean} True if {@code ch} is a space.
 */
goog.string.isSpace = function(ch) {
  return ch == ' ';
};


/**
 * Checks if a character is a valid unicode character.
 * @param {string} ch Character to check.
 * @return {boolean} True if {@code ch} is a valid unicode character.
 */
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= ' ' && ch <= '~' ||
      ch >= '\u0080' && ch <= '\uFFFD';
};


/**
 * Takes a string and replaces newlines with a space. Multiple lines are
 * replaced with a single space.
 * @param {string} str The string from which to strip newlines.
 * @return {string} A copy of {@code str} stripped of newlines.
 */
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, ' ');
};


/**
 * Replaces Windows and Mac new lines with unix style: \r or \r\n with \n.
 * @param {string} str The string to in which to canonicalize newlines.
 * @return {string} {@code str} A copy of {@code} with canonicalized newlines.
 */
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, '\n');
};


/**
 * Normalizes whitespace in a string, replacing all whitespace chars with
 * a space.
 * @param {string} str The string in which to normalize whitespace.
 * @return {string} A copy of {@code str} with all whitespace normalized.
 */
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, ' ');
};


/**
 * Normalizes spaces in a string, replacing all consecutive spaces and tabs
 * with a single space. Replaces non-breaking space with a space.
 * @param {string} str The string in which to normalize spaces.
 * @return {string} A copy of {@code str} with all consecutive spaces and tabs
 *    replaced with a single space.
 */
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, ' ');
};


/**
 * Removes the breaking spaces from the left and right of the string and
 * collapses the sequences of breaking spaces in the middle into single spaces.
 * The original and the result strings render the same way in HTML.
 * @param {string} str A string in which to collapse spaces.
 * @return {string} Copy of the string with normalized breaking spaces.
 */
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, ' ')
      .replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, '');
};


/**
 * Trims white spaces to the left and right of a string.
 * @param {string} str The string to trim.
 * @return {string} A trimmed copy of {@code str}.
 */
goog.string.trim =
    (goog.TRUSTED_SITE && String.prototype.trim) ? function(str) {
      return str.trim();
    } : function(str) {
      // Since IE doesn't include non-breaking-space (0xa0) in their \s
      // character class (as required by section 7.2 of the ECMAScript spec),
      // we explicitly include it in the regexp to enforce consistent
      // cross-browser behavior.
      return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
    };


/**
 * Trims whitespaces at the left end of a string.
 * @param {string} str The string to left trim.
 * @return {string} A trimmed copy of {@code str}.
 */
goog.string.trimLeft = function(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/^[\s\xa0]+/, '');
};


/**
 * Trims whitespaces at the right end of a string.
 * @param {string} str The string to right trim.
 * @return {string} A trimmed copy of {@code str}.
 */
goog.string.trimRight = function(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/[\s\xa0]+$/, '');
};


/**
 * A string comparator that ignores case.
 * -1 = str1 less than str2
 *  0 = str1 equals str2
 *  1 = str1 greater than str2
 *
 * @param {string} str1 The string to compare.
 * @param {string} str2 The string to compare {@code str1} to.
 * @return {number} The comparator result, as described above.
 */
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();

  if (test1 < test2) {
    return -1;
  } else if (test1 == test2) {
    return 0;
  } else {
    return 1;
  }
};


/**
 * Compares two strings interpreting their numeric substrings as numbers.
 *
 * @param {string} str1 First string.
 * @param {string} str2 Second string.
 * @param {!RegExp} tokenizerRegExp Splits a string into substrings of
 *     non-negative integers, non-numeric characters and optionally fractional
 *     numbers starting with a decimal point.
 * @return {number} Negative if str1 < str2, 0 is str1 == str2, positive if
 *     str1 > str2.
 * @private
 */
goog.string.numberAwareCompare_ = function(str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }

  // Using match to split the entire string ahead of time turns out to be faster
  // for most inputs than using RegExp.exec or iterating over each character.
  var tokens1 = str1.toLowerCase().match(tokenizerRegExp);
  var tokens2 = str2.toLowerCase().match(tokenizerRegExp);

  var count = Math.min(tokens1.length, tokens2.length);

  for (var i = 0; i < count; i++) {
    var a = tokens1[i];
    var b = tokens2[i];

    // Compare pairs of tokens, returning if one token sorts before the other.
    if (a != b) {
      // Only if both tokens are integers is a special comparison required.
      // Decimal numbers are sorted as strings (e.g., '.09' < '.1').
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }

  // If one string is a substring of the other, the shorter string sorts first.
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }

  // The two strings must be equivalent except for case (perfect equality is
  // tested at the head of the function.) Revert to default ASCII string
  // comparison to stabilize the sort.
  return str1 < str2 ? -1 : 1;
};


/**
 * String comparison function that handles non-negative integer numbers in a
 * way humans might expect. Using this function, the string 'File 2.jpg' sorts
 * before 'File 10.jpg', and 'Version 1.9' before 'Version 1.10'. The comparison
 * is mostly case-insensitive, though strings that are identical except for case
 * are sorted with the upper-case strings before lower-case.
 *
 * This comparison function is up to 50x slower than either the default or the
 * case-insensitive compare. It should not be used in time-critical code, but
 * should be fast enough to sort several hundred short strings (like filenames)
 * with a reasonable delay.
 *
 * @param {string} str1 The string to compare in a numerically sensitive way.
 * @param {string} str2 The string to compare {@code str1} to.
 * @return {number} less than 0 if str1 < str2, 0 if str1 == str2, greater than
 *     0 if str1 > str2.
 */
goog.string.intAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\D+/g);
};


/**
 * String comparison function that handles non-negative integer and fractional
 * numbers in a way humans might expect. Using this function, the string
 * 'File 2.jpg' sorts before 'File 10.jpg', and '3.14' before '3.2'. Equivalent
 * to {@link goog.string.intAwareCompare} apart from the way how it interprets
 * dots.
 *
 * @param {string} str1 The string to compare in a numerically sensitive way.
 * @param {string} str2 The string to compare {@code str1} to.
 * @return {number} less than 0 if str1 < str2, 0 if str1 == str2, greater than
 *     0 if str1 > str2.
 */
goog.string.floatAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g);
};


/**
 * Alias for {@link goog.string.floatAwareCompare}.
 *
 * @param {string} str1
 * @param {string} str2
 * @return {number}
 */
goog.string.numerateCompare = goog.string.floatAwareCompare;


/**
 * URL-encodes a string
 * @param {*} str The string to url-encode.
 * @return {string} An encoded copy of {@code str} that is safe for urls.
 *     Note that '#', ':', and other characters used to delimit portions
 *     of URLs *will* be encoded.
 */
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};


/**
 * URL-decodes the string. We need to specially handle '+'s because
 * the javascript library doesn't convert them to spaces.
 * @param {string} str The string to url decode.
 * @return {string} The decoded {@code str}.
 */
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, ' '));
};


/**
 * Converts \n to <br>s or <br />s.
 * @param {string} str The string in which to convert newlines.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} A copy of {@code str} with converted newlines.
 */
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>');
};


/**
 * Escapes double quote '"' and single quote '\'' characters in addition to
 * '&', '<', and '>' so that a string can be included in an HTML tag attribute
 * value within double or single quotes.
 *
 * It should be noted that > doesn't need to be escaped for the HTML or XML to
 * be valid, but it has been decided to escape it for consistency with other
 * implementations.
 *
 * With goog.string.DETECT_DOUBLE_ESCAPING, this function escapes also the
 * lowercase letter "e".
 *
 * NOTE(user):
 * HtmlEscape is often called during the generation of large blocks of HTML.
 * Using statics for the regular expressions and strings is an optimization
 * that can more than half the amount of time IE spends in this function for
 * large apps, since strings and regexes both contribute to GC allocations.
 *
 * Testing for the presence of a character before escaping increases the number
 * of function calls, but actually provides a speed increase for the average
 * case -- since the average case often doesn't require the escaping of all 4
 * characters and indexOf() is much cheaper than replace().
 * The worst case does suffer slightly from the additional calls, therefore the
 * opt_isLikelyToContainHtmlChars option has been included for situations
 * where all 4 HTML entities are very likely to be present and need escaping.
 *
 * Some benchmarks (times tended to fluctuate +-0.05ms):
 *                                     FireFox                     IE6
 * (no chars / average (mix of cases) / all 4 chars)
 * no checks                     0.13 / 0.22 / 0.22         0.23 / 0.53 / 0.80
 * indexOf                       0.08 / 0.17 / 0.26         0.22 / 0.54 / 0.84
 * indexOf + re test             0.07 / 0.17 / 0.28         0.19 / 0.50 / 0.85
 *
 * An additional advantage of checking if replace actually needs to be called
 * is a reduction in the number of object allocations, so as the size of the
 * application grows the difference between the various methods would increase.
 *
 * @param {string} str string to be escaped.
 * @param {boolean=} opt_isLikelyToContainHtmlChars Don't perform a check to see
 *     if the character needs replacing - use this option if you expect each of
 *     the characters to appear often. Leave false if you expect few html
 *     characters to occur in your strings, such as if you are escaping HTML.
 * @return {string} An escaped copy of {@code str}.
 */
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {

  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, '&amp;')
              .replace(goog.string.LT_RE_, '&lt;')
              .replace(goog.string.GT_RE_, '&gt;')
              .replace(goog.string.QUOT_RE_, '&quot;')
              .replace(goog.string.SINGLE_QUOTE_RE_, '&#39;')
              .replace(goog.string.NULL_RE_, '&#0;');
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, '&#101;');
    }
    return str;

  } else {
    // quick test helps in the case when there are no chars to replace, in
    // worst case this makes barely a difference to the time taken
    if (!goog.string.ALL_RE_.test(str)) return str;

    // str.indexOf is faster than regex.test in this case
    if (str.indexOf('&') != -1) {
      str = str.replace(goog.string.AMP_RE_, '&amp;');
    }
    if (str.indexOf('<') != -1) {
      str = str.replace(goog.string.LT_RE_, '&lt;');
    }
    if (str.indexOf('>') != -1) {
      str = str.replace(goog.string.GT_RE_, '&gt;');
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, '&quot;');
    }
    if (str.indexOf('\'') != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, '&#39;');
    }
    if (str.indexOf('\x00') != -1) {
      str = str.replace(goog.string.NULL_RE_, '&#0;');
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf('e') != -1) {
      str = str.replace(goog.string.E_RE_, '&#101;');
    }
    return str;
  }
};


/**
 * Regular expression that matches an ampersand, for use in escaping.
 * @const {!RegExp}
 * @private
 */
goog.string.AMP_RE_ = /&/g;


/**
 * Regular expression that matches a less than sign, for use in escaping.
 * @const {!RegExp}
 * @private
 */
goog.string.LT_RE_ = /</g;


/**
 * Regular expression that matches a greater than sign, for use in escaping.
 * @const {!RegExp}
 * @private
 */
goog.string.GT_RE_ = />/g;


/**
 * Regular expression that matches a double quote, for use in escaping.
 * @const {!RegExp}
 * @private
 */
goog.string.QUOT_RE_ = /"/g;


/**
 * Regular expression that matches a single quote, for use in escaping.
 * @const {!RegExp}
 * @private
 */
goog.string.SINGLE_QUOTE_RE_ = /'/g;


/**
 * Regular expression that matches null character, for use in escaping.
 * @const {!RegExp}
 * @private
 */
goog.string.NULL_RE_ = /\x00/g;


/**
 * Regular expression that matches a lowercase letter "e", for use in escaping.
 * @const {!RegExp}
 * @private
 */
goog.string.E_RE_ = /e/g;


/**
 * Regular expression that matches any character that needs to be escaped.
 * @const {!RegExp}
 * @private
 */
goog.string.ALL_RE_ =
    (goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/);


/**
 * Unescapes an HTML string.
 *
 * @param {string} str The string to unescape.
 * @return {string} An unescaped copy of {@code str}.
 */
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, '&')) {
    // We are careful not to use a DOM if we do not have one or we explicitly
    // requested non-DOM html unescaping.
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING &&
        'document' in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      // Fall back on pure XML entities
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};


/**
 * Unescapes a HTML string using the provided document.
 *
 * @param {string} str The string to unescape.
 * @param {!Document} document A document to use in escaping the string.
 * @return {string} An unescaped copy of {@code str}.
 */
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, '&')) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};


/**
 * Unescapes an HTML string using a DOM to resolve non-XML, non-numeric
 * entities. This function is XSS-safe and whitespace-preserving.
 * @private
 * @param {string} str The string to unescape.
 * @param {Document=} opt_document An optional document to use for creating
 *     elements. If this is not specified then the default window.document
 *     will be used.
 * @return {string} The unescaped {@code str} string.
 */
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  /** @type {!Object<string, string>} */
  var seen = {'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"'};
  var div;
  if (opt_document) {
    div = opt_document.createElement('div');
  } else {
    div = goog.global.document.createElement('div');
  }
  // Match as many valid entity characters as possible. If the actual entity
  // happens to be shorter, it will still work as innerHTML will return the
  // trailing characters unchanged. Since the entity characters do not include
  // open angle bracket, there is no chance of XSS from the innerHTML use.
  // Since no whitespace is passed to innerHTML, whitespace is preserved.
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    // Check for cached entity.
    var value = seen[s];
    if (value) {
      return value;
    }
    // Check for numeric entity.
    if (entity.charAt(0) == '#') {
      // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex numbers.
      var n = Number('0' + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    // Fall back to innerHTML otherwise.
    if (!value) {
      // Append a non-entity character to avoid a bug in Webkit that parses
      // an invalid entity at the end of innerHTML text as the empty string.
      div.innerHTML = s + ' ';
      // Then remove the trailing character from the result.
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    // Cache and return.
    return seen[s] = value;
  });
};


/**
 * Unescapes XML entities.
 * @private
 * @param {string} str The string to unescape.
 * @return {string} An unescaped copy of {@code str}.
 */
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch (entity) {
      case 'amp':
        return '&';
      case 'lt':
        return '<';
      case 'gt':
        return '>';
      case 'quot':
        return '"';
      default:
        if (entity.charAt(0) == '#') {
          // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex.
          var n = Number('0' + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        // For invalid entities we just return the entity
        return s;
    }
  });
};


/**
 * Regular expression that matches an HTML entity.
 * See also HTML5: Tokenization / Tokenizing character references.
 * @private
 * @type {!RegExp}
 */
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;


/**
 * Do escaping of whitespace to preserve spatial formatting. We use character
 * entity #160 to make it safer for xml.
 * @param {string} str The string in which to escape whitespace.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} An escaped copy of {@code str}.
 */
goog.string.whitespaceEscape = function(str, opt_xml) {
  // This doesn't use goog.string.preserveSpaces for backwards compatibility.
  return goog.string.newLineToBr(str.replace(/  /g, ' &#160;'), opt_xml);
};


/**
 * Preserve spaces that would be otherwise collapsed in HTML by replacing them
 * with non-breaking space Unicode characters.
 * @param {string} str The string in which to preserve whitespace.
 * @return {string} A copy of {@code str} with preserved whitespace.
 */
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, '$1' + goog.string.Unicode.NBSP);
};


/**
 * Strip quote characters around a string.  The second argument is a string of
 * characters to treat as quotes.  This can be a single character or a string of
 * multiple character and in that case each of those are treated as possible
 * quote characters. For example:
 *
 * <pre>
 * goog.string.stripQuotes('"abc"', '"`') --> 'abc'
 * goog.string.stripQuotes('`abc`', '"`') --> 'abc'
 * </pre>
 *
 * @param {string} str The string to strip.
 * @param {string} quoteChars The quote characters to strip.
 * @return {string} A copy of {@code str} without the quotes.
 */
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0; i < length; i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};


/**
 * Truncates a string to a certain length and adds '...' if necessary.  The
 * length also accounts for the ellipsis, so a maximum length of 10 and a string
 * 'Hello World!' produces 'Hello W...'.
 * @param {string} str The string to truncate.
 * @param {number} chars Max number of characters.
 * @param {boolean=} opt_protectEscapedCharacters Whether to protect escaped
 *     characters from being cut off in the middle.
 * @return {string} The truncated {@code str} string.
 */
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }

  if (str.length > chars) {
    str = str.substring(0, chars - 3) + '...';
  }

  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }

  return str;
};


/**
 * Truncate a string in the middle, adding "..." if necessary,
 * and favoring the beginning of the string.
 * @param {string} str The string to truncate the middle of.
 * @param {number} chars Max number of characters.
 * @param {boolean=} opt_protectEscapedCharacters Whether to protect escaped
 *     characters from being cutoff in the middle.
 * @param {number=} opt_trailingChars Optional number of trailing characters to
 *     leave at the end of the string, instead of truncating as close to the
 *     middle as possible.
 * @return {string} A truncated copy of {@code str}.
 */
goog.string.truncateMiddle = function(
    str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }

  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + '...' + str.substring(endPoint);
  } else if (str.length > chars) {
    // Favor the beginning of the string:
    var half = Math.floor(chars / 2);
    var endPos = str.length - half;
    half += chars % 2;
    str = str.substring(0, half) + '...' + str.substring(endPos);
  }

  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }

  return str;
};


/**
 * Special chars that need to be escaped for goog.string.quote.
 * @private {!Object<string, string>}
 */
goog.string.specialEscapeChars_ = {
  '\0': '\\0',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\x0B': '\\x0B',  // '\v' is not supported in JScript
  '"': '\\"',
  '\\': '\\\\',
  // To support the use case of embedding quoted strings inside of script
  // tags, we have to make sure HTML comments and opening/closing script tags do
  // not appear in the resulting string. The specific strings that must be
  // escaped are documented at:
  // http://www.w3.org/TR/html51/semantics.html#restrictions-for-contents-of-script-elements
  '<': '\x3c'
};


/**
 * Character mappings used internally for goog.string.escapeChar.
 * @private {!Object<string, string>}
 */
goog.string.jsEscapeCache_ = {
  '\'': '\\\''
};


/**
 * Encloses a string in double quotes and escapes characters so that the
 * string is a valid JS string. The resulting string is safe to embed in
 * `<script>` tags as "<" is escaped.
 * @param {string} s The string to quote.
 * @return {string} A copy of {@code s} surrounded by double quotes.
 */
goog.string.quote = function(s) {
  s = String(s);
  var sb = ['"'];
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    var cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] ||
        ((cc > 31 && cc < 127) ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join('');
};


/**
 * Takes a string and returns the escaped string for that character.
 * @param {string} str The string to escape.
 * @return {string} An escaped string representing {@code str}.
 */
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0; i < str.length; i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join('');
};


/**
 * Takes a character and returns the escaped string for that character. For
 * example escapeChar(String.fromCharCode(15)) -> "\\x0E".
 * @param {string} c The character to escape.
 * @return {string} An escaped string representing {@code c}.
 */
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }

  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }

  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    // tab is 9 but handled above
    if (cc < 256) {
      rv = '\\x';
      if (cc < 16 || cc > 256) {
        rv += '0';
      }
    } else {
      rv = '\\u';
      if (cc < 4096) {  // \u1000
        rv += '0';
      }
    }
    rv += cc.toString(16).toUpperCase();
  }

  return goog.string.jsEscapeCache_[c] = rv;
};


/**
 * Determines whether a string contains a substring.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether {@code str} contains {@code subString}.
 */
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};


/**
 * Determines whether a string contains a substring, ignoring case.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether {@code str} contains {@code subString}.
 */
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};


/**
 * Returns the non-overlapping occurrences of ss in s.
 * If either s or ss evalutes to false, then returns zero.
 * @param {string} s The string to look in.
 * @param {string} ss The string to look for.
 * @return {number} Number of occurrences of ss in s.
 */
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};


/**
 * Removes a substring of a specified length at a specific
 * index in a string.
 * @param {string} s The base string from which to remove.
 * @param {number} index The index at which to remove the substring.
 * @param {number} stringLength The length of the substring to remove.
 * @return {string} A copy of {@code s} with the substring removed or the full
 *     string if nothing is removed or the input is invalid.
 */
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  // If the index is greater or equal to 0 then remove substring
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) +
        s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};


/**
 *  Removes the first occurrence of a substring from a string.
 *  @param {string} s The base string from which to remove.
 *  @param {string} ss The string to remove.
 *  @return {string} A copy of {@code s} with {@code ss} removed or the full
 *      string if nothing is removed.
 */
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), '');
  return s.replace(re, '');
};


/**
 *  Removes all occurrences of a substring from a string.
 *  @param {string} s The base string from which to remove.
 *  @param {string} ss The string to remove.
 *  @return {string} A copy of {@code s} with {@code ss} removed or the full
 *      string if nothing is removed.
 */
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), 'g');
  return s.replace(re, '');
};


/**
 * Escapes characters in the string that are not safe to use in a RegExp.
 * @param {*} s The string to escape. If not a string, it will be casted
 *     to one.
 * @return {string} A RegExp safe, escaped copy of {@code s}.
 */
goog.string.regExpEscape = function(s) {
  return String(s)
      .replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
      .replace(/\x08/g, '\\x08');
};


/**
 * Repeats a string n times.
 * @param {string} string The string to repeat.
 * @param {number} length The number of times to repeat.
 * @return {string} A string containing {@code length} repetitions of
 *     {@code string}.
 */
goog.string.repeat = (String.prototype.repeat) ? function(string, length) {
  // The native method is over 100 times faster than the alternative.
  return string.repeat(length);
} : function(string, length) {
  return new Array(length + 1).join(string);
};


/**
 * Pads number to given length and optionally rounds it to a given precision.
 * For example:
 * <pre>padNumber(1.25, 2, 3) -> '01.250'
 * padNumber(1.25, 2) -> '01.25'
 * padNumber(1.25, 2, 1) -> '01.3'
 * padNumber(1.25, 0) -> '1.25'</pre>
 *
 * @param {number} num The number to pad.
 * @param {number} length The desired length.
 * @param {number=} opt_precision The desired precision.
 * @return {string} {@code num} as a string with the given options.
 */
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf('.');
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat('0', Math.max(0, length - index)) + s;
};


/**
 * Returns a string representation of the given object, with
 * null and undefined being returned as the empty string.
 *
 * @param {*} obj The object to convert.
 * @return {string} A string representation of the {@code obj}.
 */
goog.string.makeSafe = function(obj) {
  return obj == null ? '' : String(obj);
};


/**
 * Concatenates string expressions. This is useful
 * since some browsers are very inefficient when it comes to using plus to
 * concat strings. Be careful when using null and undefined here since
 * these will not be included in the result. If you need to represent these
 * be sure to cast the argument to a String first.
 * For example:
 * <pre>buildString('a', 'b', 'c', 'd') -> 'abcd'
 * buildString(null, undefined) -> ''
 * </pre>
 * @param {...*} var_args A list of strings to concatenate. If not a string,
 *     it will be casted to one.
 * @return {string} The concatenation of {@code var_args}.
 */
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, '');
};


/**
 * Returns a string with at least 64-bits of randomness.
 *
 * Doesn't trust Javascript's random function entirely. Uses a combination of
 * random and current timestamp, and then encodes the string in base-36 to
 * make it shorter.
 *
 * @return {string} A random string, e.g. sn1s7vb4gcic.
 */
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) +
      Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};


/**
 * Compares two version numbers.
 *
 * @param {string|number} version1 Version of first item.
 * @param {string|number} version2 Version of second item.
 *
 * @return {number}  1 if {@code version1} is higher.
 *                   0 if arguments are equal.
 *                  -1 if {@code version2} is higher.
 */
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  // Trim leading and trailing whitespace and split the versions into
  // subversions.
  var v1Subs = goog.string.trim(String(version1)).split('.');
  var v2Subs = goog.string.trim(String(version2)).split('.');
  var subCount = Math.max(v1Subs.length, v2Subs.length);

  // Iterate over the subversions, as long as they appear to be equivalent.
  for (var subIdx = 0; order == 0 && subIdx < subCount; subIdx++) {
    var v1Sub = v1Subs[subIdx] || '';
    var v2Sub = v2Subs[subIdx] || '';

    // Split the subversions into pairs of numbers and qualifiers (like 'b').
    // Two different RegExp objects are needed because they are both using
    // the 'g' flag.
    var v1CompParser = new RegExp('(\\d*)(\\D*)', 'g');
    var v2CompParser = new RegExp('(\\d*)(\\D*)', 'g');
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ['', '', ''];
      var v2Comp = v2CompParser.exec(v2Sub) || ['', '', ''];
      // Break if there are no more matches.
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }

      // Parse the numeric part of the subversion. A missing number is
      // equivalent to 0.
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);

      // Compare the subversion components. The number has the highest
      // precedence. Next, if the numbers are equal, a subversion without any
      // qualifier is always higher than a subversion with any qualifier. Next,
      // the qualifiers are compared as strings.
      order = goog.string.compareElements_(v1CompNum, v2CompNum) ||
          goog.string.compareElements_(
              v1Comp[2].length == 0, v2Comp[2].length == 0) ||
          goog.string.compareElements_(v1Comp[2], v2Comp[2]);
      // Stop as soon as an inequality is discovered.
    } while (order == 0);
  }

  return order;
};


/**
 * Compares elements of a version number.
 *
 * @param {string|number|boolean} left An element from a version number.
 * @param {string|number|boolean} right An element from a version number.
 *
 * @return {number}  1 if {@code left} is higher.
 *                   0 if arguments are equal.
 *                  -1 if {@code right} is higher.
 * @private
 */
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return -1;
  } else if (left > right) {
    return 1;
  }
  return 0;
};


/**
 * String hash function similar to java.lang.String.hashCode().
 * The hash code for a string is computed as
 * s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
 * where s[i] is the ith character of the string and n is the length of
 * the string. We mod the result to make it between 0 (inclusive) and 2^32
 * (exclusive).
 * @param {string} str A string.
 * @return {number} Hash value for {@code str}, between 0 (inclusive) and 2^32
 *  (exclusive). The empty string returns 0.
 */
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0; i < str.length; ++i) {
    // Normalize to 4 byte range, 0 ... 2^32.
    result = (31 * result + str.charCodeAt(i)) >>> 0;
  }
  return result;
};


/**
 * The most recent unique ID. |0 is equivalent to Math.floor in this case.
 * @type {number}
 * @private
 */
goog.string.uniqueStringCounter_ = Math.random() * 0x80000000 | 0;


/**
 * Generates and returns a string which is unique in the current document.
 * This is useful, for example, to create unique IDs for DOM elements.
 * @return {string} A unique id.
 */
goog.string.createUniqueString = function() {
  return 'goog_' + goog.string.uniqueStringCounter_++;
};


/**
 * Converts the supplied string to a number, which may be Infinity or NaN.
 * This function strips whitespace: (toNumber(' 123') === 123)
 * This function accepts scientific notation: (toNumber('1e1') === 10)
 *
 * This is better than Javascript's built-in conversions because, sadly:
 *     (Number(' ') === 0) and (parseFloat('123a') === 123)
 *
 * @param {string} str The string to convert.
 * @return {number} The number the supplied string represents, or NaN.
 */
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmptyOrWhitespace(str)) {
    return NaN;
  }
  return num;
};


/**
 * Returns whether the given string is lower camel case (e.g. "isFooBar").
 *
 * Note that this assumes the string is entirely letters.
 * @see http://en.wikipedia.org/wiki/CamelCase#Variations_and_synonyms
 *
 * @param {string} str String to test.
 * @return {boolean} Whether the string is lower camel case.
 */
goog.string.isLowerCamelCase = function(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};


/**
 * Returns whether the given string is upper camel case (e.g. "FooBarBaz").
 *
 * Note that this assumes the string is entirely letters.
 * @see http://en.wikipedia.org/wiki/CamelCase#Variations_and_synonyms
 *
 * @param {string} str String to test.
 * @return {boolean} Whether the string is upper camel case.
 */
goog.string.isUpperCamelCase = function(str) {
  return /^([A-Z][a-z]*)+$/.test(str);
};


/**
 * Converts a string from selector-case to camelCase (e.g. from
 * "multi-part-string" to "multiPartString"), useful for converting
 * CSS selectors and HTML dataset keys to their equivalent JS properties.
 * @param {string} str The string in selector-case form.
 * @return {string} The string in camelCase form.
 */
goog.string.toCamelCase = function(str) {
  return String(str).replace(
      /\-([a-z])/g, function(all, match) { return match.toUpperCase(); });
};


/**
 * Converts a string from camelCase to selector-case (e.g. from
 * "multiPartString" to "multi-part-string"), useful for converting JS
 * style and dataset properties to equivalent CSS selectors and HTML keys.
 * @param {string} str The string in camelCase form.
 * @return {string} The string in selector-case form.
 */
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
};


/**
 * Converts a string into TitleCase. First character of the string is always
 * capitalized in addition to the first letter of every subsequent word.
 * Words are delimited by one or more whitespaces by default. Custom delimiters
 * can optionally be specified to replace the default, which doesn't preserve
 * whitespace delimiters and instead must be explicitly included if needed.
 *
 * Default delimiter => " ":
 *    goog.string.toTitleCase('oneTwoThree')    => 'OneTwoThree'
 *    goog.string.toTitleCase('one two three')  => 'One Two Three'
 *    goog.string.toTitleCase('  one   two   ') => '  One   Two   '
 *    goog.string.toTitleCase('one_two_three')  => 'One_two_three'
 *    goog.string.toTitleCase('one-two-three')  => 'One-two-three'
 *
 * Custom delimiter => "_-.":
 *    goog.string.toTitleCase('oneTwoThree', '_-.')       => 'OneTwoThree'
 *    goog.string.toTitleCase('one two three', '_-.')     => 'One two three'
 *    goog.string.toTitleCase('  one   two   ', '_-.')    => '  one   two   '
 *    goog.string.toTitleCase('one_two_three', '_-.')     => 'One_Two_Three'
 *    goog.string.toTitleCase('one-two-three', '_-.')     => 'One-Two-Three'
 *    goog.string.toTitleCase('one...two...three', '_-.') => 'One...Two...Three'
 *    goog.string.toTitleCase('one. two. three', '_-.')   => 'One. two. three'
 *    goog.string.toTitleCase('one-two.three', '_-.')     => 'One-Two.Three'
 *
 * @param {string} str String value in camelCase form.
 * @param {string=} opt_delimiters Custom delimiter character set used to
 *      distinguish words in the string value. Each character represents a
 *      single delimiter. When provided, default whitespace delimiter is
 *      overridden and must be explicitly included if needed.
 * @return {string} String value in TitleCase form.
 */
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ?
      goog.string.regExpEscape(opt_delimiters) :
      '\\s';

  // For IE8, we need to prevent using an empty character set. Otherwise,
  // incorrect matching will occur.
  delimiters = delimiters ? '|[' + delimiters + ']+' : '';

  var regexp = new RegExp('(^' + delimiters + ')([a-z])', 'g');
  return str.replace(
      regexp, function(all, p1, p2) { return p1 + p2.toUpperCase(); });
};


/**
 * Capitalizes a string, i.e. converts the first letter to uppercase
 * and all other letters to lowercase, e.g.:
 *
 * goog.string.capitalize('one')     => 'One'
 * goog.string.capitalize('ONE')     => 'One'
 * goog.string.capitalize('one two') => 'One two'
 *
 * Note that this function does not trim initial whitespace.
 *
 * @param {string} str String value to capitalize.
 * @return {string} String value with first letter in uppercase.
 */
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() +
      String(str.substr(1)).toLowerCase();
};


/**
 * Parse a string in decimal or hexidecimal ('0xFFFF') form.
 *
 * To parse a particular radix, please use parseInt(string, radix) directly. See
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/parseInt
 *
 * This is a wrapper for the built-in parseInt function that will only parse
 * numbers as base 10 or base 16.  Some JS implementations assume strings
 * starting with "0" are intended to be octal. ES3 allowed but discouraged
 * this behavior. ES5 forbids it.  This function emulates the ES5 behavior.
 *
 * For more information, see Mozilla JS Reference: http://goo.gl/8RiFj
 *
 * @param {string|number|null|undefined} value The value to be parsed.
 * @return {number} The number, parsed. If the string failed to parse, this
 *     will be NaN.
 */
goog.string.parseInt = function(value) {
  // Force finite numbers to strings.
  if (isFinite(value)) {
    value = String(value);
  }

  if (goog.isString(value)) {
    // If the string starts with '0x' or '-0x', parse as hex.
    return /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }

  return NaN;
};


/**
 * Splits a string on a separator a limited number of times.
 *
 * This implementation is more similar to Python or Java, where the limit
 * parameter specifies the maximum number of splits rather than truncating
 * the number of results.
 *
 * See http://docs.python.org/2/library/stdtypes.html#str.split
 * See JavaDoc: http://goo.gl/F2AsY
 * See Mozilla reference: http://goo.gl/dZdZs
 *
 * @param {string} str String to split.
 * @param {string} separator The separator.
 * @param {number} limit The limit to the number of splits. The resulting array
 *     will have a maximum length of limit+1.  Negative numbers are the same
 *     as zero.
 * @return {!Array<string>} The string, split.
 */
goog.string.splitLimit = function(str, separator, limit) {
  var parts = str.split(separator);
  var returnVal = [];

  // Only continue doing this while we haven't hit the limit and we have
  // parts left.
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }

  // If there are remaining parts, append them to the end.
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }

  return returnVal;
};


/**
 * Finds the characters to the right of the last instance of any separator
 *
 * This function is similar to goog.string.path.baseName, except it can take a
 * list of characters to split the string on. It will return the rightmost
 * grouping of characters to the right of any separator as a left-to-right
 * oriented string.
 *
 * @see goog.string.path.baseName
 * @param {string} str The string
 * @param {string|!Array<string>} separators A list of separator characters
 * @return {string} The last part of the string with respect to the separators
 */
goog.string.lastComponent = function(str, separators) {
  if (!separators) {
    return str;
  } else if (typeof separators == 'string') {
    separators = [separators];
  }

  var lastSeparatorIndex = -1;
  for (var i = 0; i < separators.length; i++) {
    if (separators[i] == '') {
      continue;
    }
    var currentSeparatorIndex = str.lastIndexOf(separators[i]);
    if (currentSeparatorIndex > lastSeparatorIndex) {
      lastSeparatorIndex = currentSeparatorIndex;
    }
  }
  if (lastSeparatorIndex == -1) {
    return str;
  }
  return str.slice(lastSeparatorIndex + 1);
};


/**
 * Computes the Levenshtein edit distance between two strings.
 * @param {string} a
 * @param {string} b
 * @return {number} The edit distance between the two strings.
 */
goog.string.editDistance = function(a, b) {
  var v0 = [];
  var v1 = [];

  if (a == b) {
    return 0;
  }

  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }

  for (var i = 0; i < b.length + 1; i++) {
    v0[i] = i;
  }

  for (var i = 0; i < a.length; i++) {
    v1[0] = i + 1;

    for (var j = 0; j < b.length; j++) {
      var cost = Number(a[i] != b[j]);
      // Cost for the substring is the minimum of adding one character, removing
      // one character, or a swap.
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }

    for (var j = 0; j < v0.length; j++) {
      v0[j] = v1[j];
    }
  }

  return v1[b.length];
};

// Copyright 2008 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utilities to check the preconditions, postconditions and
 * invariants runtime.
 *
 * Methods in this package should be given special treatment by the compiler
 * for type-inference. For example, <code>goog.asserts.assert(foo)</code>
 * will restrict <code>foo</code> to a truthy value.
 *
 * The compiler has an option to disable asserts. So code like:
 * <code>
 * var x = goog.asserts.assert(foo()); goog.asserts.assert(bar());
 * </code>
 * will be transformed into:
 * <code>
 * var x = foo();
 * </code>
 * The compiler will leave in foo() (because its return value is used),
 * but it will remove bar() because it assumes it does not have side-effects.
 *
 * @author agrieve@google.com (Andrew Grieve)
 */

goog.provide('goog.asserts');
goog.provide('goog.asserts.AssertionError');

goog.require('goog.debug.Error');
goog.require('goog.dom.NodeType');
goog.require('goog.string');


/**
 * @define {boolean} Whether to strip out asserts or to leave them in.
 */
goog.define('goog.asserts.ENABLE_ASSERTS', goog.DEBUG);



/**
 * Error object for failed assertions.
 * @param {string} messagePattern The pattern that was used to form message.
 * @param {!Array<*>} messageArgs The items to substitute into the pattern.
 * @constructor
 * @extends {goog.debug.Error}
 * @final
 */
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  // Remove the messagePattern afterwards to avoid permanently modifying the
  // passed in array.
  messageArgs.shift();

  /**
   * The message pattern used to format the error message. Error handlers can
   * use this to uniquely identify the assertion.
   * @type {string}
   */
  this.messagePattern = messagePattern;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);


/** @override */
goog.asserts.AssertionError.prototype.name = 'AssertionError';


/**
 * The default error handler.
 * @param {!goog.asserts.AssertionError} e The exception to be handled.
 */
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};


/**
 * The handler responsible for throwing or logging assertion errors.
 * @private {function(!goog.asserts.AssertionError)}
 */
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;


/**
 * Throws an exception with the given message and "Assertion failed" prefixed
 * onto it.
 * @param {string} defaultMessage The message to use if givenMessage is empty.
 * @param {Array<*>} defaultArgs The substitution arguments for defaultMessage.
 * @param {string|undefined} givenMessage Message supplied by the caller.
 * @param {Array<*>} givenArgs The substitution arguments for givenMessage.
 * @throws {goog.asserts.AssertionError} When the value is not a number.
 * @private
 */
goog.asserts.doAssertFailure_ = function(
    defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = 'Assertion failed';
  if (givenMessage) {
    message += ': ' + givenMessage;
    var args = givenArgs;
  } else if (defaultMessage) {
    message += ': ' + defaultMessage;
    args = defaultArgs;
  }
  // The '' + works around an Opera 10 bug in the unit tests. Without it,
  // a stack trace is added to var message above. With this, a stack trace is
  // not added until this line (it causes the extra garbage to be added after
  // the assertion message instead of in the middle of it).
  var e = new goog.asserts.AssertionError('' + message, args || []);
  goog.asserts.errorHandler_(e);
};


/**
 * Sets a custom error handler that can be used to customize the behavior of
 * assertion failures, for example by turning all assertion failures into log
 * messages.
 * @param {function(!goog.asserts.AssertionError)} errorHandler
 */
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};


/**
 * Checks if the condition evaluates to true if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @template T
 * @param {T} condition The condition to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {T} The value of the condition.
 * @throws {goog.asserts.AssertionError} When the condition evaluates to false.
 */
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_(
        '', null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};


/**
 * Fails if goog.asserts.ENABLE_ASSERTS is true. This function is useful in case
 * when we want to add a check in the unreachable area like switch-case
 * statement:
 *
 * <pre>
 *  switch(type) {
 *    case FOO: doSomething(); break;
 *    case BAR: doSomethingElse(); break;
 *    default: goog.asserts.fail('Unrecognized type: ' + type);
 *      // We have only 2 types - "default:" section is unreachable code.
 *  }
 * </pre>
 *
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {goog.asserts.AssertionError} Failure.
 */
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(
        new goog.asserts.AssertionError(
            'Failure' + (opt_message ? ': ' + opt_message : ''),
            Array.prototype.slice.call(arguments, 1)));
  }
};


/**
 * Checks if the value is a number if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {number} The value, guaranteed to be a number when asserts enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a number.
 */
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_(
        'Expected number but got %s: %s.', [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {number} */ (value);
};


/**
 * Checks if the value is a string if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {string} The value, guaranteed to be a string when asserts enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a string.
 */
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_(
        'Expected string but got %s: %s.', [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {string} */ (value);
};


/**
 * Checks if the value is a function if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Function} The value, guaranteed to be a function when asserts
 *     enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a function.
 */
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_(
        'Expected function but got %s: %s.', [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Function} */ (value);
};


/**
 * Checks if the value is an Object if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Object} The value, guaranteed to be a non-null object.
 * @throws {goog.asserts.AssertionError} When the value is not an object.
 */
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_(
        'Expected object but got %s: %s.', [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Object} */ (value);
};


/**
 * Checks if the value is an Array if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Array<?>} The value, guaranteed to be a non-null array.
 * @throws {goog.asserts.AssertionError} When the value is not an array.
 */
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_(
        'Expected array but got %s: %s.', [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Array<?>} */ (value);
};


/**
 * Checks if the value is a boolean if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {boolean} The value, guaranteed to be a boolean when asserts are
 *     enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a boolean.
 */
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_(
        'Expected boolean but got %s: %s.', [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {boolean} */ (value);
};


/**
 * Checks if the value is a DOM Element if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Element} The value, likely to be a DOM Element when asserts are
 *     enabled.
 * @throws {goog.asserts.AssertionError} When the value is not an Element.
 */
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS &&
      (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_(
        'Expected Element but got %s: %s.', [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Element} */ (value);
};


/**
 * Checks if the value is an instance of the user-defined type if
 * goog.asserts.ENABLE_ASSERTS is true.
 *
 * The compiler may tighten the type returned by this function.
 *
 * @param {?} value The value to check.
 * @param {function(new: T, ...)} type A user-defined constructor.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {goog.asserts.AssertionError} When the value is not an instance of
 *     type.
 * @return {T}
 * @template T
 */
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_(
        'Expected instanceof %s but got %s.',
        [goog.asserts.getType_(type), goog.asserts.getType_(value)],
        opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};


/**
 * Checks that no enumerable keys are present in Object.prototype. Such keys
 * would break most code that use {@code for (var ... in ...)} loops.
 */
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + ' should not be enumerable in Object.prototype.');
  }
};


/**
 * Returns the type of a value. If a constructor is passed, and a suitable
 * string cannot be found, 'unknown type name' will be returned.
 * @param {*} value A constructor, object, or primitive.
 * @return {string} The best display name for the value, or 'unknown type name'.
 * @private
 */
goog.asserts.getType_ = function(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || 'unknown type name';
  } else if (value instanceof Object) {
    return value.constructor.displayName || value.constructor.name ||
        Object.prototype.toString.call(value);
  } else {
    return value === null ? 'null' : typeof value;
  }
};

goog.provide('ol.math');

goog.require('goog.asserts');


/**
 * Takes a number and clamps it to within the provided bounds.
 * @param {number} value The input number.
 * @param {number} min The minimum value to return.
 * @param {number} max The maximum value to return.
 * @return {number} The input number if it is within bounds, or the nearest
 *     number within the bounds.
 */
ol.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};


/**
 * Return the hyperbolic cosine of a given number. The method will use the
 * native `Math.cosh` function if it is available, otherwise the hyperbolic
 * cosine will be calculated via the reference implementation of the Mozilla
 * developer network.
 *
 * @param {number} x X.
 * @return {number} Hyperbolic cosine of x.
 */
ol.math.cosh = (function() {
  // Wrapped in a iife, to save the overhead of checking for the native
  // implementation on every invocation.
  var cosh;
  if ('cosh' in Math) {
    // The environment supports the native Math.cosh function, use it…
    cosh = Math.cosh;
  } else {
    // … else, use the reference implementation of MDN:
    cosh = function(x) {
      var y = Math.exp(x);
      return (y + 1 / y) / 2;
    };
  }
  return cosh;
}());


/**
 * @param {number} x X.
 * @return {number} The smallest power of two greater than or equal to x.
 */
ol.math.roundUpToPowerOfTwo = function(x) {
  goog.asserts.assert(0 < x, 'x should be larger than 0');
  return Math.pow(2, Math.ceil(Math.log(x) / Math.LN2));
};


/**
 * Returns the square of the closest distance between the point (x, y) and the
 * line segment (x1, y1) to (x2, y2).
 * @param {number} x X.
 * @param {number} y Y.
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
ol.math.squaredSegmentDistance = function(x, y, x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  if (dx !== 0 || dy !== 0) {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else if (t > 0) {
      x1 += dx * t;
      y1 += dy * t;
    }
  }
  return ol.math.squaredDistance(x, y, x1, y1);
};


/**
 * Returns the square of the distance between the points (x1, y1) and (x2, y2).
 * @param {number} x1 X1.
 * @param {number} y1 Y1.
 * @param {number} x2 X2.
 * @param {number} y2 Y2.
 * @return {number} Squared distance.
 */
ol.math.squaredDistance = function(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return dx * dx + dy * dy;
};


/**
 * Solves system of linear equations using Gaussian elimination method.
 *
 * @param {Array.<Array.<number>>} mat Augmented matrix (n x n + 1 column)
 *                                     in row-major order.
 * @return {Array.<number>} The resulting vector.
 */
ol.math.solveLinearSystem = function(mat) {
  var n = mat.length;

  if (goog.asserts.ENABLE_ASSERTS) {
    for (var row = 0; row < n; row++) {
      goog.asserts.assert(mat[row].length == n + 1,
                          'every row should have correct number of columns');
    }
  }

  for (var i = 0; i < n; i++) {
    // Find max in the i-th column (ignoring i - 1 first rows)
    var maxRow = i;
    var maxEl = Math.abs(mat[i][i]);
    for (var r = i + 1; r < n; r++) {
      var absValue = Math.abs(mat[r][i]);
      if (absValue > maxEl) {
        maxEl = absValue;
        maxRow = r;
      }
    }

    if (maxEl === 0) {
      return null; // matrix is singular
    }

    // Swap max row with i-th (current) row
    var tmp = mat[maxRow];
    mat[maxRow] = mat[i];
    mat[i] = tmp;

    // Subtract the i-th row to make all the remaining rows 0 in the i-th column
    for (var j = i + 1; j < n; j++) {
      var coef = -mat[j][i] / mat[i][i];
      for (var k = i; k < n + 1; k++) {
        if (i == k) {
          mat[j][k] = 0;
        } else {
          mat[j][k] += coef * mat[i][k];
        }
      }
    }
  }

  // Solve Ax=b for upper triangular matrix A (mat)
  var x = new Array(n);
  for (var l = n - 1; l >= 0; l--) {
    x[l] = mat[l][n] / mat[l][l];
    for (var m = l - 1; m >= 0; m--) {
      mat[m][n] -= mat[m][l] * x[l];
    }
  }
  return x;
};


/**
 * Converts radians to to degrees.
 *
 * @param {number} angleInRadians Angle in radians.
 * @return {number} Angle in degrees.
 */
ol.math.toDegrees = function(angleInRadians) {
  return angleInRadians * 180 / Math.PI;
};


/**
 * Converts degrees to radians.
 *
 * @param {number} angleInDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */
ol.math.toRadians = function(angleInDegrees) {
  return angleInDegrees * Math.PI / 180;
};

/**
 * Returns the modulo of a / b, depending on the sign of b.
 *
 * @param {number} a Dividend.
 * @param {number} b Divisor.
 * @return {number} Modulo.
 */
ol.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};

/**
 * Calculates the linearly interpolated value of x between a and b.
 *
 * @param {number} a Number
 * @param {number} b Number
 * @param {number} x Value to be interpolated.
 * @return {number} Interpolated value.
 */
ol.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};

goog.provide('ol.CenterConstraint');

goog.require('ol.math');


/**
 * @param {ol.Extent} extent Extent.
 * @return {ol.CenterConstraintType} The constraint.
 */
ol.CenterConstraint.createExtent = function(extent) {
  return (
      /**
       * @param {ol.Coordinate|undefined} center Center.
       * @return {ol.Coordinate|undefined} Center.
       */
      function(center) {
        if (center) {
          return [
            ol.math.clamp(center[0], extent[0], extent[2]),
            ol.math.clamp(center[1], extent[1], extent[3])
          ];
        } else {
          return undefined;
        }
      });
};


/**
 * @param {ol.Coordinate|undefined} center Center.
 * @return {ol.Coordinate|undefined} Center.
 */
ol.CenterConstraint.none = function(center) {
  return center;
};

goog.provide('ol.Constraints');


/**
 * @constructor
 * @param {ol.CenterConstraintType} centerConstraint Center constraint.
 * @param {ol.ResolutionConstraintType} resolutionConstraint
 *     Resolution constraint.
 * @param {ol.RotationConstraintType} rotationConstraint
 *     Rotation constraint.
 */
ol.Constraints = function(centerConstraint, resolutionConstraint, rotationConstraint) {

  /**
   * @type {ol.CenterConstraintType}
   */
  this.center = centerConstraint;

  /**
   * @type {ol.ResolutionConstraintType}
   */
  this.resolution = resolutionConstraint;

  /**
   * @type {ol.RotationConstraintType}
   */
  this.rotation = rotationConstraint;

};

goog.provide('ol.object');


/**
 * Polyfill for Object.assign().  Assigns enumerable and own properties from
 * one or more source objects to a target object.
 *
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @param {!Object} target The target object.
 * @param {...Object} var_sources The source object(s).
 * @return {!Object} The modified target object.
 */
ol.object.assign = (typeof Object.assign === 'function') ? Object.assign : function(target, var_sources) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  for (var i = 1, ii = arguments.length; i < ii; ++i) {
    var source = arguments[i];
    if (source !== undefined && source !== null) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          output[key] = source[key];
        }
      }
    }
  }
  return output;
};


/**
 * Removes all properties from an object.
 * @param {Object} object The object to clear.
 */
ol.object.clear = function(object) {
  for (var property in object) {
    delete object[property];
  }
};


/**
 * Get an array of property values from an object.
 * @param {Object<K,V>} object The object from which to get the values.
 * @return {!Array<V>} The property values.
 * @template K,V
 */
ol.object.getValues = function(object) {
  var values = [];
  for (var property in object) {
    values.push(object[property]);
  }
  return values;
};


/**
 * Determine if an object has any properties.
 * @param {Object} object The object to check.
 * @return {boolean} The object is empty.
 */
ol.object.isEmpty = function(object) {
  var property;
  for (property in object) {
    return false;
  }
  return !property;
};

goog.provide('ol.events');
goog.provide('ol.events.EventType');
goog.provide('ol.events.KeyCode');

goog.require('ol.object');


/**
 * @enum {string}
 * @const
 */
ol.events.EventType = {
  /**
   * Generic change event.
   * @event ol.events.Event#change
   * @api
   */
  CHANGE: 'change',

  CLICK: 'click',
  DBLCLICK: 'dblclick',
  DRAGENTER: 'dragenter',
  DRAGOVER: 'dragover',
  DROP: 'drop',
  ERROR: 'error',
  KEYDOWN: 'keydown',
  KEYPRESS: 'keypress',
  LOAD: 'load',
  MOUSEDOWN: 'mousedown',
  MOUSEMOVE: 'mousemove',
  MOUSEOUT: 'mouseout',
  MOUSEUP: 'mouseup',
  MOUSEWHEEL: 'mousewheel',
  MSPOINTERDOWN: 'mspointerdown',
  RESIZE: 'resize',
  TOUCHSTART: 'touchstart',
  TOUCHMOVE: 'touchmove',
  TOUCHEND: 'touchend',
  WHEEL: 'wheel'
};


/**
 * @enum {number}
 * @const
 */
ol.events.KeyCode = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};


/**
 * Property name on an event target for the listener map associated with the
 * event target.
 * @const {string}
 * @private
 */
ol.events.LISTENER_MAP_PROP_ = 'olm_' + ((Math.random() * 1e4) | 0);


/**
 * @param {ol.EventsKey} listenerObj Listener object.
 * @return {ol.EventsListenerFunctionType} Bound listener.
 */
ol.events.bindListener_ = function(listenerObj) {
  var boundListener = function(evt) {
    var listener = listenerObj.listener;
    var bindTo = listenerObj.bindTo || listenerObj.target;
    if (listenerObj.callOnce) {
      ol.events.unlistenByKey(listenerObj);
    }
    return listener.call(bindTo, evt);
  };
  listenerObj.boundListener = boundListener;
  return boundListener;
};


/**
 * Finds the matching {@link ol.EventsKey} in the given listener
 * array.
 *
 * @param {!Array<!ol.EventsKey>} listeners Array of listeners.
 * @param {!Function} listener The listener function.
 * @param {Object=} opt_this The `this` value inside the listener.
 * @param {boolean=} opt_setDeleteIndex Set the deleteIndex on the matching
 *     listener, for {@link ol.events.unlistenByKey}.
 * @return {ol.EventsKey|undefined} The matching listener object.
 * @private
 */
ol.events.findListener_ = function(listeners, listener, opt_this,
    opt_setDeleteIndex) {
  var listenerObj;
  for (var i = 0, ii = listeners.length; i < ii; ++i) {
    listenerObj = listeners[i];
    if (listenerObj.listener === listener &&
        listenerObj.bindTo === opt_this) {
      if (opt_setDeleteIndex) {
        listenerObj.deleteIndex = i;
      }
      return listenerObj;
    }
  }
  return undefined;
};


/**
 * @param {ol.EventTargetLike} target Target.
 * @param {string} type Type.
 * @return {Array.<ol.EventsKey>|undefined} Listeners.
 */
ol.events.getListeners = function(target, type) {
  var listenerMap = target[ol.events.LISTENER_MAP_PROP_];
  return listenerMap ? listenerMap[type] : undefined;
};


/**
 * Get the lookup of listeners.  If one does not exist on the target, it is
 * created.
 * @param {ol.EventTargetLike} target Target.
 * @return {!Object.<string, Array.<ol.EventsKey>>} Map of
 *     listeners by event type.
 * @private
 */
ol.events.getListenerMap_ = function(target) {
  var listenerMap = target[ol.events.LISTENER_MAP_PROP_];
  if (!listenerMap) {
    listenerMap = target[ol.events.LISTENER_MAP_PROP_] = {};
  }
  return listenerMap;
};


/**
 * Clean up all listener objects of the given type.  All properties on the
 * listener objects will be removed, and if no listeners remain in the listener
 * map, it will be removed from the target.
 * @param {ol.EventTargetLike} target Target.
 * @param {string} type Type.
 * @private
 */
ol.events.removeListeners_ = function(target, type) {
  var listeners = ol.events.getListeners(target, type);
  if (listeners) {
    for (var i = 0, ii = listeners.length; i < ii; ++i) {
      target.removeEventListener(type, listeners[i].boundListener);
      ol.object.clear(listeners[i]);
    }
    listeners.length = 0;
    var listenerMap = target[ol.events.LISTENER_MAP_PROP_];
    if (listenerMap) {
      delete listenerMap[type];
      if (Object.keys(listenerMap).length === 0) {
        delete target[ol.events.LISTENER_MAP_PROP_];
      }
    }
  }
};


/**
 * Registers an event listener on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * This function efficiently binds a `listener` to a `this` object, and returns
 * a key for use with {@link ol.events.unlistenByKey}.
 *
 * @param {ol.EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @param {boolean=} opt_once If true, add the listener as one-off listener.
 * @return {ol.EventsKey} Unique key for the listener.
 */
ol.events.listen = function(target, type, listener, opt_this, opt_once) {
  var listenerMap = ol.events.getListenerMap_(target);
  var listeners = listenerMap[type];
  if (!listeners) {
    listeners = listenerMap[type] = [];
  }
  var listenerObj = ol.events.findListener_(listeners, listener, opt_this,
      false);
  if (listenerObj) {
    if (!opt_once) {
      // Turn one-off listener into a permanent one.
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = /** @type {ol.EventsKey} */ ({
      bindTo: opt_this,
      callOnce: !!opt_once,
      listener: listener,
      target: target,
      type: type
    });
    target.addEventListener(type, ol.events.bindListener_(listenerObj));
    listeners.push(listenerObj);
  }

  return listenerObj;
};


/**
 * Registers a one-off event listener on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * This function efficiently binds a `listener` as self-unregistering listener
 * to a `this` object, and returns a key for use with
 * {@link ol.events.unlistenByKey} in case the listener needs to be unregistered
 * before it is called.
 *
 * When {@link ol.events.listen} is called with the same arguments after this
 * function, the self-unregistering listener will be turned into a permanent
 * listener.
 *
 * @param {ol.EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @return {ol.EventsKey} Key for unlistenByKey.
 */
ol.events.listenOnce = function(target, type, listener, opt_this) {
  return ol.events.listen(target, type, listener, opt_this, true);
};


/**
 * Unregisters an event listener on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * To return a listener, this function needs to be called with the exact same
 * arguments that were used for a previous {@link ol.events.listen} call.
 *
 * @param {ol.EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 */
ol.events.unlisten = function(target, type, listener, opt_this) {
  var listeners = ol.events.getListeners(target, type);
  if (listeners) {
    var listenerObj = ol.events.findListener_(listeners, listener, opt_this,
        true);
    if (listenerObj) {
      ol.events.unlistenByKey(listenerObj);
    }
  }
};


/**
 * Unregisters event listeners on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * The argument passed to this function is the key returned from
 * {@link ol.events.listen} or {@link ol.events.listenOnce}.
 *
 * @param {ol.EventsKey} key The key.
 */
ol.events.unlistenByKey = function(key) {
  if (key && key.target) {
    key.target.removeEventListener(key.type, key.boundListener);
    var listeners = ol.events.getListeners(key.target, key.type);
    if (listeners) {
      var i = 'deleteIndex' in key ? key.deleteIndex : listeners.indexOf(key);
      if (i !== -1) {
        listeners.splice(i, 1);
      }
      if (listeners.length === 0) {
        ol.events.removeListeners_(key.target, key.type);
      }
    }
    ol.object.clear(key);
  }
};


/**
 * Unregisters all event listeners on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * @param {ol.EventTargetLike} target Target.
 */
ol.events.unlistenAll = function(target) {
  var listenerMap = ol.events.getListenerMap_(target);
  for (var type in listenerMap) {
    ol.events.removeListeners_(target, type);
  }
};

goog.provide('ol.Disposable');

goog.require('ol');

/**
 * Objects that need to clean up after themselves.
 * @constructor
 */
ol.Disposable = function() {};

/**
 * The object has already been disposed.
 * @type {boolean}
 * @private
 */
ol.Disposable.prototype.disposed_ = false;

/**
 * Clean up.
 */
ol.Disposable.prototype.dispose = function() {
  if (!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
  }
};

/**
 * Extension point for disposable objects.
 * @protected
 */
ol.Disposable.prototype.disposeInternal = ol.nullFunction;

goog.provide('ol.events.Event');


/**
 * @classdesc
 * Stripped down implementation of the W3C DOM Level 2 Event interface.
 * @see {@link https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface}
 *
 * This implementation only provides `type` and `target` properties, and
 * `stopPropagation` and `preventDefault` methods. It is meant as base class
 * for higher level events defined in the library, and works with
 * {@link ol.events.EventTarget}.
 *
 * @constructor
 * @implements {oli.events.Event}
 * @param {string} type Type.
 * @param {Object=} opt_target Target.
 */
ol.events.Event = function(type, opt_target) {

  /**
   * @type {boolean}
   */
  this.propagationStopped;

  /**
   * The event type.
   * @type {string}
   * @api stable
   */
  this.type = type;

  /**
   * The event target.
   * @type {Object}
   * @api stable
   */
  this.target = opt_target || null;

};


/**
 * Stop event propagation.
 * @function
 * @api stable
 */
ol.events.Event.prototype.preventDefault =

/**
 * Stop event propagation.
 * @function
 * @api stable
 */
ol.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped = true;
};


/**
 * @param {Event|ol.events.Event} evt Event
 */
ol.events.Event.stopPropagation = function(evt) {
  evt.stopPropagation();
};


/**
 * @param {Event|ol.events.Event} evt Event
 */
ol.events.Event.preventDefault = function(evt) {
  evt.preventDefault();
};

goog.provide('ol.events.EventTarget');

goog.require('goog.asserts');
goog.require('ol.Disposable');
goog.require('ol.events');
goog.require('ol.events.Event');


/**
 * @classdesc
 * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
 * @see {@link https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget}
 *
 * There are two important simplifications compared to the specification:
 *
 * 1. The handling of `useCapture` in `addEventListener` and
 *    `removeEventListener`. There is no real capture model.
 * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
 *    There is no event target hierarchy. When a listener calls
 *    `stopPropagation` or `preventDefault` on an event object, it means that no
 *    more listeners after this one will be called. Same as when the listener
 *    returns false.
 *
 * @constructor
 * @extends {ol.Disposable}
 */
ol.events.EventTarget = function() {

  ol.Disposable.call(this);

  /**
   * @private
   * @type {!Object.<string, number>}
   */
  this.pendingRemovals_ = {};

  /**
   * @private
   * @type {!Object.<string, number>}
   */
  this.dispatching_ = {};

  /**
   * @private
   * @type {!Object.<string, Array.<ol.EventsListenerFunctionType>>}
   */
  this.listeners_ = {};

};
ol.inherits(ol.events.EventTarget, ol.Disposable);


/**
 * @param {string} type Type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 */
ol.events.EventTarget.prototype.addEventListener = function(type, listener) {
  var listeners = this.listeners_[type];
  if (!listeners) {
    listeners = this.listeners_[type] = [];
  }
  if (listeners.indexOf(listener) === -1) {
    listeners.push(listener);
  }
};


/**
 * @param {{type: string,
 *     target: (EventTarget|ol.events.EventTarget|undefined)}|ol.events.Event|
 *     string} event Event or event type.
 * @return {boolean|undefined} `false` if anyone called preventDefault on the
 *     event object or if any of the listeners returned false.
 */
ol.events.EventTarget.prototype.dispatchEvent = function(event) {
  var evt = typeof event === 'string' ? new ol.events.Event(event) : event;
  var type = evt.type;
  evt.target = this;
  var listeners = this.listeners_[type];
  var propagate;
  if (listeners) {
    if (!(type in this.dispatching_)) {
      this.dispatching_[type] = 0;
      this.pendingRemovals_[type] = 0;
    }
    ++this.dispatching_[type];
    for (var i = 0, ii = listeners.length; i < ii; ++i) {
      if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
        propagate = false;
        break;
      }
    }
    --this.dispatching_[type];
    if (this.dispatching_[type] === 0) {
      var pendingRemovals = this.pendingRemovals_[type];
      delete this.pendingRemovals_[type];
      while (pendingRemovals--) {
        this.removeEventListener(type, ol.nullFunction);
      }
      delete this.dispatching_[type];
    }
    return propagate;
  }
};


/**
 * @inheritDoc
 */
ol.events.EventTarget.prototype.disposeInternal = function() {
  ol.events.unlistenAll(this);
};


/**
 * Get the listeners for a specified event type. Listeners are returned in the
 * order that they will be called in.
 *
 * @param {string} type Type.
 * @return {Array.<ol.EventsListenerFunctionType>} Listeners.
 */
ol.events.EventTarget.prototype.getListeners = function(type) {
  return this.listeners_[type];
};


/**
 * @param {string=} opt_type Type. If not provided,
 *     `true` will be returned if this EventTarget has any listeners.
 * @return {boolean} Has listeners.
 */
ol.events.EventTarget.prototype.hasListener = function(opt_type) {
  return opt_type ?
      opt_type in this.listeners_ :
      Object.keys(this.listeners_).length > 0;
};


/**
 * @param {string} type Type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 */
ol.events.EventTarget.prototype.removeEventListener = function(type, listener) {
  var listeners = this.listeners_[type];
  if (listeners) {
    var index = listeners.indexOf(listener);
    goog.asserts.assert(index != -1, 'listener not found');
    if (type in this.pendingRemovals_) {
      // make listener a no-op, and remove later in #dispatchEvent()
      listeners[index] = ol.nullFunction;
      ++this.pendingRemovals_[type];
    } else {
      listeners.splice(index, 1);
      if (listeners.length === 0) {
        delete this.listeners_[type];
      }
    }
  }
};

goog.provide('ol.Observable');

goog.require('ol.events');
goog.require('ol.events.EventTarget');
goog.require('ol.events.EventType');


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * An event target providing convenient methods for listener registration
 * and unregistration. A generic `change` event is always available through
 * {@link ol.Observable#changed}.
 *
 * @constructor
 * @extends {ol.events.EventTarget}
 * @fires change
 * @struct
 * @api stable
 */
ol.Observable = function() {

  ol.events.EventTarget.call(this);

  /**
   * @private
   * @type {number}
   */
  this.revision_ = 0;

};
ol.inherits(ol.Observable, ol.events.EventTarget);


/**
 * Removes an event listener using the key returned by `on()` or `once()`.
 * @param {ol.EventsKey|Array.<ol.EventsKey>} key The key returned by `on()`
 *     or `once()` (or an array of keys).
 * @api stable
 */
ol.Observable.unByKey = function(key) {
  if (Array.isArray(key)) {
    for (var i = 0, ii = key.length; i < ii; ++i) {
      ol.events.unlistenByKey(key[i]);
    }
  } else {
    ol.events.unlistenByKey(/** @type {ol.EventsKey} */ (key));
  }
};


/**
 * Increases the revision counter and dispatches a 'change' event.
 * @api
 */
ol.Observable.prototype.changed = function() {
  ++this.revision_;
  this.dispatchEvent(ol.events.EventType.CHANGE);
};


/**
 * Triggered when the revision counter is increased.
 * @event change
 * @api
 */


/**
 * Dispatches an event and calls all listeners listening for events
 * of this type. The event parameter can either be a string or an
 * Object with a `type` property.
 *
 * @param {{type: string,
 *     target: (EventTarget|ol.events.EventTarget|undefined)}|ol.events.Event|
 *     string} event Event object.
 * @function
 * @api
 */
ol.Observable.prototype.dispatchEvent;


/**
 * Get the version number for this object.  Each time the object is modified,
 * its version number will be incremented.
 * @return {number} Revision.
 * @api
 */
ol.Observable.prototype.getRevision = function() {
  return this.revision_;
};


/**
 * Listen for a certain type of event.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object to use as `this` in `listener`.
 * @return {ol.EventsKey|Array.<ol.EventsKey>} Unique key for the listener. If
 *     called with an array of event types as the first argument, the return
 *     will be an array of keys.
 * @api stable
 */
ol.Observable.prototype.on = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    var len = type.length;
    var keys = new Array(len);
    for (var i = 0; i < len; ++i) {
      keys[i] = ol.events.listen(this, type[i], listener, opt_this);
    }
    return keys;
  } else {
    return ol.events.listen(
        this, /** @type {string} */ (type), listener, opt_this);
  }
};


/**
 * Listen once for a certain type of event.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object to use as `this` in `listener`.
 * @return {ol.EventsKey|Array.<ol.EventsKey>} Unique key for the listener. If
 *     called with an array of event types as the first argument, the return
 *     will be an array of keys.
 * @api stable
 */
ol.Observable.prototype.once = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    var len = type.length;
    var keys = new Array(len);
    for (var i = 0; i < len; ++i) {
      keys[i] = ol.events.listenOnce(this, type[i], listener, opt_this);
    }
    return keys;
  } else {
    return ol.events.listenOnce(
        this, /** @type {string} */ (type), listener, opt_this);
  }
};


/**
 * Unlisten for a certain type of event.
 * @param {string|Array.<string>} type The event type or array of event types.
 * @param {function(?): ?} listener The listener function.
 * @param {Object=} opt_this The object which was used as `this` by the
 * `listener`.
 * @api stable
 */
ol.Observable.prototype.un = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    for (var i = 0, ii = type.length; i < ii; ++i) {
      ol.events.unlisten(this, type[i], listener, opt_this);
    }
    return;
  } else {
    ol.events.unlisten(this, /** @type {string} */ (type), listener, opt_this);
  }
};


/**
 * Removes an event listener using the key returned by `on()` or `once()`.
 * Note that using the {@link ol.Observable.unByKey} static function is to
 * be preferred.
 * @param {ol.EventsKey|Array.<ol.EventsKey>} key The key returned by `on()`
 *     or `once()` (or an array of keys).
 * @function
 * @api stable
 */
ol.Observable.prototype.unByKey = ol.Observable.unByKey;

goog.provide('ol.Object');
goog.provide('ol.ObjectEvent');
goog.provide('ol.ObjectEventType');

goog.require('ol.Observable');
goog.require('ol.events');
goog.require('ol.events.Event');
goog.require('ol.object');


/**
 * @enum {string}
 */
ol.ObjectEventType = {
  /**
   * Triggered when a property is changed.
   * @event ol.ObjectEvent#propertychange
   * @api stable
   */
  PROPERTYCHANGE: 'propertychange'
};


/**
 * @classdesc
 * Events emitted by {@link ol.Object} instances are instances of this type.
 *
 * @param {string} type The event type.
 * @param {string} key The property name.
 * @param {*} oldValue The old value for `key`.
 * @extends {ol.events.Event}
 * @implements {oli.ObjectEvent}
 * @constructor
 */
ol.ObjectEvent = function(type, key, oldValue) {
  ol.events.Event.call(this, type);

  /**
   * The name of the property whose value is changing.
   * @type {string}
   * @api stable
   */
  this.key = key;

  /**
   * The old value. To get the new value use `e.target.get(e.key)` where
   * `e` is the event object.
   * @type {*}
   * @api stable
   */
  this.oldValue = oldValue;

};
ol.inherits(ol.ObjectEvent, ol.events.Event);


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Most non-trivial classes inherit from this.
 *
 * This extends {@link ol.Observable} with observable properties, where each
 * property is observable as well as the object as a whole.
 *
 * Classes that inherit from this have pre-defined properties, to which you can
 * add your owns. The pre-defined properties are listed in this documentation as
 * 'Observable Properties', and have their own accessors; for example,
 * {@link ol.Map} has a `target` property, accessed with `getTarget()`  and
 * changed with `setTarget()`. Not all properties are however settable. There
 * are also general-purpose accessors `get()` and `set()`. For example,
 * `get('target')` is equivalent to `getTarget()`.
 *
 * The `set` accessors trigger a change event, and you can monitor this by
 * registering a listener. For example, {@link ol.View} has a `center`
 * property, so `view.on('change:center', function(evt) {...});` would call the
 * function whenever the value of the center property changes. Within the
 * function, `evt.target` would be the view, so `evt.target.getCenter()` would
 * return the new center.
 *
 * You can add your own observable properties with
 * `object.set('prop', 'value')`, and retrieve that with `object.get('prop')`.
 * You can listen for changes on that property value with
 * `object.on('change:prop', listener)`. You can get a list of all
 * properties with {@link ol.Object#getProperties object.getProperties()}.
 *
 * Note that the observable properties are separate from standard JS properties.
 * You can, for example, give your map object a title with
 * `map.title='New title'` and with `map.set('title', 'Another title')`. The
 * first will be a `hasOwnProperty`; the second will appear in
 * `getProperties()`. Only the second is observable.
 *
 * Properties can be deleted by using the unset method. E.g.
 * object.unset('foo').
 *
 * @constructor
 * @extends {ol.Observable}
 * @param {Object.<string, *>=} opt_values An object with key-value pairs.
 * @fires ol.ObjectEvent
 * @api
 */
ol.Object = function(opt_values) {
  ol.Observable.call(this);

  // Call goog.getUid to ensure that the order of objects' ids is the same as
  // the order in which they were created.  This also helps to ensure that
  // object properties are always added in the same order, which helps many
  // JavaScript engines generate faster code.
  goog.getUid(this);

  /**
   * @private
   * @type {!Object.<string, *>}
   */
  this.values_ = {};

  if (opt_values !== undefined) {
    this.setProperties(opt_values);
  }
};
ol.inherits(ol.Object, ol.Observable);


/**
 * @private
 * @type {Object.<string, string>}
 */
ol.Object.changeEventTypeCache_ = {};


/**
 * @param {string} key Key name.
 * @return {string} Change name.
 */
ol.Object.getChangeEventType = function(key) {
  return ol.Object.changeEventTypeCache_.hasOwnProperty(key) ?
      ol.Object.changeEventTypeCache_[key] :
      (ol.Object.changeEventTypeCache_[key] = 'change:' + key);
};


/**
 * Gets a value.
 * @param {string} key Key name.
 * @return {*} Value.
 * @api stable
 */
ol.Object.prototype.get = function(key) {
  var value;
  if (this.values_.hasOwnProperty(key)) {
    value = this.values_[key];
  }
  return value;
};


/**
 * Get a list of object property names.
 * @return {Array.<string>} List of property names.
 * @api stable
 */
ol.Object.prototype.getKeys = function() {
  return Object.keys(this.values_);
};


/**
 * Get an object of all property names and values.
 * @return {Object.<string, *>} Object.
 * @api stable
 */
ol.Object.prototype.getProperties = function() {
  return ol.object.assign({}, this.values_);
};


/**
 * @param {string} key Key name.
 * @param {*} oldValue Old value.
 */
ol.Object.prototype.notify = function(key, oldValue) {
  var eventType;
  eventType = ol.Object.getChangeEventType(key);
  this.dispatchEvent(new ol.ObjectEvent(eventType, key, oldValue));
  eventType = ol.ObjectEventType.PROPERTYCHANGE;
  this.dispatchEvent(new ol.ObjectEvent(eventType, key, oldValue));
};


/**
 * Sets a value.
 * @param {string} key Key name.
 * @param {*} value Value.
 * @param {boolean=} opt_silent Update without triggering an event.
 * @api stable
 */
ol.Object.prototype.set = function(key, value, opt_silent) {
  if (opt_silent) {
    this.values_[key] = value;
  } else {
    var oldValue = this.values_[key];
    this.values_[key] = value;
    if (oldValue !== value) {
      this.notify(key, oldValue);
    }
  }
};


/**
 * Sets a collection of key-value pairs.  Note that this changes any existing
 * properties and adds new ones (it does not remove any existing properties).
 * @param {Object.<string, *>} values Values.
 * @param {boolean=} opt_silent Update without triggering an event.
 * @api stable
 */
ol.Object.prototype.setProperties = function(values, opt_silent) {
  var key;
  for (key in values) {
    this.set(key, values[key], opt_silent);
  }
};


/**
 * Unsets a property.
 * @param {string} key Key name.
 * @param {boolean=} opt_silent Unset without triggering an event.
 * @api stable
 */
ol.Object.prototype.unset = function(key, opt_silent) {
  if (key in this.values_) {
    var oldValue = this.values_[key];
    delete this.values_[key];
    if (!opt_silent) {
      this.notify(key, oldValue);
    }
  }
};

goog.provide('ol.array');

goog.require('goog.asserts');


/**
 * Performs a binary search on the provided sorted list and returns the index of the item if found. If it can't be found it'll return -1.
 * https://github.com/darkskyapp/binary-search
 *
 * @param {Array.<*>} haystack Items to search through.
 * @param {*} needle The item to look for.
 * @param {Function=} opt_comparator Comparator function.
 * @return {number} The index of the item if found, -1 if not.
 */
ol.array.binarySearch = function(haystack, needle, opt_comparator) {
  var mid, cmp;
  var comparator = opt_comparator || ol.array.numberSafeCompareFunction;
  var low = 0;
  var high = haystack.length;
  var found = false;

  while (low < high) {
    /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
     * to double (which gives the wrong results). */
    mid = low + (high - low >> 1);
    cmp = +comparator(haystack[mid], needle);

    if (cmp < 0.0) { /* Too low. */
      low  = mid + 1;

    } else { /* Key found or too high */
      high = mid;
      found = !cmp;
    }
  }

  /* Key not found. */
  return found ? low : ~low;
};

/**
 * @param {Array.<number>} arr Array.
 * @param {number} target Target.
 * @return {number} Index.
 */
ol.array.binaryFindNearest = function(arr, target) {
  var index = ol.array.binarySearch(arr, target,
      /**
       * @param {number} a A.
       * @param {number} b B.
       * @return {number} b minus a.
       */
      function(a, b) {
        return b - a;
      });
  if (index >= 0) {
    return index;
  } else if (index == -1) {
    return 0;
  } else if (index == -arr.length - 1) {
    return arr.length - 1;
  } else {
    var left = -index - 2;
    var right = -index - 1;
    if (arr[left] - target < target - arr[right]) {
      return left;
    } else {
      return right;
    }
  }
};


/**
 * Compare function for array sort that is safe for numbers.
 * @param {*} a The first object to be compared.
 * @param {*} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second.
 */
ol.array.numberSafeCompareFunction = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};


/**
 * Whether the array contains the given object.
 * @param {Array.<*>} arr The array to test for the presence of the element.
 * @param {*} obj The object for which to test.
 * @return {boolean} The object is in the array.
 */
ol.array.includes = function(arr, obj) {
  return arr.indexOf(obj) >= 0;
};


/**
 * @param {Array.<number>} arr Array.
 * @param {number} target Target.
 * @param {number} direction 0 means return the nearest, > 0
 *    means return the largest nearest, < 0 means return the
 *    smallest nearest.
 * @return {number} Index.
 */
ol.array.linearFindNearest = function(arr, target, direction) {
  var n = arr.length;
  if (arr[0] <= target) {
    return 0;
  } else if (target <= arr[n - 1]) {
    return n - 1;
  } else {
    var i;
    if (direction > 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] < target) {
          return i - 1;
        }
      }
    } else if (direction < 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] <= target) {
          return i;
        }
      }
    } else {
      for (i = 1; i < n; ++i) {
        if (arr[i] == target) {
          return i;
        } else if (arr[i] < target) {
          if (arr[i - 1] - target < target - arr[i]) {
            return i - 1;
          } else {
            return i;
          }
        }
      }
    }
    // We should never get here, but the compiler complains
    // if it finds a path for which no number is returned.
    goog.asserts.fail();
    return n - 1;
  }
};


/**
 * @param {Array.<*>} arr Array.
 * @param {number} begin Begin index.
 * @param {number} end End index.
 */
ol.array.reverseSubArray = function(arr, begin, end) {
  goog.asserts.assert(begin >= 0,
      'Array begin index should be equal to or greater than 0');
  goog.asserts.assert(end < arr.length,
      'Array end index should be less than the array length');
  while (begin < end) {
    var tmp = arr[begin];
    arr[begin] = arr[end];
    arr[end] = tmp;
    ++begin;
    --end;
  }
};


/**
 * @param {Array.<*>} arr Array.
 * @return {!Array.<?>} Flattened Array.
 */
ol.array.flatten = function(arr) {
  var data = arr.reduce(function(flattened, value) {
    if (Array.isArray(value)) {
      return flattened.concat(ol.array.flatten(value));
    } else {
      return flattened.concat(value);
    }
  }, []);
  return data;
};


/**
 * @param {Array.<VALUE>} arr The array to modify.
 * @param {Array.<VALUE>|VALUE} data The elements or arrays of elements
 *     to add to arr.
 * @template VALUE
 */
ol.array.extend = function(arr, data) {
  var i;
  var extension = goog.isArrayLike(data) ? data : [data];
  var length = extension.length;
  for (i = 0; i < length; i++) {
    arr[arr.length] = extension[i];
  }
};


/**
 * @param {Array.<VALUE>} arr The array to modify.
 * @param {VALUE} obj The element to remove.
 * @template VALUE
 * @return {boolean} If the element was removed.
 */
ol.array.remove = function(arr, obj) {
  var i = arr.indexOf(obj);
  var found = i > -1;
  if (found) {
    arr.splice(i, 1);
  }
  return found;
};


/**
 * @param {Array.<VALUE>} arr The array to search in.
 * @param {function(VALUE, number, ?) : boolean} func The function to compare.
 * @template VALUE
 * @return {VALUE} The element found.
 */
ol.array.find = function(arr, func) {
  var length = arr.length >>> 0;
  var value;

  for (var i = 0; i < length; i++) {
    value = arr[i];
    if (func(value, i, arr)) {
      return value;
    }
  }
  return null;
};


/**
 * @param {Array|Uint8ClampedArray} arr1 The first array to compare.
 * @param {Array|Uint8ClampedArray} arr2 The second array to compare.
 * @return {boolean} Whether the two arrays are equal.
 */
ol.array.equals = function(arr1, arr2) {
  var len1 = arr1.length;
  if (len1 !== arr2.length) {
    return false;
  }
  for (var i = 0; i < len1; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Array.<*>} arr The array to sort (modifies original).
 * @param {Function} compareFnc Comparison function.
 */
ol.array.stableSort = function(arr, compareFnc) {
  var length = arr.length;
  var tmp = Array(arr.length);
  var i;
  for (i = 0; i < length; i++) {
    tmp[i] = {index: i, value: arr[i]};
  }
  tmp.sort(function(a, b) {
    return compareFnc(a.value, b.value) || a.index - b.index;
  });
  for (i = 0; i < arr.length; i++) {
    arr[i] = tmp[i].value;
  }
};


/**
 * @param {Array.<*>} arr The array to search in.
 * @param {Function} func Comparison function.
 * @return {number} Return index.
 */
ol.array.findIndex = function(arr, func) {
  var index;
  var found = !arr.every(function(el, idx) {
    index = idx;
    return !func(el, idx, arr);
  });
  return found ? index : -1;
};


/**
 * @param {Array.<*>} arr The array to test.
 * @param {Function=} opt_func Comparison function.
 * @param {boolean=} opt_strict Strictly sorted (default false).
 * @return {boolean} Return index.
 */
ol.array.isSorted = function(arr, opt_func, opt_strict) {
  var compare = opt_func || ol.array.numberSafeCompareFunction;
  return arr.every(function(currentVal, index) {
    if (index === 0) {
      return true;
    }
    var res = compare(arr[index - 1], currentVal);
    return !(res > 0 || opt_strict && res === 0);
  });
};

goog.provide('ol.ResolutionConstraint');

goog.require('ol.array');
goog.require('ol.math');


/**
 * @param {Array.<number>} resolutions Resolutions.
 * @return {ol.ResolutionConstraintType} Zoom function.
 */
ol.ResolutionConstraint.createSnapToResolutions = function(resolutions) {
  return (
      /**
       * @param {number|undefined} resolution Resolution.
       * @param {number} delta Delta.
       * @param {number} direction Direction.
       * @return {number|undefined} Resolution.
       */
      function(resolution, delta, direction) {
        if (resolution !== undefined) {
          var z =
              ol.array.linearFindNearest(resolutions, resolution, direction);
          z = ol.math.clamp(z + delta, 0, resolutions.length - 1);
          return resolutions[z];
        } else {
          return undefined;
        }
      });
};


/**
 * @param {number} power Power.
 * @param {number} maxResolution Maximum resolution.
 * @param {number=} opt_maxLevel Maximum level.
 * @return {ol.ResolutionConstraintType} Zoom function.
 */
ol.ResolutionConstraint.createSnapToPower = function(power, maxResolution, opt_maxLevel) {
  return (
      /**
       * @param {number|undefined} resolution Resolution.
       * @param {number} delta Delta.
       * @param {number} direction Direction.
       * @return {number|undefined} Resolution.
       */
      function(resolution, delta, direction) {
        if (resolution !== undefined) {
          var offset;
          if (direction > 0) {
            offset = 0;
          } else if (direction < 0) {
            offset = 1;
          } else {
            offset = 0.5;
          }
          var oldLevel = Math.floor(
              Math.log(maxResolution / resolution) / Math.log(power) + offset);
          var newLevel = Math.max(oldLevel + delta, 0);
          if (opt_maxLevel !== undefined) {
            newLevel = Math.min(newLevel, opt_maxLevel);
          }
          return maxResolution / Math.pow(power, newLevel);
        } else {
          return undefined;
        }
      });
};

goog.provide('ol.RotationConstraint');

goog.require('ol.math');


/**
 * @param {number|undefined} rotation Rotation.
 * @param {number} delta Delta.
 * @return {number|undefined} Rotation.
 */
ol.RotationConstraint.disable = function(rotation, delta) {
  if (rotation !== undefined) {
    return 0;
  } else {
    return undefined;
  }
};


/**
 * @param {number|undefined} rotation Rotation.
 * @param {number} delta Delta.
 * @return {number|undefined} Rotation.
 */
ol.RotationConstraint.none = function(rotation, delta) {
  if (rotation !== undefined) {
    return rotation + delta;
  } else {
    return undefined;
  }
};


/**
 * @param {number} n N.
 * @return {ol.RotationConstraintType} Rotation constraint.
 */
ol.RotationConstraint.createSnapToN = function(n) {
  var theta = 2 * Math.PI / n;
  return (
      /**
       * @param {number|undefined} rotation Rotation.
       * @param {number} delta Delta.
       * @return {number|undefined} Rotation.
       */
      function(rotation, delta) {
        if (rotation !== undefined) {
          rotation = Math.floor((rotation + delta) / theta + 0.5) * theta;
          return rotation;
        } else {
          return undefined;
        }
      });
};


/**
 * @param {number=} opt_tolerance Tolerance.
 * @return {ol.RotationConstraintType} Rotation constraint.
 */
ol.RotationConstraint.createSnapToZero = function(opt_tolerance) {
  var tolerance = opt_tolerance || ol.math.toRadians(5);
  return (
      /**
       * @param {number|undefined} rotation Rotation.
       * @param {number} delta Delta.
       * @return {number|undefined} Rotation.
       */
      function(rotation, delta) {
        if (rotation !== undefined) {
          if (Math.abs(rotation + delta) <= tolerance) {
            return 0;
          } else {
            return rotation + delta;
          }
        } else {
          return undefined;
        }
      });
};

goog.provide('ol.string');

/**
 * @param {number} number Number to be formatted
 * @param {number} width The desired width
 * @param {number=} opt_precision Precision of the output string (i.e. number of decimal places)
 * @returns {string} Formatted string
*/
ol.string.padNumber = function(number, width, opt_precision) {
  var numberString = opt_precision !== undefined ? number.toFixed(opt_precision) : '' + number;
  var decimal = numberString.indexOf('.');
  decimal = decimal === -1 ? numberString.length : decimal;
  return decimal > width ? numberString : new Array(1 + width - decimal).join('0') + numberString;
};

/**
 * Adapted from https://github.com/omichelsen/compare-versions/blob/master/index.js
 * @param {string|number} v1 First version
 * @param {string|number} v2 Second version
 * @returns {number} Value
 */
ol.string.compareVersions = function(v1, v2) {
  var s1 = ('' + v1).split('.');
  var s2 = ('' + v2).split('.');

  for (var i = 0; i < Math.max(s1.length, s2.length); i++) {
    var n1 = parseInt(s1[i] || '0', 10);
    var n2 = parseInt(s2[i] || '0', 10);

    if (n1 > n2) return 1;
    if (n2 > n1) return -1;
  }

  return 0;
};

goog.provide('ol.coordinate');

goog.require('ol.math');
goog.require('ol.string');


/**
 * Add `delta` to `coordinate`. `coordinate` is modified in place and returned
 * by the function.
 *
 * Example:
 *
 *     var coord = [7.85, 47.983333];
 *     ol.coordinate.add(coord, [-2, 4]);
 *     // coord is now [5.85, 51.983333]
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Coordinate} delta Delta.
 * @return {ol.Coordinate} The input coordinate adjusted by the given delta.
 * @api stable
 */
ol.coordinate.add = function(coordinate, delta) {
  coordinate[0] += delta[0];
  coordinate[1] += delta[1];
  return coordinate;
};


/**
 * Calculates the point closest to the passed coordinate on the passed segment.
 * This is the foot of the perpendicular of the coordinate to the segment when
 * the foot is on the segment, or the closest segment coordinate when the foot
 * is outside the segment.
 *
 * @param {ol.Coordinate} coordinate The coordinate.
 * @param {Array.<ol.Coordinate>} segment The two coordinates of the segment.
 * @return {ol.Coordinate} The foot of the perpendicular of the coordinate to
 *     the segment.
 */
ol.coordinate.closestOnSegment = function(coordinate, segment) {
  var x0 = coordinate[0];
  var y0 = coordinate[1];
  var start = segment[0];
  var end = segment[1];
  var x1 = start[0];
  var y1 = start[1];
  var x2 = end[0];
  var y2 = end[1];
  var dx = x2 - x1;
  var dy = y2 - y1;
  var along = (dx === 0 && dy === 0) ? 0 :
      ((dx * (x0 - x1)) + (dy * (y0 - y1))) / ((dx * dx + dy * dy) || 0);
  var x, y;
  if (along <= 0) {
    x = x1;
    y = y1;
  } else if (along >= 1) {
    x = x2;
    y = y2;
  } else {
    x = x1 + along * dx;
    y = y1 + along * dy;
  }
  return [x, y];
};


/**
 * Returns a {@link ol.CoordinateFormatType} function that can be used to format
 * a {ol.Coordinate} to a string.
 *
 * Example without specifying the fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var stringifyFunc = ol.coordinate.createStringXY();
 *     var out = stringifyFunc(coord);
 *     // out is now '8, 48'
 *
 * Example with explicitly specifying 2 fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var stringifyFunc = ol.coordinate.createStringXY(2);
 *     var out = stringifyFunc(coord);
 *     // out is now '7.85, 47.98'
 *
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {ol.CoordinateFormatType} Coordinate format.
 * @api stable
 */
ol.coordinate.createStringXY = function(opt_fractionDigits) {
  return (
      /**
       * @param {ol.Coordinate|undefined} coordinate Coordinate.
       * @return {string} String XY.
       */
      function(coordinate) {
        return ol.coordinate.toStringXY(coordinate, opt_fractionDigits);
      });
};


/**
 * @private
 * @param {number} degrees Degrees.
 * @param {string} hemispheres Hemispheres.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} String.
 */
ol.coordinate.degreesToStringHDMS_ = function(degrees, hemispheres, opt_fractionDigits) {
  var normalizedDegrees = ol.math.modulo(degrees + 180, 360) - 180;
  var x = Math.abs(3600 * normalizedDegrees);
  var dflPrecision = opt_fractionDigits || 0;
  return Math.floor(x / 3600) + '\u00b0 ' +
      ol.string.padNumber(Math.floor((x / 60) % 60), 2) + '\u2032 ' +
      ol.string.padNumber((x % 60), 2, dflPrecision) + '\u2033 ' +
      hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0);
};


/**
 * Transforms the given {@link ol.Coordinate} to a string using the given string
 * template. The strings `{x}` and `{y}` in the template will be replaced with
 * the first and second coordinate values respectively.
 *
 * Example without specifying the fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var template = 'Coordinate is ({x}|{y}).';
 *     var out = ol.coordinate.format(coord, template);
 *     // out is now 'Coordinate is (8|48).'
 *
 * Example explicitly specifying the fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var template = 'Coordinate is ({x}|{y}).';
 *     var out = ol.coordinate.format(coord, template, 2);
 *     // out is now 'Coordinate is (7.85|47.98).'
 *
 * @param {ol.Coordinate|undefined} coordinate Coordinate.
 * @param {string} template A template string with `{x}` and `{y}` placeholders
 *     that will be replaced by first and second coordinate values.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} Formatted coordinate.
 * @api stable
 */
ol.coordinate.format = function(coordinate, template, opt_fractionDigits) {
  if (coordinate) {
    return template
      .replace('{x}', coordinate[0].toFixed(opt_fractionDigits))
      .replace('{y}', coordinate[1].toFixed(opt_fractionDigits));
  } else {
    return '';
  }
};


/**
 * @param {ol.Coordinate} coordinate1 First coordinate.
 * @param {ol.Coordinate} coordinate2 Second coordinate.
 * @return {boolean} Whether the passed coordinates are equal.
 */
ol.coordinate.equals = function(coordinate1, coordinate2) {
  var equals = true;
  for (var i = coordinate1.length - 1; i >= 0; --i) {
    if (coordinate1[i] != coordinate2[i]) {
      equals = false;
      break;
    }
  }
  return equals;
};


/**
 * Rotate `coordinate` by `angle`. `coordinate` is modified in place and
 * returned by the function.
 *
 * Example:
 *
 *     var coord = [7.85, 47.983333];
 *     var rotateRadians = Math.PI / 2; // 90 degrees
 *     ol.coordinate.rotate(coord, rotateRadians);
 *     // coord is now [-47.983333, 7.85]
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} angle Angle in radian.
 * @return {ol.Coordinate} Coordinate.
 * @api stable
 */
ol.coordinate.rotate = function(coordinate, angle) {
  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var x = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  var y = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  coordinate[0] = x;
  coordinate[1] = y;
  return coordinate;
};


/**
 * Scale `coordinate` by `scale`. `coordinate` is modified in place and returned
 * by the function.
 *
 * Example:
 *
 *     var coord = [7.85, 47.983333];
 *     var scale = 1.2;
 *     ol.coordinate.scale(coord, scale);
 *     // coord is now [9.42, 57.5799996]
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} scale Scale factor.
 * @return {ol.Coordinate} Coordinate.
 */
ol.coordinate.scale = function(coordinate, scale) {
  coordinate[0] *= scale;
  coordinate[1] *= scale;
  return coordinate;
};


/**
 * Subtract `delta` to `coordinate`. `coordinate` is modified in place and
 * returned by the function.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Coordinate} delta Delta.
 * @return {ol.Coordinate} Coordinate.
 */
ol.coordinate.sub = function(coordinate, delta) {
  coordinate[0] -= delta[0];
  coordinate[1] -= delta[1];
  return coordinate;
};


/**
 * @param {ol.Coordinate} coord1 First coordinate.
 * @param {ol.Coordinate} coord2 Second coordinate.
 * @return {number} Squared distance between coord1 and coord2.
 */
ol.coordinate.squaredDistance = function(coord1, coord2) {
  var dx = coord1[0] - coord2[0];
  var dy = coord1[1] - coord2[1];
  return dx * dx + dy * dy;
};


/**
 * Calculate the squared distance from a coordinate to a line segment.
 *
 * @param {ol.Coordinate} coordinate Coordinate of the point.
 * @param {Array.<ol.Coordinate>} segment Line segment (2 coordinates).
 * @return {number} Squared distance from the point to the line segment.
 */
ol.coordinate.squaredDistanceToSegment = function(coordinate, segment) {
  return ol.coordinate.squaredDistance(coordinate,
      ol.coordinate.closestOnSegment(coordinate, segment));
};


/**
 * Format a geographic coordinate with the hemisphere, degrees, minutes, and
 * seconds.
 *
 * Example without specifying fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringHDMS(coord);
 *     // out is now '47° 58′ 60″ N 7° 50′ 60″ E'
 *
 * Example explicitly specifying 1 fractional digit:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringHDMS(coord, 1);
 *     // out is now '47° 58′ 60.0″ N 7° 50′ 60.0″ E'
 *
 * @param {ol.Coordinate|undefined} coordinate Coordinate.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} Hemisphere, degrees, minutes and seconds.
 * @api stable
 */
ol.coordinate.toStringHDMS = function(coordinate, opt_fractionDigits) {
  if (coordinate) {
    return ol.coordinate.degreesToStringHDMS_(coordinate[1], 'NS', opt_fractionDigits) + ' ' +
        ol.coordinate.degreesToStringHDMS_(coordinate[0], 'EW', opt_fractionDigits);
  } else {
    return '';
  }
};


/**
 * Format a coordinate as a comma delimited string.
 *
 * Example without specifying fractional digits:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringXY(coord);
 *     // out is now '8, 48'
 *
 * Example explicitly specifying 1 fractional digit:
 *
 *     var coord = [7.85, 47.983333];
 *     var out = ol.coordinate.toStringXY(coord, 1);
 *     // out is now '7.8, 48.0'
 *
 * @param {ol.Coordinate|undefined} coordinate Coordinate.
 * @param {number=} opt_fractionDigits The number of digits to include
 *    after the decimal point. Default is `0`.
 * @return {string} XY.
 * @api stable
 */
ol.coordinate.toStringXY = function(coordinate, opt_fractionDigits) {
  return ol.coordinate.format(coordinate, '{x}, {y}', opt_fractionDigits);
};


/**
 * Create an ol.Coordinate from an Array and take into account axis order.
 *
 * Examples:
 *
 *     var northCoord = ol.coordinate.fromProjectedArray([1, 2], 'n');
 *     // northCoord is now [2, 1]
 *
 *     var eastCoord = ol.coordinate.fromProjectedArray([1, 2], 'e');
 *     // eastCoord is now [1, 2]
 *
 * @param {Array} array The array with coordinates.
 * @param {string} axis the axis info.
 * @return {ol.Coordinate} The coordinate created.
 */
ol.coordinate.fromProjectedArray = function(array, axis) {
  var firstAxis = axis.charAt(0);
  if (firstAxis === 'n' || firstAxis === 's') {
    return [array[1], array[0]];
  } else {
    return array;
  }
};

goog.provide('ol.extent');
goog.provide('ol.extent.Corner');
goog.provide('ol.extent.Relationship');

goog.require('goog.asserts');


/**
 * Extent corner.
 * @enum {string}
 */
ol.extent.Corner = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right'
};


/**
 * Relationship to an extent.
 * @enum {number}
 */
ol.extent.Relationship = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};


/**
 * Build an extent that includes all given coordinates.
 *
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @return {ol.Extent} Bounding extent.
 * @api stable
 */
ol.extent.boundingExtent = function(coordinates) {
  var extent = ol.extent.createEmpty();
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    ol.extent.extendCoordinate(extent, coordinates[i]);
  }
  return extent;
};


/**
 * @param {Array.<number>} xs Xs.
 * @param {Array.<number>} ys Ys.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @private
 * @return {ol.Extent} Extent.
 */
ol.extent.boundingExtentXYs_ = function(xs, ys, opt_extent) {
  goog.asserts.assert(xs.length > 0, 'xs length should be larger than 0');
  goog.asserts.assert(ys.length > 0, 'ys length should be larger than 0');
  var minX = Math.min.apply(null, xs);
  var minY = Math.min.apply(null, ys);
  var maxX = Math.max.apply(null, xs);
  var maxY = Math.max.apply(null, ys);
  return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};


/**
 * Return extent increased by the provided value.
 * @param {ol.Extent} extent Extent.
 * @param {number} value The amount by which the extent should be buffered.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 * @api stable
 */
ol.extent.buffer = function(extent, value, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0] - value;
    opt_extent[1] = extent[1] - value;
    opt_extent[2] = extent[2] + value;
    opt_extent[3] = extent[3] + value;
    return opt_extent;
  } else {
    return [
      extent[0] - value,
      extent[1] - value,
      extent[2] + value,
      extent[3] + value
    ];
  }
};


/**
 * Creates a clone of an extent.
 *
 * @param {ol.Extent} extent Extent to clone.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} The clone.
 */
ol.extent.clone = function(extent, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0];
    opt_extent[1] = extent[1];
    opt_extent[2] = extent[2];
    opt_extent[3] = extent[3];
    return opt_extent;
  } else {
    return extent.slice();
  }
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {number} Closest squared distance.
 */
ol.extent.closestSquaredDistanceXY = function(extent, x, y) {
  var dx, dy;
  if (x < extent[0]) {
    dx = extent[0] - x;
  } else if (extent[2] < x) {
    dx = x - extent[2];
  } else {
    dx = 0;
  }
  if (y < extent[1]) {
    dy = extent[1] - y;
  } else if (extent[3] < y) {
    dy = y - extent[3];
  } else {
    dy = 0;
  }
  return dx * dx + dy * dy;
};


/**
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {ol.Extent} extent Extent.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {boolean} The coordinate is contained in the extent.
 * @api stable
 */
ol.extent.containsCoordinate = function(extent, coordinate) {
  return ol.extent.containsXY(extent, coordinate[0], coordinate[1]);
};


/**
 * Check if one extent contains another.
 *
 * An extent is deemed contained if it lies completely within the other extent,
 * including if they share one or more edges.
 *
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {boolean} The second extent is contained by or on the edge of the
 *     first.
 * @api stable
 */
ol.extent.containsExtent = function(extent1, extent2) {
  return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] &&
      extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
};


/**
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {ol.Extent} extent Extent.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @return {boolean} The x, y values are contained in the extent.
 * @api stable
 */
ol.extent.containsXY = function(extent, x, y) {
  return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
};


/**
 * Get the relationship between a coordinate and extent.
 * @param {ol.Extent} extent The extent.
 * @param {ol.Coordinate} coordinate The coordinate.
 * @return {number} The relationship (bitwise compare with
 *     ol.extent.Relationship).
 */
ol.extent.coordinateRelationship = function(extent, coordinate) {
  var minX = extent[0];
  var minY = extent[1];
  var maxX = extent[2];
  var maxY = extent[3];
  var x = coordinate[0];
  var y = coordinate[1];
  var relationship = ol.extent.Relationship.UNKNOWN;
  if (x < minX) {
    relationship = relationship | ol.extent.Relationship.LEFT;
  } else if (x > maxX) {
    relationship = relationship | ol.extent.Relationship.RIGHT;
  }
  if (y < minY) {
    relationship = relationship | ol.extent.Relationship.BELOW;
  } else if (y > maxY) {
    relationship = relationship | ol.extent.Relationship.ABOVE;
  }
  if (relationship === ol.extent.Relationship.UNKNOWN) {
    relationship = ol.extent.Relationship.INTERSECTING;
  }
  return relationship;
};


/**
 * Create an empty extent.
 * @return {ol.Extent} Empty extent.
 * @api stable
 */
ol.extent.createEmpty = function() {
  return [Infinity, Infinity, -Infinity, -Infinity];
};


/**
 * Create a new extent or update the provided extent.
 * @param {number} minX Minimum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxX Maximum X.
 * @param {number} maxY Maximum Y.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdate = function(minX, minY, maxX, maxY, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = minX;
    opt_extent[1] = minY;
    opt_extent[2] = maxX;
    opt_extent[3] = maxY;
    return opt_extent;
  } else {
    return [minX, minY, maxX, maxY];
  }
};


/**
 * Create a new empty extent or make the provided one empty.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateEmpty = function(opt_extent) {
  return ol.extent.createOrUpdate(
      Infinity, Infinity, -Infinity, -Infinity, opt_extent);
};


/**
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromCoordinate = function(coordinate, opt_extent) {
  var x = coordinate[0];
  var y = coordinate[1];
  return ol.extent.createOrUpdate(x, y, x, y, opt_extent);
};


/**
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromCoordinates = function(coordinates, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendCoordinates(extent, coordinates);
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromFlatCoordinates = function(flatCoordinates, offset, end, stride, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendFlatCoordinates(
      extent, flatCoordinates, offset, end, stride);
};


/**
 * @param {Array.<Array.<ol.Coordinate>>} rings Rings.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.createOrUpdateFromRings = function(rings, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendRings(extent, rings);
};


/**
 * Empty an extent in place.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.empty = function(extent) {
  extent[0] = extent[1] = Infinity;
  extent[2] = extent[3] = -Infinity;
  return extent;
};


/**
 * Determine if two extents are equivalent.
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {boolean} The two extents are equivalent.
 * @api stable
 */
ol.extent.equals = function(extent1, extent2) {
  return extent1[0] == extent2[0] && extent1[2] == extent2[2] &&
      extent1[1] == extent2[1] && extent1[3] == extent2[3];
};


/**
 * Modify an extent to include another extent.
 * @param {ol.Extent} extent1 The extent to be modified.
 * @param {ol.Extent} extent2 The extent that will be included in the first.
 * @return {ol.Extent} A reference to the first (extended) extent.
 * @api stable
 */
ol.extent.extend = function(extent1, extent2) {
  if (extent2[0] < extent1[0]) {
    extent1[0] = extent2[0];
  }
  if (extent2[2] > extent1[2]) {
    extent1[2] = extent2[2];
  }
  if (extent2[1] < extent1[1]) {
    extent1[1] = extent2[1];
  }
  if (extent2[3] > extent1[3]) {
    extent1[3] = extent2[3];
  }
  return extent1;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {ol.Coordinate} coordinate Coordinate.
 */
ol.extent.extendCoordinate = function(extent, coordinate) {
  if (coordinate[0] < extent[0]) {
    extent[0] = coordinate[0];
  }
  if (coordinate[0] > extent[2]) {
    extent[2] = coordinate[0];
  }
  if (coordinate[1] < extent[1]) {
    extent[1] = coordinate[1];
  }
  if (coordinate[1] > extent[3]) {
    extent[3] = coordinate[1];
  }
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @return {ol.Extent} Extent.
 */
ol.extent.extendCoordinates = function(extent, coordinates) {
  var i, ii;
  for (i = 0, ii = coordinates.length; i < ii; ++i) {
    ol.extent.extendCoordinate(extent, coordinates[i]);
  }
  return extent;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {ol.Extent} Extent.
 */
ol.extent.extendFlatCoordinates = function(extent, flatCoordinates, offset, end, stride) {
  for (; offset < end; offset += stride) {
    ol.extent.extendXY(
        extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
  }
  return extent;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {Array.<Array.<ol.Coordinate>>} rings Rings.
 * @return {ol.Extent} Extent.
 */
ol.extent.extendRings = function(extent, rings) {
  var i, ii;
  for (i = 0, ii = rings.length; i < ii; ++i) {
    ol.extent.extendCoordinates(extent, rings[i]);
  }
  return extent;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} x X.
 * @param {number} y Y.
 */
ol.extent.extendXY = function(extent, x, y) {
  extent[0] = Math.min(extent[0], x);
  extent[1] = Math.min(extent[1], y);
  extent[2] = Math.max(extent[2], x);
  extent[3] = Math.max(extent[3], y);
};


/**
 * This function calls `callback` for each corner of the extent. If the
 * callback returns a truthy value the function returns that value
 * immediately. Otherwise the function returns `false`.
 * @param {ol.Extent} extent Extent.
 * @param {function(this:T, ol.Coordinate): S} callback Callback.
 * @param {T=} opt_this Value to use as `this` when executing `callback`.
 * @return {S|boolean} Value.
 * @template S, T
 */
ol.extent.forEachCorner = function(extent, callback, opt_this) {
  var val;
  val = callback.call(opt_this, ol.extent.getBottomLeft(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getBottomRight(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getTopRight(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getTopLeft(extent));
  if (val) {
    return val;
  }
  return false;
};


/**
 * @param {ol.Extent} extent Extent.
 * @return {number} Area.
 */
ol.extent.getArea = function(extent) {
  var area = 0;
  if (!ol.extent.isEmpty(extent)) {
    area = ol.extent.getWidth(extent) * ol.extent.getHeight(extent);
  }
  return area;
};


/**
 * Get the bottom left coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Bottom left coordinate.
 * @api stable
 */
ol.extent.getBottomLeft = function(extent) {
  return [extent[0], extent[1]];
};


/**
 * Get the bottom right coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Bottom right coordinate.
 * @api stable
 */
ol.extent.getBottomRight = function(extent) {
  return [extent[2], extent[1]];
};


/**
 * Get the center coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Center.
 * @api stable
 */
ol.extent.getCenter = function(extent) {
  return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
};


/**
 * Get a corner coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @param {ol.extent.Corner} corner Corner.
 * @return {ol.Coordinate} Corner coordinate.
 */
ol.extent.getCorner = function(extent, corner) {
  var coordinate;
  if (corner === ol.extent.Corner.BOTTOM_LEFT) {
    coordinate = ol.extent.getBottomLeft(extent);
  } else if (corner === ol.extent.Corner.BOTTOM_RIGHT) {
    coordinate = ol.extent.getBottomRight(extent);
  } else if (corner === ol.extent.Corner.TOP_LEFT) {
    coordinate = ol.extent.getTopLeft(extent);
  } else if (corner === ol.extent.Corner.TOP_RIGHT) {
    coordinate = ol.extent.getTopRight(extent);
  } else {
    goog.asserts.fail('Invalid corner: %s', corner);
  }
  goog.asserts.assert(coordinate, 'coordinate should be defined');
  return coordinate;
};


/**
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {number} Enlarged area.
 */
ol.extent.getEnlargedArea = function(extent1, extent2) {
  var minX = Math.min(extent1[0], extent2[0]);
  var minY = Math.min(extent1[1], extent2[1]);
  var maxX = Math.max(extent1[2], extent2[2]);
  var maxY = Math.max(extent1[3], extent2[3]);
  return (maxX - minX) * (maxY - minY);
};


/**
 * @param {ol.Coordinate} center Center.
 * @param {number} resolution Resolution.
 * @param {number} rotation Rotation.
 * @param {ol.Size} size Size.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.getForViewAndSize = function(center, resolution, rotation, size, opt_extent) {
  var dx = resolution * size[0] / 2;
  var dy = resolution * size[1] / 2;
  var cosRotation = Math.cos(rotation);
  var sinRotation = Math.sin(rotation);
  var xCos = dx * cosRotation;
  var xSin = dx * sinRotation;
  var yCos = dy * cosRotation;
  var ySin = dy * sinRotation;
  var x = center[0];
  var y = center[1];
  var x0 = x - xCos + ySin;
  var x1 = x - xCos - ySin;
  var x2 = x + xCos - ySin;
  var x3 = x + xCos + ySin;
  var y0 = y - xSin - yCos;
  var y1 = y - xSin + yCos;
  var y2 = y + xSin + yCos;
  var y3 = y + xSin - yCos;
  return ol.extent.createOrUpdate(
      Math.min(x0, x1, x2, x3), Math.min(y0, y1, y2, y3),
      Math.max(x0, x1, x2, x3), Math.max(y0, y1, y2, y3),
      opt_extent);
};


/**
 * Get the height of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {number} Height.
 * @api stable
 */
ol.extent.getHeight = function(extent) {
  return extent[3] - extent[1];
};


/**
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {number} Intersection area.
 */
ol.extent.getIntersectionArea = function(extent1, extent2) {
  var intersection = ol.extent.getIntersection(extent1, extent2);
  return ol.extent.getArea(intersection);
};


/**
 * Get the intersection of two extents.
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @param {ol.Extent=} opt_extent Optional extent to populate with intersection.
 * @return {ol.Extent} Intersecting extent.
 * @api stable
 */
ol.extent.getIntersection = function(extent1, extent2, opt_extent) {
  var intersection = opt_extent ? opt_extent : ol.extent.createEmpty();
  if (ol.extent.intersects(extent1, extent2)) {
    if (extent1[0] > extent2[0]) {
      intersection[0] = extent1[0];
    } else {
      intersection[0] = extent2[0];
    }
    if (extent1[1] > extent2[1]) {
      intersection[1] = extent1[1];
    } else {
      intersection[1] = extent2[1];
    }
    if (extent1[2] < extent2[2]) {
      intersection[2] = extent1[2];
    } else {
      intersection[2] = extent2[2];
    }
    if (extent1[3] < extent2[3]) {
      intersection[3] = extent1[3];
    } else {
      intersection[3] = extent2[3];
    }
  }
  return intersection;
};


/**
 * @param {ol.Extent} extent Extent.
 * @return {number} Margin.
 */
ol.extent.getMargin = function(extent) {
  return ol.extent.getWidth(extent) + ol.extent.getHeight(extent);
};


/**
 * Get the size (width, height) of an extent.
 * @param {ol.Extent} extent The extent.
 * @return {ol.Size} The extent size.
 * @api stable
 */
ol.extent.getSize = function(extent) {
  return [extent[2] - extent[0], extent[3] - extent[1]];
};


/**
 * Get the top left coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Top left coordinate.
 * @api stable
 */
ol.extent.getTopLeft = function(extent) {
  return [extent[0], extent[3]];
};


/**
 * Get the top right coordinate of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {ol.Coordinate} Top right coordinate.
 * @api stable
 */
ol.extent.getTopRight = function(extent) {
  return [extent[2], extent[3]];
};


/**
 * Get the width of an extent.
 * @param {ol.Extent} extent Extent.
 * @return {number} Width.
 * @api stable
 */
ol.extent.getWidth = function(extent) {
  return extent[2] - extent[0];
};


/**
 * Determine if one extent intersects another.
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent.
 * @return {boolean} The two extents intersect.
 * @api stable
 */
ol.extent.intersects = function(extent1, extent2) {
  return extent1[0] <= extent2[2] &&
      extent1[2] >= extent2[0] &&
      extent1[1] <= extent2[3] &&
      extent1[3] >= extent2[1];
};


/**
 * Determine if an extent is empty.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} Is empty.
 * @api stable
 */
ol.extent.isEmpty = function(extent) {
  return extent[2] < extent[0] || extent[3] < extent[1];
};


/**
 * @param {ol.Extent} extent Extent.
 * @return {boolean} Is infinite.
 */
ol.extent.isInfinite = function(extent) {
  return extent[0] == -Infinity || extent[1] == -Infinity ||
      extent[2] == Infinity || extent[3] == Infinity;
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {ol.Coordinate} Coordinate.
 */
ol.extent.normalize = function(extent, coordinate) {
  return [
    (coordinate[0] - extent[0]) / (extent[2] - extent[0]),
    (coordinate[1] - extent[1]) / (extent[3] - extent[1])
  ];
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} Extent.
 */
ol.extent.returnOrUpdate = function(extent, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0];
    opt_extent[1] = extent[1];
    opt_extent[2] = extent[2];
    opt_extent[3] = extent[3];
    return opt_extent;
  } else {
    return extent;
  }
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} value Value.
 */
ol.extent.scaleFromCenter = function(extent, value) {
  var deltaX = ((extent[2] - extent[0]) / 2) * (value - 1);
  var deltaY = ((extent[3] - extent[1]) / 2) * (value - 1);
  extent[0] -= deltaX;
  extent[2] += deltaX;
  extent[1] -= deltaY;
  extent[3] += deltaY;
};


/**
 * Determine if the segment between two coordinates intersects (crosses,
 * touches, or is contained by) the provided extent.
 * @param {ol.Extent} extent The extent.
 * @param {ol.Coordinate} start Segment start coordinate.
 * @param {ol.Coordinate} end Segment end coordinate.
 * @return {boolean} The segment intersects the extent.
 */
ol.extent.intersectsSegment = function(extent, start, end) {
  var intersects = false;
  var startRel = ol.extent.coordinateRelationship(extent, start);
  var endRel = ol.extent.coordinateRelationship(extent, end);
  if (startRel === ol.extent.Relationship.INTERSECTING ||
      endRel === ol.extent.Relationship.INTERSECTING) {
    intersects = true;
  } else {
    var minX = extent[0];
    var minY = extent[1];
    var maxX = extent[2];
    var maxY = extent[3];
    var startX = start[0];
    var startY = start[1];
    var endX = end[0];
    var endY = end[1];
    var slope = (endY - startY) / (endX - startX);
    var x, y;
    if (!!(endRel & ol.extent.Relationship.ABOVE) &&
        !(startRel & ol.extent.Relationship.ABOVE)) {
      // potentially intersects top
      x = endX - ((endY - maxY) / slope);
      intersects = x >= minX && x <= maxX;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.RIGHT) &&
        !(startRel & ol.extent.Relationship.RIGHT)) {
      // potentially intersects right
      y = endY - ((endX - maxX) * slope);
      intersects = y >= minY && y <= maxY;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.BELOW) &&
        !(startRel & ol.extent.Relationship.BELOW)) {
      // potentially intersects bottom
      x = endX - ((endY - minY) / slope);
      intersects = x >= minX && x <= maxX;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.LEFT) &&
        !(startRel & ol.extent.Relationship.LEFT)) {
      // potentially intersects left
      y = endY - ((endX - minX) * slope);
      intersects = y >= minY && y <= maxY;
    }

  }
  return intersects;
};


/**
 * @param {ol.Extent} extent1 Extent 1.
 * @param {ol.Extent} extent2 Extent 2.
 * @return {boolean} Touches.
 */
ol.extent.touches = function(extent1, extent2) {
  var intersects = ol.extent.intersects(extent1, extent2);
  return intersects &&
      (extent1[0] == extent2[2] || extent1[2] == extent2[0] ||
       extent1[1] == extent2[3] || extent1[3] == extent2[1]);
};


/**
 * Apply a transform function to the extent.
 * @param {ol.Extent} extent Extent.
 * @param {ol.TransformFunction} transformFn Transform function.  Called with
 * [minX, minY, maxX, maxY] extent coordinates.
 * @param {ol.Extent=} opt_extent Destination extent.
 * @return {ol.Extent} Extent.
 * @api stable
 */
ol.extent.applyTransform = function(extent, transformFn, opt_extent) {
  var coordinates = [
    extent[0], extent[1],
    extent[0], extent[3],
    extent[2], extent[1],
    extent[2], extent[3]
  ];
  transformFn(coordinates, coordinates, 2);
  var xs = [coordinates[0], coordinates[2], coordinates[4], coordinates[6]];
  var ys = [coordinates[1], coordinates[3], coordinates[5], coordinates[7]];
  return ol.extent.boundingExtentXYs_(xs, ys, opt_extent);
};

goog.provide('ol.functions');

/**
 * Always returns true.
 * @returns {boolean} true.
 */
ol.functions.TRUE = function() {
  return true;
};

/**
 * Always returns false.
 * @returns {boolean} false.
 */
ol.functions.FALSE = function() {
  return false;
};

/**
 * @license
 * Latitude/longitude spherical geodesy formulae taken from
 * http://www.movable-type.co.uk/scripts/latlong.html
 * Licensed under CC-BY-3.0.
 */

goog.provide('ol.Sphere');

goog.require('ol.math');


/**
 * @classdesc
 * Class to create objects that can be used with {@link
 * ol.geom.Polygon.circular}.
 *
 * For example to create a sphere whose radius is equal to the semi-major
 * axis of the WGS84 ellipsoid:
 *
 * ```js
 * var wgs84Sphere= new ol.Sphere(6378137);
 * ```
 *
 * @constructor
 * @param {number} radius Radius.
 * @api
 */
ol.Sphere = function(radius) {

  /**
   * @type {number}
   */
  this.radius = radius;

};


/**
 * Returns the geodesic area for a list of coordinates.
 *
 * [Reference](http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409)
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 * Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007
 *
 * @param {Array.<ol.Coordinate>} coordinates List of coordinates of a linear
 * ring. If the ring is oriented clockwise, the area will be positive,
 * otherwise it will be negative.
 * @return {number} Area.
 * @api
 */
ol.Sphere.prototype.geodesicArea = function(coordinates) {
  var area = 0, len = coordinates.length;
  var x1 = coordinates[len - 1][0];
  var y1 = coordinates[len - 1][1];
  for (var i = 0; i < len; i++) {
    var x2 = coordinates[i][0], y2 = coordinates[i][1];
    area += ol.math.toRadians(x2 - x1) *
        (2 + Math.sin(ol.math.toRadians(y1)) +
        Math.sin(ol.math.toRadians(y2)));
    x1 = x2;
    y1 = y2;
  }
  return area * this.radius * this.radius / 2.0;
};


/**
 * Returns the distance from c1 to c2 using the haversine formula.
 *
 * @param {ol.Coordinate} c1 Coordinate 1.
 * @param {ol.Coordinate} c2 Coordinate 2.
 * @return {number} Haversine distance.
 * @api
 */
ol.Sphere.prototype.haversineDistance = function(c1, c2) {
  var lat1 = ol.math.toRadians(c1[1]);
  var lat2 = ol.math.toRadians(c2[1]);
  var deltaLatBy2 = (lat2 - lat1) / 2;
  var deltaLonBy2 = ol.math.toRadians(c2[0] - c1[0]) / 2;
  var a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) +
      Math.sin(deltaLonBy2) * Math.sin(deltaLonBy2) *
      Math.cos(lat1) * Math.cos(lat2);
  return 2 * this.radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


/**
 * Returns the coordinate at the given distance and bearing from `c1`.
 *
 * @param {ol.Coordinate} c1 The origin point (`[lon, lat]` in degrees).
 * @param {number} distance The great-circle distance between the origin
 *     point and the target point.
 * @param {number} bearing The bearing (in radians).
 * @return {ol.Coordinate} The target point.
 */
ol.Sphere.prototype.offset = function(c1, distance, bearing) {
  var lat1 = ol.math.toRadians(c1[1]);
  var lon1 = ol.math.toRadians(c1[0]);
  var dByR = distance / this.radius;
  var lat = Math.asin(
      Math.sin(lat1) * Math.cos(dByR) +
      Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
  var lon = lon1 + Math.atan2(
      Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
      Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
  return [ol.math.toDegrees(lon), ol.math.toDegrees(lat)];
};

goog.provide('ol.sphere.NORMAL');

goog.require('ol.Sphere');


/**
 * The normal sphere.
 * @const
 * @type {ol.Sphere}
 */
ol.sphere.NORMAL = new ol.Sphere(6370997);

goog.provide('ol.proj');
goog.provide('ol.proj.METERS_PER_UNIT');
goog.provide('ol.proj.Projection');
goog.provide('ol.proj.Units');

goog.require('goog.asserts');
goog.require('ol');
goog.require('ol.extent');
goog.require('ol.object');
goog.require('ol.sphere.NORMAL');


/**
 * Projection units: `'degrees'`, `'ft'`, `'m'`, `'pixels'`, `'tile-pixels'` or
 * `'us-ft'`.
 * @enum {string}
 */
ol.proj.Units = {
  DEGREES: 'degrees',
  FEET: 'ft',
  METERS: 'm',
  PIXELS: 'pixels',
  TILE_PIXELS: 'tile-pixels',
  USFEET: 'us-ft'
};


/**
 * Meters per unit lookup table.
 * @const
 * @type {Object.<ol.proj.Units, number>}
 * @api stable
 */
ol.proj.METERS_PER_UNIT = {};
ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES] =
    2 * Math.PI * ol.sphere.NORMAL.radius / 360;
ol.proj.METERS_PER_UNIT[ol.proj.Units.FEET] = 0.3048;
ol.proj.METERS_PER_UNIT[ol.proj.Units.METERS] = 1;
ol.proj.METERS_PER_UNIT[ol.proj.Units.USFEET] = 1200 / 3937;


/**
 * @classdesc
 * Projection definition class. One of these is created for each projection
 * supported in the application and stored in the {@link ol.proj} namespace.
 * You can use these in applications, but this is not required, as API params
 * and options use {@link ol.ProjectionLike} which means the simple string
 * code will suffice.
 *
 * You can use {@link ol.proj.get} to retrieve the object for a particular
 * projection.
 *
 * The library includes definitions for `EPSG:4326` and `EPSG:3857`, together
 * with the following aliases:
 * * `EPSG:4326`: CRS:84, urn:ogc:def:crs:EPSG:6.6:4326,
 *     urn:ogc:def:crs:OGC:1.3:CRS84, urn:ogc:def:crs:OGC:2:84,
 *     http://www.opengis.net/gml/srs/epsg.xml#4326,
 *     urn:x-ogc:def:crs:EPSG:4326
 * * `EPSG:3857`: EPSG:102100, EPSG:102113, EPSG:900913,
 *     urn:ogc:def:crs:EPSG:6.18:3:3857,
 *     http://www.opengis.net/gml/srs/epsg.xml#3857
 *
 * If you use proj4js, aliases can be added using `proj4.defs()`; see
 * [documentation](https://github.com/proj4js/proj4js). To set an alternative
 * namespace for proj4, use {@link ol.proj.setProj4}.
 *
 * @constructor
 * @param {olx.ProjectionOptions} options Projection options.
 * @struct
 * @api stable
 */
ol.proj.Projection = function(options) {

  /**
   * @private
   * @type {string}
   */
  this.code_ = options.code;

  /**
   * @private
   * @type {ol.proj.Units}
   */
  this.units_ = /** @type {ol.proj.Units} */ (options.units);

  /**
   * @private
   * @type {ol.Extent}
   */
  this.extent_ = options.extent !== undefined ? options.extent : null;

  /**
   * @private
   * @type {ol.Extent}
   */
  this.worldExtent_ = options.worldExtent !== undefined ?
      options.worldExtent : null;

  /**
   * @private
   * @type {string}
   */
  this.axisOrientation_ = options.axisOrientation !== undefined ?
      options.axisOrientation : 'enu';

  /**
   * @private
   * @type {boolean}
   */
  this.global_ = options.global !== undefined ? options.global : false;


  /**
   * @private
   * @type {boolean}
   */
  this.canWrapX_ = !!(this.global_ && this.extent_);

  /**
  * @private
  * @type {function(number, ol.Coordinate):number}
  */
  this.getPointResolutionFunc_ = options.getPointResolution !== undefined ?
      options.getPointResolution : this.getPointResolution_;

  /**
   * @private
   * @type {ol.tilegrid.TileGrid}
   */
  this.defaultTileGrid_ = null;

  /**
   * @private
   * @type {number|undefined}
   */
  this.metersPerUnit_ = options.metersPerUnit;

  var projections = ol.proj.projections_;
  var code = options.code;
  goog.asserts.assert(code !== undefined,
      'Option "code" is required for constructing instance');
  if (ol.ENABLE_PROJ4JS) {
    var proj4js = ol.proj.proj4_ || ol.global['proj4'];
    if (typeof proj4js == 'function' && projections[code] === undefined) {
      var def = proj4js.defs(code);
      if (def !== undefined) {
        if (def.axis !== undefined && options.axisOrientation === undefined) {
          this.axisOrientation_ = def.axis;
        }
        if (options.metersPerUnit === undefined) {
          this.metersPerUnit_ = def.to_meter;
        }
        if (options.units === undefined) {
          this.units_ = def.units;
        }
        var currentCode, currentDef, currentProj, proj4Transform;
        for (currentCode in projections) {
          currentDef = proj4js.defs(currentCode);
          if (currentDef !== undefined) {
            currentProj = ol.proj.get(currentCode);
            if (currentDef === def) {
              ol.proj.addEquivalentProjections([currentProj, this]);
            } else {
              proj4Transform = proj4js(currentCode, code);
              ol.proj.addCoordinateTransforms(currentProj, this,
                  proj4Transform.forward, proj4Transform.inverse);
            }
          }
        }
      }
    }
  }

};


/**
 * @return {boolean} The projection is suitable for wrapping the x-axis
 */
ol.proj.Projection.prototype.canWrapX = function() {
  return this.canWrapX_;
};


/**
 * Get the code for this projection, e.g. 'EPSG:4326'.
 * @return {string} Code.
 * @api stable
 */
ol.proj.Projection.prototype.getCode = function() {
  return this.code_;
};


/**
 * Get the validity extent for this projection.
 * @return {ol.Extent} Extent.
 * @api stable
 */
ol.proj.Projection.prototype.getExtent = function() {
  return this.extent_;
};


/**
 * Get the units of this projection.
 * @return {ol.proj.Units} Units.
 * @api stable
 */
ol.proj.Projection.prototype.getUnits = function() {
  return this.units_;
};


/**
 * Get the amount of meters per unit of this projection.  If the projection is
 * not configured with `metersPerUnit` or a units identifier, the return is
 * `undefined`.
 * @return {number|undefined} Meters.
 * @api stable
 */
ol.proj.Projection.prototype.getMetersPerUnit = function() {
  return this.metersPerUnit_ || ol.proj.METERS_PER_UNIT[this.units_];
};


/**
 * Get the world extent for this projection.
 * @return {ol.Extent} Extent.
 * @api
 */
ol.proj.Projection.prototype.getWorldExtent = function() {
  return this.worldExtent_;
};


/**
 * Get the axis orientation of this projection.
 * Example values are:
 * enu - the default easting, northing, elevation.
 * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
 *     or south orientated transverse mercator.
 * wnu - westing, northing, up - some planetary coordinate systems have
 *     "west positive" coordinate systems
 * @return {string} Axis orientation.
 */
ol.proj.Projection.prototype.getAxisOrientation = function() {
  return this.axisOrientation_;
};


/**
 * Is this projection a global projection which spans the whole world?
 * @return {boolean} Whether the projection is global.
 * @api stable
 */
ol.proj.Projection.prototype.isGlobal = function() {
  return this.global_;
};


/**
* Set if the projection is a global projection which spans the whole world
* @param {boolean} global Whether the projection is global.
* @api stable
*/
ol.proj.Projection.prototype.setGlobal = function(global) {
  this.global_ = global;
  this.canWrapX_ = !!(global && this.extent_);
};


/**
 * @return {ol.tilegrid.TileGrid} The default tile grid.
 */
ol.proj.Projection.prototype.getDefaultTileGrid = function() {
  return this.defaultTileGrid_;
};


/**
 * @param {ol.tilegrid.TileGrid} tileGrid The default tile grid.
 */
ol.proj.Projection.prototype.setDefaultTileGrid = function(tileGrid) {
  this.defaultTileGrid_ = tileGrid;
};


/**
 * Set the validity extent for this projection.
 * @param {ol.Extent} extent Extent.
 * @api stable
 */
ol.proj.Projection.prototype.setExtent = function(extent) {
  this.extent_ = extent;
  this.canWrapX_ = !!(this.global_ && extent);
};


/**
 * Set the world extent for this projection.
 * @param {ol.Extent} worldExtent World extent
 *     [minlon, minlat, maxlon, maxlat].
 * @api
 */
ol.proj.Projection.prototype.setWorldExtent = function(worldExtent) {
  this.worldExtent_ = worldExtent;
};


/**
* Set the getPointResolution function for this projection.
* @param {function(number, ol.Coordinate):number} func Function
* @api
*/
ol.proj.Projection.prototype.setGetPointResolution = function(func) {
  this.getPointResolutionFunc_ = func;
};


/**
* Default version.
* Get the resolution of the point in degrees or distance units.
* For projections with degrees as the unit this will simply return the
* provided resolution. For other projections the point resolution is
* estimated by transforming the 'point' pixel to EPSG:4326,
* measuring its width and height on the normal sphere,
* and taking the average of the width and height.
* @param {number} resolution Nominal resolution in projection units.
* @param {ol.Coordinate} point Point to find adjusted resolution at.
* @return {number} Point resolution at point in projection units.
* @private
*/
ol.proj.Projection.prototype.getPointResolution_ = function(resolution, point) {
  var units = this.getUnits();
  if (units == ol.proj.Units.DEGREES) {
    return resolution;
  } else {
    // Estimate point resolution by transforming the center pixel to EPSG:4326,
    // measuring its width and height on the normal sphere, and taking the
    // average of the width and height.
    var toEPSG4326 = ol.proj.getTransformFromProjections(
        this, ol.proj.get('EPSG:4326'));
    var vertices = [
      point[0] - resolution / 2, point[1],
      point[0] + resolution / 2, point[1],
      point[0], point[1] - resolution / 2,
      point[0], point[1] + resolution / 2
    ];
    vertices = toEPSG4326(vertices, vertices, 2);
    var width = ol.sphere.NORMAL.haversineDistance(
        vertices.slice(0, 2), vertices.slice(2, 4));
    var height = ol.sphere.NORMAL.haversineDistance(
        vertices.slice(4, 6), vertices.slice(6, 8));
    var pointResolution = (width + height) / 2;
    var metersPerUnit = this.getMetersPerUnit();
    if (metersPerUnit !== undefined) {
      pointResolution /= metersPerUnit;
    }
    return pointResolution;
  }
};


/**
 * Get the resolution of the point in degrees or distance units.
 * For projections with degrees as the unit this will simply return the
 * provided resolution. The default for other projections is to estimate
 * the point resolution by transforming the 'point' pixel to EPSG:4326,
 * measuring its width and height on the normal sphere,
 * and taking the average of the width and height.
 * An alternative implementation may be given when constructing a
 * projection. For many local projections,
 * such a custom function will return the resolution unchanged.
 * @param {number} resolution Resolution in projection units.
 * @param {ol.Coordinate} point Point.
 * @return {number} Point resolution in projection units.
 * @api
 */
ol.proj.Projection.prototype.getPointResolution = function(resolution, point) {
  return this.getPointResolutionFunc_(resolution, point);
};


/**
 * @private
 * @type {Object.<string, ol.proj.Projection>}
 */
ol.proj.projections_ = {};


/**
 * @private
 * @type {Object.<string, Object.<string, ol.TransformFunction>>}
 */
ol.proj.transforms_ = {};


/**
 * @private
 * @type {proj4}
 */
ol.proj.proj4_ = null;


if (ol.ENABLE_PROJ4JS) {
  /**
   * Register proj4. If not explicitly registered, it will be assumed that
   * proj4js will be loaded in the global namespace. For example in a
   * browserify ES6 environment you could use:
   *
   *     import ol from 'openlayers';
   *     import proj4 from 'proj4';
   *     ol.proj.setProj4(proj4);
   *
   * @param {proj4} proj4 Proj4.
   * @api
   */
  ol.proj.setProj4 = function(proj4) {
    goog.asserts.assert(typeof proj4 == 'function',
        'proj4 argument should be a function');
    ol.proj.proj4_ = proj4;
  };
}


/**
 * Registers transformation functions that don't alter coordinates. Those allow
 * to transform between projections with equal meaning.
 *
 * @param {Array.<ol.proj.Projection>} projections Projections.
 * @api
 */
ol.proj.addEquivalentProjections = function(projections) {
  ol.proj.addProjections(projections);
  projections.forEach(function(source) {
    projections.forEach(function(destination) {
      if (source !== destination) {
        ol.proj.addTransform(source, destination, ol.proj.cloneTransform);
      }
    });
  });
};


/**
 * Registers transformation functions to convert coordinates in any projection
 * in projection1 to any projection in projection2.
 *
 * @param {Array.<ol.proj.Projection>} projections1 Projections with equal
 *     meaning.
 * @param {Array.<ol.proj.Projection>} projections2 Projections with equal
 *     meaning.
 * @param {ol.TransformFunction} forwardTransform Transformation from any
 *   projection in projection1 to any projection in projection2.
 * @param {ol.TransformFunction} inverseTransform Transform from any projection
 *   in projection2 to any projection in projection1..
 */
ol.proj.addEquivalentTransforms = function(projections1, projections2, forwardTransform, inverseTransform) {
  projections1.forEach(function(projection1) {
    projections2.forEach(function(projection2) {
      ol.proj.addTransform(projection1, projection2, forwardTransform);
      ol.proj.addTransform(projection2, projection1, inverseTransform);
    });
  });
};


/**
 * Add a Projection object to the list of supported projections that can be
 * looked up by their code.
 *
 * @param {ol.proj.Projection} projection Projection instance.
 * @api stable
 */
ol.proj.addProjection = function(projection) {
  ol.proj.projections_[projection.getCode()] = projection;
  ol.proj.addTransform(projection, projection, ol.proj.cloneTransform);
};


/**
 * @param {Array.<ol.proj.Projection>} projections Projections.
 */
ol.proj.addProjections = function(projections) {
  var addedProjections = [];
  projections.forEach(function(projection) {
    addedProjections.push(ol.proj.addProjection(projection));
  });
};


/**
 * FIXME empty description for jsdoc
 */
ol.proj.clearAllProjections = function() {
  ol.proj.projections_ = {};
  ol.proj.transforms_ = {};
};


/**
 * @param {ol.proj.Projection|string|undefined} projection Projection.
 * @param {string} defaultCode Default code.
 * @return {ol.proj.Projection} Projection.
 */
ol.proj.createProjection = function(projection, defaultCode) {
  if (!projection) {
    return ol.proj.get(defaultCode);
  } else if (typeof projection === 'string') {
    return ol.proj.get(projection);
  } else {
    goog.asserts.assertInstanceof(projection, ol.proj.Projection,
        'projection should be an ol.proj.Projection');
    return projection;
  }
};


/**
 * Registers a conversion function to convert coordinates from the source
 * projection to the destination projection.
 *
 * @param {ol.proj.Projection} source Source.
 * @param {ol.proj.Projection} destination Destination.
 * @param {ol.TransformFunction} transformFn Transform.
 */
ol.proj.addTransform = function(source, destination, transformFn) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  var transforms = ol.proj.transforms_;
  if (!(sourceCode in transforms)) {
    transforms[sourceCode] = {};
  }
  transforms[sourceCode][destinationCode] = transformFn;
};


/**
 * Registers coordinate transform functions to convert coordinates between the
 * source projection and the destination projection.
 * The forward and inverse functions convert coordinate pairs; this function
 * converts these into the functions used internally which also handle
 * extents and coordinate arrays.
 *
 * @param {ol.ProjectionLike} source Source projection.
 * @param {ol.ProjectionLike} destination Destination projection.
 * @param {function(ol.Coordinate): ol.Coordinate} forward The forward transform
 *     function (that is, from the source projection to the destination
 *     projection) that takes a {@link ol.Coordinate} as argument and returns
 *     the transformed {@link ol.Coordinate}.
 * @param {function(ol.Coordinate): ol.Coordinate} inverse The inverse transform
 *     function (that is, from the destination projection to the source
 *     projection) that takes a {@link ol.Coordinate} as argument and returns
 *     the transformed {@link ol.Coordinate}.
 * @api stable
 */
ol.proj.addCoordinateTransforms = function(source, destination, forward, inverse) {
  var sourceProj = ol.proj.get(source);
  var destProj = ol.proj.get(destination);
  ol.proj.addTransform(sourceProj, destProj,
      ol.proj.createTransformFromCoordinateTransform(forward));
  ol.proj.addTransform(destProj, sourceProj,
      ol.proj.createTransformFromCoordinateTransform(inverse));
};


/**
 * Creates a {@link ol.TransformFunction} from a simple 2D coordinate transform
 * function.
 * @param {function(ol.Coordinate): ol.Coordinate} transform Coordinate
 *     transform.
 * @return {ol.TransformFunction} Transform function.
 */
ol.proj.createTransformFromCoordinateTransform = function(transform) {
  return (
      /**
       * @param {Array.<number>} input Input.
       * @param {Array.<number>=} opt_output Output.
       * @param {number=} opt_dimension Dimension.
       * @return {Array.<number>} Output.
       */
      function(input, opt_output, opt_dimension) {
        var length = input.length;
        var dimension = opt_dimension !== undefined ? opt_dimension : 2;
        var output = opt_output !== undefined ? opt_output : new Array(length);
        var point, i, j;
        for (i = 0; i < length; i += dimension) {
          point = transform([input[i], input[i + 1]]);
          output[i] = point[0];
          output[i + 1] = point[1];
          for (j = dimension - 1; j >= 2; --j) {
            output[i + j] = input[i + j];
          }
        }
        return output;
      });
};


/**
 * Unregisters the conversion function to convert coordinates from the source
 * projection to the destination projection.  This method is used to clean up
 * cached transforms during testing.
 *
 * @param {ol.proj.Projection} source Source projection.
 * @param {ol.proj.Projection} destination Destination projection.
 * @return {ol.TransformFunction} transformFn The unregistered transform.
 */
ol.proj.removeTransform = function(source, destination) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  var transforms = ol.proj.transforms_;
  goog.asserts.assert(sourceCode in transforms,
      'sourceCode should be in transforms');
  goog.asserts.assert(destinationCode in transforms[sourceCode],
      'destinationCode should be in transforms of sourceCode');
  var transform = transforms[sourceCode][destinationCode];
  delete transforms[sourceCode][destinationCode];
  if (ol.object.isEmpty(transforms[sourceCode])) {
    delete transforms[sourceCode];
  }
  return transform;
};


/**
 * Transforms a coordinate from longitude/latitude to a different projection.
 * @param {ol.Coordinate} coordinate Coordinate as longitude and latitude, i.e.
 *     an array with longitude as 1st and latitude as 2nd element.
 * @param {ol.ProjectionLike=} opt_projection Target projection. The
 *     default is Web Mercator, i.e. 'EPSG:3857'.
 * @return {ol.Coordinate} Coordinate projected to the target projection.
 * @api stable
 */
ol.proj.fromLonLat = function(coordinate, opt_projection) {
  return ol.proj.transform(coordinate, 'EPSG:4326',
      opt_projection !== undefined ? opt_projection : 'EPSG:3857');
};


/**
 * Transforms a coordinate to longitude/latitude.
 * @param {ol.Coordinate} coordinate Projected coordinate.
 * @param {ol.ProjectionLike=} opt_projection Projection of the coordinate.
 *     The default is Web Mercator, i.e. 'EPSG:3857'.
 * @return {ol.Coordinate} Coordinate as longitude and latitude, i.e. an array
 *     with longitude as 1st and latitude as 2nd element.
 * @api stable
 */
ol.proj.toLonLat = function(coordinate, opt_projection) {
  return ol.proj.transform(coordinate,
      opt_projection !== undefined ? opt_projection : 'EPSG:3857', 'EPSG:4326');
};


/**
 * Fetches a Projection object for the code specified.
 *
 * @param {ol.ProjectionLike} projectionLike Either a code string which is
 *     a combination of authority and identifier such as "EPSG:4326", or an
 *     existing projection object, or undefined.
 * @return {ol.proj.Projection} Projection object, or null if not in list.
 * @api stable
 */
ol.proj.get = function(projectionLike) {
  var projection;
  if (projectionLike instanceof ol.proj.Projection) {
    projection = projectionLike;
  } else if (typeof projectionLike === 'string') {
    var code = projectionLike;
    projection = ol.proj.projections_[code];
    if (ol.ENABLE_PROJ4JS) {
      var proj4js = ol.proj.proj4_ || ol.global['proj4'];
      if (projection === undefined && typeof proj4js == 'function' &&
          proj4js.defs(code) !== undefined) {
        projection = new ol.proj.Projection({code: code});
        ol.proj.addProjection(projection);
      }
    }
  } else {
    projection = null;
  }
  return projection;
};


/**
 * Checks if two projections are the same, that is every coordinate in one
 * projection does represent the same geographic point as the same coordinate in
 * the other projection.
 *
 * @param {ol.proj.Projection} projection1 Projection 1.
 * @param {ol.proj.Projection} projection2 Projection 2.
 * @return {boolean} Equivalent.
 * @api
 */
ol.proj.equivalent = function(projection1, projection2) {
  if (projection1 === projection2) {
    return true;
  }
  var equalUnits = projection1.getUnits() === projection2.getUnits();
  if (projection1.getCode() === projection2.getCode()) {
    return equalUnits;
  } else {
    var transformFn = ol.proj.getTransformFromProjections(
        projection1, projection2);
    return transformFn === ol.proj.cloneTransform && equalUnits;
  }
};


/**
 * Given the projection-like objects, searches for a transformation
 * function to convert a coordinates array from the source projection to the
 * destination projection.
 *
 * @param {ol.ProjectionLike} source Source.
 * @param {ol.ProjectionLike} destination Destination.
 * @return {ol.TransformFunction} Transform function.
 * @api stable
 */
ol.proj.getTransform = function(source, destination) {
  var sourceProjection = ol.proj.get(source);
  var destinationProjection = ol.proj.get(destination);
  return ol.proj.getTransformFromProjections(
      sourceProjection, destinationProjection);
};


/**
 * Searches in the list of transform functions for the function for converting
 * coordinates from the source projection to the destination projection.
 *
 * @param {ol.proj.Projection} sourceProjection Source Projection object.
 * @param {ol.proj.Projection} destinationProjection Destination Projection
 *     object.
 * @return {ol.TransformFunction} Transform function.
 */
ol.proj.getTransformFromProjections = function(sourceProjection, destinationProjection) {
  var transforms = ol.proj.transforms_;
  var sourceCode = sourceProjection.getCode();
  var destinationCode = destinationProjection.getCode();
  var transform;
  if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
    transform = transforms[sourceCode][destinationCode];
  }
  if (transform === undefined) {
    goog.asserts.assert(transform !== undefined, 'transform should be defined');
    transform = ol.proj.identityTransform;
  }
  return transform;
};


/**
 * @param {Array.<number>} input Input coordinate array.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension.
 * @return {Array.<number>} Input coordinate array (same array as input).
 */
ol.proj.identityTransform = function(input, opt_output, opt_dimension) {
  if (opt_output !== undefined && input !== opt_output) {
    // TODO: consider making this a warning instead
    goog.asserts.fail('This should not be used internally.');
    for (var i = 0, ii = input.length; i < ii; ++i) {
      opt_output[i] = input[i];
    }
    input = opt_output;
  }
  return input;
};


/**
 * @param {Array.<number>} input Input coordinate array.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension.
 * @return {Array.<number>} Output coordinate array (new array, same coordinate
 *     values).
 */
ol.proj.cloneTransform = function(input, opt_output, opt_dimension) {
  var output;
  if (opt_output !== undefined) {
    for (var i = 0, ii = input.length; i < ii; ++i) {
      opt_output[i] = input[i];
    }
    output = opt_output;
  } else {
    output = input.slice();
  }
  return output;
};


/**
 * Transforms a coordinate from source projection to destination projection.
 * This returns a new coordinate (and does not modify the original).
 *
 * See {@link ol.proj.transformExtent} for extent transformation.
 * See the transform method of {@link ol.geom.Geometry} and its subclasses for
 * geometry transforms.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.ProjectionLike} source Source projection-like.
 * @param {ol.ProjectionLike} destination Destination projection-like.
 * @return {ol.Coordinate} Coordinate.
 * @api stable
 */
ol.proj.transform = function(coordinate, source, destination) {
  var transformFn = ol.proj.getTransform(source, destination);
  return transformFn(coordinate, undefined, coordinate.length);
};


/**
 * Transforms an extent from source projection to destination projection.  This
 * returns a new extent (and does not modify the original).
 *
 * @param {ol.Extent} extent The extent to transform.
 * @param {ol.ProjectionLike} source Source projection-like.
 * @param {ol.ProjectionLike} destination Destination projection-like.
 * @return {ol.Extent} The transformed extent.
 * @api stable
 */
ol.proj.transformExtent = function(extent, source, destination) {
  var transformFn = ol.proj.getTransform(source, destination);
  return ol.extent.applyTransform(extent, transformFn);
};


/**
 * Transforms the given point to the destination projection.
 *
 * @param {ol.Coordinate} point Point.
 * @param {ol.proj.Projection} sourceProjection Source projection.
 * @param {ol.proj.Projection} destinationProjection Destination projection.
 * @return {ol.Coordinate} Point.
 */
ol.proj.transformWithProjections = function(point, sourceProjection, destinationProjection) {
  var transformFn = ol.proj.getTransformFromProjections(
      sourceProjection, destinationProjection);
  return transformFn(point);
};

goog.provide('ol.geom.Geometry');
goog.provide('ol.geom.GeometryLayout');
goog.provide('ol.geom.GeometryType');

goog.require('goog.asserts');
goog.require('ol.functions');
goog.require('ol.Object');
goog.require('ol.extent');
goog.require('ol.proj');
goog.require('ol.proj.Units');


/**
 * The geometry type. One of `'Point'`, `'LineString'`, `'LinearRing'`,
 * `'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`,
 * `'GeometryCollection'`, `'Circle'`.
 * @enum {string}
 */
ol.geom.GeometryType = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  LINEAR_RING: 'LinearRing',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
  CIRCLE: 'Circle'
};


/**
 * The coordinate layout for geometries, indicating whether a 3rd or 4th z ('Z')
 * or measure ('M') coordinate is available. Supported values are `'XY'`,
 * `'XYZ'`, `'XYM'`, `'XYZM'`.
 * @enum {string}
 */
ol.geom.GeometryLayout = {
  XY: 'XY',
  XYZ: 'XYZ',
  XYM: 'XYM',
  XYZM: 'XYZM'
};


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for vector geometries.
 *
 * To get notified of changes to the geometry, register a listener for the
 * generic `change` event on your geometry instance.
 *
 * @constructor
 * @extends {ol.Object}
 * @api stable
 */
ol.geom.Geometry = function() {

  ol.Object.call(this);

  /**
   * @private
   * @type {ol.Extent}
   */
  this.extent_ = ol.extent.createEmpty();

  /**
   * @private
   * @type {number}
   */
  this.extentRevision_ = -1;

  /**
   * @protected
   * @type {Object.<string, ol.geom.Geometry>}
   */
  this.simplifiedGeometryCache = {};

  /**
   * @protected
   * @type {number}
   */
  this.simplifiedGeometryMaxMinSquaredTolerance = 0;

  /**
   * @protected
   * @type {number}
   */
  this.simplifiedGeometryRevision = 0;

};
ol.inherits(ol.geom.Geometry, ol.Object);


/**
 * Make a complete copy of the geometry.
 * @function
 * @return {!ol.geom.Geometry} Clone.
 */
ol.geom.Geometry.prototype.clone = goog.abstractMethod;


/**
 * @param {number} x X.
 * @param {number} y Y.
 * @param {ol.Coordinate} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @return {number} Minimum squared distance.
 */
ol.geom.Geometry.prototype.closestPointXY = goog.abstractMethod;


/**
 * Return the closest point of the geometry to the passed point as
 * {@link ol.Coordinate coordinate}.
 * @param {ol.Coordinate} point Point.
 * @param {ol.Coordinate=} opt_closestPoint Closest point.
 * @return {ol.Coordinate} Closest point.
 * @api stable
 */
ol.geom.Geometry.prototype.getClosestPoint = function(point, opt_closestPoint) {
  var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
  this.closestPointXY(point[0], point[1], closestPoint, Infinity);
  return closestPoint;
};


/**
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {boolean} Contains coordinate.
 */
ol.geom.Geometry.prototype.containsCoordinate = function(coordinate) {
  return this.containsXY(coordinate[0], coordinate[1]);
};


/**
 * @param {ol.Extent} extent Extent.
 * @protected
 * @return {ol.Extent} extent Extent.
 */
ol.geom.Geometry.prototype.computeExtent = goog.abstractMethod;


/**
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.Geometry.prototype.containsXY = ol.functions.FALSE;


/**
 * Get the extent of the geometry.
 * @param {ol.Extent=} opt_extent Extent.
 * @return {ol.Extent} extent Extent.
 * @api stable
 */
ol.geom.Geometry.prototype.getExtent = function(opt_extent) {
  if (this.extentRevision_ != this.getRevision()) {
    this.extent_ = this.computeExtent(this.extent_);
    this.extentRevision_ = this.getRevision();
  }
  return ol.extent.returnOrUpdate(this.extent_, opt_extent);
};


/**
 * Rotate the geometry around a given coordinate. This modifies the geometry
 * coordinates in place.
 * @param {number} angle Rotation angle in radians.
 * @param {ol.Coordinate} anchor The rotation center.
 * @api
 * @function
 */
ol.geom.Geometry.prototype.rotate = goog.abstractMethod;


/**
 * Create a simplified version of this geometry.  For linestrings, this uses
 * the the {@link
 * https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
 * Douglas Peucker} algorithm.  For polygons, a quantization-based
 * simplification is used to preserve topology.
 * @function
 * @param {number} tolerance The tolerance distance for simplification.
 * @return {ol.geom.Geometry} A new, simplified version of the original
 *     geometry.
 * @api
 */
ol.geom.Geometry.prototype.simplify = function(tolerance) {
  return this.getSimplifiedGeometry(tolerance * tolerance);
};


/**
 * Create a simplified version of this geometry using the Douglas Peucker
 * algorithm.
 * @see https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
 * @function
 * @param {number} squaredTolerance Squared tolerance.
 * @return {ol.geom.Geometry} Simplified geometry.
 */
ol.geom.Geometry.prototype.getSimplifiedGeometry = goog.abstractMethod;


/**
 * Get the type of this geometry.
 * @function
 * @return {ol.geom.GeometryType} Geometry type.
 */
ol.geom.Geometry.prototype.getType = goog.abstractMethod;


/**
 * Apply a transform function to each coordinate of the geometry.
 * The geometry is modified in place.
 * If you do not want the geometry modified in place, first `clone()` it and
 * then use this function on the clone.
 * @function
 * @param {ol.TransformFunction} transformFn Transform.
 */
ol.geom.Geometry.prototype.applyTransform = goog.abstractMethod;


/**
 * Test if the geometry and the passed extent intersect.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} `true` if the geometry and the extent intersect.
 * @function
 */
ol.geom.Geometry.prototype.intersectsExtent = goog.abstractMethod;


/**
 * Translate the geometry.  This modifies the geometry coordinates in place.  If
 * instead you want a new geometry, first `clone()` this geometry.
 * @param {number} deltaX Delta X.
 * @param {number} deltaY Delta Y.
 * @function
 */
ol.geom.Geometry.prototype.translate = goog.abstractMethod;


/**
 * Transform each coordinate of the geometry from one coordinate reference
 * system to another. The geometry is modified in place.
 * For example, a line will be transformed to a line and a circle to a circle.
 * If you do not want the geometry modified in place, first `clone()` it and
 * then use this function on the clone.
 *
 * @param {ol.ProjectionLike} source The current projection.  Can be a
 *     string identifier or a {@link ol.proj.Projection} object.
 * @param {ol.ProjectionLike} destination The desired projection.  Can be a
 *     string identifier or a {@link ol.proj.Projection} object.
 * @return {ol.geom.Geometry} This geometry.  Note that original geometry is
 *     modified in place.
 * @api stable
 */
ol.geom.Geometry.prototype.transform = function(source, destination) {
  goog.asserts.assert(
      ol.proj.get(source).getUnits() !== ol.proj.Units.TILE_PIXELS &&
      ol.proj.get(destination).getUnits() !== ol.proj.Units.TILE_PIXELS,
      'cannot transform geometries with TILE_PIXELS units');
  this.applyTransform(ol.proj.getTransform(source, destination));
  return this;
};

// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Supplies a Float32Array implementation that implements
 *     most of the Float32Array spec and that can be used when a built-in
 *     implementation is not available.
 *
 *     Note that if no existing Float32Array implementation is found then
 *     this class and all its public properties are exported as Float32Array.
 *
 *     Adding support for the other TypedArray classes here does not make sense
 *     since this vector math library only needs Float32Array.
 *
 */
goog.provide('goog.vec.Float32Array');



/**
 * Constructs a new Float32Array. The new array is initialized to all zeros.
 *
 * @param {goog.vec.Float32Array|Array|ArrayBuffer|number} p0
 *     The length of the array, or an array to initialize the contents of the
 *     new Float32Array.
 * @constructor
 * @implements {IArrayLike<number>}
 * @final
 */
goog.vec.Float32Array = function(p0) {
  this.length = /** @type {number} */ (p0.length || p0);
  for (var i = 0; i < this.length; i++) {
    this[i] = p0[i] || 0;
  }
};


/**
 * The number of bytes in an element (as defined by the Typed Array
 * specification).
 *
 * @type {number}
 */
goog.vec.Float32Array.BYTES_PER_ELEMENT = 4;


/**
 * The number of bytes in an element (as defined by the Typed Array
 * specification).
 *
 * @type {number}
 */
goog.vec.Float32Array.prototype.BYTES_PER_ELEMENT = 4;


/**
 * Sets elements of the array.
 * @param {Array<number>|Float32Array} values The array of values.
 * @param {number=} opt_offset The offset in this array to start.
 */
goog.vec.Float32Array.prototype.set = function(values, opt_offset) {
  opt_offset = opt_offset || 0;
  for (var i = 0; i < values.length && opt_offset + i < this.length; i++) {
    this[opt_offset + i] = values[i];
  }
};


/**
 * Creates a string representation of this array.
 * @return {string} The string version of this array.
 * @override
 */
goog.vec.Float32Array.prototype.toString = Array.prototype.join;


/**
 * Note that we cannot implement the subarray() or (deprecated) slice()
 * methods properly since doing so would require being able to overload
 * the [] operator which is not possible in javascript.  So we leave
 * them unimplemented.  Any attempt to call these methods will just result
 * in a javascript error since we leave them undefined.
 */


/**
 * If no existing Float32Array implementation is found then we export
 * goog.vec.Float32Array as Float32Array.
 */
if (typeof Float32Array == 'undefined') {
  goog.exportProperty(
      goog.vec.Float32Array, 'BYTES_PER_ELEMENT',
      goog.vec.Float32Array.BYTES_PER_ELEMENT);
  goog.exportProperty(
      goog.vec.Float32Array.prototype, 'BYTES_PER_ELEMENT',
      goog.vec.Float32Array.prototype.BYTES_PER_ELEMENT);
  goog.exportProperty(
      goog.vec.Float32Array.prototype, 'set',
      goog.vec.Float32Array.prototype.set);
  goog.exportProperty(
      goog.vec.Float32Array.prototype, 'toString',
      goog.vec.Float32Array.prototype.toString);
  goog.exportSymbol('Float32Array', goog.vec.Float32Array);
}

// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Supplies a Float64Array implementation that implements
 * most of the Float64Array spec and that can be used when a built-in
 * implementation is not available.
 *
 * Note that if no existing Float64Array implementation is found then this
 * class and all its public properties are exported as Float64Array.
 *
 * Adding support for the other TypedArray classes here does not make sense
 * since this vector math library only needs Float32Array and Float64Array.
 *
 */
goog.provide('goog.vec.Float64Array');



/**
 * Constructs a new Float64Array. The new array is initialized to all zeros.
 *
 * @param {goog.vec.Float64Array|Array|ArrayBuffer|number} p0
 *     The length of the array, or an array to initialize the contents of the
 *     new Float64Array.
 * @constructor
 * @implements {IArrayLike<number>}
 * @final
 */
goog.vec.Float64Array = function(p0) {
  this.length = /** @type {number} */ (p0.length || p0);
  for (var i = 0; i < this.length; i++) {
    this[i] = p0[i] || 0;
  }
};


/**
 * The number of bytes in an element (as defined by the Typed Array
 * specification).
 *
 * @type {number}
 */
goog.vec.Float64Array.BYTES_PER_ELEMENT = 8;


/**
 * The number of bytes in an element (as defined by the Typed Array
 * specification).
 *
 * @type {number}
 */
goog.vec.Float64Array.prototype.BYTES_PER_ELEMENT = 8;


/**
 * Sets elements of the array.
 * @param {Array<number>|Float64Array} values The array of values.
 * @param {number=} opt_offset The offset in this array to start.
 */
goog.vec.Float64Array.prototype.set = function(values, opt_offset) {
  opt_offset = opt_offset || 0;
  for (var i = 0; i < values.length && opt_offset + i < this.length; i++) {
    this[opt_offset + i] = values[i];
  }
};


/**
 * Creates a string representation of this array.
 * @return {string} The string version of this array.
 * @override
 */
goog.vec.Float64Array.prototype.toString = Array.prototype.join;


/**
 * Note that we cannot implement the subarray() or (deprecated) slice()
 * methods properly since doing so would require being able to overload
 * the [] operator which is not possible in javascript.  So we leave
 * them unimplemented.  Any attempt to call these methods will just result
 * in a javascript error since we leave them undefined.
 */


/**
 * If no existing Float64Array implementation is found then we export
 * goog.vec.Float64Array as Float64Array.
 */
if (typeof Float64Array == 'undefined') {
  try {
    goog.exportProperty(
        goog.vec.Float64Array, 'BYTES_PER_ELEMENT',
        goog.vec.Float64Array.BYTES_PER_ELEMENT);
  } catch (float64ArrayError) {
    // Do nothing.  This code is in place to fix b/7225850, in which an error
    // is incorrectly thrown for Google TV on an old Chrome.
    // TODO(user): remove after that version is retired.
  }

  goog.exportProperty(
      goog.vec.Float64Array.prototype, 'BYTES_PER_ELEMENT',
      goog.vec.Float64Array.prototype.BYTES_PER_ELEMENT);
  goog.exportProperty(
      goog.vec.Float64Array.prototype, 'set',
      goog.vec.Float64Array.prototype.set);
  goog.exportProperty(
      goog.vec.Float64Array.prototype, 'toString',
      goog.vec.Float64Array.prototype.toString);
  goog.exportSymbol('Float64Array', goog.vec.Float64Array);
}

// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Supplies global data types and constants for the vector math
 *     library.
 */
goog.provide('goog.vec');
goog.provide('goog.vec.AnyType');
goog.provide('goog.vec.ArrayType');
goog.provide('goog.vec.Float32');
goog.provide('goog.vec.Float64');
goog.provide('goog.vec.Number');


/**
 * On platforms that don't have native Float32Array or Float64Array support we
 * use a javascript implementation so that this math library can be used on all
 * platforms.
 * @suppress {extraRequire}
 */
goog.require('goog.vec.Float32Array');
/** @suppress {extraRequire} */
goog.require('goog.vec.Float64Array');

// All vector and matrix operations are based upon arrays of numbers using
// either Float32Array, Float64Array, or a standard Javascript Array of
// Numbers.


/** @typedef {!Float32Array} */
goog.vec.Float32;


/** @typedef {!Float64Array} */
goog.vec.Float64;


/** @typedef {!Array<number>} */
goog.vec.Number;


/** @typedef {!goog.vec.Float32|!goog.vec.Float64|!goog.vec.Number} */
goog.vec.AnyType;


/**
 * @deprecated Use AnyType.
 * @typedef {!Float32Array|!Array<number>}
 */
goog.vec.ArrayType;


/**
 * For graphics work, 6 decimal places of accuracy are typically all that is
 * required.
 *
 * @type {number}
 * @const
 */
goog.vec.EPSILON = 1e-6;

// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Supplies 3 element vectors that are compatible with WebGL.
 * Each element is a float32 since that is typically the desired size of a
 * 3-vector in the GPU.  The API is structured to avoid unnecessary memory
 * allocations.  The last parameter will typically be the output vector and
 * an object can be both an input and output parameter to all methods except
 * where noted.
 *
 */
goog.provide('goog.vec.Vec3');

/** @suppress {extraRequire} */
goog.require('goog.vec');

/** @typedef {goog.vec.Float32} */ goog.vec.Vec3.Float32;
/** @typedef {goog.vec.Float64} */ goog.vec.Vec3.Float64;
/** @typedef {goog.vec.Number} */ goog.vec.Vec3.Number;
/** @typedef {goog.vec.AnyType} */ goog.vec.Vec3.AnyType;

// The following two types are deprecated - use the above types instead.
/** @typedef {Float32Array} */ goog.vec.Vec3.Type;
/** @typedef {goog.vec.ArrayType} */ goog.vec.Vec3.Vec3Like;


/**
 * Creates a 3 element vector of Float32. The array is initialized to zero.
 *
 * @return {!goog.vec.Vec3.Float32} The new 3 element array.
 */
goog.vec.Vec3.createFloat32 = function() {
  return new Float32Array(3);
};


/**
 * Creates a 3 element vector of Float64. The array is initialized to zero.
 *
 * @return {!goog.vec.Vec3.Float64} The new 3 element array.
 */
goog.vec.Vec3.createFloat64 = function() {
  return new Float64Array(3);
};


/**
 * Creates a 3 element vector of Number. The array is initialized to zero.
 *
 * @return {!goog.vec.Vec3.Number} The new 3 element array.
 */
goog.vec.Vec3.createNumber = function() {
  var a = new Array(3);
  goog.vec.Vec3.setFromValues(a, 0, 0, 0);
  return a;
};


/**
 * Creates a 3 element vector of Float32Array. The array is initialized to zero.
 *
 * @deprecated Use createFloat32.
 * @return {!goog.vec.Vec3.Type} The new 3 element array.
 */
goog.vec.Vec3.create = function() {
  return new Float32Array(3);
};


/**
 * Creates a new 3 element Float32 vector initialized with the value from the
 * given array.
 *
 * @param {goog.vec.Vec3.AnyType} vec The source 3 element array.
 * @return {!goog.vec.Vec3.Float32} The new 3 element array.
 */
goog.vec.Vec3.createFloat32FromArray = function(vec) {
  var newVec = goog.vec.Vec3.createFloat32();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
};


/**
 * Creates a new 3 element Float32 vector initialized with the supplied values.
 *
 * @param {number} v0 The value for element at index 0.
 * @param {number} v1 The value for element at index 1.
 * @param {number} v2 The value for element at index 2.
 * @return {!goog.vec.Vec3.Float32} The new vector.
 */
goog.vec.Vec3.createFloat32FromValues = function(v0, v1, v2) {
  var a = goog.vec.Vec3.createFloat32();
  goog.vec.Vec3.setFromValues(a, v0, v1, v2);
  return a;
};


/**
 * Creates a clone of the given 3 element Float32 vector.
 *
 * @param {goog.vec.Vec3.Float32} vec The source 3 element vector.
 * @return {!goog.vec.Vec3.Float32} The new cloned vector.
 */
goog.vec.Vec3.cloneFloat32 = goog.vec.Vec3.createFloat32FromArray;


/**
 * Creates a new 3 element Float64 vector initialized with the value from the
 * given array.
 *
 * @param {goog.vec.Vec3.AnyType} vec The source 3 element array.
 * @return {!goog.vec.Vec3.Float64} The new 3 element array.
 */
goog.vec.Vec3.createFloat64FromArray = function(vec) {
  var newVec = goog.vec.Vec3.createFloat64();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
};


/**
* Creates a new 3 element Float64 vector initialized with the supplied values.
*
* @param {number} v0 The value for element at index 0.
* @param {number} v1 The value for element at index 1.
* @param {number} v2 The value for element at index 2.
* @return {!goog.vec.Vec3.Float64} The new vector.
*/
goog.vec.Vec3.createFloat64FromValues = function(v0, v1, v2) {
  var vec = goog.vec.Vec3.createFloat64();
  goog.vec.Vec3.setFromValues(vec, v0, v1, v2);
  return vec;
};


/**
 * Creates a clone of the given 3 element vector.
 *
 * @param {goog.vec.Vec3.Float64} vec The source 3 element vector.
 * @return {!goog.vec.Vec3.Float64} The new cloned vector.
 */
goog.vec.Vec3.cloneFloat64 = goog.vec.Vec3.createFloat64FromArray;


/**
 * Creates a new 3 element vector initialized with the value from the given
 * array.
 *
 * @deprecated Use createFloat32FromArray.
 * @param {goog.vec.Vec3.Vec3Like} vec The source 3 element array.
 * @return {!goog.vec.Vec3.Type} The new 3 element array.
 */
goog.vec.Vec3.createFromArray = function(vec) {
  var newVec = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
};


/**
 * Creates a new 3 element vector initialized with the supplied values.
 *
 * @deprecated Use createFloat32FromValues.
 * @param {number} v0 The value for element at index 0.
 * @param {number} v1 The value for element at index 1.
 * @param {number} v2 The value for element at index 2.
 * @return {!goog.vec.Vec3.Type} The new vector.
 */
goog.vec.Vec3.createFromValues = function(v0, v1, v2) {
  var vec = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromValues(vec, v0, v1, v2);
  return vec;
};


/**
 * Creates a clone of the given 3 element vector.
 *
 * @deprecated Use cloneFloat32.
 * @param {goog.vec.Vec3.Vec3Like} vec The source 3 element vector.
 * @return {!goog.vec.Vec3.Type} The new cloned vector.
 */
goog.vec.Vec3.clone = function(vec) {
  var newVec = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromArray(newVec, vec);
  return newVec;
};


/**
 * Initializes the vector with the given values.
 *
 * @param {goog.vec.Vec3.AnyType} vec The vector to receive the values.
 * @param {number} v0 The value for element at index 0.
 * @param {number} v1 The value for element at index 1.
 * @param {number} v2 The value for element at index 2.
 * @return {!goog.vec.Vec3.AnyType} Return vec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.setFromValues = function(vec, v0, v1, v2) {
  vec[0] = v0;
  vec[1] = v1;
  vec[2] = v2;
  return vec;
};


/**
 * Initializes the vector with the given array of values.
 *
 * @param {goog.vec.Vec3.AnyType} vec The vector to receive the
 *     values.
 * @param {goog.vec.Vec3.AnyType} values The array of values.
 * @return {!goog.vec.Vec3.AnyType} Return vec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.setFromArray = function(vec, values) {
  vec[0] = values[0];
  vec[1] = values[1];
  vec[2] = values[2];
  return vec;
};


/**
 * Performs a component-wise addition of vec0 and vec1 together storing the
 * result into resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The first addend.
 * @param {goog.vec.Vec3.AnyType} vec1 The second addend.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to
 *     receive the result. May be vec0 or vec1.
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.add = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] + vec1[0];
  resultVec[1] = vec0[1] + vec1[1];
  resultVec[2] = vec0[2] + vec1[2];
  return resultVec;
};


/**
 * Performs a component-wise subtraction of vec1 from vec0 storing the
 * result into resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The minuend.
 * @param {goog.vec.Vec3.AnyType} vec1 The subtrahend.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to
 *     receive the result. May be vec0 or vec1.
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.subtract = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] - vec1[0];
  resultVec[1] = vec0[1] - vec1[1];
  resultVec[2] = vec0[2] - vec1[2];
  return resultVec;
};


/**
 * Negates vec0, storing the result into resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The vector to negate.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to
 *     receive the result. May be vec0.
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.negate = function(vec0, resultVec) {
  resultVec[0] = -vec0[0];
  resultVec[1] = -vec0[1];
  resultVec[2] = -vec0[2];
  return resultVec;
};


/**
 * Takes the absolute value of each component of vec0 storing the result in
 * resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The source vector.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the result.
 *     May be vec0.
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.abs = function(vec0, resultVec) {
  resultVec[0] = Math.abs(vec0[0]);
  resultVec[1] = Math.abs(vec0[1]);
  resultVec[2] = Math.abs(vec0[2]);
  return resultVec;
};


/**
 * Multiplies each component of vec0 with scalar storing the product into
 * resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The source vector.
 * @param {number} scalar The value to multiply with each component of vec0.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to
 *     receive the result. May be vec0.
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.scale = function(vec0, scalar, resultVec) {
  resultVec[0] = vec0[0] * scalar;
  resultVec[1] = vec0[1] * scalar;
  resultVec[2] = vec0[2] * scalar;
  return resultVec;
};


/**
 * Returns the magnitudeSquared of the given vector.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The vector.
 * @return {number} The magnitude of the vector.
 */
goog.vec.Vec3.magnitudeSquared = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2];
  return x * x + y * y + z * z;
};


/**
 * Returns the magnitude of the given vector.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The vector.
 * @return {number} The magnitude of the vector.
 */
goog.vec.Vec3.magnitude = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2];
  return Math.sqrt(x * x + y * y + z * z);
};


/**
 * Normalizes the given vector storing the result into resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The vector to normalize.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to
 *     receive the result. May be vec0.
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.normalize = function(vec0, resultVec) {
  var ilen = 1 / goog.vec.Vec3.magnitude(vec0);
  resultVec[0] = vec0[0] * ilen;
  resultVec[1] = vec0[1] * ilen;
  resultVec[2] = vec0[2] * ilen;
  return resultVec;
};


/**
 * Returns the scalar product of vectors v0 and v1.
 *
 * @param {goog.vec.Vec3.AnyType} v0 The first vector.
 * @param {goog.vec.Vec3.AnyType} v1 The second vector.
 * @return {number} The scalar product.
 */
goog.vec.Vec3.dot = function(v0, v1) {
  return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
};


/**
 * Computes the vector (cross) product of v0 and v1 storing the result into
 * resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} v0 The first vector.
 * @param {goog.vec.Vec3.AnyType} v1 The second vector.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
 *     results. May be either v0 or v1.
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.cross = function(v0, v1, resultVec) {
  var x0 = v0[0], y0 = v0[1], z0 = v0[2];
  var x1 = v1[0], y1 = v1[1], z1 = v1[2];
  resultVec[0] = y0 * z1 - z0 * y1;
  resultVec[1] = z0 * x1 - x0 * z1;
  resultVec[2] = x0 * y1 - y0 * x1;
  return resultVec;
};


/**
 * Returns the squared distance between two points.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 First point.
 * @param {goog.vec.Vec3.AnyType} vec1 Second point.
 * @return {number} The squared distance between the points.
 */
goog.vec.Vec3.distanceSquared = function(vec0, vec1) {
  var x = vec0[0] - vec1[0];
  var y = vec0[1] - vec1[1];
  var z = vec0[2] - vec1[2];
  return x * x + y * y + z * z;
};


/**
 * Returns the distance between two points.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 First point.
 * @param {goog.vec.Vec3.AnyType} vec1 Second point.
 * @return {number} The distance between the points.
 */
goog.vec.Vec3.distance = function(vec0, vec1) {
  return Math.sqrt(goog.vec.Vec3.distanceSquared(vec0, vec1));
};


/**
 * Returns a unit vector pointing from one point to another.
 * If the input points are equal then the result will be all zeros.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 Origin point.
 * @param {goog.vec.Vec3.AnyType} vec1 Target point.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
 *     results (may be vec0 or vec1).
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.direction = function(vec0, vec1, resultVec) {
  var x = vec1[0] - vec0[0];
  var y = vec1[1] - vec0[1];
  var z = vec1[2] - vec0[2];
  var d = Math.sqrt(x * x + y * y + z * z);
  if (d) {
    d = 1 / d;
    resultVec[0] = x * d;
    resultVec[1] = y * d;
    resultVec[2] = z * d;
  } else {
    resultVec[0] = resultVec[1] = resultVec[2] = 0;
  }
  return resultVec;
};


/**
 * Linearly interpolate from vec0 to v1 according to f. The value of f should be
 * in the range [0..1] otherwise the results are undefined.
 *
 * @param {goog.vec.Vec3.AnyType} v0 The first vector.
 * @param {goog.vec.Vec3.AnyType} v1 The second vector.
 * @param {number} f The interpolation factor.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
 *     results (may be v0 or v1).
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.lerp = function(v0, v1, f, resultVec) {
  var x = v0[0], y = v0[1], z = v0[2];
  resultVec[0] = (v1[0] - x) * f + x;
  resultVec[1] = (v1[1] - y) * f + y;
  resultVec[2] = (v1[2] - z) * f + z;
  return resultVec;
};


/**
 * Compares the components of vec0 with the components of another vector or
 * scalar, storing the larger values in resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The source vector.
 * @param {goog.vec.Vec3.AnyType|number} limit The limit vector or scalar.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
 *     results (may be vec0 or limit).
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.max = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.max(vec0[0], limit);
    resultVec[1] = Math.max(vec0[1], limit);
    resultVec[2] = Math.max(vec0[2], limit);
  } else {
    resultVec[0] = Math.max(vec0[0], limit[0]);
    resultVec[1] = Math.max(vec0[1], limit[1]);
    resultVec[2] = Math.max(vec0[2], limit[2]);
  }
  return resultVec;
};


/**
 * Compares the components of vec0 with the components of another vector or
 * scalar, storing the smaller values in resultVec.
 *
 * @param {goog.vec.Vec3.AnyType} vec0 The source vector.
 * @param {goog.vec.Vec3.AnyType|number} limit The limit vector or scalar.
 * @param {goog.vec.Vec3.AnyType} resultVec The vector to receive the
 *     results (may be vec0 or limit).
 * @return {!goog.vec.Vec3.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec3.min = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.min(vec0[0], limit);
    resultVec[1] = Math.min(vec0[1], limit);
    resultVec[2] = Math.min(vec0[2], limit);
  } else {
    resultVec[0] = Math.min(vec0[0], limit[0]);
    resultVec[1] = Math.min(vec0[1], limit[1]);
    resultVec[2] = Math.min(vec0[2], limit[2]);
  }
  return resultVec;
};


/**
 * Returns true if the components of v0 are equal to the components of v1.
 *
 * @param {goog.vec.Vec3.AnyType} v0 The first vector.
 * @param {goog.vec.Vec3.AnyType} v1 The second vector.
 * @return {boolean} True if the vectors are equal, false otherwise.
 */
goog.vec.Vec3.equals = function(v0, v1) {
  return v0.length == v1.length && v0[0] == v1[0] && v0[1] == v1[1] &&
      v0[2] == v1[2];
};

// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Supplies 4 element vectors that are compatible with WebGL.
 * Each element is a float32 since that is typically the desired size of a
 * 4-vector in the GPU.  The API is structured to avoid unnecessary memory
 * allocations.  The last parameter will typically be the output vector and
 * an object can be both an input and output parameter to all methods except
 * where noted.
 *
 */
goog.provide('goog.vec.Vec4');

/** @suppress {extraRequire} */
goog.require('goog.vec');

/** @typedef {goog.vec.Float32} */ goog.vec.Vec4.Float32;
/** @typedef {goog.vec.Float64} */ goog.vec.Vec4.Float64;
/** @typedef {goog.vec.Number} */ goog.vec.Vec4.Number;
/** @typedef {goog.vec.AnyType} */ goog.vec.Vec4.AnyType;

// The following two types are deprecated - use the above types instead.
/** @typedef {Float32Array} */ goog.vec.Vec4.Type;
/** @typedef {goog.vec.ArrayType} */ goog.vec.Vec4.Vec4Like;


/**
 * Creates a 4 element vector of Float32. The array is initialized to zero.
 *
 * @return {!goog.vec.Vec4.Float32} The new 3 element array.
 */
goog.vec.Vec4.createFloat32 = function() {
  return new Float32Array(4);
};


/**
 * Creates a 4 element vector of Float64. The array is initialized to zero.
 *
 * @return {!goog.vec.Vec4.Float64} The new 4 element array.
 */
goog.vec.Vec4.createFloat64 = function() {
  return new Float64Array(4);
};


/**
 * Creates a 4 element vector of Number. The array is initialized to zero.
 *
 * @return {!goog.vec.Vec4.Number} The new 4 element array.
 */
goog.vec.Vec4.createNumber = function() {
  var v = new Array(4);
  goog.vec.Vec4.setFromValues(v, 0, 0, 0, 0);
  return v;
};


/**
 * Creates a 4 element vector of Float32Array. The array is initialized to zero.
 *
 * @deprecated Use createFloat32.
 * @return {!goog.vec.Vec4.Type} The new 4 element array.
 */
goog.vec.Vec4.create = function() {
  return new Float32Array(4);
};


/**
 * Creates a new 4 element vector initialized with the value from the given
 * array.
 *
 * @deprecated Use createFloat32FromArray.
 * @param {goog.vec.Vec4.Vec4Like} vec The source 4 element array.
 * @return {!goog.vec.Vec4.Type} The new 4 element array.
 */
goog.vec.Vec4.createFromArray = function(vec) {
  var newVec = goog.vec.Vec4.create();
  goog.vec.Vec4.setFromArray(newVec, vec);
  return newVec;
};


/**
 * Creates a new 4 element FLoat32 vector initialized with the value from the
 * given array.
 *
 * @param {goog.vec.Vec4.AnyType} vec The source 3 element array.
 * @return {!goog.vec.Vec4.Float32} The new 3 element array.
 */
goog.vec.Vec4.createFloat32FromArray = function(vec) {
  var newVec = goog.vec.Vec4.createFloat32();
  goog.vec.Vec4.setFromArray(newVec, vec);
  return newVec;
};


/**
 * Creates a new 4 element Float32 vector initialized with the supplied values.
 *
 * @param {number} v0 The value for element at index 0.
 * @param {number} v1 The value for element at index 1.
 * @param {number} v2 The value for element at index 2.
 * @param {number} v3 The value for element at index 3.
 * @return {!goog.vec.Vec4.Float32} The new vector.
 */
goog.vec.Vec4.createFloat32FromValues = function(v0, v1, v2, v3) {
  var vec = goog.vec.Vec4.createFloat32();
  goog.vec.Vec4.setFromValues(vec, v0, v1, v2, v3);
  return vec;
};


/**
 * Creates a clone of the given 4 element Float32 vector.
 *
 * @param {goog.vec.Vec4.Float32} vec The source 3 element vector.
 * @return {!goog.vec.Vec4.Float32} The new cloned vector.
 */
goog.vec.Vec4.cloneFloat32 = goog.vec.Vec4.createFloat32FromArray;


/**
 * Creates a new 4 element Float64 vector initialized with the value from the
 * given array.
 *
 * @param {goog.vec.Vec4.AnyType} vec The source 4 element array.
 * @return {!goog.vec.Vec4.Float64} The new 4 element array.
 */
goog.vec.Vec4.createFloat64FromArray = function(vec) {
  var newVec = goog.vec.Vec4.createFloat64();
  goog.vec.Vec4.setFromArray(newVec, vec);
  return newVec;
};


/**
* Creates a new 4 element Float64 vector initialized with the supplied values.
*
* @param {number} v0 The value for element at index 0.
* @param {number} v1 The value for element at index 1.
* @param {number} v2 The value for element at index 2.
* @param {number} v3 The value for element at index 3.
* @return {!goog.vec.Vec4.Float64} The new vector.
*/
goog.vec.Vec4.createFloat64FromValues = function(v0, v1, v2, v3) {
  var vec = goog.vec.Vec4.createFloat64();
  goog.vec.Vec4.setFromValues(vec, v0, v1, v2, v3);
  return vec;
};


/**
 * Creates a clone of the given 4 element vector.
 *
 * @param {goog.vec.Vec4.Float64} vec The source 4 element vector.
 * @return {!goog.vec.Vec4.Float64} The new cloned vector.
 */
goog.vec.Vec4.cloneFloat64 = goog.vec.Vec4.createFloat64FromArray;


/**
 * Creates a new 4 element vector initialized with the supplied values.
 *
 * @deprecated Use createFloat32FromValues.
 * @param {number} v0 The value for element at index 0.
 * @param {number} v1 The value for element at index 1.
 * @param {number} v2 The value for element at index 2.
 * @param {number} v3 The value for element at index 3.
 * @return {!goog.vec.Vec4.Type} The new vector.
 */
goog.vec.Vec4.createFromValues = function(v0, v1, v2, v3) {
  var vec = goog.vec.Vec4.create();
  goog.vec.Vec4.setFromValues(vec, v0, v1, v2, v3);
  return vec;
};


/**
 * Creates a clone of the given 4 element vector.
 *
 * @deprecated Use cloneFloat32.
 * @param {goog.vec.Vec4.Vec4Like} vec The source 4 element vector.
 * @return {!goog.vec.Vec4.Type} The new cloned vector.
 */
goog.vec.Vec4.clone = goog.vec.Vec4.createFromArray;


/**
 * Initializes the vector with the given values.
 *
 * @param {goog.vec.Vec4.AnyType} vec The vector to receive the values.
 * @param {number} v0 The value for element at index 0.
 * @param {number} v1 The value for element at index 1.
 * @param {number} v2 The value for element at index 2.
 * @param {number} v3 The value for element at index 3.
 * @return {!goog.vec.Vec4.AnyType} Return vec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.setFromValues = function(vec, v0, v1, v2, v3) {
  vec[0] = v0;
  vec[1] = v1;
  vec[2] = v2;
  vec[3] = v3;
  return vec;
};


/**
 * Initializes the vector with the given array of values.
 *
 * @param {goog.vec.Vec4.AnyType} vec The vector to receive the
 *     values.
 * @param {goog.vec.Vec4.AnyType} values The array of values.
 * @return {!goog.vec.Vec4.AnyType} Return vec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.setFromArray = function(vec, values) {
  vec[0] = values[0];
  vec[1] = values[1];
  vec[2] = values[2];
  vec[3] = values[3];
  return vec;
};


/**
 * Performs a component-wise addition of vec0 and vec1 together storing the
 * result into resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The first addend.
 * @param {goog.vec.Vec4.AnyType} vec1 The second addend.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to
 *     receive the result. May be vec0 or vec1.
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.add = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] + vec1[0];
  resultVec[1] = vec0[1] + vec1[1];
  resultVec[2] = vec0[2] + vec1[2];
  resultVec[3] = vec0[3] + vec1[3];
  return resultVec;
};


/**
 * Performs a component-wise subtraction of vec1 from vec0 storing the
 * result into resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The minuend.
 * @param {goog.vec.Vec4.AnyType} vec1 The subtrahend.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to
 *     receive the result. May be vec0 or vec1.
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.subtract = function(vec0, vec1, resultVec) {
  resultVec[0] = vec0[0] - vec1[0];
  resultVec[1] = vec0[1] - vec1[1];
  resultVec[2] = vec0[2] - vec1[2];
  resultVec[3] = vec0[3] - vec1[3];
  return resultVec;
};


/**
 * Negates vec0, storing the result into resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The vector to negate.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to
 *     receive the result. May be vec0.
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.negate = function(vec0, resultVec) {
  resultVec[0] = -vec0[0];
  resultVec[1] = -vec0[1];
  resultVec[2] = -vec0[2];
  resultVec[3] = -vec0[3];
  return resultVec;
};


/**
 * Takes the absolute value of each component of vec0 storing the result in
 * resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The source vector.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the result.
 *     May be vec0.
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.abs = function(vec0, resultVec) {
  resultVec[0] = Math.abs(vec0[0]);
  resultVec[1] = Math.abs(vec0[1]);
  resultVec[2] = Math.abs(vec0[2]);
  resultVec[3] = Math.abs(vec0[3]);
  return resultVec;
};


/**
 * Multiplies each component of vec0 with scalar storing the product into
 * resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The source vector.
 * @param {number} scalar The value to multiply with each component of vec0.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to
 *     receive the result. May be vec0.
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.scale = function(vec0, scalar, resultVec) {
  resultVec[0] = vec0[0] * scalar;
  resultVec[1] = vec0[1] * scalar;
  resultVec[2] = vec0[2] * scalar;
  resultVec[3] = vec0[3] * scalar;
  return resultVec;
};


/**
 * Returns the magnitudeSquared of the given vector.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The vector.
 * @return {number} The magnitude of the vector.
 */
goog.vec.Vec4.magnitudeSquared = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2], w = vec0[3];
  return x * x + y * y + z * z + w * w;
};


/**
 * Returns the magnitude of the given vector.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The vector.
 * @return {number} The magnitude of the vector.
 */
goog.vec.Vec4.magnitude = function(vec0) {
  var x = vec0[0], y = vec0[1], z = vec0[2], w = vec0[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
};


/**
 * Normalizes the given vector storing the result into resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The vector to normalize.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to
 *     receive the result. May be vec0.
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.normalize = function(vec0, resultVec) {
  var ilen = 1 / goog.vec.Vec4.magnitude(vec0);
  resultVec[0] = vec0[0] * ilen;
  resultVec[1] = vec0[1] * ilen;
  resultVec[2] = vec0[2] * ilen;
  resultVec[3] = vec0[3] * ilen;
  return resultVec;
};


/**
 * Returns the scalar product of vectors v0 and v1.
 *
 * @param {goog.vec.Vec4.AnyType} v0 The first vector.
 * @param {goog.vec.Vec4.AnyType} v1 The second vector.
 * @return {number} The scalar product.
 */
goog.vec.Vec4.dot = function(v0, v1) {
  return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2] + v0[3] * v1[3];
};


/**
 * Linearly interpolate from v0 to v1 according to f. The value of f should be
 * in the range [0..1] otherwise the results are undefined.
 *
 * @param {goog.vec.Vec4.AnyType} v0 The first vector.
 * @param {goog.vec.Vec4.AnyType} v1 The second vector.
 * @param {number} f The interpolation factor.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the
 *     results (may be v0 or v1).
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.lerp = function(v0, v1, f, resultVec) {
  var x = v0[0], y = v0[1], z = v0[2], w = v0[3];
  resultVec[0] = (v1[0] - x) * f + x;
  resultVec[1] = (v1[1] - y) * f + y;
  resultVec[2] = (v1[2] - z) * f + z;
  resultVec[3] = (v1[3] - w) * f + w;
  return resultVec;
};


/**
 * Compares the components of vec0 with the components of another vector or
 * scalar, storing the larger values in resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The source vector.
 * @param {goog.vec.Vec4.AnyType|number} limit The limit vector or scalar.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the
 *     results (may be vec0 or limit).
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.max = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.max(vec0[0], limit);
    resultVec[1] = Math.max(vec0[1], limit);
    resultVec[2] = Math.max(vec0[2], limit);
    resultVec[3] = Math.max(vec0[3], limit);
  } else {
    resultVec[0] = Math.max(vec0[0], limit[0]);
    resultVec[1] = Math.max(vec0[1], limit[1]);
    resultVec[2] = Math.max(vec0[2], limit[2]);
    resultVec[3] = Math.max(vec0[3], limit[3]);
  }
  return resultVec;
};


/**
 * Compares the components of vec0 with the components of another vector or
 * scalar, storing the smaller values in resultVec.
 *
 * @param {goog.vec.Vec4.AnyType} vec0 The source vector.
 * @param {goog.vec.Vec4.AnyType|number} limit The limit vector or scalar.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to receive the
 *     results (may be vec0 or limit).
 * @return {!goog.vec.Vec4.AnyType} Return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Vec4.min = function(vec0, limit, resultVec) {
  if (goog.isNumber(limit)) {
    resultVec[0] = Math.min(vec0[0], limit);
    resultVec[1] = Math.min(vec0[1], limit);
    resultVec[2] = Math.min(vec0[2], limit);
    resultVec[3] = Math.min(vec0[3], limit);
  } else {
    resultVec[0] = Math.min(vec0[0], limit[0]);
    resultVec[1] = Math.min(vec0[1], limit[1]);
    resultVec[2] = Math.min(vec0[2], limit[2]);
    resultVec[3] = Math.min(vec0[3], limit[3]);
  }
  return resultVec;
};


/**
 * Returns true if the components of v0 are equal to the components of v1.
 *
 * @param {goog.vec.Vec4.AnyType} v0 The first vector.
 * @param {goog.vec.Vec4.AnyType} v1 The second vector.
 * @return {boolean} True if the vectors are equal, false otherwise.
 */
goog.vec.Vec4.equals = function(v0, v1) {
  return v0.length == v1.length && v0[0] == v1[0] && v0[1] == v1[1] &&
      v0[2] == v1[2] && v0[3] == v1[3];
};

// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Implements 4x4 matrices and their related functions which are
 * compatible with WebGL. The API is structured to avoid unnecessary memory
 * allocations.  The last parameter will typically be the output vector and
 * an object can be both an input and output parameter to all methods except
 * where noted. Matrix operations follow the mathematical form when multiplying
 * vectors as follows: resultVec = matrix * vec.
 *
 * The matrices are stored in column-major order.
 *
 */
goog.provide('goog.vec.Mat4');

goog.require('goog.vec');
goog.require('goog.vec.Vec3');
goog.require('goog.vec.Vec4');


/** @typedef {goog.vec.Float32} */ goog.vec.Mat4.Float32;
/** @typedef {goog.vec.Float64} */ goog.vec.Mat4.Float64;
/** @typedef {goog.vec.Number} */ goog.vec.Mat4.Number;
/** @typedef {goog.vec.AnyType} */ goog.vec.Mat4.AnyType;

// The following two types are deprecated - use the above types instead.
/** @typedef {!Float32Array} */ goog.vec.Mat4.Type;
/** @typedef {goog.vec.ArrayType} */ goog.vec.Mat4.Mat4Like;


/**
 * Creates the array representation of a 4x4 matrix of Float32.
 * The use of the array directly instead of a class reduces overhead.
 * The returned matrix is cleared to all zeros.
 *
 * @return {!goog.vec.Mat4.Float32} The new matrix.
 */
goog.vec.Mat4.createFloat32 = function() {
  return new Float32Array(16);
};


/**
 * Creates the array representation of a 4x4 matrix of Float64.
 * The returned matrix is cleared to all zeros.
 *
 * @return {!goog.vec.Mat4.Float64} The new matrix.
 */
goog.vec.Mat4.createFloat64 = function() {
  return new Float64Array(16);
};


/**
 * Creates the array representation of a 4x4 matrix of Number.
 * The returned matrix is cleared to all zeros.
 *
 * @return {!goog.vec.Mat4.Number} The new matrix.
 */
goog.vec.Mat4.createNumber = function() {
  var a = new Array(16);
  goog.vec.Mat4.setFromValues(
      a, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  return a;
};


/**
 * Creates the array representation of a 4x4 matrix of Float32.
 * The returned matrix is cleared to all zeros.
 *
 * @deprecated Use createFloat32.
 * @return {!goog.vec.Mat4.Type} The new matrix.
 */
goog.vec.Mat4.create = function() {
  return goog.vec.Mat4.createFloat32();
};


/**
 * Creates a 4x4 identity matrix of Float32.
 *
 * @return {!goog.vec.Mat4.Float32} The new 16 element array.
 */
goog.vec.Mat4.createFloat32Identity = function() {
  var mat = goog.vec.Mat4.createFloat32();
  mat[0] = mat[5] = mat[10] = mat[15] = 1;
  return mat;
};


/**
 * Creates a 4x4 identity matrix of Float64.
 *
 * @return {!goog.vec.Mat4.Float64} The new 16 element array.
 */
goog.vec.Mat4.createFloat64Identity = function() {
  var mat = goog.vec.Mat4.createFloat64();
  mat[0] = mat[5] = mat[10] = mat[15] = 1;
  return mat;
};


/**
 * Creates a 4x4 identity matrix of Number.
 * The returned matrix is cleared to all zeros.
 *
 * @return {!goog.vec.Mat4.Number} The new 16 element array.
 */
goog.vec.Mat4.createNumberIdentity = function() {
  var a = new Array(16);
  goog.vec.Mat4.setFromValues(
      a, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  return a;
};


/**
 * Creates the array representation of a 4x4 matrix of Float32.
 * The returned matrix is cleared to all zeros.
 *
 * @deprecated Use createFloat32Identity.
 * @return {!goog.vec.Mat4.Type} The new 16 element array.
 */
goog.vec.Mat4.createIdentity = function() {
  return goog.vec.Mat4.createFloat32Identity();
};


/**
 * Creates a 4x4 matrix of Float32 initialized from the given array.
 *
 * @param {goog.vec.Mat4.AnyType} matrix The array containing the
 *     matrix values in column major order.
 * @return {!goog.vec.Mat4.Float32} The new, 16 element array.
 */
goog.vec.Mat4.createFloat32FromArray = function(matrix) {
  var newMatrix = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromArray(newMatrix, matrix);
  return newMatrix;
};


/**
 * Creates a 4x4 matrix of Float32 initialized from the given values.
 *
 * @param {number} v00 The values at (0, 0).
 * @param {number} v10 The values at (1, 0).
 * @param {number} v20 The values at (2, 0).
 * @param {number} v30 The values at (3, 0).
 * @param {number} v01 The values at (0, 1).
 * @param {number} v11 The values at (1, 1).
 * @param {number} v21 The values at (2, 1).
 * @param {number} v31 The values at (3, 1).
 * @param {number} v02 The values at (0, 2).
 * @param {number} v12 The values at (1, 2).
 * @param {number} v22 The values at (2, 2).
 * @param {number} v32 The values at (3, 2).
 * @param {number} v03 The values at (0, 3).
 * @param {number} v13 The values at (1, 3).
 * @param {number} v23 The values at (2, 3).
 * @param {number} v33 The values at (3, 3).
 * @return {!goog.vec.Mat4.Float32} The new, 16 element array.
 */
goog.vec.Mat4.createFloat32FromValues = function(
    v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23,
    v33) {
  var newMatrix = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromValues(
      newMatrix, v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32,
      v03, v13, v23, v33);
  return newMatrix;
};


/**
 * Creates a clone of a 4x4 matrix of Float32.
 *
 * @param {goog.vec.Mat4.Float32} matrix The source 4x4 matrix.
 * @return {!goog.vec.Mat4.Float32} The new 4x4 element matrix.
 */
goog.vec.Mat4.cloneFloat32 = goog.vec.Mat4.createFloat32FromArray;


/**
 * Creates a 4x4 matrix of Float64 initialized from the given array.
 *
 * @param {goog.vec.Mat4.AnyType} matrix The array containing the
 *     matrix values in column major order.
 * @return {!goog.vec.Mat4.Float64} The new, nine element array.
 */
goog.vec.Mat4.createFloat64FromArray = function(matrix) {
  var newMatrix = goog.vec.Mat4.createFloat64();
  goog.vec.Mat4.setFromArray(newMatrix, matrix);
  return newMatrix;
};


/**
 * Creates a 4x4 matrix of Float64 initialized from the given values.
 *
 * @param {number} v00 The values at (0, 0).
 * @param {number} v10 The values at (1, 0).
 * @param {number} v20 The values at (2, 0).
 * @param {number} v30 The values at (3, 0).
 * @param {number} v01 The values at (0, 1).
 * @param {number} v11 The values at (1, 1).
 * @param {number} v21 The values at (2, 1).
 * @param {number} v31 The values at (3, 1).
 * @param {number} v02 The values at (0, 2).
 * @param {number} v12 The values at (1, 2).
 * @param {number} v22 The values at (2, 2).
 * @param {number} v32 The values at (3, 2).
 * @param {number} v03 The values at (0, 3).
 * @param {number} v13 The values at (1, 3).
 * @param {number} v23 The values at (2, 3).
 * @param {number} v33 The values at (3, 3).
 * @return {!goog.vec.Mat4.Float64} The new, 16 element array.
 */
goog.vec.Mat4.createFloat64FromValues = function(
    v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23,
    v33) {
  var newMatrix = goog.vec.Mat4.createFloat64();
  goog.vec.Mat4.setFromValues(
      newMatrix, v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32,
      v03, v13, v23, v33);
  return newMatrix;
};


/**
 * Creates a clone of a 4x4 matrix of Float64.
 *
 * @param {goog.vec.Mat4.Float64} matrix The source 4x4 matrix.
 * @return {!goog.vec.Mat4.Float64} The new 4x4 element matrix.
 */
goog.vec.Mat4.cloneFloat64 = goog.vec.Mat4.createFloat64FromArray;


/**
 * Creates a 4x4 matrix of Float32 initialized from the given array.
 *
 * @deprecated Use createFloat32FromArray.
 * @param {goog.vec.Mat4.Mat4Like} matrix The array containing the
 *     matrix values in column major order.
 * @return {!goog.vec.Mat4.Type} The new, nine element array.
 */
goog.vec.Mat4.createFromArray = function(matrix) {
  var newMatrix = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromArray(newMatrix, matrix);
  return newMatrix;
};


/**
 * Creates a 4x4 matrix of Float32 initialized from the given values.
 *
 * @deprecated Use createFloat32FromValues.
 * @param {number} v00 The values at (0, 0).
 * @param {number} v10 The values at (1, 0).
 * @param {number} v20 The values at (2, 0).
 * @param {number} v30 The values at (3, 0).
 * @param {number} v01 The values at (0, 1).
 * @param {number} v11 The values at (1, 1).
 * @param {number} v21 The values at (2, 1).
 * @param {number} v31 The values at (3, 1).
 * @param {number} v02 The values at (0, 2).
 * @param {number} v12 The values at (1, 2).
 * @param {number} v22 The values at (2, 2).
 * @param {number} v32 The values at (3, 2).
 * @param {number} v03 The values at (0, 3).
 * @param {number} v13 The values at (1, 3).
 * @param {number} v23 The values at (2, 3).
 * @param {number} v33 The values at (3, 3).
 * @return {!goog.vec.Mat4.Type} The new, 16 element array.
 */
goog.vec.Mat4.createFromValues = function(
    v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23,
    v33) {
  return goog.vec.Mat4.createFloat32FromValues(
      v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23,
      v33);
};


/**
 * Creates a clone of a 4x4 matrix of Float32.
 *
 * @deprecated Use cloneFloat32.
 * @param {goog.vec.Mat4.Mat4Like} matrix The source 4x4 matrix.
 * @return {!goog.vec.Mat4.Type} The new 4x4 element matrix.
 */
goog.vec.Mat4.clone = goog.vec.Mat4.createFromArray;


/**
 * Retrieves the element at the requested row and column.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix containing the
 *     value to retrieve.
 * @param {number} row The row index.
 * @param {number} column The column index.
 * @return {number} The element value at the requested row, column indices.
 */
goog.vec.Mat4.getElement = function(mat, row, column) {
  return mat[row + column * 4];
};


/**
 * Sets the element at the requested row and column.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to set the value on.
 * @param {number} row The row index.
 * @param {number} column The column index.
 * @param {number} value The value to set at the requested row, column.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setElement = function(mat, row, column, value) {
  mat[row + column * 4] = value;
  return mat;
};


/**
 * Initializes the matrix from the set of values. Note the values supplied are
 * in column major order.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the
 *     values.
 * @param {number} v00 The values at (0, 0).
 * @param {number} v10 The values at (1, 0).
 * @param {number} v20 The values at (2, 0).
 * @param {number} v30 The values at (3, 0).
 * @param {number} v01 The values at (0, 1).
 * @param {number} v11 The values at (1, 1).
 * @param {number} v21 The values at (2, 1).
 * @param {number} v31 The values at (3, 1).
 * @param {number} v02 The values at (0, 2).
 * @param {number} v12 The values at (1, 2).
 * @param {number} v22 The values at (2, 2).
 * @param {number} v32 The values at (3, 2).
 * @param {number} v03 The values at (0, 3).
 * @param {number} v13 The values at (1, 3).
 * @param {number} v23 The values at (2, 3).
 * @param {number} v33 The values at (3, 3).
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setFromValues = function(
    mat, v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13,
    v23, v33) {
  mat[0] = v00;
  mat[1] = v10;
  mat[2] = v20;
  mat[3] = v30;
  mat[4] = v01;
  mat[5] = v11;
  mat[6] = v21;
  mat[7] = v31;
  mat[8] = v02;
  mat[9] = v12;
  mat[10] = v22;
  mat[11] = v32;
  mat[12] = v03;
  mat[13] = v13;
  mat[14] = v23;
  mat[15] = v33;
  return mat;
};


/**
 * Sets the matrix from the array of values stored in column major order.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {goog.vec.Mat4.AnyType} values The column major ordered
 *     array of values to store in the matrix.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setFromArray = function(mat, values) {
  mat[0] = values[0];
  mat[1] = values[1];
  mat[2] = values[2];
  mat[3] = values[3];
  mat[4] = values[4];
  mat[5] = values[5];
  mat[6] = values[6];
  mat[7] = values[7];
  mat[8] = values[8];
  mat[9] = values[9];
  mat[10] = values[10];
  mat[11] = values[11];
  mat[12] = values[12];
  mat[13] = values[13];
  mat[14] = values[14];
  mat[15] = values[15];
  return mat;
};


/**
 * Sets the matrix from the array of values stored in row major order.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {goog.vec.Mat4.AnyType} values The row major ordered array of
 *     values to store in the matrix.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setFromRowMajorArray = function(mat, values) {
  mat[0] = values[0];
  mat[1] = values[4];
  mat[2] = values[8];
  mat[3] = values[12];

  mat[4] = values[1];
  mat[5] = values[5];
  mat[6] = values[9];
  mat[7] = values[13];

  mat[8] = values[2];
  mat[9] = values[6];
  mat[10] = values[10];
  mat[11] = values[14];

  mat[12] = values[3];
  mat[13] = values[7];
  mat[14] = values[11];
  mat[15] = values[15];

  return mat;
};


/**
 * Sets the diagonal values of the matrix from the given values.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {number} v00 The values for (0, 0).
 * @param {number} v11 The values for (1, 1).
 * @param {number} v22 The values for (2, 2).
 * @param {number} v33 The values for (3, 3).
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setDiagonalValues = function(mat, v00, v11, v22, v33) {
  mat[0] = v00;
  mat[5] = v11;
  mat[10] = v22;
  mat[15] = v33;
  return mat;
};


/**
 * Sets the diagonal values of the matrix from the given vector.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {goog.vec.Vec4.AnyType} vec The vector containing the values.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setDiagonal = function(mat, vec) {
  mat[0] = vec[0];
  mat[5] = vec[1];
  mat[10] = vec[2];
  mat[15] = vec[3];
  return mat;
};


/**
 * Gets the diagonal values of the matrix into the given vector.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix containing the values.
 * @param {goog.vec.Vec4.AnyType} vec The vector to receive the values.
 * @param {number=} opt_diagonal Which diagonal to get. A value of 0 selects the
 *     main diagonal, a positive number selects a super diagonal and a negative
 *     number selects a sub diagonal.
 * @return {goog.vec.Vec4.AnyType} return vec so that operations can be
 *     chained together.
 */
goog.vec.Mat4.getDiagonal = function(mat, vec, opt_diagonal) {
  if (!opt_diagonal) {
    // This is the most common case, so we avoid the for loop.
    vec[0] = mat[0];
    vec[1] = mat[5];
    vec[2] = mat[10];
    vec[3] = mat[15];
  } else {
    var offset = opt_diagonal > 0 ? 4 * opt_diagonal : -opt_diagonal;
    for (var i = 0; i < 4 - Math.abs(opt_diagonal); i++) {
      vec[i] = mat[offset + 5 * i];
    }
  }
  return vec;
};


/**
 * Sets the specified column with the supplied values.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {number} column The column index to set the values on.
 * @param {number} v0 The value for row 0.
 * @param {number} v1 The value for row 1.
 * @param {number} v2 The value for row 2.
 * @param {number} v3 The value for row 3.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setColumnValues = function(mat, column, v0, v1, v2, v3) {
  var i = column * 4;
  mat[i] = v0;
  mat[i + 1] = v1;
  mat[i + 2] = v2;
  mat[i + 3] = v3;
  return mat;
};


/**
 * Sets the specified column with the value from the supplied vector.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {number} column The column index to set the values on.
 * @param {goog.vec.Vec4.AnyType} vec The vector of elements for the column.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setColumn = function(mat, column, vec) {
  var i = column * 4;
  mat[i] = vec[0];
  mat[i + 1] = vec[1];
  mat[i + 2] = vec[2];
  mat[i + 3] = vec[3];
  return mat;
};


/**
 * Retrieves the specified column from the matrix into the given vector.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix supplying the values.
 * @param {number} column The column to get the values from.
 * @param {goog.vec.Vec4.AnyType} vec The vector of elements to
 *     receive the column.
 * @return {goog.vec.Vec4.AnyType} return vec so that operations can be
 *     chained together.
 */
goog.vec.Mat4.getColumn = function(mat, column, vec) {
  var i = column * 4;
  vec[0] = mat[i];
  vec[1] = mat[i + 1];
  vec[2] = mat[i + 2];
  vec[3] = mat[i + 3];
  return vec;
};


/**
 * Sets the columns of the matrix from the given vectors.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {goog.vec.Vec4.AnyType} vec0 The values for column 0.
 * @param {goog.vec.Vec4.AnyType} vec1 The values for column 1.
 * @param {goog.vec.Vec4.AnyType} vec2 The values for column 2.
 * @param {goog.vec.Vec4.AnyType} vec3 The values for column 3.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setColumns = function(mat, vec0, vec1, vec2, vec3) {
  goog.vec.Mat4.setColumn(mat, 0, vec0);
  goog.vec.Mat4.setColumn(mat, 1, vec1);
  goog.vec.Mat4.setColumn(mat, 2, vec2);
  goog.vec.Mat4.setColumn(mat, 3, vec3);
  return mat;
};


/**
 * Retrieves the column values from the given matrix into the given vectors.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix supplying the columns.
 * @param {goog.vec.Vec4.AnyType} vec0 The vector to receive column 0.
 * @param {goog.vec.Vec4.AnyType} vec1 The vector to receive column 1.
 * @param {goog.vec.Vec4.AnyType} vec2 The vector to receive column 2.
 * @param {goog.vec.Vec4.AnyType} vec3 The vector to receive column 3.
 */
goog.vec.Mat4.getColumns = function(mat, vec0, vec1, vec2, vec3) {
  goog.vec.Mat4.getColumn(mat, 0, vec0);
  goog.vec.Mat4.getColumn(mat, 1, vec1);
  goog.vec.Mat4.getColumn(mat, 2, vec2);
  goog.vec.Mat4.getColumn(mat, 3, vec3);
};


/**
 * Sets the row values from the supplied values.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {number} row The index of the row to receive the values.
 * @param {number} v0 The value for column 0.
 * @param {number} v1 The value for column 1.
 * @param {number} v2 The value for column 2.
 * @param {number} v3 The value for column 3.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setRowValues = function(mat, row, v0, v1, v2, v3) {
  mat[row] = v0;
  mat[row + 4] = v1;
  mat[row + 8] = v2;
  mat[row + 12] = v3;
  return mat;
};


/**
 * Sets the row values from the supplied vector.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the row values.
 * @param {number} row The index of the row.
 * @param {goog.vec.Vec4.AnyType} vec The vector containing the values.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setRow = function(mat, row, vec) {
  mat[row] = vec[0];
  mat[row + 4] = vec[1];
  mat[row + 8] = vec[2];
  mat[row + 12] = vec[3];
  return mat;
};


/**
 * Retrieves the row values into the given vector.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix supplying the values.
 * @param {number} row The index of the row supplying the values.
 * @param {goog.vec.Vec4.AnyType} vec The vector to receive the row.
 * @return {goog.vec.Vec4.AnyType} return vec so that operations can be
 *     chained together.
 */
goog.vec.Mat4.getRow = function(mat, row, vec) {
  vec[0] = mat[row];
  vec[1] = mat[row + 4];
  vec[2] = mat[row + 8];
  vec[3] = mat[row + 12];
  return vec;
};


/**
 * Sets the rows of the matrix from the supplied vectors.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to receive the values.
 * @param {goog.vec.Vec4.AnyType} vec0 The values for row 0.
 * @param {goog.vec.Vec4.AnyType} vec1 The values for row 1.
 * @param {goog.vec.Vec4.AnyType} vec2 The values for row 2.
 * @param {goog.vec.Vec4.AnyType} vec3 The values for row 3.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.setRows = function(mat, vec0, vec1, vec2, vec3) {
  goog.vec.Mat4.setRow(mat, 0, vec0);
  goog.vec.Mat4.setRow(mat, 1, vec1);
  goog.vec.Mat4.setRow(mat, 2, vec2);
  goog.vec.Mat4.setRow(mat, 3, vec3);
  return mat;
};


/**
 * Retrieves the rows of the matrix into the supplied vectors.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to supply the values.
 * @param {goog.vec.Vec4.AnyType} vec0 The vector to receive row 0.
 * @param {goog.vec.Vec4.AnyType} vec1 The vector to receive row 1.
 * @param {goog.vec.Vec4.AnyType} vec2 The vector to receive row 2.
 * @param {goog.vec.Vec4.AnyType} vec3 The vector to receive row 3.
 */
goog.vec.Mat4.getRows = function(mat, vec0, vec1, vec2, vec3) {
  goog.vec.Mat4.getRow(mat, 0, vec0);
  goog.vec.Mat4.getRow(mat, 1, vec1);
  goog.vec.Mat4.getRow(mat, 2, vec2);
  goog.vec.Mat4.getRow(mat, 3, vec3);
};


/**
 * Makes the given 4x4 matrix the zero matrix.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @return {!goog.vec.Mat4.AnyType} return mat so operations can be chained.
 */
goog.vec.Mat4.makeZero = function(mat) {
  mat[0] = 0;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;
  mat[4] = 0;
  mat[5] = 0;
  mat[6] = 0;
  mat[7] = 0;
  mat[8] = 0;
  mat[9] = 0;
  mat[10] = 0;
  mat[11] = 0;
  mat[12] = 0;
  mat[13] = 0;
  mat[14] = 0;
  mat[15] = 0;
  return mat;
};


/**
 * Makes the given 4x4 matrix the identity matrix.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @return {goog.vec.Mat4.AnyType} return mat so operations can be chained.
 */
goog.vec.Mat4.makeIdentity = function(mat) {
  mat[0] = 1;
  mat[1] = 0;
  mat[2] = 0;
  mat[3] = 0;
  mat[4] = 0;
  mat[5] = 1;
  mat[6] = 0;
  mat[7] = 0;
  mat[8] = 0;
  mat[9] = 0;
  mat[10] = 1;
  mat[11] = 0;
  mat[12] = 0;
  mat[13] = 0;
  mat[14] = 0;
  mat[15] = 1;
  return mat;
};


/**
 * Performs a per-component addition of the matrix mat0 and mat1, storing
 * the result into resultMat.
 *
 * @param {goog.vec.Mat4.AnyType} mat0 The first addend.
 * @param {goog.vec.Mat4.AnyType} mat1 The second addend.
 * @param {goog.vec.Mat4.AnyType} resultMat The matrix to
 *     receive the results (may be either mat0 or mat1).
 * @return {goog.vec.Mat4.AnyType} return resultMat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.addMat = function(mat0, mat1, resultMat) {
  resultMat[0] = mat0[0] + mat1[0];
  resultMat[1] = mat0[1] + mat1[1];
  resultMat[2] = mat0[2] + mat1[2];
  resultMat[3] = mat0[3] + mat1[3];
  resultMat[4] = mat0[4] + mat1[4];
  resultMat[5] = mat0[5] + mat1[5];
  resultMat[6] = mat0[6] + mat1[6];
  resultMat[7] = mat0[7] + mat1[7];
  resultMat[8] = mat0[8] + mat1[8];
  resultMat[9] = mat0[9] + mat1[9];
  resultMat[10] = mat0[10] + mat1[10];
  resultMat[11] = mat0[11] + mat1[11];
  resultMat[12] = mat0[12] + mat1[12];
  resultMat[13] = mat0[13] + mat1[13];
  resultMat[14] = mat0[14] + mat1[14];
  resultMat[15] = mat0[15] + mat1[15];
  return resultMat;
};


/**
 * Performs a per-component subtraction of the matrix mat0 and mat1,
 * storing the result into resultMat.
 *
 * @param {goog.vec.Mat4.AnyType} mat0 The minuend.
 * @param {goog.vec.Mat4.AnyType} mat1 The subtrahend.
 * @param {goog.vec.Mat4.AnyType} resultMat The matrix to receive
 *     the results (may be either mat0 or mat1).
 * @return {goog.vec.Mat4.AnyType} return resultMat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.subMat = function(mat0, mat1, resultMat) {
  resultMat[0] = mat0[0] - mat1[0];
  resultMat[1] = mat0[1] - mat1[1];
  resultMat[2] = mat0[2] - mat1[2];
  resultMat[3] = mat0[3] - mat1[3];
  resultMat[4] = mat0[4] - mat1[4];
  resultMat[5] = mat0[5] - mat1[5];
  resultMat[6] = mat0[6] - mat1[6];
  resultMat[7] = mat0[7] - mat1[7];
  resultMat[8] = mat0[8] - mat1[8];
  resultMat[9] = mat0[9] - mat1[9];
  resultMat[10] = mat0[10] - mat1[10];
  resultMat[11] = mat0[11] - mat1[11];
  resultMat[12] = mat0[12] - mat1[12];
  resultMat[13] = mat0[13] - mat1[13];
  resultMat[14] = mat0[14] - mat1[14];
  resultMat[15] = mat0[15] - mat1[15];
  return resultMat;
};


/**
 * Multiplies matrix mat with the given scalar, storing the result
 * into resultMat.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} scalar The scalar value to multiply to each element of mat.
 * @param {goog.vec.Mat4.AnyType} resultMat The matrix to receive
 *     the results (may be mat).
 * @return {goog.vec.Mat4.AnyType} return resultMat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.multScalar = function(mat, scalar, resultMat) {
  resultMat[0] = mat[0] * scalar;
  resultMat[1] = mat[1] * scalar;
  resultMat[2] = mat[2] * scalar;
  resultMat[3] = mat[3] * scalar;
  resultMat[4] = mat[4] * scalar;
  resultMat[5] = mat[5] * scalar;
  resultMat[6] = mat[6] * scalar;
  resultMat[7] = mat[7] * scalar;
  resultMat[8] = mat[8] * scalar;
  resultMat[9] = mat[9] * scalar;
  resultMat[10] = mat[10] * scalar;
  resultMat[11] = mat[11] * scalar;
  resultMat[12] = mat[12] * scalar;
  resultMat[13] = mat[13] * scalar;
  resultMat[14] = mat[14] * scalar;
  resultMat[15] = mat[15] * scalar;
  return resultMat;
};


/**
 * Multiplies the two matrices mat0 and mat1 using matrix multiplication,
 * storing the result into resultMat.
 *
 * @param {goog.vec.Mat4.AnyType} mat0 The first (left hand) matrix.
 * @param {goog.vec.Mat4.AnyType} mat1 The second (right hand) matrix.
 * @param {goog.vec.Mat4.AnyType} resultMat The matrix to receive
 *     the results (may be either mat0 or mat1).
 * @return {goog.vec.Mat4.AnyType} return resultMat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.multMat = function(mat0, mat1, resultMat) {
  var a00 = mat0[0], a10 = mat0[1], a20 = mat0[2], a30 = mat0[3];
  var a01 = mat0[4], a11 = mat0[5], a21 = mat0[6], a31 = mat0[7];
  var a02 = mat0[8], a12 = mat0[9], a22 = mat0[10], a32 = mat0[11];
  var a03 = mat0[12], a13 = mat0[13], a23 = mat0[14], a33 = mat0[15];

  var b00 = mat1[0], b10 = mat1[1], b20 = mat1[2], b30 = mat1[3];
  var b01 = mat1[4], b11 = mat1[5], b21 = mat1[6], b31 = mat1[7];
  var b02 = mat1[8], b12 = mat1[9], b22 = mat1[10], b32 = mat1[11];
  var b03 = mat1[12], b13 = mat1[13], b23 = mat1[14], b33 = mat1[15];

  resultMat[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
  resultMat[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
  resultMat[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
  resultMat[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;

  resultMat[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
  resultMat[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
  resultMat[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
  resultMat[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;

  resultMat[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
  resultMat[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
  resultMat[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
  resultMat[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;

  resultMat[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
  resultMat[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
  resultMat[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
  resultMat[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
  return resultMat;
};


/**
 * Transposes the given matrix mat storing the result into resultMat.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to transpose.
 * @param {goog.vec.Mat4.AnyType} resultMat The matrix to receive
 *     the results (may be mat).
 * @return {goog.vec.Mat4.AnyType} return resultMat so that operations can be
 *     chained together.
 */
goog.vec.Mat4.transpose = function(mat, resultMat) {
  if (resultMat == mat) {
    var a10 = mat[1], a20 = mat[2], a30 = mat[3];
    var a21 = mat[6], a31 = mat[7];
    var a32 = mat[11];
    resultMat[1] = mat[4];
    resultMat[2] = mat[8];
    resultMat[3] = mat[12];
    resultMat[4] = a10;
    resultMat[6] = mat[9];
    resultMat[7] = mat[13];
    resultMat[8] = a20;
    resultMat[9] = a21;
    resultMat[11] = mat[14];
    resultMat[12] = a30;
    resultMat[13] = a31;
    resultMat[14] = a32;
  } else {
    resultMat[0] = mat[0];
    resultMat[1] = mat[4];
    resultMat[2] = mat[8];
    resultMat[3] = mat[12];

    resultMat[4] = mat[1];
    resultMat[5] = mat[5];
    resultMat[6] = mat[9];
    resultMat[7] = mat[13];

    resultMat[8] = mat[2];
    resultMat[9] = mat[6];
    resultMat[10] = mat[10];
    resultMat[11] = mat[14];

    resultMat[12] = mat[3];
    resultMat[13] = mat[7];
    resultMat[14] = mat[11];
    resultMat[15] = mat[15];
  }
  return resultMat;
};


/**
 * Computes the determinant of the matrix.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to compute the matrix for.
 * @return {number} The determinant of the matrix.
 */
goog.vec.Mat4.determinant = function(mat) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2], m30 = mat[3];
  var m01 = mat[4], m11 = mat[5], m21 = mat[6], m31 = mat[7];
  var m02 = mat[8], m12 = mat[9], m22 = mat[10], m32 = mat[11];
  var m03 = mat[12], m13 = mat[13], m23 = mat[14], m33 = mat[15];

  var a0 = m00 * m11 - m10 * m01;
  var a1 = m00 * m21 - m20 * m01;
  var a2 = m00 * m31 - m30 * m01;
  var a3 = m10 * m21 - m20 * m11;
  var a4 = m10 * m31 - m30 * m11;
  var a5 = m20 * m31 - m30 * m21;
  var b0 = m02 * m13 - m12 * m03;
  var b1 = m02 * m23 - m22 * m03;
  var b2 = m02 * m33 - m32 * m03;
  var b3 = m12 * m23 - m22 * m13;
  var b4 = m12 * m33 - m32 * m13;
  var b5 = m22 * m33 - m32 * m23;

  return a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;
};


/**
 * Computes the inverse of mat storing the result into resultMat. If the
 * inverse is defined, this function returns true, false otherwise.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix to invert.
 * @param {goog.vec.Mat4.AnyType} resultMat The matrix to receive
 *     the result (may be mat).
 * @return {boolean} True if the inverse is defined. If false is returned,
 *     resultMat is not modified.
 */
goog.vec.Mat4.invert = function(mat, resultMat) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2], m30 = mat[3];
  var m01 = mat[4], m11 = mat[5], m21 = mat[6], m31 = mat[7];
  var m02 = mat[8], m12 = mat[9], m22 = mat[10], m32 = mat[11];
  var m03 = mat[12], m13 = mat[13], m23 = mat[14], m33 = mat[15];

  var a0 = m00 * m11 - m10 * m01;
  var a1 = m00 * m21 - m20 * m01;
  var a2 = m00 * m31 - m30 * m01;
  var a3 = m10 * m21 - m20 * m11;
  var a4 = m10 * m31 - m30 * m11;
  var a5 = m20 * m31 - m30 * m21;
  var b0 = m02 * m13 - m12 * m03;
  var b1 = m02 * m23 - m22 * m03;
  var b2 = m02 * m33 - m32 * m03;
  var b3 = m12 * m23 - m22 * m13;
  var b4 = m12 * m33 - m32 * m13;
  var b5 = m22 * m33 - m32 * m23;

  var det = a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;
  if (det == 0) {
    return false;
  }

  var idet = 1.0 / det;
  resultMat[0] = (m11 * b5 - m21 * b4 + m31 * b3) * idet;
  resultMat[1] = (-m10 * b5 + m20 * b4 - m30 * b3) * idet;
  resultMat[2] = (m13 * a5 - m23 * a4 + m33 * a3) * idet;
  resultMat[3] = (-m12 * a5 + m22 * a4 - m32 * a3) * idet;
  resultMat[4] = (-m01 * b5 + m21 * b2 - m31 * b1) * idet;
  resultMat[5] = (m00 * b5 - m20 * b2 + m30 * b1) * idet;
  resultMat[6] = (-m03 * a5 + m23 * a2 - m33 * a1) * idet;
  resultMat[7] = (m02 * a5 - m22 * a2 + m32 * a1) * idet;
  resultMat[8] = (m01 * b4 - m11 * b2 + m31 * b0) * idet;
  resultMat[9] = (-m00 * b4 + m10 * b2 - m30 * b0) * idet;
  resultMat[10] = (m03 * a4 - m13 * a2 + m33 * a0) * idet;
  resultMat[11] = (-m02 * a4 + m12 * a2 - m32 * a0) * idet;
  resultMat[12] = (-m01 * b3 + m11 * b1 - m21 * b0) * idet;
  resultMat[13] = (m00 * b3 - m10 * b1 + m20 * b0) * idet;
  resultMat[14] = (-m03 * a3 + m13 * a1 - m23 * a0) * idet;
  resultMat[15] = (m02 * a3 - m12 * a1 + m22 * a0) * idet;
  return true;
};


/**
 * Returns true if the components of mat0 are equal to the components of mat1.
 *
 * @param {goog.vec.Mat4.AnyType} mat0 The first matrix.
 * @param {goog.vec.Mat4.AnyType} mat1 The second matrix.
 * @return {boolean} True if the the two matrices are equivalent.
 */
goog.vec.Mat4.equals = function(mat0, mat1) {
  return mat0.length == mat1.length && mat0[0] == mat1[0] &&
      mat0[1] == mat1[1] && mat0[2] == mat1[2] && mat0[3] == mat1[3] &&
      mat0[4] == mat1[4] && mat0[5] == mat1[5] && mat0[6] == mat1[6] &&
      mat0[7] == mat1[7] && mat0[8] == mat1[8] && mat0[9] == mat1[9] &&
      mat0[10] == mat1[10] && mat0[11] == mat1[11] && mat0[12] == mat1[12] &&
      mat0[13] == mat1[13] && mat0[14] == mat1[14] && mat0[15] == mat1[15];
};


/**
 * Transforms the given vector with the given matrix storing the resulting,
 * transformed vector into resultVec. The input vector is multiplied against the
 * upper 3x4 matrix omitting the projective component.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix supplying the transformation.
 * @param {goog.vec.Vec3.AnyType} vec The 3 element vector to transform.
 * @param {goog.vec.Vec3.AnyType} resultVec The 3 element vector to
 *     receive the results (may be vec).
 * @return {goog.vec.Vec3.AnyType} return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Mat4.multVec3 = function(mat, vec, resultVec) {
  var x = vec[0], y = vec[1], z = vec[2];
  resultVec[0] = x * mat[0] + y * mat[4] + z * mat[8] + mat[12];
  resultVec[1] = x * mat[1] + y * mat[5] + z * mat[9] + mat[13];
  resultVec[2] = x * mat[2] + y * mat[6] + z * mat[10] + mat[14];
  return resultVec;
};


/**
 * Transforms the given vector with the given matrix storing the resulting,
 * transformed vector into resultVec. The input vector is multiplied against the
 * upper 3x3 matrix omitting the projective component and translation
 * components.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix supplying the transformation.
 * @param {goog.vec.Vec3.AnyType} vec The 3 element vector to transform.
 * @param {goog.vec.Vec3.AnyType} resultVec The 3 element vector to
 *     receive the results (may be vec).
 * @return {goog.vec.Vec3.AnyType} return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Mat4.multVec3NoTranslate = function(mat, vec, resultVec) {
  var x = vec[0], y = vec[1], z = vec[2];
  resultVec[0] = x * mat[0] + y * mat[4] + z * mat[8];
  resultVec[1] = x * mat[1] + y * mat[5] + z * mat[9];
  resultVec[2] = x * mat[2] + y * mat[6] + z * mat[10];
  return resultVec;
};


/**
 * Transforms the given vector with the given matrix storing the resulting,
 * transformed vector into resultVec. The input vector is multiplied against the
 * full 4x4 matrix with the homogeneous divide applied to reduce the 4 element
 * vector to a 3 element vector.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix supplying the transformation.
 * @param {goog.vec.Vec3.AnyType} vec The 3 element vector to transform.
 * @param {goog.vec.Vec3.AnyType} resultVec The 3 element vector
 *     to receive the results (may be vec).
 * @return {goog.vec.Vec3.AnyType} return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Mat4.multVec3Projective = function(mat, vec, resultVec) {
  var x = vec[0], y = vec[1], z = vec[2];
  var invw = 1 / (x * mat[3] + y * mat[7] + z * mat[11] + mat[15]);
  resultVec[0] = (x * mat[0] + y * mat[4] + z * mat[8] + mat[12]) * invw;
  resultVec[1] = (x * mat[1] + y * mat[5] + z * mat[9] + mat[13]) * invw;
  resultVec[2] = (x * mat[2] + y * mat[6] + z * mat[10] + mat[14]) * invw;
  return resultVec;
};


/**
 * Transforms the given vector with the given matrix storing the resulting,
 * transformed vector into resultVec.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix supplying the transformation.
 * @param {goog.vec.Vec4.AnyType} vec The vector to transform.
 * @param {goog.vec.Vec4.AnyType} resultVec The vector to
 *     receive the results (may be vec).
 * @return {goog.vec.Vec4.AnyType} return resultVec so that operations can be
 *     chained together.
 */
goog.vec.Mat4.multVec4 = function(mat, vec, resultVec) {
  var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
  resultVec[0] = x * mat[0] + y * mat[4] + z * mat[8] + w * mat[12];
  resultVec[1] = x * mat[1] + y * mat[5] + z * mat[9] + w * mat[13];
  resultVec[2] = x * mat[2] + y * mat[6] + z * mat[10] + w * mat[14];
  resultVec[3] = x * mat[3] + y * mat[7] + z * mat[11] + w * mat[15];
  return resultVec;
};


/**
 * Makes the given 4x4 matrix a translation matrix with x, y and z
 * translation factors.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} x The translation along the x axis.
 * @param {number} y The translation along the y axis.
 * @param {number} z The translation along the z axis.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeTranslate = function(mat, x, y, z) {
  goog.vec.Mat4.makeIdentity(mat);
  return goog.vec.Mat4.setColumnValues(mat, 3, x, y, z, 1);
};


/**
 * Makes the given 4x4 matrix as a scale matrix with x, y and z scale factors.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} x The scale along the x axis.
 * @param {number} y The scale along the y axis.
 * @param {number} z The scale along the z axis.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeScale = function(mat, x, y, z) {
  goog.vec.Mat4.makeIdentity(mat);
  return goog.vec.Mat4.setDiagonalValues(mat, x, y, z, 1);
};


/**
 * Makes the given 4x4 matrix a rotation matrix with the given rotation
 * angle about the axis defined by the vector (ax, ay, az).
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The rotation angle in radians.
 * @param {number} ax The x component of the rotation axis.
 * @param {number} ay The y component of the rotation axis.
 * @param {number} az The z component of the rotation axis.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeRotate = function(mat, angle, ax, ay, az) {
  var c = Math.cos(angle);
  var d = 1 - c;
  var s = Math.sin(angle);

  return goog.vec.Mat4.setFromValues(
      mat, ax * ax * d + c, ax * ay * d + az * s, ax * az * d - ay * s, 0,

      ax * ay * d - az * s, ay * ay * d + c, ay * az * d + ax * s, 0,

      ax * az * d + ay * s, ay * az * d - ax * s, az * az * d + c, 0,

      0, 0, 0, 1);
};


/**
 * Makes the given 4x4 matrix a rotation matrix with the given rotation
 * angle about the X axis.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The rotation angle in radians.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeRotateX = function(mat, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  return goog.vec.Mat4.setFromValues(
      mat, 1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
};


/**
 * Makes the given 4x4 matrix a rotation matrix with the given rotation
 * angle about the Y axis.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The rotation angle in radians.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeRotateY = function(mat, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  return goog.vec.Mat4.setFromValues(
      mat, c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
};


/**
 * Makes the given 4x4 matrix a rotation matrix with the given rotation
 * angle about the Z axis.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The rotation angle in radians.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeRotateZ = function(mat, angle) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  return goog.vec.Mat4.setFromValues(
      mat, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
};


/**
 * Makes the given 4x4 matrix a perspective projection matrix.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} left The coordinate of the left clipping plane.
 * @param {number} right The coordinate of the right clipping plane.
 * @param {number} bottom The coordinate of the bottom clipping plane.
 * @param {number} top The coordinate of the top clipping plane.
 * @param {number} near The distance to the near clipping plane.
 * @param {number} far The distance to the far clipping plane.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeFrustum = function(mat, left, right, bottom, top, near, far) {
  var x = (2 * near) / (right - left);
  var y = (2 * near) / (top - bottom);
  var a = (right + left) / (right - left);
  var b = (top + bottom) / (top - bottom);
  var c = -(far + near) / (far - near);
  var d = -(2 * far * near) / (far - near);

  return goog.vec.Mat4.setFromValues(
      mat, x, 0, 0, 0, 0, y, 0, 0, a, b, c, -1, 0, 0, d, 0);
};


/**
 * Makes the given 4x4 matrix  perspective projection matrix given a
 * field of view and aspect ratio.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} fovy The field of view along the y (vertical) axis in
 *     radians.
 * @param {number} aspect The x (width) to y (height) aspect ratio.
 * @param {number} near The distance to the near clipping plane.
 * @param {number} far The distance to the far clipping plane.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makePerspective = function(mat, fovy, aspect, near, far) {
  var angle = fovy / 2;
  var dz = far - near;
  var sinAngle = Math.sin(angle);
  if (dz == 0 || sinAngle == 0 || aspect == 0) {
    return mat;
  }

  var cot = Math.cos(angle) / sinAngle;
  return goog.vec.Mat4.setFromValues(
      mat, cot / aspect, 0, 0, 0, 0, cot, 0, 0, 0, 0, -(far + near) / dz, -1, 0,
      0, -(2 * near * far) / dz, 0);
};


/**
 * Makes the given 4x4 matrix an orthographic projection matrix.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} left The coordinate of the left clipping plane.
 * @param {number} right The coordinate of the right clipping plane.
 * @param {number} bottom The coordinate of the bottom clipping plane.
 * @param {number} top The coordinate of the top clipping plane.
 * @param {number} near The distance to the near clipping plane.
 * @param {number} far The distance to the far clipping plane.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeOrtho = function(mat, left, right, bottom, top, near, far) {
  var x = 2 / (right - left);
  var y = 2 / (top - bottom);
  var z = -2 / (far - near);
  var a = -(right + left) / (right - left);
  var b = -(top + bottom) / (top - bottom);
  var c = -(far + near) / (far - near);

  return goog.vec.Mat4.setFromValues(
      mat, x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, a, b, c, 1);
};


/**
 * Makes the given 4x4 matrix a modelview matrix of a camera so that
 * the camera is 'looking at' the given center point.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {goog.vec.Vec3.AnyType} eyePt The position of the eye point
 *     (camera origin).
 * @param {goog.vec.Vec3.AnyType} centerPt The point to aim the camera at.
 * @param {goog.vec.Vec3.AnyType} worldUpVec The vector that identifies
 *     the up direction for the camera.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeLookAt = function(mat, eyePt, centerPt, worldUpVec) {
  // Compute the direction vector from the eye point to the center point and
  // normalize.
  var fwdVec = goog.vec.Mat4.tmpVec4_[0];
  goog.vec.Vec3.subtract(centerPt, eyePt, fwdVec);
  goog.vec.Vec3.normalize(fwdVec, fwdVec);
  fwdVec[3] = 0;

  // Compute the side vector from the forward vector and the input up vector.
  var sideVec = goog.vec.Mat4.tmpVec4_[1];
  goog.vec.Vec3.cross(fwdVec, worldUpVec, sideVec);
  goog.vec.Vec3.normalize(sideVec, sideVec);
  sideVec[3] = 0;

  // Now the up vector to form the orthonormal basis.
  var upVec = goog.vec.Mat4.tmpVec4_[2];
  goog.vec.Vec3.cross(sideVec, fwdVec, upVec);
  goog.vec.Vec3.normalize(upVec, upVec);
  upVec[3] = 0;

  // Update the view matrix with the new orthonormal basis and position the
  // camera at the given eye point.
  goog.vec.Vec3.negate(fwdVec, fwdVec);
  goog.vec.Mat4.setRow(mat, 0, sideVec);
  goog.vec.Mat4.setRow(mat, 1, upVec);
  goog.vec.Mat4.setRow(mat, 2, fwdVec);
  goog.vec.Mat4.setRowValues(mat, 3, 0, 0, 0, 1);
  goog.vec.Mat4.translate(mat, -eyePt[0], -eyePt[1], -eyePt[2]);

  return mat;
};


/**
 * Decomposes a matrix into the lookAt vectors eyePt, fwdVec and worldUpVec.
 * The matrix represents the modelview matrix of a camera. It is the inverse
 * of lookAt except for the output of the fwdVec instead of centerPt.
 * The centerPt itself cannot be recovered from a modelview matrix.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {goog.vec.Vec3.AnyType} eyePt The position of the eye point
 *     (camera origin).
 * @param {goog.vec.Vec3.AnyType} fwdVec The vector describing where
 *     the camera points to.
 * @param {goog.vec.Vec3.AnyType} worldUpVec The vector that
 *     identifies the up direction for the camera.
 * @return {boolean} True if the method succeeds, false otherwise.
 *     The method can only fail if the inverse of viewMatrix is not defined.
 */
goog.vec.Mat4.toLookAt = function(mat, eyePt, fwdVec, worldUpVec) {
  // Get eye of the camera.
  var matInverse = goog.vec.Mat4.tmpMat4_[0];
  if (!goog.vec.Mat4.invert(mat, matInverse)) {
    // The input matrix does not have a valid inverse.
    return false;
  }

  if (eyePt) {
    eyePt[0] = matInverse[12];
    eyePt[1] = matInverse[13];
    eyePt[2] = matInverse[14];
  }

  // Get forward vector from the definition of lookAt.
  if (fwdVec || worldUpVec) {
    if (!fwdVec) {
      fwdVec = goog.vec.Mat4.tmpVec3_[0];
    }
    fwdVec[0] = -mat[2];
    fwdVec[1] = -mat[6];
    fwdVec[2] = -mat[10];
    // Normalize forward vector.
    goog.vec.Vec3.normalize(fwdVec, fwdVec);
  }

  if (worldUpVec) {
    // Get side vector from the definition of gluLookAt.
    var side = goog.vec.Mat4.tmpVec3_[1];
    side[0] = mat[0];
    side[1] = mat[4];
    side[2] = mat[8];
    // Compute up vector as a up = side x forward.
    goog.vec.Vec3.cross(side, fwdVec, worldUpVec);
    // Normalize up vector.
    goog.vec.Vec3.normalize(worldUpVec, worldUpVec);
  }
  return true;
};


/**
 * Makes the given 4x4 matrix a rotation matrix given Euler angles using
 * the ZXZ convention.
 * Given the euler angles [theta1, theta2, theta3], the rotation is defined as
 * rotation = rotation_z(theta1) * rotation_x(theta2) * rotation_z(theta3),
 * with theta1 in [0, 2 * pi], theta2 in [0, pi] and theta3 in [0, 2 * pi].
 * rotation_x(theta) means rotation around the X axis of theta radians,
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} theta1 The angle of rotation around the Z axis in radians.
 * @param {number} theta2 The angle of rotation around the X axis in radians.
 * @param {number} theta3 The angle of rotation around the Z axis in radians.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.makeEulerZXZ = function(mat, theta1, theta2, theta3) {
  var c1 = Math.cos(theta1);
  var s1 = Math.sin(theta1);

  var c2 = Math.cos(theta2);
  var s2 = Math.sin(theta2);

  var c3 = Math.cos(theta3);
  var s3 = Math.sin(theta3);

  mat[0] = c1 * c3 - c2 * s1 * s3;
  mat[1] = c2 * c1 * s3 + c3 * s1;
  mat[2] = s3 * s2;
  mat[3] = 0;

  mat[4] = -c1 * s3 - c3 * c2 * s1;
  mat[5] = c1 * c2 * c3 - s1 * s3;
  mat[6] = c3 * s2;
  mat[7] = 0;

  mat[8] = s2 * s1;
  mat[9] = -c1 * s2;
  mat[10] = c2;
  mat[11] = 0;

  mat[12] = 0;
  mat[13] = 0;
  mat[14] = 0;
  mat[15] = 1;

  return mat;
};


/**
 * Decomposes a rotation matrix into Euler angles using the ZXZ convention so
 * that rotation = rotation_z(theta1) * rotation_x(theta2) * rotation_z(theta3),
 * with theta1 in [0, 2 * pi], theta2 in [0, pi] and theta3 in [0, 2 * pi].
 * rotation_x(theta) means rotation around the X axis of theta radians.
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {goog.vec.Vec3.AnyType} euler The ZXZ Euler angles in
 *     radians as [theta1, theta2, theta3].
 * @param {boolean=} opt_theta2IsNegative Whether theta2 is in [-pi, 0] instead
 *     of the default [0, pi].
 * @return {goog.vec.Vec4.AnyType} return euler so that operations can be
 *     chained together.
 */
goog.vec.Mat4.toEulerZXZ = function(mat, euler, opt_theta2IsNegative) {
  // There is an ambiguity in the sign of sinTheta2 because of the sqrt.
  var sinTheta2 = Math.sqrt(mat[2] * mat[2] + mat[6] * mat[6]);

  // By default we explicitely constrain theta2 to be in [0, pi],
  // so sinTheta2 is always positive. We can change the behavior and specify
  // theta2 to be negative in [-pi, 0] with opt_Theta2IsNegative.
  var signTheta2 = opt_theta2IsNegative ? -1 : 1;

  if (sinTheta2 > goog.vec.EPSILON) {
    euler[2] = Math.atan2(mat[2] * signTheta2, mat[6] * signTheta2);
    euler[1] = Math.atan2(sinTheta2 * signTheta2, mat[10]);
    euler[0] = Math.atan2(mat[8] * signTheta2, -mat[9] * signTheta2);
  } else {
    // There is also an arbitrary choice for theta1 = 0 or theta2 = 0 here.
    // We assume theta1 = 0 as some applications do not allow the camera to roll
    // (i.e. have theta1 != 0).
    euler[0] = 0;
    euler[1] = Math.atan2(sinTheta2 * signTheta2, mat[10]);
    euler[2] = Math.atan2(mat[1], mat[0]);
  }

  // Atan2 outputs angles in [-pi, pi] so we bring them back to [0, 2 * pi].
  euler[0] = (euler[0] + Math.PI * 2) % (Math.PI * 2);
  euler[2] = (euler[2] + Math.PI * 2) % (Math.PI * 2);
  // For theta2 we want the angle to be in [0, pi] or [-pi, 0] depending on
  // signTheta2.
  euler[1] =
      ((euler[1] * signTheta2 + Math.PI * 2) % (Math.PI * 2)) * signTheta2;

  return euler;
};


/**
 * Translates the given matrix by x,y,z.  Equvialent to:
 * goog.vec.Mat4.multMat(
 *     mat,
 *     goog.vec.Mat4.makeTranslate(goog.vec.Mat4.create(), x, y, z),
 *     mat);
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} x The translation along the x axis.
 * @param {number} y The translation along the y axis.
 * @param {number} z The translation along the z axis.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.translate = function(mat, x, y, z) {
  return goog.vec.Mat4.setColumnValues(
      mat, 3, mat[0] * x + mat[4] * y + mat[8] * z + mat[12],
      mat[1] * x + mat[5] * y + mat[9] * z + mat[13],
      mat[2] * x + mat[6] * y + mat[10] * z + mat[14],
      mat[3] * x + mat[7] * y + mat[11] * z + mat[15]);
};


/**
 * Scales the given matrix by x,y,z.  Equivalent to:
 * goog.vec.Mat4.multMat(
 *     mat,
 *     goog.vec.Mat4.makeScale(goog.vec.Mat4.create(), x, y, z),
 *     mat);
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} x The x scale factor.
 * @param {number} y The y scale factor.
 * @param {number} z The z scale factor.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.scale = function(mat, x, y, z) {
  return goog.vec.Mat4.setFromValues(
      mat, mat[0] * x, mat[1] * x, mat[2] * x, mat[3] * x, mat[4] * y,
      mat[5] * y, mat[6] * y, mat[7] * y, mat[8] * z, mat[9] * z, mat[10] * z,
      mat[11] * z, mat[12], mat[13], mat[14], mat[15]);
};


/**
 * Rotate the given matrix by angle about the x,y,z axis.  Equivalent to:
 * goog.vec.Mat4.multMat(
 *     mat,
 *     goog.vec.Mat4.makeRotate(goog.vec.Mat4.create(), angle, x, y, z),
 *     mat);
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The angle in radians.
 * @param {number} x The x component of the rotation axis.
 * @param {number} y The y component of the rotation axis.
 * @param {number} z The z component of the rotation axis.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.rotate = function(mat, angle, x, y, z) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2], m30 = mat[3];
  var m01 = mat[4], m11 = mat[5], m21 = mat[6], m31 = mat[7];
  var m02 = mat[8], m12 = mat[9], m22 = mat[10], m32 = mat[11];
  var m03 = mat[12], m13 = mat[13], m23 = mat[14], m33 = mat[15];

  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var diffCosAngle = 1 - cosAngle;
  var r00 = x * x * diffCosAngle + cosAngle;
  var r10 = x * y * diffCosAngle + z * sinAngle;
  var r20 = x * z * diffCosAngle - y * sinAngle;

  var r01 = x * y * diffCosAngle - z * sinAngle;
  var r11 = y * y * diffCosAngle + cosAngle;
  var r21 = y * z * diffCosAngle + x * sinAngle;

  var r02 = x * z * diffCosAngle + y * sinAngle;
  var r12 = y * z * diffCosAngle - x * sinAngle;
  var r22 = z * z * diffCosAngle + cosAngle;

  return goog.vec.Mat4.setFromValues(
      mat, m00 * r00 + m01 * r10 + m02 * r20, m10 * r00 + m11 * r10 + m12 * r20,
      m20 * r00 + m21 * r10 + m22 * r20, m30 * r00 + m31 * r10 + m32 * r20,

      m00 * r01 + m01 * r11 + m02 * r21, m10 * r01 + m11 * r11 + m12 * r21,
      m20 * r01 + m21 * r11 + m22 * r21, m30 * r01 + m31 * r11 + m32 * r21,

      m00 * r02 + m01 * r12 + m02 * r22, m10 * r02 + m11 * r12 + m12 * r22,
      m20 * r02 + m21 * r12 + m22 * r22, m30 * r02 + m31 * r12 + m32 * r22,

      m03, m13, m23, m33);
};


/**
 * Rotate the given matrix by angle about the x axis.  Equivalent to:
 * goog.vec.Mat4.multMat(
 *     mat,
 *     goog.vec.Mat4.makeRotateX(goog.vec.Mat4.create(), angle),
 *     mat);
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The angle in radians.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.rotateX = function(mat, angle) {
  var m01 = mat[4], m11 = mat[5], m21 = mat[6], m31 = mat[7];
  var m02 = mat[8], m12 = mat[9], m22 = mat[10], m32 = mat[11];

  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[4] = m01 * c + m02 * s;
  mat[5] = m11 * c + m12 * s;
  mat[6] = m21 * c + m22 * s;
  mat[7] = m31 * c + m32 * s;
  mat[8] = m01 * -s + m02 * c;
  mat[9] = m11 * -s + m12 * c;
  mat[10] = m21 * -s + m22 * c;
  mat[11] = m31 * -s + m32 * c;

  return mat;
};


/**
 * Rotate the given matrix by angle about the y axis.  Equivalent to:
 * goog.vec.Mat4.multMat(
 *     mat,
 *     goog.vec.Mat4.makeRotateY(goog.vec.Mat4.create(), angle),
 *     mat);
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The angle in radians.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.rotateY = function(mat, angle) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2], m30 = mat[3];
  var m02 = mat[8], m12 = mat[9], m22 = mat[10], m32 = mat[11];

  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[0] = m00 * c + m02 * -s;
  mat[1] = m10 * c + m12 * -s;
  mat[2] = m20 * c + m22 * -s;
  mat[3] = m30 * c + m32 * -s;
  mat[8] = m00 * s + m02 * c;
  mat[9] = m10 * s + m12 * c;
  mat[10] = m20 * s + m22 * c;
  mat[11] = m30 * s + m32 * c;

  return mat;
};


/**
 * Rotate the given matrix by angle about the z axis.  Equivalent to:
 * goog.vec.Mat4.multMat(
 *     mat,
 *     goog.vec.Mat4.makeRotateZ(goog.vec.Mat4.create(), angle),
 *     mat);
 *
 * @param {goog.vec.Mat4.AnyType} mat The matrix.
 * @param {number} angle The angle in radians.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.rotateZ = function(mat, angle) {
  var m00 = mat[0], m10 = mat[1], m20 = mat[2], m30 = mat[3];
  var m01 = mat[4], m11 = mat[5], m21 = mat[6], m31 = mat[7];

  var c = Math.cos(angle);
  var s = Math.sin(angle);

  mat[0] = m00 * c + m01 * s;
  mat[1] = m10 * c + m11 * s;
  mat[2] = m20 * c + m21 * s;
  mat[3] = m30 * c + m31 * s;
  mat[4] = m00 * -s + m01 * c;
  mat[5] = m10 * -s + m11 * c;
  mat[6] = m20 * -s + m21 * c;
  mat[7] = m30 * -s + m31 * c;

  return mat;
};


/**
 * Retrieves the translation component of the transformation matrix.
 *
 * @param {goog.vec.Mat4.AnyType} mat The transformation matrix.
 * @param {goog.vec.Vec3.AnyType} translation The vector for storing the
 *     result.
 * @return {goog.vec.Mat4.AnyType} return mat so that operations can be
 *     chained.
 */
goog.vec.Mat4.getTranslation = function(mat, translation) {
  translation[0] = mat[12];
  translation[1] = mat[13];
  translation[2] = mat[14];
  return translation;
};


/**
 * @type {!Array<!goog.vec.Vec3.Type>}
 * @private
 */
goog.vec.Mat4.tmpVec3_ =
    [goog.vec.Vec3.createFloat64(), goog.vec.Vec3.createFloat64()];


/**
 * @type {!Array<!goog.vec.Vec4.Type>}
 * @private
 */
goog.vec.Mat4.tmpVec4_ = [
  goog.vec.Vec4.createFloat64(), goog.vec.Vec4.createFloat64(),
  goog.vec.Vec4.createFloat64()
];


/**
 * @type {!Array<!goog.vec.Mat4.Type>}
 * @private
 */
goog.vec.Mat4.tmpMat4_ = [goog.vec.Mat4.createFloat64()];

goog.provide('ol.geom.flat.transform');

goog.require('goog.vec.Mat4');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {goog.vec.Mat4.Number} transform Transform.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform.transform2D = function(flatCoordinates, offset, end, stride, transform, opt_dest) {
  var m00 = goog.vec.Mat4.getElement(transform, 0, 0);
  var m10 = goog.vec.Mat4.getElement(transform, 1, 0);
  var m01 = goog.vec.Mat4.getElement(transform, 0, 1);
  var m11 = goog.vec.Mat4.getElement(transform, 1, 1);
  var m03 = goog.vec.Mat4.getElement(transform, 0, 3);
  var m13 = goog.vec.Mat4.getElement(transform, 1, 3);
  var dest = opt_dest ? opt_dest : [];
  var i = 0;
  var j;
  for (j = offset; j < end; j += stride) {
    var x = flatCoordinates[j];
    var y = flatCoordinates[j + 1];
    dest[i++] = m00 * x + m01 * y + m03;
    dest[i++] = m10 * x + m11 * y + m13;
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} angle Angle.
 * @param {Array.<number>} anchor Rotation anchor point.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform.rotate = function(flatCoordinates, offset, end, stride, angle, anchor, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var anchorX = anchor[0];
  var anchorY = anchor[1];
  var i = 0;
  for (var j = offset; j < end; j += stride) {
    var deltaX = flatCoordinates[j] - anchorX;
    var deltaY = flatCoordinates[j + 1] - anchorY;
    dest[i++] = anchorX + deltaX * cos - deltaY * sin;
    dest[i++] = anchorY + deltaX * sin + deltaY * cos;
    for (var k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} deltaX Delta X.
 * @param {number} deltaY Delta Y.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed coordinates.
 */
ol.geom.flat.transform.translate = function(flatCoordinates, offset, end, stride, deltaX, deltaY, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var i = 0;
  var j, k;
  for (j = offset; j < end; j += stride) {
    dest[i++] = flatCoordinates[j] + deltaX;
    dest[i++] = flatCoordinates[j + 1] + deltaY;
    for (k = j + 2; k < j + stride; ++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};

goog.provide('ol.geom.SimpleGeometry');

goog.require('goog.asserts');
goog.require('ol.functions');
goog.require('ol.extent');
goog.require('ol.geom.Geometry');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.flat.transform');
goog.require('ol.object');


/**
 * @classdesc
 * Abstract base class; only used for creating subclasses; do not instantiate
 * in apps, as cannot be rendered.
 *
 * @constructor
 * @extends {ol.geom.Geometry}
 * @api stable
 */
ol.geom.SimpleGeometry = function() {

  ol.geom.Geometry.call(this);

  /**
   * @protected
   * @type {ol.geom.GeometryLayout}
   */
  this.layout = ol.geom.GeometryLayout.XY;

  /**
   * @protected
   * @type {number}
   */
  this.stride = 2;

  /**
   * @protected
   * @type {Array.<number>}
   */
  this.flatCoordinates = null;

};
ol.inherits(ol.geom.SimpleGeometry, ol.geom.Geometry);


/**
 * @param {number} stride Stride.
 * @private
 * @return {ol.geom.GeometryLayout} layout Layout.
 */
ol.geom.SimpleGeometry.getLayoutForStride_ = function(stride) {
  if (stride == 2) {
    return ol.geom.GeometryLayout.XY;
  } else if (stride == 3) {
    return ol.geom.GeometryLayout.XYZ;
  } else if (stride == 4) {
    return ol.geom.GeometryLayout.XYZM;
  } else {
    goog.asserts.fail('unsupported stride: ' + stride);
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @return {number} Stride.
 */
ol.geom.SimpleGeometry.getStrideForLayout = function(layout) {
  if (layout == ol.geom.GeometryLayout.XY) {
    return 2;
  } else if (layout == ol.geom.GeometryLayout.XYZ) {
    return 3;
  } else if (layout == ol.geom.GeometryLayout.XYM) {
    return 3;
  } else if (layout == ol.geom.GeometryLayout.XYZM) {
    return 4;
  } else {
    goog.asserts.fail('unsupported layout: ' + layout);
  }
};


/**
 * @inheritDoc
 */
ol.geom.SimpleGeometry.prototype.containsXY = ol.functions.FALSE;


/**
 * @inheritDoc
 */
ol.geom.SimpleGeometry.prototype.computeExtent = function(extent) {
  return ol.extent.createOrUpdateFromFlatCoordinates(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      extent);
};


/**
 * @return {Array} Coordinates.
 */
ol.geom.SimpleGeometry.prototype.getCoordinates = goog.abstractMethod;


/**
 * Return the first coordinate of the geometry.
 * @return {ol.Coordinate} First coordinate.
 * @api stable
 */
ol.geom.SimpleGeometry.prototype.getFirstCoordinate = function() {
  return this.flatCoordinates.slice(0, this.stride);
};


/**
 * @return {Array.<number>} Flat coordinates.
 */
ol.geom.SimpleGeometry.prototype.getFlatCoordinates = function() {
  return this.flatCoordinates;
};


/**
 * Return the last coordinate of the geometry.
 * @return {ol.Coordinate} Last point.
 * @api stable
 */
ol.geom.SimpleGeometry.prototype.getLastCoordinate = function() {
  return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
};


/**
 * Return the {@link ol.geom.GeometryLayout layout} of the geometry.
 * @return {ol.geom.GeometryLayout} Layout.
 * @api stable
 */
ol.geom.SimpleGeometry.prototype.getLayout = function() {
  return this.layout;
};


/**
 * @inheritDoc
 */
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometry = function(squaredTolerance) {
  if (this.simplifiedGeometryRevision != this.getRevision()) {
    ol.object.clear(this.simplifiedGeometryCache);
    this.simplifiedGeometryMaxMinSquaredTolerance = 0;
    this.simplifiedGeometryRevision = this.getRevision();
  }
  // If squaredTolerance is negative or if we know that simplification will not
  // have any effect then just return this.
  if (squaredTolerance < 0 ||
      (this.simplifiedGeometryMaxMinSquaredTolerance !== 0 &&
       squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance)) {
    return this;
  }
  var key = squaredTolerance.toString();
  if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
    return this.simplifiedGeometryCache[key];
  } else {
    var simplifiedGeometry =
        this.getSimplifiedGeometryInternal(squaredTolerance);
    var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
    if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
      this.simplifiedGeometryCache[key] = simplifiedGeometry;
      return simplifiedGeometry;
    } else {
      // Simplification did not actually remove any coordinates.  We now know
      // that any calls to getSimplifiedGeometry with a squaredTolerance less
      // than or equal to the current squaredTolerance will also not have any
      // effect.  This allows us to short circuit simplification (saving CPU
      // cycles) and prevents the cache of simplified geometries from filling
      // up with useless identical copies of this geometry (saving memory).
      this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
      return this;
    }
  }
};


/**
 * @param {number} squaredTolerance Squared tolerance.
 * @return {ol.geom.SimpleGeometry} Simplified geometry.
 * @protected
 */
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  return this;
};


/**
 * @return {number} Stride.
 */
ol.geom.SimpleGeometry.prototype.getStride = function() {
  return this.stride;
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @protected
 */
ol.geom.SimpleGeometry.prototype.setFlatCoordinatesInternal = function(layout, flatCoordinates) {
  this.stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
  this.layout = layout;
  this.flatCoordinates = flatCoordinates;
};


/**
 * @param {Array} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 */
ol.geom.SimpleGeometry.prototype.setCoordinates = goog.abstractMethod;


/**
 * @param {ol.geom.GeometryLayout|undefined} layout Layout.
 * @param {Array} coordinates Coordinates.
 * @param {number} nesting Nesting.
 * @protected
 */
ol.geom.SimpleGeometry.prototype.setLayout = function(layout, coordinates, nesting) {
  /** @type {number} */
  var stride;
  if (layout) {
    stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
  } else {
    var i;
    for (i = 0; i < nesting; ++i) {
      if (coordinates.length === 0) {
        this.layout = ol.geom.GeometryLayout.XY;
        this.stride = 2;
        return;
      } else {
        coordinates = /** @type {Array} */ (coordinates[0]);
      }
    }
    stride = coordinates.length;
    layout = ol.geom.SimpleGeometry.getLayoutForStride_(stride);
  }
  this.layout = layout;
  this.stride = stride;
};


/**
 * @inheritDoc
 * @api stable
 */
ol.geom.SimpleGeometry.prototype.applyTransform = function(transformFn) {
  if (this.flatCoordinates) {
    transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
    this.changed();
  }
};


/**
 * @inheritDoc
 * @api
 */
ol.geom.SimpleGeometry.prototype.rotate = function(angle, anchor) {
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.rotate(
        flatCoordinates, 0, flatCoordinates.length,
        stride, angle, anchor, flatCoordinates);
    this.changed();
  }
};


/**
 * @inheritDoc
 * @api stable
 */
ol.geom.SimpleGeometry.prototype.translate = function(deltaX, deltaY) {
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.translate(
        flatCoordinates, 0, flatCoordinates.length, stride,
        deltaX, deltaY, flatCoordinates);
    this.changed();
  }
};


/**
 * @param {ol.geom.SimpleGeometry} simpleGeometry Simple geometry.
 * @param {goog.vec.Mat4.Number} transform Transform.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Transformed flat coordinates.
 */
ol.geom.transformSimpleGeometry2D = function(simpleGeometry, transform, opt_dest) {
  var flatCoordinates = simpleGeometry.getFlatCoordinates();
  if (!flatCoordinates) {
    return null;
  } else {
    var stride = simpleGeometry.getStride();
    return ol.geom.flat.transform.transform2D(
        flatCoordinates, 0, flatCoordinates.length, stride,
        transform, opt_dest);
  }
};

goog.provide('ol.geom.flat.area');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.area.linearRing = function(flatCoordinates, offset, end, stride) {
  var twiceArea = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    twiceArea += y1 * x2 - x1 * y2;
    x1 = x2;
    y1 = y2;
  }
  return twiceArea / 2;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.area.linearRings = function(flatCoordinates, offset, ends, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    area += ol.geom.flat.area.linearRing(flatCoordinates, offset, end, stride);
    offset = end;
  }
  return area;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {number} Area.
 */
ol.geom.flat.area.linearRingss = function(flatCoordinates, offset, endss, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    area +=
        ol.geom.flat.area.linearRings(flatCoordinates, offset, ends, stride);
    offset = ends[ends.length - 1];
  }
  return area;
};

goog.provide('ol.geom.flat.closest');

goog.require('goog.asserts');
goog.require('ol.math');


/**
 * Returns the point on the 2D line segment flatCoordinates[offset1] to
 * flatCoordinates[offset2] that is closest to the point (x, y).  Extra
 * dimensions are linearly interpolated.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset1 Offset 1.
 * @param {number} offset2 Offset 2.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 */
ol.geom.flat.closest.point = function(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
  var x1 = flatCoordinates[offset1];
  var y1 = flatCoordinates[offset1 + 1];
  var dx = flatCoordinates[offset2] - x1;
  var dy = flatCoordinates[offset2 + 1] - y1;
  var i, offset;
  if (dx === 0 && dy === 0) {
    offset = offset1;
  } else {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      offset = offset2;
    } else if (t > 0) {
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = ol.math.lerp(flatCoordinates[offset1 + i],
            flatCoordinates[offset2 + i], t);
      }
      closestPoint.length = stride;
      return;
    } else {
      offset = offset1;
    }
  }
  for (i = 0; i < stride; ++i) {
    closestPoint[i] = flatCoordinates[offset + i];
  }
  closestPoint.length = stride;
};


/**
 * Return the squared of the largest distance between any pair of consecutive
 * coordinates.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} maxSquaredDelta Max squared delta.
 * @return {number} Max squared delta.
 */
ol.geom.flat.closest.getMaxSquaredDelta = function(flatCoordinates, offset, end, stride, maxSquaredDelta) {
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  for (offset += stride; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    var squaredDelta = ol.math.squaredDistance(x1, y1, x2, y2);
    if (squaredDelta > maxSquaredDelta) {
      maxSquaredDelta = squaredDelta;
    }
    x1 = x2;
    y1 = y2;
  }
  return maxSquaredDelta;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} maxSquaredDelta Max squared delta.
 * @return {number} Max squared delta.
 */
ol.geom.flat.closest.getsMaxSquaredDelta = function(flatCoordinates, offset, ends, stride, maxSquaredDelta) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    maxSquaredDelta = ol.geom.flat.closest.getMaxSquaredDelta(
        flatCoordinates, offset, end, stride, maxSquaredDelta);
    offset = end;
  }
  return maxSquaredDelta;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} maxSquaredDelta Max squared delta.
 * @return {number} Max squared delta.
 */
ol.geom.flat.closest.getssMaxSquaredDelta = function(flatCoordinates, offset, endss, stride, maxSquaredDelta) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    maxSquaredDelta = ol.geom.flat.closest.getsMaxSquaredDelta(
        flatCoordinates, offset, ends, stride, maxSquaredDelta);
    offset = ends[ends.length - 1];
  }
  return maxSquaredDelta;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array.<number>=} opt_tmpPoint Temporary point object.
 * @return {number} Minimum squared distance.
 */
ol.geom.flat.closest.getClosestPoint = function(flatCoordinates, offset, end,
    stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance,
    opt_tmpPoint) {
  if (offset == end) {
    return minSquaredDistance;
  }
  var i, squaredDistance;
  if (maxDelta === 0) {
    // All points are identical, so just test the first point.
    squaredDistance = ol.math.squaredDistance(
        x, y, flatCoordinates[offset], flatCoordinates[offset + 1]);
    if (squaredDistance < minSquaredDistance) {
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = flatCoordinates[offset + i];
      }
      closestPoint.length = stride;
      return squaredDistance;
    } else {
      return minSquaredDistance;
    }
  }
  goog.asserts.assert(maxDelta > 0, 'maxDelta should be larger than 0');
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var index = offset + stride;
  while (index < end) {
    ol.geom.flat.closest.point(
        flatCoordinates, index - stride, index, stride, x, y, tmpPoint);
    squaredDistance = ol.math.squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance < minSquaredDistance) {
      minSquaredDistance = squaredDistance;
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
      index += stride;
    } else {
      // Skip ahead multiple points, because we know that all the skipped
      // points cannot be any closer than the closest point we have found so
      // far.  We know this because we know how close the current point is, how
      // close the closest point we have found so far is, and the maximum
      // distance between consecutive points.  For example, if we're currently
      // at distance 10, the best we've found so far is 3, and that the maximum
      // distance between consecutive points is 2, then we'll need to skip at
      // least (10 - 3) / 2 == 3 (rounded down) points to have any chance of
      // finding a closer point.  We use Math.max(..., 1) to ensure that we
      // always advance at least one point, to avoid an infinite loop.
      index += stride * Math.max(
          ((Math.sqrt(squaredDistance) -
            Math.sqrt(minSquaredDistance)) / maxDelta) | 0, 1);
    }
  }
  if (isRing) {
    // Check the closing segment.
    ol.geom.flat.closest.point(
        flatCoordinates, end - stride, offset, stride, x, y, tmpPoint);
    squaredDistance = ol.math.squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance < minSquaredDistance) {
      minSquaredDistance = squaredDistance;
      for (i = 0; i < stride; ++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
    }
  }
  return minSquaredDistance;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array.<number>=} opt_tmpPoint Temporary point object.
 * @return {number} Minimum squared distance.
 */
ol.geom.flat.closest.getsClosestPoint = function(flatCoordinates, offset, ends,
    stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance,
    opt_tmpPoint) {
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    minSquaredDistance = ol.geom.flat.closest.getClosestPoint(
        flatCoordinates, offset, end, stride,
        maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
    offset = end;
  }
  return minSquaredDistance;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} maxDelta Max delta.
 * @param {boolean} isRing Is ring.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {Array.<number>} closestPoint Closest point.
 * @param {number} minSquaredDistance Minimum squared distance.
 * @param {Array.<number>=} opt_tmpPoint Temporary point object.
 * @return {number} Minimum squared distance.
 */
ol.geom.flat.closest.getssClosestPoint = function(flatCoordinates, offset,
    endss, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance,
    opt_tmpPoint) {
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    minSquaredDistance = ol.geom.flat.closest.getsClosestPoint(
        flatCoordinates, offset, ends, stride,
        maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
    offset = ends[ends.length - 1];
  }
  return minSquaredDistance;
};

goog.provide('ol.geom.flat.deflate');

goog.require('goog.asserts');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
ol.geom.flat.deflate.coordinate = function(flatCoordinates, offset, coordinate, stride) {
  goog.asserts.assert(coordinate.length == stride,
      'length of the coordinate array should match stride');
  var i, ii;
  for (i = 0, ii = coordinate.length; i < ii; ++i) {
    flatCoordinates[offset++] = coordinate[i];
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {number} stride Stride.
 * @return {number} offset Offset.
 */
ol.geom.flat.deflate.coordinates = function(flatCoordinates, offset, coordinates, stride) {
  var i, ii;
  for (i = 0, ii = coordinates.length; i < ii; ++i) {
    var coordinate = coordinates[i];
    goog.asserts.assert(coordinate.length == stride,
        'length of coordinate array should match stride');
    var j;
    for (j = 0; j < stride; ++j) {
      flatCoordinates[offset++] = coordinate[j];
    }
  }
  return offset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<ol.Coordinate>>} coordinatess Coordinatess.
 * @param {number} stride Stride.
 * @param {Array.<number>=} opt_ends Ends.
 * @return {Array.<number>} Ends.
 */
ol.geom.flat.deflate.coordinatess = function(flatCoordinates, offset, coordinatess, stride, opt_ends) {
  var ends = opt_ends ? opt_ends : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatess.length; j < jj; ++j) {
    var end = ol.geom.flat.deflate.coordinates(
        flatCoordinates, offset, coordinatess[j], stride);
    ends[i++] = end;
    offset = end;
  }
  ends.length = i;
  return ends;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<Array.<ol.Coordinate>>>} coordinatesss Coordinatesss.
 * @param {number} stride Stride.
 * @param {Array.<Array.<number>>=} opt_endss Endss.
 * @return {Array.<Array.<number>>} Endss.
 */
ol.geom.flat.deflate.coordinatesss = function(flatCoordinates, offset, coordinatesss, stride, opt_endss) {
  var endss = opt_endss ? opt_endss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatesss.length; j < jj; ++j) {
    var ends = ol.geom.flat.deflate.coordinatess(
        flatCoordinates, offset, coordinatesss[j], stride, endss[i]);
    endss[i++] = ends;
    offset = ends[ends.length - 1];
  }
  endss.length = i;
  return endss;
};

goog.provide('ol.geom.flat.inflate');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {Array.<ol.Coordinate>=} opt_coordinates Coordinates.
 * @return {Array.<ol.Coordinate>} Coordinates.
 */
ol.geom.flat.inflate.coordinates = function(flatCoordinates, offset, end, stride, opt_coordinates) {
  var coordinates = opt_coordinates !== undefined ? opt_coordinates : [];
  var i = 0;
  var j;
  for (j = offset; j < end; j += stride) {
    coordinates[i++] = flatCoordinates.slice(j, j + stride);
  }
  coordinates.length = i;
  return coordinates;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {Array.<Array.<ol.Coordinate>>=} opt_coordinatess Coordinatess.
 * @return {Array.<Array.<ol.Coordinate>>} Coordinatess.
 */
ol.geom.flat.inflate.coordinatess = function(flatCoordinates, offset, ends, stride, opt_coordinatess) {
  var coordinatess = opt_coordinatess !== undefined ? opt_coordinatess : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = ends.length; j < jj; ++j) {
    var end = ends[j];
    coordinatess[i++] = ol.geom.flat.inflate.coordinates(
        flatCoordinates, offset, end, stride, coordinatess[i]);
    offset = end;
  }
  coordinatess.length = i;
  return coordinatess;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {Array.<Array.<Array.<ol.Coordinate>>>=} opt_coordinatesss
 *     Coordinatesss.
 * @return {Array.<Array.<Array.<ol.Coordinate>>>} Coordinatesss.
 */
ol.geom.flat.inflate.coordinatesss = function(flatCoordinates, offset, endss, stride, opt_coordinatesss) {
  var coordinatesss = opt_coordinatesss !== undefined ? opt_coordinatesss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = endss.length; j < jj; ++j) {
    var ends = endss[j];
    coordinatesss[i++] = ol.geom.flat.inflate.coordinatess(
        flatCoordinates, offset, ends, stride, coordinatesss[i]);
    offset = ends[ends.length - 1];
  }
  coordinatesss.length = i;
  return coordinatesss;
};

// Based on simplify-js https://github.com/mourner/simplify-js
// Copyright (c) 2012, Vladimir Agafonkin
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//    1. Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//
//    2. Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

goog.provide('ol.geom.flat.simplify');

goog.require('ol.math');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {boolean} highQuality Highest quality.
 * @param {Array.<number>=} opt_simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @return {Array.<number>} Simplified line string.
 */
ol.geom.flat.simplify.lineString = function(flatCoordinates, offset, end,
    stride, squaredTolerance, highQuality, opt_simplifiedFlatCoordinates) {
  var simplifiedFlatCoordinates = opt_simplifiedFlatCoordinates !== undefined ?
      opt_simplifiedFlatCoordinates : [];
  if (!highQuality) {
    end = ol.geom.flat.simplify.radialDistance(flatCoordinates, offset, end,
        stride, squaredTolerance,
        simplifiedFlatCoordinates, 0);
    flatCoordinates = simplifiedFlatCoordinates;
    offset = 0;
    stride = 2;
  }
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(
      flatCoordinates, offset, end, stride, squaredTolerance,
      simplifiedFlatCoordinates, 0);
  return simplifiedFlatCoordinates;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.douglasPeucker = function(flatCoordinates, offset, end,
    stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  var n = (end - offset) / stride;
  if (n < 3) {
    for (; offset < end; offset += stride) {
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset];
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + 1];
    }
    return simplifiedOffset;
  }
  /** @type {Array.<number>} */
  var markers = new Array(n);
  markers[0] = 1;
  markers[n - 1] = 1;
  /** @type {Array.<number>} */
  var stack = [offset, end - stride];
  var index = 0;
  var i;
  while (stack.length > 0) {
    var last = stack.pop();
    var first = stack.pop();
    var maxSquaredDistance = 0;
    var x1 = flatCoordinates[first];
    var y1 = flatCoordinates[first + 1];
    var x2 = flatCoordinates[last];
    var y2 = flatCoordinates[last + 1];
    for (i = first + stride; i < last; i += stride) {
      var x = flatCoordinates[i];
      var y = flatCoordinates[i + 1];
      var squaredDistance = ol.math.squaredSegmentDistance(
          x, y, x1, y1, x2, y2);
      if (squaredDistance > maxSquaredDistance) {
        index = i;
        maxSquaredDistance = squaredDistance;
      }
    }
    if (maxSquaredDistance > squaredTolerance) {
      markers[(index - offset) / stride] = 1;
      if (first + stride < index) {
        stack.push(first, index);
      }
      if (index + stride < last) {
        stack.push(index, last);
      }
    }
  }
  for (i = 0; i < n; ++i) {
    if (markers[i]) {
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + i * stride];
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + i * stride + 1];
    }
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<number>} simplifiedEnds Simplified ends.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.douglasPeuckers = function(flatCoordinates, offset,
    ends, stride, squaredTolerance, simplifiedFlatCoordinates,
    simplifiedOffset, simplifiedEnds) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    simplifiedOffset = ol.geom.flat.simplify.douglasPeucker(
        flatCoordinates, offset, end, stride, squaredTolerance,
        simplifiedFlatCoordinates, simplifiedOffset);
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<Array.<number>>} simplifiedEndss Simplified endss.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.douglasPeuckerss = function(
    flatCoordinates, offset, endss, stride, squaredTolerance,
    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    var simplifiedEnds = [];
    simplifiedOffset = ol.geom.flat.simplify.douglasPeuckers(
        flatCoordinates, offset, ends, stride, squaredTolerance,
        simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
    simplifiedEndss.push(simplifiedEnds);
    offset = ends[ends.length - 1];
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.radialDistance = function(flatCoordinates, offset, end,
    stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  if (end <= offset + stride) {
    // zero or one point, no simplification possible, so copy and return
    for (; offset < end; offset += stride) {
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
      simplifiedFlatCoordinates[simplifiedOffset++] =
          flatCoordinates[offset + 1];
    }
    return simplifiedOffset;
  }
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  // copy first point
  simplifiedFlatCoordinates[simplifiedOffset++] = x1;
  simplifiedFlatCoordinates[simplifiedOffset++] = y1;
  var x2 = x1;
  var y2 = y1;
  for (offset += stride; offset < end; offset += stride) {
    x2 = flatCoordinates[offset];
    y2 = flatCoordinates[offset + 1];
    if (ol.math.squaredDistance(x1, y1, x2, y2) > squaredTolerance) {
      // copy point at offset
      simplifiedFlatCoordinates[simplifiedOffset++] = x2;
      simplifiedFlatCoordinates[simplifiedOffset++] = y2;
      x1 = x2;
      y1 = y2;
    }
  }
  if (x2 != x1 || y2 != y1) {
    // copy last point
    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
  }
  return simplifiedOffset;
};


/**
 * @param {number} value Value.
 * @param {number} tolerance Tolerance.
 * @return {number} Rounded value.
 */
ol.geom.flat.simplify.snap = function(value, tolerance) {
  return tolerance * Math.round(value / tolerance);
};


/**
 * Simplifies a line string using an algorithm designed by Tim Schaub.
 * Coordinates are snapped to the nearest value in a virtual grid and
 * consecutive duplicate coordinates are discarded.  This effectively preserves
 * topology as the simplification of any subsection of a line string is
 * independent of the rest of the line string.  This means that, for examples,
 * the common edge between two polygons will be simplified to the same line
 * string independently in both polygons.  This implementation uses a single
 * pass over the coordinates and eliminates intermediate collinear points.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} tolerance Tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.quantize = function(flatCoordinates, offset, end, stride,
    tolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  // do nothing if the line is empty
  if (offset == end) {
    return simplifiedOffset;
  }
  // snap the first coordinate (P1)
  var x1 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
  var y1 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
  offset += stride;
  // add the first coordinate to the output
  simplifiedFlatCoordinates[simplifiedOffset++] = x1;
  simplifiedFlatCoordinates[simplifiedOffset++] = y1;
  // find the next coordinate that does not snap to the same value as the first
  // coordinate (P2)
  var x2, y2;
  do {
    x2 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
    y2 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    if (offset == end) {
      // all coordinates snap to the same value, the line collapses to a point
      // push the last snapped value anyway to ensure that the output contains
      // at least two points
      // FIXME should we really return at least two points anyway?
      simplifiedFlatCoordinates[simplifiedOffset++] = x2;
      simplifiedFlatCoordinates[simplifiedOffset++] = y2;
      return simplifiedOffset;
    }
  } while (x2 == x1 && y2 == y1);
  while (offset < end) {
    var x3, y3;
    // snap the next coordinate (P3)
    x3 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
    y3 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    // skip P3 if it is equal to P2
    if (x3 == x2 && y3 == y2) {
      continue;
    }
    // calculate the delta between P1 and P2
    var dx1 = x2 - x1;
    var dy1 = y2 - y1;
    // calculate the delta between P3 and P1
    var dx2 = x3 - x1;
    var dy2 = y3 - y1;
    // if P1, P2, and P3 are colinear and P3 is further from P1 than P2 is from
    // P1 in the same direction then P2 is on the straight line between P1 and
    // P3
    if ((dx1 * dy2 == dy1 * dx2) &&
        ((dx1 < 0 && dx2 < dx1) || dx1 == dx2 || (dx1 > 0 && dx2 > dx1)) &&
        ((dy1 < 0 && dy2 < dy1) || dy1 == dy2 || (dy1 > 0 && dy2 > dy1))) {
      // discard P2 and set P2 = P3
      x2 = x3;
      y2 = y3;
      continue;
    }
    // either P1, P2, and P3 are not colinear, or they are colinear but P3 is
    // between P3 and P1 or on the opposite half of the line to P2.  add P2,
    // and continue with P1 = P2 and P2 = P3
    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
    x1 = x2;
    y1 = y2;
    x2 = x3;
    y2 = y3;
  }
  // add the last point (P2)
  simplifiedFlatCoordinates[simplifiedOffset++] = x2;
  simplifiedFlatCoordinates[simplifiedOffset++] = y2;
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} tolerance Tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<number>} simplifiedEnds Simplified ends.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.quantizes = function(
    flatCoordinates, offset, ends, stride,
    tolerance,
    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    simplifiedOffset = ol.geom.flat.simplify.quantize(
        flatCoordinates, offset, end, stride,
        tolerance,
        simplifiedFlatCoordinates, simplifiedOffset);
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} tolerance Tolerance.
 * @param {Array.<number>} simplifiedFlatCoordinates Simplified flat
 *     coordinates.
 * @param {number} simplifiedOffset Simplified offset.
 * @param {Array.<Array.<number>>} simplifiedEndss Simplified endss.
 * @return {number} Simplified offset.
 */
ol.geom.flat.simplify.quantizess = function(
    flatCoordinates, offset, endss, stride,
    tolerance,
    simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    var simplifiedEnds = [];
    simplifiedOffset = ol.geom.flat.simplify.quantizes(
        flatCoordinates, offset, ends, stride,
        tolerance,
        simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
    simplifiedEndss.push(simplifiedEnds);
    offset = ends[ends.length - 1];
  }
  return simplifiedOffset;
};

goog.provide('ol.geom.LinearRing');

goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.area');
goog.require('ol.geom.flat.closest');
goog.require('ol.geom.flat.deflate');
goog.require('ol.geom.flat.inflate');
goog.require('ol.geom.flat.simplify');


/**
 * @classdesc
 * Linear ring geometry. Only used as part of polygon; cannot be rendered
 * on its own.
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api stable
 */
ol.geom.LinearRing = function(coordinates, opt_layout) {

  ol.geom.SimpleGeometry.call(this);

  /**
   * @private
   * @type {number}
   */
  this.maxDelta_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.maxDeltaRevision_ = -1;

  this.setCoordinates(coordinates, opt_layout);

};
ol.inherits(ol.geom.LinearRing, ol.geom.SimpleGeometry);


/**
 * Make a complete copy of the geometry.
 * @return {!ol.geom.LinearRing} Clone.
 * @api stable
 */
ol.geom.LinearRing.prototype.clone = function() {
  var linearRing = new ol.geom.LinearRing(null);
  linearRing.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return linearRing;
};


/**
 * @inheritDoc
 */
ol.geom.LinearRing.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance <
      ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getMaxSquaredDelta(
        this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getClosestPoint(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
};


/**
 * Return the area of the linear ring on projected plane.
 * @return {number} Area (on projected plane).
 * @api stable
 */
ol.geom.LinearRing.prototype.getArea = function() {
  return ol.geom.flat.area.linearRing(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};


/**
 * Return the coordinates of the linear ring.
 * @return {Array.<ol.Coordinate>} Coordinates.
 * @api stable
 */
ol.geom.LinearRing.prototype.getCoordinates = function() {
  return ol.geom.flat.inflate.coordinates(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};


/**
 * @inheritDoc
 */
ol.geom.LinearRing.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(
      this.flatCoordinates, 0, this.flatCoordinates.length, this.stride,
      squaredTolerance, simplifiedFlatCoordinates, 0);
  var simplifiedLinearRing = new ol.geom.LinearRing(null);
  simplifiedLinearRing.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates);
  return simplifiedLinearRing;
};


/**
 * @inheritDoc
 * @api stable
 */
ol.geom.LinearRing.prototype.getType = function() {
  return ol.geom.GeometryType.LINEAR_RING;
};


/**
 * Set the coordinates of the linear ring.
 * @param {Array.<ol.Coordinate>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api stable
 */
ol.geom.LinearRing.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(
        this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 */
ol.geom.LinearRing.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};

goog.provide('ol.geom.Point');

goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.deflate');
goog.require('ol.math');


/**
 * @classdesc
 * Point geometry.
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {ol.Coordinate} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api stable
 */
ol.geom.Point = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.Point, ol.geom.SimpleGeometry);


/**
 * Make a complete copy of the geometry.
 * @return {!ol.geom.Point} Clone.
 * @api stable
 */
ol.geom.Point.prototype.clone = function() {
  var point = new ol.geom.Point(null);
  point.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return point;
};


/**
 * @inheritDoc
 */
ol.geom.Point.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  var flatCoordinates = this.flatCoordinates;
  var squaredDistance = ol.math.squaredDistance(
      x, y, flatCoordinates[0], flatCoordinates[1]);
  if (squaredDistance < minSquaredDistance) {
    var stride = this.stride;
    var i;
    for (i = 0; i < stride; ++i) {
      closestPoint[i] = flatCoordinates[i];
    }
    closestPoint.length = stride;
    return squaredDistance;
  } else {
    return minSquaredDistance;
  }
};


/**
 * Return the coordinate of the point.
 * @return {ol.Coordinate} Coordinates.
 * @api stable
 */
ol.geom.Point.prototype.getCoordinates = function() {
  return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
};


/**
 * @inheritDoc
 */
ol.geom.Point.prototype.computeExtent = function(extent) {
  return ol.extent.createOrUpdateFromCoordinate(this.flatCoordinates, extent);
};


/**
 * @inheritDoc
 * @api stable
 */
ol.geom.Point.prototype.getType = function() {
  return ol.geom.GeometryType.POINT;
};


/**
 * @inheritDoc
 * @api stable
 */
ol.geom.Point.prototype.intersectsExtent = function(extent) {
  return ol.extent.containsXY(extent,
      this.flatCoordinates[0], this.flatCoordinates[1]);
};


/**
 * Set the coordinate of the point.
 * @param {ol.Coordinate} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api stable
 */
ol.geom.Point.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinate(
        this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 */
ol.geom.Point.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};

goog.provide('ol.geom.flat.contains');

goog.require('goog.asserts');
goog.require('ol.extent');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} Contains extent.
 */
ol.geom.flat.contains.linearRingContainsExtent = function(flatCoordinates, offset, end, stride, extent) {
  var outside = ol.extent.forEachCorner(extent,
      /**
       * @param {ol.Coordinate} coordinate Coordinate.
       * @return {boolean} Contains (x, y).
       */
      function(coordinate) {
        return !ol.geom.flat.contains.linearRingContainsXY(flatCoordinates,
            offset, end, stride, coordinate[0], coordinate[1]);
      });
  return !outside;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.contains.linearRingContainsXY = function(flatCoordinates, offset, end, stride, x, y) {
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  var contains = false;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    var intersect = ((y1 > y) != (y2 > y)) &&
        (x < (x2 - x1) * (y - y1) / (y2 - y1) + x1);
    if (intersect) {
      contains = !contains;
    }
    x1 = x2;
    y1 = y2;
  }
  return contains;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.contains.linearRingsContainsXY = function(flatCoordinates, offset, ends, stride, x, y) {
  goog.asserts.assert(ends.length > 0, 'ends should not be an empty array');
  if (ends.length === 0) {
    return false;
  }
  if (!ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, ends[0], stride, x, y)) {
    return false;
  }
  var i, ii;
  for (i = 1, ii = ends.length; i < ii; ++i) {
    if (ol.geom.flat.contains.linearRingContainsXY(
        flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */
ol.geom.flat.contains.linearRingssContainsXY = function(flatCoordinates, offset, endss, stride, x, y) {
  goog.asserts.assert(endss.length > 0, 'endss should not be an empty array');
  if (endss.length === 0) {
    return false;
  }
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    if (ol.geom.flat.contains.linearRingsContainsXY(
        flatCoordinates, offset, ends, stride, x, y)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
};

goog.provide('ol.geom.flat.interiorpoint');

goog.require('goog.asserts');
goog.require('ol.array');
goog.require('ol.geom.flat.contains');


/**
 * Calculates a point that is likely to lie in the interior of the linear rings.
 * Inspired by JTS's com.vividsolutions.jts.geom.Geometry#getInteriorPoint.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {Array.<number>} flatCenters Flat centers.
 * @param {number} flatCentersOffset Flat center offset.
 * @param {Array.<number>=} opt_dest Destination.
 * @return {Array.<number>} Destination.
 */
ol.geom.flat.interiorpoint.linearRings = function(flatCoordinates, offset,
    ends, stride, flatCenters, flatCentersOffset, opt_dest) {
  var i, ii, x, x1, x2, y1, y2;
  var y = flatCenters[flatCentersOffset + 1];
  /** @type {Array.<number>} */
  var intersections = [];
  // Calculate intersections with the horizontal line
  var end = ends[0];
  x1 = flatCoordinates[end - stride];
  y1 = flatCoordinates[end - stride + 1];
  for (i = offset; i < end; i += stride) {
    x2 = flatCoordinates[i];
    y2 = flatCoordinates[i + 1];
    if ((y <= y1 && y2 <= y) || (y1 <= y && y <= y2)) {
      x = (y - y1) / (y2 - y1) * (x2 - x1) + x1;
      intersections.push(x);
    }
    x1 = x2;
    y1 = y2;
  }
  // Find the longest segment of the horizontal line that has its center point
  // inside the linear ring.
  var pointX = NaN;
  var maxSegmentLength = -Infinity;
  intersections.sort(ol.array.numberSafeCompareFunction);
  x1 = intersections[0];
  for (i = 1, ii = intersections.length; i < ii; ++i) {
    x2 = intersections[i];
    var segmentLength = Math.abs(x2 - x1);
    if (segmentLength > maxSegmentLength) {
      x = (x1 + x2) / 2;
      if (ol.geom.flat.contains.linearRingsContainsXY(
          flatCoordinates, offset, ends, stride, x, y)) {
        pointX = x;
        maxSegmentLength = segmentLength;
      }
    }
    x1 = x2;
  }
  if (isNaN(pointX)) {
    // There is no horizontal line that has its center point inside the linear
    // ring.  Use the center of the the linear ring's extent.
    pointX = flatCenters[flatCentersOffset];
  }
  if (opt_dest) {
    opt_dest.push(pointX, y);
    return opt_dest;
  } else {
    return [pointX, y];
  }
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {Array.<number>} flatCenters Flat centers.
 * @return {Array.<number>} Interior points.
 */
ol.geom.flat.interiorpoint.linearRingss = function(flatCoordinates, offset, endss, stride, flatCenters) {
  goog.asserts.assert(2 * endss.length == flatCenters.length,
      'endss.length times 2 should be flatCenters.length');
  var interiorPoints = [];
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    interiorPoints = ol.geom.flat.interiorpoint.linearRings(flatCoordinates,
        offset, ends, stride, flatCenters, 2 * i, interiorPoints);
    offset = ends[ends.length - 1];
  }
  return interiorPoints;
};

goog.provide('ol.geom.flat.segments');


/**
 * This function calls `callback` for each segment of the flat coordinates
 * array. If the callback returns a truthy value the function returns that
 * value immediately. Otherwise the function returns `false`.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {function(this: S, ol.Coordinate, ol.Coordinate): T} callback Function
 *     called for each segment.
 * @param {S=} opt_this The object to be used as the value of 'this'
 *     within callback.
 * @return {T|boolean} Value.
 * @template T,S
 */
ol.geom.flat.segments.forEach = function(flatCoordinates, offset, end, stride, callback, opt_this) {
  var point1 = [flatCoordinates[offset], flatCoordinates[offset + 1]];
  var point2 = [];
  var ret;
  for (; (offset + stride) < end; offset += stride) {
    point2[0] = flatCoordinates[offset + stride];
    point2[1] = flatCoordinates[offset + stride + 1];
    ret = callback.call(opt_this, point1, point2);
    if (ret) {
      return ret;
    }
    point1[0] = point2[0];
    point1[1] = point2[1];
  }
  return false;
};

goog.provide('ol.geom.flat.intersectsextent');

goog.require('goog.asserts');
goog.require('ol.extent');
goog.require('ol.geom.flat.contains');
goog.require('ol.geom.flat.segments');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.lineString = function(flatCoordinates, offset, end, stride, extent) {
  var coordinatesExtent = ol.extent.extendFlatCoordinates(
      ol.extent.createEmpty(), flatCoordinates, offset, end, stride);
  if (!ol.extent.intersects(extent, coordinatesExtent)) {
    return false;
  }
  if (ol.extent.containsExtent(extent, coordinatesExtent)) {
    return true;
  }
  if (coordinatesExtent[0] >= extent[0] &&
      coordinatesExtent[2] <= extent[2]) {
    return true;
  }
  if (coordinatesExtent[1] >= extent[1] &&
      coordinatesExtent[3] <= extent[3]) {
    return true;
  }
  return ol.geom.flat.segments.forEach(flatCoordinates, offset, end, stride,
      /**
       * @param {ol.Coordinate} point1 Start point.
       * @param {ol.Coordinate} point2 End point.
       * @return {boolean} `true` if the segment and the extent intersect,
       *     `false` otherwise.
       */
      function(point1, point2) {
        return ol.extent.intersectsSegment(extent, point1, point2);
      });
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.lineStrings = function(flatCoordinates, offset, ends, stride, extent) {
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    if (ol.geom.flat.intersectsextent.lineString(
        flatCoordinates, offset, ends[i], stride, extent)) {
      return true;
    }
    offset = ends[i];
  }
  return false;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.linearRing = function(flatCoordinates, offset, end, stride, extent) {
  if (ol.geom.flat.intersectsextent.lineString(
      flatCoordinates, offset, end, stride, extent)) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[0], extent[1])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[0], extent[3])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[2], extent[1])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(
      flatCoordinates, offset, end, stride, extent[2], extent[3])) {
    return true;
  }
  return false;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.linearRings = function(flatCoordinates, offset, ends, stride, extent) {
  goog.asserts.assert(ends.length > 0, 'ends should not be an empty array');
  if (!ol.geom.flat.intersectsextent.linearRing(
      flatCoordinates, offset, ends[0], stride, extent)) {
    return false;
  }
  if (ends.length === 1) {
    return true;
  }
  var i, ii;
  for (i = 1, ii = ends.length; i < ii; ++i) {
    if (ol.geom.flat.contains.linearRingContainsExtent(
        flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
      return false;
    }
  }
  return true;
};


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {ol.Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
ol.geom.flat.intersectsextent.linearRingss = function(flatCoordinates, offset, endss, stride, extent) {
  goog.asserts.assert(endss.length > 0, 'endss should not be an empty array');
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    if (ol.geom.flat.intersectsextent.linearRings(
        flatCoordinates, offset, ends, stride, extent)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
};

goog.provide('ol.geom.flat.reverse');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 */
ol.geom.flat.reverse.coordinates = function(flatCoordinates, offset, end, stride) {
  while (offset < end - stride) {
    var i;
    for (i = 0; i < stride; ++i) {
      var tmp = flatCoordinates[offset + i];
      flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
      flatCoordinates[end - stride + i] = tmp;
    }
    offset += stride;
    end -= stride;
  }
};

goog.provide('ol.geom.flat.orient');

goog.require('ol');
goog.require('ol.geom.flat.reverse');


/**
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {boolean} Is clockwise.
 */
ol.geom.flat.orient.linearRingIsClockwise = function(flatCoordinates, offset, end, stride) {
  // http://tinyurl.com/clockwise-method
  // https://github.com/OSGeo/gdal/blob/trunk/gdal/ogr/ogrlinearring.cpp
  var edge = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (; offset < end; offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    edge += (x2 - x1) * (y2 + y1);
    x1 = x2;
    y1 = y2;
  }
  return edge > 0;
};


/**
 * Determines if linear rings are oriented.  By default, left-hand orientation
 * is tested (first ring must be clockwise, remaining rings counter-clockwise).
 * To test for right-hand orientation, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Array of end indexes.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Test for right-hand orientation
 *     (counter-clockwise exterior ring and clockwise interior rings).
 * @return {boolean} Rings are correctly oriented.
 */
ol.geom.flat.orient.linearRingsAreOriented = function(flatCoordinates, offset, ends, stride, opt_right) {
  var right = opt_right !== undefined ? opt_right : false;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(
        flatCoordinates, offset, end, stride);
    if (i === 0) {
      if ((right && isClockwise) || (!right && !isClockwise)) {
        return false;
      }
    } else {
      if ((right && !isClockwise) || (!right && isClockwise)) {
        return false;
      }
    }
    offset = end;
  }
  return true;
};


/**
 * Determines if linear rings are oriented.  By default, left-hand orientation
 * is tested (first ring must be clockwise, remaining rings counter-clockwise).
 * To test for right-hand orientation, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Array of array of end indexes.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Test for right-hand orientation
 *     (counter-clockwise exterior ring and clockwise interior rings).
 * @return {boolean} Rings are correctly oriented.
 */
ol.geom.flat.orient.linearRingssAreOriented = function(flatCoordinates, offset, endss, stride, opt_right) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    if (!ol.geom.flat.orient.linearRingsAreOriented(
        flatCoordinates, offset, endss[i], stride, opt_right)) {
      return false;
    }
  }
  return true;
};


/**
 * Orient coordinates in a flat array of linear rings.  By default, rings
 * are oriented following the left-hand rule (clockwise for exterior and
 * counter-clockwise for interior rings).  To orient according to the
 * right-hand rule, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Follow the right-hand rule for orientation.
 * @return {number} End.
 */
ol.geom.flat.orient.orientLinearRings = function(flatCoordinates, offset, ends, stride, opt_right) {
  var right = opt_right !== undefined ? opt_right : false;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(
        flatCoordinates, offset, end, stride);
    var reverse = i === 0 ?
        (right && isClockwise) || (!right && !isClockwise) :
        (right && !isClockwise) || (!right && isClockwise);
    if (reverse) {
      ol.geom.flat.reverse.coordinates(flatCoordinates, offset, end, stride);
    }
    offset = end;
  }
  return offset;
};


/**
 * Orient coordinates in a flat array of linear rings.  By default, rings
 * are oriented following the left-hand rule (clockwise for exterior and
 * counter-clockwise for interior rings).  To orient according to the
 * right-hand rule, use the `opt_right` argument.
 *
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array.<Array.<number>>} endss Array of array of end indexes.
 * @param {number} stride Stride.
 * @param {boolean=} opt_right Follow the right-hand rule for orientation.
 * @return {number} End.
 */
ol.geom.flat.orient.orientLinearRingss = function(flatCoordinates, offset, endss, stride, opt_right) {
  var i, ii;
  for (i = 0, ii = endss.length; i < ii; ++i) {
    offset = ol.geom.flat.orient.orientLinearRings(
        flatCoordinates, offset, endss[i], stride, opt_right);
  }
  return offset;
};

goog.provide('ol.geom.Polygon');

goog.require('goog.asserts');
goog.require('ol');
goog.require('ol.array');
goog.require('ol.extent');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.LinearRing');
goog.require('ol.geom.Point');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.geom.flat.area');
goog.require('ol.geom.flat.closest');
goog.require('ol.geom.flat.contains');
goog.require('ol.geom.flat.deflate');
goog.require('ol.geom.flat.inflate');
goog.require('ol.geom.flat.interiorpoint');
goog.require('ol.geom.flat.intersectsextent');
goog.require('ol.geom.flat.orient');
goog.require('ol.geom.flat.simplify');
goog.require('ol.math');


/**
 * @classdesc
 * Polygon geometry.
 *
 * @constructor
 * @extends {ol.geom.SimpleGeometry}
 * @param {Array.<Array.<ol.Coordinate>>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api stable
 */
ol.geom.Polygon = function(coordinates, opt_layout) {

  ol.geom.SimpleGeometry.call(this);

  /**
   * @type {Array.<number>}
   * @private
   */
  this.ends_ = [];

  /**
   * @private
   * @type {number}
   */
  this.flatInteriorPointRevision_ = -1;

  /**
   * @private
   * @type {ol.Coordinate}
   */
  this.flatInteriorPoint_ = null;

  /**
   * @private
   * @type {number}
   */
  this.maxDelta_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.maxDeltaRevision_ = -1;

  /**
   * @private
   * @type {number}
   */
  this.orientedRevision_ = -1;

  /**
   * @private
   * @type {Array.<number>}
   */
  this.orientedFlatCoordinates_ = null;

  this.setCoordinates(coordinates, opt_layout);

};
ol.inherits(ol.geom.Polygon, ol.geom.SimpleGeometry);


/**
 * Append the passed linear ring to this polygon.
 * @param {ol.geom.LinearRing} linearRing Linear ring.
 * @api stable
 */
ol.geom.Polygon.prototype.appendLinearRing = function(linearRing) {
  goog.asserts.assert(linearRing.getLayout() == this.layout,
      'layout of linearRing should match layout');
  if (!this.flatCoordinates) {
    this.flatCoordinates = linearRing.getFlatCoordinates().slice();
  } else {
    ol.array.extend(this.flatCoordinates, linearRing.getFlatCoordinates());
  }
  this.ends_.push(this.flatCoordinates.length);
  this.changed();
};


/**
 * Make a complete copy of the geometry.
 * @return {!ol.geom.Polygon} Clone.
 * @api stable
 */
ol.geom.Polygon.prototype.clone = function() {
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(
      this.layout, this.flatCoordinates.slice(), this.ends_.slice());
  return polygon;
};


/**
 * @inheritDoc
 */
ol.geom.Polygon.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance <
      ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getsMaxSquaredDelta(
        this.flatCoordinates, 0, this.ends_, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getsClosestPoint(
      this.flatCoordinates, 0, this.ends_, this.stride,
      this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
};


/**
 * @inheritDoc
 */
ol.geom.Polygon.prototype.containsXY = function(x, y) {
  return ol.geom.flat.contains.linearRingsContainsXY(
      this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, x, y);
};


/**
 * Return the area of the polygon on projected plane.
 * @return {number} Area (on projected plane).
 * @api stable
 */
ol.geom.Polygon.prototype.getArea = function() {
  return ol.geom.flat.area.linearRings(
      this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
};


/**
 * Get the coordinate array for this geometry.  This array has the structure
 * of a GeoJSON coordinate array for polygons.
 *
 * @param {boolean=} opt_right Orient coordinates according to the right-hand
 *     rule (counter-clockwise for exterior and clockwise for interior rings).
 *     If `false`, coordinates will be oriented according to the left-hand rule
 *     (clockwise for exterior and counter-clockwise for interior rings).
 *     By default, coordinate orientation will depend on how the geometry was
 *     constructed.
 * @return {Array.<Array.<ol.Coordinate>>} Coordinates.
 * @api stable
 */
ol.geom.Polygon.prototype.getCoordinates = function(opt_right) {
  var flatCoordinates;
  if (opt_right !== undefined) {
    flatCoordinates = this.getOrientedFlatCoordinates().slice();
    ol.geom.flat.orient.orientLinearRings(
        flatCoordinates, 0, this.ends_, this.stride, opt_right);
  } else {
    flatCoordinates = this.flatCoordinates;
  }

  return ol.geom.flat.inflate.coordinatess(
      flatCoordinates, 0, this.ends_, this.stride);
};


/**
 * @return {Array.<number>} Ends.
 */
ol.geom.Polygon.prototype.getEnds = function() {
  return this.ends_;
};


/**
 * @return {Array.<number>} Interior point.
 */
ol.geom.Polygon.prototype.getFlatInteriorPoint = function() {
  if (this.flatInteriorPointRevision_ != this.getRevision()) {
    var flatCenter = ol.extent.getCenter(this.getExtent());
    this.flatInteriorPoint_ = ol.geom.flat.interiorpoint.linearRings(
        this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride,
        flatCenter, 0);
    this.flatInteriorPointRevision_ = this.getRevision();
  }
  return this.flatInteriorPoint_;
};


/**
 * Return an interior point of the polygon.
 * @return {ol.geom.Point} Interior point.
 * @api stable
 */
ol.geom.Polygon.prototype.getInteriorPoint = function() {
  return new ol.geom.Point(this.getFlatInteriorPoint());
};


/**
 * Return the number of rings of the polygon,  this includes the exterior
 * ring and any interior rings.
 *
 * @return {number} Number of rings.
 * @api
 */
ol.geom.Polygon.prototype.getLinearRingCount = function() {
  return this.ends_.length;
};


/**
 * Return the Nth linear ring of the polygon geometry. Return `null` if the
 * given index is out of range.
 * The exterior linear ring is available at index `0` and the interior rings
 * at index `1` and beyond.
 *
 * @param {number} index Index.
 * @return {ol.geom.LinearRing} Linear ring.
 * @api stable
 */
ol.geom.Polygon.prototype.getLinearRing = function(index) {
  goog.asserts.assert(0 <= index && index < this.ends_.length,
      'index should be in between 0 and and length of this.ends_');
  if (index < 0 || this.ends_.length <= index) {
    return null;
  }
  var linearRing = new ol.geom.LinearRing(null);
  linearRing.setFlatCoordinates(this.layout, this.flatCoordinates.slice(
      index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]));
  return linearRing;
};


/**
 * Return the linear rings of the polygon.
 * @return {Array.<ol.geom.LinearRing>} Linear rings.
 * @api stable
 */
ol.geom.Polygon.prototype.getLinearRings = function() {
  var layout = this.layout;
  var flatCoordinates = this.flatCoordinates;
  var ends = this.ends_;
  var linearRings = [];
  var offset = 0;
  var i, ii;
  for (i = 0, ii = ends.length; i < ii; ++i) {
    var end = ends[i];
    var linearRing = new ol.geom.LinearRing(null);
    linearRing.setFlatCoordinates(layout, flatCoordinates.slice(offset, end));
    linearRings.push(linearRing);
    offset = end;
  }
  return linearRings;
};


/**
 * @return {Array.<number>} Oriented flat coordinates.
 */
ol.geom.Polygon.prototype.getOrientedFlatCoordinates = function() {
  if (this.orientedRevision_ != this.getRevision()) {
    var flatCoordinates = this.flatCoordinates;
    if (ol.geom.flat.orient.linearRingsAreOriented(
        flatCoordinates, 0, this.ends_, this.stride)) {
      this.orientedFlatCoordinates_ = flatCoordinates;
    } else {
      this.orientedFlatCoordinates_ = flatCoordinates.slice();
      this.orientedFlatCoordinates_.length =
          ol.geom.flat.orient.orientLinearRings(
              this.orientedFlatCoordinates_, 0, this.ends_, this.stride);
    }
    this.orientedRevision_ = this.getRevision();
  }
  return this.orientedFlatCoordinates_;
};


/**
 * @inheritDoc
 */
ol.geom.Polygon.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  var simplifiedEnds = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.quantizes(
      this.flatCoordinates, 0, this.ends_, this.stride,
      Math.sqrt(squaredTolerance),
      simplifiedFlatCoordinates, 0, simplifiedEnds);
  var simplifiedPolygon = new ol.geom.Polygon(null);
  simplifiedPolygon.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEnds);
  return simplifiedPolygon;
};


/**
 * @inheritDoc
 * @api stable
 */
ol.geom.Polygon.prototype.getType = function() {
  return ol.geom.GeometryType.POLYGON;
};


/**
 * @inheritDoc
 * @api stable
 */
ol.geom.Polygon.prototype.intersectsExtent = function(extent) {
  return ol.geom.flat.intersectsextent.linearRings(
      this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, extent);
};


/**
 * Set the coordinates of the polygon.
 * @param {Array.<Array.<ol.Coordinate>>} coordinates Coordinates.
 * @param {ol.geom.GeometryLayout=} opt_layout Layout.
 * @api stable
 */
ol.geom.Polygon.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ends_);
  } else {
    this.setLayout(opt_layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var ends = ol.geom.flat.deflate.coordinatess(
        this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
};


/**
 * @param {ol.geom.GeometryLayout} layout Layout.
 * @param {Array.<number>} flatCoordinates Flat coordinates.
 * @param {Array.<number>} ends Ends.
 */
ol.geom.Polygon.prototype.setFlatCoordinates = function(layout, flatCoordinates, ends) {
  if (!flatCoordinates) {
    goog.asserts.assert(ends && ends.length === 0,
        'ends must be an empty array');
  } else if (ends.length === 0) {
    goog.asserts.assert(flatCoordinates.length === 0,
        'flatCoordinates should be an empty array');
  } else {
    goog.asserts.assert(flatCoordinates.length == ends[ends.length - 1],
        'the length of flatCoordinates should be the last entry of ends');
  }
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.ends_ = ends;
  this.changed();
};


/**
 * Create an approximation of a circle on the surface of a sphere.
 * @param {ol.Sphere} sphere The sphere.
 * @param {ol.Coordinate} center Center (`[lon, lat]` in degrees).
 * @param {number} radius The great-circle distance from the center to
 *     the polygon vertices.
 * @param {number=} opt_n Optional number of vertices for the resulting
 *     polygon. Default is `32`.
 * @return {ol.geom.Polygon} The "circular" polygon.
 * @api stable
 */
ol.geom.Polygon.circular = function(sphere, center, radius, opt_n) {
  var n = opt_n ? opt_n : 32;
  /** @type {Array.<number>} */
  var flatCoordinates = [];
  var i;
  for (i = 0; i < n; ++i) {
    ol.array.extend(
        flatCoordinates, sphere.offset(center, radius, 2 * Math.PI * i / n));
  }
  flatCoordinates.push(flatCoordinates[0], flatCoordinates[1]);
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
  return polygon;
};


/**
 * Create a polygon from an extent. The layout used is `XY`.
 * @param {ol.Extent} extent The extent.
 * @return {ol.geom.Polygon} The polygon.
 * @api
 */
ol.geom.Polygon.fromExtent = function(extent) {
  var minX = extent[0];
  var minY = extent[1];
  var maxX = extent[2];
  var maxY = extent[3];
  var flatCoordinates =
      [minX, minY, minX, maxY, maxX, maxY, maxX, minY, minX, minY];
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(
      ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
  return polygon;
};


/**
 * Create a regular polygon from a circle.
 * @param {ol.geom.Circle} circle Circle geometry.
 * @param {number=} opt_sides Number of sides of the polygon. Default is 32.
 * @param {number=} opt_angle Start angle for the first vertex of the polygon in
 *     radians. Default is 0.
 * @return {ol.geom.Polygon} Polygon geometry.
 * @api
 */
ol.geom.Polygon.fromCircle = function(circle, opt_sides, opt_angle) {
  var sides = opt_sides ? opt_sides : 32;
  var stride = circle.getStride();
  var layout = circle.getLayout();
  var polygon = new ol.geom.Polygon(null, layout);
  var arrayLength = stride * (sides + 1);
  var flatCoordinates = new Array(arrayLength);
  for (var i = 0; i < arrayLength; i++) {
    flatCoordinates[i] = 0;
  }
  var ends = [flatCoordinates.length];
  polygon.setFlatCoordinates(layout, flatCoordinates, ends);
  ol.geom.Polygon.makeRegular(
      polygon, circle.getCenter(), circle.getRadius(), opt_angle);
  return polygon;
};


/**
 * Modify the coordinates of a polygon to make it a regular polygon.
 * @param {ol.geom.Polygon} polygon Polygon geometry.
 * @param {ol.Coordinate} center Center of the regular polygon.
 * @param {number} radius Radius of the regular polygon.
 * @param {number=} opt_angle Start angle for the first vertex of the polygon in
 *     radians. Default is 0.
 */
ol.geom.Polygon.makeRegular = function(polygon, center, radius, opt_angle) {
  var flatCoordinates = polygon.getFlatCoordinates();
  var layout = polygon.getLayout();
  var stride = polygon.getStride();
  var ends = polygon.getEnds();
  goog.asserts.assert(ends.length === 1, 'only 1 ring is supported');
  var sides = flatCoordinates.length / stride - 1;
  var startAngle = opt_angle ? opt_angle : 0;
  var angle, offset;
  for (var i = 0; i <= sides; ++i) {
    offset = i * stride;
    angle = startAngle + (ol.math.modulo(i, sides) * 2 * Math.PI / sides);
    flatCoordinates[offset] = center[0] + (radius * Math.cos(angle));
    flatCoordinates[offset + 1] = center[1] + (radius * Math.sin(angle));
  }
  polygon.setFlatCoordinates(layout, flatCoordinates, ends);
};

goog.provide('ol.View');
goog.provide('ol.ViewHint');
goog.provide('ol.ViewProperty');

goog.require('goog.asserts');
goog.require('ol');
goog.require('ol.CenterConstraint');
goog.require('ol.Constraints');
goog.require('ol.Object');
goog.require('ol.ResolutionConstraint');
goog.require('ol.RotationConstraint');
goog.require('ol.coordinate');
goog.require('ol.extent');
goog.require('ol.geom.Polygon');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.proj');
goog.require('ol.proj.METERS_PER_UNIT');
goog.require('ol.proj.Projection');
goog.require('ol.proj.Units');


/**
 * @enum {string}
 */
ol.ViewProperty = {
  CENTER: 'center',
  RESOLUTION: 'resolution',
  ROTATION: 'rotation'
};


/**
 * @enum {number}
 */
ol.ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};


/**
 * @classdesc
 * An ol.View object represents a simple 2D view of the map.
 *
 * This is the object to act upon to change the center, resolution,
 * and rotation of the map.
 *
 * ### The view states
 *
 * An `ol.View` is determined by three states: `center`, `resolution`,
 * and `rotation`. Each state has a corresponding getter and setter, e.g.
 * `getCenter` and `setCenter` for the `center` state.
 *
 * An `ol.View` has a `projection`. The projection determines the
 * coordinate system of the center, and its units determine the units of the
 * resolution (projection units per pixel). The default projection is
 * Spherical Mercator (EPSG:3857).
 *
 * ### The constraints
 *
 * `setCenter`, `setResolution` and `setRotation` can be used to change the
 * states of the view. Any value can be passed to the setters. And the value
 * that is passed to a setter will effectively be the value set in the view,
 * and returned by the corresponding getter.
 *
 * But an `ol.View` object also has a *resolution constraint*, a
 * *rotation constraint* and a *center constraint*.
 *
 * As said above, no constraints are applied when the setters are used to set
 * new states for the view. Applying constraints is done explicitly through
 * the use of the `constrain*` functions (`constrainResolution` and
 * `constrainRotation` and `constrainCenter`).
 *
 * The main users of the constraints are the interactions and the
 * controls. For example, double-clicking on the map changes the view to
 * the "next" resolution. And releasing the fingers after pinch-zooming
 * snaps to the closest resolution (with an animation).
 *
 * The *resolution constraint* snaps to specific resolutions. It is
 * determined by the following options: `resolutions`, `maxResolution`,
 * `maxZoom`, and `zoomFactor`. If `resolutions` is set, the other three
 * options are ignored. See documentation for each option for more
 * information.
 *
 * The *rotation constraint* snaps to specific angles. It is determined
 * by the following options: `enableRotation` and `constrainRotation`.
 * By default the rotation value is snapped to zero when approaching the
 * horizontal.
 *
 * The *center constraint* is determined by the `extent` option. By
 * default the center is not constrained at all.
 *
 * @constructor
 * @extends {ol.Object}
 * @param {olx.ViewOptions=} opt_options View options.
 * @api stable
 */
ol.View = function(opt_options) {
  ol.Object.call(this);
  var options = opt_options || {};

  /**
   * @private
   * @type {Array.<number>}
   */
  this.hints_ = [0, 0];

  /**
   * @type {Object.<string, *>}
   */
  var properties = {};
  properties[ol.ViewProperty.CENTER] = options.center !== undefined ?
      options.center : null;

  /**
   * @private
   * @const
   * @type {ol.proj.Projection}
   */
  this.projection_ = ol.proj.createProjection(options.projection, 'EPSG:3857');

  var resolutionConstraintInfo = ol.View.createResolutionConstraint_(
      options);

  /**
   * @private
   * @type {number}
   */
  this.maxResolution_ = resolutionConstraintInfo.maxResolution;

  /**
   * @private
   * @type {number}
   */
  this.minResolution_ = resolutionConstraintInfo.minResolution;

  /**
   * @private
   * @type {Array.<number>|undefined}
   */
  this.resolutions_ = options.resolutions;

  /**
   * @private
   * @type {number}
   */
  this.minZoom_ = resolutionConstraintInfo.minZoom;

  var centerConstraint = ol.View.createCenterConstraint_(options);
  var resolutionConstraint = resolutionConstraintInfo.constraint;
  var rotationConstraint = ol.View.createRotationConstraint_(options);

  /**
   * @private
   * @type {ol.Constraints}
   */
  this.constraints_ = new ol.Constraints(
      centerConstraint, resolutionConstraint, rotationConstraint);

  if (options.resolution !== undefined) {
    properties[ol.ViewProperty.RESOLUTION] = options.resolution;
  } else if (options.zoom !== undefined) {
    properties[ol.ViewProperty.RESOLUTION] = this.constrainResolution(
        this.maxResolution_, options.zoom - this.minZoom_);
  }
  properties[ol.ViewProperty.ROTATION] =
      options.rotation !== undefined ? options.rotation : 0;
  this.setProperties(properties);
};
ol.inherits(ol.View, ol.Object);


/**
 * @param {number} rotation Target rotation.
 * @param {ol.Coordinate} anchor Rotation anchor.
 * @return {ol.Coordinate|undefined} Center for rotation and anchor.
 */
ol.View.prototype.calculateCenterRotate = function(rotation, anchor) {
  var center;
  var currentCenter = this.getCenter();
  if (currentCenter !== undefined) {
    center = [currentCenter[0] - anchor[0], currentCenter[1] - anchor[1]];
    ol.coordinate.rotate(center, rotation - this.getRotation());
    ol.coordinate.add(center, anchor);
  }
  return center;
};


/**
 * @param {number} resolution Target resolution.
 * @param {ol.Coordinate} anchor Zoom anchor.
 * @return {ol.Coordinate|undefined} Center for resolution and anchor.
 */
ol.View.prototype.calculateCenterZoom = function(resolution, anchor) {
  var center;
  var currentCenter = this.getCenter();
  var currentResolution = this.getResolution();
  if (currentCenter !== undefined && currentResolution !== undefined) {
    var x = anchor[0] -
        resolution * (anchor[0] - currentCenter[0]) / currentResolution;
    var y = anchor[1] -
        resolution * (anchor[1] - currentCenter[1]) / currentResolution;
    center = [x, y];
  }
  return center;
};


/**
 * Get the constrained center of this view.
 * @param {ol.Coordinate|undefined} center Center.
 * @return {ol.Coordinate|undefined} Constrained center.
 * @api
 */
ol.View.prototype.constrainCenter = function(center) {
  return this.constraints_.center(center);
};


/**
 * Get the constrained resolution of this view.
 * @param {number|undefined} resolution Resolution.
 * @param {number=} opt_delta Delta. Default is `0`.
 * @param {number=} opt_direction Direction. Default is `0`.
 * @return {number|undefined} Constrained resolution.
 * @api
 */
ol.View.prototype.constrainResolution = function(
    resolution, opt_delta, opt_direction) {
  var delta = opt_delta || 0;
  var direction = opt_direction || 0;
  return this.constraints_.resolution(resolution, delta, direction);
};


/**
 * Get the constrained rotation of this view.
 * @param {number|undefined} rotation Rotation.
 * @param {number=} opt_delta Delta. Default is `0`.
 * @return {number|undefined} Constrained rotation.
 * @api
 */
ol.View.prototype.constrainRotation = function(rotation, opt_delta) {
  var delta = opt_delta || 0;
  return this.constraints_.rotation(rotation, delta);
};


/**
 * Get the view center.
 * @return {ol.Coordinate|undefined} The center of the view.
 * @observable
 * @api stable
 */
ol.View.prototype.getCenter = function() {
  return /** @type {ol.Coordinate|undefined} */ (
      this.get(ol.ViewProperty.CENTER));
};


/**
 * @param {Array.<number>=} opt_hints Destination array.
 * @return {Array.<number>} Hint.
 */
ol.View.prototype.getHints = function(opt_hints) {
  if (opt_hints !== undefined) {
    opt_hints[0] = this.hints_[0];
    opt_hints[1] = this.hints_[1];
    return opt_hints;
  } else {
    return this.hints_.slice();
  }
};


/**
 * Calculate the extent for the current view state and the passed size.
 * The size is the pixel dimensions of the box into which the calculated extent
 * should fit. In most cases you want to get the extent of the entire map,
 * that is `map.getSize()`.
 * @param {ol.Size} size Box pixel size.
 * @return {ol.Extent} Extent.
 * @api stable
 */
ol.View.prototype.calculateExtent = function(size) {
  var center = this.getCenter();
  goog.asserts.assert(center, 'The view center is not defined');
  var resolution = this.getResolution();
  goog.asserts.assert(resolution !== undefined,
      'The view resolution is not defined');
  var rotation = this.getRotation();
  goog.asserts.assert(rotation !== undefined,
      'The view rotation is not defined');

  return ol.extent.getForViewAndSize(center, resolution, rotation, size);
};


/**
 * Get the maximum resolution of the view.
 * @return {number} The maximum resolution of the view.
 * @api
 */
ol.View.prototype.getMaxResolution = function() {
  return this.maxResolution_;
};


/**
 * Get the minimum resolution of the view.
 * @return {number} The minimum resolution of the view.
 * @api
 */
ol.View.prototype.getMinResolution = function() {
  return this.minResolution_;
};


/**
 * Get the view projection.
 * @return {ol.proj.Projection} The projection of the view.
 * @api stable
 */
ol.View.prototype.getProjection = function() {
  return this.projection_;
};


/**
 * Get the view resolution.
 * @return {number|undefined} The resolution of the view.
 * @observable
 * @api stable
 */
ol.View.prototype.getResolution = function() {
  return /** @type {number|undefined} */ (
      this.get(ol.ViewProperty.RESOLUTION));
};


/**
 * Get the resolutions for the view. This returns the array of resolutions
 * passed to the constructor of the {ol.View}, or undefined if none were given.
 * @return {Array.<number>|undefined} The resolutions of the view.
 * @api stable
 */
ol.View.prototype.getResolutions = function() {
  return this.resolutions_;
};


/**
 * Get the resolution for a provided extent (in map units) and size (in pixels).
 * @param {ol.Extent} extent Extent.
 * @param {ol.Size} size Box pixel size.
 * @return {number} The resolution at which the provided extent will render at
 *     the given size.
 */
ol.View.prototype.getResolutionForExtent = function(extent, size) {
  var xResolution = ol.extent.getWidth(extent) / size[0];
  var yResolution = ol.extent.getHeight(extent) / size[1];
  return Math.max(xResolution, yResolution);
};


/**
 * Return a function that returns a value between 0 and 1 for a
 * resolution. Exponential scaling is assumed.
 * @param {number=} opt_power Power.
 * @return {function(number): number} Resolution for value function.
 */
ol.View.prototype.getResolutionForValueFunction = function(opt_power) {
  var power = opt_power || 2;
  var maxResolution = this.maxResolution_;
  var minResolution = this.minResolution_;
  var max = Math.log(maxResolution / minResolution) / Math.log(power);
  return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      function(value) {
        var resolution = maxResolution / Math.pow(power, value * max);
        goog.asserts.assert(resolution >= minResolution &&
            resolution <= maxResolution,
            'calculated resolution outside allowed bounds (%s <= %s <= %s)',
            minResolution, resolution, maxResolution);
        return resolution;
      });
};


/**
 * Get the view rotation.
 * @return {number} The rotation of the view in radians.
 * @observable
 * @api stable
 */
ol.View.prototype.getRotation = function() {
  return /** @type {number} */ (this.get(ol.ViewProperty.ROTATION));
};


/**
 * Return a function that returns a resolution for a value between
 * 0 and 1. Exponential scaling is assumed.
 * @param {number=} opt_power Power.
 * @return {function(number): number} Value for resolution function.
 */
ol.View.prototype.getValueForResolutionFunction = function(opt_power) {
  var power = opt_power || 2;
  var maxResolution = this.maxResolution_;
  var minResolution = this.minResolution_;
  var max = Math.log(maxResolution / minResolution) / Math.log(power);
  return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      function(resolution) {
        var value =
            (Math.log(maxResolution / resolution) / Math.log(power)) / max;
        goog.asserts.assert(value >= 0 && value <= 1,
            'calculated value (%s) ouside allowed range (0-1)', value);
        return value;
      });
};


/**
 * @return {olx.ViewState} View state.
 */
ol.View.prototype.getState = function() {
  goog.asserts.assert(this.isDef(),
      'the view was not defined (had no center and/or resolution)');
  var center = /** @type {ol.Coordinate} */ (this.getCenter());
  var projection = this.getProjection();
  var resolution = /** @type {number} */ (this.getResolution());
  var rotation = this.getRotation();
  return /** @type {olx.ViewState} */ ({
    // Snap center to closest pixel
    center: [
      Math.round(center[0] / resolution) * resolution,
      Math.round(center[1] / resolution) * resolution
    ],
    projection: projection !== undefined ? projection : null,
    resolution: resolution,
    rotation: rotation
  });
};


/**
 * Get the current zoom level. Return undefined if the current
 * resolution is undefined or not a "constrained resolution".
 * @return {number|undefined} Zoom.
 * @api stable
 */
ol.View.prototype.getZoom = function() {
  var offset;
  var resolution = this.getResolution();

  if (resolution !== undefined) {
    var res, z = 0;
    do {
      res = this.constrainResolution(this.maxResolution_, z);
      if (res == resolution) {
        offset = z;
        break;
      }
      ++z;
    } while (res > this.minResolution_);
  }

  return offset !== undefined ? this.minZoom_ + offset : offset;
};


/**
 * Fit the given geometry or extent based on the given map size and border.
 * The size is pixel dimensions of the box to fit the extent into.
 * In most cases you will want to use the map size, that is `map.getSize()`.
 * Takes care of the map angle.
 * @param {ol.geom.SimpleGeometry|ol.Extent} geometry Geometry.
 * @param {ol.Size} size Box pixel size.
 * @param {olx.view.FitOptions=} opt_options Options.
 * @api
 */
ol.View.prototype.fit = function(geometry, size, opt_options) {
  if (!(geometry instanceof ol.geom.SimpleGeometry)) {
    goog.asserts.assert(Array.isArray(geometry),
        'invalid extent or geometry');
    goog.asserts.assert(!ol.extent.isEmpty(geometry),
        'cannot fit empty extent');
    geometry = ol.geom.Polygon.fromExtent(geometry);
  }

  var options = opt_options || {};

  var padding = options.padding !== undefined ? options.padding : [0, 0, 0, 0];
  var constrainResolution = options.constrainResolution !== undefined ?
      options.constrainResolution : true;
  var nearest = options.nearest !== undefined ? options.nearest : false;
  var minResolution;
  if (options.minResolution !== undefined) {
    minResolution = options.minResolution;
  } else if (options.maxZoom !== undefined) {
    minResolution = this.constrainResolution(
        this.maxResolution_, options.maxZoom - this.minZoom_, 0);
  } else {
    minResolution = 0;
  }
  var coords = geometry.getFlatCoordinates();

  // calculate rotated extent
  var rotation = this.getRotation();
  goog.asserts.assert(rotation !== undefined, 'rotation was not defined');
  var cosAngle = Math.cos(-rotation);
  var sinAngle = Math.sin(-rotation);
  var minRotX = +Infinity;
  var minRotY = +Infinity;
  var maxRotX = -Infinity;
  var maxRotY = -Infinity;
  var stride = geometry.getStride();
  for (var i = 0, ii = coords.length; i < ii; i += stride) {
    var rotX = coords[i] * cosAngle - coords[i + 1] * sinAngle;
    var rotY = coords[i] * sinAngle + coords[i + 1] * cosAngle;
    minRotX = Math.min(minRotX, rotX);
    minRotY = Math.min(minRotY, rotY);
    maxRotX = Math.max(maxRotX, rotX);
    maxRotY = Math.max(maxRotY, rotY);
  }

  // calculate resolution
  var resolution = this.getResolutionForExtent(
      [minRotX, minRotY, maxRotX, maxRotY],
      [size[0] - padding[1] - padding[3], size[1] - padding[0] - padding[2]]);
  resolution = isNaN(resolution) ? minResolution :
      Math.max(resolution, minResolution);
  if (constrainResolution) {
    var constrainedResolution = this.constrainResolution(resolution, 0, 0);
    if (!nearest && constrainedResolution < resolution) {
      constrainedResolution = this.constrainResolution(
          constrainedResolution, -1, 0);
    }
    resolution = constrainedResolution;
  }
  this.setResolution(resolution);

  // calculate center
  sinAngle = -sinAngle; // go back to original rotation
  var centerRotX = (minRotX + maxRotX) / 2;
  var centerRotY = (minRotY + maxRotY) / 2;
  centerRotX += (padding[1] - padding[3]) / 2 * resolution;
  centerRotY += (padding[0] - padding[2]) / 2 * resolution;
  var centerX = centerRotX * cosAngle - centerRotY * sinAngle;
  var centerY = centerRotY * cosAngle + centerRotX * sinAngle;

  this.setCenter([centerX, centerY]);
};


/**
 * Center on coordinate and view position.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {ol.Size} size Box pixel size.
 * @param {ol.Pixel} position Position on the view to center on.
 * @api
 */
ol.View.prototype.centerOn = function(coordinate, size, position) {
  // calculate rotated position
  var rotation = this.getRotation();
  var cosAngle = Math.cos(-rotation);
  var sinAngle = Math.sin(-rotation);
  var rotX = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  var rotY = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  var resolution = this.getResolution();
  rotX += (size[0] / 2 - position[0]) * resolution;
  rotY += (position[1] - size[1] / 2) * resolution;

  // go back to original angle
  sinAngle = -sinAngle; // go back to original rotation
  var centerX = rotX * cosAngle - rotY * sinAngle;
  var centerY = rotY * cosAngle + rotX * sinAngle;

  this.setCenter([centerX, centerY]);
};


/**
 * @return {boolean} Is defined.
 */
ol.View.prototype.isDef = function() {
  return !!this.getCenter() && this.getResolution() !== undefined;
};


/**
 * Rotate the view around a given coordinate.
 * @param {number} rotation New rotation value for the view.
 * @param {ol.Coordinate=} opt_anchor The rotation center.
 * @api stable
 */
ol.View.prototype.rotate = function(rotation, opt_anchor) {
  if (opt_anchor !== undefined) {
    var center = this.calculateCenterRotate(rotation, opt_anchor);
    this.setCenter(center);
  }
  this.setRotation(rotation);
};


/**
 * Set the center of the current view.
 * @param {ol.Coordinate|undefined} center The center of the view.
 * @observable
 * @api stable
 */
ol.View.prototype.setCenter = function(center) {
  this.set(ol.ViewProperty.CENTER, center);
};


/**
 * @param {ol.ViewHint} hint Hint.
 * @param {number} delta Delta.
 * @return {number} New value.
 */
ol.View.prototype.setHint = function(hint, delta) {
  goog.asserts.assert(0 <= hint && hint < this.hints_.length,
      'illegal hint (%s), must be between 0 and %s', hint, this.hints_.length);
  this.hints_[hint] += delta;
  goog.asserts.assert(this.hints_[hint] >= 0,
      'Hint at %s must be positive, was %s', hint, this.hints_[hint]);
  return this.hints_[hint];
};


/**
 * Set the resolution for this view.
 * @param {number|undefined} resolution The resolution of the view.
 * @observable
 * @api stable
 */
ol.View.prototype.setResolution = function(resolution) {
  this.set(ol.ViewProperty.RESOLUTION, resolution);
};


/**
 * Set the rotation for this view.
 * @param {number} rotation The rotation of the view in radians.
 * @observable
 * @api stable
 */
ol.View.prototype.setRotation = function(rotation) {
  this.set(ol.ViewProperty.ROTATION, rotation);
};


/**
 * Zoom to a specific zoom level.
 * @param {number} zoom Zoom level.
 * @api stable
 */
ol.View.prototype.setZoom = function(zoom) {
  var resolution = this.constrainResolution(
      this.maxResolution_, zoom - this.minZoom_, 0);
  this.setResolution(resolution);
};


/**
 * @param {olx.ViewOptions} options View options.
 * @private
 * @return {ol.CenterConstraintType} The constraint.
 */
ol.View.createCenterConstraint_ = function(options) {
  if (options.extent !== undefined) {
    return ol.CenterConstraint.createExtent(options.extent);
  } else {
    return ol.CenterConstraint.none;
  }
};


/**
 * @private
 * @param {olx.ViewOptions} options View options.
 * @return {{constraint: ol.ResolutionConstraintType, maxResolution: number,
 *     minResolution: number}} The constraint.
 */
ol.View.createResolutionConstraint_ = function(options) {
  var resolutionConstraint;
  var maxResolution;
  var minResolution;

  // TODO: move these to be ol constants
  // see https://github.com/openlayers/ol3/issues/2076
  var defaultMaxZoom = 28;
  var defaultZoomFactor = 2;

  var minZoom = options.minZoom !== undefined ?
      options.minZoom : ol.DEFAULT_MIN_ZOOM;

  var maxZoom = options.maxZoom !== undefined ?
      options.maxZoom : defaultMaxZoom;

  var zoomFactor = options.zoomFactor !== undefined ?
      options.zoomFactor : defaultZoomFactor;

  if (options.resolutions !== undefined) {
    var resolutions = options.resolutions;
    maxResolution = resolutions[0];
    minResolution = resolutions[resolutions.length - 1];
    resolutionConstraint = ol.ResolutionConstraint.createSnapToResolutions(
        resolutions);
  } else {
    // calculate the default min and max resolution
    var projection = ol.proj.createProjection(options.projection, 'EPSG:3857');
    var extent = projection.getExtent();
    var size = !extent ?
        // use an extent that can fit the whole world if need be
        360 * ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES] /
            projection.getMetersPerUnit() :
        Math.max(ol.extent.getWidth(extent), ol.extent.getHeight(extent));

    var defaultMaxResolution = size / ol.DEFAULT_TILE_SIZE / Math.pow(
        defaultZoomFactor, ol.DEFAULT_MIN_ZOOM);

    var defaultMinResolution = defaultMaxResolution / Math.pow(
        defaultZoomFactor, defaultMaxZoom - ol.DEFAULT_MIN_ZOOM);

    // user provided maxResolution takes precedence
    maxResolution = options.maxResolution;
    if (maxResolution !== undefined) {
      minZoom = 0;
    } else {
      maxResolution = defaultMaxResolution / Math.pow(zoomFactor, minZoom);
    }

    // user provided minResolution takes precedence
    minResolution = options.minResolution;
    if (minResolution === undefined) {
      if (options.maxZoom !== undefined) {
        if (options.maxResolution !== undefined) {
          minResolution = maxResolution / Math.pow(zoomFactor, maxZoom);
        } else {
          minResolution = defaultMaxResolution / Math.pow(zoomFactor, maxZoom);
        }
      } else {
        minResolution = defaultMinResolution;
      }
    }

    // given discrete zoom levels, minResolution may be different than provided
    maxZoom = minZoom + Math.floor(
        Math.log(maxResolution / minResolution) / Math.log(zoomFactor));
    minResolution = maxResolution / Math.pow(zoomFactor, maxZoom - minZoom);

    resolutionConstraint = ol.ResolutionConstraint.createSnapToPower(
        zoomFactor, maxResolution, maxZoom - minZoom);
  }
  return {constraint: resolutionConstraint, maxResolution: maxResolution,
    minResolution: minResolution, minZoom: minZoom};
};


/**
 * @private
 * @param {olx.ViewOptions} options View options.
 * @return {ol.RotationConstraintType} Rotation constraint.
 */
ol.View.createRotationConstraint_ = function(options) {
  var enableRotation = options.enableRotation !== undefined ?
      options.enableRotation : true;
  if (enableRotation) {
    var constrainRotation = options.constrainRotation;
    if (constrainRotation === undefined || constrainRotation === true) {
      return ol.RotationConstraint.createSnapToZero();
    } else if (constrainRotation === false) {
      return ol.RotationConstraint.none;
    } else if (goog.isNumber(constrainRotation)) {
      return ol.RotationConstraint.createSnapToN(constrainRotation);
    } else {
      goog.asserts.fail(
          'illegal option for constrainRotation (%s)', constrainRotation);
      return ol.RotationConstraint.none;
    }
  } else {
    return ol.RotationConstraint.disable;
  }
};

goog.provide('ol.easing');


/**
 * Start slow and speed up.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.easeIn = function(t) {
  return Math.pow(t, 3);
};


/**
 * Start fast and slow down.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.easeOut = function(t) {
  return 1 - ol.easing.easeIn(1 - t);
};


/**
 * Start slow, speed up, and then slow down again.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.inAndOut = function(t) {
  return 3 * t * t - 2 * t * t * t;
};


/**
 * Maintain a constant speed over time.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.linear = function(t) {
  return t;
};


/**
 * Start slow, speed up, and at the very end slow down again.  This has the
 * same general behavior as {@link ol.easing.inAndOut}, but the final slowdown
 * is delayed.
 * @param {number} t Input between 0 and 1.
 * @return {number} Output between 0 and 1.
 * @api
 */
ol.easing.upAndDown = function(t) {
  if (t < 0.5) {
    return ol.easing.inAndOut(2 * t);
  } else {
    return 1 - ol.easing.inAndOut(2 * (t - 0.5));
  }
};

goog.provide('ol.animation');

goog.require('ol');
goog.require('ol.ViewHint');
goog.require('ol.coordinate');
goog.require('ol.easing');


/**
 * Generate an animated transition that will "bounce" the resolution as it
 * approaches the final value.
 * @param {olx.animation.BounceOptions} options Bounce options.
 * @return {ol.PreRenderFunction} Pre-render function.
 * @api
 */
ol.animation.bounce = function(options) {
  var resolution = options.resolution;
  var start = options.start ? options.start : Date.now();
  var duration = options.duration !== undefined ? options.duration : 1000;
  var easing = options.easing ?
      options.easing : ol.easing.upAndDown;
  return (
      /**
       * @param {ol.Map} map Map.
       * @param {?olx.FrameState} frameState Frame state.
       * @return {boolean} Run this function in the next frame.
       */
      function(map, frameState) {
        if (frameState.time < start) {
          frameState.animate = true;
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else if (frameState.time < start + duration) {
          var delta = easing((frameState.time - start) / duration);
          var deltaResolution = resolution - frameState.viewState.resolution;
          frameState.animate = true;
          frameState.viewState.resolution += delta * deltaResolution;
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else {
          return false;
        }
      });
};


/**
 * Generate an animated transition while updating the view center.
 * @param {olx.animation.PanOptions} options Pan options.
 * @return {ol.PreRenderFunction} Pre-render function.
 * @api
 */
ol.animation.pan = function(options) {
  var source = options.source;
  var start = options.start ? options.start : Date.now();
  var sourceX = source[0];
  var sourceY = source[1];
  var duration = options.duration !== undefined ? options.duration : 1000;
  var easing = options.easing ?
      options.easing : ol.easing.inAndOut;
  return (
      /**
       * @param {ol.Map} map Map.
       * @param {?olx.FrameState} frameState Frame state.
       * @return {boolean} Run this function in the next frame.
       */
      function(map, frameState) {
        if (frameState.time < start) {
          frameState.animate = true;
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else if (frameState.time < start + duration) {
          var delta = 1 - easing((frameState.time - start) / duration);
          var deltaX = sourceX - frameState.viewState.center[0];
          var deltaY = sourceY - frameState.viewState.center[1];
          frameState.animate = true;
          frameState.viewState.center[0] += delta * deltaX;
          frameState.viewState.center[1] += delta * deltaY;
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else {
          return false;
        }
      });
};


/**
 * Generate an animated transition while updating the view rotation.
 * @param {olx.animation.RotateOptions} options Rotate options.
 * @return {ol.PreRenderFunction} Pre-render function.
 * @api
 */
ol.animation.rotate = function(options) {
  var sourceRotation = options.rotation ? options.rotation : 0;
  var start = options.start ? options.start : Date.now();
  var duration = options.duration !== undefined ? options.duration : 1000;
  var easing = options.easing ?
      options.easing : ol.easing.inAndOut;
  var anchor = options.anchor ?
      options.anchor : null;

  return (
      /**
       * @param {ol.Map} map Map.
       * @param {?olx.FrameState} frameState Frame state.
       * @return {boolean} Run this function in the next frame.
       */
      function(map, frameState) {
        if (frameState.time < start) {
          frameState.animate = true;
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else if (frameState.time < start + duration) {
          var delta = 1 - easing((frameState.time - start) / duration);
          var deltaRotation =
              (sourceRotation - frameState.viewState.rotation) * delta;
          frameState.animate = true;
          frameState.viewState.rotation += deltaRotation;
          if (anchor) {
            var center = frameState.viewState.center;
            ol.coordinate.sub(center, anchor);
            ol.coordinate.rotate(center, deltaRotation);
            ol.coordinate.add(center, anchor);
          }
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else {
          return false;
        }
      });
};


/**
 * Generate an animated transition while updating the view resolution.
 * @param {olx.animation.ZoomOptions} options Zoom options.
 * @return {ol.PreRenderFunction} Pre-render function.
 * @api
 */
ol.animation.zoom = function(options) {
  var sourceResolution = options.resolution;
  var start = options.start ? options.start : Date.now();
  var duration = options.duration !== undefined ? options.duration : 1000;
  var easing = options.easing ?
      options.easing : ol.easing.inAndOut;
  return (
      /**
       * @param {ol.Map} map Map.
       * @param {?olx.FrameState} frameState Frame state.
       * @return {boolean} Run this function in the next frame.
       */
      function(map, frameState) {
        if (frameState.time < start) {
          frameState.animate = true;
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else if (frameState.time < start + duration) {
          var delta = 1 - easing((frameState.time - start) / duration);
          var deltaResolution =
              sourceResolution - frameState.viewState.resolution;
          frameState.animate = true;
          frameState.viewState.resolution += delta * deltaResolution;
          frameState.viewHints[ol.ViewHint.ANIMATING] += 1;
          return true;
        } else {
          return false;
        }
      });
};

goog.provide('ol.TileRange');

goog.require('goog.asserts');


/**
 * A representation of a contiguous block of tiles.  A tile range is specified
 * by its min/max tile coordinates and is inclusive of coordinates.
 *
 * @constructor
 * @param {number} minX Minimum X.
 * @param {number} maxX Maximum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxY Maximum Y.
 * @struct
 */
ol.TileRange = function(minX, maxX, minY, maxY) {

  /**
   * @type {number}
   */
  this.minX = minX;

  /**
   * @type {number}
   */
  this.maxX = maxX;

  /**
   * @type {number}
   */
  this.minY = minY;

  /**
   * @type {number}
   */
  this.maxY = maxY;

};


/**
 * @param {...ol.TileCoord} var_args Tile coordinates.
 * @return {!ol.TileRange} Bounding tile box.
 */
ol.TileRange.boundingTileRange = function(var_args) {
  var tileCoord0 = /** @type {ol.TileCoord} */ (arguments[0]);
  var tileCoord0Z = tileCoord0[0];
  var tileCoord0X = tileCoord0[1];
  var tileCoord0Y = tileCoord0[2];
  var tileRange = new ol.TileRange(tileCoord0X, tileCoord0X,
                                   tileCoord0Y, tileCoord0Y);
  var i, ii, tileCoord, tileCoordX, tileCoordY, tileCoordZ;
  for (i = 1, ii = arguments.length; i < ii; ++i) {
    tileCoord = /** @type {ol.TileCoord} */ (arguments[i]);
    tileCoordZ = tileCoord[0];
    tileCoordX = tileCoord[1];
    tileCoordY = tileCoord[2];
    goog.asserts.assert(tileCoordZ == tileCoord0Z,
        'passed tilecoords all have the same Z-value');
    tileRange.minX = Math.min(tileRange.minX, tileCoordX);
    tileRange.maxX = Math.max(tileRange.maxX, tileCoordX);
    tileRange.minY = Math.min(tileRange.minY, tileCoordY);
    tileRange.maxY = Math.max(tileRange.maxY, tileCoordY);
  }
  return tileRange;
};


/**
 * @param {number} minX Minimum X.
 * @param {number} maxX Maximum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxY Maximum Y.
 * @param {ol.TileRange|undefined} tileRange TileRange.
 * @return {ol.TileRange} Tile range.
 */
ol.TileRange.createOrUpdate = function(minX, maxX, minY, maxY, tileRange) {
  if (tileRange !== undefined) {
    tileRange.minX = minX;
    tileRange.maxX = maxX;
    tileRange.minY = minY;
    tileRange.maxY = maxY;
    return tileRange;
  } else {
    return new ol.TileRange(minX, maxX, minY, maxY);
  }
};


/**
 * @param {ol.TileCoord} tileCoord Tile coordinate.
 * @return {boolean} Contains tile coordinate.
 */
ol.TileRange.prototype.contains = function(tileCoord) {
  return this.containsXY(tileCoord[1], tileCoord[2]);
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 * @return {boolean} Contains.
 */
ol.TileRange.prototype.containsTileRange = function(tileRange) {
  return this.minX <= tileRange.minX && tileRange.maxX <= this.maxX &&
      this.minY <= tileRange.minY && tileRange.maxY <= this.maxY;
};


/**
 * @param {number} x Tile coordinate x.
 * @param {number} y Tile coordinate y.
 * @return {boolean} Contains coordinate.
 */
ol.TileRange.prototype.containsXY = function(x, y) {
  return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 * @return {boolean} Equals.
 */
ol.TileRange.prototype.equals = function(tileRange) {
  return this.minX == tileRange.minX && this.minY == tileRange.minY &&
      this.maxX == tileRange.maxX && this.maxY == tileRange.maxY;
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 */
ol.TileRange.prototype.extend = function(tileRange) {
  if (tileRange.minX < this.minX) {
    this.minX = tileRange.minX;
  }
  if (tileRange.maxX > this.maxX) {
    this.maxX = tileRange.maxX;
  }
  if (tileRange.minY < this.minY) {
    this.minY = tileRange.minY;
  }
  if (tileRange.maxY > this.maxY) {
    this.maxY = tileRange.maxY;
  }
};


/**
 * @return {number} Height.
 */
ol.TileRange.prototype.getHeight = function() {
  return this.maxY - this.minY + 1;
};


/**
 * @return {ol.Size} Size.
 */
ol.TileRange.prototype.getSize = function() {
  return [this.getWidth(), this.getHeight()];
};


/**
 * @return {number} Width.
 */
ol.TileRange.prototype.getWidth = function() {
  return this.maxX - this.minX + 1;
};


/**
 * @param {ol.TileRange} tileRange Tile range.
 * @return {boolean} Intersects.
 */
ol.TileRange.prototype.intersects = function(tileRange) {
  return this.minX <= tileRange.maxX &&
      this.maxX >= tileRange.minX &&
      this.minY <= tileRange.maxY &&
      this.maxY >= tileRange.minY;
};

goog.provide('ol.Attribution');

goog.require('ol.TileRange');
goog.require('ol.math');


/**
 * @classdesc
 * An attribution for a layer source.
 *
 * Example:
 *
 *     source: new ol.source.OSM({
 *       attributions: [
 *         new ol.Attribution({
 *           html: 'All maps &copy; ' +
 *               '<a href="http://www.opencyclemap.org/">OpenCycleMap</a>'
 *         }),
 *         ol.source.OSM.ATTRIBUTION
 *       ],
 *     ..
 *
 * @constructor
 * @param {olx.AttributionOptions} options Attribution options.
 * @struct
 * @api stable
 */
ol.Attribution = function(options) {

  /**
   * @private
   * @type {string}
   */
  this.html_ = options.html;

  /**
   * @private
   * @type {Object.<string, Array.<ol.TileRange>>}
   */
  this.tileRanges_ = options.tileRanges ? options.tileRanges : null;

};


/**
 * Get the attribution markup.
 * @return {string} The attribution HTML.
 * @api stable
 */
ol.Attribution.prototype.getHTML = function() {
  return this.html_;
};


/**
 * @param {Object.<string, ol.TileRange>} tileRanges Tile ranges.
 * @param {!ol.tilegrid.TileGrid} tileGrid Tile grid.
 * @param {!ol.proj.Projection} projection Projection.
 * @return {boolean} Intersects any tile range.
 */
ol.Attribution.prototype.intersectsAnyTileRange = function(tileRanges, tileGrid, projection) {
  if (!this.tileRanges_) {
    return true;
  }
  var i, ii, tileRange, zKey;
  for (zKey in tileRanges) {
    if (!(zKey in this.tileRanges_)) {
      continue;
    }
    tileRange = tileRanges[zKey];
    var testTileRange;
    for (i = 0, ii = this.tileRanges_[zKey].length; i < ii; ++i) {
      testTileRange = this.tileRanges_[zKey][i];
      if (testTileRange.intersects(tileRange)) {
        return true;
      }
      var extentTileRange = tileGrid.getTileRangeForExtentAndZ(
          ol.tilegrid.extentFromProjection(projection), parseInt(zKey, 10));
      var width = extentTileRange.getWidth();
      if (tileRange.minX < extentTileRange.minX ||
          tileRange.maxX > extentTileRange.maxX) {
        if (testTileRange.intersects(new ol.TileRange(
            ol.math.modulo(tileRange.minX, width),
            ol.math.modulo(tileRange.maxX, width),
            tileRange.minY, tileRange.maxY))) {
          return true;
        }
        if (tileRange.getWidth() > width &&
            testTileRange.intersects(extentTileRange)) {
          return true;
        }
      }
    }
  }
  return false;
};

/**
 * An implementation of Google Maps' MVCArray.
 * @see https://developers.google.com/maps/documentation/javascript/reference
 */

goog.provide('ol.Collection');
goog.provide('ol.CollectionEvent');
goog.provide('ol.CollectionEventType');

goog.require('ol.events.Event');
goog.require('ol.Object');


/**
 * @enum {string}
 */
ol.CollectionEventType = {
  /**
   * Triggered when an item is added to the collection.
   * @event ol.CollectionEvent#add
   * @api stable
   */
  ADD: 'add',
  /**
   * Triggered when an item is removed from the collection.
   * @event ol.CollectionEvent#remove
   * @api stable
   */
  REMOVE: 'remove'
};


/**
 * @classdesc
 * Events emitted by {@link ol.Collection} instances are instances of this
 * type.
 *
 * @constructor
 * @extends {ol.events.Event}
 * @implements {oli.CollectionEvent}
 * @param {ol.CollectionEventType} type Type.
 * @param {*=} opt_element Element.
 * @param {Object=} opt_target Target.
 */
ol.CollectionEvent = function(type, opt_element, opt_target) {

  ol.events.Event.call(this, type, opt_target);

  /**
   * The element that is added to or removed from the collection.
   * @type {*}
   * @api stable
   */
  this.element = opt_element;

};
ol.inherits(ol.CollectionEvent, ol.events.Event);


/**
 * @enum {string}
 */
ol.CollectionProperty = {
  LENGTH: 'length'
};


/**
 * @classdesc
 * An expanded version of standard JS Array, adding convenience methods for
 * manipulation. Add and remove changes to the Collection trigger a Collection
 * event. Note that this does not cover changes to the objects _within_ the
 * Collection; they trigger events on the appropriate object, not on the
 * Collection as a whole.
 *
 * @constructor
 * @extends {ol.Object}
 * @fires ol.CollectionEvent
 * @param {!Array.<T>=} opt_array Array.
 * @template T
 * @api stable
 */
ol.Collection = function(opt_array) {

  ol.Object.call(this);

  /**
   * @private
   * @type {!Array.<T>}
   */
  this.array_ = opt_array ? opt_array : [];

  this.updateLength_();

};
ol.inherits(ol.Collection, ol.Object);


/**
 * Remove all elements from the collection.
 * @api stable
 */
ol.Collection.prototype.clear = function() {
  while (this.getLength() > 0) {
    this.pop();
  }
};


/**
 * Add elements to the collection.  This pushes each item in the provided array
 * to the end of the collection.
 * @param {!Array.<T>} arr Array.
 * @return {ol.Collection.<T>} This collection.
 * @api stable
 */
ol.Collection.prototype.extend = function(arr) {
  var i, ii;
  for (i = 0, ii = arr.length; i < ii; ++i) {
    this.push(arr[i]);
  }
  return this;
};


/**
 * Iterate over each element, calling the provided callback.
 * @param {function(this: S, T, number, Array.<T>): *} f The function to call
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array). The return value is ignored.
 * @param {S=} opt_this The object to use as `this` in `f`.
 * @template S
 * @api stable
 */
ol.Collection.prototype.forEach = function(f, opt_this) {
  this.array_.forEach(f, opt_this);
};


/**
 * Get a reference to the underlying Array object. Warning: if the array
 * is mutated, no events will be dispatched by the collection, and the
 * collection's "length" property won't be in sync with the actual length
 * of the array.
 * @return {!Array.<T>} Array.
 * @api stable
 */
ol.Collection.prototype.getArray = function() {
  return this.array_;
};


/**
 * Get the element at the provided index.
 * @param {number} index Index.
 * @return {T} Element.
 * @api stable
 */
ol.Collection.prototype.item = function(index) {
  return this.array_[index];
};


/**
 * Get the length of this collection.
 * @return {number} The length of the array.
 * @observable
 * @api stable
 */
ol.Collection.prototype.getLength = function() {
  return /** @type {number} */ (this.get(ol.CollectionProperty.LENGTH));
};


/**
 * Insert an element at the provided index.
 * @param {number} index Index.
 * @param {T} elem Element.
 * @api stable
 */
ol.Collection.prototype.insertAt = function(index, elem) {
  this.array_.splice(index, 0, elem);
  this.updateLength_();
  this.dispatchEvent(
      new ol.CollectionEvent(ol.CollectionEventType.ADD, elem, this));
};


/**
 * Remove the last element of the collection and return it.
 * Return `undefined` if the collection is empty.
 * @return {T|undefined} Element.
 * @api stable
 */
ol.Collection.prototype.pop = function() {
  return this.removeAt(this.getLength() - 1);
};


/**
 * Insert the provided element at the end of the collection.
 * @param {T} elem Element.
 * @return {number} Length.
 * @api stable
 */
ol.Collection.prototype.push = function(elem) {
  var n = this.array_.length;
  this.insertAt(n, elem);
  return n;
};


/**
 * Remove the first occurrence of an element from the collection.
 * @param {T} elem Element.
 * @return {T|undefined} The removed element or undefined if none found.
 * @api stable
 */
ol.Collection.prototype.remove = function(elem) {
  var arr = this.array_;
  var i, ii;
  for (i = 0, ii = arr.length; i < ii; ++i) {
    if (arr[i] === elem) {
      return this.removeAt(i);
    }
  }
  return undefined;
};


/**
 * Remove the element at the provided index and return it.
 * Return `undefined` if the collection does not contain this index.
 * @param {number} index Index.
 * @return {T|undefined} Value.
 * @api stable
 */
ol.Collection.prototype.removeAt = function(index) {
  var prev = this.array_[index];
  this.array_.splice(index, 1);
  this.updateLength_();
  this.dispatchEvent(
      new ol.CollectionEvent(ol.CollectionEventType.REMOVE, prev, this));
  return prev;
};


/**
 * Set the element at the provided index.
 * @param {number} index Index.
 * @param {T} elem Element.
 * @api stable
 */
ol.Collection.prototype.setAt = function(index, elem) {
  var n = this.getLength();
  if (index < n) {
    var prev = this.array_[index];
    this.array_[index] = elem;
    this.dispatchEvent(
        new ol.CollectionEvent(ol.CollectionEventType.REMOVE, prev, this));
    this.dispatchEvent(
        new ol.CollectionEvent(ol.CollectionEventType.ADD, elem, this));
  } else {
    var j;
    for (j = n; j < index; ++j) {
      this.insertAt(j, undefined);
    }
    this.insertAt(index, elem);
  }
};


/**
 * @private
 */
ol.Collection.prototype.updateLength_ = function() {
  this.set(ol.CollectionProperty.LENGTH, this.array_.length);
};

// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Names of standard colors with their associated hex values.
 */

goog.provide('goog.color.names');


/**
 * A map that contains a lot of colors that are recognised by various browsers.
 * This list is way larger than the minimal one dictated by W3C.
 * The keys of this map are the lowercase "readable" names of the colors, while
 * the values are the "hex" values.
 *
 * @type {!Object<string, string>}
 */
goog.color.names = {
  'aliceblue': '#f0f8ff',
  'antiquewhite': '#faebd7',
  'aqua': '#00ffff',
  'aquamarine': '#7fffd4',
  'azure': '#f0ffff',
  'beige': '#f5f5dc',
  'bisque': '#ffe4c4',
  'black': '#000000',
  'blanchedalmond': '#ffebcd',
  'blue': '#0000ff',
  'blueviolet': '#8a2be2',
  'brown': '#a52a2a',
  'burlywood': '#deb887',
  'cadetblue': '#5f9ea0',
  'chartreuse': '#7fff00',
  'chocolate': '#d2691e',
  'coral': '#ff7f50',
  'cornflowerblue': '#6495ed',
  'cornsilk': '#fff8dc',
  'crimson': '#dc143c',
  'cyan': '#00ffff',
  'darkblue': '#00008b',
  'darkcyan': '#008b8b',
  'darkgoldenrod': '#b8860b',
  'darkgray': '#a9a9a9',
  'darkgreen': '#006400',
  'darkgrey': '#a9a9a9',
  'darkkhaki': '#bdb76b',
  'darkmagenta': '#8b008b',
  'darkolivegreen': '#556b2f',
  'darkorange': '#ff8c00',
  'darkorchid': '#9932cc',
  'darkred': '#8b0000',
  'darksalmon': '#e9967a',
  'darkseagreen': '#8fbc8f',
  'darkslateblue': '#483d8b',
  'darkslategray': '#2f4f4f',
  'darkslategrey': '#2f4f4f',
  'darkturquoise': '#00ced1',
  'darkviolet': '#9400d3',
  'deeppink': '#ff1493',
  'deepskyblue': '#00bfff',
  'dimgray': '#696969',
  'dimgrey': '#696969',
  'dodgerblue': '#1e90ff',
  'firebrick': '#b22222',
  'floralwhite': '#fffaf0',
  'forestgreen': '#228b22',
  'fuchsia': '#ff00ff',
  'gainsboro': '#dcdcdc',
  'ghostwhite': '#f8f8ff',
  'gold': '#ffd700',
  'goldenrod': '#daa520',
  'gray': '#808080',
  'green': '#008000',
  'greenyellow': '#adff2f',
  'grey': '#808080',
  'honeydew': '#f0fff0',
  'hotpink': '#ff69b4',
  'indianred': '#cd5c5c',
  'indigo': '#4b0082',
  'ivory': '#fffff0',
  'khaki': '#f0e68c',
  'lavender': '#e6e6fa',
  'lavenderblush': '#fff0f5',
  'lawngreen': '#7cfc00',
  'lemonchiffon': '#fffacd',
  'lightblue': '#add8e6',
  'lightcoral': '#f08080',
  'lightcyan': '#e0ffff',
  'lightgoldenrodyellow': '#fafad2',
  'lightgray': '#d3d3d3',
  'lightgreen': '#90ee90',
  'lightgrey': '#d3d3d3',
  'lightpink': '#ffb6c1',
  'lightsalmon': '#ffa07a',
  'lightseagreen': '#20b2aa',
  'lightskyblue': '#87cefa',
  'lightslategray': '#778899',
  'lightslategrey': '#778899',
  'lightsteelblue': '#b0c4de',
  'lightyellow': '#ffffe0',
  'lime': '#00ff00',
  'limegreen': '#32cd32',
  'linen': '#faf0e6',
  'magenta': '#ff00ff',
  'maroon': '#800000',
  'mediumaquamarine': '#66cdaa',
  'mediumblue': '#0000cd',
  'mediumorchid': '#ba55d3',
  'mediumpurple': '#9370db',
  'mediumseagreen': '#3cb371',
  'mediumslateblue': '#7b68ee',
  'mediumspringgreen': '#00fa9a',
  'mediumturquoise': '#48d1cc',
  'mediumvioletred': '#c71585',
  'midnightblue': '#191970',
  'mintcream': '#f5fffa',
  'mistyrose': '#ffe4e1',
  'moccasin': '#ffe4b5',
  'navajowhite': '#ffdead',
  'navy': '#000080',
  'oldlace': '#fdf5e6',
  'olive': '#808000',
  'olivedrab': '#6b8e23',
  'orange': '#ffa500',
  'orangered': '#ff4500',
  'orchid': '#da70d6',
  'palegoldenrod': '#eee8aa',
  'palegreen': '#98fb98',
  'paleturquoise': '#afeeee',
  'palevioletred': '#db7093',
  'papayawhip': '#ffefd5',
  'peachpuff': '#ffdab9',
  'peru': '#cd853f',
  'pink': '#ffc0cb',
  'plum': '#dda0dd',
  'powderblue': '#b0e0e6',
  'purple': '#800080',
  'red': '#ff0000',
  'rosybrown': '#bc8f8f',
  'royalblue': '#4169e1',
  'saddlebrown': '#8b4513',
  'salmon': '#fa8072',
  'sandybrown': '#f4a460',
  'seagreen': '#2e8b57',
  'seashell': '#fff5ee',
  'sienna': '#a0522d',
  'silver': '#c0c0c0',
  'skyblue': '#87ceeb',
  'slateblue': '#6a5acd',
  'slategray': '#708090',
  'slategrey': '#708090',
  'snow': '#fffafa',
  'springgreen': '#00ff7f',
  'steelblue': '#4682b4',
  'tan': '#d2b48c',
  'teal': '#008080',
  'thistle': '#d8bfd8',
  'tomato': '#ff6347',
  'turquoise': '#40e0d0',
  'violet': '#ee82ee',
  'wheat': '#f5deb3',
  'white': '#ffffff',
  'whitesmoke': '#f5f5f5',
  'yellow': '#ffff00',
  'yellowgreen': '#9acd32'
};

// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utilities for manipulating arrays.
 *
 * @author arv@google.com (Erik Arvidsson)
 */


goog.provide('goog.array');

goog.require('goog.asserts');


/**
 * @define {boolean} NATIVE_ARRAY_PROTOTYPES indicates whether the code should
 * rely on Array.prototype functions, if available.
 *
 * The Array.prototype functions can be defined by external libraries like
 * Prototype and setting this flag to false forces closure to use its own
 * goog.array implementation.
 *
 * If your javascript can be loaded by a third party site and you are wary about
 * relying on the prototype functions, specify
 * "--define goog.NATIVE_ARRAY_PROTOTYPES=false" to the JSCompiler.
 *
 * Setting goog.TRUSTED_SITE to false will automatically set
 * NATIVE_ARRAY_PROTOTYPES to false.
 */
goog.define('goog.NATIVE_ARRAY_PROTOTYPES', goog.TRUSTED_SITE);


/**
 * @define {boolean} If true, JSCompiler will use the native implementation of
 * array functions where appropriate (e.g., {@code Array#filter}) and remove the
 * unused pure JS implementation.
 */
goog.define('goog.array.ASSUME_NATIVE_FUNCTIONS', false);


/**
 * Returns the last element in an array without removing it.
 * Same as goog.array.last.
 * @param {IArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */
goog.array.peek = function(array) {
  return array[array.length - 1];
};


/**
 * Returns the last element in an array without removing it.
 * Same as goog.array.peek.
 * @param {IArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */
goog.array.last = goog.array.peek;

// NOTE(arv): Since most of the array functions are generic it allows you to
// pass an array-like object. Strings have a length and are considered array-
// like. However, the 'in' operator does not work on strings so we cannot just
// use the array path even if the browser supports indexing into strings. We
// therefore end up splitting the string.


/**
 * Returns the index of the first element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
 *
 * @param {IArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at index 0.
 * @return {number} The index of the first matching array element.
 * @template T
 */
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ?
    function(arr, obj, opt_fromIndex) {
      goog.asserts.assert(arr.length != null);

      return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
    } :
    function(arr, obj, opt_fromIndex) {
      var fromIndex = opt_fromIndex == null ?
          0 :
          (opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) :
                               opt_fromIndex);

      if (goog.isString(arr)) {
        // Array.prototype.indexOf uses === so only strings should be found.
        if (!goog.isString(obj) || obj.length != 1) {
          return -1;
        }
        return arr.indexOf(obj, fromIndex);
      }

      for (var i = fromIndex; i < arr.length; i++) {
        if (i in arr && arr[i] === obj) return i;
      }
      return -1;
    };


/**
 * Returns the index of the last element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-lastindexof}
 *
 * @param {!IArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {?number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at the end of the array.
 * @return {number} The index of the last matching array element.
 * @template T
 */
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ?
    function(arr, obj, opt_fromIndex) {
      goog.asserts.assert(arr.length != null);

      // Firefox treats undefined and null as 0 in the fromIndex argument which
      // leads it to always return -1
      var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
      return Array.prototype.lastIndexOf.call(arr, obj, fromIndex);
    } :
    function(arr, obj, opt_fromIndex) {
      var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;

      if (fromIndex < 0) {
        fromIndex = Math.max(0, arr.length + fromIndex);
      }

      if (goog.isString(arr)) {
        // Array.prototype.lastIndexOf uses === so only strings should be found.
        if (!goog.isString(obj) || obj.length != 1) {
          return -1;
        }
        return arr.lastIndexOf(obj, fromIndex);
      }

      for (var i = fromIndex; i >= 0; i--) {
        if (i in arr && arr[i] === obj) return i;
      }
      return -1;
    };


/**
 * Calls a function for each element in an array. Skips holes in the array.
 * See {@link http://tinyurl.com/developer-mozilla-org-array-foreach}
 *
 * @param {IArrayLike<T>|string} arr Array or array like object over
 *     which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function takes 3 arguments (the element, the index and the
 *     array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template T,S
 */
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      Array.prototype.forEach.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2) {
          f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr);
        }
      }
    };


/**
 * Calls a function for each element in an array, starting from the last
 * element rather than the first.
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function
 *     takes 3 arguments (the element, the index and the array). The return
 *     value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @template T,S
 */
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;  // must be fixed during loop... see docs
  var arr2 = goog.isString(arr) ? arr.split('') : arr;
  for (var i = l - 1; i >= 0; --i) {
    if (i in arr2) {
      f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr);
    }
  }
};


/**
 * Calls a function for each element in an array, and if the function returns
 * true adds the element to a new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?):boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and must
 *     return a Boolean. If the return value is true the element is added to the
 *     result array. If it is false the element is not included.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {!Array<T>} a new array in which only elements that passed the test
 *     are present.
 * @template T,S
 */
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return Array.prototype.filter.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var res = [];
      var resLength = 0;
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2) {
          var val = arr2[i];  // in case f mutates arr2
          if (f.call(/** @type {?} */ (opt_obj), val, i, arr)) {
            res[resLength++] = val;
          }
        }
      }
      return res;
    };


/**
 * Calls a function for each element in an array and inserts the result into a
 * new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
 *
 * @param {IArrayLike<VALUE>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this:THIS, VALUE, number, ?): RESULT} f The function to call
 *     for every element. This function takes 3 arguments (the element,
 *     the index and the array) and should return something. The result will be
 *     inserted into a new array.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
 * @return {!Array<RESULT>} a new array with the results from f.
 * @template THIS, VALUE, RESULT
 */
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return Array.prototype.map.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var res = new Array(l);
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2) {
          res[i] = f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr);
        }
      }
      return res;
    };


/**
 * Passes every element of an array into a function and accumulates the result.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduce}
 *
 * For example:
 * var a = [1, 2, 3, 4];
 * goog.array.reduce(a, function(r, v, i, arr) {return r + v;}, 0);
 * returns 10
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {R} Result of evaluating f repeatedly across the values of the array.
 * @template T,S,R
 */
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ?
    function(arr, f, val, opt_obj) {
      goog.asserts.assert(arr.length != null);
      if (opt_obj) {
        f = goog.bind(f, opt_obj);
      }
      return Array.prototype.reduce.call(arr, f, val);
    } :
    function(arr, f, val, opt_obj) {
      var rval = val;
      goog.array.forEach(arr, function(val, index) {
        rval = f.call(/** @type {?} */ (opt_obj), rval, val, index, arr);
      });
      return rval;
    };


/**
 * Passes every element of an array into a function and accumulates the result,
 * starting from the last element and working towards the first.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduceright}
 *
 * For example:
 * var a = ['a', 'b', 'c'];
 * goog.array.reduceRight(a, function(r, v, i, arr) {return r + v;}, '');
 * returns 'cba'
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {R} Object returned as a result of evaluating f repeatedly across the
 *     values of the array.
 * @template T,S,R
 */
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ?
    function(arr, f, val, opt_obj) {
      goog.asserts.assert(arr.length != null);
      goog.asserts.assert(f != null);
      if (opt_obj) {
        f = goog.bind(f, opt_obj);
      }
      return Array.prototype.reduceRight.call(arr, f, val);
    } :
    function(arr, f, val, opt_obj) {
      var rval = val;
      goog.array.forEachRight(arr, function(val, index) {
        rval = f.call(/** @type {?} */ (opt_obj), rval, val, index, arr);
      });
      return rval;
    };


/**
 * Calls f for each element of an array. If any call returns true, some()
 * returns true (without checking the remaining elements). If all calls
 * return false, some() returns false.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-some}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} true if any element passes the test.
 * @template T,S
 */
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return Array.prototype.some.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2 && f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr)) {
          return true;
        }
      }
      return false;
    };


/**
 * Call f for each element of an array. If all calls return true, every()
 * returns true. If any call returns false, every() returns false and
 * does not continue to check the remaining elements.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-every}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} false if any element fails the test.
 * @template T,S
 */
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES &&
        (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return Array.prototype.every.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2 && !f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr)) {
          return false;
        }
      }
      return true;
    };


/**
 * Counts the array elements that fulfill the predicate, i.e. for which the
 * callback function returns true. Skips holes in the array.
 *
 * @param {!IArrayLike<T>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this: S, T, number, ?): boolean} f The function to call for
 *     every element. Takes 3 arguments (the element, the index and the array).
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @return {number} The number of the matching elements.
 * @template T,S
 */
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call(/** @type {?} */ (opt_obj), element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};


/**
 * Search an array for the first element that satisfies a given condition and
 * return that element.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The first array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 */
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};


/**
 * Search an array for the first element that satisfies a given condition and
 * return its index.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the first array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 */
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;  // must be fixed during loop... see docs
  var arr2 = goog.isString(arr) ? arr.split('') : arr;
  for (var i = 0; i < l; i++) {
    if (i in arr2 && f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};


/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return that element.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The last array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 */
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};


/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return its index.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the last array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 */
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;  // must be fixed during loop... see docs
  var arr2 = goog.isString(arr) ? arr.split('') : arr;
  for (var i = l - 1; i >= 0; i--) {
    if (i in arr2 && f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};


/**
 * Whether the array contains the given object.
 * @param {IArrayLike<?>|string} arr The array to test for the presence of the
 *     element.
 * @param {*} obj The object for which to test.
 * @return {boolean} true if obj is present.
 */
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};


/**
 * Whether the array is empty.
 * @param {IArrayLike<?>|string} arr The array to test.
 * @return {boolean} true if empty.
 */
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};


/**
 * Clears the array.
 * @param {IArrayLike<?>} arr Array or array like object to clear.
 */
goog.array.clear = function(arr) {
  // For non real arrays we don't have the magic length so we delete the
  // indices.
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1; i >= 0; i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};


/**
 * Pushes an item into an array, if it's not already in the array.
 * @param {Array<T>} arr Array into which to insert the item.
 * @param {T} obj Value to add.
 * @template T
 */
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};


/**
 * Inserts an object at the given index of the array.
 * @param {IArrayLike<?>} arr The array to modify.
 * @param {*} obj The object to insert.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};


/**
 * Inserts at the given index of the array, all elements of another array.
 * @param {IArrayLike<?>} arr The array to modify.
 * @param {IArrayLike<?>} elementsToAdd The array of elements to add.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};


/**
 * Inserts an object into an array before a specified object.
 * @param {Array<T>} arr The array to modify.
 * @param {T} obj The object to insert.
 * @param {T=} opt_obj2 The object before which obj should be inserted. If obj2
 *     is omitted or not found, obj is inserted at the end of the array.
 * @template T
 */
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};


/**
 * Removes the first occurrence of a particular value from an array.
 * @param {IArrayLike<T>} arr Array from which to remove
 *     value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if ((rv = i >= 0)) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};


/**
 * Removes the last occurrence of a particular value from an array.
 * @param {!IArrayLike<T>} arr Array from which to remove value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */
goog.array.removeLast = function(arr, obj) {
  var i = goog.array.lastIndexOf(arr, obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};


/**
 * Removes from an array the element at index i
 * @param {IArrayLike<?>} arr Array or array like object from which to
 *     remove value.
 * @param {number} i The index to remove.
 * @return {boolean} True if an element was removed.
 */
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);

  // use generic form of splice
  // splice returns the removed items and if successful the length of that
  // will be 1
  return Array.prototype.splice.call(arr, i, 1).length == 1;
};


/**
 * Removes the first value that satisfies the given condition.
 * @param {IArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {boolean} True if an element was removed.
 * @template T,S
 */
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};


/**
 * Removes all values that satisfy the given condition.
 * @param {IArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The number of items removed
 * @template T,S
 */
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    if (f.call(/** @type {?} */ (opt_obj), val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
};


/**
 * Returns a new array that is the result of joining the arguments.  If arrays
 * are passed then their items are added, however, if non-arrays are passed they
 * will be added to the return array as is.
 *
 * Note that ArrayLike objects will be added as is, rather than having their
 * items added.
 *
 * goog.array.concat([1, 2], [3, 4]) -> [1, 2, 3, 4]
 * goog.array.concat(0, [1, 2]) -> [0, 1, 2]
 * goog.array.concat([1, 2], null) -> [1, 2, null]
 *
 * There is bug in all current versions of IE (6, 7 and 8) where arrays created
 * in an iframe become corrupted soon (not immediately) after the iframe is
 * destroyed. This is common if loading data via goog.net.IframeIo, for example.
 * This corruption only affects the concat method which will start throwing
 * Catastrophic Errors (#-2147418113).
 *
 * See http://endoflow.com/scratch/corrupted-arrays.html for a test case.
 *
 * Internally goog.array should use this, so that all methods will continue to
 * work on these broken array objects.
 *
 * @param {...*} var_args Items to concatenate.  Arrays will have each item
 *     added, while primitives and objects will be added as is.
 * @return {!Array<?>} The new resultant array.
 */
goog.array.concat = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};


/**
 * Returns a new array that contains the contents of all the arrays passed.
 * @param {...!Array<T>} var_args
 * @return {!Array<T>}
 * @template T
 */
goog.array.join = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};


/**
 * Converts an object to an array.
 * @param {IArrayLike<T>|string} object  The object to convert to an
 *     array.
 * @return {!Array<T>} The object converted into an array. If object has a
 *     length property, every property indexed with a non-negative number
 *     less than length will be included in the result. If object does not
 *     have a length property, an empty array will be returned.
 * @template T
 */
goog.array.toArray = function(object) {
  var length = object.length;

  // If length is not a number the following it false. This case is kept for
  // backwards compatibility since there are callers that pass objects that are
  // not array like.
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0; i < length; i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
};


/**
 * Does a shallow copy of an array.
 * @param {IArrayLike<T>|string} arr  Array or array-like object to
 *     clone.
 * @return {!Array<T>} Clone of the input array.
 * @template T
 */
goog.array.clone = goog.array.