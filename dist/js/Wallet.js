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
                        return { label: item.Email, value: item.Email };
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
                        return { label: item.Email, value: item.Email };
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
    //                    return { label: item[0].Email, value: item[0].Email };
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
    var UserID = parseInt($("#UserID").val());
    var tenantId = parseInt($("#TenantId").val());
    var ReturnUrl = $("#returnUrl").val();



    if (withdrawalAmount > 0) {

        if (withdrawalAmount <= remainingBalance) {
            $.ajax({
                url: "/Admin/Withdrawal",
                type: "post",
                dataType: "json",
                data: { UserID: UserID, TenantId: tenantId, WithdrawalAmount: withdrawalAmount, returnUrl: ReturnUrl},
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
    var UserID = parseInt($("#UserID").val());
    var tenantId = parseInt($("#TenantId").val());
    var ReturnUrl = $("#returnUrl").val();



    if (withdrawalLoanAmount > 0) {

        if (withdrawalLoanAmount <= remainingLoanBalance) {
            $.ajax({
                url: "/Admin/WithdrawalLoanBalance",
                type: "post",
                dataType: "json",
                data: { UserID: UserID, TenantId: tenantId, WithdrawalLoanAmount: withdrawalLoanAmount, returnUrl: ReturnUrl},
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
    var UserID = parseInt($("#UserID").val());
    var GiveBalanceAsLoan = parseFloat($("#GiveBalanceAsLoan").val());
    var ReturnUrl = $("#returnUrl").val();

            $.ajax({
                url: "/Admin/AddBalanceAsLoan",
                type: "post",
                dataType: "json",
                data: { UserID: UserID, LoanAmount: GiveBalanceAsLoan, returnUrl: ReturnUrl},
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
    var UserID = parseInt($("#UserID").val());
    var Data = $("#SattleCondition").val();
    var GiveBalanceSattlement = parseFloat($("#GiveBalanceSattlement").val());
    var ReturnUrl = $("#returnUrl").val();
    $.ajax({
        url: "/Admin/GiveBalanceSattlement",
        type: "post",
        dataType: "json",
        data: { UserID: UserID, Balance: GiveBalanceSattlement, returnUrl: ReturnUrl, Condition: Data },
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
