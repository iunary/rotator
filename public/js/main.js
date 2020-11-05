'use strict'

$(document).ready(function () {

    const formFn = function(target) {
        const form          = document.querySelector(`.content-container .${target}`);
        const urlsContainer = document.querySelector(`.content-container .${target} .urls-container`);
        const checkBox      = document.querySelector(`.${target} .auto-man-button-div input[type="checkbox"]`);
        const errorMsg      = $(`.${target} p.error-message`);
        const html          = `
                            <div class="form-row url-pair">
                                <div class="form-group col-2 mb-2">
                                    <input class="form-control destination-num" type="text" disabled value="3">
                                </div>

                                <div class="form-group col-7 mb-2">
                                    <input class="form-control destination-input" type="url" name="url" value="https://" placeholder="destination url..." autocomplete="off" required>
                                </div>

                                <div class="form-group col-3 mb-2 position-relative">
                                    <input class="form-control percent-input" type="number" name="perc" autocomplete="off" placeholder="%" required>
                                    <button class="btn btn-danger delete-btn position-absolute">
                                        <ion-icon name="close-outline"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        `;

        // add flields:
        const addFields = function() { 
            if( $( `.${target} .destination-input` ).length < 100 ) {
                errorMsg.fadeOut(); 
                $(urlsContainer).append(html);
                calcperc();
                inputFocus();
                calcDestinationIdx();
            }else{
                errorMsg.html(`Can't have more than 100 fields!`);
                errorMsg.fadeIn();
            }
        }

        const calcDestinationIdx = function() {
            const destIdx = $( `.${target} .destination-num` );

            $(destIdx).each((index, item) => {
                $(item).attr("value", index + 1);
            });
        }

        // initial percentage distribution:
        const calcperc = function() {
            $( `.${target} .percent-input` ).val( ( 100 / $( `.${target} .percent-input` ).length ).toFixed(0) );
        }

        // input percentage distribution:
        const recalc = function() {
            if(checkBox.checked === true){
                return;
            }

            let inps = $(`.${target} .percent-input`);
            let inputVal = parseFloat(this.value);

            if (inps.length > 1){
                this.value = inputVal.toFixed(0);  
                inps.not(this).val(((100 - inputVal) / (inps.length - 1)).toFixed(0));
            } else {
                this.value="100";
            }
        }

        const compareInputVal = function() {
            const inps = $(`.${target} input[type='url']`);
            const values = [];

            inps.each(function (index, item) {
                values.push(item.value);
            });

            const sortedValues = values.sort();
            for (let j = 0; j < values.length - 1; j++) {
                if (values[j] == values[j + 1]) {
                    errorMsg.html(`Can't have duplicate values!`);
                    errorMsg.fadeIn();
                    return false;
                }
            }
        }

        const comparePercentVal = function() {
            const inps = $(`.${target} input[type='number']`);
            const values = [];

            inps.each(function (index, item) {
                const inputVal = parseFloat(item.value);
                values.push(inputVal);
            });

            const total = values.reduce((acc, currVal) => acc + currVal);
            const containsNegativeVal = values.some(item => item < 0);


            if(containsNegativeVal) {
                errorMsg.html(`Percentage value cannot be negative!`);
                errorMsg.fadeIn();
                return false;
            }

            if(total > 100){
                errorMsg.html(`Percentage value cannot be greater than 100!`);
                errorMsg.fadeIn();
                return false;
            }

            if(total < 99){
                errorMsg.html(`Percentage value cannot be less than 100!`);
                errorMsg.fadeIn();
                return false;
            }
        }

        const changeSpan = function(e) {
            const span = $(`.auto-man-span-${target}`);

            if(checkBox.checked === true) {
                $(span).text('Manual');
            }else{
                $(span).text('Auto');
            }

        }

        const resetForm = function(e) {
            const allInputs = $(`.${target} input[type="text"] .name-input, 
                                .${target} input[type="url"], 
                                .${target} input[type="number"]`);

            $(allInputs).each((idx, item) => {
                $(item).val('');
            });

            $(`.${target} input[type="url"]`).val('https://');
            calcperc();
        }

        $( form )
            .on('submit', compareInputVal)
            .on('submit', comparePercentVal)
            .on('input', '.percent-input' , recalc)
            .on('click', '.delete-btn', function() {
                if( $( `.${target} .percent-input` ).length > 1 ) {
                    $( this ).parent().parent().remove();
                    errorMsg.fadeOut();
                    calcperc();
                    calcDestinationIdx();
                }else{
                    errorMsg.html(`Must have at least one input field!`);
                    errorMsg.fadeIn();
                }
            })
            .on('click', checkBox, changeSpan)
            .on('click', '.addFieldBtn', addFields)
            .on('click', '.reset-btn', resetForm);
        

        const inputFocus = function () {
            $( '.percent-input' ).focus(function() {
                this.value = "";
                errorMsg.fadeOut(); 
            });

            $( '.destination-input' ).focus(function() {
                errorMsg.fadeOut(); 
            });
        }

        
         // initial distribution:
        inputFocus();

        if(target === 'createForm'){
            calcperc();  
        }

        if(target === 'editForm'){
            calcDestinationIdx();
        }
    };


    // copy to clipboard
    const copyLink = function() {
        function copyToClipboard(text) {
            if (window.clipboardData && window.clipboardData.setData) {
                return clipboardData.setData("Text", text);
            } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                var textarea = document.createElement("textarea");
                textarea.textContent = text;
                textarea.style.position = "fixed";
                document.body.appendChild(textarea);
                var selection = document.getSelection();
                var range = document.createRange();
                range.selectNode(textarea);
                selection.removeAllRanges();
                selection.addRange(range);
                try {
                    return document.execCommand("copy");
                } catch (ex) {
                    console.warn("Copy to clipboard failed.", ex);
                    return false;
                } finally {
                    selection.removeAllRanges();
                    document.body.removeChild(textarea);
                }
            }
        }

        $(document).on("click", ".link-slug-copy", function(e) {
            const eElem = $(this);
            const linkID = eElem.parent().parent().parent().parent().attr('data-slug');
            const hostName = location.host;
            const text = `${hostName}/${linkID}`;
            const item = $(e.target);


            copyToClipboard(text);
            $(item).attr('title', 'Copied!').tooltip('_fixTitle').tooltip('show');
            setTimeout(function() {
                $(item).attr("data-original-title", 'Copy');
            }, 1000);
        });
    };


    // error message fade out
    const fadeOutError = function() {
        setTimeout(() => {
            $('header ul li.error-msg').fadeOut();
            $('header ul li.success-msg').fadeOut();
            $('#error-msg').fadeOut();
        }, 6000);
    };

    const darkMode = function() {
        const toggleSwitch = document.querySelector('#dark-mode-button input[type="checkbox"]');

        if (localStorage.theme) {
            if(localStorage.theme === 'dark') {
                $('#dark-icon').css('display', 'inline-block');

                if(toggleSwitch){
                    toggleSwitch.checked = true;
                }
            }else{
                $('#light-icon').css('display', 'inline-block');
                if(toggleSwitch){
                    toggleSwitch.checked = false;
                }
            }
        }else{
          $('#light-icon').css('display', 'inline-block');
            if(toggleSwitch){
                toggleSwitch.checked = false;
            }
        }

        function switchTheme(e) {
            let theme;

            if(e.target.checked) {
                theme = 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                $('#dark-icon').css('display', 'inline-block');
                $('#light-icon').css('display', 'none');
                localStorage.theme = theme;
            }else{
                theme = 'light';
                document.documentElement.setAttribute('data-theme', theme);
                $('#dark-icon').css('display', 'none');
                $('#light-icon').css('display', 'inline-block');
                localStorage.theme = theme;
            }
        }

        if(toggleSwitch){
            toggleSwitch.addEventListener("change", switchTheme, false);
        }
    };

    // Modal Animation
    const modalAnimation = function() {
        $(".modal").each(function (l) {
            $(this).on("show.bs.modal", function (l) {
                var o = $(this).attr("data-easein");
                "shake" == o
                    ? $(".modal-dialog").velocity("callout." + o)
                    : "pulse" == o
                    ? $(".modal-dialog").velocity("callout." + o)
                    : "tada" == o
                    ? $(".modal-dialog").velocity("callout." + o)
                    : "flash" == o
                    ? $(".modal-dialog").velocity("callout." + o)
                    : "bounce" == o
                    ? $(".modal-dialog").velocity("callout." + o)
                    : "swing" == o
                    ? $(".modal-dialog").velocity("callout." + o)
                    : $(".modal-dialog").velocity("transition." + o);
            });
        });
    };

    // populate buttons with item id
    const populate = function() {
        const deleteBtn = $('main table tbody .rotator-title [data-toggle="modal"]');
        const archiveForm = $('main .modal .modal-footer .archive-form');
        const deleteForm = $('main .modal .modal-footer .delete-form');

        $(deleteBtn).each(function (idx, item) {
            $(item).on("click", function(e) {
                const dataID = $(e.target.parentElement).attr('data-id');

                if($(deleteForm).hasClass('archive')){
                    deleteForm.attr('action', `/archive/delete/${dataID}?_method=DELETE`);
                }else{
                    deleteForm.attr('action', `/delete/${dataID}?_method=DELETE`);

                }

                if(archiveForm) {
                    archiveForm.attr('action', `/archive/${dataID}?_method=PUT`);
                }

            })
        })
    }


    const sidebarToggler = function() {
        const body = $("#body");
        const collapseBtn = $( "ion-icon[name*='chevron-back-outline']" );
        const expandBtn = $( "ion-icon[name*='chevron-forward-outline']" );

        if ($(window).width() < 576) {
            $("header .header-title").css('display', 'none');
            $("header ul li p").css('font-size', '12px');
            $("header ul li").removeClass('mr-3');
            $("header .header-toggle-btn").css('width', '22px');
        }


        /*======== 2. MOBILE OVERLAY ========*/
        if ($(window).width() < 768) {
            $("header .header-toggle-btn").css('display', 'block');

            collapseBtn.css({
                'transform' : 'rotate(180deg)',
                'transition' : ' transform 0.01s linear'
            });

            $("#body").removeClass("sidebar-minified");
            $(".header-light .content-wrapper footer .sidebar-toggle").css({"top": "2%", "left": "-1%"});

            $(".sidebar-toggle").on("click", function () {
                $("body").css("overflow", "hidden");
                $('body').prepend('<div class="mobile-sticky-body-overlay"></div>');
            });

            $(document).on("click", '.mobile-sticky-body-overlay', function (e) {
                $(this).remove();
                $("#body").removeClass("sidebar-mobile-in").addClass("sidebar-mobile-out");
                $("body").css("overflow", "auto");
            });
        }

        /*======== 3. SIDEBAR MENU ========*/
        var sidebar = $(".sidebar");
        if (sidebar.length != 0) {
            $(".sidebar .nav > .has-sub > a").click(function () {
                $(this).parent().siblings().removeClass('expand');
                $(this).parent().toggleClass('expand');
            });

            $(".sidebar .nav > .has-sub .has-sub > a").click(function () {
                $(this).parent().toggleClass('expand');
            });
        }


        /*======== 4. SIDEBAR TOGGLE FOR MOBILE ========*/
        if ($(window).width() < 768) {

            $(document).on("click", ".sidebar-toggle", function (e) {
                e.preventDefault();
                var min = "sidebar-mobile-in",
                min_out = "sidebar-mobile-out",
                body = "#body";
                $(body).hasClass(min)
                    ? $(body)
                        .removeClass(min)
                        .addClass(min_out)
                    : $(body)
                        .addClass(min)
                        .removeClass(min_out);
            });
        }

        /*======== 5. SIDEBAR TOGGLE FOR VARIOUS SIDEBAR LAYOUT ========*/

        if ($(window).width() >= 768) {
            $(".header-light .content-wrapper footer .sidebar-toggle").css({"position": "relative"});

            if (typeof window.isMinified === "undefined") {
                window.isMinified = false;
            }
            if (typeof window.isCollapsed === "undefined") {
                window.isCollapsed = false;
            }

            $("#sidebar-toggler").on("click", function () {

                if (body.hasClass("sidebar-fixed") || body.hasClass("sidebar-static")) {
                    $(this).addClass("sidebar-toggle").removeClass("sidebar-offcanvas-toggle");
                    if (window.isMinified === false) {  
                        body.removeClass("sidebar-collapse sidebar-minified-out").addClass("sidebar-minified");
                        collapseBtn.css({
                            'transform' : 'rotate(180deg)',
                            'transition' : ' transform 0.3s linear'
                        });
                        window.isMinified = true;
                    } else {
                        body.removeClass("sidebar-minified");
                        body.addClass("sidebar-minified-out");
                        collapseBtn.css({
                            'transform' : 'rotate(0deg)',
                            'transition' : ' transform 0.3s linear'
                        });
                        window.isMinified = false;
                    }
                }
            });
        }

        if ($(window).width() >= 768 && $(window).width() < 992) {
            if (body.hasClass("sidebar-fixed") || body.hasClass("sidebar-static")) {
                body.removeClass("sidebar-collapse sidebar-minified-out").addClass("sidebar-minified");
                window.isMinified = true;
            }
        }

    };


    // session destroy
    const sessionDestroy = function() {
        $(window).on("unload", function(e) {
            $.get('/session/destroy');
        });
    }; 

    // table hover
    const tableHover = function() {

        $('main table tbody tr').hover(function() {
            $('tr[data-slug="'+$(this).data('slug')+ '"]').toggleClass('hover');
        });
    };


    // tooltips
    const tooltips = function() {
        $( "[data-icon='icon']" ).tooltip();
    }

    // rotator link 
    const hostName = function() {
        const hostNameSpan = $('main table tbody tr .host-name');
        hostNameSpan.text(location.host);
    };

    sidebarToggler();
    hostName();
    tooltips();
    copyLink();
    fadeOutError();
    sessionDestroy();
    darkMode();
    modalAnimation();
    tableHover();
    populate();
    formFn('createForm');
    formFn('editForm');



});