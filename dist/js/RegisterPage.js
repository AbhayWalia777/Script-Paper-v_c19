




//function fullname_check() {
//    var correct_way = /^[A-Za-z]+$/;
//    var f_name = $("#FullNameid").val();
//    if (!f_name.match(correct_way)) {
//        $("#FullNameid").val('');
//        $("#FullNameMsg").text("Please enter valid data");
//    }
//}
//function phoneno_check() {
//    var pattern = /^[0-9]+$/;
//    var Phone = $("#PhoneNoid").val();
//    if (!Phone.match(pattern)) {
//        $("#PhoneNoid").val('');
//        $("#PhoneNoMsg").text("Please enter valid Number");
//    }
//}

//$(document).ready(function () {
         
   
//            $('#RegisterBtn').on('click', function () {
//                /*if ($("#CbxRegister").prop('checked') == true) {*/
//                    var spId = $("#Sponsorid").val();                   
//                    if (spId == "" || spId == null || spId == undefined) {
//                        $('#RegisterUserForm').submit();
//                    }
//                    else {
//                        var spId = $("#Sponsorid").val();

//                            var obj = { Sponsorid: spId };
//                            $.post("/home/GetSponserData", obj).done(function (res, status) {
//                                if (res != "" && res != null) {
//                                    $('#RegisterUserForm').submit();
//                                }
//                                else {
//                                    $("#Sponsorid").val('');
//                                    $("#Sponsorid").focus();
//                                    $("#SponsoridMsg").text("Invalid Sponser ID");
//                                }
//                            })
//                                .fail(function (error) {

//                                })

//                    }
                   
//                //}
//                //else {
//                //    $('#CbxMsg').html('Please Accept Terms & Condition.');
//                //}
//            });
//        });
//        $("#Sponsorid").on('change', function () {
//            var spId = $("#Sponsorid").val();
//            if (spId != "" || spId != null || spId != undefined) {
//                var obj = { Sponsorid: spId };
//                $.post("/home/GetSponserData", obj).done(function (res, status) {
//                    if (res != "" && res != null) {
//                        $("#Sponsorid").attr("readonly", true);
//                        $("#SponsoridMsg").text("Success! Sponcer Name :" + res);

//                    }
//                    else {
//                        $("#Sponsorid").val('');
//                        $("#Sponsorid").focus();
//                        $("#SponsoridMsg").text("Invalid Sponser ID");
//                    }
//                })
//                    .fail(function (error) {

//                    })
//            }
//        });