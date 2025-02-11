function removeDivByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
//Example
//ConfirmModel("Delete This Record", "Are you sure?", function () {
//    var resp = $('.crespp').html();
//    $('.cresp').remove();
//    if (resp == 'Yes') {
//        console.log('fine');
//    }
//});
function ConfirmModel(Dialogtitle, Message, yes) {
    removeDivByClass('crespp');
    playBeep();
    var html = `<div class="modal fade dialogbox" id="DialogBasic" data-bs-backdrop="static" tabindex="-1" style="display: none;" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${Dialogtitle}</h5>
                    </div>
                    <div class="modal-body">
                        ${Message}
                    </div>
                    <div class="modal-footer">
                        <div class="btn-inline">
                            <a href="#" class="btn btn-text-secondary" id="CloseModal">CLOSE</a>
                            <a href="#" class="btn btn-text-primary" id="Btn_Sure_Confirm_New">OK</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;


    $('body').append(html);
    $('body').append('<div class="leadd crespp" hidden></div>');
    new bootstrap.Modal(document.getElementById('DialogBasic')).show();
    $('#Btn_Sure_Confirm_New').on('click', function () {
        $('body').find('.crespp').html('Yes'); $('#DialogBasic').modal('hide'); removeDivByClass('dialogbox'); removeDivByClass('modal-backdrop'); yes();
    });
    $('#CloseModal').on('click', function () {
        $('#DialogBasic').modal('hide'); removeDivByClass('dialogbox'); removeDivByClass('modal-backdrop'); yes();
    });
}
function DeleteModel(Dialogtitle, Message, yes) {
    removeDivByClass('crespp');
    playBeep();
    var html = `<div class="modal fade dialogbox" id="DialogIconedButtonInline" data-bs-backdrop="static" tabindex="-1" style="display: none;" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${Dialogtitle}</h5>
                    </div>
                    <div class="modal-body">
                        ${Message}
                    </div>
                    <div class="modal-footer">
                        <div class="btn-inline">
                            <a href="#" id="Btn_Sure_Confirm_New" class="btn btn-text-danger">
                                <ion-icon name="trash-outline" role="img" class="md hydrated" aria-label="trash outline"></ion-icon>
                                DELETE
                            </a>
                            <a href="#" class="btn btn-text-secondary btn-block" id="CloseModal">CLOSE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;


    $('body').append(html);
    $('body').append('<div class="leadd crespp" hidden></div>');
    new bootstrap.Modal(document.getElementById('DialogIconedButtonInline')).show();
    $('#Btn_Sure_Confirm_New').on('click', function () {
        $('body').find('.crespp').html('Yes'); $('#DialogIconedButtonInline').modal('hide'); removeDivByClass('dialogbox'); removeDivByClass('modal-backdrop'); yes();
    });
    $('#CloseModal').on('click', function () {
        $('#DialogIconedButtonInline').modal('hide'); removeDivByClass('dialogbox'); removeDivByClass('modal-backdrop'); yes();
    });
}
function SuccessAlert(Message) {
    removeDivByClass('crespp');
    playBeep();
    var html = `<div class="modal fade dialogbox" id="DialogIconedSuccess" data-bs-backdrop="static" tabindex="-1" style="display: none;" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-icon text-success">
                        <ion-icon name="checkmark-circle" role="img" class="md hydrated" aria-label="checkmark circle"></ion-icon>
                    </div>
                    <div class="modal-header">
                        <h5 class="modal-title">Success</h5>
                    </div>
                    <div class="modal-body">
                        ${Message}
                    </div>
                    <div class="modal-footer">
                        <div class="btn-inline">
                            <a href="#" class="btn" id="CloseModal">CLOSE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    $('body').append(html);
    new bootstrap.Modal(document.getElementById('DialogIconedSuccess')).show();
    $('#CloseModal').on('click', function () {
        $('body').find('.crespp').html('Yes'); $('#DialogIconedSuccess').modal('hide'); removeDivByClass('dialogbox'); removeDivByClass('modal-backdrop');
    });
}
function ErrorAlert(Message) {
    removeDivByClass('crespp');
    playBeep();
    var html = `<div class="modal fade dialogbox" id="DialogIconedDanger" data-bs-backdrop="static" tabindex="-1" style="display: none;" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-icon text-danger">
                        <ion-icon name="close-circle" role="img" class="md hydrated" aria-label="close circle"></ion-icon>
                    </div>
                    <div class="modal-header">
                        <h5 class="modal-title">Error</h5>
                    </div>
                    <div class="modal-body">
                        ${Message}
                    </div>
                    <div class="modal-footer">
                        <div class="btn-inline">
                            <a href="#" class="btn" id="CloseModal">CLOSE</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    $('body').append(html);
    new bootstrap.Modal(document.getElementById('DialogIconedDanger')).show();
    $('#CloseModal').on('click', function () {
        $('#DialogIconedDanger').modal('hide'); removeDivByClass('dialogbox'); removeDivByClass('modal-backdrop'); 
    });
}

