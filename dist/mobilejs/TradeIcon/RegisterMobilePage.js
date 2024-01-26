        $('input', 'form').blur(function () {
            $(this).valid();
        });
        $(document).ready(function () {
            $('#RegisterBtn').on('click', function () {
                if ($("#CbxRegister").prop('checked') == true) {
                    var spId = $("#Sponsorid").val();
                    if (spId == "" || spId == null || spId == undefined) {
                        $('#RegisterUserForm').submit();
                    }
                    else {
                        var spId = $("#Sponsorid").val();

                        var obj = { Sponsorid: spId };
                        $.post("/home/GetSponserData", obj).done(function (res, status) {
                            if (res != "" && res != null) {
                                $('#RegisterUserForm').submit();
                            }
                            else {
                                $("#Sponsorid").val('');
                                $("#Sponsorid").focus();
                                $("#SponsoridMsg").text("Invalid Sponser ID");
                            }
                        })
                            .fail(function (error) {

                            })

                    }
                }
                else {
                   // $('#CbxMsg').html('Please Accept Terms & Condition.');
                    $('#RegisterUserForm').submit();
                }
            });
        });
        $("#Sponsorid").on('change', function () {
            var spId = $("#Sponsorid").val();
            if (spId != "" || spId != null || spId != undefined) {
                var obj = { Sponsorid: spId };
                $.post("/home/GetSponserData", obj).done(function (res, status) {
                    if (res != "" && res != null) {
                        $("#Sponsorid").attr("readonly", true);
                        $("#SponsoridMsg").text("Success! Sponcer Name :" + res);

                    }
                    else {
                        $("#Sponsorid").val('');
                        $("#Sponsorid").focus();
                        $("#SponsoridMsg").text("Invalid Sponser ID");
                    }
                })
                    .fail(function (error) {

                    })
            }
        });
