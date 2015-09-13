(function () {
    'use strict';

    angular.module("xPlat.services")
        .factory("guidGenerator", function () {
            var generatePart = function () {
                var guidPartNumber = (Math.random() * 0x10000) | 0;
                return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
            };

            return function () {
                return generatePart()
                    + generatePart()
                    + "-"
                    + generatePart()
                    + "-"
                    + generatePart()
                    + "-"
                    + generatePart()
                    + "-"
                    + generatePart()
                    + generatePart()
                    + generatePart();
            };
        })
        .factory("localStorage", ['$q', "$window", "guidGenerator", function ($q, $window, guidGenerator) {
            var localStorageKey = "toDoItems";

            var loadFromStorage = function () {
                return angular.fromJson($window.localStorage.getItem(localStorageKey)) || [];
            };

            var saveToStorage = function (items) {
                $window.localStorage.setItem(localStorageKey, angular.toJson(items));
            }

            return {
                getAll: function () {
                    return loadFromStorage();
                },

                create: function (text, address) {
                    var item = {
                        id: guidGenerator(),
                        text: text,
                        address: address,
                        done: false
                    }
                    var items = loadFromStorage();
                    items.push(item);
                    saveToStorage(items);
                    return $q.when(item);
                },

                update: function (item) {
                    var items = loadFromStorage();
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id === item.id) {
                            items[i] = item;
                            break;
                        }
                    }

                    saveToStorage(items);
                    return $q.when(item);
                },

                del: function (item) {
                    var items = loadFromStorage();
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].id === item.id) {
                            items.splice(i, 1);
                            break;
                        }
                    }

                    saveToStorage(items);
                    return $q.when(null);
                }
            }
        }])

        // To support Azure, add Azure storage service
        // code here ("azureStorage").

        .factory("storage", ["$injector", function ($injector) {
            // var azureService = $injector.get('azureStorage');
            // return azureService.isAvailable ? azureService : $injector.get('localStorage');
            return $injector.get('localStorage');
        }])

        // To support Bing maps, replace mapSimulator 
        // with map code.
        .factory('mapsSimulator', ["$rootScope", "$q", "$timeout", function (rootScope, $q, $timeout) {

            return {
                getUnknownAddress: function () {
                    var deferred = $q.defer();

                    $timeout(function () {
                        deferred.resolve([43.465187, -80.522372]);
                    }, 500);

                    return deferred.promise;
                }
            }
        }])

        .factory("cordova", ['$q', "$window", "$timeout", function ($q, $window, $timeout) {
            var deferred = $q.defer();
            var resolved = false;

            document.addEventListener('deviceready', function () {
                resolved = true;
                deferred.resolve($window.cordova);
            }, false);

            $timeout(function () {
                if (!resolved && $window.cordova) {
                    deferred.resolve($window.cordova);
                }
            });

            return { ready: deferred.promise };
        }]);
})();
