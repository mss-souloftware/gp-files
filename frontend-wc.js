(function ($) {
    let pageReady = false;

    $(document).ready(function () {
        $('#ctfw_add_to_cart_btn').prop('disabled', true);

        const keyMap = {
            '0': '0.webp', '1': '1.webp', '2': '2.webp', '3': '3.webp', '4': '4.webp', '5': '5.webp',
            '6': '6.webp', '7': '7.webp', '8': '8.webp', '9': '9.webp', ' ': { heart: 'heart.webp', star: 'star.webp' },
            'A': 'a.webp', 'Á': 'a.webp', 'B': 'b.webp', 'C': 'c.webp', 'D': 'd.webp', 'E': 'e.webp', 'É': 'e.webp', 'F': 'f.webp',
            'G': 'g.webp', 'H': 'h.webp', 'I': 'i.webp', 'Í': 'i.webp', 'J': 'j.webp', 'K': 'k.webp', 'L': 'l.webp',
            'M': 'm.webp', 'N': 'n.webp', 'O': 'o.webp', 'Ó': 'o.webp', 'P': 'p.webp', 'Q': 'q.webp', 'R': 'r.webp',
            'S': 's.webp', 'T': 't.webp', 'U': 'u.webp', 'Ú': 'u.webp', 'V': 'v.webp', 'W': 'w.webp', 'X': 'x.webp',
            'Y': 'y.webp', 'Z': 'z.webp',
            'Ñ': 'n1.webp', 'ñ': 'n1.webp', 'Ç': 'c1.webp',
            '?': 'que.webp', '¡': 'exclm1.webp',
            '!': 'exclm.webp', '¿': 'que1.webp',
            ',': 'coma.webp', '&': 'and.webp'
        };

        function generateImages(text, $typewriterInner, spaceSymbol) {
            let chocoType = $("#chocoBase").val();
            const audioElement = document.getElementById('keySound');

            if (audioElement) {
                audioElement.currentTime = 0;
                audioElement.play().catch(e => console.log('Audio play error:', e));
            }

            $typewriterInner.empty();
            const words = text.split(spaceSymbol);
            words.forEach((word, wordIndex) => {
                let $wordDiv = $('<div>').addClass('word');
                let imgCount = 0;

                for (let i = 0; i < word.length; i++) {
                    const char = word[i];
                    let imgFileName;

                    if (char === spaceSymbol) {
                        imgFileName = keyMap[' '][$('#letras').val()];
                    } else {
                        imgFileName = keyMap[char.toUpperCase()] || keyMap[char];
                    }

                    if (imgFileName) {
                        const imgPath = `${ctfw_vars.pluginUrl}img/letters/${chocoType}/${imgFileName}`;
                        const $img = $('<img>').attr('src', imgPath).addClass('letter-img');

                        const isLastWord = wordIndex === words.length - 1;
                        const isLastChar = i === word.length - 1;
                        if (isLastWord && isLastChar) {
                            $img.addClass('pop');
                            setTimeout(() => { $img.removeClass('pop'); }, 500);
                        }

                        if (imgCount >= 15) {
                            $typewriterInner.append($wordDiv);
                            $wordDiv = $('<div>').addClass('word');
                            imgCount = 0;
                        }

                        $wordDiv.append($img);
                        imgCount++;
                    }
                }

                $typewriterInner.append($wordDiv);

                if (wordIndex < words.length - 1) {
                    const imgPath = `${ctfw_vars.pluginUrl}img/letters/${chocoType}/${keyMap[' '][$('#letras').val()]}`;
                    const $img = $('<img>').attr('src', imgPath).addClass('letter-img');
                    $typewriterInner.append($img);
                }
            });

            // Sizing logic
            let maxChildCount = 0;
            $('.typewriterInner .word').each(function () {
                const childCount = $(this).children().length;
                if (childCount > maxChildCount) {
                    maxChildCount = childCount;
                }
            });

            if (maxChildCount > 10) {
                if ($(window).width() < 600) {
                    $('.typewriterInner .word').children().css('max-width', '16px');
                    $('.typewriterInner .letter-img').css('max-width', '16px');
                } else {
                    $('.typewriterInner .word').children().css('max-width', '35px');
                    $('.typewriterInner .letter-img').css('max-width', '35px');
                }
            } else if (maxChildCount > 7) {
                if ($(window).width() < 600) {
                    $('.typewriterInner .word').children().css('max-width', '25px');
                    $('.typewriterInner .letter-img').css('max-width', '25px');
                } else {
                    $('.typewriterInner .word').children().css('max-width', '50px');
                    $('.typewriterInner .letter-img').css('max-width', '50px');
                }
            }
        }

        function calculateTotalPrice() {
            const pricePerCharacter = parseFloat(ctfw_vars.precLetra);
            const pricePerSymbol = parseFloat(ctfw_vars.precCoraz);

            let text = $('#getText').val();
            let price = 0;
            let count = 0;

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === '✯' || char === '♥') {
                    price += pricePerSymbol;
                } else {
                    price += pricePerCharacter;
                }
                count++;
            }

            $('#counter').text(price.toFixed(2));
            $('#actual').text(count);
            $('.wordCounter span').text(count);
            return price;
        }

        function updateText() {
            $('.dummyImg').hide();
            const selectedSymbol = $('#letras').val() === 'heart' ? '♥' : '✯';
            let inputText = $('#getText').val();
            inputText = inputText.replace(/♥|✯/g, selectedSymbol);
            inputText = inputText.replace(/ /g, selectedSymbol).toUpperCase();

            $('#getText').val(inputText);
            generateImages(inputText, $('.typewriterInner'), selectedSymbol);
            calculateTotalPrice();
        }

        $('#getText').on('input', updateText);
        $('#letras').on('change', updateText);
        $('#chocoBase').on('change', updateText);

        $(".popAlertClose").on("click", function () {
            $(".bgblckScrn").hide();
            $(".popAlert").hide();
        });

        $('#ctfw_add_to_cart_btn').on('click', function (e) {
            e.preventDefault();

            if (!pageReady) {
                $(".popAlert .popAlertText").text("⏳ La página aún se está cargando. Por favor espera un momento.");
                $(".bgblckScrn").show();
                $(".popAlert").show();
                return;
            }

            let text = $.trim($('#getText').val());
            if (text === "") {
                $(".popAlert .popAlertText").text(`❌ Por favor, escribe tu frase primero.`);
                $(".bgblckScrn").show();
                $(".popAlert").show();
                return;
            }

            let price = calculateTotalPrice();
            let minPrice = parseFloat(ctfw_vars.gastoMinimo);

            if (price < minPrice) {
                $(".popAlert .popAlertText").text(`🚀 ¡Falta poco! 📌 El pedido mínimo es de ${minPrice} €. 💡 Añade unas letras más y hazlo inolvidable.`);
                $(".bgblckScrn").show();
                $(".popAlert").show();
                return;
            }

            let chocoType = $('#chocoBase').val();
            let spaceType = $('#letras').val();

            $(this).text("Añadiendo...").prop("disabled", true);

            $.ajax({
                type: 'POST',
                url: ctfw_vars.ajax_url,
                data: {
                    action: 'ctfw_add_to_cart',
                    nonce: ctfw_vars.nonce,
                    phrase: text,
                    chocoType: chocoType,
                    spaceType: spaceType,
                    price: price
                },
                success: function (res) {
                    if (res.success) {
                        window.location.href = ctfw_vars.redirectUrl;
                    } else {
                        $(".popAlert .popAlertText").text(`Error: ${res.data}`);
                        $(".bgblckScrn").show();
                        $(".popAlert").show();
                        $('#ctfw_add_to_cart_btn').text("Añadir al Carrito").prop("disabled", false);
                    }
                },
                error: function () {
                    $(".popAlert .popAlertText").text(`Ocurrió un error. Inténtalo de nuevo.`);
                    $(".bgblckScrn").show();
                    $(".popAlert").show();
                    $('#ctfw_add_to_cart_btn').text("Añadir al Carrito").prop("disabled", false);
                }
            });
        });
    });

    $(window).on('load', function () {
        pageReady = true;
        $('#ctfw_add_to_cart_btn').prop('disabled', false);
    });
})(jQuery);
