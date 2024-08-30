library(htmltools)
make_icon <- function(icon, text, href = "./", class_a = "about-link", class_text = "about-link-text", ...) {
    icon_name <- paste("bi", paste0("bi-", icon), sep = " ")

    tags$a(
        tags$i(
            class = icon_name,
            tags$span(
                text,
                class = class_text
            ),
        ),
        href = href,
        class = class_a,
        ...
    )
}

make_about_icon <- function(icon, text, href, ...) {
    make_icon(icon, text, href, "about-link", "about-link-text", ...)
}
