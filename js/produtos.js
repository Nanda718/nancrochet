
/* ===== SLIDER DE PRODUTOS ===== */
const slider = document.querySelector("#produtos");

if (slider) {
    const janela = slider.querySelector(".slider-janela");
    const trilha = slider.querySelector(".slider-trilha");
    const produtos = [...slider.querySelectorAll(".produto-card")];
    const anterior = slider.querySelector(".slider-anterior");
    const proximo = slider.querySelector(".slider-proximo");
    const indicadores = slider.querySelector(".slider-indicadores");

    let indice = 0;
    let intervalo;
    let produtosVisiveis = 3;

    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function atualizarQuantidadeVisivel() {
        if (window.innerWidth <= 600) {
            produtosVisiveis = 1;
        } else if (window.innerWidth <= 900) {
            produtosVisiveis = 2;
        } else {
            produtosVisiveis = 3;
        }

        indice = Math.min(
            indice,
            Math.max(0, produtos.length - produtosVisiveis)
        );

        criarIndicadores();
        atualizarSlider();
    }

    function criarIndicadores() {
        indicadores.innerHTML = "";

        const total = Math.max(
            1,
            produtos.length - produtosVisiveis + 1
        );

        for (let i = 0; i < total; i++) {
            const botao = document.createElement("button");

            botao.type = "button";
            botao.setAttribute(
                "aria-label",
                `Mostrar grupo de produtos ${i + 1}`
            );

            botao.addEventListener("click", () => {
                indice = i;
                atualizarSlider();
                reiniciarAutomatico();
            });

            indicadores.appendChild(botao);
        }
    }

    function atualizarSlider() {
        const produto = produtos[0];

        if (!produto) return;

        const distancia = produto.getBoundingClientRect().width +
            parseFloat(getComputedStyle(trilha).gap || 0);

        trilha.style.transform =
            `translateX(-${indice * distancia}px)`;

        [...indicadores.children].forEach((botao, i) => {
            botao.classList.toggle("ativo", i === indice);

            if (i === indice) {
                botao.setAttribute("aria-current", "true");
            } else {
                botao.removeAttribute("aria-current");
            }
        });
    }

    function avancar() {
        const ultimoIndice = Math.max(
            0,
            produtos.length - produtosVisiveis
        );

        indice = indice >= ultimoIndice ? 0 : indice + 1;
        atualizarSlider();
    }

    function voltar() {
        const ultimoIndice = Math.max(
            0,
            produtos.length - produtosVisiveis
        );

        indice = indice <= 0 ? ultimoIndice : indice - 1;
        atualizarSlider();
    }

    function pararAutomatico() {
        clearInterval(intervalo);
    }

    function iniciarAutomatico() {
        pararAutomatico();

        if (
            movimentoReduzido.matches ||
            document.hidden ||
            produtos.length <= produtosVisiveis
        ) {
            return;
        }

        intervalo = setInterval(avancar, 3500);
    }

    function reiniciarAutomatico() {
        iniciarAutomatico();
    }

    anterior.addEventListener("click", () => {
        voltar();
        reiniciarAutomatico();
    });

    proximo.addEventListener("click", () => {
        avancar();
        reiniciarAutomatico();
    });

    slider.addEventListener("mouseenter", pararAutomatico);
    slider.addEventListener("mouseleave", iniciarAutomatico);

    slider.addEventListener("focusin", pararAutomatico);
    slider.addEventListener("focusout", (evento) => {
        if (!slider.contains(evento.relatedTarget)) {
            iniciarAutomatico();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pararAutomatico();
        } else {
            iniciarAutomatico();
        }
    });

    window.addEventListener("resize", atualizarQuantidadeVisivel);

    movimentoReduzido.addEventListener(
        "change",
        iniciarAutomatico
    );

    atualizarQuantidadeVisivel();
    iniciarAutomatico();
}