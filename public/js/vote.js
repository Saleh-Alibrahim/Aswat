const select_alert = document.getElementById('select-alert');
const vote_alert = document.getElementById('vote-alert');




// Submit the vote
$('#submit-vote').click(async function (e) {

    const selected_option = document.querySelector('input[name="itemList"]:checked');

    // Check if the user selected option
    if (!checkSelectedAlert(selected_option)) {
        e.preventDefault();
        return;
    }

    // Check if the user already voted 
    if (!checkLocalStorage()) {
        e.preventDefault();
        return;
    }


    //get the selected option id
    const optionID = selected_option.id;

    $(this).append(`<input type="hidden" name="optionID" value=${optionID}>`);

    return true;


});

// Make the result button goes to the result page
$('#result-button').click((e) => {
    window.location.href = window.location.href + `/r`;
});

function checkSelectedAlert(selected_option) {
    //get the selected option of the poll
    if (!selected_option) {
        //show the alert and then return
        if (select_alert.classList.contains('hidden'))
            select_alert.classList.remove('hidden');
        return false;
    } else {
        //hide the alert and then continue
        if (!select_alert.classList.contains('hidden'))
            select_alert.classList.add('hidden');
    }
    return true;
}

function checkLocalStorage() {
    //get the page id 
    let poll_id = window.location.href.split('/').pop();
    //check if it in the localstorge
    let local_storge_arr = JSON.parse(localStorage.getItem('poll_ids')) || [];
    //check if the user already voted
    if (local_storge_arr.indexOf(poll_id) >= 0) {
        //show the alert and then return
        if (vote_alert.classList.contains('hidden'))
            vote_alert.classList.remove('hidden');
        return;
    }
    local_storge_arr.push(poll_id);
    localStorage.setItem('poll_ids', JSON.stringify(local_storge_arr));
}


















