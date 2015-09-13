var app = app || {};

(function ($) {
    'use strict';
    var dataKey = "toDoItems";
    var localToDoItems;

    app.initializeStorage = function () {
        app.Storage = localStorage;
        return;
    };

    // Local Storage implementation
    var localStorage = {
        // Generates a GUID to use as an ID for the todos
        generateGuid: function () {
            return app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + "-"
                    + app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart()
                    + app.Storage.generateGuidPart();
        },

        // Generates a small part of a GUID
        generateGuidPart: function () {
            var guidPartNumber = (Math.random() * 0x10000) | 0;
            return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
        },

        // Retrieve all data from local storage
        getData: function () {
            localToDoItems = JSON.parse(window.localStorage.getItem(dataKey)) || [];

            if (localToDoItems) {
                app.Storage.parseData(localToDoItems);
            }
        },

        // Adds a new todo to local storage
        saveTodo: function (todo) {
            todo.save({
                id: app.Storage.generateGuid()
            });

            var todoData = {
                text: todo.get('title'),
                address: todo.get('location'),
                done: todo.get('done'),
                id: todo.get('id')
            };

            localToDoItems.push(todoData);
            window.localStorage.setItem(dataKey, JSON.stringify(localToDoItems));
        },

        // Edits an existing todo in local storage
        editTodo: function (todo) {
            var todoData = {
                text: todo.get('title'),
                address: todo.get('location'),
                done: todo.get('done'),
                id: todo.get('id')
            };

            for (var i = localToDoItems.length - 1; i >= 0; i--) {
                if (localToDoItems[i].id === todoData.id) {
                    localToDoItems[i] = todoData;
                    break;
                }
            }

            window.localStorage.setItem(dataKey, JSON.stringify(localToDoItems));
        },

        // Removes a todo from local storage
        removeTodo: function (todo) {
            var todoId = todo.get('id');

            for (var i = localToDoItems.length - 1; i >= 0; i--) {
                if (localToDoItems[i].id === todoId) {
                    localToDoItems.splice(i, 1);
                    break;
                }
            }

            window.localStorage.setItem(dataKey, JSON.stringify(localToDoItems));
        },

        // Parses the data retrieved from storage and adds it to the app's data source
        parseData: function (data) {
            var length = data.length;
            for (var i = 0; i < length; i++) {
                app.todoCollection.create({
                    title: data[i].text,
                    done: data[i].done,
                    location: data[i].address,
                    id: data[i].id
                })
            }
        }
    }

    // Azure Mobile storage implementation goes here
})(jQuery);
