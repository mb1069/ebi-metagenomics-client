import {openPage, datatype, urlExists, waitForPageLoad} from './util';
import Config from './config';
import GenericTableHandler from './genericTable';

const projectId = 'ERP019566';
const origPage = 'studies/' + projectId;

const pageTitle = 'Longitudinal study of the diabetic skin and wound microbiome';

const samplesTableDefaultSize = 10;
const runsTableDefaultSize = 25;

const sampleTableColumns = {
    biome: {
        data: ['', ''],
        type: datatype.STR,
        sortable: false
    },
    accession: {
        data: ['ERS1474797', 'ERS1474709'],
        type: datatype.STR,
        sortable: true
    },
    sample_name: {
        data: ['Control patient 9 right foot time 1', 'Patient 7 skin adjacent to wound time 2'],
        type: datatype.STR,
        sortable: true
    },
    description: {
        data: ['control_skin_right', 'diabetic_skin_adj'],
        type: datatype.STR,
        sortable: false
    },
    last_update: {
        data: ['27-Nov-2017', '27-Nov-2017'],
        type: datatype.DATE,
        sortable: true
    }
};

const runTableColumns = {
    accession: {
        data: ['ERR1760141', 'ERR1760117'],
        type: datatype.STR,
        sortable: true
    },
    experiment_type: {
        data: ['amplicon', 'amplicon'],
        type: datatype.STR,
        sortable: false
    },
    instrument_model: {
        data: ['Illumina MiSeq', 'Illumina MiSeq'],
        type: datatype.STR,
        sortable: false
    },
    instrument_platform: {
        data: ['Illumina platform', 'Illumina platform'],
        type: datatype.STR,
        sortable: false
    },
    pipeline_version: {
        data: ['4.0', '4.0'],
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
        cy.get('h3').should('contain', projectId);
        cy.get('h2')
            .should('contain', 'Longitudinal study of the diabetic skin and wound microbiome');
        cy.get('#ebi_ena_links').should('contain', 'ENA website (ERP019566)');
        cy.get('#europe_pmc_links > li')
            .should('contain', 'A longitudinal study of the diabetic skin and wound microbiome.');
        cy.get('#europe_pmc_links > li')
            .should('contain', 'Gardiner M, Vicaretti M, Sparks J, Bansal S, Bush S, et al.');
        cy.get('#europe_pmc_links > li').should('contain', '2017 5');
        cy.get('#europe_pmc_links > li > a').should('contain', '28740749');
        cy.get('#europe_pmc_links > li > a').should('contain', '10.7717/peerj.3543');
    });

    it('External links should all be valid', function() {
        cy.get('#ebi_ena_links > a').each(($el) => {
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
        openPage('studies/ERP104178');
        waitForPageLoad('EMG produced TPA metagenomics assembly of the Microbial Community of ' +
            'Mobilong Acid Sulfate Soil depth profile using Metagenomics (Mobilong Soil Profile)' +
            ' data set');
        cy.contains('Related studies');
        cy.get(relatedStudiesList).should('have.length', 1);
        cy.get(relatedStudiesList + ' a').contains('ERP005307').click();
        waitForPageLoad('Microbial Community of Mobilong Acid Sulfate Soil ' +
            'depth profile using Metagenomics');
    });
    it('Should not display related study section if no related studies available', function() {
        openPage(origPage);
        cy.get(relatedStudiesList).should('not.exist');
    });
});

describe('Study page - Hiding Publications display -', function() {
    const pubsList = '[data-cy=\'publications\']';
    it('Should not display empty section if no publications available', function() {
        openPage('studies/ERP104236');
        waitForPageLoad('EMG produced TPA metagenomics assembly of the Identification of fungi' +
            ' and ameba from human wound genomic sequencing (human wound) data set');
        cy.get(pubsList + ' li').should('have.length', 1).contains('No known publications.');
    });
});

let table;
describe('Study page - Samples table - ', function() {
    beforeEach(function() {
        openPage(origPage);
        waitForPageLoad(pageTitle);
        table = new GenericTableHandler('#samples-section', samplesTableDefaultSize);
    });

    it('Should be toggleable', function() {
        table.testTableHiding();
    });

    it('Should contain correct number of samples', function() {
        table.checkLoadedCorrectly(1, 10, 258, sampleTableColumns);
    });

    it('Should respond to ordering', function() {
        table.testSorting(10, sampleTableColumns);
    });

    it('Should respond to filtering', function() {
        table.testFiltering('ERS1474800', [
            [
                '',
                'ERS1474800',
                'Control patient 9 left foot time 3',
                'control_skin_left',
                '27-Nov-2017']]);
    });

    it('Should respond to pagination', function() {
        table.testPagination(10, [
            {
                index: 1,
                data: [
                    '',
                    'ERS1474797',
                    'Control patient 9 right foot time 1',
                    'control_skin_right',
                    '27-Nov-2017']
            }, {
                index: 3,
                data: [
                    '',
                    'ERS1474870',
                    'Patient 5 wound debridement time 5',
                    'wound_deb',
                    '27-Nov-2017']
            }, {
                index: 'next',
                data: [
                    '',
                    'ERS1474887',
                    'Patient 6 skin contralateral foot to wound time 4',
                    'diabetic_skin_contra',
                    '27-Nov-2017'], // 4th row
                pageNum: 4
            }, {
                index: 'prev',
                data: [
                    '',
                    'ERS1474870',
                    'Patient 5 wound debridement time 5',
                    'wound_deb',
                    '27-Nov-2017'], // Back to 3rd row
                pageNum: 3
            }, {
                index: 'last',
                data: [
                    '',
                    'ERS1474858',
                    'Patient 5 skin contralateral foot to wound time 2',
                    'diabetic_skin_contra',
                    '27-Nov-2017'],
                pageNum: 6,
                pageSize: 8
            }, {
                index: 'first',
                data: [
                    '',
                    'ERS1474797',
                    'Control patient 9 right foot time 1',
                    'control_skin_right',
                    '27-Nov-2017'],
                pageNum: 1
            }]);
    });

    it('Should respond to page size change', function() {
        table.testPageSizeChange(samplesTableDefaultSize, 25);
    });

    it('Sample table download link should be valid', function() {
        table.testDownloadLink(Config.API_URL + 'samples?study_accession=' + projectId +
            '&format=csv');
    });
});

describe('Study page - Runs table', function() {
    beforeEach(function() {
        openPage(origPage);
        waitForPageLoad(pageTitle);
        table = new GenericTableHandler('#runs-section', runsTableDefaultSize);
    });

    it('Should be toggleable', function() {
        table.testTableHiding();
    });

    it('Runs table should contain correct number of runs', function() {
        table.checkLoadedCorrectly(1, 25, 258);
    });

    it('Runs table should respond to ordering', function() {
        table.testSorting(25, runTableColumns);
    });

    it('Runs table should respond to filtering', function() {
        table.testFiltering('ERR1760140',
            [['ERR1760140', 'amplicon', 'Illumina MiSeq', 'ILLUMINA', '4.0']]);
    });

    it('Runs table should respond to pagination', function() {
        table.testPagination(25, [
            {
                index: 1,
                data: ['ERR1760141', 'amplicon', 'Illumina MiSeq', 'ILLUMINA', '4.0']
            }, {
                index: 3,
                data: ['ERR1760091', 'amplicon', 'Illumina MiSeq', 'ILLUMINA', '4.0']
            }, {
                index: 'next',
                data: ['ERR1760066', 'amplicon', 'Illumina MiSeq', 'ILLUMINA', '4.0'], // 4th row
                pageNum: 4
            }, {
                index: 'prev',
                data: ['ERR1760091', 'amplicon', 'Illumina MiSeq', 'ILLUMINA', '4.0'],
                pageNum: 3
            }, {
                index: 'last',
                data: ['ERR1759891', 'amplicon', 'Illumina MiSeq', 'ILLUMINA', '4.0'],
                pageNum: 11,
                pageSize: 8
            }, {
                index: 'first',
                data: ['ERR1760141', 'amplicon', 'Illumina MiSeq', 'ILLUMINA', '4.0'],
                pageNum: 1
            }]);
    });

    it('Runs table should respond to page size change', function() {
        table.testPageSizeChange(runsTableDefaultSize, 50);
    });

    it('Runs table download link should be valid', function() {
        table.testDownloadLink(Config.API_URL + 'runs?study_accession=' + projectId +
            '&format=csv');
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
