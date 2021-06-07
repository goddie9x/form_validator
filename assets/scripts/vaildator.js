function Validator(options) {
    let elementForm = document.querySelector(options.form),
        selectorRule = {};

    function removeClassMessageError(elementNeedCheck, elementError) {
        elementNeedCheck.closest(options.closestParentOfInputAndMessage).classList.remove('invalid');
        elementError.innerText = "";
    }

    function validate(elementNeedCheck, rule) {
        //truy xuất phần tử message thông qua phần tử cha của phần tử đang check - thường là dưới input
        //phải đặt tên class cho element chứa message lỗi là "message"
        let elementError = elementNeedCheck.closest(options.closestParentOfInputAndMessage).querySelector(options.errorMessage),
            messageError,
            //lấy ra các rule của element
            rules = selectorRule[rule.Element],
            ruleLength = rules.length;

        //lặp qua các rule của element và check
        //nếu có lỗi dừng việc check lấy lỗi luôn
        for (let i = 0; i < ruleLength; i++) {
            switch (elementNeedCheck.type) {
                case 'radio':
                    {
                        {
                            messageError = rules[i](elementForm.querySelectorAll(rule.Element + ':checked'));
                            break;
                        }
                    }
                case 'checkbox':
                    {
                        messageError
                        break;
                    }
                default:
                    {
                        messageError = rules[i](elementNeedCheck.value);
                    }
            }

            if (messageError) {
                break;
            }
        }

        //nếu có lỗi thì gán class lỗi
        if (messageError) {
            elementNeedCheck.closest(options.closestParentOfInputAndMessage).classList.add('invalid');
            elementError.innerText = messageError;
        } else {
            removeClassMessageError(elementNeedCheck, elementError);
        }
        return !messageError;
    };
    //check lại xem dev có cho đúng text đề query ra element cần check lỗi không (thường là id để đảm bảo tính duy nhất)
    if (elementForm) {
        //khi ấn submit form
        elementForm.onsubmit = function(e) {
            e.preventDefault();

            let isValidForm = true;

            options.rule.forEach(rule => {
                let inputElement = elementForm.querySelector(rule.Element);
                let isValid = validate(inputElement, rule);

                if (!isValid) {
                    isValidForm = false;
                }
            });
            if (isValidForm) {
                //submit with javaScript
                if (typeof(options.onSubmit) == 'function') {
                    let formEnableInput = elementForm.querySelectorAll('[name]:not([disabled])'),
                        formEnableInputValue = Array.from(formEnableInput).reduce(function(accumulator, currentValue) {
                            switch (currentValue.type) {
                                case 'radio':
                                case 'checkbox':
                                    {
                                        if (currentValue.matches(':checked')) {
                                            accumulator[currentValue.name] = elementForm.querySelector('input[name="' + currentValue.name + '"]:checked').value;
                                        }
                                        break;
                                    }
                                default:
                                    accumulator[currentValue.name] = currentValue.value;
                            }
                            return accumulator;
                        }, {});
                    options.onSubmit(formEnableInputValue);
                }
                //submit with default 
                else {
                    elementForm.submit();
                }
            }
        }

        options.rule.forEach(rule => {
            //truy xuất ra element cần check thông qua rule
            if (Array.isArray(selectorRule[rule.Element])) {
                selectorRule[rule.Element].push(rule.test);
            } else {
                selectorRule[rule.Element] = [rule.test];
            }

            let elementNeedChecks = elementForm.querySelectorAll(rule.Element);

            //bắt sự kiện onblur
            Array.from(elementNeedChecks).forEach(function(elementNeedCheck) {
                elementNeedCheck.onblur = function() {
                    validate(elementNeedCheck, rule);
                }
                elementNeedCheck.oninput = function() {
                    removeClassMessageError(elementNeedCheck, elementError);
                }
            });

        });

    }


}

Validator.isRequired = function(Element, message) {
    return {
        Element,
        //check E xem có tồn tại hay không - tức là người dùng có nhập ký tự hay không
        test(E) {
            if (typeof(E) == 'string')
                return (E.trim()) ? undefined : message || 'vui lòng nhập trường này';
            else
                return E[0] ? undefined : message || 'vui lòng nhập trường này';
        }
    }
}

Validator.isEmail = function(Element, message) {
    return {
        Element,
        test(E) {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (re.test(E)) ? undefined : message || 'trường này phải là email';
        }
    }
}

Validator.minLength = function(Element, min, message) {
    return {
        Element,
        test(E) {
            return (E.length >= 6) ? undefined : message || `Vui lòng nhập tổi thiểu ${min} ký tự`;
        }
    }
}



Validator.isConfirm = function(Element, ElementConfirm, message) {
        return {
            Element,
            test(E) {
                return (E === ElementConfirm()) ? undefined : message || 'vui lòng nhập đúng';
            }
        }
    }
    /*--------------------for header-----------------*/
const $AO = function activeOn(elements) {
    elements.forEach(element => {
        element.classList.add('active');
    })
}

const $AOff = function activeOff(elements) {
    elements.forEach(element => {
        element.classList.remove('active');
    })
}

const $toggle = function toggleActiveClass(elements) {
    elements.forEach(element => {
        element.classList.toggle('active');
    })
}

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$('.main-nav-bar-submit').onclick = function(e) {
    $toggle([$('.ground-2'), $('.house'), $('.moon-big'), $('.moon'), $('.man-sitting'), $('.telescope'), $('.man-hand-behind-neck'), $('.tree'), $('.ground-1')])
}
$('.main-nav-mobile').onclick = function() {
    $toggle([...$$('.menu-icon'), $('.main-nav-bar-mobile')]);
}
$('.moon').onclick = function() {
    $toggle([$('.poems')]);
}