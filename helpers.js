export const isEmailValid = (email) => 
{
    const reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]+\.[A-Za-z0-9._%+-]+$/;
    const result = reg.exec(email);
    return result !== null;
}

export const checkUserParams= ([
    id,
    firstName,
    lastName,
    email,
    userName,
    dateOfBirth
]) => 
{
    [
        id,
        firstName,
        lastName,
        email,
        userName,
        dateOfBirth    
    ].forEach(param => {
        if (param === undefined) throw 'All fields need to have valid values';
    });

    [
        id,
        firstName,
        lastName,
        email,
        userName,
        dateOfBirth    
    ].forEach(param => {
        if (typeof param !== 'string' || param.trim().length === 0) throw 'Strings with only spaces are not valid';
    });

    id = id.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    userName = userName.trim();
    dateOfBirth = dateOfBirth.trim();

    if (!isEmailValid(email)) throw 'E-mail is not valid';

}