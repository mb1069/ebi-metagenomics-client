const Backbone = require('backbone');
const Backform = require('backform');
const _ = require('underscore');
const util = require('../util');

const DEFAULT_SEQUENCE = '>2abl_A mol:protein length:163  ABL TYROSINE KINASE\n' +
    'MGPSENDPNLFVALYDFVASGDNTLSITKGEKLRVLGYNHNGEWCEAQTKNGQGWVPSNYITPVNSLEKHSWYHGPVSRNAAEYLLSSGINGSFLVRESESSPGQRSISLRYEGRVYHYRINTASDGKLYVSSESRFNTLAELVHHHSTVADGLITTLHYPAP';

util.checkAPIonline();
util.setCurrentTab('#search-nav');

const HmmerSearch = Backbone.Model.extend({
    url: "https://www.ebi.ac.uk/Tools/hmmer/search/phmmer"
});

const HmmerSearchResults = Backbone.View.extend({
    model: HmmerSearch,
    search: function (data) {
        $.post({
            url: "https://www.ebi.ac.uk/Tools/hmmer/search/phmmer",
            data:$('#hmmerSearchForm').find(':input:not(:hidden)').serialize()+"&output=json&seqdb=pdb",
            success: function (a, b, c) {
                console.log(a);
                console.log(b);
                console.log(c);
            }
        });
    }
});

const hmmerData = new HmmerSearch();
const hmmerView = new HmmerSearchResults({model: hmmerData});


function submitForm() {
    let listData = $('#hmmerSearchForm').find(':input:not(:hidden)').serializeArray();
    let dataObj = {};
    _.each(listData, function (e) {
        dataObj[e.name] = e.value;
    });
    hmmerView.search(dataObj);

}

function fillExample(e) {
    $('#seq').val(DEFAULT_SEQUENCE);
}

function showAdvanced() {
    $('.advanced').removeClass('hidden');
    $(this).hide();
}

$(document).ready(function () {
    util.attachTabHandlers('sequence-search-tabs');
    $('a.example').click(fillExample);
    $('#show-advanced').click(showAdvanced);
    $('#submit').click(submitForm);
    $('a.example').click();
    $('#cutoff-search-tabs > li.tabs-title.is-active').click();
    $('#submit').click()
});


window.Foundation.addToJquery($);

