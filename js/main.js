// -----------------------------------------------------------------------------
// This file includes deliberate formatting errors in order for you to verify
// that ESLint and EditorConfig are working properly. If both tools are, indeed,
// working correctly, then you’d see errors in your editor about indentation and
// improper use of footmarks instead of back ticks. When you save this file,
// your editor should strip all excess newlines and whitespace characters from
// the file. If both of these events occur, then ESLint and EditorConfig are
// working correctly.
//
// DON’T PROCEED UNTIL YOU’RE SURE ESLINT AND EDITORCONFIG ARE WORKING CORRECTLY
// -----------------------------------------------------------------------------
"use strict";

// Dynamically loading data.json
// Was wrapped as JSONP
let jsonpScript = document.createElement(`script`);
jsonpScript.src = `json/data.json`;
document.body.appendChild(jsonpScript);

// Global callback function for JSONP
window.albumData = (albumsData) => {
    // Storing albums array and current index
    let albums = albumsData;
    let currentIndex = 0;

    // Selecting the container for the slides from index.html file
    const slidesContainer = document.querySelector(`.carousel-slides`);

    // Function to render the slides based on the given index
    const renderSlide = (index) => {
        let album = albums[index];
        // Building the HTML for a single slide using backticks for string interpolation
        let slideHTML = `
        <div class="slide">
            <h2>${album.artist}</h2>
            <p><strong>${album.album}</strong></p>
            <img src="${album.cover_image.path}" alt="${album.artist} Album Cover">
            <p>${album.review.content}</p>
            <a href="${album.review.url}" target="_blank">Read More</a>
        </div>
    `;
        slidesContainer.innerHTML = slideHTML;
    };

    // Initial render: show the first album
    renderSlide(currentIndex);

    // Adding event listeners for the navigation arrows inside .carousel-navigation
    const navLinks = document.querySelectorAll(`.carousel-navigation a`);
    // Assume the first <a> is the left arrow, second is the right arrow
    const prevLink = navLinks[0];
    const nextLink = navLinks[1];

    // On clicking the previous arrow, decrease the index (wrap around if needed)
    prevLink.addEventListener(`click`, (e) => {
        e.preventDefault(); // Prevent default link behavior
        currentIndex = (currentIndex - 1 + albums.length) % albums.length;
        renderSlide(currentIndex);
    });

    // On clicking the next arrow, increase the index (wrap around if needed)
    nextLink.addEventListener(`click`, (e) => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % albums.length;
        renderSlide(currentIndex);
    });
};











