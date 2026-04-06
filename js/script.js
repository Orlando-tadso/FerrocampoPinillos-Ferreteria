document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");

    if (navToggle && nav) {
        navToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const filtroBtns = document.querySelectorAll(".filtro-btn");
    const productosCards = document.querySelectorAll(".producto-card");
    const productosRows = document.querySelectorAll(".producto-row");
    const searchInput = document.getElementById("search-input");

    let categoriaActiva = "todas";

    const normalizar = (valor) =>
        (valor || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const actualizarContador = () => {
        const visiblesCards = document.querySelectorAll(".producto-card:not(.hidden)").length;
        const visiblesRows = document.querySelectorAll(".producto-row:not(.hidden)").length;

        const grid = document.querySelector(".productos-grid");
        if (!grid) {
            return;
        }

        let contador = document.querySelector(".productos-contador");
        if (!contador) {
            contador = document.createElement("p");
            contador.className = "productos-contador";
            grid.insertAdjacentElement("afterend", contador);
        }

        const total = visiblesCards + visiblesRows;
        contador.textContent = `Mostrando ${total} producto${total !== 1 ? "s" : ""} en el catalogo.`;
    };

    const filtrarCatalogo = () => {
        const termino = normalizar(searchInput ? searchInput.value : "");

        productosCards.forEach((card) => {
            const categoria = card.getAttribute("data-categoria") || "";
            const texto = normalizar(card.textContent);
            const coincideCategoria = categoriaActiva === "todas" || categoria === categoriaActiva;
            const coincideBusqueda = !termino || texto.includes(termino);

            card.classList.toggle("hidden", !(coincideCategoria && coincideBusqueda));
        });

        productosRows.forEach((row) => {
            const categoria = row.getAttribute("data-categoria") || "";
            const texto = normalizar(row.textContent);
            const coincideCategoria = categoriaActiva === "todas" || categoria === categoriaActiva;
            const coincideBusqueda = !termino || texto.includes(termino);

            row.classList.toggle("hidden", !(coincideCategoria && coincideBusqueda));
        });

        actualizarContador();
    };

    filtroBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filtroBtns.forEach((item) => item.classList.remove("active"));
            btn.classList.add("active");
            categoriaActiva = btn.getAttribute("data-categoria") || "todas";
            filtrarCatalogo();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", filtrarCatalogo);
    }

    if (productosCards.length || productosRows.length) {
        filtrarCatalogo();
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const href = anchor.getAttribute("href") || "";
            if (href.length <= 1) {
                return;
            }
            const target = document.querySelector(href);
            if (!target) {
                return;
            }
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            });
        },
        { threshold: 0.12 }
    );

    document
        .querySelectorAll(".producto-card, .categoria-card, .caracteristica, .stat-card, .contacto-info, .welcome-card, .visual-card")
        .forEach((item) => {
            item.style.opacity = "0";
            item.style.transform = "translateY(10px)";
            item.style.transition = "opacity .45s ease, transform .45s ease";
            observer.observe(item);
        });
});
