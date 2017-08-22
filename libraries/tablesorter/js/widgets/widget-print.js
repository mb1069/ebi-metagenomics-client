/* Widget: print - updated 12/8/2016 (v2.28.1) *//*
 * Requires tablesorter v2.8+ and jQuery 1.2.6+
 */
/*jshint browser:true, jquery:true, unused:false */
/*global jQuery: false */
;(function($) {
	'use strict';

	var ts = $.tablesorter,

	printTable = ts.printTable = {

		event      : 'printTable',
		basicStyle : 'table, tr, td, th { border : solid 1px black; border-collapse : collapse; ***REMOVED*** td, th { padding: 2px; ***REMOVED***',
		popupStyle : 'width=500,height=300,scrollbars=1,resizable=1',

		init : function(c) {
			c.$table
				.unbind(printTable.event)
				.bind(printTable.event, function() {
					// explicitly use table.config.widgetOptions because we want
					// the most up-to-date values; not the 'wo' from initialization
					printTable.process(c, c.widgetOptions);
					return false;
				***REMOVED***);
		***REMOVED***,

		process : function(c, wo) {
			var $this, data,
				$table = $('<div/>').append(c.$table.clone()),
				printStyle = printTable.basicStyle + 'table { width: 100%; ***REMOVED***' +
					// hide filter row
					'.' + ( ts.css.filterRow || 'tablesorter-filter-row' ) +
					// hide filtered rows
					', .' + ( wo.filter_filteredRow || 'filtered' ) + ' { display: none; ***REMOVED***' +
					// hide sort arrows
					'.' + ( ts.css.header || 'tablesorter-header' ) + ' { background-image: none !important; ***REMOVED***' +

					'@media print { .print_widget_hidden { display: none; ***REMOVED*** ***REMOVED***';

			// replace content with data-attribute content
			$table.find('[' + wo.print_dataAttrib + ']').each(function() {
				$this = $(this);
				$this.text( $this.attr(wo.print_dataAttrib) );
			***REMOVED***);

			// Make sure all lazy loaded images are visible - see #1169
			data = 'data-' + (wo.lazyload_data_attribute || 'original');
			$table.find('img[' + data + ']').each(function(){
				$this = $(this);
				$this.attr('src', $this.attr(data));
			***REMOVED***);

			// === rows ===
			// Assume 'visible' means rows hidden by the pager (rows set to 'display:none')
			// or hidden by a class name which is added to the wo.print_extraCSS definition
			// look for jQuery filter selector in wo.print_rows & use if found
			if ( /^f/i.test( wo.print_rows ) ) {
				printStyle += 'tbody tr:not(.' + ( wo.filter_filteredRow || 'filtered' ) + ') { display: table-row !important; ***REMOVED***';
			***REMOVED*** else if ( /^a/i.test( wo.print_rows ) ) {
				// default force show of all rows
				printStyle += 'tbody tr { display: table-row !important; ***REMOVED***';
			***REMOVED*** else if ( /^[.#:\[]/.test( wo.print_rows ) ) {
				// look for '.' (class selector), '#' (id selector),
				// ':' (basic filters, e.g. ':not()') or '[' (attribute selector start)
				printStyle += 'tbody tr' + wo.print_rows + ' { display: table-row !important; ***REMOVED***';
			***REMOVED***

			// === columns ===
			// columnSelector -> c.selector.$style
			// Assume 'visible' means hidden columns have a 'display:none' style, or a class name
			// add the definition to the wo.print_extraCSS option
			if (/s/i.test(wo.print_columns) && c.selector && ts.hasWidget( c.table, 'columnSelector' )) {
				// show selected (visible) columns; make a copy of the columnSelector widget css (not media queries)
				printStyle += wo.columnSelector_mediaquery && c.selector.auto ? '' : c.selector.$style.text();
			***REMOVED*** else if (/a/i.test(wo.print_columns)) {
				// force show all cells
				printStyle += 'td, th { display: table-cell !important; ***REMOVED***';
			***REMOVED***

			printStyle += wo.print_extraCSS;

			// callback function
			if ( $.isFunction(wo.print_callback) ) {
				wo.print_callback( c, $table, printStyle );
			***REMOVED*** else {
				printTable.printOutput(c, $table.html(), printStyle);
			***REMOVED***

		***REMOVED***, // end process

		printOutput : function(c, data, style) {
			var wo = c.widgetOptions,
				lang = ts.language,
				generator = window.open( '', wo.print_title, printTable.popupStyle ),
				t = wo.print_title || c.$table.find('caption').text() || c.$table[0].id || document.title || 'table',
				button = wo.print_now ? '' : '<div class="print_widget_hidden"><a href="javascript:window.print();">' +
					'<button type="button">' + lang.button_print + '</button></a> <a href="javascript:window.close();">' +
					'<button type="button">' + lang.button_close + '</button></a><hr></div>';
			generator.document.write(
				'<html><head><title>' + t + '</title>' +
				( wo.print_styleSheet ? '<link rel="stylesheet" href="' + wo.print_styleSheet + '">' : '' ) +
				'<style>' + style + '</style>' +
				'</head><body>' + button + data + '</body></html>'
			);
			generator.document.close();
			// use timeout to allow browser to build DOM before printing
			// Print preview in Chrome doesn't work without this code
			if ( wo.print_now ) {
				setTimeout( function() {
					generator.print();
					generator.close();
				***REMOVED***, 10 );
			***REMOVED***
			return true;
		***REMOVED***,

		remove : function(c) {
			c.$table.off(printTable.event);
		***REMOVED***

	***REMOVED***;

	ts.language.button_close = 'Close';
	ts.language.button_print = 'Print';

	ts.addWidget({
		id: 'print',
		options: {
			print_title      : '',          // this option > caption > table id > 'table'
			print_dataAttrib : 'data-name', // header attrib containing modified header name
			print_rows       : 'filtered',  // (a)ll, (v)isible, (f)iltered or custom css selector
			print_columns    : 'selected',  // (a)ll, (v)isbible or (s)elected (if columnSelector widget is added)
			print_extraCSS   : '',          // add any extra css definitions for the popup window here
			print_styleSheet : '',          // add the url of your print stylesheet
			print_now        : true,        // Open the print dialog immediately if true
			// callback executed when processing completes
			// to continue printing, use the following function:
			// function( config, $table, printStyle ) {
			//   // do something to the table or printStyle string
			//   $.tablesorter.printTable.printOutput( config, $table.html(), printStyle );
			// ***REMOVED***
			print_callback   : null
		***REMOVED***,
		init: function(table, thisWidget, c) {
			printTable.init(c);
		***REMOVED***,
		remove: function(table, c) {
			printTable.remove(c);
		***REMOVED***

	***REMOVED***);

***REMOVED***)(jQuery);
