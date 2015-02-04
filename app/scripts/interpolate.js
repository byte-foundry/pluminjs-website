$(function() {
'use strict';

var lightBuffer,
	heavyBuffer,
	worker,
	// this font will be used for its addToFonts method
	font = new plumin.Font({
		familyName: 'Dem2'
	});

_get('../fonts/CoelacLight-subset.otf', 'arraybuffer', function(response) {
	lightBuffer = response;
	if ( lightBuffer && heavyBuffer ) {
		_initWorker();
	}
});

_get('../fonts/CoelacHeavy-subset.otf', 'arraybuffer', function(response) {
	heavyBuffer = response;
	if ( lightBuffer && heavyBuffer ) {
		_initWorker();
	}
});

function _get(url, type, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = type;
	xhr.onload = function () {
		if ( this.status === 200 ) {
			cb( this.response );
		}
	};
	xhr.send();
}

function _initWorker() {
	$('#interpolate-input').removeAttr('disabled');

	// Create a worker using the inline script tag below
	// (only to avoid adding one more file to the project)
	worker = new Worker('scripts/worker.js');

	worker.postMessage(
		// message
		[lightBuffer, heavyBuffer],
		// transfer list
		[lightBuffer, heavyBuffer]
	);

	worker.onmessage = function(e) {
		font.addToFonts( e.data );
	};
}

$('#interpolate-input').on('input', function() {
	worker.postMessage( +this.value );
});

});