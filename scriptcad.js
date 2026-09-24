const api = "http://localhost:3000";
document.querySelector("#enviar").addEventListener("click", async () => {
  const senha = document.querySelector("#senha").value;
  const nova = document.querySelector("#Csenha").value;
  if (nova != senha || senha == "" || nova == "") {
    alert("as senhas precisam ser iguais");
  } else {
    const datas = {
      user: document.querySelector("#nome").value,
      password: document.querySelector("#senha").value,
      cpf: document.querySelector("#cpf").value,
      telefone: document.querySelector("#telefone").value,
      endereco: document.querySelector("#endereco").value
    };
    const resposta = await fetch(`${api}/cadastro`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(datas),
    });
    if (resposta.status != 201) {
     return alert("usuário ou senha incorretos");
    }
    window.location.href = "./login.html";
  }
});

const btnLogin = document.querySelector("#btn_login");

if (btnLogin) {
  btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();

    const user = document.querySelector("#login_user").value;
    const password = document.querySelector("#login_senha").value;

    try {
      const resposta = await fetch(`${api}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user, password }),
      });

      if (resposta.ok) {
        const dadosUsuario = await resposta.json();
        localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
        window.location.replace("admin.html");
      } else {
        alert("Utilizador ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao efetuar login:", error);
      alert("Erro ao ligar ao servidor.");
    }
  });
}
