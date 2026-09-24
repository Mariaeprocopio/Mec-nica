const api = "http://localhost:3000";
const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
if (!usuarioLogado) {
  alert("Acesso negado! Faça login primeiro.");
  window.location.replace("./login.html");
}
const form = document.querySelector("#form_veiculo");
const corpoTabela = document.querySelector("#tabela_veiculos");

function logout() {
  localStorage.clear();
  window.location.replace("./login.html");
}
window.addEventListener("load", carregarVeiculos);
async function carregarVeiculos() {
  try {
    const resposta = await fetch(`${api}/veiculos`);
    if (!resposta.ok) throw new Error("Erro ao buscar veículos");

    const veiculos = await resposta.json();
    renderizarTabela(veiculos);
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
  }
}

function renderizarTabela(lista) {
  corpoTabela.innerHTML = "";
  lista.forEach((item) => {
    const id = item.id_veiculo || item.id;
    corpoTabela.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${item.marca || ""}</td>
        <td>${item.modelo || ""}</td>
        <td>${item.placa || ""}</td>
        <td>${item.ano || ""}</td>
        <td>${item.cor || ""}</td>
        <td>
          <button onclick="deletarVeiculo(${id})">🗑️</button>
          <button onclick="editarVeiculo(${id})">✏️</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    marca: document.querySelector("#marca").value,
    modelo: document.querySelector("#modelo").value,
    placa: document.querySelector("#placa").value,
    ano: Number(document.querySelector("#ano").value),
    cor: document.querySelector("#cor").value,
  };

  try {
    const resposta = await fetch(`${api}/cad_veiculo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      alert("Veículo cadastrado com sucesso!");
      form.reset();
      carregarVeiculos();
    } else {
      alert("Erro ao cadastrar veículo.");
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
  }
});

async function deletarVeiculo(id) {
  if (!confirm("Deseja realmente excluir este veículo?")) return;

  try {
    const resposta = await fetch(`${api}/deleta_veiculo/${id}`, {
      method: "DELETE",
    });

    if (resposta.ok) {
      carregarVeiculos();
    } else {
      alert("Erro ao excluir veículo.");
    }
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}

async function editarVeiculo(id) {
  try {
    const busca = await fetch(`${api}/veiculo/${id}`);
    const v = await busca.json();

    const dadosAtualizados = {
      marca: prompt("Nova Marca:", v.marca) || v.marca,
      modelo: prompt("Novo Modelo:", v.modelo) || v.modelo,
      placa: prompt("Nova Placa:", v.placa) || v.placa,
      ano: Number(prompt("Novo Ano:", v.ano)) || v.ano,
      cor: prompt("Nova Cor:", v.cor) || v.cor,
    };

    const resposta = await fetch(`${api}/editar_veiculo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosAtualizados),
    });

    if (resposta.ok) {
      carregarVeiculos();
    } else {
      alert("Erro ao editar veículo.");
    }
  } catch (error) {
    console.error("Erro ao editar:", error);
  }
}
