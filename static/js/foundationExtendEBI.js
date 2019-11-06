// Copyright (c) EMBL-EBI 2017
// Authors:
// - Ken Hawkins (khawkins@ebi.ac.uk)
// Documentation generated with: https://github.com/documentationjs/documentation#documentation


/**
 * We poll the document until we find GA has loaded, or we've tried a few times.
 * @param {number} numberOfEbiGaChecks counter
 * @param {number} [numberOfEbiGaChecksLimit=2]
 */
function ebiGaIndicateLoaded(numberOfEbiGaChecks, numberOfEbiGaChecksLimit) {
  function ebiGaCheck() {
    numberOfEbiGaChecks++;
    try {
      /**
       * If successful we append `.google-analytics-loaded` to the `body` tag.
       */
      if (ga && ga.loaded) {
        jQuery('body').addClass('google-analytics-loaded'); // Confirm GA is loaded, add a class if found
        ebiGaInit();
      } else {
        if (numberOfEbiGaChecks <= numberOfEbiGaChecksLimit) {
          setTimeout(ebiGaCheck, 900); // give a second check if GA was slow to load
        }
      }
    } catch (err) {
      if (numberOfEbiGaChecks <= numberOfEbiGaChecksLimit) {
        setTimeout(ebiGaCheck, 900); // give a second check if GA was slow to load
      }
    }
  }
  ebiGaCheck(); // invoke analytics check
}
ebiGaIndicateLoaded(0,2);

/**
 * Utility method to get the last in an array
 * @returns {var} the last item in the array
 * @example linkName = jQuery(actedOnItem).attr('src').split('/').ebiLast();
 */
if (!Array.prototype.ebiLast){
  Array.prototype.ebiLast = function(){
    return this[this.length - 1];
  };
};

/**
 * Track the last time an event was sent (don't double send)
 * @param {Date} lastGaEventTime
 */
var lastGaEventTime = Date.now();

/**
 * Analytics tracking
 * ---
 * This code tracks the user's clicks in various parts of the EBI site and logs them as GA events.<br/>
 * Links in non-generic regions can be tracked by adding '.track-with-analytics-events' to a parent div. Careful with the scoping.
 *
 * Dev note:
 * add class verbose-analytics to your body for a readout to console on clicks, a la: <br/>
 * `jQuery('body').addClass('verbose-analytics');`
 * @param {element} actedOnItem
 * @param {string} parentContainer Event group
 * @param {string} customEventName Event action
 * @example
 * jQuery("body.google-analytics-loaded .analytics-content-footer").on('mousedown', 'a, button', function(e) {
 *   analyticsTrackInteraction(e.target,'Content footer');
 * });
 */
function analyticsTrackInteraction(actedOnItem, parentContainer, customEventName) {
  var customEventName = customEventName || []; // you can pass some custom text as a 3rd param

  if (customEventName.length > 0) {
    linkName = customEventName;
  } else { // then derive a value
    var linkName = jQuery(actedOnItem).text().toString();
    // if there's no text, it's probably and image
    if (linkName.length == 0 && jQuery(actedOnItem).attr('src')) linkName = jQuery(actedOnItem).attr('src').split('/').ebiLast();
    if (linkName.length == 0 && jQuery(actedOnItem).val()) linkName = jQuery(actedOnItem).val();

    // special things for gloabl search box
    if (parentContainer == 'Global search') {
      linkName = 'query: ' + jQuery('#global-search input#query').val();
    }
  }

  // send to GA
  // Only if more than 100ms has past since last click.<br/>
  // Due to our structure, we fire multiple events, so we only send to GA the most specific event resolution
  if ((Date.now() - lastGaEventTime) > 150) {
    ga && ga('send', 'event', 'UI', 'UI Element / ' + parentContainer, linkName);
    lastGaEventTime = Date.now();

    // conditional logging
    if (jQuery('body').hasClass('verbose-analytics')) {
      console.log('%c Verbose analytics on ', 'color: #FFF; background: #111; font-size: .75rem;');
      console.log('clicked on: %o ',actedOnItem);
      console.log('sent to GA: ', 'event ->', 'UI ->', 'UI Element / ' + parentContainer + ' ->', linkName, '; at: ',lastGaEventTime);
    }
  }
} // END analyticsTrackInteraction

/**
 * If GA is found, we initialise the tracking of various default areas
 * Note
 * ----
 * This could be done more efficently with a general capture of links,
 * but we're running against the page's unload -- so speed over elegance.
 */
function ebiGaInit() {
  // Order these by specificity -- only the first invoked will be sent to GA
  jQuery("body.google-analytics-loaded .track-with-analytics-events a").on('mousedown', function(e) {
    analyticsTrackInteraction(e.target,'Manually tracked area');
  });
  jQuery("body.google-analytics-loaded .masthead-black-bar").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Black bar');
  });
  jQuery("body.google-analytics-loaded .masthead").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Masthead');
  });
  jQuery("body.google-analytics-loaded .related ul").on('mousedown', 'li > a', function(e) {
    analyticsTrackInteraction(e.target,'Popular');
  });
  jQuery("body.google-analytics-loaded .with-overlay").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Highlight box');
  });
  jQuery("body.google-analytics-loaded #global-footer").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Footer');
  });
  jQuery("body.google-analytics-loaded #global-search").on('mousedown', 'input', function(e) {
    analyticsTrackInteraction(e.target,'Global search');
  });
  jQuery("body.google-analytics-loaded #local-search").on('mousedown', 'input', function(e) {
    analyticsTrackInteraction(e.target,'Local search');
  });
  jQuery("body.google-analytics-loaded .analytics-content-intro, body.google-analytics-loaded .intro-unit").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Intro');
  });
  jQuery("body.google-analytics-loaded .analytics-content-sidebar").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Sidebar');
  });
  jQuery("body.google-analytics-loaded .analytics-content-left").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Left content');
  });
  jQuery("body.google-analytics-loaded .analytics-content-right").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Right content');
  });
  jQuery("body.google-analytics-loaded .analytics-content-footer").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Content footer');
  });

  // catch all -- should come last
  jQuery("body.google-analytics-loaded #main-content-area, body.google-analytics-loaded .analytics-content-main").on('mousedown', 'a, button', function(e) {
    analyticsTrackInteraction(e.target,'Main content');
  });

  // todo: homepage search return
  // $('textarea').bind("enterKey",function(e){
  //    //do stuff here
  // });
  // $('textarea').keyup(function(e){
  //     if(e.keyCode == 13)
  //     {
  //         $(this).trigger("enterKey");
  //     }
  // });

  // To do: track livefilter
  // input.filter[type="text"]').on("keyup", function() {

  // log control+f and command+f
  // base method via http://stackoverflow.com/a/6680403
  var keydown = null;
  if (jQuery('body').hasClass('google-analytics-loaded')) {
    jQuery(window).keydown(function(e) {
      // the user does ctrl+f action
      if ( ( e.keyCode == 70 && ( e.ctrlKey || e.metaKey ) ) ||
         ( e.keyCode == 191 ) ) {
        keydown = new Date().getTime();
      }
      return true;
    }).blur(function() {
      // and then browser window blurs, indicating shift to UI
      if ( keydown !== null ) {
        var delta = new Date().getTime() - keydown;
        if ( delta > 0 && delta < 1000 ) {
          ga && ga('send', 'event', 'UI', 'UI Element / Keyboard', 'Browser in page search');
        }
        keydown = null;
      }
    });
  }
} // END ebiGaInit

/**
 * Programatically open external links in new tabs
 * @param {element} parent scope
 */
function addBlankTargetToExternalLinkEBI(parent) {
  (function($) {
    var parent = parent || '#content';
    $(parent + ' a').filter(function() {
       return this.hostname && this.hostname !== location.hostname;
    }).attr('target','_blank');
  }(jQuery));
}

/**
 * Programatically add '.external' to external links
 * @param {element} parent scope
 */
function addExternalToBlankWindowLinksEBI(parent) {
  (function($) {
    var parent = parent || '#content';
    $(parent + ' a[target="_blank"]').addClass('external');
  }(jQuery));
}


// Foundation specific extensions of functionality
// -------------

/**
 * Activate EMBL dropdown menu
 * ---
 * Note: the menu content has already been added in `script.js` <br/>
 * If you pass options as 'reInit', it will destory any existing menu and add a new one.
 * @param {string} options reInit
 */
function activateEMBLdropdown(options) {
  (function($) {
    var options = options || '',
        dropDownOptions = {closeOnClick: true};

    if (options == 'reInit') {
      // try to destory any existing menu
      try {
        $('#embl-dropdown').foundation('close');
        $('#embl-dropdown').foundation('destroy');
      }
      catch(err) {
        // silently fail
      };
      // bootstrap the menu
      ebiFrameworkInsertEMBLdropdown(); // re-insert menu
      activateEMBLdropdown(); // activate this
    } else {
      // we assume we're bootstraping the dropdown fresh
      setTimeout(function() { // A small buffer incase scripts are loaded out of order
        try {
          var dropdownEbiMenu = new Foundation.Dropdown($('#embl-dropdown'), dropDownOptions);
        }
        catch(err) {
          // silently fail
        };
      }, 200);
    }
  }(jQuery));
} // END activateEMBLdropdown

/**
 * Smooth scroll anchor links for jQuery users
 */
function smoothScrollAnchorLinksEBI() {
  (function($) {
    function ebiSmoothScroll(hash) {
      var target = $(hash),
          targetName = hash;
      target = target.length ? target : $('[name=' + targetName.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 50
        }, {
          duration: 1000,
          complete: function(){ window.location.hash = targetName; }
        });
        return false;
      }
    }

    // if there's an active anchor in the url, scroll to it
    if (window.location.hash.length > 0) {
      ebiSmoothScroll(window.location.hash);
    }

    // handle clicks within the domain
    $('a[href*=\\#]:not([href=\\#])').on('click', function() {
      // Table compatibility
      if ($(this).parent().parent().hasClass('tabs')) {
        return true; //exit
      }
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        ebiSmoothScroll(this.hash);
      }
    });
  }(jQuery));
} // END smoothScrollAnchorLinksEBI

/**
 * Make the local nav menu responsive to the browser window width
 */
function invokeResponsiveMenuEBI() {
  (function($) {
    // Create a dynamic height for the menu bar when stuck
    // -----------
    var desiredStuckMenuHeight = $('.masthead-inner').outerHeight() - $('.masthead-inner > nav > ul.menu').outerHeight();
    $("<style id='dynamic-stuck-height' type='text/css'> .masthead.sticky.is-stuck{ margin-top: -" + desiredStuckMenuHeight + "px !important;} </style>").appendTo("body");

    // Clone the local menu into a mobile-only menu
    // -----------
    var localMenuClass = '.masthead-inner > nav > ul.dropdown.menu.float-left';

    // Does the local men exist?
    if ($(localMenuClass).length > 0) {
      // var localMenuClass = '#secondary-menu-links'; // for testing
      // $(localMenuClass).addClass('dropdown'); // for testing
      var localMenuLeftPadding = parseInt($('.masthead-inner > nav ul').css('padding-left')); // account for padding of ul
      var localMenuWidthAvail = $('.masthead-inner > nav').innerWidth() - localMenuLeftPadding;

      function localNavSpilloverMenu(changeDirection) {
        var localMenuWidthUsed = 0; // Track how much space is occupied by the ul
        var localMenuRightSideWidth = $('.masthead-inner > nav ul.float-right.menu').outerWidth(); // width of any right-side nav, which would change on browser resize
        localMenuRightSideWidth = localMenuRightSideWidth + 1; // padding, eleminate NaN if it doesn't exsist

        // Calculate how much space we've used
        // We calculate each li and not the parent ul as some teams may make the ul 100% wide
        $(localMenuClass+' > li:not(".bug-fix-placeholder")').each( function() {
          localMenuWidthUsed = localMenuWidthUsed + $(this).outerWidth();
        });

        // Account for any float-right menu
        localMenuWidthUsed = localMenuWidthUsed + localMenuRightSideWidth;

        // Create dropdown if needed
        if ($(localMenuClass + ' li.extra-items-menu').length == 0) {
          // responsiveMenuSubMenuBugFix: see https://github.com/ebiwd/EBI-Framework/issues/50
          var responsiveMenuSubMenuBugFix = '<li class="bug-fix-placeholder" style="display:none !important;"><a href="#">A workaround</a> <ul class="menu"> <li><a href="#">for a bug where the dropdown menu fails sometimes unless there are two submenus in the submenu</a></li></ul>  </li>';
          $(localMenuClass).append('<li class="extra-items-menu" style="display:none;"><a href="#">Also in this section</a><ul class="menu">'+responsiveMenuSubMenuBugFix+'</ul></li>');
          // $(localMenuClass).append('<li class="extra-items-menu" style="display:none;"><a href="#">Also in this section</a><ul class="menu"></ul></li>');
          localMenuWidthUsed = localMenuWidthUsed + $(localMenuClass + ' > li.extra-items-menu').outerWidth(); // Account for width of li.extra-items-menu
          // invoke foundation to create dropdown functionality when we add the menu
          var options = {closeOnClickInside: false, closeOnClick: false}; // Prevent a bug in foundation 6.2.4 that prevents mobile clicking :(
          var responsiveMenu = new Foundation.DropdownMenu($(localMenuClass),options);
        }

        // Do we need to make space?
        if ( (changeDirection == 'init') || (changeDirection == 'decrease') ) {
          if (localMenuWidthUsed > localMenuWidthAvail) {
            // show dropdown, if hidden
            if ($(localMenuClass + ' li.extra-items-menu:visible').length == 0) {
              $(localMenuClass + ' li.extra-items-menu').show();
            }

            // loop through each menu item in reverse, and slice off the first as it's the dropdown
            $($(localMenuClass+' > li').get().reverse().slice(1)).each( function() {
              if (localMenuWidthUsed > localMenuWidthAvail) { // do we need to hide more items?
                localMenuWidthUsed = localMenuWidthUsed - $(this).outerWidth();
                $(this).detach().prependTo(localMenuClass + ' > li.extra-items-menu > ul.menu');
              } // we could break when <= but this should be pretty fast
            });
          }
        }

        if (changeDirection == 'increase') {
          // does the dropdown exist?
          if ($(localMenuClass + ' li.extra-items-menu:visible').length == 1) {

            // if the menu is shorter than full width, we can perhaps restore some menu items from the dropdown
            var spaceToWorkWith = localMenuWidthAvail - localMenuWidthUsed;

            // as the dropdown menu is the width of longest menu item, it's not practical to get the length of each,
            //   so if the longest item could fit, we'll restore an item
            var spaceRequiredForFirstHiddenChild =  $(localMenuClass+' > li.extra-items-menu > ul.menu > li:first-child').outerWidth();
            while (spaceToWorkWith > spaceRequiredForFirstHiddenChild) {
              spaceToWorkWith = spaceToWorkWith - spaceRequiredForFirstHiddenChild;
              $(localMenuClass+' > li.extra-items-menu > ul.menu > li:first-child').detach().insertBefore(localMenuClass+' li.extra-items-menu');
              if ($(localMenuClass + ' > li.extra-items-menu > ul.menu > li:not(".bug-fix-placeholder")').length == 0)  {
                // if the dropdown has no visible items, hide it
                $(localMenuClass + ' li.extra-items-menu').hide();
                break;
              }
            }

            // if there's no or just one item left, see if we should not count the width of the dropdown menu
            // if ($(localMenuClass + ' li.extra-items-menu > ul > li:not(".bug-fix-placeholder")').length == 1) {
            //   spaceToWorkWith = spaceToWorkWith + $(localMenuClass + ' > li.extra-items-menu').innerWidth();
            //   if (spaceToWorkWith > spaceRequiredForFirstHiddenChild) {
            //     // ok, we should move last item up from dropdwon, this will leave us with 0 items
            //     $(localMenuClass+' > li.extra-items-menu > ul.menu > li:first-child').detach().insertBefore(localMenuClass+' li.extra-items-menu');
            //     // if the dropdown has no visible items, hide it
            //     $(localMenuClass + ' li.extra-items-menu').hide();
            //   }
            // }
          }
        }
      }

      localNavSpilloverMenu('init');
      // re-calc menus on browser change, if it affect width of localMenuWidthAvail
      $(window).resize( function() {
        var snapshot_localMenuWidthAvail = $('.masthead-inner > nav').innerWidth();
        var widthChangeAmount = snapshot_localMenuWidthAvail - localMenuWidthAvail;
        if (widthChangeAmount != 0) localMenuWidthAvail = snapshot_localMenuWidthAvail;
        // we look for changes of more than 1 to reduce jitter
        if (widthChangeAmount > 1)  localNavSpilloverMenu('increase');
        if (widthChangeAmount < -1) localNavSpilloverMenu('decrease');
      });
    }
  }(jQuery));
} // END invokeResponsiveMenuEBI

/**
 * Default invokation of foundationExtendEBI
 */
(function($) {
  // Clearable text inputs
  // via: http://stackoverflow.com/questions/6258521/clear-icon-inside-input-text
  // -------------
  function tog(v){return v?'addClass':'removeClass';}
  $(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
  }).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-25 < e.clientX-this.getBoundingClientRect().left)]('onX');
  }).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change().keyup();
  });

  $.fn.foundationExtendEBI = function() {
    // Warn if inoking this on a near-empty html page
    if (document.querySelectorAll('body *').length < 5) {
      console.warn('It looks like you\'ve called foundationExtendEBI() before your body element has been populated with content. Most likely this is as you are using a JS framework, so you might want to read the guidance at https://wwwdev.ebi.ac.uk/style-lab/websites/meta-patterns/js-frameworks.html');
    }

    // Activate EMBL dropdown menu
    activateEMBLdropdown();

    // Smooth scroll anchor links for jQuery users
    // FIXME: incompatible with routing (#functional/go) smoothScrollAnchorLinksEBI();

    // Respond the local nav to browser window width
    invokeResponsiveMenuEBI();

    // Focus searchbox on global nav button click
    // ---------
    // Ideally we would have used Foundation's "data-auto-focus", but this came after the HTML was widely circulated
    $('a[data-toggle="search-global-dropdown"]').click( function() {
      if($(this).is(':not(.hover)')) { setTimeout(function() { $('input#global-searchbox').focus() }, 100); }
    });

    // Link overlay images
    $('.with-overlay').on('click',function(e) {
      var href = $(this).find('a:first').attr('href') || '';
      if (href.length > 0) {
        window.location.href = href;
      }
    })

    // Responsive support for tables
    // ---------
    // Clone the class from a parent TH to any child TD
    $('table.responsive-table').each( function() {
      var columnsToAppend = $(this).find('th');
      for (var i = 0; i < columnsToAppend.length; i++) {
        if ($(columnsToAppend[i]).attr('class')) {
          var position = i + 1;
          $(this).find('td:nth-child('+position+')').addClass($(columnsToAppend[i]).attr('class'));
        }
      };
    });

  }

  /**
   * Allow invokation of Foundation and foundationExtendEBI with data attributes
   * ---
   * This saves the need of placing the below on your page:<br/>
   * `<script type="text/JavaScript">$(document).foundation();</script>`<br/>
   * `<script type="text/JavaScript">$(document).foundationExtendEBI();</script>`<br/>
   * Background: https://github.com/ebiwd/EBI-Framework/issues/77
   */
  var bodyData = $('body').data();
  /**
   * @example
   * <body data-foundationInvoke="document">
   */
  if (bodyData.foundationInvoke) {
    bodyData.foundationInvoke = bodyData.foundationInvoke || 'document';
    if (bodyData.foundationInvoke === 'true') bodyData.foundationInvoke = 'document';
    $(bodyData.foundationInvoke).foundation();
  }
  /**
   * @example
   * <body data-foundationExtendEBI="document">
   */
  if (bodyData.foundationExtendEBI) {
    bodyData.foundationExtendEBI = bodyData.foundationExtendEBI || 'document';
    if (bodyData.foundationExtendEBI === 'true') bodyData.foundationExtendEBI = 'document';
    $(bodyData.foundationExtendEBI).foundationExtendEBI();
  }
  /**
   * @example
   * <body data-addExternal="true">
   */
  if (bodyData.addExternal) {
    addBlankTargetToExternalLinkEBI();
    addExternalToBlankWindowLinksEBI();
  }

}(jQuery));
