//Get the main form
let copy_button = document.getElementById('copy');
copy_button.addEventListener('click', async (e) => {
    try {

        //get the res url
        let res_url = window.location.href;

        //remove the /res from the end
        let url = res_url.slice(0, res_url.length - 4);

        //source https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
    }
    catch (error) {
        console.log(error);
    }



});















