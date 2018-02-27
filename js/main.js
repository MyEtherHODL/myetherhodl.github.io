(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var warningField = document.querySelector('.send .modal__warning'),
        accountField = document.querySelector('.send .modal__account'),
        manuallyField = document.querySelector('.send .modal__manually'),
        status = document.querySelector('.modal__status'),
        body = document.querySelector('body'),
        touchStart = 0,
        touchEnd = 0,
        mouseDown,
        mouseUp,
        curScroll = 0;

    if (document.querySelector('.modal-wrap.withdraw .modal__form').classList.contains('none')) {
      document.querySelector('.modal-wrap.withdraw').classList.remove('auto-height');
    }
    if (document.querySelector('.modal-wrap.send .modal__warning').classList.contains('none')) {
      document.querySelector('.modal-wrap.send').classList.remove('auto-height');
    }
    if (document.querySelector('.modal-wrap.check .modal__form').classList.contains('none')) {
      document.querySelector('.modal-wrap.check').classList.remove('auto-height');
    }

    document.querySelector('.faq-btn').addEventListener('click', function (e) {
      document.querySelector('.modal-wrap.faq').classList.add('show');
      showPopup();
    });

    document.querySelector('.security-btn').addEventListener('click', function (e) {
      document.querySelector('.modal-wrap.security').classList.add('show');
      showPopup();
    });

    document.querySelector('.check-balance-btn').addEventListener('click', function (e) {
      document.querySelector('.modal-wrap.check').classList.add('show');
      showPopup();

      document.querySelector('.check .modal__form').classList.remove('none');
      document.querySelector('.check .modal__account').classList.add('none');
      document.querySelector('.modal-wrap.check').classList.add('auto-height');
    });

    document.querySelector('.promo__btn.hold').addEventListener('click', function(e) {
      document.querySelector('.modal-wrap.send').classList.add('show');
      showPopup();
      status.classList.add('none');
      status.classList.remove('success');
      document.querySelector('.modal__status-str').innerText ='Pending: ';
    });

    document.querySelector('.promo__btn.withdraw').addEventListener('click', function(e) {
      document.querySelector('.modal-wrap.withdraw').classList.add('show');
      showPopup();
      
      e.preventDefault();
      document.querySelector('.withdraw .modal__form').classList.add('none');
      document.querySelector('.withdraw .modal__account').classList.remove('none');
      document.querySelector('.modal-wrap.withdraw').classList.remove('auto-height');
    });

    document.querySelector('.withdraw-now-btn').addEventListener('click', function(e) {
      document.querySelector('.modal-wrap.withdraw').classList.add('show');
      body.classList.add('double');
      
      e.preventDefault();
      document.querySelector('.withdraw .modal__form').classList.add('none');
      document.querySelector('.withdraw .modal__account').classList.remove('none');
      document.querySelector('.modal-wrap.withdraw').classList.remove('auto-height');
    });

    document.querySelector('.send-more-btn').addEventListener('click', function(e) {
      document.querySelector('.modal-wrap.send').classList.add('show');
      body.classList.add('double');
      document.querySelector('.send .modal__title').innerText = 'Send More Ethers';
      document.querySelector('#wallet_one_year + label').innerText = 'Current term';
    });

    document.querySelector('.send-btn').addEventListener('click', function(e) {
      e.preventDefault();
      status.classList.remove('none');
      setTimeout(function() {
        status.classList.add('success')
        document.querySelector('.modal__status-str').innerText ='Success: ';
      }, 2000);
    });

    document.querySelector('.check-btn').addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.withdraw .modal__form').classList.add('none');
      document.querySelector('.withdraw .modal__account').classList.remove('none');
      document.querySelector('.modal-wrap.withdraw').classList.remove('auto-height');
    });

    document.querySelector('.check-bal-btn').addEventListener('click', function (e) {
      e.preventDefault();
      if($('#check_address').val().length == 42){
        document.querySelector('.check .modal__form').classList.add('none');
        document.querySelector('.check .modal__account').classList.remove('none');
        document.querySelector('.modal-wrap.check').classList.remove('auto-height');
      }
    });

    document.querySelectorAll('[name="wallet_type"]').forEach(function(item, i, arr) {
      item.addEventListener('change', function (e) {
        if (item.value == 'ledger' || item.value == 'metamask / mist') {
          warningField.classList.remove('none');
          accountField.classList.add('none');
          manuallyField.classList.add('none');
          status.classList.add('none');
          status.classList.remove('success');
        } else {
          warningField.classList.add('none');
          accountField.classList.add('none');
          manuallyField.classList.remove('none');
          status.classList.add('none');
          status.classList.remove('success');
          document.querySelector('.modal-wrap.send').classList.remove('auto-height');
        }
      });
    });

    document.querySelectorAll('[name="withdraw_wallet_type"]').forEach(function(item, i, arr) {
      item.addEventListener('change', function (e) {
        if (item.value == 'ledger' || item.value == 'metamask / mist') {
          document.querySelector('.withdraw .modal__mist').classList.remove('none');
          document.querySelector('.withdraw .modal__manually').classList.add('none');
        } else {
          document.querySelector('.withdraw .modal__mist').classList.add('none');
          document.querySelector('.withdraw .modal__manually').classList.remove('none');
        }
      });
    });

    document.querySelectorAll('[name="check_wallet_type"]').forEach(function(item, i, arr) {
      item.addEventListener('change', function (e) {
        if (item.value == 'ledger' || item.value == 'metamask / mist') {
          document.querySelector('.check .modal__mist').classList.remove('none');
          document.querySelector('.check .modal__manually').classList.add('none');
        } else {
          document.querySelector('.check .modal__mist').classList.add('none');
          document.querySelector('.check .modal__manually').classList.remove('none');
        }
      });
    });

    document.querySelector('#eth_amount').addEventListener('keyup', function (e) {
      isNumber(e.currentTarget);
    });

    document.querySelectorAll('.modal__radio.term .modal__radio-label').forEach(function(item, i, arr) {
      item.addEventListener('mouseover', function(e) {
        var d = new Date(),
            dd = d.getDate() > 10 ? d.getDate() : ('0' + d.getDate()),
            mm = d.getMonth() + 1 > 10 ? d.getMonth() + 1 : ('0' + (d.getMonth() + 1)),
            yyyy = d.getFullYear();

        if (e.target.previousElementSibling.value == 1) {
          yyyy = +yyyy + 1;
        } else if (e.target.previousElementSibling.value == 2) {
          yyyy = +yyyy + 2;
        } else {
          yyyy = +yyyy + 3;
        }

        e.target.nextElementSibling.querySelector('span').innerText = dd + '/' + mm + '/' + yyyy;
      });
    });

    body.addEventListener('mousedown', function (e) {
      mouseDown = e.target;
    });

    body.addEventListener('mouseup', function (e) {
      mouseUp = e.target
      if (mouseDown == mouseUp) {
        popup(e);
      }
    });

    body.addEventListener('touchstart', function (e) {
      touchstart = window.pageYOffset || document.documentElement.scrollTop;
    });

    body.addEventListener('touchend', function (e) {
      touchEnd = window.pageYOffset || document.documentElement.scrollTop;
      if (touchStart == touchEnd) {
        popup(e);
      }
    });

    function showPopup() {
      curScroll = window.pageYOffset;
      body.style.top = '-' + curScroll + 'px';
      body.classList.add('overlay');
    }

    function popup (e) {
      if (e.target.className == 'modal__close' || e.target.classList.contains('modal-wrap')) {
        e.preventDefault();
        document.querySelector('.modal-wrap.show').classList.remove('show');
        if (document.querySelector('.modal-wrap.show')) {
          body.classList.remove('double');
          document.querySelector('.send .modal__title').innerText = 'Send Ethers';
          document.querySelector('#wallet_one_year + label').innerText = '1 year';
        } else {
          body.classList.remove('overlay');
          window.scrollTo(0, curScroll);
        }
      }
    }

    function isNumber(input) {
      input.value = input.value.replace(/[^0-9\.]/g, '');
    }
  });
})();