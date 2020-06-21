//Get the main form
let main_form = document.getElementById('poll-form');
main_form.addEventListener('submit', async (e) => {
    try {
        //prevent defult form submit
        e.preventDefault();
        //get all the list of poll
        let poll_list_items = document.querySelectorAll('.item-list');
        console.log("poll_list_items", poll_list_items);

        let poll_list_values = [];
        //get only the values from the list items
        poll_list_items.forEach(item => {
            poll_list_values.push({
                name: item.value,
                count: 0
            }
            );
        });
        //get the title of the poll
        let title = document.getElementById('title').value;
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

        //
        if (response.redirected) {
            window.location.href = response.url;
        }


    }
    catch (error) {
        console.log(error);
    }



});








