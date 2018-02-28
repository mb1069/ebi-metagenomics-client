import {openPage, datatype} from './util';
import Config from './config';
import GenericTableHandler from './genericTable';

const sampleId = "ERS434640";
const origPage = "samples/" + sampleId;

const studiesTableDefaultSize = 2;
const runsTableDefaultSize = 25;

const studyTableColumn = {
    biome_icon: {
        data: ['', ''],
        type: datatype.STR,
        sortable: false
    },
    study_id: {
        data: ['ERP104178', 'ERP005307'],
        type: datatype.STR,
        sortable: false
    },
    study_name: {
        data: ['EMG produced TPA metagenomics assembly of the Microbial Community of Mobilong Acid Sulfate Soil depth profile using Metagenomics (Mobilong Soil Profile) data set', 'Microbial Community of Mobilong Acid Sulfate Soil depth profile using Metagenomics'],
        type: datatype.STR,
        sortable: false
    },
    study_desc: {
        data: ['The Mobilong Soil Profile Third Party Annotation (TPA) assembly was derived from the primary whole genome shotgun (WGS) data set PRJEB5872. This project includes samples from the following biomes : Grassland.', 'The latter part of the Australian Millenium drought in 2007-2009 caused the acidification of acid sulfate soils in wetland and former floodplain soils, which pose threats to terrestrial and coastal ecosystems even after the recovery of surface flows and ground water levels. Drying and subsequent oxidation of ASS materials caused soil pH to drop to less than 4 (forming sulfuric materials) in some areas, triggering environmental problems such as land degradation, loss of native plants and animals, and release of heavy metals and metalloids into ground water, rivers and wetlands. To understand this microbially-mediated oxidation process, microbial communities were studied within an acidified acid sulfate soil profile, to identify key microorganisms involved in soil acidification. Six soil layers were sampled from a soil profile according to soil morphology at the most acidic locationin the field. Total DNA from soil samples was extracted using MO-BIO PowerMax? Soil DNA Isolation Kit and sequenced by Illumina Miseq (250PE) by The Ramaciotti Centre, NSW, Australia, prepared with a Nextera DNA Sample Preparation Kit. There were five steps of non-specific amplification involved in Nextera-Miseq sequencing for obtaining enough DNA for sequencing.'],
        type: datatype.STR,
        sortable: false
    },
    samples_count: {
        data: ['2', '6'],
        type: datatype.NUM,
        sortable: false
    },
    last_update: {
        data: ['15-Nov-2017', '15-Mar-2016'],
        type: datatype.DATE,
        sortable: false
    }
};

const runTableColumns = {
    accession: {
        data: ['SRR997122', 'SRR997098'],
        type: datatype.STR,
        sortable: true
    },
    experiment_type: {
        data: ['amplicon', 'amplicon'],
        type: datatype.STR,
        sortable: false
    },
    instrument_model: {
        data: ['', ''],
        type: datatype.STR,
        sortable: false
    },
    instrument_platform: {
        data: ['', ''],
        type: datatype.STR,
        sortable: false
    },
    pipeline_version: {
        data: ['2.0', '2.0'],
        type: datatype.STR,
        sortable: false
    },
};

function waitForPageLoad(projectId) {
    cy.get('h3').should('contain', projectId)
}

describe('Sample page - General', function () {
    beforeEach(function () {
        openPage(origPage);
        waitForPageLoad(sampleId);
    });

    it('Verify elements are present', function () {
        cy.get('h3').should('contain', sampleId);
        cy.get('h2').should('contain', 'Sample ASSDL1');
        cy.get('#main-content-area > div.row > div.column > h3:nth-child(1)').should('contain', 'Description');
        cy.get('#main-content-area > div.row > div.column > h3').should('contain', 'Classification');
        cy.get('#main-content-area > div.row > div.column > p').should('contain', 'ASS depth profile');
        cy.get('#sample-metadata').should('contain', 'Collection date:').should('contain', '01/02/2013');
        //    TODO add more verifications
    });
});

let table;
describe('Sample page - Study table', function () {
    beforeEach(function () {
        openPage(origPage);
        waitForPageLoad(sampleId);
        table = new GenericTableHandler('#studies-section', studiesTableDefaultSize);
    });

    it('Studies table should contain correct number of samples', function () {
        table.checkLoadedCorrectly(1, 2, 2, studyTableColumn);
    });

    it('Studies table download link should be valid', function () {
        table.testDownloadLink(Config.API_URL + 'samples/'+sampleId+'/studies?sample_id=' + sampleId + "&format=csv")
    });
});

describe('Sample page - Runs table', function () {
    beforeEach(function () {
        openPage(origPage);
        waitForPageLoad(sampleId);
        table = new GenericTableHandler('#runs-section', runsTableDefaultSize);
    });

    it('Runs table should contain correct number of runs', function () {
        table.checkLoadedCorrectly(1, 25, 12642);
    });

    it('Runs table should respond to ordering', function () {
        table.testSorting(25, runTableColumns);
    });

    it('Runs table should respond to filtering', function () {
        table.testFiltering('SRR997119', [['SRR997119', 'amplicon', '', '', '2.0']])
    });


    it('Runs table should respond to pagination', function () {
        table.testPagination(25, [{
            index: 1,
            data: ['SRR997122', 'amplicon', '', '', '2.0'],
        }, {
            index: 3,
            data: ['SRR997072', 'amplicon', '', '', '2.0'],
        }, {
            index: 'next',
            data: ['SRR997047', 'amplicon', '', '', '2.0'],
            pageNum: 4
        }, {
            index: 'prev',
            data: ['SRR997072', 'amplicon', '', '', '2.0'],
            pageNum: 3
        }, {
            index: 'last',
            data: ['ERR010497', 'metatranscriptomic', '', '', '1.0'],
            pageNum: 506,
            pageSize: 17
        }, {
            index: 'first',
            data: ['SRR997122', 'amplicon', '', '', '2.0'],
            pageNum: 1
        }]);
    });

    it('Runs table should respond to page size change', function () {
        table.testPageSizeChange(runsTableDefaultSize, 50)
    });

    it('Runs table download link should be valid', function () {
        table.testDownloadLink(Config.API_URL + 'runs?sample_id=' + sampleId + "&format=csv")
    });
});

describe('Sample page - Runs table with >1 analysis per run', function () {
    beforeEach(function () {
        const projectId = "ERS667567";
        const origPage = "samples/" + projectId;
        openPage(origPage);
        waitForPageLoad(projectId);
        table = new GenericTableHandler('#runs-section', runsTableDefaultSize);
    });
    it('Runs table should display both pipeline versions for a run', function () {
        table.testFiltering('ERR1022502', [['ERR1022502', 'metatranscriptomic', '', '', '2.0, 4.0'], ['ERR1022502', 'metatranscriptomic', 'Illumina HiSeq 2500', 'ILLUMINA', '2.0, 4.0']])
    });
});

describe('Sample page - External links are valid', function(){
    
});