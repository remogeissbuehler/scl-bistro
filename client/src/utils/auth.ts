export function onLogout() {
    localStorage.setItem("loggedIn", "false");
    for (let key of ["username", "fullname", "_id", "admin"])
        localStorage.removeItem(key)
}