$(document).ready(function() {
  $('.tabs').tabs();
  $('select').formSelect();
  M.updateTextFields();

  atualizaMaiorEMenor();
});

function moedaChange() {
  atualizaMaiorEMenor();
}

function atualizaMaiorEMenor(moeda) {
  alteraLoad(true);

  $("#txtValorCripto").val("");
  $("#txtValorReal").val("");
  $("#lblCripto").text($("#cboMoeda option:selected").text());

  var moeda = $("#cboMoeda").val();

  axios.get('https://www.mercadobitcoin.net/api/' + moeda + '/ticker')
    .then(function(response) {
      var maiorPreco = formataNumero(parseFloat(response.data.ticker.high), 2);
      var menorPreco = formataNumero(parseFloat(response.data.ticker.low), 2);
      precoAtual = parseFloat(response.data.ticker.last);

      $("#lblMaiorValor").text(maiorPreco);
      $("#lblMenorValor").text(menorPreco);
      alteraLoad(false);
    });
}

function formataNumero(numero, casasDecimais) {
  return numero.toLocaleString('pt-br', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  });
}

function alteraLoad(habilita) {
  if (habilita)
    $("#load").show()
  else
    $("#load").hide()
}

function criptoChange() {
  var valor = parseFloat($("#txtValorCripto").val().replace(",", "."));
  var valorReal = valor * precoAtual;
  $("#txtValorReal").val(valorReal.toFixed(2));
  M.updateTextFields();
}

function realChange() {
  var valor = parseFloat($("#txtValorReal").val().replace(",", "."));
  var valorCripto = valor / precoAtual;
  $("#txtValorCripto").val(valorCripto.toFixed(2));
  M.updateTextFields();
}

function listaDatas() {
  var datas = [];

  var date = new Date();
  date.setDate(date.getDate() - 1);
  datas.push(criaObjData(date));

  date.setDate(date.getDate() - 1);
  datas.push(criaObjData(date));

  date.setDate(date.getDate() - 1);
  datas.push(criaObjData(date));

  date.setDate(date.getDate() - 1);
  datas.push(criaObjData(date));

  date.setDate(date.getDate() - 1);
  datas.push(criaObjData(date));

  date.setDate(date.getDate() - 1);
  datas.push(criaObjData(date));

  date.setDate(date.getDate() - 1);
  datas.push(criaObjData(date));
  
  datas.reverse();
  
  return datas;
}

function criaObjData(data) {
  var dataString = data.toLocaleString();

  return {
    ano: dataString.substr(6, 4),
    mes: dataString.substr(3, 2),
    dia: dataString.substr(0, 2)
  }
}

function montaGrafico() {
  var lista = listaDatas();
  var labels = [];
  var dados = [];
  var moeda = $("#cboMoeda").val();

  consultaApi(lista, labels, dados, moeda, 0);
}

function consultaApi(listaBase, labels, dados, moeda, index) {
    var data = listaBase[index];
    labels.push(data.dia + '/' + data.mes);

    axios.get('https://www.mercadobitcoin.net/api/' + moeda + '/day-summary/' + data.ano + '/' + data.mes + '/' + data.dia)
      .then(function(response) {
        dados.push(response.data.avg_price);

        if(index < 6)
          consultaApi(listaBase, labels, dados, moeda, index + 1)
        else
          desenhaChart(labels, dados)
      });
}

function desenhaChart(labels, dados) {
  var ctxChart = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctxChart, {
    type: 'line',

    data: {
      labels: labels,
      datasets: [{
        label: 'Valor R$',
        data: dados
      }]
    },

    options: {}
  });
}