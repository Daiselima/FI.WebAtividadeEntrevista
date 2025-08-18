$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(formatarCPF(obj.CPF));
    }

    if (obj.Beneficiarios.length > 0) {

        var $tbody = $("#listaBeneficiarios tbody");
        $tbody.empty();
        obj.Beneficiarios.forEach(function (benef) {
            $tbody.append(
                `<tr data-id="${benef.Id}">
                    <td></td>
                    <td class="cpfBenef">${formatarCPF(benef.CPF)}</td>
                    <td>${benef.Nome}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-danger btnExcluirBenef">Excluir</button>
                    </td>
                </tr>`
            );
        });
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault(urlPost);

        let beneficiarios = [];
        $("#listaBeneficiarios tbody tr").each(function () {
            beneficiarios.push({
                CPF: $(this).find(".cpfBenef").text().replace(/\D/g, ''),
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
                "CPF": $(this).find("#CPF").val().replace(/\D/g, ''),
                "Beneficiarios": beneficiarios
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();   
                setTimeout(function () {
                    window.location.href = urlRetorno
                }, 2000);
            }
        });
    })
    
})

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

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '').slice(0, 11);
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, function (_, p1, p2, p3, p4) {
        return p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`;
    });
}