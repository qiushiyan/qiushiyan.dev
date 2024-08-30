const regex = /\/posts\/([^\/]+)\//;

document.addEventListener("DOMContentLoaded", () => {
	// document
	// 	.querySelectorAll(".quarto-post .body h3.listing-title")
	// 	.forEach((el, index) => {
	// 		const link = el.querySelector("a");
	// 		const match = link.dataset.originalHref.match(regex);
	// 		console.log(link, match[1]);

	// 		el.style["view-transition-name"] = `post-title-${match[1]}`;
	// 	});

	document
		.querySelectorAll(".quarto-post .body h3.listing-title a")
		.forEach((el, index) => {
			el.addEventListener("click", (e) => {
				e.preventDefault();
				const match = el.dataset.originalHref.match(regex);

				el.style["view-transition-name"] = "post-title";

				window.location.href = el.href;
			});
		});
});
