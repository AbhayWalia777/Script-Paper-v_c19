$(document).ready(function () {
var NewUI='';
    if (MySkin.SkinName != '') {
        NewUI = MySkin.SkinName;
    }
    else {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin')
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

SwitchData();
});


 function SwitchData() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
                          }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('li').css('color','white');
        $('.box-header').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.sorting_1').css('border','0px solid black');

var NewUI='';
        if (MySkin.SkinName != '')
        {
        NewUI = MySkin.SkinName;
        }
        else
        {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin');
        }
        }
          if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
                }
                else
                {
                }

        $('.list-unstyled >li >a').on('click', function () {
        SwitchData();
        });
    }
}
        $('.list-unstyled >li >a').on('click', function () {
        SwitchData();
        });