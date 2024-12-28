export const userNameGenerator = (fullName) => {
    const nameParts = fullName.trim().toLowerCase().split(' ');

    if (nameParts.length < 1) {
        throw new Error("Please provide at least a first name.");
    }

    // Get the first name and last name (if available)
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''; 

    let username;

    if (lastName) {
        username = `${firstName}_${lastName}_`;
    }else if(firstName.length <= 3){
        username = `${firstName}__`;
    }else{
        username = `${firstName}_`;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000)
    username += randomNum;

    return username;
}