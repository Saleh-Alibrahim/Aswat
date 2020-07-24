//Get the main form
let copy_button = document.getElementById('copy-button');
copy_button.addEventListener('click', async (e) => {
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















