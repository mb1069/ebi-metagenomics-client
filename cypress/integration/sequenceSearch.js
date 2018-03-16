import {openPage, waitForBiomesLoad, waitForStudiesLoad, assertTableIsCleared, stripWhitespace} from './util';

const origPage = 'sequenceSearch';

const DEFAULT_SEQUENCE = ">2abl_A mol:protein length:163  ABL TYROSINE KINASE\n" +
    "MGPSENDPNLFVALYDFVASGDNTLSITKGEKLRVLGYNHNGEWCEAQTKNGQGWVPSNYITPVNSLEKHSWYHGPVSRNAAEYLLSSGINGSFLVRESESSPGQRSISLRYEGRVYHYRINTASDGKLYVSSESRFNTLAELVHHHSTVADGLITTLHYPAP";

describe('Sequence search', function () {

    beforeEach(function () {

    });

    it('Example link should fill sequence textarea', function () {
        openPage(origPage);
        cy.get('a.example').click();
        cy.get('#seq').then((el) => {
            cy.log(el.val());
            expect(el.val()).to.eq(DEFAULT_SEQUENCE);
        });
    });

    it('E-value tab should be visible on page load', function () {
        openPage(origPage);
        cy.get('#evalueTab').should('be.visible');
    });

    it('Deep linking should function - search tab', function () {
        openPage(origPage + '#searchTab');
        cy.get('#searchTab').should('be.visible');
        cy.get('#resultsTab').should('be.hidden');
    });
    it('Deep linking should function - results tab', function () {
        openPage(origPage + '#resultsTab');
        cy.get('#resultsTab').should('be.visible');
        cy.get('#searchTab:hidden', {timeout: 20000}).should('be.hidden');
    });


});


