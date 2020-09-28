// ::: GLobal Variables :::
const optionsList = document.getElementById('options-list');
const lastOption = document.querySelector('.last-input');
const ip = document.getElementById('ip');
const vpn = document.getElementById('vpn');
const hidden = document.getElementById('hidden');
let question = '';

// Make the last option add new option
lastOption.addEventListener('keydown', addNewOption);

// Init tooltips
$('[data-toggle="tooltip"]').tooltip();


// Get the main form
$('#submit-poll').click(async function (e) {

    // Get the title of the poll
    const title = document.getElementById('title').value;

    // Check if there is title of not
    if (!title.trim()) {
        errorAlert('الرجاء ادخال العنوان');
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
    if (optionsValues.length < 2) {
        errorAlert('الرجاء ادخال على الاقل عنصرين لتصويت');
        return;
    }

    const response = await fetch('/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            title, options: JSON.stringify(optionsValues),
            ip: ip.checked, vpn: vpn.checked, hidden: hidden.selectedIndex,
            question: question.trim()
        })
    });
    try {
        const data = await response.json();
        // Show alert if success or show error otherwise
        if (data.status == 200) {
            successAlertTimer(data.message, `${location.origin}/${data.id}/r`)
        } else {

            errorAlert(data.message);
        }
    }
    catch (error) {
        console.log(error);
        errorAlert('مشكلة في السيرفر', 500);
    }
});


$('#question').change(function (e) {
    if (e.target.checked) {
        Swal.fire({
            icon: 'question',
            text: 'إضافة سؤال عند التصويت',
            input: 'text',
            customClass: {
                input: 'option',
                confirmButton: 'btn-solid-lg',
            },
            inputPlaceholder: 'الأسم',
            heightAuto: false,
            onOpen: () => Swal.getConfirmButton().focus(),
            confirmButtonText: 'إضافة السؤال',
            confirmButtonColor: '#00bfd8',
            allowOutsideClick: () => {
                e.target.checked = false;
                return true;
            },
            preConfirm: (answer) => {
                question = answer;
            }
        });
    }
})

// JS function to add new filed every time you reach the last filed
function addNewOption(e) {

    // Crete new input filed
    let newOption = document.createElement('input');

    // add the classes and the attributes
    newOption.setAttribute("type", "text");

    newOption.setAttribute("placeholder", "إضافة إجابة");
    newOption.classList = 'option form-control empty last-input';


    newOption.addEventListener('keydown', addNewOption);
    // Remove the last-input class
    e.target.removeEventListener('keydown', addNewOption);

    // Create line 
    let newHr = document.createElement('hr');

    // Append the new option and hr to the list
    optionsList.appendChild(newOption);
    optionsList.appendChild(newHr);

}



















