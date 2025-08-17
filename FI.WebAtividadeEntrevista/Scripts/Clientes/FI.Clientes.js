$(document).ready(function () {

    $("#CPF").on("input", function () {
        $(this).val(formatarCPF($(this).val()));
    });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        let cpfVal = $("#CPF").val();

        if (!validarCPF(cpfVal)) {
            ModalDialog("Erro", "CPF inválido!");
            $("#CPF").focus();
            return;
        }

        cpfVal = cpfVal.replace(/\D/g, '');

        let beneficiarios = [];
        $("#listaBeneficiarios tbody tr").each(function () {
            beneficiarios.push({
                CPF: $(this).find(".cpfBenef").text(),
                Nome: $(this).find("td:eq(2)").text()
            });
        });

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": cpfVal,
                "Beneficiarios": beneficiarios
            },
            error: function (r) {
                if (r.responseJSON && r.responseJSON.mensagem) {
                    ModalDialog("Ocorreu um erro", r.responseJSON.mensagem);
                } else if (r.status == 500) {
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                } else {
                    ModalDialog("Ocorreu um erro", "Não foi possível processar sua solicitação.");
                }
            },
            success: function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
                
                $("#listaBeneficiarios tbody").empty();
            }
        });
    });

});

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '').slice(0, 11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) =>
        p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`
    );
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
