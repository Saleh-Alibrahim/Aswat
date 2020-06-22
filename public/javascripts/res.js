//Get the main form
let vote_button = document.getElementById('submit-vote');
vote_button.addEventListener('click', async (e) => {
    try {

        //get the selected option of the poll
        let selected_option = document.querySelector('input[name="itemList"]:checked');

        //show the alert of select  requierd
        let select_alert = document.getElementById('select-alert');
        if (!selected_option) {
            //show the alert and then return
            if (select_alert.classList.contains('hidden'))
                select_alert.classList.remove('hidden');
            return;
        } else {
            //hide the alert and then continue
            if (!select_alert.classList.contains('hidden'))
                select_alert.classList.add('hidden');
        }

        //get the selected vote id
        let id = selected_option.id;

        // add vote 
        let response = await fetch('/add_vote ', {
            method: 'POST',
            body: JSON.stringify({
                'id': id,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let response_data = await response.json();

        //render the new html page if resopne success
        if (response_data.success)
            window.location.href = window.location.href + `/res`;

    }
    catch (error) {
        console.log(error);
    }



});















