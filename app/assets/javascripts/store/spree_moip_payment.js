//= require maskedinput

$(document).ready(function(){
   $(".moip_payment").hide();
   $("input[name='payment_type']").change(function(){
     var payment_selected = $(this).val();
     $(".moip_payment").hide();
     $("#" + payment_selected).show();
   });

   $("#loading-div-background").css({ opacity: 0.8 });

   $("#checkout_form_payment input[type=submit]").click(function(e){
     $("#loading-div-background").show();
     processaPagamento();
     e.preventDefault();
   });

   $('<div />', {
     id: "error_explanation",
   }).prependTo("#cartao_de_credito").hide();

   $('<div />', {
     id: "message",
     class: "flash notice",
   }).prependTo("#cartao_de_credito").hide();

   //generateMoipFields();

   jQuery.validator.addMethod("zipcode", function(value, element) {
     return value.match(/^(\d){5}-(\d){3}$/);
   }, "Defina o Codigo Postal no formato xxxxx-xxx");

   jQuery.validator.addMethod("phone", function(value, element) {
     return value.match(/^\((\d){2}\)(\d){4}-(\d){4,5}_?$/);
   }, "Defina o Telefone no formato (xx)xxxx-xxxx");

   $("#order_bill_address_attributes_zipcode, #order_ship_address_attributes_zipcode").addClass("zipcode");
   $("#order_bill_address_attributes_phone, #order_ship_address_attributes_phone").addClass("phone");
   $("#order_bill_address_attributes_address_number, #order_bill_address_attributes_district").addClass("required");
   $("#order_ship_address_attributes_address_number, #order_ship_address_attributes_district").addClass("required");

   $("#order_bill_address_attributes_zipcode, #order_ship_address_attributes_zipcode").mask("99999-999");
   $("#order_bill_address_attributes_phone, #order_ship_address_attributes_phone").mask("(99)9999-9999?9");

   $("input#data_nascimento").mask("99/99/9999")

   $("input[name=instituicao]").click(function(){
     obterParcelas();
   });
});

function processaPagamento(){
  var selected = $("input[name='payment_type']:checked").val();
  switch(selected) {
    case "boleto":
     processaPagtoBoleto();
     break;
    case "cartao_de_credito":
      processaPagtoCredito();
      break;
    case "debito":
      processaPagtoDebito();
      break;
  }
}

function processaPagtoCredito() {
  form = $("#cartao_de_credito");
   var settings = {
       "Forma": "CartaoCredito",
       "Instituicao": $(form).find("input[name=instituicao]:checked").val(),
       "Parcelas": $('select#parcelas').val(),
       "Recebimento": "AVista",
       "CartaoCredito": {
           "Numero": $(form).find("input[name=numero]").val(),
           "Expiracao": $(form).find("input[name=expiracao]").val(),
           "CodigoSeguranca": $(form).find("input[name=codigo_seguranca]").val(),
           "Portador": {
               "Nome": $(form).find("input[name=nome]").val(),
               "DataNascimento": $(form).find("input[name=data_nascimento]").val(),
               "Telefone": $(form).find("input[name=telefone]").val(),
               "Identidade": $(form).find("input[name=identidade]").val()
           }
       }
   }
   MoipWidget(settings);
}

function processaPagtoBoleto() {
  var settings = {
      "Forma": "BoletoBancario"
  }
  MoipWidget(settings);
}

function processaPagtoDebito() {
  form = $("#debito");
  var settings = {
      "Forma": "DebitoBancario",
      "Instituicao": form.find("input[name=instituicao]:checked").val()
  }
  MoipWidget(settings);
}

function obterParcelas(){
  $('span.info-parcelamento').remove();
  $('select#parcelas')
          .find('option')
          .remove()
          .end()
          .append('<option value="1">...carregando</option>')
          .val('1');
  var settings = {
            cofre: "",
            instituicao: $("input[name=instituicao]:checked").val(),
            callback: "retornoCalculoParcelamento"
  };
  MoipUtil.calcularParcela(settings);
}

var retornoCalculoParcelamento = function(data){
  if(data.parcelas.length > 0 ) {
    $('select#parcelas')
            .find('option')
            .remove()
            .end()
    $.each(data.parcelas, function() {
       var juros = "";
       if(this.quantidade > 3) {
         juros = "(1,99 a.m.)"
       }
       $('select#parcelas')
           .append($("<option></option>")
           .attr("value",this.quantidade)
           .text(""+this.quantidade+"x - "+"R$"+this.valor+" "+juros+"".replace(".", ",")));
    });
  }
}

var funcao_sucesso = function(data){
  var selected = $("input[name='payment_type']:checked").val();
  if (selected === "boleto") {
    $("#order_moip_boleto_url").val(data.url);
  }
  if (selected === "debito") {
    $("#order_moip_debito_url").val(data.url);
  }
  $("#order_moip_code").val(data.CodigoMoIP);
  $("#order_moip_status").val(data.Status);
  $("#checkout_form_payment").submit();
};

var funcao_falha = function(data) {
  $("#error_explanation").html("");

  var error_html = $('<h2 />', {
    text: "Verifique os erros abaixo"
  }).appendTo("#error_explanation");

  error_html += $('<ul />', {
  }).appendTo("#error_explanation");

  if(data.Mensagem){
    error_html += $('<li />', {
    text: data.Mensagem
    }).prependTo("#error_explanation ul");
  }

  if(data.reverse) {
    $.each(data.reverse(), function(index, key) {
      error_html += $('<li />', {
      html: decodeURIComponent(escape(key["Mensagem"]))
      }).prependTo("#error_explanation ul");
    });
  }

  $("#error_explanation").css('color', 'red');
  $("#error_explanation").show();
  $("#loading-div-background").hide();
  $("#html, body").animate({ scrollTop: $('#error_explanation').offset().top }, 'fast');
};
