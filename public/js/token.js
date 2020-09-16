
const token = getCookie("token");

// Check if the user login or not
if (token) {
    // Hide the login button
    $('#login').css('display', 'none');
    // Show the logout button
    $('#logout').css('display', 'inline-block');
}

function createCookie(name, value, expires) {
    cookie = name + "=" + value + ";";

    if (expires) {
        // If it's a date
        if (expires instanceof Date) {
            // If it isn't a valid date
            if (isNaN(expires.getTime()))
                expires = new Date();
        }
        else
            expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);

        cookie += "expires=" + expires.toGMTString() + ";";
    }

    cookie += "Path=/; expires=" + expires.toGMTString() + "; ";
    document.cookie = cookie;
}
function deleteCookie(name) {
    // If the cookie exists delete it 
    if (getCookie(name))
        createCookie(name, "", -1,);
}
function getCookie(name) {
    let result;
    const cookieList = document.cookie.split(';');
    cookieList.forEach(cookie => {
        if (cookie.trim().startsWith(name)) {
            result = cookie;
            return;
        }
    });
    return (result == null) ? null : result;
}
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


