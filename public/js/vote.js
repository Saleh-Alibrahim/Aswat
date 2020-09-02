// ::: GLobal Variables :::
const selectAlert = document.getElementById('select-alert');
const voteAlert = document.getElementById('vote-alert');
const pollID = document.getElementById('pollID').value;
const pollList = JSON.parse(localStorage.getItem('pollList')) || [];
let token, clintIpAddress;

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
        body: JSON.stringify({ optionID, token, ip: clintIpAddress, pollID })
    });
    try {
        const data = await response.json();

        // Show alert if v or show error otherwise
        if (data.status == 200) {
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
document.getElementById('result-button').addEventListener('click', (e) => {
    window.location.href = window.location.href + `/r`;
});

function checkSelectedAlert(selectedOption) {
    // Get the selected option of the poll
    if (!selectedOption) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Show the alert and then return
        if (selectAlert.classList.contains('hidden'))
            selectAlert.classList.remove('hidden');
        return false;
    } else {
        // Hide the alert and then continue
        if (!selectAlert.classList.contains('hidden'))
            selectAlert.classList.add('hidden');
    }
    return true;
}
function checkLocalStorage() {

    // Check if the user already voted
    if (pollList.includes(pollID)) {
        // Show the alert and then return
        if (voteAlert.classList.contains('hidden'))
            voteAlert.classList.remove('hidden');
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
            .then(function (recaptchaToken) {
                // Add token value to form
                token = recaptchaToken;
            });
    });
}
// Call once at the first render to the page
runRecaptcha();

// Refresh the recaptcha token  every 1 minutes
setInterval(runRecaptcha, 60000);

// Get the clint ip Address
async function getUserIpAddress() {
    // Get the ip address of the user
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    clintIpAddress = data.ip;
}

// Call to get the user ip address
getUserIpAddress();













