/*! Widget: Build Table - updated 4/2/2017 (v2.28.6) *//*
 * for tableSorter v2.16.0+
 * by Rob Garrison
 */
/*jshint browser:true, jquery:true, unused:false */
/*global jQuery: false */
;(function($){
	'use strict';
	var ts = $.tablesorter = $.tablesorter || {***REMOVED***,

	// build a table from data (requires existing <table> tag)
	// data.header contains an array of header titles
	// data.rows contains an array of rows which contains an array of cells
	bt = ts.buildTable = function(tar, c){
		// add build options to defaults to prevent warnings
		$.extend(true, ts.defaults.widgetOptions, bt.defaults);
		// add table if one doesn't exist
		var $tbl = tar.nodeName === 'TABLE' ? $(tar) : $('<table>').appendTo(tar),
			table = $tbl[0],
			wo = c.widgetOptions = $.extend( true, {***REMOVED***, bt.defaults, c.widgetOptions ),
			p = wo.build_processing,
			typ = wo.build_type,
			d = wo.build_source || c.data,

		// determine type: html, json, array, csv, object
		runType = function(d){
			var t = $.type(d),
				jq = d instanceof jQuery;
			// run any processing if set
			if ( typeof p === 'function' ) { d = p(d, wo); ***REMOVED***
			// store processed data in table.config.data
			c.data = d;
			// String (html or unprocessed json) or jQuery object
			if ( jq || t === 'string' ) {
				// look for </tr> closing tag, then we have an HTML string
				if ( jq || /<\s*\/tr\s*>/.test(d) ) {
					return bt.html( table, d, wo );
				***REMOVED***
				try {
					d = $.parseJSON(d || 'null');
					if (d) {
						// valid JSON!
						return bt.object( table, d, wo );
					***REMOVED***
				***REMOVED*** catch (ignore) {***REMOVED***
				// fall through in case it's a csv string
			***REMOVED***
			// Array
			if (t === 'array' || t === 'string' || typ === 'array' || typ === 'csv') {
				// build table using an array (csv & array combined script)
				return bt.csv( table, d, wo );
			***REMOVED***
			// if we got here, it's an object, or nothing
			return bt.object( table, d, wo );
		***REMOVED***;

		// store config
		table.config = c;

		// even if wo.build_type is undefined, we can try to figure out the type
		if ( !ts.buildTable.hasOwnProperty(typ) && typ !== '' ) {
			if (c.debug) { console.error('aborting build table widget, incorrect build type'); ***REMOVED***
			return false;
		***REMOVED***

		if ( d instanceof jQuery ) {
			// get data from within a jQuery object (csv)
			runType( $.trim( d.html() ) );
		***REMOVED*** else if ( d && ( d.hasOwnProperty('url') || typ === 'json' ) ) {
			// load data via ajax
			$.ajax( wo.build_source )
			.done(function(data) {
				runType(data);
			***REMOVED***)
			.fail(function( jqXHR, textStatus, errorThrown) {
				if (c.debug) { console.error('aborting build table widget, failed ajax load'); ***REMOVED***
				$tbl.html('<tr><td class="error">' + jqXHR.status + ' '  + textStatus + '</td></tr>');
			***REMOVED***);
		***REMOVED*** else {
			runType(d);
		***REMOVED***
	***REMOVED***;

	// add data to defaults for validator; value must be falsy!
	ts.defaults.data = '';

	bt.defaults = {
		// *** build widget core ***
		build_type       : '',   // array, csv, object, json, html
		build_source     : '',   // array, object, jQuery Object or ajaxObject { url: '', dataType: 'json' ***REMOVED***,
		build_processing : null, // function that returns a useable build_type (e.g. string to array)
		build_complete   : 'tablesorter-build-complete', // triggered event when build completes

		// *** CSV & Array ***
		build_headers   : {
			rows    : 1,  // Number of header rows from the csv
			classes : [], // Header classes to apply to cells
			text    : [], // Header cell text
			widths  : []  // set header cell widths (set in colgroup)
		***REMOVED***,
		build_footers : {
			rows    : 1,   // Number of header rows from the csv
			classes : [],  // Footer classes to apply to cells
			text    : []   // Footer cell text
		***REMOVED***,
		build_numbers : {
			addColumn : false, // include row numbering column?
			sortable  : false  // make column sortable?
		***REMOVED***,

		// *** CSV only options ***
		build_csvStartLine : 0,   // line within the csv to start adding to table
		build_csvSeparator : ',', // csv separator

		// *** build object options ***
		build_objectRowKey    : 'rows',    // object key containing table rows
		build_objectCellKey   : 'cells',   // object key containing table cells (within the rows object)
		build_objectHeaderKey : 'headers', // object key containing table headers
		build_objectFooterKey : 'footers'  // object key containing table footers
	***REMOVED***;

	bt.build = {
		colgroup : function(widths) {
			var t = '';
			// add colgroup if widths set
			if (widths && widths.length) {
				t += '<colgroup>';
				$.each(widths, function(i, w){
					t += '<col' + ( w ? ' style="width:' + w + '"' : '' ) + '>';
				***REMOVED***);
				t += '</colgroup>';
			***REMOVED***
			return t;
		***REMOVED***,
		// d = cell data; typ = 'th' or 'td'; first = save widths from first header row only
		cell : function(d, wo, typ, col, first){
			var j, $td,
				$col = first ? $('<col>') : '',
				cls = wo.build_headers.classes,
				cw = wo.build_headers.widths;
			// d is just an array
			if (/string|number/.test(typeof d)) {
				// add classes from options, but not text
				$td = $('<' + typ + (cls && cls[col] ? ' class="' + cls[col] + '"' : '') + '>' + d + '</' + typ + '>');
				// get widths from options (only from first row)
				if (first && cw && cw[col]) {
					$col.width(cw[col] || '');
				***REMOVED***
			***REMOVED*** else {
				// assume we have an object
				$td = $('<' + typ + '>');
				for (j in d) {
					if (d.hasOwnProperty(j)){
						if (j === 'text' || j === 'html') {
							$td[j]( d[j] );
						***REMOVED*** else if (first && j === 'width') {
							// set column width, but only from first row
							$col.width(d[j] || '');
						***REMOVED*** else {
							$td.attr(j, d[j]);
						***REMOVED***
					***REMOVED***
				***REMOVED***
			***REMOVED***
			return [ $td, $col ];
		***REMOVED***,
		// h1 = header text from data
		header : function(h1, wo){
			var h2 = wo.build_headers.text,
				cls = wo.build_headers.classes,
				t = '<tr>' + (wo.build_numbers.addColumn ? '<th' + (wo.build_numbers.sortable ? '' :
					' class="sorter-false"') + '>' + wo.build_numbers.addColumn + '</th>' : '');
			$.each(h1, function(i, h) {
				if (/<\s*\/t(d|h)\s*>/.test(h)) {
					t += h;
				***REMOVED*** else {
					t += '<th' + (cls && cls[i] ? ' class="' + cls[i] + '"' : '') + '>' +
						(h2 && h2[i] ? h2[i] : h) + '</th>';
				***REMOVED***
			***REMOVED***);
			return t + '</tr>';
		***REMOVED***,
		rows : function(items, txt, c, wo, num, ftr){
			var h = (ftr ? 'th' : 'td'),
				t = '<tr>' + (wo.build_numbers.addColumn ? '<' + h + '>' + (ftr ? '' : num) + '</' + h + '>' : '');
			$.each(items, function(i, item) {
				// test if HTML is already included; look for closing </td>
				if (/<\s*\/t(d|h)\s*>/.test(item)) {
					t += item;
				***REMOVED*** else {
					t += '<' + (ftr ? h + (c && c[i] ? ' class="' + c[i] + '"' : '') : h) + '>' +
						(ftr && txt && txt.length && txt[i] ? txt[i] : item) + '</' + h + '>';
				***REMOVED***
			***REMOVED***);
			return t + '</tr>';
		***REMOVED***
	***REMOVED***;

	bt.buildComplete = function(table, wo){
		$(table).triggerHandler(wo.build_complete);
		ts.setup(table, table.config);
	***REMOVED***;

	/* ==== Array example ====
	[
		[ "header1", "header2", ... "headerN" ],
		[ "row1cell1", "row1cell2", ... "row1cellN" ],
		[ "row2cell1", "row2cell2", ... "row2cellN" ],
		...
		[ "rowNcell1", "rowNcell2", ... "rowNcellN" ]
	]
	*/
	bt.array = function(table, data, wo) {
		return bt.csv(table, data, wo);
	***REMOVED***;

	/* ==== CSV example ====
	ID, Name, Age, Date
	A42b, Parker, 28, "Jul 6, 2006 8:14 AM"
	A255, Hood, 33, "Dec 10, 2002 5:14 AM"
	A33, Kent, 18, "Jan 12, 2003 11:14 AM"
	A1, Franklin, 45, "Jan 18, 2001 9:12 AM"
	A102, Evans, 22, "Jan 18, 2007 9:12 AM"
	A42a, Everet, 22, "Jan 18, 2007 9:12 AM"
	ID, Name, Age, Date
	*/
	// Adapted & modified from csvToTable.js by Steve Sobel
	// MIT license: https://code.google.com/p/jquerycsvtotable/
	bt.csv = function(table, data, wo) {
		var c, h,
			csv = wo.build_type === 'csv' || typeof data === 'string',
			$t = $(table),
			lines = csv ? data.replace('\r', '').split('\n') : data,
			len = lines.length,
			printedLines = 0,
			infooter = false,
			r = wo.build_headers.rows + (csv ? wo.build_csvStartLine : 0),
			f = wo.build_footers.rows,
			headerCount = 0,
			error = '',
			items,
			tableHTML = bt.build.colgroup( wo.build_headers.widths ) + '<thead>';

		$.each(lines, function(n, line) {
			if ( n >= len - f ) { infooter = true; ***REMOVED***
			// build header
			if ( (csv ? n >= wo.build_csvStartLine : true) && ( n < r ) ) {
				h = csv ? bt.splitCSV( line, wo.build_csvSeparator ) : line;
				headerCount = h.length;
				tableHTML += bt.build.header(h, wo);
			***REMOVED*** else if ( n >= r ) {
				// build tbody & tfoot rows
				if (n === r) {
					tableHTML += '</thead><tbody>';
				***REMOVED***
				items = csv ? bt.splitCSV( line, wo.build_csvSeparator ) : line;
				if (infooter && f > 0) {
					tableHTML += (n === len - f ? '</tbody><tfoot>' : '') +
						(n === len ? '</tfoot>' : '');
				***REMOVED***
				if (items.length > 1) {
					printedLines++;
					if ( items.length !== headerCount ) {
						error += 'error on line ' + n + ': Item count (' + items.length +
							') does not match header count (' + headerCount + ') \n';
					***REMOVED***
					c = infooter ? wo.build_footers.classes : '';
					tableHTML += bt.build.rows(items, wo.build_footers.text, c, wo, printedLines, infooter);
				***REMOVED***
			***REMOVED***
		***REMOVED***);
		tableHTML += (f > 0 ? '' : '</tbody>');
		if (error) {
			$t.html(error);
		***REMOVED*** else {
			$t.html(tableHTML);
			bt.buildComplete(table, wo);
		***REMOVED***
	***REMOVED***;

	// CSV Parser by Brian Huisman (http://www.greywyvern.com/?post=258)
	bt.splitCSV = function(str, sep) {
		var x, tl,
			thisCSV = $.trim(str).split(sep = sep || ',');
		for ( x = thisCSV.length - 1; x >= 0; x-- ) {
			if ( thisCSV[x].replace(/\"\s+$/, '"').charAt(thisCSV[x].length - 1) === '"' ) {
				if ( (tl = thisCSV[x].replace(/^\s+\"/, '"')).length > 1 && tl.charAt(0) === '"' ) {
					thisCSV[x] = thisCSV[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
				***REMOVED*** else if (x) {
					thisCSV.splice(x - 1, 2, [ thisCSV[x - 1], thisCSV[x] ].join(sep));
				***REMOVED*** else {
					thisCSV = thisCSV.shift().split(sep).concat(thisCSV);
				***REMOVED***
			***REMOVED*** else {
				thisCSV[x].replace(/""/g, '"');
			***REMOVED***
		***REMOVED***
		return thisCSV;
	***REMOVED***;

	// data may be a jQuery object after processing
	bt.html = function(table, data, wo) {
		var $t = $(table);
		if ( data instanceof jQuery ) {
			$t.empty().append(data);
		***REMOVED*** else {
			$t.html(data);
		***REMOVED***
		bt.buildComplete(table, wo);
	***REMOVED***;

	/* ==== Object example ====
	data : {
		headers : [
			[
				{ text: 'First Name', class: 'fname', width: '20%' ***REMOVED***, // row 1 cell 1
				'Last Name',
				{ text: 'Age', class: 'age', 'data-sorter' : false ***REMOVED***,
				'Total',
				{ text: 'Discount', class : 'sorter-false' ***REMOVED***,
				{ text: 'Date', class : 'date' ***REMOVED***                      // row 1 cell 6
			]
		],
		footers : 'clone', // clone headers or assign array like headers
		rows : [
			// TBODY 1
			[ 'Peter', 'Parker',   28, '$9.99',   '20%', 'Jul 6, 2006 8:14 AM'   ], // row 1
			[ 'John',  'Hood',     33, '$19.99',  '25%', 'Dec 10, 2002 5:14 AM'  ], // row 2
			[ 'Clark', 'Kent',     18, '$15.89',  '44%', 'Jan 12, 2003 11:14 AM' ], // row 3

			// TBODY 2
			{ newTbody: true, class: 'tablesorter-infoOnly' ***REMOVED***,
			{ cells : [ { text: 'Info Row', colSpan: 6 ***REMOVED*** ] ***REMOVED***, // row 4

			// TBODY 3
			{ newTbody: true ***REMOVED***,
			[ 'Bruce', 'Evans',    22, '$13.19',  '11%', 'Jan 18, 2007 9:12 AM'  ], // row 5
			[ 'Brice', 'Almighty', 45, '$153.19', '44%', 'Jan 18, 2001 9:12 AM'  ], // row 6

			{ class: 'specialRow', // row 7
				cells: [
					{ text: 'Fred', class: 'fname' ***REMOVED***,
					{ text: 'Smith', class: 'lname' ***REMOVED***,
					{ text: 18, class: 'age', 'data-info': 'fake ID!, he is really 16' ***REMOVED***,
					{ text: '$22.44', class: 'total' ***REMOVED***,
					{ text: '8%', class: 'discount' ***REMOVED***,
					{ text: 'Aug 20, 2012 10:15 AM', class: 'date' ***REMOVED***
				],
				'data-info' : 'This row likes turtles'
			***REMOVED***
		]
	***REMOVED***
	*/
	bt.object = function(table, data, wo) {
		// 'rows'
		var j, l, t, $c, $t, $tb, $tr,
			c = table.config,
			kh = wo.build_objectHeaderKey,
			kr = wo.build_objectRowKey,
			h = data.hasOwnProperty(kh) && !$.isEmptyObject(data.kh) ? data.kh : data.hasOwnProperty('headers') ? data.headers : false,
			r = data.hasOwnProperty(kr) && !$.isEmptyObject(data.kr) ? data.kr : data.hasOwnProperty('rows') ? data.rows : false;

		if (!h || !r || h.length === 0 || r.length === 0) {
			if (c.debug) { console.error('aborting build table widget, missing data for object build'); ***REMOVED***
			return false;
		***REMOVED***

		$c = $('<colgroup>');
		$t = $('<table><thead/></table>');

		// Build thead
		// h = [ ['headerRow1Cell1', 'headerRow1Cell2', ... 'headerRow1CellN' ], ['headerRow2Cell1', ... ] ]
		// or h = [ [ { text: 'firstCell', class: 'fc', width: '20%' ***REMOVED***, ..., { text: 'last Cell' ***REMOVED*** ], [ /* second row */ ] ]
		$.each(h, function(i, d){
			$tr = $('<tr>').appendTo( $t.find('thead') );
			l = d.length; // header row
			for ( j = 0; j < l; j++ ) {
				// cell(cellData, widgetOptions, 'th', first row)
				t = bt.build.cell(d[j], wo, 'th', j, i === 0);
				if (t[0] && t[0].length) { t[0].appendTo( $tr ); ***REMOVED*** // add cell
				if (i === 0 && t[1]) { t[1].appendTo( $c ); ***REMOVED*** // add col to colgroup
			***REMOVED***
		***REMOVED***);
		if ($c.find('col[style]').length) {
			// add colgroup if it contains col elements
			$t.prepend( $c );
		***REMOVED***

		$tb = $('<tbody>');
		// Build tbody
		$.each(r, function(i, d){
			var j;
			t = $.type(d) === 'object';
			// add new tbody
			if (t && d.newTbody) {
				$tb = $('<tbody>').appendTo( $t );
				for (j in d) {
					if (d.hasOwnProperty(j) && j !== 'newTbody'){
						$tb.attr(j, d[j]);
					***REMOVED***
				***REMOVED***
			***REMOVED*** else {
				if (i === 0) {
					// add tbody, if the first item in the object isn't a call for a new tbody
					$tb.appendTo( $t );
				***REMOVED***

				$tr = $('<tr>').appendTo( $tb );
				if (t) {
					// row defined by object
					for (j in d) {
						if (d.hasOwnProperty(j) && j !== wo.build_objectCellKey){
							$tr.attr(j, d[j]);
						***REMOVED***
					***REMOVED***
					if (d.hasOwnProperty(wo.build_objectCellKey)) {
						// cells contains each cell info
						d = d.cells;
					***REMOVED***
				***REMOVED***

				l = d.length;
				for ( j = 0; j < l; j++ ) {
					// cell(cellData, widgetOptions, 'td')
					$c = bt.build.cell(d[j], wo, 'td', j);
					if ($c[0] && $c[0].length) { $c[0].appendTo( $tr ); ***REMOVED*** // add cell
				***REMOVED***
			***REMOVED***
		***REMOVED***);

		// add footer
		if (data.hasOwnProperty(wo.build_objectFooterKey)) {
			t = data[wo.build_objectFooterKey];
			if (t === 'clone') {
				$c = $t.find('thead').html();
				$t.append('<tfoot>' + $c + '</tfoot>');
			***REMOVED*** else {
				$c = $('<tfoot>').appendTo( $t );
				$.each(t, function(i, d) {
					$tr = $('<tr>').appendTo( $c );
					l = d.length; // footer cells
					for ( j = 0; j < l; j++ ) {
						// cell(cellData, widgetOptions, 'th')
						$tb = bt.build.cell(d[j], wo, 'th', j);
						if ($tb[0] && $tb[0].length) { $tb[0].appendTo( $tr ); ***REMOVED*** // add cell
					***REMOVED***
				***REMOVED***);
			***REMOVED***
		***REMOVED***

		$(table).html( $t.html() );
		bt.buildComplete(table, wo);
	***REMOVED***;

	bt.ajax = bt.json = function(table, data, wo) {
		return bt.object(table, data, wo);
	***REMOVED***;

***REMOVED***)(jQuery);
