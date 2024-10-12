


export function refreshpage (){
    history.pushState(null, null, window.location.href);

window.addEventListener('pageshow', function (event) {
if (event.persisted || (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD)) {
// Reload the page only once
window.location.reload();
}

});
}