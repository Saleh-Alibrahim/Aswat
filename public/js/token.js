
const token = getCookie("token");

console.log('token', token)
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
    const regexp = new RegExp("(?:^" + name + "|;\s*" + name + ")=(.*?)(?:;|$)", "g");
    const result = regexp.exec(document.cookie);
    return (result === null) ? null : result[1];
}
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


