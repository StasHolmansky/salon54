window.addEventListener("load", () => {
    const burger =
        document.getElementById("header__burger") /** Кнопка бургер */
    const menu = document.getElementById("header__menu") /** Меню сайта */
    const nav = document.getElementById("header__nav") /** Полоса меню */
    const body =
        document.querySelector(
            "body",
        ) /** Получаем body для блокировки прокрутки */

    const html =
        document.documentElement /** Получаем html для определения высоты всей страницы */
    const menuLinks = document.querySelectorAll(
        ".header__link[data-goto]",
    ) /** Находим все пункты меню по data-goto */

    /** Отбираем элементы, для которых будет применяться анимация при прокрутке страницы */
    const aboutText = document.getElementById("about__text")
    const aboutImage = document.getElementById("about__image")
    const priceItem = Array.from(document.querySelectorAll(".price-item"))

    const gallery = Array.from(
        document.querySelectorAll(
            ".section__content_gallery img",
        ) /* Получаем массив картинок в галерее */,
    )

    const reviews = Array.from(
        document.querySelectorAll(
            ".section__content_reviews .reviews-item",
        ) /* Получаем массив отзывов */,
    )

    /** Подсветка просматриваемого пункта меню */

    /** Получаем высоту страницы */
    const height = Math.max(
        body.clientHeight,
        body.offsetHeight,
        body.scrollHeight,
        html.offsetHeight,
        html.clientHeight,
    )

    /** Создаём массив с координатой начала каждого блока */
    const activeMenu = []
    for (let i = 0; i < menuLinks.length; i++) {
        const section = document.querySelector(menuLinks[i].dataset.goto)

        activeMenu[i] =
            section.getBoundingClientRect().top +
            pageYOffset -
            document.querySelector(".header__nav").offsetHeight -
            100
    }

    /** Добавляем последним элементом в этот массив, это высота страницы */
    activeMenu.push(height)
    /** И нулевую позицию для подсвечивания первого пункта меню */
    activeMenu.unshift(0)

    /* Работа с бургер-меню на маленьких размерах экрана */
    burger.addEventListener("click", () => {
        /** Вешаем событие по нажатию на меню бургер */
        burger.classList.toggle(
            "_active",
        ) /** Анимируем кнопку бургера в крестик */
        menu.classList.toggle("_active") /** Открываем меню сайта */
        nav.classList.toggle(
            "_active",
        ) /** Применяем непрозрачность к полосе меню */
        if (menu.classList.contains("_active")) {
            /** Если меню открыто */
            body.classList.add(
                "_lock",
            ) /** Блокируем прокрутку body через overflow: hidden */
        } else {
            body.classList.remove(
                "_lock",
            ) /** Иначе разблокируем прокрутку страницы */
        }
    })

    /* Меняем цвет навигационной панели при проскроливании эрана */
    document.addEventListener("scroll", () => {
        if (window.scrollY >= 100) {
            /** Если прокрутили больше 100px */
            nav.classList.add("_scroll")

            /** Так же определяем, какой пункт меню в данный момент должен быть активным */
            for (let i = 1; i < activeMenu.length - 1; i++) {
                if (
                    /** Если прокрутили до пункта меню и ещё не дошли до следующего пункта меню */
                    window.pageYOffset >= activeMenu[i] &&
                    window.pageYOffset < activeMenu[i + 1]
                ) {
                    menuLinks.forEach((el) => {
                        /** Удаляем у всех пунктов меню подсветку */
                        el.classList.remove("_active")
                    })
                    menuLinks[i - 1].classList.add(
                        "_active",
                    ) /** Добавляем подсветку активному пункту меню */
                } else if (
                    /** Если это последний пункт меню */
                    window.pageYOffset >=
                        activeMenu[activeMenu.length - 1] -
                            window.innerHeight /** Если прокрутили до конца страницы минус высота окна браузера */ ||
                    window.pageYOffset >= height - window.innerHeight
                ) {
                    /** Удаляем у всех пунктов меню подсветку */
                    menuLinks.forEach((el) => {
                        el.classList.remove("_active")
                    })
                    menuLinks[menuLinks.length - 1].classList.add("_active")
                }
            }
        } else {
            /** Иначе убираем подсветку у всех пунктов меню, если прокрутка меньше высоты главного меню 100px */
            nav.classList.remove("_scroll")
            menuLinks.forEach((el) => {
                el.classList.remove("_active")
            })
        }

        /** Добавление анимации при прокручивании до секции на страницы */
        menuLinks.forEach((el, index) => {
            if (el.dataset.goto === "#section_about") {
                if (
                    /** Если блок в зоне видимости */
                    activeMenu[index + 1] <= window.scrollY + 350 &&
                    activeMenu[index + 2] >= window.scrollY + 50
                ) {
                    /** Применяем анимацию */
                    aboutText.classList.add("_active")
                    aboutImage.firstElementChild.classList.add("_active")
                } else {
                    /** Иначе удаляем анимацию */
                    aboutText.classList.remove("_active")
                    aboutImage.firstElementChild.classList.remove("_active")
                }
            } else if (el.dataset.goto === "#section_price") {
                if (
                    /** Если блок в зоне видимости */
                    activeMenu[3] <= window.scrollY + 350 &&
                    activeMenu[4] >= window.scrollY + 100
                ) {
                    /** Применяем анимацию */
                    priceItem.forEach((el) => {
                        el.classList.add("_active")
                    })
                } else {
                    /** Иначе удаляем анимацию */
                    priceItem.forEach((el) => {
                        el.classList.remove("_active")
                    })
                }
            }
        })
    })

    /* Убираем половину картинок в галерее и половину карточек в отзывах при размере экрана менее 600px */
    document.addEventListener("DOMContentLoaded", () => {
        if (window.innerWidth < 600) {
            gallery.forEach((el, index) => {
                if (index % 2 !== 0) {
                    el.classList.add("_hidden")
                }
            })
            reviews.forEach((el, index) => {
                if (index % 2 !== 0) {
                    el.classList.add("_hidden")
                }
            })
        }
    })

    if (menuLinks.length > 0) {
        /** Если в меню есть ссылки */
        menuLinks.forEach((el) => {
            /** То вешаем обработчик на все пункты меню */
            el.addEventListener("click", onMenuClick)
        })
    }

    /* Плавная прокрутка до нужного пункта меню */
    function onMenuClick(e) {
        const menuLink = e.target

        if (
            menuLink.dataset
                .goto /** Если у данного пункта меню есть дата атрибут */ &&
            document.querySelector(
                menuLink.dataset.goto,
            ) /** И есть такая секция на странице */
        ) {
            /** Тогда вычисляем координаты данной секции */
            const gotoBlock = document.querySelector(menuLink.dataset.goto)
            const gotoBlockValue =
                gotoBlock.getBoundingClientRect().top +
                pageYOffset -
                document.querySelector(".header__nav").offsetHeight

            /* Если меню открыто, то закрываем его и убираем все активные классы */
            if (menu.classList.contains("_active")) {
                menu.classList.remove("_active")
                burger.classList.remove("_active")
                nav.classList.remove("_active")
                body.classList.remove("_lock")
            }

            window.scrollTo({
                /* Скролим экран на нужную позицию */
                top: gotoBlockValue /* От верха страницы полученное колличество пикселей */,
                behavior: "smooth" /* Плавная прокрутка */,
            })
            e.preventDefault() /* Отменяем стандартное поведение при нажатии на ссылку */
        }
    }
})
