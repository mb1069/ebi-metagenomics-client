import {openPage} from './util';
const origPage = 'studies';

const initialResultSize = 25;
const sortBySelector = '#sortBy';

function waitForStudiesLoad(results){
    cy.get("table tr.study", {timeout: 10000}).should("have.length", parseInt(results));
}

function setSortBy(sortBySelector, optionVal){
    cy.get(sortBySelector).select(optionVal);
    waitForStudiesLoad(initialResultSize);
}

/**
 * Verify number of results responds to selector
 */
describe('Studies page', function() {
    // it('Correct number of results.', function() {
    //     openPage(origPage);
    //     cy.wait(1000);
    //     cy.get('#pagesize').invoke('val').then((val) => {
    //         waitForStudiesLoad(val);
    //         cy.get('#pagesize').select('50');
    //         waitForStudiesLoad('50');
    //     });
    // });
    beforeEach(function(){
        openPage(origPage);
        waitForStudiesLoad(initialResultSize);

    });

    it('Should respond to last-updated ordering', function(){
        const selector = "td.updated";

        setSortBy(sortBySelector, '-last_update');
        cy.get(selector).first().should(function($el){
            expect(new Date(Cypress.$(selector).last().text())).to.be.lte(new Date($el.text()));
        });

        setSortBy(sortBySelector, 'last_update');
        cy.get(selector).first().should(function($el){
            expect(new Date(Cypress.$(selector).last().text())).to.be.gte(new Date($el.text()));
        });
    });

    it('Should respond to study name ordering', function(){
        const selector = "td.name";

        setSortBy(sortBySelector, '-study_name');
        cy.get(selector).first().should(function($el){
            expect(Cypress.$(selector).last().text()).to.be.lte($el.text());
        });

        setSortBy(sortBySelector, 'study_name');
        cy.get(selector).first().should(function($el){
            expect(Cypress.$(selector).last().text()).to.be.gte($el.text());
        });
    });

    it('Should respond to num. samples ordering', function(){
        const selector = "td.samples";

        setSortBy(sortBySelector, '-samples_count');
        cy.get(selector).first().should(function($el){
            expect(Cypress.$(selector).last().text()).to.be.lte($el.text());
        });

        setSortBy(sortBySelector, 'samples_count');
        cy.get(selector).first().should(function($el){
            expect(Cypress.$(selector).last().text()).to.be.gte($el.text());
        });
    });
});

// TODO test pagination works
// TODO test URL params are correctly set on every filter/search operation
// TODO test clear button functions correctly

