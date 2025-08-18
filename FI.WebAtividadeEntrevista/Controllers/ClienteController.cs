using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FI.WebAtividadeEntrevista.Models;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente boCliente = new BoCliente();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            if (boCliente.VerificarExistencia(model.CPF))
            {
                Response.StatusCode = 400;
                return Json(new { mensagem = $"Já existe CPF: {model.CPF} cadastrado no sistema" });
            }

            Cliente cliente = new Cliente()
            {
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                CPF = model.CPF
            };

            model.Id = boCliente.Incluir(cliente);

            if (model.Beneficiarios.Count > 0)
            {
                foreach (var beneficiario in model.Beneficiarios)
                {
                    new BoBeneficiario().Incluir(new Beneficiario()
                    {
                        Nome = beneficiario.Nome,
                        CPF = beneficiario.CPF,
                        IdCliente = model.Id
                    });
                }
            }

            return Json("Cadastro efetuado com sucesso");

        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            bo.Alterar(new Cliente()
            {
                Id = model.Id,
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                CPF = model.CPF
            });

            if (model.Beneficiarios.Count > 0)
            {
                List<Beneficiario> beneficiariosExistentes = boBeneficiario.ListarPorCliente(model.Id);
                foreach (var beneficiario in model.Beneficiarios)
                {
                    if (!beneficiariosExistentes.Any(b => b.CPF == beneficiario.CPF))
                    {
                        boBeneficiario.Incluir(new Beneficiario()
                        {
                            Nome = beneficiario.Nome,
                            CPF = beneficiario.CPF,
                            IdCliente = model.Id
                        });
                    }
                }
            }

            return Json("Cadastro alterado com sucesso");

        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF,
                    Beneficiarios = boBeneficiario.ListarPorCliente(cliente.Id)
                        .Select(b => new BeneficiarioModel
                        {
                            Id = b.Id,
                            CPF = b.CPF,
                            Nome = b.Nome
                        })
                        .ToList()
                };
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult ExcluirBeneficiario(long id)
        {
            try
            {
                BoBeneficiario boBeneficiario = new BoBeneficiario();
                boBeneficiario.Excluir(id);
                return Json(new { sucesso = true, mensagem = "Beneficiário excluído com sucesso" });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { sucesso = false, mensagem = "Erro ao excluir beneficiário" });
            }
        }
    }
}