function Validator(options) {
    let elementForm = document.querySelector(options.form);

    function removeClassMessageError(elementNeedCheck, elementError) {
        elementNeedCheck.parentElement.classList.remove('invalid');
        elementError.innerText = "";
    }

    function validate(elementNeedCheck, rule) {
        //truy xuất phần tử message thông qua phần tử cha của phần tử đang check - thường là dưới input
        //phải đặt tên class cho element chứa message lỗi là "message"

        let elementError = elementNeedCheck.parentElement.querySelector('.message');
        let messageError = rule.test(elementNeedCheck.value);

        if (messageError) {
            elementNeedCheck.parentElement.classList.add('invalid');
            elementError.innerText = messageError;
        } else {
            removeClassMessageError(elementNeedCheck, rule);
        }
    };
    //check lại xem dev có cho đúng text đề query ra element cần check lỗi không (thường là id để đảm bảo tính duy nhất)
    if (elementForm) {
        options.rule.forEach(rule => {
            //truy xuất ra element cần check thông qua rule - thường là check các ô input
            let elementNeedCheck = elementForm.querySelector(rule.Element);
            //bắt sự kiện onblur
            elementNeedCheck.onblur = function() {
                validate(elementNeedCheck, rule)
            };

            elementNeedCheck.oninput = function() {
                removeClassMessageError(elementNeedCheck, rule);
            }
        });
    }
}

Validator.isRequired = function(Element) {
    return {
        Element,
        //check E xem có tồn tại hay không - tức là người dùng có nhập ký tự hay không
        test(E) {
            return (E.trim()) ? undefined : 'vui lòng nhập trường này';
        }
    }
}
Validator.isEmail = function(Element) {
    return {
        Element,
        test(E) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (re.test(E)) ? undefined : 'trường này phải là email';
        }
    }
}
Validator.minLength = function(Element, min) {
    return {
        Element,
        test(E) {
            return (E.length >= 6) ? undefined : `Vui lòng nhập tổi thiểu ${min} ký tự`
        }
    }
}