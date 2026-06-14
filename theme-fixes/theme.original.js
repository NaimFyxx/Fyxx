/*
@license
  Expanse by Archetype Themes (https://archetypethemes.co)
  Access unminified JS in assets/theme.js

  Use this event listener to run your own JS outside of this file.
  Documentation - https://archetypethemes.co/blogs/expanse/javascript-events-for-developers

  document.addEventListener('page:loaded', function() {
    // Page has loaded and theme assets are ready
  });
*/

if (console && console.log) {
  console.log(
    "Expanse theme (" +
      theme.settings.themeVersion +
      ") by ARCHΞTYPE | Learn more at https://archetypethemes.co"
  );
}

(function () {
  "use strict";

  if (
    window.Shopify &&
    window.Shopify.theme &&
    navigator &&
    navigator.sendBeacon &&
    window.Shopify.designMode
  ) {
    navigator.sendBeacon(
      "https://api.archetypethemes.co/api/beacon",
      new URLSearchParams({
        shop: window.Shopify.shop,
        themeName:
          window.theme &&
          window.theme.settings &&
          `${window.theme.settings.themeName} v${window.theme.settings.themeVersion}`,
        role: window.Shopify.theme.role,
        route: window.location.pathname,
        themeId: window.Shopify.theme.id,
        themeStoreId: window.Shopify.theme.theme_store_id || 0,
        isThemeEditor: !!window.Shopify.designMode,
      })
    );
  }

  /*============================================================================
    Things that don't require DOM to be ready
  ==============================================================================*/

  /*============================================================================
    Things that require DOM to be ready
  ==============================================================================*/
  function DOMready(callback) {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
  }

  DOMready(function () {
    document.dispatchEvent(new CustomEvent("page:loaded"));

    // SAMI CODE TO FIX 'See December Offers Button' BUTTON INTERACTION WITH PAFLOATER
    // Grab xmasButton from DOM and check if exists, if not return and do nothing
    const xmasButton = document.getElementById("xmasButton");
    if(!xmasButton) return;

    // Check if viewport is less than 800px (mobile typically less than 800px)
    const isMobile = window.innerWidth <= 800;

    // If isMobile is false, return and do nothing (i.e. if its a desktop, do nothing because Floater does not come up)
    if(!isMobile) return;

    // Function to update class list on xmas button based on whether the pa floater exists or not
    function updateXmasButtonClass() {
      // Get a truthy or falsy state of whether the floater exists in the DOM
      const floaterExists = !!document.getElementById("PAFloaterContainer");

      // Clean up, if for some reason the with floater or without floater clas exists, we will remove it
      xmasButton.classList.remove("--with-floater", "--without-floater");

      // Logic that adds the appropriate xmas Button class based on whether the floater exists or not
      if(floaterExists) {
        xmasButton.classList.add("--with-floater");
      } else {
        xmasButton.classList.add("--without-floater");
        }
      }


    // Call the function to check if pa floater exits and apply appropriate css class - This will only check once the page loads, the next chunk of code will check if it is added at a later time
    updateXmasButtonClass();

    // After page has loaded, if any changes to DOM, track if the changes are for PA Floater and fix button accordingly
    const observer = new MutationObserver( () => {
      console.log("Mutation Fired!")
      updateXmasButtonClass()} );

    observer.observe(document.body, {childList: true, subtree: true});

    window.updateXmasButtonClass = updateXmasButtonClass;
  });
})();
