// ::: GLobal Variables :::

// Submit the vote
$('#login-form').submit(async function (e) {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let rememberMe = document.getElementById('formCheck').checked;

    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            heightAuto: false,
            text: 'الرجاء ادخال الايميل وكلمة المرور',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return;
    }

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe })
    });

    await checkResponse(response);
});

$('#register-form').submit(async function (e) {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;


    if (!email || !password || !username || !password2) {
        Swal.fire({
            heightAuto: false,
            icon: 'error',
            text: 'الرجاء ادخال الاسم والايميل وكلمة المرور',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return;
    }

    if (!checkPasswordsMatch(password, password2)) {
        return;
    }


    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
    });

    await checkResponse(response);
});


// Submit the vote
$('#forgot-form').submit(async function (e) {

    e.preventDefault();


    const email = document.getElementById('forgot-email').value;


    if (!email) {
        Swal.fire({
            icon: 'error',
            heightAuto: false,
            text: 'الرجاء إدخال الإيميل',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
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
    await checkResponse(response);
});

// Submit the vote
$('#reset-form').submit(async function (e) {

    e.preventDefault();


    const password = document.getElementById('reset-password1').value;
    const password2 = document.getElementById('reset-password2').value;


    if (!password || !password2) {
        Swal.fire({
            icon: 'error',
            heightAuto: false,
            text: 'الرجاء ادخال كلمة المرور',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return;
    }

    if (!checkPasswordsMatch(password, password2)) {
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
    await checkResponse(response);
});



const checkResponse = async function (response) {
    try {
        const data = await response.json();
        // Show alert if failed or show error otherwise
        if (data.success) {
            Swal.fire({
                icon: 'success',
                text: data.message,
                heightAuto: false,
                showConfirmButton: false,
                timer: 1500,
                onAfterClose: () => {
                    location.href = `${location.origin}`;
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                text: data.message,
                heightAuto: false,
                confirmButtonText: 'المحاولة مرة اخرى',
                confirmButtonColor: '#00bfd8',
            });
        }
    }
    catch (error) {
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 500,
            text: 'مشكلة في السيرفر',
            heightAuto: false,
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
    }

};

// Check passwords match
function checkPasswordsMatch(password1, password2) {
    if (password1 !== password2) {
        Swal.fire({
            icon: 'error',

            text: 'كلمة المرور غير متطابقة',
            heightAuto: false,
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return false;
    }
    return true;
}
















