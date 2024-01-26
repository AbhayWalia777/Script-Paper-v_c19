$(document).ready(function () {
    $("#txtUserName").autocomplete({

        source: function (request, response) {

            $.ajax({
                url: "/admin/GetUserList",
                type: "GET",
                dataType: "json",
                data: { Search: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.email, value: item.email };
                    }))

                }
            })
        },
        messages: {
            noResults: "", results: ""
        },
        minLength: 2,
        select: function (event, ui) {
            $(this).text(ui.item.label);
            $("#Email").val(ui.item.value);
        }
    });


    $("#TransferedToSuperAdmin").autocomplete({

        source: function (request, response) {

            $.ajax({
                url: "/Admin/GetUserSearchDataForRechargeCoupon",
                type: "GET",
                dataType: "json",
                data: { Search: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return { label: item.email, value: item.email };
                    }))

                }
            })
        },
        messages: {
            noResults: "", results: ""
        },
        minLength: 2,
        select: function (event, ui) {
            $(this).text(ui.item.label);
            $("#TransferedToSuperAdmin").val(ui.item.value);
        }
    });
    
    //$("#TransferedTo").autocomplete({

    //    source: function (request, response) {

    //        $.ajax({
    //            url: "/Admin/GetUserSearchDataForRechargeCoupon",
    //            type: "GET",
    //            dataType: "json",
    //            data: { Search: request.term },
    //            success: function (data) {
    //                response($.map(data, function (item) {
    //                    return { label: item[0].email, value: item[0].email };
    //                }))

    //            }
    //        })
    //    },
    //    messages: {
    //        noResults: "", results: ""
    //    },
    //    minLength: 2,
    //    select: function (event, ui) {
    //        $(this).text(ui.item.label);
    //        $("#TransferedTo").val(ui.item.value);
    //    }
    //});
});

   
function CheckWithDrawalCondition() {
    var remainingBalance = parseFloat($("#RemainingBalance").val());
    var withdrawalAmount = parseFloat($("#WithdrawalAmount").val());
    var userId = parseInt($("#UserId").val());
    var tenantId = parseInt($("#TenantId").val());
    var ReturnUrl = $("#returnUrl").val();



    if (withdrawalAmount > 0) {

        if (withdrawalAmount <= remainingBalance) {
            $.ajax({
                url: "/Admin/Withdrawal",
                type: "post",
                dataType: "json",
                data: { UserId: userId, TenantId: tenantId, WithdrawalAmount: withdrawalAmount, returnUrl: ReturnUrl},
                success: function (data) {
                    if (data != "" && data != null) {
                        window.location.href = data;
                    }
                    else {
                        $("#ErrorMessage").html("Something Went Wrong");
                        $(".ErrorAlert").css("display", "block");
                    }
                }
            });
        }
        else {
            $("#ErrorMessage").html("Withdrawal Balance Must Be Less Then Wallet Balance");
            $(".ErrorAlert").css("display", "block");
        }
    }
    else {
        $("#ErrorMessage").html("Withdrawal Balance Must Be Greater Than 0");
        $(".ErrorAlert").css("display", "block");
    }

}
function CheckLoanWithDrawalCondition() {
    var remainingLoanBalance = parseFloat($("#RemainingLoanBalance").val());
    var withdrawalLoanAmount = parseFloat($("#WithdrawalLoanAmount").val());
    var userId = parseInt($("#UserId").val());
    var tenantId = parseInt($("#TenantId").val());
    var ReturnUrl = $("#returnUrl").val();



    if (withdrawalLoanAmount > 0) {

        if (withdrawalLoanAmount <= remainingLoanBalance) {
            $.ajax({
                url: "/Admin/WithdrawalLoanBalance",
                type: "post",
                dataType: "json",
                data: { UserId: userId, TenantId: tenantId, WithdrawalLoanAmount: withdrawalLoanAmount, returnUrl: ReturnUrl},
                success: function (data) {
                    if (data != "" && data != null) {
                        window.location.href = data;
                    }
                    else {
                        $("#ErrorMessage").html("Something Went Wrong");
                        $(".ErrorAlert").css("display", "block");
                    }
                }
            });
        }
        else {
            $("#ErrorMessage").html("Withdrawal Balance Must Be Less Then Wallet Balance");
            $(".ErrorAlert").css("display", "block");
        }
    }
    else {
        $("#ErrorMessage").html("Withdrawal Balance Must Be Greater Than 0");
        $(".ErrorAlert").css("display", "block");
    }

}
function GiveLoanBalace()
{
    var userId = parseInt($("#UserId").val());
    var GiveBalanceAsLoan = parseFloat($("#GiveBalanceAsLoan").val());
    var ReturnUrl = $("#returnUrl").val();

            $.ajax({
                url: "/Admin/AddBalanceAsLoan",
                type: "post",
                dataType: "json",
                data: { Userid: userId, LoanAmount: GiveBalanceAsLoan, returnUrl: ReturnUrl},
                success: function (data) {
                    if (data != "" && data != null) {
                        window.location.href = data;
                    }
                    else {
                        $("#ErrorMessage").html("Something Went Wrong");
                        $(".ErrorAlert").css("display", "block");
                    }
                }
            });
}

function OpenTransferCouponToAdminModal(data) {
 
}
function GiveProfitBalanceSattlement(Data)
{
    var userId = parseInt($("#UserId").val());
    var Data = $("#SattleCondition").val();
    var GiveBalanceSattlement = parseFloat($("#GiveBalanceSattlement").val());
    var ReturnUrl = $("#returnUrl").val();
    $.ajax({
        url: "/Admin/GiveBalanceSattlement",
        type: "post",
        dataType: "json",
        data: { Userid: userId, Balance: GiveBalanceSattlement, returnUrl: ReturnUrl, Condition: Data },
        success: function (data) {
            if (data != "" && data != null) {
                window.location.href = data;
            }
            else {
                $("#ErrorMessage").html("Something Went Wrong");
                $(".ErrorAlert").css("display", "block");
            }
        }
    });

}
 function SwitchDataTheme() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
                          }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.box-header').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css('background-color','var(--main-color-on-layoutchange)');
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.btn-success').css({'border':'','color':'','background-color':''});
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
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
                $('input[disabled],input[readonly]').css({'background-color':'gray','color':'black'});
                $('input[readonly]').css('cursor','not-allowed');
                $('input[readonly] .form-control').css('cursor','not-allowed');
                }
                else
                {
        $('input[disabled]').css('background-color','var(--main-color-on-layoutchange)');
        $('input[readonly]').css('background-color','var(--main-color-on-layoutchange)');
        $('input[readonly]').css('cursor','not-allowed');
        $('input[readonly] .form-control').css('cursor','not-allowed');
                }
    }
}