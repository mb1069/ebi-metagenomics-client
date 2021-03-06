const _ = require('underscore');
const formatDownloadURL = require('../util').formatDownloadURL;
require('../components/pagination').Pagination;

/**
 * Base Table code.
 * This class is meant to be extended to be used as the template
 * is not defined here.
 * Generic Table is the default implementation of this table.
 */
module.exports = class BaseTable {
    /**
     * Instantiate pagination display and event handlers for table which requires
     * page-by-page loading
     * @param {jQuery.HTMLElement} $container  container of table
     * @param {object} options Object containing the following properties:
     * {string} title of table
     * {[string]} headers list of table header names
     * {number} initPageSize initial page size
     * {boolean} isHeader true if table should have a larger header
     * {boolean} filter if true display text filter
     * {string} tableClass CSS class for table obj
     * {callback} callback function on event callback to load data
     */
    constructor($container, options) {
        // constructor($container, title, headers, initialOrdering, initPageSize, isHeader,
        // filter, tableClass, callback) {
        this.$container = $container;
        this.$container.empty();
        let title = options['title'];
        let headers = options['headers'];
        let initialOrdering = options['initialOrdering'];
        let initPageSize = options['initPageSize'];
        let isHeader = options['isHeader'];
        let tableClass = options['tableClass'];
        let textFilter = options['textFilter'];
        let biomeFilter = options['biomeFilter'];
        let callback = options['callback'];
        let expandableTitle = options['expandableTitle'];
        this.headers = headers;
        let params = {
            sectionTitle: title,
            expandableTitle: _.isUndefined(expandableTitle) ? true : expandableTitle,
            headers: headers,
            pagination: true,
            textFilter: textFilter,
            biomeFilter: biomeFilter,
            isPageHeader: isHeader,
            tableClass: tableClass,
            tableContainer: _.uniqueId('tablecontainer')
        };

        // this has to be defined by the override
        const $sectionContent = this.renderTemplate(params);

        this.$table = $sectionContent.find('table');
        this.$loadingGif = $sectionContent.find('.loading-gif-medium');
        this.$tbody = $sectionContent.find('tbody');
        this.$filterInput = $sectionContent.find('.table-filter');

        this.storeElemRefs($sectionContent);
        this.$pageSizeSelect.val(initPageSize);

        if (callback) {
            this.callback = callback;
            this.initHeaders(initialOrdering, callback);
            this.attachFilterCallback(callback);
            this.attachPageSizeCallback(callback);
        }

        this.order = null;
        this.$container.append($sectionContent);

        this.hideIfEmpty = options.hasOwnProperty('hideIfEmpty') ? options['hideIfEmpty'] : true;
    }

    /**
     * Store jQuery references to elements in table
     * @param {jQuery.HTMLElement} $sectionContent elem containing table
     */
    storeElemRefs($sectionContent) {
        this.$pagination = $sectionContent.find('ul.pagination');
        this.$pagesizeContainer = $sectionContent.find('div.pagesize');
        this.$currentPageDisp = this.$pagesizeContainer.find('#currentPage');
        this.$maxPageDisp = this.$pagesizeContainer.find('#maxPage');
        this.$totalResultsDisp = this.$pagesizeContainer.find('#totalResults');
        this.$pageSizeSelect = this.$pagesizeContainer.find('#pagesize');
        this.$downloadLink = $sectionContent.find('a.download-link');
    }

    /**
     * Instantiate page size callback handler
     * @param {callback} callback on change callback to load data
     */
    attachPageSizeCallback(callback) {
        const that = this;
        this.$pageSizeSelect.change(function() {
            callback(1, that.$pageSizeSelect.val(), that.getCurrentOrder(), that.getFilterText());
        });
    }

    /**
     * Instantiate table filtering handler (debounce used to avoid pre-emptively
     * filtering on partial query strings
     * @param {callback} callback
     */
    attachFilterCallback(callback) {
        const that = this;
        this.$filterInput.keyup(_.debounce(function() {
            callback(1, that.getPageSize(), that.getCurrentOrder(), that.getFilterText());
        }, 300));
    }

    /**
     * Clear table, update pagination and download link following a data update
     * @param {[*]} dataset new data to display
     * @param {boolean} clear clear table
     * @param {number} page 1-indexed page
     * @param {number} pageSize results per page
     * @param {number} resultCount  total results
     * @param {string} requestURL URL used to request data
     */
    update(dataset, clear, page, pageSize, resultCount, requestURL) {
        const downloadURL = formatDownloadURL(requestURL);
        this.setDownloadURL(downloadURL);

        const that = this;
        if (clear) {
            this.$tbody.empty();
        }

        if (dataset.length > 0) {
            _.each(dataset, function(row) {
                that.addRow(row);
            });
        }
        if (this.$pagination.data('twbs-pagination')) {
            this.$pagination.twbsPagination('destroy');
        }
        if (pageSize) {
            this.$pageSizeSelect.val(pageSize);
        }

        let totalPages = Math.max(Math.ceil(resultCount / pageSize));
        if (isNaN(totalPages)) {
            totalPages = 1;
        }
        if (totalPages > 0) {
            this.$pagination.twbsPagination({
                startPage: page,
                totalPages: totalPages
            }).on('page', function(evt, page) {
                that.callback(page, that.getPageSize(), that.getCurrentOrder(),
                    that.getFilterText());
            });
        }
        this.setPageDisplay(page, resultCount, totalPages);
        this.hideLoadingGif();
    }

    /**
     * Append a row of data to the table
     * @param {[*]}data row data
     */
    addRow(data) {
        const that = this;
        if (this.headers.length !== data.length) {
            // FIXME, handle
            console.error('Insufficient data inserted');
            console.error(this.headers);
            console.error(data);
            return;
        }

        let i = 0;
        const tds = _.map(data, function(d) {
            if (d === null) {
                d = '';
            }
            const $td = $('<td>' + d + '</td>');
            // eslint-disable-next-line security/detect-object-injection
            const colHeader = that.headers[i];
            if (colHeader.sortBy && colHeader.sortBy !== null && colHeader.sortBy.length > 0) {
                $td.addClass(colHeader.sortBy);
            }
            if (colHeader.class) {
                $td.addClass(colHeader.class);
            }
            i += 1;
            return $td;
        });
        const row = $('<tr></tr>').append(tds);
        this.$tbody.append(row);
    }

    /**
     * Instantiate table headers with sorting callback
     * @param {string} initialSort  initial sort type
     * @param {callback} onOrderCallback  callback for ordering change
     */
    initHeaders(initialSort, onOrderCallback) {
        const that = this;
        that.order = initialSort;
        this.$table.find('th.sort-both').on('click', function() {
            const siblings = $(this).siblings('[data-sortby]');
            _.each(siblings, function(s) {
                const sibling = $(s);
                if (sibling.hasClass('sort-desc') || sibling.hasClass('sort-asc')) {
                    siblings.removeClass('sort-desc');
                    siblings.removeClass('sort-asc');
                    siblings.addClass('sort-both');
                }
            });

            const elem = $(this);
            let sort = null;
            if (elem.hasClass('sort-both') || elem.hasClass('sort-desc')) {
                elem.removeClass('sort-both');
                elem.removeClass('sort-desc');
                elem.addClass('sort-asc');
                sort = elem.attr('data-sortby');
            } else {
                elem.removeClass('sort-asc');
                elem.addClass('sort-desc');
                sort = '-' + elem.attr('data-sortby');
            }
            that.order = sort;
            onOrderCallback(1, that.getPageSize(), sort, that.getFilterText());
        });
        if (initialSort) {
            let column;
            let sort;
            if (initialSort.charAt(0) === '-') {
                column = initialSort.slice(1);
                sort = 'sort-desc';
            } else {
                column = initialSort;
                sort = 'sort-asc';
            }
            this.$table.find('[data-sortby=\'' + column + '\']')
                .removeClass('sort-both')
                .addClass(sort);
        }
    }

    /**
     * Display loading gif
     */
    showLoadingGif() {
        this.$loadingGif.fadeIn();
    }

    /**
     * Hide loading gif
     */
    hideLoadingGif() {
        this.$loadingGif.fadeOut();
    }

    /**
     * Get page size from the selector
     * @return {number}
     */
    getPageSize() {
        return parseInt(this.$pageSizeSelect.val());
    }

    /**
     * Get page size from the selector
     * @param {number} pageSize
     */
    setPageSize(pageSize) {
        this.$pageSizeSelect.val(pageSize);
    }

    /**
     * Get the page from the selector
     * @return {number}
     */
    getCurrentPage() {
        return parseInt(this.$currentPageDisp.val());
    }

    /**
     * Get page size from the selector
     * @param {number} page
     */
    setCurrentPage(page) {
        this.$currentPageDisp.val(page);
    }

    /**
     * Get filter text input value
     * @return {string}
     */
    getFilterText() {
        return this.$filterInput.val();
    }

    /**
     * Get ordering string
     * @return {string}
     */
    getCurrentOrder() {
        return this.order;
    }

    /**
     * Set pagination display
     * @param {number} currentPage
     * @param {number} totalResults
     * @param {number} totalPages
     */
    setPageDisplay(currentPage, totalResults, totalPages) {
        this.$currentPageDisp.text(currentPage);
        this.$totalResultsDisp.text(totalResults);
        this.$maxPageDisp.text(totalPages);
    }

    /**
     * Set download URL for table
     * @param {string} url
     */
    setDownloadURL(url) {
        this.$downloadLink.attr('href', url);
    }

    /**
     * Hide container of table
     */
    hide() {
        this.$container.hide();
        // Hide any <hr> before table, if it exists
        this.$container.parent().parent().prev('hr').hide();
    }
};

