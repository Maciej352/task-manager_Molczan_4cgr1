import { useCallback, useEffect, useRef, useState } from "react";
import $ from "jquery";

const ZDJECIA = [
    { id: 1, src: "/zdjecia/1.jpg", tytul: "Górska chata nad jeziorem", kategoria: "gory" },
    { id: 2, src: "/zdjecia/2.jpg", tytul: "Klifowy zachód słońca", kategoria: "morze" },
    { id: 3, src: "/zdjecia/3.jpg", tytul: "Alpejska łąka z kwiatami", kategoria: "gory" },
    { id: 4, src: "/zdjecia/4.jpg", tytul: "Śródziemnomorskie wybrzeże", kategoria: "morze" },
    { id: 5, src: "/zdjecia/5.jpg", tytul: "Odbicie chmur w oceanie", kategoria: "niebo" },
    { id: 6, src: "/zdjecia/6.jpg", tytul: "Drzewo o zachodzie słońca", kategoria: "niebo" },
    { id: 7, src: "/zdjecia/7.jpg", tytul: "Dolina górska w słońcu", kategoria: "gory" },
    { id: 8, src: "/zdjecia/8.png", tytul: "Błękitne pasmo górskie", kategoria: "gory" },
    { id: 9, src: "/zdjecia/9.jpg", tytul: "Morska zatoka o poranku", kategoria: "morze" },
    { id: 10, src: "/zdjecia/10.webp", tytul: "Spokojna tafla jeziora", kategoria: "morze" },
    { id: 11, src: "/zdjecia/11.png", tytul: "Malowniczy szczyt górski", kategoria: "gory" },
    { id: 12, src: "/zdjecia/12.jpg", tytul: "Lazurowe wybrzeże", kategoria: "morze" },
    { id: 13, src: "/zdjecia/13.png", tytul: "Złota godzina nad wodą", kategoria: "niebo" },
    { id: 14, src: "/zdjecia/14.jpg", tytul: "Piaszczysta plaża", kategoria: "morze" },
    { id: 15, src: "/zdjecia/15.jpg", tytul: "Górski potok w lesie", kategoria: "gory" },
    { id: 16, src: "/zdjecia/16.jpg", tytul: "Ognisty zachód nad horyzontem", kategoria: "niebo" },
    { id: 17, src: "/zdjecia/17.jpg", tytul: "Skaliste wybrzeże oceanu", kategoria: "morze" },
    { id: 18, src: "/zdjecia/18.jpg", tytul: "Różowe chmury o zmierzchu", kategoria: "niebo" },
    { id: 19, src: "/zdjecia/19.jpg", tytul: "Śnieżne szczyty o świcie", kategoria: "gory" },
    { id: 20, src: "/zdjecia/20.jpg", tytul: "Ciche niebo nad jeziorem", kategoria: "niebo" }
];

const KATEGORIE = [
    { klucz: "wszystkie", nazwa: "Wszystkie (20)" },
    { klucz: "gory", nazwa: "Góry i Las (7)" },
    { klucz: "morze", nazwa: "Morze i Woda (7)" },
    { klucz: "niebo", nazwa: "Niebo i Zachody (6)" }
];

function Banner() {
    const bannerRef = useRef(null);
    const modalRef = useRef(null);
    const modalImgRef = useRef(null);

    const [wybranaKategoria, setWybranaKategoria] = useState("wszystkie");
    const [indeksZdjecia, setIndeksZdjecia] = useState(null);
    const [autoodtwarzanie, setAutoodtwarzanie] = useState(false);

    const przefiltrowaneZdjecia = wybranaKategoria === "wszystkie"
        ? ZDJECIA
        : ZDJECIA.filter((z) => z.kategoria === wybranaKategoria);

    useEffect(() => {
        const $banner = $(bannerRef.current);
        $banner.hide().fadeIn(1500);
        return () => {
            $banner.stop(true, true);
        };
    }, []);

    const otworzZdjecie = (indeks) => {
        setIndeksZdjecia(indeks);
        const $modal = $(modalRef.current);
        $modal.stop(true, true).css("display", "flex").hide().fadeIn(400);
    };

    const zamknijModal = useCallback(() => {
        setAutoodtwarzanie(false);
        const $modal = $(modalRef.current);
        $modal.stop(true, true).fadeOut(400, () => {
            setIndeksZdjecia(null);
        });
    }, []);

    const zmienZdjecie = useCallback((kierunek) => {
        setIndeksZdjecia((biezacyIndeks) => {
            if (biezacyIndeks === null || przefiltrowaneZdjecia.length === 0) return biezacyIndeks;
            const nowyIndeks = (biezacyIndeks + kierunek + przefiltrowaneZdjecia.length) % przefiltrowaneZdjecia.length;
            const $img = $(modalImgRef.current);
            $img.stop(true, true).fadeTo(150, 0.2, () => {
                $img.fadeTo(200, 1);
            });
            return nowyIndeks;
        });
    }, [przefiltrowaneZdjecia.length]);

    const poprzednieZdjecie = useCallback(() => zmienZdjecie(-1), [zmienZdjecie]);
    const nastepneZdjecie = useCallback(() => zmienZdjecie(1), [zmienZdjecie]);

    useEffect(() => {
        if (!autoodtwarzanie || indeksZdjecia === null) return;
        const timer = setInterval(() => {
            zmienZdjecie(1);
        }, 3000);
        return () => clearInterval(timer);
    }, [autoodtwarzanie, indeksZdjecia, zmienZdjecie]);

    useEffect(() => {
        if (indeksZdjecia === null) return;

        const obslugaKlawiszy = (e) => {
            if (e.key === "ArrowLeft") {
                poprzednieZdjecie();
            } else if (e.key === "ArrowRight") {
                nastepneZdjecie();
            } else if (e.key === "Escape") {
                zamknijModal();
            } else if (e.key === " ") {
                e.preventDefault();
                setAutoodtwarzanie((prev) => !prev);
            }
        };

        window.addEventListener("keydown", obslugaKlawiszy);
        return () => {
            window.removeEventListener("keydown", obslugaKlawiszy);
        };
    }, [indeksZdjecia, poprzednieZdjecie, nastepneZdjecie, zamknijModal]);

    const aktualneZdjecie = indeksZdjecia !== null ? przefiltrowaneZdjecia[indeksZdjecia] : null;

    return (
        <div className="banner-kontener">
            <div ref={bannerRef} className="banner">
                <h2>Witaj w task manager</h2>
                <p>zaplanuj i dodaj zadania</p>
            </div>

            <section className="galeria-sekcja">
                <div className="galeria-naglowek">
                    <h3>Galeria krajobrazów</h3>
                    <p>Kliknij wybrane zdjęcie, aby je powiększyć</p>
                </div>

                <div className="galeria-filtry">
                    {KATEGORIE.map((kat) => (
                        <button
                            key={kat.klucz}
                            type="button"
                            className={`galeria-filtr-btn ${wybranaKategoria === kat.klucz ? "aktywny" : ""}`}
                            onClick={() => {
                                setWybranaKategoria(kat.klucz);
                                setIndeksZdjecia(null);
                            }}
                        >
                            {kat.nazwa}
                        </button>
                    ))}
                </div>

                <div className="galeria-siatka">
                    {przefiltrowaneZdjecia.map((zdjecie, idx) => (
                        <div
                            key={zdjecie.id}
                            className="galeria-karta"
                            onClick={() => otworzZdjecie(idx)}
                        >
                            <img src={zdjecie.src} alt={zdjecie.tytul} loading="lazy" />
                            <div className="galeria-karta-opis">
                                <span className="galeria-karta-tytul">{zdjecie.tytul}</span>
                                <span className="galeria-karta-kategoria">{zdjecie.kategoria}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div
                ref={modalRef}
                className="galeria-modal"
                style={{ display: "none" }}
                onClick={(e) => {
                    if (e.target === modalRef.current) zamknijModal();
                }}
            >
                {aktualneZdjecie && (
                    <div className="galeria-modal-zawartosc">
                        <button
                            type="button"
                            className="galeria-modal-zamknij"
                            onClick={zamknijModal}
                            aria-label="Zamknij"
                        >
                            &times;
                        </button>

                        <div className="galeria-modal-podglad">
                            <button
                                type="button"
                                className="galeria-modal-nav galeria-modal-prev"
                                onClick={poprzednieZdjecie}
                                aria-label="Poprzednie zdjęcie"
                            >
                                &#10094;
                            </button>

                            <img
                                ref={modalImgRef}
                                className="galeria-modal-img"
                                src={aktualneZdjecie.src}
                                alt={aktualneZdjecie.tytul}
                            />

                            <button
                                type="button"
                                className="galeria-modal-nav galeria-modal-next"
                                onClick={nastepneZdjecie}
                                aria-label="Następne zdjęcie"
                            >
                                &#10095;
                            </button>
                        </div>

                        <div className="galeria-modal-pasek">
                            <div className="galeria-modal-info">
                                <h4>{aktualneZdjecie.tytul}</h4>
                                <span className="galeria-modal-licznik">
                                    Zdjęcie {indeksZdjecia + 1} z {przefiltrowaneZdjecia.length}
                                </span>
                            </div>

                            <button
                                type="button"
                                className={`galeria-auto-btn ${autoodtwarzanie ? "aktywne" : ""}`}
                                onClick={() => setAutoodtwarzanie((prev) => !prev)}
                            >
                                {autoodtwarzanie ? "⏸ Zatrzymaj autoodtwarzanie" : "▶ Włącz autoodtwarzanie"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Banner;