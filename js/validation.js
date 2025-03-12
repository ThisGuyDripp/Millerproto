class InputValidator {
    constructor() {
        this.errorMessages = {
            empty: "This field cannot be empty",
            invalid: "Please enter a valid number",
            zero: "All values cannot be zero"
        };
    }

    validateInput(value, fieldId) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        // Clear previous errors
        errorElement.style.display = 'none';
        errorElement.textContent = '';

        // Check if empty
        if (value.trim() === '') {
            this.showError(errorElement, this.errorMessages.empty);
            return false;
        }

        // Check if valid number
        const number = parseFloat(value);
        if (isNaN(number)) {
            this.showError(errorElement, this.errorMessages.invalid);
            return false;
        }

        return true;
    }

    validateAllInputs(x, y, z) {
        let isValid = true;
        
        isValid = this.validateInput(x, 'x-intercept') && isValid;
        isValid = this.validateInput(y, 'y-intercept') && isValid;
        isValid = this.validateInput(z, 'z-intercept') && isValid;

        // Check if all values are zero
        if (isValid && parseFloat(x) === 0 && parseFloat(y) === 0 && parseFloat(z) === 0) {
            this.showError(document.getElementById('x-error'), this.errorMessages.zero);
            isValid = false;
        }

        return isValid;
    }

    showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });
    }
}

const validator = new InputValidator();
