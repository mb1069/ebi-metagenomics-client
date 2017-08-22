/*! tablesorter enable/disable sort & filter (BETA) - 11/10/2015 (v2.24.4)
 * Requires tablesorter v2.24.4+ & jQuery 1.7+
 * by Rob Garrison
 */
;( function( $ ) {
	'use strict';
	var ts = $.tablesorter,

	tst = ts.toggleTS = {

		init : function( c, wo ) {
			wo.toggleTS_isEnabled = true; // enabled
			wo.toggleTS_areDisabled = {
				headers : [],
				filters : []
			***REMOVED***;
			c.$table.on('enable.toggleTS disable.toggleTS', function( event ) {
				tst.toggle( this.config, this.config.widgetOptions, event.type === 'enable' );
			***REMOVED***);
		***REMOVED***,
		toggle : function( c, wo, isEnabled ) {
			if ( wo.toggleTS_isEnabled !== isEnabled ) {
				wo.toggleTS_isEnabled = isEnabled;
				var indx, $el,
					len = c.$headers.length;

				// table headers
				for ( indx = 0; indx < len; indx++ ) {
					$el = c.$headers.eq( indx );
					// function added in v2.24.4
					ts.setColumnSort( c, $el, !isEnabled );
					// function added in v2.24.4; passing "isEnabled" allows removal of "next sort" labels
					ts.setColumnAriaLabel( c, $el, isEnabled );
				***REMOVED***
				if ( wo.toggleTS_hideFilterRow ) {
					c.$table.find( '.' + ts.css.filterRow ).toggle( isEnabled );
				***REMOVED*** else if ( ts.hasWidget( c.$table, 'filter' ) ) {
					// c.$filters points to filter CELL
					len = c.$filters.length;
					for ( indx = 0; indx < len; indx++ ) {
						if ( isEnabled && !wo.toggleTS_areDisabled.filters[ indx ] ) {
							c.$filters.eq( indx ).find( 'input, select' )
								.removeClass( ts.css.filterDisabled )
								.prop( 'disabled', false );
						***REMOVED*** else if ( !isEnabled ) {
							$el = c.$filters.eq( indx ).find( 'input, select' );
							if ( $el.hasClass( ts.css.filterDisabled ) ) {
								wo.toggleTS_areDisabled.filters[ indx ] = true;
							***REMOVED***
							$el
								.addClass( ts.css.filterDisabled )
								.prop( 'disabled', true );
						***REMOVED***
					***REMOVED***
				***REMOVED***
				// include external filters
				wo.filter_$externalFilters
					.toggleClass( ts.css.filterDisabled, isEnabled )
					.prop( 'disabled', !isEnabled );
			***REMOVED***
			if ( typeof wo.toggleTS_callback === 'function' ) {
				wo.toggleTS_callback( c, isEnabled );
			***REMOVED***
		***REMOVED***
	***REMOVED***;

	ts.addWidget({
		id: 'toggle-ts',
		options: {
			toggleTS_hideFilterRow : false,
			toggleTS_callback : null
		***REMOVED***,
		init : function( table, thisWidget, c, wo ) {
			tst.init( c, wo );
		***REMOVED***,
		remove : function( table, c ) {
			c.$table.off( 'enable.toggleTS disable.toggleTS' );
		***REMOVED***
	***REMOVED***);

***REMOVED***)( jQuery );
