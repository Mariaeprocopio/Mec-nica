import express from "express";
import sql from "./database.js";
const routes = express.Router();

routes.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;
    const resposta = await sql`select * from cliente where nome = ${user}`;
    if (password == resposta[0].senha) {
      return res.status(200).json(resposta[0]);
    }
    return res.status(401).json("erro ao logar");
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

routes.get("/usuarios", async (req, res) => {
  const resposta = await sql`select * from cliente`;
  return res.status(200).json(resposta);
});

routes.get("/usuario/:id", async (req, res) => {
  const { id } = req.params;
  const resposta = await sql`select * from cliente where id_user= ${id}`;
  return res.status(200).json(resposta[0]);
});

routes.post("/cadastro", async (req, res) => {
  try {
    const { user, password, cpf, telefone, endereco } = req.body;
    await sql`INSERT INTO cliente(nome, senha, cpf, telefone, endereco)
VALUES(${user},${password}, ${cpf}, ${telefone}, ${endereco})`;
    return res.status(201).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Erro interno ao cadastrar usuário",
    });
  }
});

routes.delete("/deletar/:id", async (req, res) => {
  const { id } = req.params;
  await sql`delete from cliente where id_user = ${id}`;
  return res.status(200).json("Deletado");
});

routes.put("/editarUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_p } = req.body;
    const resposta = await sql`UPDATE cliente
  SET usuario=${nome_p} WHERE id_user=${id} RETURNING *;`;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao editar usuário" });
  }
});


routes.get("/manutencao", async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM manutencao ORDER BY 1 ASC`;
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar manutenções" });
  }
});


routes.get("/manutencao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let resposta;
    try {
      resposta =
        await sql`SELECT * FROM manutencao WHERE id_manutencao = ${id}`;
    } catch {
      resposta = await sql`SELECT * FROM manutencao WHERE id = ${id}`;
    }
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar registro" });
  }
});


routes.post("/cad_manutencao", async (req, res) => {
  try {
    const {
      data_ent,
      data_saida,
      previsao_saida,
      situacao,
      tipo_servico,
      valor,
      descricao_problema,
    } = req.body;

    const resposta = await sql`
      INSERT INTO manutencao 
        (data_ent, data_saida, previsao_saida, situacao, tipo_servico, valor, descricao_problema)
      VALUES 
        (${data_ent}, ${data_saida}, ${previsao_saida}, ${situacao}, ${tipo_servico}, ${valor}, ${descricao_problema})
      RETURNING *
    `;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao cadastrar manutenção" });
  }
});


routes.delete("/deleta_manutencao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await sql`DELETE FROM manutencao WHERE id_manutencao = ${id}`;
    } catch {
      await sql`DELETE FROM manutencao WHERE id = ${id}`;
    }
    return res.status(200).json({ message: "Deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar manutenção" });
  }
});

routes.put("/editar_manutencao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      data_ent,
      data_saida,
      previsao_saida,
      situacao,
      tipo_servico,
      valor,
      descricao_problema,
    } = req.body;

    let resposta;
    try {
      resposta = await sql`
        UPDATE manutencao SET 
          data_ent=${data_ent}, 
          data_saida=${data_saida}, 
          previsao_saida=${previsao_saida}, 
          situacao=${situacao}, 
          tipo_servico=${tipo_servico}, 
          valor=${valor}, 
          descricao_problema=${descricao_problema}
        WHERE id_manutencao = ${id} 
        RETURNING *
      `;
    } catch {
      resposta = await sql`
        UPDATE manutencao SET 
          data_ent=${data_ent}, 
          data_saida=${data_saida}, 
          previsao_saida=${previsao_saida}, 
          situacao=${situacao}, 
          tipo_servico=${tipo_servico}, 
          valor=${valor}, 
          descricao_problema=${descricao_problema}
        WHERE id = ${id} 
        RETURNING *
      `;
    }
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao editar manutenção" });
  }
});

routes.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;

    const resposta = await sql`SELECT * FROM cliente WHERE nome = ${user}`;

    if (resposta.length === 0 || resposta[0].senha !== password) {
      return res.status(401).json("Usuário ou senha incorretos");
    }
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json("Erro interno no servidor");
  }
});

routes.get("/veiculos", async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM veiculo ORDER BY id_veiculo ASC`;
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

routes.get("/veiculo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resposta = await sql`SELECT * FROM veiculo WHERE id_veiculo = ${id}`;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

routes.post("/cad_veiculo", async (req, res) => {
  try {
    const { marca, modelo, placa, ano, cor, id_cliente } = req.body;

    const resposta = await sql`
      INSERT INTO veiculo (marca, modelo, placa, ano, cor, id_cliente)
      VALUES (
        ${marca}, 
        ${modelo}, 
        ${placa}, 
        ${ano}, 
        ${cor}, 
        ${id_cliente || null}
      )
      RETURNING *
    `;
    return res.status(201).json(resposta[0]);
  } catch (error) {
    console.error("Erro ao cadastrar veículo no Postgres:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

routes.delete("/deleta_veiculo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM veiculo WHERE id_veiculo = ${id}`;
    return res.status(200).json({ message: "Veículo excluído" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

routes.put("/editar_veiculo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, modelo, placa, ano, cor, id_cliente } = req.body;
    const resposta = await sql`
      UPDATE veiculo SET 
        marca = ${marca}, 
        modelo = ${modelo}, 
        placa = ${placa}, 
        ano = ${ano}, 
        cor = ${cor}, 
        id_cliente = ${id_cliente}
      WHERE id_veiculo = ${id}
      RETURNING *
    `;
    return res.status(200).json(resposta[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});
export default routes;
