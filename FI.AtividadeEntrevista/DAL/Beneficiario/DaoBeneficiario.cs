using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace FI.AtividadeEntrevista.DAL.Beneficiarios
{
    internal class DaoBeneficiario : AcessoDados
    {
        /// <summary>
        /// Inclui um novo beneficiário
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        internal long Incluir(Beneficiario beneficiario)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("CPF", beneficiario.CPF),
                new SqlParameter("Nome", beneficiario.Nome),
                 new SqlParameter("IdCliente", beneficiario.IdCliente),
            };

            DataSet dataSet = base.Consultar("FI_SP_IncBeneficiario", parametros);

            long result = 0;

            if (dataSet.Tables[0].Rows.Count > 0)
                long.TryParse(dataSet.Tables[0].Rows[0][0].ToString(), out result);

            return result;
        }

        /// <summary>
        /// Lista todos os beneficiários
        /// </summary>
        internal List<Beneficiario> ListarPorCliente(long clienteId)
        {
            List<SqlParameter> parametros = new List<SqlParameter> { new SqlParameter("IdCliente", clienteId) };

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<Beneficiario> beneficiarios = Converter(ds);

            return beneficiarios;
        }

        /// <summary>
        /// Altera um beneficiário
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiario</param>
        internal void Alterar(Beneficiario beneficiario)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            parametros.Add(new SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new SqlParameter("Nome", beneficiario.Nome));
            parametros.Add(new SqlParameter("Id", beneficiario.Id));

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }

        /// <summary>
        /// Exclui o Beneficiário
        /// </summary>
        /// <param name="cliente">Objeto de beneficiario</param>
        internal void Excluir(long Id)
        {
            List<SqlParameter> parametros = new List<SqlParameter> { new SqlParameter("Id", Id) };

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }

        private List<Beneficiario> Converter(DataSet ds)
        {
            List<Beneficiario> lista = new List<Beneficiario>();

            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    Beneficiario beneficiario = new Beneficiario();
                    beneficiario.Id = row.Field<long>("Id");
                    beneficiario.CPF = row.Field<string>("CPF");
                    beneficiario.Nome = row.Field<string>("Nome");                    
                    beneficiario.IdCliente = row.Field<long>("IdCliente");

                    lista.Add(beneficiario);
                }
            }

            return lista;
        }
    }
}