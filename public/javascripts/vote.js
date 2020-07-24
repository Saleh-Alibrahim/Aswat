//get the main form
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

        //get the page id 
        let poll_id = window.location.href.split('/').pop();
        //check if it in the localstorge
        let local_storge_arr = JSON.parse(localStorage.getItem('poll_ids')) || [];
        let vote_alert = document.getElementById('vote-alert');
        //check if the user already voted
        if (local_storge_arr.indexOf(poll_id) >= 0) {
            //show the alert and then return
            if (vote_alert.classList.contains('hidden'))
                vote_alert.classList.remove('hidden');
            return;
        }
        local_storge_arr.push(poll_id);
        localStorage.setItem('poll_ids', JSON.stringify(local_storge_arr));





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
            window.location.href = window.location.href + `/r`;

    }
    catch (error) {
        console.log(error);
    }



});

//make the result button goes to the result page
document.getElementById('result-button').addEventListener('click', (e) => {
    window.location.href = window.location.href + `/r`;
});

//make the copy button work
document.getElementById('copy-button').addEventListener('click', async (e) => {
    try {
        //get the url
        let url = window.location.href;
        //source https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        var x = document.getElementById("toast");
        x.classList.add("show");
        x.innerHTML = "تم النسخ";
        setTimeout(function () {
            x.classList.remove("show");
        }, 3000);
    }
    catch (error) {
        console.log(error);
    }
});

















