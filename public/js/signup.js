const form = document.querySelector('form'),
    x = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    valid_email = email => x.test(email.value.toLowerCase()),
    setFormMessage = (formElement, type, message) => {
        const messageElement = formElement.querySelector(".form__message");

        messageElement.textContent = message;
        messageElement.classList.remove("form__message--success", "form__message--error");
        messageElement.classList.add(`form__message--${type}`);
    },
    setInputError = (inputElement, message) => {
        inputElement.classList.add("form__input--error");
        inputElement.nextElementSibling.textContent = message;
    },
    clearInputError = inputElement => {
        inputElement.classList.remove("form__input--error");
        inputElement.nextElementSibling.textContent = "";
    }, validate = (e) => {
        const regx = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/
        if (e[0].value === '') {
            setInputError(e[0], "Field can't be empty");
            return false;
        } else if (!regx.test(e[0].value)) {
            setInputError(e[0], "You must write first name and last name");
            return false;
        }

        if (e[1].value === '') {
            setInputError(e[1], "Field can't be empty");
            return false;
        } else if (!valid_email(e[1])) {
            setInputError(e[1], 'Please, enter a valid email');
            return false;
        }

        if (e[2].value === '') {
            setInputError(e[2], 'Field can not be empty');
            return false;
        } else if (e[2].value.length < 14) {
            setInputError(e[2], 'National ID must be at least 14 number');
            return false;
        }

        if (e[3].value === '') {
            setInputError(e[3], 'Field can not be empty');
            return false;
        } else if (e[3].value.length < 6) {
            setInputError(e[3], 'Password must be at least 6 character');
            return false;
        }

        return true;
    };


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form"),
        inputs = document.querySelectorAll("input");


    form.addEventListener("submit", e => {
        if (!validate(inputs))
            e.preventDefault();
    });

    inputs.forEach(inputElement => {
        inputElement.addEventListener("blur", () => {
            validate(inputs);
        });

        inputElement.addEventListener("input", () => {
            clearInputError(inputElement);
        });
    });
});

$('input[name=natId]').keyup(function (e) {
    if ($(this).val().length >= 14) {
        $(this).val($(this).val().substr(0, 14));
    }
});