var MySkin={SkinName:""};

$(window).on('load', function () {
     var dataDarkTheme = localStorage.getItem('IsDark');
        if (dataDarkTheme == 'NO') {
                          }
        else {
            SetDarkPageData = setInterval(function () { modelcolor(); }, 10);
            }   
});
        $(document).ready(function () {
        var dataDarkTheme = localStorage.getItem('IsDark');
        if (dataDarkTheme == 'NO') {
                          }
        else {
            SetDarkPageData = setInterval(function () { modelcolor(); }, 10);
            }   
});


function modelcolor(){
    var dataDarkTheme = localStorage.getItem('IsDark');
        if (dataDarkTheme == 'NO') {
                                    clearInterval(SetDarkPageData);
                          }
    else {
$('.modal-body').css('background-color','black');
$('.modal-footer').css('background-color','black');
var NewUI='';
    if (MySkin.SkinName != '') {
        NewUI = MySkin.SkinName;
    }
    else {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin')
        }
        else
        {
        $(':root').css('--main-color-on-layoutchange', '#3c8dbc');
        }
    }
    if (NewUI == 'skin-blue' || NewUI == 'skin-blue-light') {
        $(':root').css('--main-color-on-layoutchange', '#3c8dbc');
    }
    if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
        $(':root').css('--main-color-on-layoutchange', '#fff');
    }
    if (NewUI == 'skin-purple' || NewUI == 'skin-purple-light') {
        $(':root').css('--main-color-on-layoutchange', '#605ca8');
    }
    if (NewUI == 'skin-green' || NewUI == 'skin-green-light') {
        $(':root').css('--main-color-on-layoutchange', '#00a65a');
    }
    if (NewUI == 'skin-red' || NewUI == 'skin-red-light') {
        $(':root').css('--main-color-on-layoutchange', '#dd4b39');
    }
    if (NewUI == 'skin-yellow' || NewUI == 'skin-yellow-light') {
        $(':root').css('--main-color-on-layoutchange', 'gold');
    }
SwitchDataTheme();
$('#PaperTradeNotificationCountLi').css('color','black');
}
}
function SwitchDataTheme(){

}