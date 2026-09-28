(function ($) {

    'use strict';

    /*
    |--------------------------------------------------------------------------
    | Crea Tu Frase - WooCommerce Integration
    |--------------------------------------------------------------------------
    | Complete frontend JavaScript
    |
    | Includes:
    | - Plugin initialization state
    | - Preloader protection
    | - Letter image preloading
    | - Phrase generation
    | - Price calculation
    | - Add to cart AJAX
    | - Safety checks
    |--------------------------------------------------------------------------
    */


    /* ========================================================================
       GLOBAL STATE
       ======================================================================== */

    let pageReady = false;
    let pluginInitializing = true;


    /* ========================================================================
       PRELOAD ALL PLUGIN LETTER IMAGES
       ======================================================================== */

    function preloadPluginImages() {

        const imageFiles = [

            // Numbers
            '0.webp',
            '1.webp',
            '2.webp',
            '3.webp',
            '4.webp',
            '5.webp',
            '6.webp',
            '7.webp',
            '8.webp',
            '9.webp',

            // Alphabet
            'a.webp',
            'b.webp',
            'c.webp',
            'd.webp',
            'e.webp',
            'f.webp',
            'g.webp',
            'h.webp',
            'i.webp',
            'j.webp',
            'k.webp',
            'l.webp',
            'm.webp',
            'n.webp',
            'o.webp',
            'p.webp',
            'q.webp',
            'r.webp',
            's.webp',
            't.webp',
            'u.webp',
            'v.webp',
            'w.webp',
            'x.webp',
            'y.webp',
            'z.webp',

            // Special characters
            'n1.webp',
            'c1.webp',
            'que.webp',
            'que1.webp',
            'exclm.webp',
            'exclm1.webp',
            'coma.webp',
            'and.webp',

            // Spaces
            'heart.webp',
            'star.webp'
        ];


        const chocolateTypes = [
            'Claro',
            'Negro'
        ];


        const promises = [];


        chocolateTypes.forEach(function (type) {

            imageFiles.forEach(function (file) {

                promises.push(

                    new Promise(function (resolve) {

                        const img = new Image();

                        /*
                         * Resolve whether image loads successfully or not.
                         *
                         * We don't want one missing decorative image
                         * to permanently lock the entire product builder.
                         */
                        img.onload = function () {
                            resolve();
                        };

                        img.onerror = function () {
                            console.warn(
                                'Crea Tu Frase: Could not preload image:',
                                type + '/' + file
                            );

                            resolve();
                        };


                        img.src =
                            ctfw_vars.pluginUrl +
                            'img/letters/' +
                            type +
                            '/' +
                            file;

                    })

                );

            });

        });


        return Promise.all(promises);
    }


    /* ========================================================================
       WAIT FOR BROWSER RENDERING
       ======================================================================== */

    function waitForBrowserRender() {

        return new Promise(function (resolve) {

            requestAnimationFrame(function () {

                requestAnimationFrame(function () {

                    resolve();

                });

            });

        });

    }


    /* ========================================================================
       INITIALIZE PLUGIN
       ======================================================================== */

    function initializeCtfwPlugin() {

        /*
         * First verify that WordPress localized variables exist.
         */
        if (
            typeof ctfw_vars === 'undefined' ||
            !ctfw_vars.pluginUrl ||
            !ctfw_vars.ajax_url ||
            !ctfw_vars.nonce
        ) {

            console.error(
                'Crea Tu Frase: Required configuration is missing.'
            );

            showInitializationError();

            return;

        }


        /*
         * Preload all letter images.
         */
        preloadPluginImages()

            .then(function () {

                /*
                 * Give the browser a moment to finish rendering
                 * the loaded assets.
                 */
                return waitForBrowserRender();

            })

            .then(function () {

                /*
                 * Plugin is now ready.
                 */
                pageReady = true;
                pluginInitializing = false;


                const $wrapper = $('#mainWrapperForm');
                const $preloader = $('#ctfw_preloader');


                /*
                 * Remove loading state.
                 */
                $wrapper.removeClass('ctfw-loading');


                /*
                 * Enable phrase input.
                 */
                $('#getText').prop('disabled', false);


                /*
                 * Enable space selector.
                 */
                $('#letras').prop('disabled', false);


                /*
                 * Enable chocolate selector.
                 */
                $('#chocoBase').prop('disabled', false);


                /*
                 * Enable Add to Cart.
                 */
                $('#ctfw_add_to_cart_btn')
                    .prop('disabled', false);


                /*
                 * Hide preloader.
                 */
                $preloader.addClass('ctfw-loaded');


                console.log(
                    'Crea Tu Frase: Plugin successfully initialized.'
                );

            })

            .catch(function (error) {

                console.error(
                    'Crea Tu Frase initialization error:',
                    error
                );

                showInitializationError();

            });

    }


    /* ========================================================================
       INITIALIZATION ERROR
       ======================================================================== */

    function showInitializationError() {

        pageReady = false;
        pluginInitializing = true;


        const $preloader = $('#ctfw_preloader');


        $preloader.find('.ctfw-loader-title').text(
            'No se pudo cargar el configurador'
        );


        $preloader.find('.ctfw-loader-text').text(
            'Actualiza la página e inténtalo de nuevo.'
        );


        /*
         * Keep everything disabled.
         */
        $('#getText').prop('disabled', true);
        $('#letras').prop('disabled', true);
        $('#chocoBase').prop('disabled', true);
        $('#ctfw_add_to_cart_btn').prop('disabled', true);

    }


    /* ========================================================================
       DOCUMENT READY
       ======================================================================== */

    $(document).ready(function () {


        /* ====================================================================
           ELEMENT REFERENCES
           ==================================================================== */

        const $wrapper = $('#mainWrapperForm');
        const $preloader = $('#ctfw_preloader');
        const $input = $('#getText');
        const $button = $('#ctfw_add_to_cart_btn');


        /* ====================================================================
           LOCK EVERYTHING IMMEDIATELY
           ==================================================================== */

        /*
         * Add loading class to wrapper.
         */
        $wrapper.addClass('ctfw-loading');


        /*
         * Disable phrase input.
         */
        $input.prop('disabled', true);


        /*
         * Disable space selector.
         */
        $('#letras').prop('disabled', true);


        /*
         * Disable chocolate selector.
         */
        $('#chocoBase').prop('disabled', true);


        /*
         * Disable Add to Cart.
         */
        $button.prop('disabled', true);


        /* ====================================================================
           KEY MAP
           ==================================================================== */

        const keyMap = {

            // Numbers
            '0': '0.webp',
            '1': '1.webp',
            '2': '2.webp',
            '3': '3.webp',
            '4': '4.webp',
            '5': '5.webp',
            '6': '6.webp',
            '7': '7.webp',
            '8': '8.webp',
            '9': '9.webp',

            // Space
            ' ': {
                heart: 'heart.webp',
                star: 'star.webp'
            },

            // Alphabet
            'A': 'a.webp',
            'Á': 'a.webp',

            'B': 'b.webp',

            'C': 'c.webp',

            'D': 'd.webp',

            'E': 'e.webp',
            'É': 'e.webp',

            'F': 'f.webp',

            'G': 'g.webp',

            'H': 'h.webp',

            'I': 'i.webp',
            'Í': 'i.webp',

            'J': 'j.webp',

            'K': 'k.webp',

            'L': 'l.webp',

            'M': 'm.webp',

            'N': 'n.webp',

            'O': 'o.webp',
            'Ó': 'o.webp',

            'P': 'p.webp',

            'Q': 'q.webp',

            'R': 'r.webp',

            'S': 's.webp',

            'T': 't.webp',

            'U': 'u.webp',
            'Ú': 'u.webp',

            'V': 'v.webp',

            'W': 'w.webp',

            'X': 'x.webp',

            'Y': 'y.webp',

            'Z': 'z.webp',

            // Special letters
            'Ñ': 'n1.webp',
            'ñ': 'n1.webp',

            'Ç': 'c1.webp',

            // Special characters
            '?': 'que.webp',
            '¡': 'exclm1.webp',

            '!': 'exclm.webp',
            '¿': 'que1.webp',

            ',': 'coma.webp',

            '&': 'and.webp'
        };


        /* ====================================================================
           GENERATE LETTER IMAGES
           ==================================================================== */

        function generateImages(
            text,
            $typewriterInner,
            spaceSymbol
        ) {

            const chocoType = $('#chocoBase').val();

            const audioElement =
                document.getElementById('keySound');


            /*
             * Play typing sound.
             */
            if (audioElement) {

                audioElement.currentTime = 0;

                audioElement
                    .play()
                    .catch(function (error) {

                        console.log(
                            'Audio play error:',
                            error
                        );

                    });

            }


            /*
             * Clear existing generated images.
             */
            $typewriterInner.empty();


            /*
             * Split phrase into words.
             */
            const words = text.split(spaceSymbol);


            words.forEach(function (word, wordIndex) {

                let $wordDiv =
                    $('<div>').addClass('word');

                let imgCount = 0;


                for (
                    let i = 0;
                    i < word.length;
                    i++
                ) {

                    const char = word[i];

                    let imgFileName;


                    /*
                     * Space / symbol.
                     */
                    if (char === spaceSymbol) {

                        imgFileName =
                            keyMap[' '][
                                $('#letras').val()
                            ];

                    }

                    /*
                     * Normal character.
                     */
                    else {

                        imgFileName =
                            keyMap[
                                char.toUpperCase()
                            ] ||
                            keyMap[char];

                    }


                    /*
                     * Generate image.
                     */
                    if (imgFileName) {

                        const imgPath =
                            ctfw_vars.pluginUrl +
                            'img/letters/' +
                            chocoType +
                            '/' +
                            imgFileName;


                        const $img =
                            $('<img>')
                                .attr('src', imgPath)
                                .addClass('letter-img');


                        /*
                         * Pop animation on final character.
                         */
                        const isLastWord =
                            wordIndex ===
                            words.length - 1;


                        const isLastChar =
                            i === word.length - 1;


                        if (
                            isLastWord &&
                            isLastChar
                        ) {

                            $img.addClass('pop');


                            setTimeout(function () {

                                $img.removeClass('pop');

                            }, 500);

                        }


                        /*
                         * Split long words into chunks.
                         */
                        if (imgCount >= 15) {

                            $typewriterInner
                                .append($wordDiv);


                            $wordDiv =
                                $('<div>')
                                    .addClass('word');


                            imgCount = 0;

                        }


                        /*
                         * Add image to word.
                         */
                        $wordDiv.append($img);


                        imgCount++;

                    }

                }


                /*
                 * Add completed word.
                 */
                $typewriterInner.append($wordDiv);


                /*
                 * Add space/symbol between words.
                 */
                if (
                    wordIndex <
                    words.length - 1
                ) {

                    const imgPath =
                        ctfw_vars.pluginUrl +
                        'img/letters/' +
                        chocoType +
                        '/' +
                        keyMap[' '][
                            $('#letras').val()
                        ];


                    const $img =
                        $('<img>')
                            .attr('src', imgPath)
                            .addClass('letter-img');


                    $typewriterInner.append($img);

                }

            });


            /* =================================================================
               IMAGE SIZING
               ================================================================= */

            let maxChildCount = 0;


            $('.typewriterInner .word')
                .each(function () {

                    const childCount =
                        $(this)
                            .children()
                            .length;


                    if (
                        childCount >
                        maxChildCount
                    ) {

                        maxChildCount =
                            childCount;

                    }

                });


            /*
             * More than 10 characters.
             */
            if (maxChildCount > 10) {

                if (
                    $(window).width() < 600
                ) {

                    $('.typewriterInner .word')
                        .children()
                        .css(
                            'max-width',
                            '16px'
                        );


                    $('.typewriterInner .letter-img')
                        .css(
                            'max-width',
                            '16px'
                        );

                }

                else {

                    $('.typewriterInner .word')
                        .children()
                        .css(
                            'max-width',
                            '35px'
                        );


                    $('.typewriterInner .letter-img')
                        .css(
                            'max-width',
                            '35px'
                        );

                }

            }

            /*
             * More than 7 characters.
             */
            else if (maxChildCount > 7) {

                if (
                    $(window).width() < 600
                ) {

                    $('.typewriterInner .word')
                        .children()
                        .css(
                            'max-width',
                            '25px'
                        );


                    $('.typewriterInner .letter-img')
                        .css(
                            'max-width',
                            '25px'
                        );

                }

                else {

                    $('.typewriterInner .word')
                        .children()
                        .css(
                            'max-width',
                            '50px'
                        );


                    $('.typewriterInner .letter-img')
                        .css(
                            'max-width',
                            '50px'
                        );

                }

            }

        }


        /* ====================================================================
           CALCULATE TOTAL PRICE
           ==================================================================== */

        function calculateTotalPrice() {

            const pricePerCharacter =
                parseFloat(
                    ctfw_vars.precLetra
                );


            const pricePerSymbol =
                parseFloat(
                    ctfw_vars.precCoraz
                );


            const text =
                $('#getText').val();


            let price = 0;
            let count = 0;


            for (
                let i = 0;
                i < text.length;
                i++
            ) {

                const char = text[i];


                if (
                    char === '✯' ||
                    char === '♥'
                ) {

                    price +=
                        pricePerSymbol;

                }

                else {

                    price +=
                        pricePerCharacter;

                }


                count++;

            }


            /*
             * Update displayed price.
             */
            $('#counter')
                .text(
                    price.toFixed(2)
                );


            /*
             * Update hidden/current character count.
             */
            $('#actual')
                .text(count);


            /*
             * Update visible character counter.
             */
            $('.wordCounter span')
                .text(count);


            return price;

        }


        /* ====================================================================
           UPDATE TEXT
           ==================================================================== */

        function updateText() {

            /*
             * Safety check.
             *
             * This should normally never happen because
             * the input is disabled while loading.
             */
            if (
                !pageReady ||
                pluginInitializing
            ) {

                return;

            }


            /*
             * Hide dummy typewriter image.
             */
            $('.dummyImg').hide();


            /*
             * Determine selected symbol.
             */
            const selectedSymbol =
                $('#letras').val() === 'heart'
                    ? '♥'
                    : '✯';


            /*
             * Get input.
             */
            let inputText =
                $('#getText').val();


            /*
             * Replace existing symbols.
             */
            inputText =
                inputText.replace(
                    /♥|✯/g,
                    selectedSymbol
                );


            /*
             * Convert spaces into selected symbol.
             */
            inputText =
                inputText.replace(
                    / /g,
                    selectedSymbol
                );


            /*
             * Convert letters to uppercase.
             */
            inputText =
                inputText.toUpperCase();


            /*
             * Put normalized text back into input.
             */
            $('#getText')
                .val(inputText);


            /*
             * Generate chocolate letter images.
             */
            generateImages(
                inputText,
                $('.typewriterInner'),
                selectedSymbol
            );


            /*
             * Calculate price.
             */
            calculateTotalPrice();

        }


        /* ====================================================================
           INPUT EVENTS
           ==================================================================== */

        $('#getText')
            .on(
                'input',
                updateText
            );


        $('#letras')
            .on(
                'change',
                updateText
            );


        $('#chocoBase')
            .on(
                'change',
                updateText
            );


        /* ====================================================================
           POPUP CLOSE
           ==================================================================== */

        $('.popAlertClose')
            .on(
                'click',
                function () {

                    $('.bgblckScrn')
                        .hide();


                    $('.popAlert')
                        .hide();

                }
            );


        /* ====================================================================
           ADD TO CART
           ==================================================================== */

        $('#ctfw_add_to_cart_btn')
            .on(
                'click',
                function (e) {

                    e.preventDefault();


                    const $this =
                        $(this);


                    /* ========================================================
                       SAFETY CHECK #1
                       ======================================================== */

                    if (
                        !pageReady ||
                        pluginInitializing
                    ) {

                        $(
                            '.popAlert .popAlertText'
                        ).text(
                            '⏳ El configurador todavía se está preparando. Por favor espera un momento.'
                        );


                        $('.bgblckScrn')
                            .show();


                        $('.popAlert')
                            .show();


                        return;

                    }


                    /* ========================================================
                       GET PHRASE
                       ======================================================== */

                    const text =
                        $.trim(
                            $('#getText').val()
                        );


                    /*
                     * Empty phrase.
                     */
                    if (text === '') {

                        $(
                            '.popAlert .popAlertText'
                        ).text(
                            '❌ Por favor, escribe tu frase primero.'
                        );


                        $('.bgblckScrn')
                            .show();


                        $('.popAlert')
                            .show();


                        return;

                    }


                    /* ========================================================
                       CALCULATE PRICE
                       ======================================================== */

                    const price =
                        calculateTotalPrice();


                    const minPrice =
                        parseFloat(
                            ctfw_vars.gastoMinimo
                        );


                    /*
                     * Minimum order validation.
                     */
                    if (
                        price <
                        minPrice
                    ) {

                        $(
                            '.popAlert .popAlertText'
                        ).text(
                            `🚀 ¡Falta poco! 📌 El pedido mínimo es de ${minPrice} €. 💡 Añade unas letras más y hazlo inolvidable.`
                        );


                        $('.bgblckScrn')
                            .show();


                        $('.popAlert')
                            .show();


                        return;

                    }


                    /* ========================================================
                       GET PRODUCT OPTIONS
                       ======================================================== */

                    const chocoType =
                        $('#chocoBase').val();


                    const spaceType =
                        $('#letras').val();


                    /* ========================================================
                       LOCK BUTTON DURING AJAX
                       ======================================================== */

                    $this
                        .text(
                            'Añadiendo...'
                        )
                        .prop(
                            'disabled',
                            true
                        );


                    /* ========================================================
                       AJAX REQUEST
                       ======================================================== */

                    $.ajax({

                        type: 'POST',

                        url:
                            ctfw_vars.ajax_url,

                        data: {

                            action:
                                'ctfw_add_to_cart',

                            nonce:
                                ctfw_vars.nonce,

                            phrase:
                                text,

                            chocoType:
                                chocoType,

                            spaceType:
                                spaceType,

                            price:
                                price

                        },


                        /* ====================================================
                           SUCCESS
                           ==================================================== */

                        success:
                            function (res) {

                                if (
                                    res &&
                                    res.success
                                ) {

                                    /*
                                     * WooCommerce cart success.
                                     */
                                    window.location.href =
                                        ctfw_vars.redirectUrl;

                                }

                                else {

                                    const errorMessage =
                                        res &&
                                        res.data
                                            ? res.data
                                            : 'No se pudo añadir el producto al carrito.';


                                    $(
                                        '.popAlert .popAlertText'
                                    ).text(
                                        `Error: ${errorMessage}`
                                    );


                                    $('.bgblckScrn')
                                        .show();


                                    $('.popAlert')
                                        .show();


                                    /*
                                     * Restore button.
                                     */
                                    $this
                                        .text(
                                            'Añadir al Carrito'
                                        )
                                        .prop(
                                            'disabled',
                                            false
                                        );

                                }

                            },


                        /* ====================================================
                           AJAX ERROR
                           ==================================================== */

                        error:
                            function (
                                xhr,
                                status,
                                error
                            ) {

                                console.error(
                                    'Crea Tu Frase AJAX error:',
                                    {
                                        xhr: xhr,
                                        status: status,
                                        error: error
                                    }
                                );


                                $(
                                    '.popAlert .popAlertText'
                                ).text(
                                    'Ocurrió un error. Inténtalo de nuevo.'
                                );


                                $('.bgblckScrn')
                                    .show();


                                $('.popAlert')
                                    .show();


                                /*
                                 * Restore button.
                                 */
                                $this
                                    .text(
                                        'Añadir al Carrito'
                                    )
                                    .prop(
                                        'disabled',
                                        false
                                    );

                            }

                    });

                }
            );


        /* ====================================================================
           START PLUGIN INITIALIZATION
           ==================================================================== */

        initializeCtfwPlugin();

    });


})(jQuery);
