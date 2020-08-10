// ::: GLobal Variables :::
const selectAlert = document.getElementById('select-alert');
const voteAlert = document.getElementById('vote-alert');
const pollID = document.getElementById('pollID').value;



// Submit the vote
$('#submit-vote').click(async function (e) {

    const selectedOption = document.querySelector('input[name="options"]:checked');

    // Check if the user selected option
    if (!checkSelectedAlert(selectedOption)) {
        e.preventDefault();
        return;
    }

    // Check if the user already voted 
    if (!checkLocalStorage()) {
        e.preventDefault();
        return;
    }

    // Get the selected option id
    const optionID = selectedOption.id;

    $(this).append(`<input type="hidden" name="optionID" value="${optionID}">`);

    return true;

});

// Make the result button goes to the result page
$('#result-button').click((e) => {
    window.location.href = window.location.href + `/r`;
});

function checkSelectedAlert(selectedOption) {
    // Get the selected option of the poll
    if (!selectedOption) {
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


















