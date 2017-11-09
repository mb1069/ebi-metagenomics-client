const _ = require('underscore');
// const util = require('../util');
const filterBtnWidget = require('./rmv_filter_widget');
const createRmvButton = new filterBtnWidget().create;
const removeFilterButton = new filterBtnWidget().remove;

module.exports = function CheckboxTree() {
    const groupContainerTmpl = "<div class='facet-child-group'></div>";
    const $elem = null;
    const callback = null;
    const allForms = ['#projectsFilters', '#samplesFilters', '#runsFilters'];

    const init = function (facet, $elem, $btnContainer, tree, callback, values, inModal) {
        // console.log(facet, $elem, $btnContainer, tree, callback, values);

        this.callback = callback;
        const $treeContainer = $("<div class='facet-container'></div>");
        // Create title
        createTitle($elem, tree.label);

        // Create and expand nodes
        _.each(tree.facetValues, function (node) {
            drawAndPropagate($treeContainer, node, tree.id, $btnContainer, callback);
        });


        if (!inModal) {
            const $modalLink = $("<a data-open='filtersModal'>More fields</a>");
            $modalLink.click(function () {
                const $modalElem = $('#' + $(this).attr('data-open')).find('.facets');
                $modalElem.empty();
                getFacetFields(facet, tree.id).done(function (response) {
                    const tree = response.facets[0];
                    const $tree = new CheckboxTree().init(facet, $modalElem, $btnContainer, tree, callback, [], true);
                    $tree.find('input').off('click');
                    $tree.find('input').click(function (e) {
                        const name = $(this).attr('name');
                        const val = $(this).val();
                        const $formElem = $elem.find('input[name="' + name + '"][value="' + val + '"]');
                        const checked = $(this).is(':checked');
                        if ($formElem.length === 0) {
                            if (checked) {
                                $treeContainer.append($(this).parent());
                            }
                        } else {
                            if (checked) {
                                $formElem.prop('checked', true);
                            }
                        }

                        if (e.originalEvent.isTrusted) {
                            propagateToFacets($(this).attr('name'), $(this).val(), $(this).is(':checked'));
                        }
                        setRmvButton($btnContainer, $(this));
                        callback();
                    })
                });
            });
            $treeContainer.append($("<p></p>").append($modalLink));
        }

        // Set checkbox values
        _.each(values, function (facetValue) {
            if (facetValue.id === tree.id) {
                let $checkbox = $treeContainer.find("input[value='" + facetValue.value + "']");
                if ($checkbox.length > 0) {
                    $checkbox.prop('checked', true);
                    setChildrenCheckboxes($checkbox);
                    setParentCheckboxStatus($checkbox);
                } else {
                    const node = {
                        label: facetValue.value,
                        value: facetValue.value,
                        count: ''
                    };
                    drawAndPropagate($treeContainer, node, tree.id, $btnContainer, callback);
                    $checkbox = $treeContainer.find("input[value='" + facetValue.value + "']");
                    $checkbox.prop('checked', true);
                }
                setRmvButton($btnContainer, $checkbox);
            }
        });

        $treeContainer.children('.facet-child-group').addClass('show');
        $elem.append($treeContainer);

        return $treeContainer;
    };

    const reset = function () {
        $elem.find("input[type='checkbox']").prop('checked', false);
        callback();
    };

    const createTitle = function ($elem, title) {
        $elem.append("<h5>" + title + "</h5>")
    };

    const drawAndPropagate = function ($elem, node, tree_label, $btnContainer, callback) {
        const $checkbox = $(createCheckbox(tree_label, node, $btnContainer, callback));
        const $groupContainer = $(groupContainerTmpl);

        if (node.children) {
            // Button click handler
            const $button = createExpandButton();
            $button.appendTo($groupContainer);
        }
        $groupContainer.append($checkbox);
        _.each(node.children, function (node2) {
            node2.value = node.value + '/' + node2.value;
            drawAndPropagate($groupContainer, node2, tree_label, $btnContainer, callback);
        });
        $groupContainer.appendTo($elem);
    };

    const createCheckbox = function (name, node, $btnContainer, callback) {
        const id = name + '_' + node.value;
        const $checkbox = $('<input name="' + name + '" type="checkbox" value="' + node.value + '" class="facet-checkbox" id="' + id + '"/>');
        $checkbox.click(function (e) {
            setChildrenCheckboxes($checkbox);
            setParentCheckboxStatus($checkbox);
            // addClearButton($(this), $('.filter-clear'));
            if (e.originalEvent.isTrusted) {
                propagateToFacets($(this).attr('name'), $(this).val(), $(this).is(':checked'));
            }
            setRmvButton($btnContainer, $(this));
            callback();
        });

        const $label = $("<label for='" + id + "'>" + node.label + " (" + node.count + ")</label>");
        return $().add($checkbox).add($label);
    };

    const setRmvButton = function ($btnContainer, $this) {
        const $parent = getParentCheckbox($this);
        const $siblings = getSiblingsCheckboxes($this);

        if ($parent.is(':checked')) {
            setRmvButton($btnContainer, $parent);
            _.map($siblings, function (e) {
                const $e = $(e);
                removeFilterButton($e)
            })
        } else if ($parent.length > 0) {
            // Edge case where the child of a (fully) checked node is unchecked
            let allChecked = true;
            $siblings.each(function (i, e) {
                allChecked = allChecked && $(e).is(':checked');
            });
            if (allChecked) {
                setRmvButton($btnContainer, $parent);
                $siblings.each(function (i, checkbox) {
                    const $checkbox = $(checkbox);
                    let $rmvButton = createRmvButton($checkbox.attr('name'), $checkbox.val(), function () {
                        $checkbox.click();
                    });
                    $btnContainer.append($rmvButton);
                });
            }
        }

        if ($this.is(':checked') && (($parent.length === 0) || (!getParentCheckbox($this).is(':checked')))) {
            if ($btnContainer.find('div[data-facet="' + $this.attr('name') + '"][data-value="' + $this.val() + '"]').length === 0) {
                let $rmvButton = createRmvButton($this.attr('name'), $this.val(), function () {
                    $this.click();
                });
                $btnContainer.append($rmvButton);
            }
        } else {
            removeFilterButton($this);
            // $btnContainer.find("div[data-facet='"+$this.attr('name')+"'][data-value='"+$this.val()+"']").remove();
        }
    };

    function propagateToFacets(name, value, checked) {
        _.each(allForms, function (formId) {
            let $checkbox = $(formId).find('input[name="' + name + '"][value="' + value + '"]');
            if ($checkbox.length) {
                let updateCheckbox = $checkbox.is(':checked') !== checked;
                if (updateCheckbox) {
                    $checkbox.click()
                }
            }
        });
    }

    const createExpandButton = function () {
        const $button = $("<button class='disp-children'>&#9654;</button>");
        $button.click(function (e) {
            e.preventDefault();
            const $group = $(this).siblings('.facet-child-group');

            $group.toggle();
            if ($group.is(":visible")) {
                $(this).text("\u25BC");
            } else {
                $(this).text("\u25B6");
            }
        });
        return $button;
    };

    const getChildrenCheckboxes = function ($elem) {
        return $elem.siblings('.facet-child-group').children('.facet-checkbox');
    };

    const getParentCheckbox = function ($elem) {
        return $elem.parent().siblings('.facet-checkbox');
    };

    const getSiblingsCheckboxes = function ($elem) {
        return $elem.parent().siblings('div.facet-child-group').children('input')
    };

    // const getFacetCheckboxes = function ($elem) {
    //     return $elem.closest('.facet-group').find('input');
    // };

    const setChildrenCheckboxes = function ($elem) {
        const $children = getChildrenCheckboxes($elem);
        $children.prop('indeterminate', false);
        $children.prop('checked', $elem.is(':checked'));
        $children.trigger('change');
        $children.each(function (i, child) {
            setChildrenCheckboxes($(child));
        })
    };

    const setParentCheckboxStatus = function ($elem) {
        const $parent = getParentCheckbox($elem);
        const children = getChildrenCheckboxes($parent);
        let checkedChildren = 0;
        let countChildren = children.length;
        let indeterminateChildren = 0;
        _.each(children, function (checkbox) {
            if (checkbox.checked) {
                checkedChildren++;
            }
            if ($(checkbox).prop('indeterminate')) {
                indeterminateChildren++;
            }
        });

        const $parentCheckbox = $($parent);

        if (indeterminateChildren > 0) {
            $parentCheckbox.prop('indeterminate', true);
            $parentCheckbox.prop('checked', false);
        } else if (checkedChildren === 0) {
            $parentCheckbox.prop('indeterminate', false);
            $parentCheckbox.prop('checked', false);
        } else if (checkedChildren < countChildren) {
            $parentCheckbox.prop('indeterminate', true);
            $parentCheckbox.prop('checked', false);
        } else {
            $parentCheckbox.prop('indeterminate', false);
            $parentCheckbox.prop('checked', true);
        }
        if (getParentCheckbox($parentCheckbox).val() !== undefined) {
            setParentCheckboxStatus($parentCheckbox);
        }
    };


    const getFacetFields = function (facet, field) {
        const fetch = $.get("https://www.ebi.ac.uk/ebisearch/ws/rest/metagenomics_" + facet + "?query=domain_source%3Ametagenomics_" + facet + "&format=json&size=0&facetfields=" + field + "&facetcount=1000&facetsdepth=10")
        return fetch.promise();
    };

    return {
        init: init,
        reset: reset
    }
};
