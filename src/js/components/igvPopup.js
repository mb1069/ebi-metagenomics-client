const _ = require('underscore');

const helperMethods = {
    /**
     * Get a key from the attributes
     * @param {*} key Dict Key
     * @param {*} def default value
     * @param {function} cb transformation callback
     * @return {*} the value or default
     */
    get(key, def, cb) {
        def = def || '';
        if (_.has(this, key)) {
            // eslint-disable-next-line security/detect-object-injection
            let d = this[key];
            if (cb) {
                d = cb(d);
            }
            return d;
        } else {
            return def;
        }
    },
    /**
     * Get multiples values
     * @param {*} key Key.
     * @param {string} linkHref url of the external resource prefix
     * @param {function} cb post process callback
     * @return {*} The table with the data or an empty string
     */
    getMulti(key, linkHref, cb) {
        const val = this.get(key, '');
        if (val === '') {
            return '';
        }
        const data = val.split(',');
        return this.entryTemplate({
            values: data.map((d) => {
                if (cb) {
                    d = cb(d);
                }
                return {
                    name: d,
                    link: (linkHref) ? linkHref + d : ''
                };
            })
        });
    },
    /**
     * Calculate the property length.
     * @return {int} the length or undefined
     */
    getProtLength() {
        const start = parseInt(this.get('start'));
        const end = parseInt(this.get('end'));
        if (_.isNaN(start) || _.isNaN(end)) {
            return undefined;
        }
        return Math.ceil((end - start) / 3);
    }
};

module.exports = function(data, template, entryTemplate) {
    if (!data || !data.length) {
        return false;
    }

    let attributes = _.where(data, (d) => {
        return d.name;
    });

    if (attributes.length === 0) {
        return false;
    }

    attributes = _.reduce(attributes, (memo, el) => {
        memo[el.name.toLowerCase()] = el.value;
        return memo;
    }, {});

    attributes = _.extend(attributes, helperMethods, {entryTemplate: entryTemplate});

    const functionalData = {
        title: 'Functional annotation',
        data: [{
            name: 'E.C Number',
            value: attributes.getMulti('ec_number', 'https://enzyme.expasy.org/EC/')
        }, {
            name: 'Pfam',
            value: attributes.getMulti('pfam', 'https://pfam.xfam.org/family/')
        }, {
            name: 'KEGG',
            value: attributes.getMulti(
                'kegg', 'https://www.genome.jp/dbget-bin/www_bget?')
        }, {
            name: 'eggNOG',
            value: attributes.get('eggnog', (d) => decodeURIComponent(d))
        }, {
            name: 'COG',
            value: attributes.getMulti('cog')
        }, {
            name: 'GO',
            value: attributes.getMulti(
                'go',
                'https://www.ebi.ac.uk/ols/search?q=')
        }, {
            name: 'InterPro',
            value: attributes.getMulti(
                'interpro', 'https://www.ebi.ac.uk/interpro/entry/InterPro/')
        }, { // antiSMASH
            name: 'Type',
            value: attributes.get('as_type')
        }, {
            name: 'Notes',
            // Notes are URL encoded during the GFF generation
            value: attributes.getMulti('as_notes', undefined, (d) => decodeURIComponent(d))
        }, {
            name: 'Cluster',
            value: attributes.getMulti('as_gene_clusters')
        }]
    };

    const otherData = {
        title: 'Feature details',
        data: [{
            name: 'Type',
            value: attributes.get('type')
        }, {
            name: 'Inference',
            value: attributes.get('inference')
        }, {
            name: 'Start / End',
            value: attributes.get('start') + ' / ' + attributes.get('end')
        }, {
            name: 'Protein length',
            value: attributes.getProtLength()
        }]
    };

    let templateData = {
        name: attributes.get('id'),
        gene: attributes.get('gene'),
        product: attributes.get('product'),
        properties: []
    };

    if (_.findIndex(functionalData.data, (d) => d.value.length > 0) != -1) {
        templateData.properties.push(functionalData);
    }

    templateData.properties.push(otherData);

    return template(templateData);
};
