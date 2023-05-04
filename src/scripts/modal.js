const nav = document.getElementById("header__nav") /** Полоса меню */
const body = document.querySelector("body") /** Получаем body для блокировки прокрутки */

const openBtn = document.querySelectorAll(".open-modal"); // Массив кнопок, по которым открываем модальное окно
const modalOverlay = document.getElementById("modal__overlay"); // Затемнение фона, подложка под модальное окно
const modalWindow = document.getElementById("modal__window"); // Модальное окно
const closeBtn = document.getElementById("closeBtn"); // Кнопка закрытия модального окна
const submitBtn = document.getElementById("submitBtn"); // Кнопка отправки формы
const scrollWidth = window.innerWidth - document.body.clientWidth; // Получаем ширину полосы прокрутки

/** Open modal window by button on the page */
openBtn.forEach((el) => {
    el.addEventListener("click", () => {
        nav.style.padding = `0 ${scrollWidth}px 0 0`; // Добавляем паддинг справа в размере ширины полосы прокрутки для панели навигации
        body.style.padding = `0 ${scrollWidth}px 0 0`; // Добавляем паддинг справа в размере ширины полосы прокрутки для всей страницы
        modalOverlay.classList.add("_active"); // Слой с затемнением экрана открываем
        modalWindow.classList.add("_active"); // Открываем модальное окно
        body.classList.add("_lock"); // Блокируем прокрутку страницы при окрытии модального окна
    });
});

/** Close modal window by X button */
/** Close modal window by submit button */
/** Close modal window, if click outside modal window */

document.addEventListener("click", (el) => {
    if (
        el.target === closeBtn ||
        el.target === submitBtn ||
        el.target === modalOverlay
    ) {
        nav.style.padding = `0`;
        body.style.padding = `0`;
        modalOverlay.classList.remove("_active");
        modalWindow.classList.remove("_active");
        body.classList.remove("_lock");
    }
});
