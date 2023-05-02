import { AuthContext } from '../../context/AuthContext';
import './afflitedform.scss';
import { useState, useContext, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cpfMask } from './cpfmask'
import { cnpjMask } from './cnpjmask'
import InputMask from 'react-input-mask';
import api from '../../api';
import { useParams, useNavigate } from "react-router-dom";
import SelectEstado from '../estadosbr';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '/node_modules/react-tabs/style/react-tabs.scss';
import { NumericFormat } from 'react-number-format';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import TabelaComposePrice from '../comoseprices-table';


function PhoneInput(props) {
  return (
    <InputMask
      mask='(99) 99999-9999'
      value={props.value}
      onChange={props.onChange}
      className="form-control" required={props.required} placeholder={props.placeholder}
      type={props.type} name={props.name} id={props.id} >
    </InputMask>
  );
}

function CepInput(props) {
  return (
    <InputMask
      mask='99999-999'
      value={props.value}
      onChange={props.onChange}
      className="form-control" onKeyDown={props.onKeyDown} onBlur={props.onBlur} placeholder={props.placeholder}
      type={props.type} name={props.name}>
    </InputMask>
  );
}

function Cidades(props) {
  return (
    <select className={props.className} onChange={props.onChange} value={props.value}>
      {Array.isArray(props.novos) ?
        props.novos.map((cidade) => (
          <option key={cidade.nome} value={cidade.nome}>{cidade.nome}</option>
        )) : []
      }
    </select>
  );
}

const AfflitedForm = (props) => {

  const [name, setName] = useState('')
  const [num, setNumero] = useState('')
  const [id, setId] = useState('')
  const [lbFantasia, setLbFantasia] = useState('')
  const [lbDocument, setLbDocument] = useState('')
  const [exibeCorporateName, setExibeCorporateName] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('F')
  const [corporateName, setCorporateName] = useState('')
  const [doc, setDoc] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cepData, setCepData] = useState('')
  const [zap, setZap] = useState('')
  const [estado, setEstado] = useState('')
  const [cidades, setCidades] = useState('')
  const [cidade, setCidade] = useState('')
  const [rua, setRua] = useState('')
  const [bairro, setBairro] = useState('')
  const [idAdd, setIdAdd] = useState('')
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('')
  
  const [idRateio, setIdRateio] = useState(1)
  const [idSelected, setIdSelected] = useState()
 
  const [lost, setPerca] = useState('')
  const [profit, setLucro] = useState('')
  const [commission, setComissao] = useState('')
  const { token } = useContext(AuthContext)
  const handleInput = ({ target: { value } }) => setPhone(value);
  const handleInputZap = ({ target: { value } }) => setZap(value);
  const handleInputCep = ({ target: { value } }) => setCepData(value);
  
  const [dados, setDados] = useState([
    {
      idInt: 1, name: "", value: '0', type: 'P'
    }
      
  ]);

  const { clientId } = useParams();
  useEffect(() => {

    if (clientId) {
      loadClienById(clientId)
    }
    return () => { }

  }, [])

  const handleEdit = (id, campo, valor) => {
    setDados(prevDados => {
      const novoDados = [...prevDados];
      const index = novoDados.findIndex(item => item.idInt === id);
      novoDados[index][campo] = valor;
      return novoDados;
    });
  };

  const handleAdd = () => {
    let idN = idRateio + 1

    let novoItem =
    {
      idInt: idN, name: "", value: '0', type: 'P'
    }
    setIdRateio(idN)
    setDados(prevDados => [...prevDados, novoItem]);
  };


  const handleAfterDel = () => {
    
    const quantidadeItens = dados.length;
    if (quantidadeItens > 1) {
      setDados(prevDados => prevDados.filter(item => item.idInt !== idSelected));
    }

  }

  async function loadClienById(id) {

    try {
      await api.get('/afflited/get/' + id, {
        headers: {
          'Authorization': `Basic ${token}`
        }

      }).then((response) => {
        setId(response.data.id)
        setName(response.data.fantasy)
        setDoc(response.data.document)
        setCorporateName(response.data.corporatename)

        response.data.tipo === "Fisico" ? setTipoPessoa("F") : setTipoPessoa("J")
        let olha = response.data.tipo === "Fisico" ? "F" : "J"
        handleTipoPessoaValue(olha)

        setPhone(response.data.phone)
        setNumero(response.data.num)
        setZap(response.data.zap)
        setCepData(response.data.Addresses[0].postcode)
        setEstado(response.data.Addresses[0].state)
        handleEstadoValue(response.data.Addresses[0].state)
        setCidade(response.data.Addresses[0].city)
        setRua(response.data.Addresses[0].street)
        setBairro(response.data.Addresses[0].neighborhood)
        setIdAdd(response.data.Addresses[0].id)
        setInformacoesAdicionais(response.data.addInformation)
        
        setEmail(response.data.email)
        setNumero(response.data.Addresses[0].number)
        setLucro(response.data.profit)
        setPerca(response.data.lost)
        setComissao(response.data.commission)
        if (response.data.Prices.length>0){
        setDados(response.data.Prices)
        }

      }).catch((error) => {
        if (error.response){
        toast.error(error.response.data.message)
      }
      });

    } catch (err) {
      console.log(err)
    }
  }

  

  function validaCampos(name, phone, documento, cep, zap) {

    if (name === "") {
      toast.error("Nome é obrigatório", {
        autoClose: 1000,
      })
      return false;
    }
    
    
    if (phone === "" || phone === undefined || phone===null)  {
      toast.error("Telefone é obrigatório", {
        autoClose: 1000,
      })
      return false;
    }
    console.log(phone)
   
    let phonenomask = phone.replace('_',"");

    if (phonenomask.length < 15 ) {
      toast.error("Telefone é inválido", {
        autoClose: 1000,
      })
      return false;
    }
  
    if (zap !== "" && zap !== undefined && zap!=null) {
      let zapnomask = zap.replace('_', "");
      if (zapnomask.length < 15) {
      toast.error("WhatsApp é inválido", {
      autoClose: 1000,
      })
      return false;
      }
      }
               
      if (cep !== "" && cep !== undefined) {
        let cepnomask = cep.replace('_', "");
        if (cepnomask.length < 8) {
        toast.error("CEP é inválido", {
        autoClose: 1000,
        })
        return false;
        }
        }

    if (documento !== '') {

      if (documento.length <= 14 && !cpf.isValid(documento)) {
        toast.error("CPF inválido", {
          autoClose: 1000,
        }
        ); throw new Error;

      } else if (documento.length > 14 && !cnpj.isValid(documento)) {
        toast.error("CNPJ inválido", {
          autoClose: 1000,
        });
        throw new Error;


      }

    }




    return true;
  }

  function handleMask(e) {
    if (tipoPessoa === "F" || tipoPessoa === "") {
      const formatado = cpfMask(doc);
      setDoc(formatado);
    } else {
      const formatado = cnpjMask(doc);
      setDoc(formatado);
    }

  }
  //chama para trocar assunto
  function handleTipoPessoa(e) {

    handleTipoPessoaValue(e.target.value)
  }
  function handleTipoPessoaValue(e) {

    if (e === "F" || e === "") {
      setLbFantasia("Nome*");
      setExibeCorporateName("");
      setLbDocument("CPF")
      setTipoPessoa("F")

    } else {
      setLbFantasia("Fantasia*");
      setExibeCorporateName("J")
      setLbDocument("CNPJ")
      setTipoPessoa("J")

    }

  }

  async function handleEstadoValue(value) {

    const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + value + "/municipios";

    const requestInfo = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    };

    fetch(url, requestInfo)
      .then(resposta => resposta.json())
      .then((json) => setCidades(json))
      .catch((error) => console.log(error));

    setEstado(value)
  }

  async function handleEstado(e) {
    handleEstadoValue(e.target.value)
  }

  const searchCep = async () => {
    try {

      await api.get('/sunindex/cep/' + cepData).then((response) => {
        handleEstadoValue(response.data.state)
          .then(setCidade(response.data.city))
          .then(setRua(response.data.street)).then(setBairro(response.data.neighborhood))
      });

    } catch (err) {

    }
  };

  const navigate = useNavigate();

  async function save(tipoPesoa, name, corpName, documento, phone, zap,
    cep, estado, cidade, logradouro, bairro,
    inform, email, id, idAdd, num, profit, lost, commission, dados) {

    const json = {
      fantasy: name,
      num: num,
      corporatename: corpName,
      phone: phone,
      document: documento,
      email: email,
      tipo: tipoPesoa,
      zap: zap,
      addInformation: inform,
      profit: parseFloat(String(profit).replace(',', '.')),
      lost: parseFloat(String(lost).replace(',', '.')),
      commission: parseFloat(String(commission).replace(',', '.')),
      Addresses: [
        {
          id: idAdd ? idAdd : undefined,
          street: logradouro,
          postcode: cep,
          city: cidade,
          state: estado,
          neighborhood: bairro,
          number: num
        }
      ],
      Prices:dados
    }

    
    if (id) {
      await api.patch('/afflited/update/' + id, json
        , {
          headers: {
            'Authorization': `Basic ${token}`
          }

        }).then((response) => {

        }).catch(
          (response) => {
            toast.error(response.response.data.message)
            throw new Error()

          }
        );

    } else {
      await api.post('/afflited/create', json
        , {
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then((response) => {

        }).catch(
          (response) => {
            toast.error(response.response.data.message)
            throw new Error()
          }
        )
    }
  }

  async function handleSaveUser(e) {

    e.preventDefault();

    
    const valida = validaCampos(name, phone, doc,cepData,zap);
    console.log("aqui"+id)
    if (valida) {
      
      
      try {
        await save(tipoPessoa, name, corporateName, doc, phone, zap, cepData,
          estado, cidade, rua, bairro, informacoesAdicionais,
          email, id, idAdd, num, profit, lost, commission)

        navigate(-1);
        toast.success("Operação realizada com sucesso!", {
          autoClose: 1000,
        })

      } catch (error) {
        console.log(error);
      }
    }
  }

  return (

    <div className="p-3 mb-3 bg-white border rounded-3">
      <ToastContainer />

      <form className="row g-3" onSubmit={handleSaveUser}>

        <Tabs>
          <TabList>
            <Tab>Informações Básicas</Tab>
            <Tab> Camposição do Preço </Tab>
            <Tab> Configurações Adicionais</Tab>
          </TabList>
          <TabPanel>
            <div className='divInfo p-3 mb-3 bg-white border rounded-3'>
              <div className='col-md-3'>
                <label htmlFor="inputFirstName" className="form-label">
                  Tipo
                </label>
                <select className='form-select' value={tipoPessoa} onChange={handleTipoPessoa}>
                  <option value="F">Física</option>
                  <option value="J">Jurídica</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="inputFirstName" className="form-label" id='lbNome'>
                  {lbFantasia === "" ? "Nome*" : lbFantasia}
                </label>
                <input type="text" maxLength={50} className="form-control" id="inputFirstName" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            
              <div className="col-md-3"  >
                <label htmlFor="inputDocumento" className="form-label ">
                  {lbDocument === "" ? "CPF*" : lbDocument}
                </label>
                <input type="text" className="form-control" id="inputDocumento" value={doc} onKeyUp={(e) => { handleMask(e) }} onChange={(e) => setDoc(e.target.value)} />
              </div>
              <div className="col-md-3" id={exibeCorporateName === "" ? "divRazaoEscondida" : "divRazaoVisvel"} >
                <label htmlFor="inputCorporateName" className="form-label ">
                  Razão Social*
                </label>
                <input type="text" maxLength={100} className="form-control" id="inputCorporateName" value={corporateName} onChange={(e) => setCorporateName(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label htmlFor="inputPhoneNumber" className="form-label">
                  Telefone*
                </label>
                <PhoneInput className="form-control" id="inputPhoneNumber" value={phone} onChange={handleInput}> </PhoneInput>
              </div>
              <div className="col-md-3">
                <label htmlFor="inputPassword4" className="form-label">
                  Whatsapp
                </label>
                <PhoneInput className="form-control" id="inputPhoneNumber" value={zap} onChange={handleInputZap}>  </PhoneInput>
              </div>
              <div className='col-md-3'>
                <label htmlFor="CEP" className="form-label">
                  CEP
                </label>
                <CepInput className="form-control" id="inputCep" value={cepData} onChange={handleInputCep} name="cep" onBlur={searchCep} >   </CepInput>
              </div>
              <div className='col-md-3'>
                <label htmlFor="estado" className="form-label combomob">
                  Estado
                </label>
                <SelectEstado className="form-select" id="inputCep" value={estado} onChange={handleEstado}>  </SelectEstado>
              </div>
              <div className='col-md-3'>
                <label htmlFor="Cidade" className="form-label combomob">
                  Cidade
                </label>
                <Cidades className="form-select" id="inputcidade" novos={cidades} value={cidade} onChange={(e) => setCidade(e.target.value)}>  </Cidades>
              </div>
              <div className="col-md-3"  >
                <label htmlFor="inputLogradouro" className="form-label ">
                  Logradouro
                </label>
                <input type="text" maxLength={100} className="form-control" id="inputLogradouro" value={rua} onChange={(e) => setRua(e.target.value)} />
              </div>
              <div className="col-md-3"  >
                <label htmlFor="inputBairro" className="form-label ">
                  Bairro
                </label>
                <input type="text" maxLength={100} className="form-control" id="inputLogradouro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label htmlFor="inputNumero" className="form-label" id='lbNumero'>
                Número
                </label>
                <input type="number"  className="form-control" id="inputNumero" value={num} onChange={(e) => setNumero(e.target.value)} />
              </div>
            
              <div className="col-md-3"  >
                <label htmlFor="email" className="form-label ">
                  Email*
                </label>
                <input type="email" maxLength={100} className="form-control" id="idEmail" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="col-md-7"  >
                <label htmlFor="informacoesAdicionais" className="form-label ">
                  Informações Adicionais
                </label>
                <input type="text" maxLength={200} className="form-control" id="informacoesAcionais" value={informacoesAdicionais} onChange={(e) => setInformacoesAdicionais(e.target.value)} />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className='divInfo p-3 mb-3 bg-white border rounded-3'>
             
            <div className="table-responsive">
                                        <TabelaComposePrice  dados={dados} handleEdit={handleEdit}
                          handleAdd={handleAdd} setIdSelected={setIdSelected}
                          handleAfterDel={handleAfterDel} 
                        />
                                         
                                        </div>

            </div>
          </TabPanel>
          <TabPanel>   
            <div className='divInfo p-3 mb-3 bg-white border rounded-3'>
              <div className="col-md-3"  >
                <label htmlFor="lost" className="form-label ">
                  Perca (%)
                </label>
                <NumericFormat decimalScale={2} placeholder="" decimalSeparator="," className="form-control number" value={lost || ''} onChange={(e) => setPerca(e.target.value)} />
              </div> 
              <div className="col-md-3"  >
                <label htmlFor="profit" className="form-label ">
                  Lucro (%)
                </label>
                <NumericFormat decimalScale={2} placeholder="" decimalSeparator="," className="form-control number" value={profit || ''} onChange={(e) => setLucro(e.target.value)} />
              </div>
              <div className="col-md-3"  >
                <label htmlFor="commission" className="form-label ">
                Comissão padrão(%)
                </label>
                <NumericFormat decimalScale={2} placeholder="" decimalSeparator="," step="0.001"
                  className="form-control number" value={commission || ''} onChange={(e) => setComissao(e.target.value)} />
              </div>
            </div>
          </TabPanel>
        </Tabs>
        <div className='afflitedsalvar'>
          <button className="btn btn-primary text-light" type="submit">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AfflitedForm;


