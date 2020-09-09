// ::: GLobal Variables :::
const optionsList = document.getElementById('options-list');
const lastOption = document.querySelector('.last-input');
const ip = document.getElementById('ip');
const vpn = document.getElementById('vpn');
const hidden = document.getElementById('hidden');

// Make the last option add new option
lastOption.addEventListener('keydown', addNewOption);

// Init tooltips
$('[data-toggle="tooltip"]').tooltip();


// Get the main form
$('#submit-poll').click(async function (e) {

    // Check if title is added
    if (!checkTitle()) { return; }


    // Get all the options
    const options = document.querySelectorAll('.option');

    const optionsValues = [];

    // Get the options value from the the options array
    options.forEach(function (option) {
        if (option.value.trim()) {
            optionsValues.push({ name: option.value });
        }
    });

    // Check  if at least 2 options is added
    if (!checkOptions(optionsValues)) {
        return;
    }

    // Get the title from the field
    const title = document.getElementById('title').value;

    const response = await fetch('/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            title, options: JSON.stringify(optionsValues),
            ip: ip.checked, vpn: vpn.checked, hidden: hidden.checked
        })
    });
    try {
        const data = await response.json();
        // Show alert if success or show error otherwise
        if (data.status == 200) {
            Swal.fire({
                icon: 'success',
                title: data.message,
                timer: 1500,
                showConfirmButton: false,
                onAfterClose: () => {
                    location.href = `${location.origin}/${data.id}/r`;
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



// JS function to add new filed every time you reach the last filed
function addNewOption(e) {

    // Crete new input filed
    let newOption = document.createElement('input');

    // add the classes and the attributes
    newOption.setAttribute("type", "text");

    newOption.setAttribute("placeholder", "إضافة إجابة");
    newOption.classList = 'option form-control last-input';


    newOption.addEventListener('keydown', addNewOption);
    // Remove the last-input class
    e.target.removeEventListener('keydown', addNewOption);

    // Create line 
    let newHr = document.createElement('hr');

    // Append the new option and hr to the list
    optionsList.appendChild(newOption);
    optionsList.appendChild(newHr);

}

// Title require alert
function checkTitle() {

    // Get the title of the poll
    const title = document.getElementById('title').value;

    // Check if there is title of not
    if (!title.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'الرجاء ادخال العنوان',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return false;
    }
    return true;

}

// Two options required alert
function checkOptions(options) {
    // Check the options length
    if (options.length < 2) {
        Swal.fire({
            icon: 'error',
            title: ' الرجاء ادخال على الاقل عنصرين لتصويت',
            confirmButtonText: 'المحاولة مرة اخرى',
            confirmButtonColor: '#00bfd8',
        });
        return false;
    }
    return true;
}


















