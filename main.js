$('#game').ready(function(){
    const puissance4 = new Puissance4('#game')

    $('#rejouez').on('click', function(){
        $('#game').empty()
        puissance4.tableauP4()
        $('#rejouez').css('visibility', 'hidden')
    })
});