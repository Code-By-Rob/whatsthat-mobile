/**
 * if the input (email || password) does not conform to expected requirements
 * then populate errorMessage with an object
 */
const errorMessage = null;
const tester = new RegExp(/^\S+@\S+\.\S+$/);

/**
 * Validates email follows standards such as:
    * - if empty
    * - email length is greater than 254
    * - match between regex & email
    * - contains '@'
    * - contains '.' domain name
 * @param {String} email 
 * @returns {Boolean} Boolean
 */
export const emailValidate = (email) => {
    if (!email) {
        console.log('Email is null');
        return false;
    }
		
	if(email.length>254) {
        console.log('Email is greater than 254 chars');
        return false;
    }

	const valid = tester.test(email);
	if(!valid) {
        console.log('Email failed tester.test (`aka regex`)', valid);
        return false;
    }

	// Further checking of some things regex can't handle
	const parts = email.split("@");
	if(parts[0].length>64) {
        console.log('Email username is greater than 64 chars');
        return false;
    }

	const domainParts = parts[1].split(".");
	if(domainParts.some(function(part) { return part.length>63; })) {
        console.log('Email domain is greater than 63 chars');
        return false;
    }

	return true;
};
/**
 * Validates password follows standards such as:
 * - greater than 8 characters
 * - contains a special character '[!?,.<>;:'"\|[{}]-_=+@£#$%^&*()~`]'
 * - contains a numeric value '[0-9]'
 * @param {String} password 
 * @returns {Boolean} Boolean
 */
export const passwordValidate = (password) => {
    if (password === null) {
        console.log('Password is empty');
        return false;
    }
    const reSpecials = new RegExp('[^\w\s]'); // contains special characters [!?,.<>;:'"\|[{}]-_=+@£#$%^&*()~`]
    const reNumbers = new RegExp('[0-9]') // contains number [0-9]
    if (password.length >= 8 
        && password.match(reSpecials).length > 0 
        && password.match(reNumbers).length > 0) {
        return true;
    } else {
        return false;
    }
};