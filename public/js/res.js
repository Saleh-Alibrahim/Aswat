// Get the main form
$('#copy-button').click(function (e) {
    try {
        /* Get the text field */
        const copyText = document.getElementById("poll-link");
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        const x = document.getElementById("toast");
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

$('#goVote-button').click(function (e) {
    window.location.href = window.location.href.substring(0, window.location.href.length - 2);
});















