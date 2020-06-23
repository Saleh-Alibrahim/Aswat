//Get the main form
let main_form = document.getElementById('submit-poll');
main_form.addEventListener('click', async (e) => {
    try {
        //get the title of the poll
        let title = document.getElementById('title').value;
        //show the alert of title requierd
        let title_alert = document.getElementById('title-alert');
        if (!title) {
            //show the alert and then return
            if (title_alert.classList.contains('hidden'))
                title_alert.classList.remove('hidden');
            return;
        } else {
            //hide the alert and then continue
            if (!title_alert.classList.contains('hidden'))
                title_alert.classList.add('hidden');
        }
        //get all the list of poll
        let poll_list_items = document.querySelectorAll('.item-list');

        let poll_list_values = [];
        //get only the values from the list items
        poll_list_items.forEach(item => {
            if (item.value) {
                poll_list_values.push({
                    name: item.value,
                    numberVote: 0
                }
                );
            }
        });

        // create the poll in the server 
        let response = await fetch('/create_poll', {
            method: 'POST',
            body: JSON.stringify({
                'title': title,
                'poll_list': poll_list_values
            }),
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let response_data = await response.json();

        //render the new html page if resopne success
        if (response_data.success)
            window.location.href = window.location.href + `poll/${response_data.id}`;

    }
    catch (error) {
        console.log(error);
    }



});

//add new input filed 
let input_filed = document.querySelector('.last-input');

input_filed.addEventListener('keydown', addNew);


function addNew(e) {
    //crete new input filed
    let new_input = document.createElement('input');
    // add the classes and the attributes
    new_input.setAttribute("type", "text");
    new_input.setAttribute("placeholder", "اختار اجابه");
    new_input.classList = 'item-list form-control last-input';
    new_input.addEventListener('keydown', addNew);
    //remove the last-input class
    e.target.removeEventListener('keydown', addNew);
    //get the father node

    //create line 
    let line_break = document.createElement('hr');


    let input_form = document.getElementById('poll-list');
    input_form.appendChild(new_input);
    input_form.appendChild(line_break);


}














