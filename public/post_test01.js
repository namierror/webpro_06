const addbutton = document.querySelector('#add');
const value1 = document.querySelector('#value1');
const value2 = document.querySelector('#value2');
const display = document.querySelector('#answer');

addbutton.addEventListener('click', () => {
    const num1 = value1.value;
    const num2 = value2.value;
    const params = {  // URL Encode
        method: "POST",
        body:  'num1='+num1+'&num2='+num2,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/add";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        display.value = response.answer;
        console.log( response );
    })
})