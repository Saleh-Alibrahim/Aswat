// ::: GLobal Variables :::
const selectAlert = document.getElementById('select-alert');
const voteAlert = document.getElementById('vote-alert');
const pollID = document.getElementById('pollID').value;
let clintIpAddress;

// Submit the vote
document.getElementById('submit-vote').addEventListener('submit', async function (e) {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    // Check if the user selected option
    if (!checkSelectedAlert(selectedOption)) {
        e.preventDefault();
        return;
    }


    // // Check if the user already voted 
    // if (!checkLocalStorage()) {
    //     e.preventDefault();
    //     return;
    // }

    // Get the selected option id
    const optionID = selectedOption.id;

    $(this).append(`<input type="hidden" name="optionID" value="${optionID}">`);
    $(this).append(`<input type="hidden" name="ip" value="${clintIpAddress}">`);


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

    // Get the pollList array
    const pollList = JSON.parse(localStorage.getItem('pollList')) || [];

    // Check if the user already voted
    if (pollList.indexOf(pollID) >= 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Show the alert and then return
        if (voteAlert.classList.contains('hidden'))
            voteAlert.classList.remove('hidden');
        return false;

    }
    else {
        // Add the poll id to the list and return true
        pollList.push(pollID);
        localStorage.setItem('pollList', JSON.stringify(pollList));
    }
    return true;

}

// Add the recaptcha token to the form
function runRecaptcha() {
    grecaptcha.ready(function () {
        // Do request for recaptcha token
        // Response is promise with passed token
        grecaptcha.execute('6LdVI6kZAAAAACbNTvMKBFb7-eThFAU0VbsTLQI-', { action: 'validate_captcha' })
            .then(function (token) {
                // Add token value to form
                document.getElementById('token').value = token;
            });
    })
}
// Call once at the first render to the page
runRecaptcha();

// Refresh the recaptcha token  every 1 minutes
setInterval(runRecaptcha, 60000);

// Get the clint ip Address
(async function getUserIpAddress() {
    // Get the ip address of the user
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    clintIpAddress = data.ip;
});













