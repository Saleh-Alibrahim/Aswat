// ::: GLobal Variables :::
const selectAlert = document.getElementById('select-alert');
const voteAlert = document.getElementById('vote-alert');
const pollID = document.getElementById('pollID').value;
const pollList = JSON.parse(localStorage.getItem('pollList')) || [];
let recaptchaToken;

// Submit the vote
document.getElementById('vote-button').addEventListener('click', async function (e) {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    // Check if the user selected option
    if (!checkSelectedAlert(selectedOption)) {
        return;
    }


    // Check if the user already voted 
    if (!checkLocalStorage()) {
        return;
    }

    // Get the selected option id
    const optionID = selectedOption.id;

    const response = await fetch('/vote', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ optionID, token: recaptchaToken, pollID })
    });
    try {
        const data = await response.json();

        // Show alert if v or show error otherwise
        if (data.status == 200) {
            addToLocalStorage();
            Swal.fire({
                icon: 'success',
                title: data.message,
                confirmButtonText: 'الإنتقال الى النتائج',
                timer: 1500,
                confirmButtonColor: '#00bfd8',
                onAfterClose: () => {
                    location.href = `${location.origin}/${pollID}/r`;
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: data.status,
                text: data.message,
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

});

// Make the result button goes to the result page
$('result-button').click((e) => {
    window.location.href = window.location.href + `/r`;
});

function checkSelectedAlert(selectedOption) {
    // Get the selected option of the poll
    if (!selectedOption) {
        Swal.fire({
            icon: 'error',
            title: 'الرجاء اختيار صوت لتصويت',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return false;
    }
    return true;
}
function checkLocalStorage() {

    // Check if the user already voted
    if (pollList.includes(pollID)) {

        Swal.fire({
            icon: 'error',
            title: 'لا يمكن التصويت اكثر من مرة',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return false;
    }
    return true;
}

function addToLocalStorage() {
    // Add the poll id to the list and return true
    pollList.push(pollID);
    localStorage.setItem('pollList', JSON.stringify(pollList));
}

// Add the recaptcha token to the form
function runRecaptcha() {
    grecaptcha.ready(function () {
        // Do request for recaptcha token
        // Response is promise with passed token
        grecaptcha.execute('6LdVI6kZAAAAACbNTvMKBFb7-eThFAU0VbsTLQI-', { action: 'validate_captcha' })
            .then(function (token) {
                // Add token value to form
                recaptchaToken = token;
            });
    });
}
// Call once at the first render to the page
runRecaptcha();

// Refresh the recaptcha token  every 1 minutes
setInterval(runRecaptcha, 60000);














