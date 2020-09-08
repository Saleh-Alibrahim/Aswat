// ::: GLobal Variables :::

// Submit the vote
$('#login-form').submit(async function (e) {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let rememberMe = document.getElementById('formCheck').checked;

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


const checkResponse = async function (response) {
    try {
        const data = await response.json();
        // Show alert if failed or show error otherwise
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: data.message,
                showConfirmButton: false,
                timer: 1500,
                onAfterClose: () => {
                    location.href = `${location.origin}`;
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: data.message,
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
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return false;
    }
    return true;
}
















