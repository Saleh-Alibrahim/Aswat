// ::: GLobal Variables :::
const pollID = document.getElementById('pollID').value;
const pollList = JSON.parse(localStorage.getItem('pollList')) || [];
const question = $('#question').val();
let recaptchaToken, answer;

// Submit the vote
document.getElementById('vote-button').addEventListener('click', async function (e) {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    // Check if the user selected option
    if (!selectedOption) {
        errorAlert('الرجاء اختيار صوت لتصويت');
        return;
    }

    // Check if the user already voted 
    if (pollList.includes(pollID)) {
        errorAlert('لا يمكن التصويت اكثر من مرة');
        return;
    }

    // If the creator request answer to his question get the answer
    if (question) {
        await Swal.fire({
            icon: 'question',
            text: question,
            input: 'text',
            customClass: {
                input: 'option',
                confirmButton: 'btn-solid-lg',
            },
            inputPlaceholder: 'إجابة السؤال',
            heightAuto: false,
            confirmButtonText: 'إدخال الإجابة',
            confirmButtonColor: '#00bfd8',
            preConfirm: (text) => {
                answer = text.trim();
            }
        });
        if (!answer) {
            errorAlert('الرجاء الإجابة على السؤال');
            return;
        }
    }


    // Get the selected option id
    const optionID = selectedOption.id;

    const response = await fetch('/vote', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ optionID, token: recaptchaToken, pollID, answer })
    });
    try {
        const data = await response.json();

        // Show alert if v or show error otherwise
        if (response.status == 200) {
            addToLocalStorage();
            successAlertTimer(data.message, `${location.origin}/${pollID}/r`)
        } else {
            errorAlert(data.message);
        }
    }
    catch (error) {
        console.log(error);
        errorAlert('مشكلة في السيرفر', 500);
    }

});


// Make the result button goes to the result page
$('#result-button').click(async (e) => {
    console.log("location.href + `/resultAccess`", location.href + `/resultAccess`)
    if ($('#hidden')) {
        const response = await fetch(location.href + `/resultAccess`);
        try {
            // Show alert if v or show error otherwise
            if (response.status != 200) {
                errorAlert('تحتاج لتصويت للوصول الى النتائج');
                return;
            }
        }
        catch (error) {
            console.log(error);
            errorAlert('مشكلة في السيرفر', 500);
        }

    }
    location.href = location.href + '/r';
});



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














