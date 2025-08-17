$(document).ready(function () {

    $("#CPF").on("input", function () {
        $(this).val(formatarCPF($(this).val()));
    });

    $("#CPFBeneficiario").on("input", function () {
        $(this).val(formatarCPF($(this).val()));
    });

    $('#incluirBeneficiarioModal').on('hidden.bs.modal', function () {
        $("#CPFBeneficiario, #NomeBeneficiario").val('');
    });

    $("#btnIncluirBeneficiario").click(function (e) {
        e.preventDefault();

        let cpf = $("#CPFBeneficiario").val();
        let nome = $("#NomeBeneficiario").val();

        if (!validarCPF(cpf)) {
            ModalDialog("Erro", "CPF do beneficiário inválido!");
            $("#CPFBeneficiario").focus();
            return;
        }

        let existe = false;
        $("#listaBeneficiarios tbody tr").each(function () {
            if ($(this).find(".cpfBenef").text() === cpf) {
                existe = true;
                return false;
            }
        });

        if (existe) {
            ModalDialog("Erro", "Já existe um beneficiário com este CPF!");
            return;
        }

        $("#listaBeneficiarios tbody").append(`
            <tr>
                <td></td>
                <td class="cpfBenef">${cpf}</td>
                <td>${nome}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger btnExcluirBenef">Excluir</button>
                </td>
            </tr>
        `);

        cpf = cpf.replace(/\D/g, '');

        $("#CPFBeneficiario, #NomeBeneficiario").val('');
        $("#CPFBeneficiario").focus();
    });

    $(document).on("click", ".btnExcluirBenef", function () {
        $(this).closest("tr").remove();
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
    var html = '<div id="' + random + '" class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '<h4 class="modal-title">' + titulo + '</h4>' +
        '</div>' +
        '<div class="modal-body"><p>' + texto + '</p></div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>' +
        '</div></div></div></div>';

    $('body').append(html);
    $('#' + random).modal('show');
}
