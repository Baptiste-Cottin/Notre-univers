
(() => {
    "use strict";

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    const page =
        document.body.dataset.page ||
        location.pathname.split("/").pop().replace(".html", "") ||
        "index";

    const navItems = [
        ["index.html", "Accueil"],
        ["histoire.html", "Notre histoire"],
        ["souvenirs.html", "Souvenirs"],
        ["jeux.html", "Jeux"],
        ["lettre.html", "Lettre"],
        ["secret.html", "Surprise"]
    ];

    // ==========================================
    // MENU DE NAVIGATION
    // ==========================================

    function header() {
        if ($(".site-header")) return;

        const h = document.createElement("header");
        h.className = "site-header";

        h.innerHTML = `
            <a class="logo" href="index.html">
                <span class="logo-icon">♡</span>
                <span class="logo-text">
                    <strong>Nous deux</strong>
                    <small>notre petit univers</small>
                </span>
            </a>

            <button class="menu-button"
                    aria-label="Ouvrir le menu"
                    aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav class="navigation">
                ${navItems.map(([url, label]) => `
                    <a href="${url}"
                       ${location.pathname.endsWith(url)
                           ? 'class="active" aria-current="page"'
                           : ""}>
                        ${label}
                    </a>
                `).join("")}
            </nav>
        `;

        document.body.prepend(h);
    }

    // ==========================================
    // ÉLÉMENTS COMMUNS À TOUTES LES PAGES
    // ==========================================

    function common() {
        header();

        const nav = $(".navigation");
        const toggle = $(".menu-button");

        toggle?.addEventListener("click", () => {
            const open = nav.classList.toggle("open");

            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute(
                "aria-label",
                open ? "Fermer le menu" : "Ouvrir le menu"
            );
        });

        $$(".navigation a").forEach(link => {
            link.addEventListener("click", () => {
                nav?.classList.remove("open");
                toggle?.setAttribute("aria-expanded", "false");
            });
        });

        if (!$(".footer")) {
            const footer = document.createElement("footer");
            footer.className = "footer";

            footer.innerHTML = `
                <span>Fait avec ♡, rien qu'à nous</span>
                <span>Notre petit univers · une histoire à continuer</span>
            `;

            document.body.append(footer);
        }

        const top = document.createElement("button");
        top.className = "to-top";
        top.setAttribute("aria-label", "Retour en haut");
        top.textContent = "↑";

        document.body.append(top);

        top.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        window.addEventListener("scroll", () => {
            top.classList.toggle("show", window.scrollY > 450);
        }, { passive: true });

        // Animations à l'apparition des éléments
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            $$(".reveal, .card, .timeline-item, .memory, .feature")
                .forEach(element => {
                    element.classList.add("reveal");
                    observer.observe(element);
                });
        } else {
            $$(".reveal, .card, .timeline-item, .memory, .feature")
                .forEach(element => element.classList.add("visible"));
        }

        // Petits effets décoratifs au clic
        document.addEventListener("click", event => {
            if (!event.target.closest("a, button")) return;

            const particle = document.createElement("span");
            particle.className = "heart-particle";
            particle.textContent = ["♡", "✦", "♥"][
                Math.floor(Math.random() * 3)
            ];

            particle.style.left = event.clientX + "px";
            particle.style.top = event.clientY + "px";

            document.body.append(particle);

            setTimeout(() => particle.remove(), 1300);
        });
    }

    // ==========================================
    // PAGE D'ACCUEIL
    // CORRECTION : NE PAS REMPLACER LA PHOTO !
    // ==========================================

    function home() {
        // La photo est déjà présente dans index.html.
        // On ne modifie pas .photo-placeholder :
        // cela évite que couple.png disparaisse.
    }

    // ==========================================
    // QUIZ
    // ==========================================

    const quizQuestions = [
        {
            q: "Quel est le plus beau petit détail dans une histoire à deux ?",
            a: [
                "Les petites attentions",
                "Les cadeaux obligatoires",
                "Avoir toujours raison",
                "Ne jamais se parler"
            ],
            correct: 0,
            why: "Les petites attentions rendent les journées spéciales. ♡"
        },
        {
            q: "Que peut-on mettre dans cet univers ?",
            a: [
                "Seulement des devoirs",
                "Des souvenirs et des messages",
                "Des factures uniquement",
                "Rien du tout"
            ],
            correct: 1,
            why: "C'est un petit endroit pour garder ce qui compte."
        },
        {
            q: "Quel est le but du memory ?",
            a: [
                "Finir le plus lentement possible",
                "Retourner les cartes au hasard sans regarder",
                "Retrouver toutes les paires",
                "Éviter les paires"
            ],
            correct: 2,
            why: "Observe bien les cartes et mémorise leur place !"
        },
        {
            q: "Dans le labyrinthe, comment avancer ?",
            a: [
                "Avec les flèches ou les boutons",
                "En fermant la page",
                "En cliquant sur le titre",
                "On ne peut pas bouger"
            ],
            correct: 0,
            why: "Les commandes clavier et tactiles fonctionnent toutes les deux."
        },
        {
            q: "Le meilleur souvenir à créer ?",
            a: [
                "Celui qu'on partage",
                "Celui qu'on oublie",
                "Celui qu'on ne vit pas",
                "Aucun"
            ],
            correct: 0,
            why: "Les plus beaux souvenirs sont ceux qu'on construit ensemble. ♡"
        }
    ];

    function quiz() {
        const panel = $("#quiz-panel");
        if (!panel) return;

        let index = 0;
        let score = 0;
        let answered = false;

        function render() {
            answered = false;

            const question = quizQuestions[index];

            panel.innerHTML = `
                <div class="panel-top">
                    <div>
                        <span class="pill">
                            Question ${index + 1} / ${quizQuestions.length}
                        </span>
                        <h2 style="margin-top:12px">Le quiz ♡</h2>
                        <p>Un petit défi, juste pour le plaisir.</p>
                    </div>
                    <span class="pill">Score : ${score}</span>
                </div>

                <div class="progress">
                    <span style="width:${index / quizQuestions.length * 100}%"></span>
                </div>

                <div class="question">${question.q}</div>

                <div class="answers">
                    ${question.a.map((answer, number) => `
                        <button class="answer" data-answer="${number}">
                            ${String.fromCharCode(65 + number)}. ${answer}
                        </button>
                    `).join("")}
                </div>

                <p class="feedback" id="quiz-feedback" aria-live="polite">
                    Choisis une réponse.
                </p>

                <div class="game-actions">
                    <span class="pill">
                        ${Math.round(index / quizQuestions.length * 100)}% parcouru
                    </span>
                    <button class="btn btn-primary" id="quiz-next" disabled>
                        ${index === quizQuestions.length - 1
                            ? "Voir mon résultat"
                            : "Question suivante"} →
                    </button>
                </div>
            `;

            $$("[data-answer]", panel).forEach(button => {
                button.addEventListener("click", () => {
                    if (answered) return;

                    answered = true;

                    const number = Number(button.dataset.answer);
                    const correct = number === question.correct;

                    if (correct) score++;

                    $$("[data-answer]", panel).forEach((answer, i) => {
                        answer.disabled = true;

                        if (i === question.correct) {
                            answer.classList.add("correct");
                        } else if (i === number) {
                            answer.classList.add("wrong");
                        }
                    });

                    $("#quiz-feedback", panel).textContent =
                        (correct ? "Bravo ! " : "Pas tout à fait. ") +
                        question.why;

                    const next = $("#quiz-next", panel);
                    next.disabled = false;
                    next.textContent =
                        index === quizQuestions.length - 1
                            ? "Voir mon résultat"
                            : "Continuer →";
                });
            });

            $("#quiz-next", panel).addEventListener("click", () => {
                if (!answered) return;

                index++;

                if (index < quizQuestions.length) {
                    render();
                } else {
                    result();
                }
            });
        }

        function result() {
            const percentage = score / quizQuestions.length;

            panel.innerHTML = `
                <div class="score-card">
                    <div class="score-emoji">
                        ${percentage >= 0.8 ? "💖" : percentage >= 0.5 ? "🌷" : "✨"}
                    </div>

                    <span class="pill">Quiz terminé</span>

                    <h2 style="margin:16px 0">
                        Tu as obtenu ${score} / ${quizQuestions.length}
                    </h2>

                    <p class="lead" style="margin:0 auto 24px">
                        ${percentage >= 0.8
                            ? "Un sans-faute presque parfait ! Tu as l'esprit joueur."
                            : percentage >= 0.5
                                ? "Bien joué ! Tu as déjà de bons réflexes."
                                : "Ce n'est que le début : tu peux retenter ta chance."}
                    </p>

                    <button class="btn btn-primary" id="quiz-restart">
                        Rejouer ↻
                    </button>

                    <a class="btn btn-light" href="jeux.html">
                        Retour aux jeux
                    </a>
                </div>
            `;

            $("#quiz-restart", panel).addEventListener("click", () => {
                index = 0;
                score = 0;
                render();
            });
        }

        render();
    }

    // ==========================================
    // MEMORY
    // ==========================================

    function memory() {
        const panel = $("#memory-panel");
        if (!panel) return;

        let first = null;
        let locked = false;
        let moves = 0;
        let matches = 0;
        let timer = null;
        let seconds = 0;

        const faces = [
            "🌷", "💌", "🌙", "🧸",
            "🍓", "✨", "🎀", "🦋"
        ];

        function formatTime(value) {
            return (
                String(Math.floor(value / 60)).padStart(2, "0") +
                ":" +
                String(value % 60).padStart(2, "0")
            );
        }

        function start() {
            clearInterval(timer);

            first = null;
            locked = false;
            moves = 0;
            matches = 0;
            seconds = 0;

            const cards = [...faces, ...faces]
                .sort(() => Math.random() - 0.5);

            panel.innerHTML = `
                <div class="panel-top">
                    <div>
                        <span class="pill">Memory des souvenirs</span>
                        <h2 style="margin-top:12px">Retrouve les paires</h2>
                        <p>Retourne deux cartes à la fois et mémorise leurs positions.</p>
                    </div>
                    <button class="btn btn-light" id="memory-reset">
                        Recommencer ↻
                    </button>
                </div>

                <div class="game-actions">
                    <span class="pill">Coups : <b id="moves">0</b></span>
                    <span class="pill">
                        Paires : <b id="pairs">0</b> / ${faces.length}
                    </span>
                    <span class="pill">Temps : <b id="clock">00:00</b></span>
                </div>

                <div class="memory-board">
                    ${cards.map((face, number) => `
                        <button class="memory-card"
                                data-index="${number}"
                                data-face="${face}"
                                aria-label="Carte cachée">
                            <span>${face}</span>
                        </button>
                    `).join("")}
                </div>

                <p class="feedback" id="memory-feedback" aria-live="polite">
                    Trouve les ${faces.length} paires !
                </p>
            `;

            $("#memory-reset", panel).addEventListener("click", start);

            timer = setInterval(() => {
                seconds++;

                const clock = $("#clock", panel);
                if (clock) clock.textContent = formatTime(seconds);
            }, 1000);

            $$(".memory-card", panel).forEach(card => {
                card.addEventListener("click", () => {
                    if (
                        locked ||
                        card.classList.contains("matched") ||
                        card === first ||
                        card.classList.contains("flipped")
                    ) return;

                    card.classList.add("flipped");
                    card.setAttribute("aria-label", card.dataset.face);

                    if (!first) {
                        first = card;
                        return;
                    }

                    moves++;
                    $("#moves", panel).textContent = moves;

                    const a = first;
                    const b = card;

                    if (a.dataset.face === b.dataset.face) {
                        a.classList.add("matched");
                        b.classList.add("matched");

                        a.disabled = true;
                        b.disabled = true;

                        matches++;
                        $("#pairs", panel).textContent = matches;

                        first = null;

                        if (matches === faces.length) {
                            clearInterval(timer);

                            $("#memory-feedback", panel).innerHTML = `
                                🎉 Toutes les paires en ${moves} coups
                                et ${formatTime(seconds)} !<br>
                                <button class="btn btn-primary"
                                        id="memory-again"
                                        style="margin-top:14px">
                                    Rejouer
                                </button>
                            `;

                            $("#memory-again", panel)
                                .addEventListener("click", start);
                        }
                    } else {
                        locked = true;

                        setTimeout(() => {
                            a.classList.remove("flipped");
                            b.classList.remove("flipped");

                            a.setAttribute("aria-label", "Carte cachée");
                            b.setAttribute("aria-label", "Carte cachée");

                            first = null;
                            locked = false;
                        }, 850);
                    }
                });
            });
        }

        start();
    }

    // ==========================================
    // LABYRINTHE
    // ==========================================

    const mazeMap = [
        "###########",
        "#S#.......#",
        "#.#.#####.#",
        "#...#...#.#",
        "###.#.#.#.#",
        "#...#.#...#",
        "#.###.###.#",
        "#.....#...#",
        "#.#####.###",
        "#.........G",
        "###########"
    ];

    function maze() {
        const panel = $("#maze-panel");
        if (!panel) return;

        let x = 1;
        let y = 1;
        let moves = 0;
        let won = false;

        function draw() {
            panel.innerHTML = `
                <div class="panel-top">
                    <div>
                        <span class="pill">Labyrinthe · niveau 1</span>
                        <h2 style="margin-top:12px">Trouve ton chemin ♡</h2>
                        <p>Atteins le cœur doré sans traverser les murs.</p>
                    </div>
                    <button class="btn btn-light" id="maze-reset">
                        Recommencer ↻
                    </button>
                </div>

                <div class="maze-wrap">
                    <div class="maze-grid" role="grid" aria-label="Labyrinthe">
                        ${mazeMap.map((row, yy) =>
                            row.split("").map((cell, xx) => {
                                const player = xx === x && yy === y;
                                const goal = cell === "G";
                                const wall = cell === "#";

                                return `
                                    <div class="maze-cell
                                        ${wall ? "wall" : ""}
                                        ${player ? "player" : ""}
                                        ${goal ? "goal" : ""}"
                                        role="gridcell">
                                        ${player ? "🩷" : goal ? "💖" : ""}
                                    </div>
                                `;
                            }).join("")
                        ).join("")}
                    </div>

                    <aside class="maze-side">
                        <span class="pill">Ta progression</span>
                        <br>
                        <strong>${moves} pas</strong>
                        <p>
                            Déplace-toi avec les flèches du clavier
                            ou les boutons. Chaque mouvement compte.
                        </p>

                        <div class="maze-controls">
                            <button class="up" data-dx="0" data-dy="-1"
                                    aria-label="Haut">↑</button>
                            <button class="left" data-dx="-1" data-dy="0"
                                    aria-label="Gauche">←</button>
                            <button class="down" data-dx="0" data-dy="1"
                                    aria-label="Bas">↓</button>
                            <button class="right" data-dx="1" data-dy="0"
                                    aria-label="Droite">→</button>
                        </div>

                        <p class="feedback" id="maze-feedback" aria-live="polite">
                            ${won
                                ? "Tu as trouvé le cœur !"
                                : "Cherche le chemin jusqu'au 💖."}
                        </p>
                    </aside>
                </div>
            `;

            $("#maze-reset", panel).addEventListener("click", reset);

            $$("[data-dx]", panel).forEach(button => {
                button.addEventListener("click", () => {
                    move(
                        Number(button.dataset.dx),
                        Number(button.dataset.dy)
                    );
                });
            });
        }

        function reset() {
            x = 1;
            y = 1;
            moves = 0;
            won = false;
            draw();
        }

        function move(dx, dy) {
            if (won) return;

            const nx = x + dx;
            const ny = y + dy;

            if (
                ny < 0 ||
                ny >= mazeMap.length ||
                nx < 0 ||
                nx >= mazeMap[ny].length ||
                mazeMap[ny][nx] === "#"
            ) return;

            x = nx;
            y = ny;
            moves++;

            if (mazeMap[y][x] === "G") {
                won = true;
            }

            draw();

            if (won) {
                $("#maze-feedback", panel).textContent =
                    `Bravo ! Tu as trouvé le cœur en ${moves} pas. 💖`;

                $("#maze-feedback", panel).insertAdjacentHTML(
                    "beforeend",
                    '<br><button class="btn btn-primary" id="maze-again" style="margin-top:10px">Rejouer</button>'
                );

                $("#maze-again", panel).addEventListener("click", reset);
            }
        }

        function key(event) {
            if (!$("#maze-panel")) return;

            const directions = {
                ArrowUp: [0, -1],
                ArrowDown: [0, 1],
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                w: [0, -1],
                s: [0, 1],
                a: [-1, 0],
                d: [1, 0]
            };

            if (directions[event.key]) {
                event.preventDefault();
                move(...directions[event.key]);
            }
        }

        window.addEventListener("keydown", key);
        draw();
    }

    // ==========================================
    // PAGE DES JEUX
    // ==========================================

    function gamesHub() {
        const buttons = {
            "quiz-start": () => showGame("quiz"),
            "memory-start": () => showGame("memory"),
            "maze-start": () => showGame("maze")
        };

        Object.entries(buttons).forEach(([id, action]) => {
            $("#" + id)?.addEventListener("click", action);
        });

        function showGame(which) {
            const area = $("#game-area");
            if (!area) return;

            area.hidden = false;

            if (which === "quiz") {
                area.innerHTML = '<div id="quiz-panel" class="game-panel"></div>';
            } else if (which === "memory") {
                area.innerHTML = '<div id="memory-panel" class="game-panel"></div>';
            } else {
                area.innerHTML = '<div id="maze-panel" class="game-panel"></div>';
            }

            const games = { quiz, memory, maze };
            games[which]();

            area.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    // ==========================================
    // INITIALISATION
    // ==========================================

    document.addEventListener("DOMContentLoaded", () => {
        common();

        if (page === "index") {
            home();
        }

        quiz();
        memory();
        maze();
        gamesHub();
    });

})();
