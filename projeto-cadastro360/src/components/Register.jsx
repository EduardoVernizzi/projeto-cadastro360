import React, { useEffect, useState } from "react";
import FormRegister from "./FormRegistration";

import { ref, push, set, onValue, off, remove, query, orderByChild, equalTo, get, } from "firebase/database";

import { database } from "../database/firebase";
import Swal from "sweetalert2";

const Register = () => {
  const [dadosClientes, setDadosClientes] = useState({});
  const [idAtual, setIdAtual] = useState("");
  const [animate, setAnimate] = useState(false);


  const verificarEmailDuplicado = async (email) => {
    const clientesRef = ref(database, "clientes");
    const q = query(
      clientesRef,
      orderByChild("email"),
      equalTo(email.trim().toLowerCase())
    );

    const snapshot = await get(q);
    if (!snapshot.exists()) return null;
    const dados = snapshot.val();
    return Object.keys(dados)[0]; // retorna o primeiro id encontrado
  };

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const clientesRef = ref(database, "clientes");

    onValue(clientesRef, (snapshot) => {
      if (snapshot.exists()) {
        setDadosClientes(snapshot.val());
      } else {
        setDadosClientes({});
      }
    });

    return () => {
      off(clientesRef);
    };
  }, []);

  const deletarCliente = (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FFD700",
      cancelButtonColor: "#777",
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const clienteRef = ref(database, `clientes/${id}`);
        remove(clienteRef)
          .then(() => {
            Swal.fire({
              title: "Deletado!",
              text: "O cliente foi removido com sucesso.",
              icon: "success",
              confirmButtonColor: "#FFD700",
            });
            if (id === idAtual) setIdAtual("");
          })
          .catch(() => {
            Swal.fire("Erro!", "Não foi possível deletar o cliente.", "error");
          });
      }
    });
  };

  const addEdit = async (obj) => {
    obj.email = obj.email.trim().toLowerCase();
    obj.nomeCompleto = obj.nomeCompleto.trim().toUpperCase();

    const idEmailExistente = await verificarEmailDuplicado(obj.email);

    if (idEmailExistente) {
      if (idAtual === "") {
        // Novo cadastro: email já existe
        throw new Error("Email duplicado");
      } else if (idEmailExistente !== idAtual) {
        // Edição: email pertence a outro cliente
        throw new Error("Email duplicado");
      }
    }

    if (idAtual === "") {
      const clientesRef = ref(database, "clientes");
      const newClienteRef = push(clientesRef);
      return set(newClienteRef, obj);
    } else {
      const clienteRef = ref(database, `clientes/${idAtual}`);
      return set(clienteRef, obj).then(() => setIdAtual(""));
    }
  };

  return (
    <>
      {/* CTA */}
      <div className="cta-app mb-5">
        <div
          className={`cta-content container py-5 text-center ${animate ? "animate" : ""
            }`}
        >
          <h1 className="cta-title display-3 fw-bold mb-4">
            Transforme seu atendimento
          </h1>
          <p className="cta-subtitle lead fs-4 mb-4">
            Cadastre e gerencie clientes com facilidade, rapidez e segurança.
          </p>
          <a href="#form-register" className="btn btn-gold btn-lg fw-semibold shadow">
            Comece agora
          </a>
        </div>
      </div>

      {/* Formulário */}
      <div className="container mb-5">
        <section id="form-register">
          <FormRegister {...{ addEdit, idAtual, dadosClientes }} />
        </section>
      </div>

      {/* Tabela */}
      <div className="container table-responsive">
        <div className="table-wrapper">
          <table className="table table-borderless table-striped">
            <thead>
              <tr>
                <th>Nome completo</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dadosClientes)
                .sort(([, a], [, b]) =>
                  a.nomeCompleto.toLowerCase().localeCompare(b.nomeCompleto.toLowerCase())
                )
                .map(([id, cliente]) => (
                  <tr key={id}>
                    <td data-label="Nome completo">{cliente.nomeCompleto}</td>
                    <td data-label="Telefone">{cliente.telefone}</td>
                    <td data-label="E-mail">{cliente.email}</td>
                    <td data-label="Endereço">{cliente.endereco}</td>
                    <td data-label="Ações">
                      <div className="action-buttons">
                        <a
                          className="btn btn-primary"
                          onClick={() => setIdAtual(id)}
                          href="#form-register"
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </a>
                        <button
                          className="btn btn-danger"
                          onClick={() => deletarCliente(id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Register;
