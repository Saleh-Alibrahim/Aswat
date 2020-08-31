// ::: GLobal Variables :::
const titleAlert = document.getElementById('title-alert');
const optionsAlert = document.getElementById('options-alert');
const optionsList = document.getElementById('options-list');
const lastOption = document.querySelector('.last-input');
let ipAddress;



// Make the last option add new option
lastOption.addEventListener('keydown', addNewOption);

// Init tooltips
$('[data-toggle="tooltip"]').tooltip();

// Get the ip address of the user
fetch('https://api.ipify.org?format=json')
    .then(res => res.json)
    .then(data => ipAddress = data.ip);
// Get the main form
$('#submit-poll').click(async function (e) {


    // Check if title is added
    if (!checkTitle()) {
        return;
    }

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

    console.log('checkbox.checked :>> ', checkbox.checked);
    const response = await fetch('/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ title, options: JSON.stringify(optionsValues), name: checkbox.checked, ipAddress })
    });


    // Show alert if poll created or show error otherwise
    if (response.status == 200) {
        const data = await response.json();
        Swal.fire({
            icon: 'success',
            title: 'تم إنشاء التصويت بنجاح',
            confirmButtonText: 'الإنتقال الى التصويت',
            confirmButtonColor: '#00bfd8',
            onAfterClose: () => {
                // Redirect the user to result of the poll newly created
                location.href = `${location.origin}/${data.id}/r`;
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'مشكلة في السيرفر',
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

    newOption.setAttribute("placeholder", "اختار اجابه");
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Show the alert and then return
        if (titleAlert.classList.contains('hidden')) {
            titleAlert.classList.remove('hidden');
        }

        return false;
    }
    else {
        if (!titleAlert.classList.contains('hidden')) {
            titleAlert.classList.add('hidden');
        }
        return true;
    }

}

// Two options required alert
function checkOptions(options) {

    // Check the options length
    if (options.length < 2) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Show the alert and then return
        if (optionsAlert.classList.contains('hidden')) {
            optionsAlert.classList.remove('hidden');
        }
        return false;
    }
    else {
        if (!optionsAlert.classList.contains('hidden')) {
            optionsAlert.classList.add('hidden');
        }
        return true;
    }

}


















