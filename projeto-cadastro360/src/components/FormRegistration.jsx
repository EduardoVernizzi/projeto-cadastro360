import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { IMaskInput } from "react-imask";

const FormRegister = (props) => {
  const campoInicialDeValores = {
    nomeCompleto: '',
    telefone: '',
    email: '',
    endereco: '',
  };

  const [values, setValues] = useState(campoInicialDeValores);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (props.idAtual === "") {
      setValues({ ...campoInicialDeValores });
    } else {
      const dados = props.dadosClientes[props.idAtual];
      if (dados) {
        setValues({
          ...campoInicialDeValores,
          ...dados,
        });
      }
    }
  }, [props.idAtual, props.dadosClientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const temp = {};
    temp.nomeCompleto = values.nomeCompleto.length >= 3 ? '' : 'Digite um nome válido';
    temp.telefone = values.telefone.replace(/\D/g, '').length >= 11
      ? ''
      : 'Telefone inválido';
    temp.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
      ? ''
      : 'Email inválido';
    temp.endereco = values.endereco ? '' : 'Endereço é obrigatório';

    setErrors(temp);
    return Object.values(temp).every(x => x === '');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    const valoresParaSalvar = {
      ...values,
      nomeCompleto: values.nomeCompleto.toUpperCase(),
      endereco: values.endereco.toUpperCase(),
    };

    props.addEdit(valoresParaSalvar)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Dados salvos com sucesso.',
          timer: 2000,
          showConfirmButton: false,
        });
        setValues(campoInicialDeValores);
      })
      .catch((error) => {
        if (error.message === 'Email duplicado') {
          Swal.fire({
            icon: 'error',
            title: 'Ops!',
            text: 'Esse email já está cadastrado.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível salvar o cliente.',
          });
        }
      });
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      {/* Nome */}
      <div className="form-group input-group mb-1">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="fas fa-user"></i>
          </div>
        </div>
        <input
          className="form-control w-100"
          placeholder="Nome completo"
          name="nomeCompleto"
          value={values.nomeCompleto}
          onChange={handleChange}
        />
      </div>
      {errors.nomeCompleto && <small className="text-danger">{errors.nomeCompleto}</small>}

      {/* Telefone e Email */}
      <div className="row">
        <div className="col-md-6">
          <div className="form-group input-group mb-1">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <i className="fas fa-mobile-alt"></i>
              </div>
            </div>
            <IMaskInput
              mask="(00) 00000-0000"
              lazy={false}
              placeholder="Telefone"
              name="telefone"
              value={values.telefone}
              onAccept={(value) => {
                setValues(prev => ({ ...prev, telefone: value }));
                setErrors(prev => ({ ...prev, telefone: '' }));
              }}
              className="form-control w-100"
            />
          </div>
          {errors.telefone && <small className="text-danger">{errors.telefone}</small>}
        </div>

        <div className="col-md-6">
          <div className="form-group input-group mb-1">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <i className="fas fa-envelope"></i>
              </div>
            </div>
            <input
              className="form-control w-100"
              placeholder="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>
      </div>

      {/* Endereço */}
      <div className="form-group input-group mb-1">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <i className="fas fa-map-marker-alt"></i>
          </div>
        </div>
        <input
          className="form-control w-100"
          placeholder="Endereço"
          name="endereco"
          value={values.endereco}
          onChange={handleChange}
        />
      </div>
      {errors.endereco && <small className="text-danger">{errors.endereco}</small>}

      {/* Botão */}
      <div className="form-group d-flex justify-content-center mt-3">
        <input
          type="submit"
          value={props.idAtual === '' ? 'Salvar' : 'Editar'}
          className="btn btn-primary w-50 mb-5 btn-block"
        />
      </div>
    </form>
  );
};

export default FormRegister;
