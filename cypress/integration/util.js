import Config from './config';

const sortBySelector = '#sortBy';


var Util = module.exports = {
    getBaseURL: function () {
        return Config.BASE_URL;
    },
    getPageURL: function (page) {
        return Config.BASE_URL + (page !== 'overview' ? page : '');
    },
    openPage: function (page) {
        cy.visit(Util.getPageURL(page));
    },
    setSortBy: function (optionValue, numResults, waitCallback) {
        cy.get(sortBySelector).select('-last_update');
        waitCallback(numResults);
    },
    waitForPageLoad: function (projectId) {
        cy.get('h2').should('contain', projectId)
    },
    waitForBiomesLoad: function (results) {
        cy.get("table tr.biome", {timeout: 10000}).should("have.length", parseInt(results));
    },
    waitForSamplesLoad: function (results) {
        cy.get("table > tbody > tr", {timeout: 10000}).should("have.length", parseInt(results));
    },

    waitForStudiesLoad: function (results) {
        cy.get("table > tbody > tr", {timeout: 10000}).should("have.length", parseInt(results));
    },
    assertTableIsCleared: function () {
        cy.get("table tr.sample").should('not.exist');
    },

    urlExists: function (url) {
        cy.request(url);
    },
    stripWhitespace: function (str) {
        return str.replace(/\s/g, "");
    },
    datatype: {
        STR: 0,
        NUM: 1,
        DATE: 2
    }
};