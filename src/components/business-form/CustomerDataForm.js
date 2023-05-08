import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import MaskedTextField from '../communs/MaskedTextField';
import UFTextField from '../communs/UFTextField';
import api from '../../api';
export default function CustomerDataForm() {
  const [type, setType] = React.useState("");
  const [item, setItem] = React.useState("");
  const [name, setName] = useState('')
  const [lbFantasia, setLbFantasia] = useState('Nome')
  const [num, setNumero] = useState('')
  const [id, setId] = useState('')
  const [exibeCorporateName, setExibeCorporateName] = useState('')
  const [tipoPessoa, setTipoPessoa] = useState('F')
  const [corporateName, setCorporateName] = useState('')
  const [doc, setDoc] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cepData, setCepData] = useState('')
  const [zap, setZap] = useState('')
  const [estado, setEstado] = useState('')
  const [cidades, setCidades] = useState([])
  const [cidade, setCidade] = useState('')
  const [rua, setRua] = useState('')
  const [bairro, setBairro] = useState('')
  const [idAdd, setIdAdd] = useState('')
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('')

  
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const personType = ["Física", "Jurídica"];

  const handleChangeItem = (event) => {
    setItem(event.target.value);
  };

  const list = ["Item 1", "Item 2"];

  async function handleEstadoValue(value) {
    const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + value + "/municipios";

    const requestInfo = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    };

    await fetch(url, requestInfo)
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
        handleEstadoValue(response.data.state).then(setCidade(response.data.city))
          .then(setRua(response.data.street)).then(setBairro(response.data.neighborhood))
      });

    } catch (err) {
      console.log(err)

    }
  };

  return (
    <React.Fragment>
      <box>
        <Typography variant="h6" gutterBottom>
          Informações do cliente
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                id="demo-simple-select"
                value={type}
                label="Tipo"
                onChange={handleChange}
              >
                 <MenuItem value={'F'}>Física</MenuItem>
                <MenuItem value={'J'}>Jurídica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
          <TextField id="lbNome*" maxLength={50} className="form-control" label={lbFantasia} size="small"
              variant="outlined" value={name || ''} onChange={(e) => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              id="name"
              name="name"
              label="Nome"
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
           <MaskedTextField label={"Telefone"} size="small" mask={'(99)9 9999-9999'} variant="outlined" value={phone} onChange={(e) => setPhone(e.target.value)}  ></MaskedTextField>
          </Grid>
          <Grid item xs={12} sm={4}>
          <MaskedTextField label={"Whatsapp"} size="small" mask={'(99)9 9999-9999'} variant="outlined" value={zap} onChange={(e) => setZap(e.target.value)}  ></MaskedTextField>
          </Grid>
          <Grid item xs={12} sm={4}>
          <MaskedTextField label={"CEP"} size="small" mask={'99999-999'} variant="outlined" value={cepData} onChange={(e) => setCepData(e.target.value)} onBlur={(e) => { searchCep() }}></MaskedTextField>
          </Grid>

          <Grid item xs={12} sm={4}>
          <UFTextField variant="outlined" size="small" value={estado} onChange={handleEstado} ></UFTextField>
          </Grid>
          <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Cidade</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cidade}
                label="inputMarca"
                size="small"
                onChange={(e) => setCidade(e.target.value)}
              >
                {cidades != null && cidades ? cidades.map((option) => (<MenuItem key={option.nome} value={option.nome} >{option.nome}</MenuItem>)) : ""}

              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
          <TextField id="Rua" maxLength={50} className="form-control " label='Rua' size="small" variant="outlined" value={rua || ''} onChange={(e) => setRua(e.target.value)} />
          </Grid>

          <Grid item xs={12} sm={4}>
          <TextField id="Bairro" maxLength={50} className="form-control" label='Bairro' size="small" variant="outlined" value={bairro || ''} onChange={(e) => setBairro(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={4}>
             <MaskedTextField type="number" label={"Número"} size="small"  type='number' variant="outlined" value={num} onChange={(e) => setNumero(e.target.value)} ></MaskedTextField>
          </Grid>
          <Grid item xs={12} sm={4}>
          <TextField id="email" maxLength={50} className="form-control" label='E-mail' size="small" variant="outlined" value={email || ''} onChange={(e) => setEmail(e.target.value)} />
          </Grid>

          <Grid item xs={12} sm={12}>
          <TextField id="informacoesAdicionais" maxLength={50} className="form-control" label='Informações Adicionais' size="small" variant="outlined" value={informacoesAdicionais || ''} onChange={(e) => setInformacoesAdicionais(e.target.value)} />
          </Grid>
        </Grid>
      </box>
    </React.Fragment>
  );
}
