    $(document).ready(function () {
        var Modelhtml = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Confirmation Dialog</h4></div><div class="modal-body"><p id="pmessage" class="success-Message">Are you sure you wish to delete this record ?  </p></div><div class="modal-footer"><button class="btn btn-success delete-confirm">Ok</button><button id="btnCancel" class="btn btn-default" data-dismiss="modal">Cancel</button></div></div></div></div>';
        $(".container-fluid").append(Modelhtml);

        var val = document.getElementById('hdnDeleteMessage');

        if (val) {
            var DeleteMessgage = document.getElementById('hdnDeleteMessage').value;
            if (DeleteMessgage) {
                $("#pmessage").text(DeleteMessgage)
            }
        }
        $('#backbtn').css('color', '#fff');
        $('#backbtn').on('click', function () {
            window.location.href = "/Trade/Index";
        });

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