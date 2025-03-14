document.addEventListener("DOMContentLoaded", function () {
    // Check if we are on the home page
    if (window.location.pathname === "/" || window.location.pathname.endsWith("index.html")) {
        document.querySelectorAll(".md-nav__toggle").forEach((el) => {
            el.checked = true; // Expand all categories
        });
    }
});
