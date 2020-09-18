// ::: GLobal Variables :::

// Submit the vote
$('#login-form').submit(async function (e) {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let rememberMe = document.getElementById('formCheck').checked;

    if (!email || !password) {
        errorAlert('الرجاء ادخال الايميل وكلمة المرور');
        return;
    }

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe })
    });
    try {
        const data = await response.json();
        // Show alert if v or show error otherwise
        if (response.status == 200) {
            successAlertTimer(data.message, `${location.origin}`)
        } else {
            errorAlert(data.message);
        }
    }
    catch (error) {
        console.log(error);
        errorAlert('مشكلة في السيرفر', 500);
    }
});

$('#register-form').submit(async function (e) {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;


    if (!email || !password || !username || !password2) {
        errorAlert('الرجاء ادخال الاسم والايميل وكلمة المرور');
        return;
    }

    if (password !== password2) {
        errorAlert('كلمة المرور غير متطابقة');
        return;
    }


    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
    });

    try {
        const data = await response.json();
        // Show alert if v or show error otherwise
        if (response.status == 200) {
            successAlertTimer(data.message, `${location.origin}`)
        } else {
            errorAlert(data.message);
        }
    }
    catch (error) {
        console.log(error);
        errorAlert('مشكلة في السيرفر', 500);
    }
});


// Submit the vote
$('#forgot-form').submit(async function (e) {

    e.preventDefault();


    const email = document.getElementById('forgot-email').value;


    if (!email) {
        errorAlert('الرجاء إدخال الإيميل');
        return;
    }
    $('#btn-msg').css('display', 'none');
    $('#btn-spinner').css('display', 'inline-block');
    const response = await fetch('/auth/forgotpassword', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    $('#btn-msg').css('display', 'inline-block');
    $('#btn-spinner').css('display', 'none');
    try {
        const data = await response.json();
        // Show alert if v or show error otherwise
        if (response.status == 200) {
            successAlertTimer(data.message, `${location.origin}/auth/login`);
        } else {
            errorAlert(data.message);
        }
    }
    catch (error) {
        console.log(error);
        errorAlert('مشكلة في السيرفر', 500);
    }
});

// Submit the vote
$('#reset-form').submit(async function (e) {

    e.preventDefault();


    const password = document.getElementById('reset-password1').value;
    const password2 = document.getElementById('reset-password2').value;


    if (!password || !password2) {
        errorAlert('الرجاء ادخال كلمة المرور');
        return;
    }

    if (password !== password2) {
        errorAlert('كلمة المرور غير متطابقة');
        return;
    }

    $('#btn-msg').css('display', 'none');
    $('#btn-spinner').css('display', 'inline-block');
    const response = await fetch(window.location.pathname, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ password })
    });

    $('#btn-msg').css('display', 'inline-block');
    $('#btn-spinner').css('display', 'none');
    try {
        const data = await response.json();
        // Show alert if v or show error otherwise
        if (response.status == 200) {
            successAlertTimer(data.message, `${location.origin}`)
        } else {
            errorAlert(data.message);
        }
    }
    catch (error) {
        console.log(error);
        errorAlert('مشكلة في السيرفر', 500);
    }
});


















