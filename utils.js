function _assertNotNull(data) {
    if (!data.name || !data.email || !data.password){
        return false
    }
    return true
}

function validateEmail(email) {
    var re = /^(([^<>()[]\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.validateEmail = validateEmail;
