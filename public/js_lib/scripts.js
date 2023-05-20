(function ($) {
  /* Preloader */
  (function () {
    emailjs.init('-yyiieKOrUCt0R0G_');
  })();
  $(window).on('load', function () {
    let preloaderFadeOutTime = 500;
    function hidePreloader() {
      let preloader = $('.spinner-wrapper');
      setTimeout(function () {
        preloader.fadeOut(preloaderFadeOutTime);
      }, 500);
    }
    hidePreloader();
  });

  /* Navbar Scripts */
  // jQuery to collapse the navbar on scroll
  $(window).on('scroll load', function () {
    if ($('.navbar').offset().top > 60) {
      $('.fixed-top').addClass('top-nav-collapse');
    } else {
      $('.fixed-top').removeClass('top-nav-collapse');
    }
  });

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $(function () {
    $(document).on('click', 'a.page-scroll', function (event) {
      let $anchor = $(this);
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $($anchor.attr('href')).offset().top,
          },
          600,
          'easeInOutExpo'
        );
      event.preventDefault();
    });
  });

  // closes the responsive menu on menu item click
  $('.navbar-nav li a').on('click', function (event) {
    if (!$(this).parent().hasClass('dropdown')) $('.navbar-collapse').collapse('hide');
  });

  /* Contact Form */
  $('#contactForm')
    .validator()
    .on('submit', function (event) {
      if (event.isDefaultPrevented()) {
        // handle the invalid form...
        cformError();
        csubmitMSG(false, 'الرجاء اكمال جميع الحقول');
      } else {
        // everything looks good!
        event.preventDefault();
        csubmitForm();
      }
    });

  function csubmitForm() {
    // initiate letiables with form content
    const subject = $('#cname').val();
    const email = $('#cemail').val();
    const message = $('#cmessage').val();
    emailjs.send('service_k6fnjcc', 'template_fx9zrxn', { subject, email, message }).then(
      function (response) {
        cformSuccess();
      },
      function (error) {
        cformError();
      }
    );
    const msg = '.... يتم الأن ارسال الرسالة';
    const msgClasses = 'h3 text-center';
    $('#cmsgSubmit').removeClass().addClass(msgClasses).text(msg);
  }

  function cformSuccess() {
    $('#contactForm')[0].reset();
    csubmitMSG(true, 'شكرا لك . تم ارسال الرسالة');
    $('input').removeClass('notEmpty'); // resets the field label after submission
    $('textarea').removeClass('notEmpty'); // resets the field label after submission
  }

  function cformError() {
    $('#contactForm')
      .removeClass()
      .addClass('shake animated')
      .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass();
      });
  }

  function csubmitMSG(valid, msg) {
    let msgClasses = '';
    if (valid) {
      msgClasses = 'h3 text-center tada animated';
    } else {
      msgClasses = 'h3 text-center';
    }
    $('#cmsgSubmit').removeClass().addClass(msgClasses).text(msg);
  }

  /* Back To Top Button */
  // create the back to top button
  $('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
  let amountScrolled = 700;
  $(window).scroll(function () {
    if ($(window).scrollTop() > amountScrolled) {
      $('a.back-to-top').fadeIn('500');
    } else {
      $('a.back-to-top').fadeOut('500');
    }
  });

  /* Removes Long Focus On Buttons */
  $('.button, a, button').mouseup(function () {
    $(this).blur();
  });
})(jQuery);
