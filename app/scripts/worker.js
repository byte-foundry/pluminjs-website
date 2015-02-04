var window = self,
	otFont0,
	otFont1,
	font,
	font0,
	font1,
	coef = 0;

importScripts('plumin.min.js');

plumin.paper.setup({
	width: 1024,
	height: 1024
});

// Overwrite addToFonts to send the buffer over to the UI
plumin.paper.Font.prototype.addToFonts = function() {
	var buffer = this.ot.toBuffer();
	postMessage( buffer, [buffer] );
};

onmessage = function( message ) {
	var data = message.data;

	switch ( typeof data ) {
	// parse incoming .otf ArrayBuffers
	case 'object':
		if ( !data[0] || data[0].constructor !== ArrayBuffer ) {
			return;
		}

		otFont0 = plumin.opentype.parse( data[0] );
		otFont1 = plumin.opentype.parse( data[1] );

		font = new plumin.paper.Font();
		// save default encoding
		var encoding = font.ot.encoding;
		font.importOT( otFont0 );
		font.ot.familyName = 'Demo';
		font.ot.encoding = encoding;

		font0 = new plumin.paper.Font();
		font0.importOT( otFont0 );
		font0.ot.familyName = 'font0';

		font1 = new plumin.paper.Font();
		font1.importOT( otFont1 );
		font1.ot.familyName = 'font1';

		// initial font
		font.updateOTCommands()
			.addToFonts();
		break;

	// parse incoming interpolation coef
	case 'number':
		coef = data;
		font.interpolate(font0, font1, coef)
			.updateOTCommands()
			.addToFonts();
		break;
	}
};