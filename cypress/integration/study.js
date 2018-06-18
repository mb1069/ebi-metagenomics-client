import {openPage, datatype, urlExists, waitForPageLoad, login} from './util';
import Config from './config';
import GenericTableHandler from './genericTable';

const projectId = 'MGYS00002072';
const origPage = 'studies/' + projectId;

const pageTitle = 'Longitudinal study of the diabetic skin and wound microbiome';

const analysesTableDefaultSize = 25;

const analysisTableColumns = {
    biome: {
        data: ['', ''],
        type: datatype.STR,
        sortable: false
    },
    accession: {
        data: ['ERS1474796', 'ERS1474806'],
        type: datatype.STR,
        sortable: false
    },
    sample_name: {
        data: ['control_skin_left', 'diabetic_skin_contra'],
        type: datatype.STR,
        sortable: false
    },
    run_accession: {
        data: ['ERR1760043', 'ERR1760053'],
        type: datatype.STR,
        sortable: false
    },
    pipeline_version: {
        data: ['4.0', '4.0'],
        type: datatype.NUM,
        sortable: false
    },
    analysis_accession: {
        data: ['MGYA00140353', 'MGYA00140377'],
        type: datatype.STR,
        sortable: false
    }
};

describe('Study page - General', function() {
    beforeEach(function() {
        openPage(origPage);
        waitForPageLoad(pageTitle);
    });

    it('Verify elements are present', function() {
        cy.get('h3').should('contain', 'MGYS00002072');
        cy.get('h2')
            .should('contain', 'Longitudinal study of the diabetic skin and wound microbiome');
        cy.get('#ebi_ena_links').should('contain', 'ENA website (ERP019566)');
        cy.contains('Human > Skin').should('exist');
        cy.get('#europe_pmc_links > li')
            .should('contain', 'A longitudinal study of the diabetic skin and wound microbiome.');
        cy.get('#europe_pmc_links > li')
            .should('contain', 'Gardiner M, Vicaretti M, Sparks J, Bansal S, Bush S, et al.');
        cy.get('#europe_pmc_links > li').should('contain', '2017 5');
        cy.get('#europe_pmc_links > li > a').should('contain', '28740749');
        cy.get('#europe_pmc_links > li > a').should('contain', '10.7717/peerj.3543');
    });

    it('External links should all be valid', function() {
        cy.get('#ebi_ena_links > li > a').each(($el) => {
            urlExists($el.attr('href'));
        });
        cy.get('#europe_pmc_links > li > a').each(($el) => {
            urlExists($el.attr('href'));
        });
    });
});

describe('Study page - Related studies - ', function() {
    const relatedStudiesList = '[data-cy=\'relatedStudies\']';
    it('Should display related study section', function() {
        openPage('');
        login();
        openPage('studies/MGYS00002011');
        waitForPageLoad('EMG produced TPA metagenomics assembly of the Microbial Community of ' +
            'Mobilong Acid Sulfate Soil depth profile using Metagenomics (Mobilong Soil Profile)' +
            ' data set');
        cy.contains('Related studies');
        cy.get(relatedStudiesList).should('have.length', 1);
        cy.get(relatedStudiesList + ' a').contains('MGYS00000369').click();
        waitForPageLoad('Microbial Community of Mobilong Acid Sulfate Soil ' +
            'depth profile using Metagenomics');
    });
    it('Should not display related study section if no related studies available', function() {
        openPage(origPage);
        login();
        cy.get(relatedStudiesList).should('not.exist');
    });
});

describe('Study page - Hiding Publications display -', function() {
    const pubsList = '[data-cy=\'publications\']';
    it('Should not display empty section if no publications available', function() {
        openPage('studies/MGYS00002062');
        waitForPageLoad('EMG produced TPA metagenomics assembly of the Identification of fungi' +
            ' and ameba from human wound genomic sequencing (human wound) data set');
        cy.get(pubsList + ' li').should('have.length', 1).contains('No known publications.');
    });
});

let table;
describe('Study page - Analysis table - ', function() {
    beforeEach(function() {
        openPage(origPage);
        waitForPageLoad(pageTitle);
        table = new GenericTableHandler('#analysis-section', analysesTableDefaultSize);
    });

    it('Should be toggleable', function() {
        table.testTableHiding();
    });

    it('Should contain correct number of analyses', function() {
        table.checkLoadedCorrectly(1, analysesTableDefaultSize, 258, analysisTableColumns);
    });

    // it('Should respond to ordering', function() {
    //     table.testSorting(10, analysisTableColumns);
    // });
    //
    // it('Should respond to filtering', function() {
    //     table.testFiltering('ERS1474800', [
    //         [
    //             '',
    //             'ERS1474800',
    //             'Control patient 9 left foot time 3',
    //             'control_skin_left',
    //             '27-Nov-2017']]);
    // });

    it('Should respond to pagination', function() {
        table.testPagination(25, [
            {
                index: 1,
                data: [
                    '',
                    'ERS1474796', 'control_skin_left', 'ERR1760043', '4.0', 'MGYA00140353']
            }, {
                index: 3,
                data: [
                    '',
                    'ERS1474615', 'wound_swab', 'ERR1759931', '4.0', 'MGYA00140403']
            }, {
                index: 'next', // 4th page
                data: [
                    '', 'ERS1474560', 'control_skin_left', 'ERR1759912', '4.0', 'MGYA00140428'],
                pageNum: 4
            }, {
                index: 'prev',
                data: [
                    '',
                    'ERS1474615', 'wound_swab', 'ERR1759931', '4.0', 'MGYA00140403'],
                pageNum: 3
            }, {
                index: 'last',
                data: [
                    '',
                    'ERS1474833', 'diabetic_skin_adj', 'ERR1760080', '4.0', 'MGYA00140603'],
                pageNum: 11,
                pageSize: 8
            }, {
                index: 'first',
                data: [
                    '',
                    'ERS1474796', 'control_skin_left', 'ERR1760043', '4.0', 'MGYA00140353'],
                pageNum: 1
            }]);
    });

    it('Should respond to page size change', function() {
        table.testPageSizeChange(analysesTableDefaultSize, 25);
    });

    it('Analysis table download link should be valid', function() {
        table.testDownloadLink(Config.API_URL + 'studies/' + projectId +
            '/analyses?include=sample&format=csv');
    });
});

// describe('Study page - Runs table with >1 analysis per run', function() {
//     beforeEach(function() {
//         const projectId = 'ERP009703';
//         const origPage = 'studies/' + projectId;
//         openPage(origPage);
//         waitForPageLoad(
//             'Ocean Sampling Day (OSD) 2014: amplicon and metagenome sequencing ' +
//             'study from the June solstice in the year 2014');
//         table = new GenericTableHandler('#runs-section', runsTableDefaultSize);
//     });
//     it('Runs table should display both pipeline versions for a run', function() {
//         table.testFiltering('ERR770966', [
//             ['ERR770966', 'metagenomic', '', '', '2.0, 4.0'],
//             ['ERR770966', 'metagenomic', '', '', '2.0, 4.0']
//         ]);
//     });
// });

describe('Study page - Error handling', function() {
    it('Should display error message if invalid accession passed in URL', function() {
        const studyId = 'ERP019566012345';
        const origPage = 'studies/' + studyId;
        openPage(origPage);
        waitForPageLoad('Oh no! An error has occured!');
        cy.contains('Error: 404');
        cy.contains('Could not retrieve study: ' + studyId);
    });
});

// describe('Study page - Downloads tab', function() {
//     beforeEach(function() {
//         const projectId = 'ERP009703';
//         const origPage = 'studies/' + projectId;
//         openPage(origPage);
//         changeTab('analysis');
//     });
//     it('Download links for both pipeline versions should be present', function() {
//         const pipelineVersions = ['2.0', '4.0'];
//         let i = 0;
//         cy.get('#downloads h3').each(function($el) {
//             expect(Cypress.$($el).text()).to.eq('Pipeline version: ' + pipelineVersions[i++]);
//         });
//     });
//     it('Download links should contain all files for each pipeline version', function() {
//         const pipeline2Files = ['GO slim annotation', 'Complete GO annotation',
// 'InterPro matches',
//             'Phylum level taxonomies', 'Taxonomic assignments'];
//         const pipeline4Files = ['GO slim annotation', 'Complete GO annotation',
// 'InterPro matches',
//             'Phylum level taxonomies SSU', 'Taxonomic assignments SSU',
//             'Phylum level taxonomies LSU', 'Taxonomic assignments LSU',
//             'Taxonomic diversity metrics LSU', 'Taxonomic diversity metrics SSU'];
//         const files = pipeline2Files.concat(pipeline4Files);
//         let i = 0;
//         cy.get('#downloads > div > p').each(function($el) {
//             expect(Cypress.$($el).text()).to.eq(files[i++]);
//         });
//     });
//     // TODO test before release
//     // it('Download links should all be valid', function(){
//     //     cy.get('#downloads > div > p > a').each(function($el){
//     //         cy.request(Cypress.$($el).attr('href'));
//     //         cy.log(Cypress.$($el).attr('href'))
//     //     });
//     // });
// });
