(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory(root));
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.instafetch = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

  'use strict';

  //
  // Variables
  //

  var instafetch = {};
  var supports = !!document.querySelector && !!root.addEventListener;
  var settings, url;
  var baseUrl = 'https://api.instagram.com/v1/users/';

  // Default settings
  var defaults = {
    userId: null,
    accessToken: null,
    numOfPics: 20,
    caption: false
  };

  //
  // Methods
  //

  /**
   * A simple forEach() implementation for Arrays, Objects and NodeLists
   * @private
   * @param {Array|Object|NodeList} collection Collection of items to iterate
   * @param {Function} callback Callback function for each iteration
   * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
   */
  var forEach = function(collection, callback, scope) {
    if (Object.prototype.toString.call(collection) === '[object Object]') {
      for (var prop in collection) {
        if (Object.prototype.hasOwnProperty.call(collection, prop)) {
          callback.call(scope, collection[prop], prop, collection);
        }
      }
    } else {
      for (var i = 0, len = collection.length; i < len; i++) {
        callback.call(scope, collection[i], i, collection);
      }
    }
  };


  /**
   * Merge defaults with user options
   * @private
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   * @returns {Object} Merged values of defaults and options
   */
  var extend = function(defaults, options) {
    var extended = {};
    forEach(defaults, function(value, prop) {
      extended[prop] = defaults[prop];
    });
    forEach(options, function(value, prop) {
      extended[prop] = options[prop];
    });
    return extended;
  };


  /**
   * Fetch Instagram API with settings
   * @private
   * @param {Object} options Merged values of defaults and options
   * @returns {Object} JSON data
   */
  var fetchFeed = function(options) {
    if (options.userId !== null && options.accessToken !== null) {

      if (options.userId === options.accessToken.split('.')[0]) {
        url = baseUrl + options.userId + '/media/recent/?access_token=' + options.accessToken + '&count=' + options.numOfPics + '&callback=?';

        fetchJsonp(url).then(function(response) {
          return response.json();
        }).then(function(json) {
          displayFeed(json);
        }).catch(function(error) {
          console.log(error);
        });
      } else {
        console.log('Access Token is invalid for User ID');
      }

    } else {
      console.log('User ID and Access Token are required.');
    }
  };

  /**
   * Display JSON data from fetch
   * @private
   * @param {Object} json JSON data
   * @returns
   */
  var displayFeed = function(json) {
    json.data.forEach(function(data) {

      if (data.type === 'image') {
        console.log(data);
      } else if (data.type === 'video') {
        console.log(data);
      }

    });
  };

  /**
   * Destroy the current initialization.
   * @public
   */
  instafetch.destroy = function() {
    // If plugin isn't already initialized, stop
    if (!settings) {
      return;
    }

    // Reset varaibles
    settings = null;
    url = null;
  };

  /**
   * Initialize Instafetch
   * @public
   * @param {Object} options User settings
   */
  instafetch.init = function(options) {
    // Feature test
    if (!supports) {
      return;
    }

    // Destroy any existing initializations
    instafetch.destroy();

    // Variables
    settings = extend(defaults, options || {});

    // Do something...
    fetchFeed(settings);
  };

  //
  // Public APIs
  //

  return instafetch;
});
