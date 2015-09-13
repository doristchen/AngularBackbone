// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var watchID = navigator.accelerometer.watchAcceleration(onAccelerometerSuccess, onAccelerometerError, { frequency: 100 });
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    //
    // Shake Code
    //
    var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;

    function onAccelerometerSuccess(acceleration) {
        x1 = acceleration.x;
        y1 = acceleration.y;
        z1 = acceleration.z;
    }

    function onAccelerometerError(error) {
        console.error(error);
    };

    // watch the x, y and z coordinates for change
    setInterval(function () {
        var change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);

        // adjust the value of "25" to change when a "shake" is detected
        if (change > 25) {
            console.log('Earthquake!!!!');

            // establish scope
            var domElement = document.querySelector("#todoapp");
            var scope = angular.element(domElement).scope();

            // clear the todo items
            scope.$apply(function () {
                scope.clearItems();
            });
        }

        // Update new position
        x2 = x1;
        y2 = y1;
        z2 = z1;
    }, 100);

} )();