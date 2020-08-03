//Get the main form
$('#submit-poll').submit(function (e) {
    //get the title of the poll
    const title = $('#title').val();
    //show the alert of title required
    const title_alert = $('#title-alert');
    if (!title) {
        //show the alert and then return
        if (title_alert.hasClass('hidden'))
            title_alert.removeClass('hidden');
        e.preventDefault();
        return;
    }

    //get all the list of poll
    let poll_list_items = document.querySelectorAll('.item-list');

    let poll_list = [];
    // Get only the value from the value poll list
    poll_list_items.forEach(item => {
        if (item.value) {
            poll_list.push({
                name: item.value,
            });
        }
    });




    // Append the fields to the form and request the server
    $(this).append(`<input type="hidden" name="title" value=${title}>`);
    $(this).append(`<input type="hidden" name="poll_list" value=${JSON.stringify(poll_list)}>`);
    return true;
});
//add new input filed 
let input_filed = document.querySelector('.last-input');

input_filed.addEventListener('keydown', addNewFiled);

// JS function to add new filed every time you reach the last filed
function addNewFiled(e) {
    //crete new input filed
    let new_input = document.createElement('input');
    // add the classes and the attributes
    new_input.setAttribute("type", "text");
    new_input.setAttribute("placeholder", "اختار اجابه");
    new_input.classList = 'item-list form-control last-input';
    new_input.addEventListener('keydown', addNewFiled);
    //remove the last-input class
    e.target.removeEventListener('keydown', addNewFiled);
    //get the father node

    //create line 
    let line_break = document.createElement('hr');


    let input_form = document.getElementById('poll-list');
    input_form.appendChild(new_input);
    input_form.appendChild(line_break);


}














