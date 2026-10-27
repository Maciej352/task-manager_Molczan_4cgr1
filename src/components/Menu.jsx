import { useEffect, useRef, useState } from "react";
import $ from "jquery";

if ($ && $.Tween && $.Tween.propHooks && !$.Tween.propHooks.backgroundColor) {
    const parseColor = (color) => {
        if (!color) return [40, 82, 88];
        if (color.startsWith("#")) {
            let hex = color.slice(1);
            if (hex.length === 3) {
                hex = hex.split("").map((c) => c + c).join("");
            }
            const num = parseInt(hex, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
        }
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
            return [parseInt(match[0], 10), parseInt(match[1], 10), parseInt(match[2], 10)];
        }
        return [40, 82, 88];
    };

    $.Tween.propHooks.backgroundColor = {
        get: function (tween) {
            return $(tween.elem).css("backgroundColor");
        },
        set: function (tween) {
            if (!tween.startColor) {
                const current = $(tween.elem).css("backgroundColor") || "#285258";
                tween.startColor = parseColor(current);
                tween.endColor = parseColor(tween.end);
            }
            const pos = tween.pos;
            const r = Math.round(tween.startColor[0] + (tween.endColor[0] - tween.startColor[0]) * pos);
            const g = Math.round(tween.startColor[1] + (tween.endColor[1] - tween.startColor[1]) * pos);
            const b = Math.round(tween.startColor[2] + (tween.endColor[2] - tween.startColor[2]) * pos);
            tween.elem.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
    };
}

function Menu() {
    const zadaniaRef = useRef(null);
    const ustawieniaRef = useRef(null);
    const pomocRef = useRef(null);
    const instrukcjaRef = useRef(null);
    const menuRef = useRef(null);
    const kontenerRef = useRef(null);

    const [otwarteMenu, setOtwarteMenu] = useState(null);

    useEffect(() => {
        const $zadania = $(zadaniaRef.current);
        const $ustawienia = $(ustawieniaRef.current);
        const $pomoc = $(pomocRef.current);

        $zadania.stop(true, true);
        $ustawienia.stop(true, true);
        $pomoc.stop(true, true);

        if (otwarteMenu === "zadania") {
            $zadania.slideDown(300);
            $ustawienia.slideUp(300);
            $pomoc.slideUp(300);
        } else if (otwarteMenu === "ustawienia") {
            $ustawienia.slideDown(300);
            $zadania.slideUp(300);
            $pomoc.slideUp(300);
        } else if (otwarteMenu === "pomoc") {
            $pomoc.slideDown(300);
            $zadania.slideUp(300);
            $ustawienia.slideUp(300);
        } else {
            $zadania.slideUp(300);
            $ustawienia.slideUp(300);
            $pomoc.slideUp(300);
        }

        return () => {
            $zadania.stop(true, true);
            $ustawienia.stop(true, true);
            $pomoc.stop(true, true);
        };
    }, [otwarteMenu]);

    useEffect(() => {
        const $root = $(kontenerRef.current);
        const $przyciski = $root.find("button");

        const handleMouseEnter = function () {
            $(this).stop(true, false).animate({
                backgroundColor: "#456456",
                opacity: 0.85
            }, 200);
        };

        const handleMouseLeave = function () {
            $(this).stop(true, false).animate({
                backgroundColor: "#285258",
                opacity: 1
            }, 200);
        };

        $przyciski.on("mouseenter", handleMouseEnter);
        $przyciski.on("mouseleave", handleMouseLeave);

        return () => {
            $przyciski.off("mouseenter", handleMouseEnter);
            $przyciski.off("mouseleave", handleMouseLeave);
            $przyciski.stop(true, true);
        };
    }, []);

    const przelaczMenu = (nazwa) => {
        setOtwarteMenu((poprzednie) =>
            poprzednie === nazwa ? null : nazwa
        );
    };

    useEffect(() => {
        const kliknieciePozaMenu = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target)
            ){
                setOtwarteMenu(null);
            }
        };
        document.addEventListener("pointerdown", kliknieciePozaMenu);
        return () => {
            document.removeEventListener("pointerdown", kliknieciePozaMenu);
        };
    }, []);

    const pokazInstrukcje = () => {
        const $instrukcja = $(instrukcjaRef.current);
        $instrukcja.stop(true, true).slideDown(400);
    };

    const zamknijInstrukcje = () => {
        const $instrukcja = $(instrukcjaRef.current);
        $instrukcja.stop(true, true).slideUp(400);
    };

    return (
        <div ref={kontenerRef} className="menu-kontener">
            <nav ref={menuRef} className="menu" aria-label="Menu główne">
                <ul>
                    <li>
                        <button
                            type="button"
                            aria-expanded={otwarteMenu === "zadania"}
                            onClick={() => przelaczMenu("zadania")}
                        >
                            Zadania
                        </button>

                        <ul className="submenu" ref={zadaniaRef}>
                            <li>Wszystkie zadania</li>
                            <li>Dodaj zadanie</li>
                            <li>Statystyki</li>
                        </ul>
                    </li>

                    <li>
                        <button
                            type="button"
                            aria-expanded={otwarteMenu === "ustawienia"}
                            onClick={() => przelaczMenu("ustawienia")}
                        >
                            Ustawienia
                        </button>

                        <ul className="submenu" ref={ustawieniaRef}>
                            <li>Motyw aplikacji</li>
                            <li>Preferencje</li>
                        </ul>
                    </li>

                    <li>
                        <button
                            type="button"
                            aria-expanded={otwarteMenu === "pomoc"}
                            onClick={() => przelaczMenu("pomoc")}
                        >
                            Pomoc
                        </button>

                        <ul className="submenu" ref={pomocRef}>
                            <li
                                className="submenu-item"
                                role="button"
                                tabIndex={0}
                                onClick={pokazInstrukcje}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        pokazInstrukcje();
                                    }
                                }}
                            >
                                Instrukcja
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>

            <div
                ref={instrukcjaRef}
                id="panel-instrukcji"
                className="instrukcja-panel panel-instrukcji"
                style={{ display: "none" }}
            >
                <h3>Instrukcja obsługi Task Managera</h3>
                <ol>
                    <li>
                        <strong>Dodawanie zadań:</strong> Wprowadź nazwę zadania o długości od 5 do 25 znaków, wybierz priorytet (niski, średni, wysoki) oraz kategorię (szkoła, dom, praca, inne), a następnie kliknij przycisk „Dodaj”.
                    </li>
                    <li>
                        <strong>Edycja i aktualizacja zadań:</strong> Kliknij przycisk „Edytuj” obok wybranego zadania na liście, aby otworzyć okno dialogowe i podać nową treść zadania.
                    </li>
                    <li>
                        <strong>Usuwanie zadań:</strong> Użyj przycisku „Usuń” przy zadaniu, które zostało zrealizowane lub którego już nie potrzebujesz, aby natychmiast usunąć je z listy.
                    </li>
                    <li>
                        <strong>Podgląd parametrów na żywo:</strong> W dolnej sekcji formularza możesz na bieżąco monitorować status aktywności pola, aktualną liczbę znaków oraz ostrzeżenie, gdy nazwa jest za krótka.
                    </li>
                </ol>
                <button
                    type="button"
                    className="zamknij-instrukcje-btn notranslate"
                    translate="no"
                    onClick={zamknijInstrukcje}
                >
                    Zamknij instrukcję
                </button>
            </div>
        </div>
    );
}

export default Menu;