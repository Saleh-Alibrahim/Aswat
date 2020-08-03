// Get the main form
$('#copy-button').click(function (e) {
    try {
        //get the res url
        let res_url = window.location.href;

        //remove the /res from the end
        let url = res_url.slice(0, res_url.length - 2);

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

$('#goVote-button').click(function (e) {
    window.location.href = window.location.href.substring(0, window.location.href.length - 2);
});















