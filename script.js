const data_ent = document.querySelector("#data_ent");
const data_saida = document.querySelector("#data_saida");
const previsao_saida = document.querySelector("#previsao_saida");
const situacao = document.querySelector("#situacao");
const tipo_servico = document.querySelector("#tipo_serviço");
const valor = document.querySelector("#valor");
const descricao_problema = document.querySelector("#descricao_problema");
const corpo = document.querySelector("tbody");
const form = document.querySelector("form");
const api = "http://localhost:3000";
let manutencoes = [];
window.addEventListener("load", async () => {
  try {
    const resposta = await fetch(`${api}/manutencao`);
    manutencoes = await resposta.json();
    renderizar(manutencoes);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
});


function renderizar(lista) {
  corpo.innerHTML = "";
  lista.forEach((item) => {
    const id = item.id_manutencao || item.id;
    corpo.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${item.data_ent || ""}</td>
        <td>${item.data_saida || ""}</td>
        <td>${item.previsao_saida || ""}</td>
        <td>${item.situacao || ""}</td>
        <td>${item.descricao_problema || ""}</td>
        <td>${item.tipo_servico || item.tipo_serviço || ""}</td>
        <td>${item.valor || ""}</td>
        <td>
          <button onclick="deletar(${id})">🗑️</button>
          <button onclick="editar(${id})">✏️</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    data_ent: data_ent.value,
    data_saida: data_saida.value,
    previsao_saida: previsao_saida.value,
    situacao: situacao.value,
    tipo_servico: tipo_servico.value,
    valor: valor.value,
    descricao_problema: descricao_problema.value,
  };

  try {
    const resposta = await fetch(`${api}/cad_manutencao`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      alert("Cadastrado com sucesso!");
      window.location.reload();
    } else {
      alert("Erro ao cadastrar. Verifique o console do backend.");
    }
  } catch (error) {
    console.error("Erro ao enviar cadastro:", error);
  }
});


async function deletar(id) {
  if (!confirm("Deseja realmente excluir este registro?")) return;
  try {
    const resposta = await fetch(`${api}/deleta_manutencao/${id}`, {
      method: "DELETE",
    });

    if (resposta.ok) {
      window.location.reload();
    } else {
      alert("Erro ao deletar.");
    }
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}


async function editar(id) {
  try {
    const busca = await fetch(`${api}/manutencao/${id}`);
    const item = await busca.json();

    const dadosAtualizados = {
      data_ent: prompt("Data de Entrada", item.data_ent) || item.data_ent,
      data_saida: prompt("Data de Saída", item.data_saida) || item.data_saida,
      previsao_saida:
        prompt("Previsão de Saída", item.previsao_saida) || item.previsao_saida,
      situacao: prompt("Situação", item.situacao) || item.situacao,
      tipo_servico:
        prompt("Tipo de Serviço", item.tipo_servico || item.tipo_serviço) ||
        item.tipo_servico,
      valor: prompt("Valor", item.valor) || item.valor,
      descricao_problema:
        prompt("Descrição do Problema", item.descricao_problema) ||
        item.descricao_problema,
    };

    const resposta = await fetch(`${api}/editar_manutencao/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dadosAtualizados),
    });

    if (resposta.ok) {
      window.location.reload();
    } else {
      alert("Erro ao editar.");
    }
  } catch (error) {
    console.error("Erro ao editar:", error);
  }
}
