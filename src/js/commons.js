require('what-input');
require('ebi-framework/libraries/foundation-6/js/foundation.js');
require('ebi-framework/js/script');
require('ebi-framework/js/foundationExtendEBI');
window.Foundation.addToJquery($);

export const pagination = require('../partials/pagination.handlebars');
export const pagesize = require('../partials/pagesize.handlebars');
export const genericTable = require('../partials/generic_table.handlebars');
export const detailList = require('../partials/detailList.handlebars');
export const biomeFilter = require('../partials/biome_filter.handlebars');
export const errorTmpl = require('../partials/errorTemplate.handlebars');

export const pipelines = {
    '1.0': require('../partials/pipelines/1.handlebars'),
    '2.0': require('../partials/pipelines/2.handlebars'),
    '3.0': require('../partials/pipelines/3.handlebars'),
    '4.0': require('../partials/pipelines/4.handlebars'),
    '4.1': require('../partials/pipelines/4.1.handlebars')
};

require('../../static/images/nucleic_acids_research_D1_cover.gif');
require('../../static/images/funding/BBSRC.png');
require('../../static/images/funding/embl_logo.png');
require('../../static/images/funding/excelerate_whitebackground.png');
require('../../static/images/funding/holofood.png');
require('../../static/images/funding/innovate-uk-logo.png');
require('../../static/images/ico_graph_krona_on.svg');
require('../../static/images/ico_graph_pie_on.svg');
require('../../static/images/ico_graph_barh_on.svg');
require('../../static/images/ico_graph_col_on.svg');

require('../../static/images/twitter_card/card_image.jpg');
require('../../static/images/twitter_card/card_image_no_ebi_logo.jpg');

require('../../static/images/submission_process.svg');
require('../../static/images/ajax-loader.gif');

require('style-loader?name=[name].[ext]!../../static/css/elixir-banner.css');
require('style-loader?name=[name].[ext]!../../static/css/ebi-global.css');
require('style-loader?name=[name].[ext]!../../static/css/theme-embl-petrol.css');
require('style-loader!EBI-Icon-fonts/fonts.css');
require('style-loader!EBI-Icon-fonts/EBI-Functional/fonts/EBI-Functional.css');
require('style-loader!EBI-Icon-fonts/EBI-Common/fonts/EBI-Common.css');

require(
    'style-loader?name=[name].[ext]!../../node_modules/tablesorter/dist/css/theme.default.min.css');

require('style-loader!ebi-framework/css/ebi-global.css');
require('style-loader!ebi-framework/css/theme-embl-petrol.css');

require('style-loader!../../static/css/site.css');

export const BLOG_URL = 'https://ebi-metagenomics.github.io/blog/';
export const READTHEDOCS_URL = 'https://emg-docs.readthedocs.io';
// export const EBI_EUROPE_PMC_ENTRY_URL = 'https://europepmc.org/abstract/MED/';
// export const EBI_ENA_VIEW_URL = 'https://www.ebi.ac.uk/ena/data/view/';
// export const DX_DOI_URL = 'http://dx.doi.org/';
export const COOKIE_NAME = 'ebi-metagenomics';
export const DEFAULT_PAGE_SIZE = 25;
export const DEFAULT_PAGE_SIZE_SAMPLES = 10;
export const TAXONOMY_COLOURS = [
    '#058dc7',
    '#82d23d',
    '#e26736',
    '#fbe300',
    '#24cbe5',
    '#c49ecc',
    '#ffc08a',
    '#708090',
    '#6af9c4',
    '#caae74',
    '#cccccc'
];

$(document).foundation();
$(document).foundationExtendEBI();
