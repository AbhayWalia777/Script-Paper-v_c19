$(document).ready(function () {
    //$('input', 'form').blur(function () {
    //    $(this).valid();
    //});

    var Modelhtml = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header alert alert-danger"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Confirmation Dialog</h4></div><div class="modal-body"><p id="pmessage" class="success-Message">Are you sure you wish to delete this record ?  </p></div><div class="modal-footer"><button class="btn btn-success delete-confirm">Ok</button><button id="btnCancel" class="btn btn-default" data-dismiss="modal">Cancel</button></div></div></div></div>';
    $("#mainWindow").append(Modelhtml);

    var val = document.getElementById('hdnDeleteMessage');

    if (val) {
        var DeleteMessgage = document.getElementById('hdnDeleteMessage').value;
        if (DeleteMessgage) {
            $("#pmessage").text(DeleteMessgage)
        }
    }

    //delcaring global variable to hold primary key value.
    var pryEmpId;
    $(document).on('click', '.delete-prompt', function () {
        
        pryEmpId = $(this).attr('id');
        $('#myModal').modal('show');
        return false;
    });

    $('.delete-confirm').click(function () {
        if (pryEmpId != '') {
            //debugger
            //var DeleteUrl = $("#hdnDeleteURL").val();
            var DeleteUrl = document.getElementById('hdnDeleteURL').value;
            window.location.href = DeleteUrl + pryEmpId;
        }
    });

    //function to reset bootstrap modal popups
    $("#myModal").on("hidden.bs.modal", function () {

        $(".modal-header").removeClass(' ').addClass('alert-danger');
        $('.delete-confirm').css('display', 'inline-block');
        $('.success-Message').html('').html('Are you sure you wish to delete this record ?');
    });
    //end of the docuement ready function
});




function GetDefaultMessage(type, Message) {

    if (Message != '') {
        return Message;
    }

    if (type == 1) {
        return "Your Record has been saved successfully.";
    }
    else if (type == 2) {
        return "A problem has been occurred while submitting your data.";
    }
}
/*New Popup Code For Android Application*/
function newconfirmMobile(q, yes) {
    var html = '<div tabindex="-1" class="modal fade" id="Logout_Model" data-keyboard="false" role="dialog" style="z-index: 90000;">' +
        '<div class="confirm_Model">' +
        '<h1>Confirm your action</h1>' +
        '<p>' +
        'Are you' +
        '<strong> really</strong> sure that you want to ' + q +
        '</p>' +
        '<button id="Btn_Cancel_Confirm" data-dismiss="modal">Cancel</button>' +
        '<button id="Btn_Sure_Confirm"  autofocus>Confirm</button>' +
        '</div>' +
        '</div>';
    $('body').append(html);
    $('body').append('<div class="lead cresp"></div>');
    $('#Logout_Model').modal('show');
    $('#Btn_Sure_Confirm').on('click', function () {
        $('body').find('.cresp').html('Yes');
        $('#Logout_Model').modal('hide');
        yes();
    });
}
//This is a example to use that Popup Method
//newconfirmMobile("Delete This Record", function () {
//    var resp = $('body').find('.cresp').html();
//    $('body').find('.cresp').remove();
//    if (resp == 'Yes') {
//        Your Code Here
//    }
//    });
/*New Popup Code For Android Application*/
function newconfirmMobileTradeIcon(q, yes) {
    var html = '<div tabindex="-1" class="modal fade" id="Confirm_Model" data-keyboard="false" role="dialog" style="z-index: 90000;">' +
        '<div class="confirm_Model_NewTradeIcon">' +
        '<h1>Confirmation</h1>' +
        '<p>'+q+'</p>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"></div>' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">' +
        '<button id="Btn_Sure_Confirm_New" autofocus="">YES</button>' +
        '</div>' +
        '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="padding-left:21px;">' +
        '<button id="Btn_Cancel_Confirm_New" data-dismiss="modal">NO</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('body').append(html);
    $('body').append('<div class="leadd crespp"></div>');
    $('#Confirm_Model').modal('show');
    $('#Btn_Sure_Confirm_New').on('click', function () {
        $('body').find('.crespp').html('Yes');
        $('#Confirm_Model').modal('hide');
        yes();
    });
}
//This is a example to use that Popup Method
//newconfirmMobileTradeIcon("Delete This Record", function () {
//    var resp = $('body').find('.crespp').html();
//    $('body').find('.crespp').remove();
//    if (resp == 'Yes') {
//        Your Code Here
//    }
//    });
    
