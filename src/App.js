import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import './table.css';

const App = () => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const [lista, setLista] = useState([]);  
  const [alterar, setAlterar] = useState(false);
  const [data_id, setData_id] = useState(null)

  const onSubmit = (data, e) => {
    // obtém a lista de carros salvos em localStorage (se existir)
    const carros = localStorage.getItem("carros") 
      ? JSON.parse(localStorage.getItem("carros"))
      : "";

    // acrescenta um novo atributo ao data (aos campos que vêm do form)
    data.id = new Date().getTime();

    // console.log(data);

    // salva os dados (já existentes + novo)  
    localStorage.setItem("carros", JSON.stringify([data, ...carros]));

    // atualiza a lista (refresh na página deste componente)
    setLista([data, ...lista]);

    // pode-se "limpar" cada campo usando setValue
    // setValue("modelo", "");

    // ou "limpar" todo o form com reset
    e.target.reset();
  };

  // obtém o ano atual
  const ano_atual = new Date().getFullYear();

  // occore após o componente ser renderizado
  useEffect(() => {
    setLista(
      localStorage.getItem("carros")
        ? JSON.parse(localStorage.getItem("carros"))
        : []
    );
  }, []);

  const handleClick = (e) => {
    // obtém o elemento (tr, ou seja a linha da tabela) que foi clicado
    const tr = e.target.closest('tr');

    const id = Number(tr.getAttribute('data-id'));

    if (e.target.classList.contains('fa-edit')) {
      
      // altera o conteúdo de cada campo do formulário
      setValue('modelo', tr.cells[0].innerText);
      setValue('marca', tr.cells[1].innerText);
      setValue('ano', tr.cells[2].innerText);
      setValue('preco', tr.cells[3].innerText);

      setAlterar(true);
      setData_id(id);      // altera data_id com o conteúdo do atributo data_id
    } else if (e.target.classList.contains('fa-times-circle')) {
      const modelo = tr.cells[0].innerText;

      if (window.confirm(`Confirma a exclusão do veículo ${modelo}?`)) {
        // aplica o filtro para remover o veículo clicado
        const novaLista = lista.filter((carro) => {return carro.id !== id});

        // atualiza as informações salvas em localStorage
        localStorage.setItem('carros', JSON.stringify(novaLista));

        // atualiza a lista (refresh)
        setLista(novaLista);
      }

    }  
  }

  const onUpdate = (data, e) => {    
    // obtém toda a lista de carros salvos em localStorage
    const carros = JSON.parse(localStorage.getItem('carros'));

    // cria um novo array vazio (que irá receber os dados com a alteração)
    let carros2 = [];

    // percorre cada elemento do array carros
    for (let carro of carros) {
      if (carro.id === data_id) {
        data.id = data_id;
        carros2.push(data);
      } else {
        carros2.push(carro);
      }
    }

    // atualiza as informações salvas em localStorage
    localStorage.setItem('carros', JSON.stringify(carros2));

    // atualiza a lista (refresh)
    setLista(carros2);

    // limpa o form
    e.target.reset();

    // troca o botão para incluir novamente
    setAlterar(false);
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 bg-primary py-2">
          <h1 className="text-white">
            Revenda Herbie - Veículos Novos e Usados
          </h1>
          <h4 className="text-white font-italic">
            Sistema de Cadastro e Manutenção de Veículos Disponíveis para Venda
          </h4>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <img
            src="herbie.jpg"
            alt="Revenda Herbie"
            className="img-fluid mx-auto d-block"
          />
        </div>

        <div className="col-sm-9 mt-2">
          <form onSubmit={alterar ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Modelo:</span>
              </div>
              <input
                type="text"
                className="form-control"
                name="modelo"
                autoFocus
                ref={register({ required: true, minLength: 2, maxLength: 30 })}
              />
              <div className="input-group-prepend">
                <span className="input-group-text">Marca:</span>
              </div>
              <select
                className="form-control"
                name="marca"
                ref={register({ required: true })}
              >
                <option value="">-- Selecione a Marca --</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Fiat">Fiat</option>
                <option value="Ford">Ford</option>
                <option value="Renault">Renault</option>
                <option value="Volkswagen">Volkswagen</option>
              </select>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Ano:</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="ano"
                ref={register({
                  required: true,
                  min: ano_atual - 30,
                  max: ano_atual + 1,
                })}
              />
              <div className="input-group-prepend">
                <span className="input-group-text">Preço R$:</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="preco"
                ref={register({ required: true, min: 5000, max: 100000 })}
              />
              <div className="input-group-append">
                <input
                  type="submit"
                  className={alterar ? "d-none" : "btn btn-primary"}
                  value="Adicionar"
                />
                <input
                  type="submit"
                  className={alterar ? "btn btn-success" : "d-none"}
                  value="Alterar"
                />
              </div>
            </div>
          </form>
          <div
            className={
              (errors.modelo || errors.marca || errors.ano || errors.preco) &&
              "alert alert-danger"
            }
          >
            {errors.modelo && (
              <span>Modelo deve ser preenchido (até 30 caracteres); </span>
            )}
            {errors.marca && <span>Marca deve ser selecionada; </span>}
            {errors.ano && (
              <span>
                Ano deve ser preenchido (entre {ano_atual - 30} e {ano_atual + 1}
                );
              </span>
            )}
            {errors.preco && (
              <span>Preço deve ser preenchido (entre 5000 e 100000); </span>
            )}
          </div>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Modelo do Veículo</th>
                <th>Marca</th>
                <th>Ano</th>
                <th>Preço R$</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((carro) => {
                return (
                  <tr key={carro.id}
                      data-id={carro.id}
                      onClick={handleClick}>
                    <td>{carro.modelo}</td>
                    <td>{carro.marca}</td>
                    <td>{carro.ano}</td>
                    <td>{carro.preco}</td>
                    <td>
                    <i className="far fa-edit text-success mr-2" title="Alterar"></i>
                    <i className="far fa-times-circle text-danger" title="Excluir"></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;