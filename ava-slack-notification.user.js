// ==UserScript==
// @name         Hide Cards Below 3 Minutes
// @name         AVAOverThreshold
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Esteban Reyes
// @inject-into auto
// @include        https://prod-na.ava.robotics.amazon.dev/observer?areas=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.dev
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Array to store innerHTML of group-by-station-card elements containing custom-card-issue elements
    let customCardIssues = [];

    // Function to update the customCardIssues array
    function updateCustomCardIssues() {
        // Get all elements with the class group-by-station-card
        const groupByStationCardElements = document.querySelectorAll('.group-by-station-card');
        
        // Clear the array
        customCardIssues = [];
        
        // Iterate through each group-by-station-card element
        groupByStationCardElements.forEach(element => {
            // Check if the element contains a custom-card-issue
            const customCardIssueElement = element.querySelector('.custom-card-issue');
            if (customCardIssueElement) {
                // Extract the time from the second <p> element inside .card-header
                const cardHeaderElement = customCardIssueElement.querySelector('.card-header');
                const timeElement = cardHeaderElement ? cardHeaderElement.querySelectorAll('p')[1] : null;
                const timeText = timeElement ? timeElement.textContent.trim() : "";

                // Check if the time is below 3 minutes
                const hideCard = ["Just now", /second\(s\)/i, /1 minute/i, /2 minute\(s\)/i].some(timePattern => {
                    return typeof timePattern === 'string' ? timeText === timePattern : timePattern.test(timeText);
                });

                // Show or hide the card based on the time check
                if (hideCard) {
                    element.style.display = 'none';
                } else {
                    element.style.display = '';
                }

                // Add the innerHTML of the group-by-station-card element to the array
                customCardIssues.push(element.innerHTML);
            }
        });

        // Log the array (for debugging purposes)
        console.log(customCardIssues);
    }

    // Function to initialize the script when the DOM is ready
    function main() {
        // Create a Mutation Observer to watch for changes in the DOM
        const observer = new MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    updateCustomCardIssues();
                }
            }
        });

        // Start observing the document body for added or removed nodes
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial update
        updateCustomCardIssues();
    }

    // Wait for the DOM to be fully loaded before running the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
