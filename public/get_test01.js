const getbutton = document.querySelector('#get_button');
const display = document.querySelector('#answer');
getbutton.addEventListener('click', () => {
    fetch( "/get_test" )
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