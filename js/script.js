fetch("navbar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    highlightActiveLink();
  });

function highlightActiveLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav ul a");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();

    if (currentPath === linkPath) {
      // Add active classes
      
      link.children[0].classList.add("bg-hover", "border-white");
      link.children[0].classList.remove(
        "hover:bg-hover-50",
        "border-transparent"
      );

      // Show text if hidden
      const span = link.querySelector("span");
      if (span) {
        span.classList.remove("hidden");
        span.classList.remove("font-light");
        span.classList.add("font-semibold");
      }
    }
  });
}
