(function ($) {

    let loader = $(".chocoletrasPlg-spiner");
    $(document).ready(function () {
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
            console.log('Current chocoType:', chocoType); // Debugging line
            $typewriterInner.empty();
            const words = text.split(spaceSymbol);
            words.forEach((word, index) => {
                let $wordDiv = $('<div>').addClass('word');
                let imgCount = 0;

                for (const char of word) {
                    let imgFileName;
                    if (char === spaceSymbol) {
                        imgFileName = keyMap[' '][$('#letras').val()];
                    } else {
                        imgFileName = keyMap[char.toUpperCase()] || keyMap[char];
                    }

                    if (imgFileName) {
                        const imgPath = `${ajax_variables.pluginUrl}img/letters/${chocoType}/${imgFileName}`;
                        const $img = $('<img>').attr('src', imgPath).addClass('letter-img');

                        // Check if imgCount exceeds 15
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

                if (index < words.length - 1) {
                    const imgPath = `${ajax_variables.pluginUrl}img/letters/${chocoType}/${keyMap[' '][$('#letras').val()]}`;
                    const $img = $('<img>').attr('src', imgPath).addClass('letter-img');
                    $typewriterInner.append($img);
                }
            });

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
            let totalPrice = 0;
            let totalCount = 0;
            const pricePerCharacter = Number($("#precLetras").val());
            const pricePerSymbol = Number($("#precCoraz").val());
            const minPrice = parseFloat(ajax_variables.gastoMinimo);
            const shippingCost = parseFloat(ajax_variables.precEnvio);

            function calculatePrice(text) {
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
                return { price: price, count: count };
            }

            function getPriceForInput($input) {
                const { price, count } = calculatePrice($input.val());
                if (price < minPrice) {
                    totalPrice += minPrice;
                } else {
                    totalPrice += minPrice + (price - minPrice);
                }
                totalCount += count;
            }

            // Calculate the price for #getText field
            getPriceForInput(jQuery('#getText'));

            // Calculate the price for .fraseInput fields
            jQuery('.fraseInput').each(function () {
                getPriceForInput(jQuery(this));
            });

            // Add shipping cost to the total price
            totalPrice += shippingCost;

            jQuery('#ctf_form #counter').text(totalPrice.toFixed(2));
            jQuery('#actual').text(totalCount);
            jQuery('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val(totalPrice.toFixed(2));
        }




        function attachInputHandler($input, $typewriterInner) {
            function updateText() {
                const selectedSymbol = $('#letras').val() === 'heart' ? '♥' : '✯';
                let inputText = $input.val();
                inputText = inputText.replace(/♥|✯/g, selectedSymbol); // Replace all hearts and stars with the selected symbol
                inputText = inputText.replace(/ /g, selectedSymbol).toUpperCase();
                $input.val(inputText);
                generateImages(inputText, $typewriterInner, selectedSymbol);
                calculateTotalPrice(); // Trigger price calculation on input change
                checkInputs(); // Check inputs on change
            }

            $input.on('input', updateText);
            $('#letras').on('change', updateText);
        }

        function checkInputs() {
            let allFilled = true;

            if ($.trim($('#getText').val()) === "") {
                allFilled = false;
            }

            $('.fraseInput').each(function () {
                if ($.trim($(this).val()) === "") {
                    allFilled = false;
                }
            });

            if (allFilled) {
                $(".dummyImg").css('display', 'none');
                $("#addNewFrase").removeAttr('disabled');
                $("#ctf_form .action-button").removeAttr('disabled');
            } else {
                $(".dummyImg").css('display', 'block');
                $("#addNewFrase").prop('disabled', true);
                $("#ctf_form .action-button").prop('disabled', true);
            }
        }

        attachInputHandler($('#getText'), $('#typewriter .typewriterInner'));

        $("#ctf_form #getText").on("keyup", function () {
            checkInputs();
        });

        let typewriterCounter = 1;
        $("#addNewFrase").click(function () {
            const newTypewriterInnerId = `typewriterInner_${typewriterCounter++}`;
            const newFrasePanelId = `frasePanel_${typewriterCounter}`;

            const $newFrasePanel = $(`
                <div class="frasePanel" id="${newFrasePanelId}">
                    <div class="closeBtnTyper">
                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" fill="#E64C3C" />
                        </svg>
                    </div>
                    <input class="fraseInput" type="text" placeholder="Escriba su frase aquí.." maxlength="${ajax_variables.maxCaracteres}" required>
                </div>
            `);
            $('.fraseWrapper').append($newFrasePanel);
            const $newTypewriterInner = $(`<div class="typewriterInner" id="${newTypewriterInnerId}"></div>`);
            $('#typewriter').append($newTypewriterInner);
            const $newInput = $newFrasePanel.find('.fraseInput');
            attachInputHandler($newInput, $newTypewriterInner);
            checkInputs();
            // Attach click event handler to the close button
            $newFrasePanel.find('.closeBtnTyper').click(function () {
                $newFrasePanel.remove(); // Remove the frase panel
                $newTypewriterInner.remove(); // Remove the typewriter inner element
                calculateTotalPrice(); // Recalculate the total price
                checkInputs(); // Check inputs on remove
            });
        });


        let screenshotPaths = [];
        let screenshotData = [];
        let typewriterScreenshotPath = '';

        function saveScreenshots(screenshots, callback) {
            $.ajax({
                type: "POST",
                url: `${ajax_variables.pluginUrl}utils/save_screenshot.php`,
                data: {
                    screenshots: screenshots
                },
                success: function (response) {
                    console.log("Screenshots saved successfully.");
                    const data = JSON.parse(response);
                    if (data.status === 'success') {
                        screenshotPaths = data.filepaths.slice(1); // All paths except the first one
                        typewriterScreenshotPath = data.filepaths[0]; // First path is for the #typewriter div
                    }
                    callback(null, response);
                },
                error: function (error) {
                    console.error("Error saving screenshots:", error);
                    callback(error);
                }
            });
        }

        function takeScreenshot(element, filename, callback) {
            html2canvas(element, {
                scale: 1,  // Reduce scale to lower resolution
                useCORS: true
            }).then(canvas => {
                // Reduce the quality and size by setting a lower quality value (0.1 = 10% quality)
                const imgData = canvas.toDataURL('image/png');
                callback(null, {
                    imgBase64: imgData,
                    filename: filename
                });
            }).catch(error => {
                console.error("Error capturing screenshot of element", error);
                callback(error);
            });
        }


        $("#continuarBTN").on('click', function () {
            $('.priceCounter').text($(".chocoletrasPlg__wrapperCode-dataUser-form-input-price").val());

            const elementsToCapture = $(".typewriterInner").toArray();
            const typewriterElement = $("#typewriter")[0];
            const timestamp = new Date().getTime();

            let captureCount = 0;

            // Take screenshot of #typewriter first
            takeScreenshot(typewriterElement, 'typewriter_screenshot_' + timestamp + '.png', function (error, typewriterScreenshot) {
                if (!error) {
                    screenshotData.push(typewriterScreenshot);
                    captureCount++;

                    elementsToCapture.forEach((element, index) => {
                        const uniqueFilename = 'screenshot_' + timestamp + '_' + (index + 1) + '.png';

                        takeScreenshot(element, uniqueFilename, function (error, screenshot) {
                            if (!error) {
                                screenshotData.push(screenshot);
                                captureCount++;

                                // If all elements are processed, save all screenshots
                                if (captureCount === elementsToCapture.length + 1) { // +1 for the #typewriter screenshot
                                    saveScreenshots(screenshotData, function (error, response) {
                                        if (!error) {
                                            console.log("All screenshots saved successfully.");
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
            });
        });

        $("#ctf_form").on("submit", function (event) {
            event.preventDefault();
            loader.css('height', '100%');
            console.log('submission');

            $('html, body').animate({
                scrollTop: $("#screenCenterLoader").offset().top - 200
            }, 0);


            const mainText = [$('#getText').val()];
            const chocoType = $('#chocoBase').val();
            const priceTotal = $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val();
            const fullName = $("#fname").val();
            const email = $("#email").val();
            const tel = $("#chocoTel").val();
            const postal = $("#cp").val();
            const city = $("#city").val();
            const province = $("#province").val();
            const address = $("#address").val();
            let picDate = $("#picDate").val();
            const shippingType = $("#ExpressActivator").val();
            const message = $("#message").val();
            const paymentSelected = $("#selectedPayment").val().toLowerCase();
            const uoi = $("#uniqueOrderID").val();
            const coupon = $("#usedCoupon").val();
            const affiliateID = $("#affiliateUserID").val();
            const loggedInUser = $("#loggedInUser").val();
            const prod_edit_id = new URLSearchParams(window.location.search).get('prod_edit');

            // console.log("Editing product with ID: ", prod_edit_id);


            if (!picDate) {
                picDate = new Date().toISOString().slice(0, 10);
            }

            $('.fraseInput').each(function () {
                mainText.push($(this).val());
            });

            if (paymentSelected === "") {
                loader.css('height', '0px');
                alert("Seleccione primero cualquier método de pago para continuar con el pedido!");
                return;
            }

            const dataToSend = {
                action: 'test_action',
                prod_edit: prod_edit_id,
                mainText: JSON.stringify(mainText),
                chocoType: chocoType,
                priceTotal: priceTotal,
                fname: fullName,
                email: email,
                tel: tel,
                postal: postal,
                city: city,
                province: province,
                address: address,
                message: message,
                paymentType: paymentSelected,
                uoi: uoi,
                coupon: coupon,
                screens: JSON.stringify(screenshotPaths),
                featured: typewriterScreenshotPath,
                picDate: picDate,
                affiliateID: affiliateID,
                loggedInUser: loggedInUser,
                shippingType: shippingType,
                nonce: ajax_variables.nonce,
            };

            // console.log(dataToSend);

            $.ajax({
                type: "POST",
                url: ajax_variables.ajax_url,
                data: dataToSend,
                success: function (response) {
                    // console.log("Response from server: ", response);
                    const parsedResponse = response;
                    // console.log("reformed respond: ", parsedResponse)
                    // Check if the response indicates success
                    if (parsedResponse.success) {
                        // Process succeeded
                        $("#ctf_form fieldset").removeAttr("style");
                        $("#ctf_form fieldset").css({
                            "display": "none",
                            "opacity": "0",
                        });
                        $("#ctf_form fieldset.paymentBox").css({
                            "display": "block",
                            "opacity": "1",
                        });

                        $('html, body').animate({
                            scrollTop: $("#screenCenterLoader").offset().top - 200
                        }, 0);

                        // console.info("Process succeeded: ", parsedResponse);
                        const insertedId = parsedResponse.Datos.inserted_id;
                        const amount = parsedResponse.Datos.amount;
                        const paymentSelected = parsedResponse.Datos.paymentType;
                        const fname = parsedResponse.Datos.fname;

                        // Update the form or trigger the payment
                        $('input[name="Ds_MerchantParameters"]').val(parsedResponse.Datos.merchantParameters);
                        $('input[name="Ds_Signature"]').val(parsedResponse.Datos.signature);

                        // For PayPal, update hidden inputs
                        $('#payPayPal input[name="item_name"]').val(fname);
                        $('#payPayPal input[name="item_number"]').val(insertedId);
                        $('#payPayPal input[name="amount"]').val(amount);

                        const cookieData = {
                            inserted_id: parsedResponse.Datos.inserted_id,
                            mainText: mainText,
                            chocoType: chocoType,
                            priceTotal: priceTotal,
                            fname: fullName,
                            email: email,
                            tel: tel,
                            postal: postal,
                            city: city,
                            province: province,
                            address: address,
                            picDate: picDate,
                            shippingType: shippingType,
                            express: new Date().toISOString(),
                            message: message,
                            paymentSelected: paymentSelected,
                            uoi: uoi,
                            coupon: coupon,
                            affiliateID: affiliateID,
                            loggedInUser: loggedInUser,
                            screenshots: screenshotPaths,
                            productBanner: typewriterScreenshotPath,
                        };

                        const cookieValue = encodeURIComponent(JSON.stringify(cookieData));

                        setCookie('chocol_cookie', true);
                        setCookie('chocoletraOrderData', cookieValue);

                        // console.log('Payment parameters set:', parsedResponse.Datos.merchantParameters);

                        // Trigger payment form submission or another action if needed
                        $("#proceedPayment").click();

                    } else {
                        console.error("Process failed: ", parsedResponse.Datos.message);
                    }
                },
                complete: function () {
                    setTimeout(function () {
                        loader.css('height', '0px');
                    }, 5000);
                },
                error: function (xhr, status, error) {
                    console.error("AJAX request failed: ", status, error);
                }
            });


        });

        function removeCookie(name) {
            document.cookie = name + '=; Max-Age=0; path=/;';
        }

        jQuery(document).ready(function () {
            let selectedGatway = null;
            let paymentMethod = ""; // Declare paymentMethod outside the click event handler

            $(".paymentPanel .paymentCard").on('click', function () {
                $(".paymentPanel .paymentCard").removeClass('active');
                $(".paymentPanel .paymentCard .selectionCircle").removeClass('active');
                $(this).addClass("active");
                $(this).find(".selectionCircle").addClass("active");

                selectedGatway = $(this).attr("data-gatway");
                paymentMethod = "";

                if (selectedGatway === 'paypal') {
                    paymentMethod = "payPal";
                } else if (selectedGatway === 'redsys') {
                    paymentMethod = "redsys";
                } else if (selectedGatway === 'bizum') {
                    paymentMethod = "bizum";
                } else if (selectedGatway === 'google') {
                    paymentMethod = "google";
                } else if (selectedGatway === 'apple') {
                    paymentMethod = "apple";
                }

                $("#selectedPayment").val(paymentMethod);
                console.log(paymentMethod);
                console.log(selectedGatway);

                // Show loader
                $("#loader").css('height', '100%');

                // var cookieValue = getCookie("chocoletraOrderData");
                // if (cookieValue) {
                //     var orderData = JSON.parse(decodeURIComponent(cookieValue));
                //     orderData.payment = paymentMethod;
                //     setCookie("chocoletraOrderData", encodeURIComponent(JSON.stringify(orderData)));
                // }

                // Retrieve cookie value
                var cookieValue = getCookie("chocoletraOrderData");
                if (cookieValue) {
                    var orderData = JSON.parse(decodeURIComponent(cookieValue));
                    var inserted_id = orderData.inserted_id; // Extract inserted_id from cookie

                    // Update payment method in cookie
                    orderData.payment = paymentMethod;
                    setCookie("chocoletraOrderData", encodeURIComponent(JSON.stringify(orderData)));
                    // console.log(orderData);

                    // AJAX request to update the payment method in the database
                    $.ajax({
                        url: ajax_variables.ajax_url, // Replace with your AJAX handler URL if necessary
                        type: 'POST',
                        data: {
                            action: 'update_payment_method', // Your custom action for handling the request
                            order_id: inserted_id, // ID from the cookie
                            payment_method: paymentMethod
                        },
                        success: function (response) {
                            // Handle the response
                            // console.log('Payment method updated successfully:', response);
                        },
                        error: function (xhr, status, error) {
                            console.error('Error updating payment method:', error);
                        }
                    });
                }

                // console.log(orderData); // To check if the cookie is updated correctly
                return selectedGatway; // Return only selectedGatway here
            });

            $("#proceedPayment").on('click', function () {
                console.log(selectedGatway, paymentMethod);
                if (selectedGatway === 'paypal') {
                    $("#selectedPayment").val("PayPal");
                    $("#payPayPal").submit();
                } else if (selectedGatway === 'redsys') {
                    $("#selectedPayment").val("Redsys");
                    $("#payRedsys").submit();
                } else if (selectedGatway === 'bizum') {
                    $("#selectedPayment").val("Bizum");
                    $("#payBizum").submit();
                } else if (selectedGatway === 'google') {
                    $("#selectedPayment").val("Google Pay");
                    $("#payGoogle").submit();
                } else if (selectedGatway === 'apple') {
                    $("#selectedPayment").val("Apple Pay");
                    $("#payGoogle").submit();
                } else {
                    alert("Select any of the payment first!");
                }
                // var checkCookieUpdated = setInterval(function () {
                //     var updatedCookieValue = getCookie("chocoletraOrderData");
                //     if (updatedCookieValue) {
                //         var updatedOrderData = JSON.parse(decodeURIComponent(updatedCookieValue));
                //         if (updatedOrderData.payment === paymentMethod) {
                //             clearInterval(checkCookieUpdated);

                //             // Hide loader after updating the cookie
                //             $("#loader").css('height', '0%');


                //         }
                //     }
                // }, 200); // Check every 200ms
            });

            jQuery("#cancelProcessPaiment").on('click', function () {
                loader.css('height', '100%');
                $.ajax({
                    type: "post",
                    url: ajax_variables.ajax_url,
                    dataType: "json",
                    data: "action=cancelProcess",
                    error: function (e) {
                        console.log(e);
                    },
                    success: function (e) {
                        removeCookie('chocoletraOrderData');
                        removeCookie('chocol_cookie');
                        removeCookie('paypamentType');
                        window.location.replace(ajax_variables.pluginPageUrl);
                    },
                });
            });

            jQuery("#editOrder").on('click', function () {
                loader.css('height', '100%');
                removeCookie('chocoletraOrderData');
                removeCookie('chocol_cookie');
                removeCookie('paypamentType');
            });
        });

        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length === 2) return parts.pop().split(";").shift();
        }

        function setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        let currentShippingMethod = 'normal';
        $('#ctf_form .shippingPanel>.expressShipping').on('click', function () {
            if (currentShippingMethod !== 'express') {
                $('#ctf_form .shippingPanel>div').removeClass('selected');
                $('#ctf_form .shippingPanel .standardShipping').hide();
                $('#ctf_form .shippingPanel .shippingExpress').show();
                $(this).addClass('selected');

                $("#ExpressActivator").val('on');
                currentShippingMethod = 'express';

                let getPrice = $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val();
                let totalPrice = Number(getPrice) + Number($("#expressShipingPrice").val());
                $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val(totalPrice);

                $('.priceCounter').text(totalPrice);
            }
        });

        $('#ctf_form .shippingPanel>.normalShipping').on('click', function () {
            if (currentShippingMethod !== 'normal') {
                $('#ctf_form .shippingPanel>div').removeClass('selected');
                $('#ctf_form .shippingPanel .standardShipping').show();
                $('#ctf_form .shippingPanel .shippingExpress').hide();
                $(this).addClass('selected');

                $("#ExpressActivator").val('off');
                currentShippingMethod = 'normal';

                let getPrice = $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val();
                let totalPrice = Number(getPrice) - Number($("#expressShipingPrice").val());
                $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val(totalPrice);
                $('.priceCounter').text(totalPrice);
            }
        });


        var current_fs, next_fs, previous_fs; // Fieldsets
        var current = 1; // Current step
        var steps = $("fieldset").length; // Number of fieldsets

        setProgressBar(current);

        // Next button click
        $(".next").click(function () {
            current_fs = $(this).parents('fieldset');
            next_fs = $(this).parents('fieldset').next();

            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // for making fieldset appear animation
                    var opacity = 1 - now;

                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
            setProgressBar(++current);
        });

        // Previous button click
        $(".previous").click(function () {
            current_fs = $(this).parents('fieldset');
            previous_fs = $(this).parents('fieldset').prev();

            // Remove class active
            $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

            // Show the previous fieldset
            previous_fs.show();

            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // for making fieldset appear animation
                    var opacity = 1 - now;

                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    previous_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
            setProgressBar(--current);
        });

        // Progress bar click
        $("#progressbar li:first").click(function () {
            var index = $(this).index();
            if (index + 1 !== current) {
                // Remove active class from all progress bar steps
                $("#progressbar li").removeClass("active");

                // Add active class to the clicked step and all previous steps
                for (var i = 0; i <= index; i++) {
                    $("#progressbar li").eq(i).addClass("active");
                }

                // Hide the current fieldset
                current_fs = $("fieldset:visible");
                current_fs.animate({ opacity: 0 }, {
                    step: function (now) {
                        var opacity = 1 - now;

                        current_fs.css({
                            'display': 'none',
                            'position': 'relative'
                        });
                    },
                    duration: 500
                });

                // Show the corresponding fieldset
                next_fs = $("fieldset").eq(index);
                next_fs.show().css({ 'opacity': 0 }).animate({ opacity: 1 }, 500);

                // Update the current step
                current = index + 1;
                setProgressBar(current);
            }
        });

        function setProgressBar(curStep) {
            var percent = parseFloat(100 / steps) * curStep;
            percent = percent.toFixed();
            $(".progress-bar")
                .css("width", percent + "%")
        }


        $(".submit").click(function () {
            return false;
        })



        $.ajax({
            url: ajax_variables.ajax_url,
            method: 'POST',
            data: {
                action: 'get_calendar_settings'
            },
            success: function (response) {
                // console.log(response

                var disableDays = response.disable_days || [];
                var disableDatesString = response.disable_dates || '';
                var disableMonthsDays = response.disable_months_days || { months: [], days: [] };

                var disableDates = disableDatesString.split(',').map(function (date) {
                    return date.trim();
                });

                // console.log("Disable Days:", disableDays); 
                // console.log("Disable Dates:", disableDates); 
                // console.log("Disable Months and Days:", disableMonthsDays);

                $("#picDate").flatpickr({
                    minDate: "today",
                    defaultDate: "today",
                    dateFormat: "Y-m-d",
                    locale: "es",
                    disable: [
                        function (date) {
                            return disableDays.includes(date.getDay().toString());
                        },
                        // Disable specific dates
                        function (date) {
                            var formattedDate = flatpickr.formatDate(date, "Y-m-d");
                            return disableDates.includes(formattedDate);
                        },
                        function (date) {
                            var month = date.getMonth();
                            var day = date.getDay();
                            if (disableMonthsDays.months.includes(month.toString()) && disableMonthsDays.days.includes(day.toString())) {
                                return true;
                            }
                            return false;
                        }
                    ],
                    onChange: function (selectedDates, dateStr, instance) {
                        var selectedDate = selectedDates[0];
                        var selectedDay = selectedDate.getDay();
                        var priceInput = document.querySelector(".chocoletrasPlg__wrapperCode-dataUser-form-input-price");
                        var previousDate = instance._previousDate || null;
                        var previousDay = previousDate ? previousDate.getDay() : null;

                        if (priceInput) {
                            var currentValue = parseFloat(priceInput.value) || 0;

                            if (selectedDay === 6 && previousDay !== 6) {
                                var finalValSat = currentValue + 5;
                                priceInput.value = finalValSat;
                                $('.priceCounter').text(finalValSat);
                                $('#counter').text(finalValSat);
                            } else if (selectedDay !== 6 && previousDay === 6) {
                                var finalValNotSat = currentValue - 5;
                                priceInput.value = finalValNotSat;
                                $('.priceCounter').text(finalValNotSat);
                                $('#counter').text(finalValNotSat);
                            }

                            instance._previousDate = selectedDate;
                        }
                    }
                });


            },
            error: function (xhr, status, error) {
                console.error('AJAX Error:', status, error);
            }
        });


        let couponCondition = false;
        $('#couponApply').click(function () {
            if (couponCondition) {
                alert('Ya utilizaste un cupón antes en este pedido.')
                return;
            }
            var couponCode = $('#coupon').val();

            if (couponCode === '') {
                alert('Por favor ingrese un código de cupón.');
                return;
            }

            $(this).prop('disabled', true);
            $(this).find('span').css('display', 'none');
            $(this).find('.chocoletrasPlg-spiner-ring').css('display', 'block');

            $.ajax({
                url: ajax_variables.ajax_url,
                method: 'POST',
                data: {
                    action: 'validate_coupon',
                    coupon: couponCode
                },
                success: function (response) {
                    if (response.success) {
                        $("#usedCoupon").val(couponCode);
                        // alert('Coupon is valid. Discount: ' + response.data.discount + ' ' + response.data.type + '. Remaining uses: ' + response.data.remaining_usage);
                        couponCondition = true;
                        $('#couponApply .chocoletrasPlg-spiner-ring').css('display', 'none');
                        $('#couponApply span').css('display', 'block');
                        $('#couponApply span').text('Aplicado!');
                        if (response.data.type === 'fixed') {
                            let priceTotal = $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val();
                            let afterDiscount = Number(priceTotal) - response.data.discount;
                            $('.priceCounter').text(afterDiscount);
                            $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val(afterDiscount);
                            $(".couponSection .couponResponse").text(`Cupón aplicado obtenga ${response.data.discount}€ descuento!`);
                        } else if (response.data.type === 'percentage') {
                            let priceTotal = $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val();
                            let discountValue = (Number(priceTotal) * response.data.discount) / 100;
                            let afterDiscount = Number(priceTotal) - discountValue;
                            $('.priceCounter').text(afterDiscount.toFixed(2));
                            $('.chocoletrasPlg__wrapperCode-dataUser-form-input-price').val(afterDiscount.toFixed(2));
                            $(".couponSection .couponResponse").text(`Cupón aplicado obtenga ${response.data.discount}% descuento!`);
                        } else {
                            console.log('Tipo de descuento desconocido');
                        }

                    } else {
                        $('#couponApply').prop('disabled', false);
                        $('#couponApply span').css('display', 'block');
                        $('#couponApply span').text('Aplicar');
                        $('#couponApply .chocoletrasPlg-spiner-ring').css('display', 'none');
                        alert('Error: ' + response.data.message);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', status, error);
                },
                complete: function () {
                    if (!couponCondition) {
                        $('#couponApply').prop('disabled', false);
                        $('#couponApply span').text('Aplicar');
                        $('#couponApply .chocoletrasPlg-spiner-ring').css('display', 'none');
                    }
                }
            });
        });

        $(".couponSection p").on('click', function () {
            $(this).parents('.couponSection').toggleClass('open');
        })

        let scrollerCookie = getCookie("chocoletraOrderData");

        if (scrollerCookie && window.innerWidth <= 768) {
            window.onload = function () {
                document.getElementById('ctf_form').scrollIntoView({ behavior: 'smooth' });
                console.log('scroll top');
            };
        }

    });

    function getQueryParam(param) {
        let urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    if (getQueryParam("payment") === "true") {
        var counter = 40;
        var interval = setInterval(function () {
            counter--;
            $("#countdownRedirect").text(counter);
            if (counter <= 0) {
                clearInterval(interval);
                window.location.href = ajax_variables.pluginPageUrl;
            }
        }, 1000);
    } else {
        $(".thankYouCard span").hide();
    }

    $("#pricingTableBtn").on('click', function () {
        $("#pricingTable").toggleClass('open');
    })


    const typedImagesContainer = document.querySelector(".typed-images");
    const cursor = document.querySelector(".cursor");

    const imgWordsArray = [
        // First word "Tus"
        [
            `${ajax_variables.pluginUrl}img/letters/Claro/heart.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/t.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/u.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/heart.webp`,
            " ",
            `${ajax_variables.pluginUrl}img/letters/Claro/f.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/r.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/a.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/s.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/e.webp`
        ],
        // Second word "Frase"
        [
            `${ajax_variables.pluginUrl}img/letters/Claro/heart.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/t.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/u.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/s.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/heart.webp`,
            " ",
            `${ajax_variables.pluginUrl}img/letters/Claro/s.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/a.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/l.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/u.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/d.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/o.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/s.webp`
        ],
        // Third word "Deseos"
        [
            `${ajax_variables.pluginUrl}img/letters/Claro/heart.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/t.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/u.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/s.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/heart.webp`,
            " ",
            `${ajax_variables.pluginUrl}img/letters/Claro/d.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/e.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/s.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/e.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/o.webp`,
            `${ajax_variables.pluginUrl}img/letters/Claro/s.webp`
        ]
    ];

    let wordIndex = 0; // Track the current word
    let imgArrayIndex = 0; // Track the current image in the word
    let imageElements = []; // Store added image elements and spacing divs for removal

    // Erase the images and spaces for the current word
    const eraseImages = () => {
        if (imageElements.length > 0) {
            cursor.classList.remove('blink');
            const lastElement = imageElements.pop(); // Get the last added element (image or space)
            lastElement.remove(); // Remove it from the DOM

            setTimeout(eraseImages, 80); // Erase one element at a time
        } else {
            cursor.classList.add('blink');
            wordIndex++;
            if (wordIndex >= imgWordsArray.length) {
                wordIndex = 0; // Loop back to the first word
            }
            setTimeout(typeImages, 1000); // Start typing the next word
        }
    };

    // Type out the images and spaces for the current word
    const typeImages = () => {
        const currentWord = imgWordsArray[wordIndex];

        if (imgArrayIndex < currentWord.length) {
            cursor.classList.remove('blink');

            if (currentWord[imgArrayIndex] === " ") {
                // Create a spacer using CSS
                const spacer = document.createElement("div");
                spacer.style.display = "inline-block";
                spacer.style.width = "0px"; // Adjust the width of the space
                typedImagesContainer.appendChild(spacer);
                imageElements.push(spacer); // Keep track of the spacer div
            } else {
                // Create new img element and add it to the container
                const newImg = document.createElement("img");
                newImg.src = currentWord[imgArrayIndex];
                newImg.style.opacity = 1; // Show the image
                typedImagesContainer.appendChild(newImg);
                imageElements.push(newImg); // Keep track of added images
            }

            imgArrayIndex++;
            setTimeout(typeImages, 120); // Type next image after a small delay
        } else {
            cursor.classList.add('blink');
            if (wordIndex === 0) {
                // Insert a line break after the first word
                const lineBreak = document.createElement("br");
                typedImagesContainer.appendChild(lineBreak);
                imageElements.push(lineBreak); // Keep track of the line break
            }
            setTimeout(() => {
                imgArrayIndex = 0; // Reset the image index for the next word
                eraseImages();
            }, 1000); // Hold the word for a second before erasing
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        typeImages();
    });






}(jQuery));
