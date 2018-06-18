/**
 * Convert an image
 * to a base64 string
 * @param  {String}   url        
 * @param  {Function} callback   
 * @param  {String}   [outputFormat=image/png]          
 */
function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

function uploadBase64(base64Val){

     var captchaURL = 'https://www.ad4map.com/superuser/script_fcap_v2.php';
    
     var start = new Date().getTime();
    
     captchaRequest = jQuery.ajax({
         type: 'POST',
         url: captchaURL,
         dataType: "json",
         data: {data: base64Val},
         xhrFields: {
             withCredentials: false
         },
         success: function(data) // Variable data contains the data we get from serverside
        {
                 var end = new Date().getTime();
                    var time = end - start;
                    console.log('Execution time: ' + time);
                 console.log("Captcha:" + data.captcha);
                
               var elem = document.getElementById('frmPreSell').elements;
                  for(var i = 0; i < elem.length; i++)
                  {
                       if(jQuery("#"+elem[i].name).css('display') == 'block' && jQuery("#"+elem[i].name).attr('class') != undefined){
                           
                           elem[i].value = data.captcha;
                           countCaptcha++;
                           jQuery('#preSellOK').click();
                           setTimeout(clickFailOKButton, 5000);
                           break;
                      }
                  }
            
        }
    });
   
}

jQuery( document).delegate( "#preSellOK", "click",
    function(e){
            captchaRequest.abort();
            setTimeout(clickFailOKButton, 5000);
    }
);

function getCaptchaURL(){
    
    window.captchaInput = jQuery($('#frmPreSell input[class^="css"]:visible')[0]);
    window.captchaInput.focus();
    
    var snd = new Audio('https://www.ad4map.com/Big_Buzz.mp3');
    snd.play();
    
     urlImage = jQuery('img[src^="https://fwctickets.fifa.com/TopsDirCalls/captchaImage.aspx"]').attr("src");
    
     console.log('Try ' + (countCaptcha+1));
     console.log('Sending captcha:' + urlImage);
    
    
     convertImgToBase64(urlImage, function(base64Img){
    
          base64Img = base64Img.replace("data:image/png;base64,","");
          uploadBase64(base64Img);
    
     });

}

function clickFailOKButton(){
     if(jQuery($('.errorJSDetail'))[0].innerHTML != ""){
               jQuery($('#gen-btn-ok')).click();
               if(countCaptcha > maxCaptcha)
                    stopAutomaticCaptcha();
               refreshContent = 1;
               nextValueContent = 0;
               seeCaptcha = false;
               refreshContentInterval = setInterval(run_Refresh, 1000);
              
     }
     else{
          seeCaptcha = true;
          jQuery($('#gen-btn-ProceedNextStep')).click();
          setCCard();
          verifyAddress();
     }
}


function setCaptchaFocus(){
      window.captchaInput = jQuery($('#frmPreSell input[class^="css"]:visible')[0]);
     window.captchaInput.focus();
}


function setQuantityProduct(){
         
         jQuery('#'+ prodId).click();
         var catId = fixedCateg;
         this.clearInterval(refreshContentInterval);
         quant=maxQuant;    
              
         console.log("------------------------------------------------------");
         console.log("Setting: CAT" +  catId + " - " + quant );
         seeCaptcha = true;
         jQuery('li#'+  catId +'.roundedWhite.catSelection').click();
         xx.requestOnCourse().quantity(quant);
         jQuery('#btnAddToCart').click();
         jQuery("#captchaImg").attr("src");
         if(bypassCaptcha)
              setTimeout(getCaptchaURL, 2500);
         else
              setTimeout(setCaptchaFocus, 2000);


}

function run_Refresh() {

        nextValueContent = nextValueContent + 1;
        var rest = parseInt(refreshContent - nextValueContent, 10);
        if (rest == 0 && seeCaptcha == false) {
                setQuantityProduct();
                  clearInterval(refreshContentInterval);
                this.clearInterval(refreshContentInterval);
                    refreshAvailability_new();
                nextValueContent = 0;
                refreshContentInterval = setInterval(run_Refresh, 1000);
        }
        else if( seeCaptcha == true){
                  clearInterval(refreshContentInterval);
                  this.clearInterval(refreshContentInterval);
        }
}

function verifyAddress(){
     if(jQuery($("#cusZip")).val("XXXXX-XXX") != "" ) return;
    
     jQuery($("#cusZip")).val("XXXXX-XXX");
     jQuery($("#cusAdd1")).val("Rua XXXXX");
     jQuery($("#cusAdd2")).val("291");
     jQuery($("#cusAdd3")).val("apto 11");
     jQuery($("#cusProvince")).val("Jardim Vitória Régia");
     jQuery($("#cusCity")).val("São Paulo");
     jQuery($("#cusState")).val("SP");
     jQuery($("#cusMobile")).val("(55)");
     jQuery($("#cusTel1")).val("(55)");    
     jQuery($("#cusEmail")).val("");
     jQuery($("#cboContactLang")).val("pt");
}

function ccard(){

     ccSelection = prompt("Qual cartao?\n V - Visa\n M - Mastercard", "V");
     sfpCardNumber = prompt("Numero do Cartão:", "");
     expiryMonth = prompt("Mês de Expiração: - 01 a 12", "09");
     expiryYear = prompt("Ano de Expiração: - 14, 15 ....", "15");
     CVC = prompt("Codigo de Segurança:", "000");
     nameOnCard = prompt("Nome no cartão:", "Ra");

}

function storeCard(){
     var answer = prompt("Quer deixar preeenchido o cartao de credito?\n S - Sim\n N - Nao", "S");
     if(answer == "S") ccard();
}

function setCCard(){

     jQuery($("#ccSelection")).val(ccSelection);
     jQuery($("#sfpCardNumber")).val(sfpCardNumber);
     jQuery($("#expiryMonth")).val(expiryMonth);
     jQuery($("#expiryYear")).val(expiryYear);
     jQuery($("#CVC")).val(CVC);
     jQuery($("#nameOnCard")).val(nameOnCard);

}

function getCCard(){
     if(ccSelection == "")
          alert("Não existe cartão cadastrado.");
     else
          alert(" Bandeira: " +  ccSelection + "\n Numero Cartao: " + sfpCardNumber
                         + "\n Data Expiração: " + expiryMonth + "/" + expiryYear
                         + "\n Cod Seguranca: " + CVC + "\n Nome:" + nameOnCard);                        
}

function setMaxCaptcha(){
     maxCaptcha = prompt("Entre com o numero de 1 - 5 para as tentativas seguidas de captcha", 5);
     if(maxCaptcha == "" || maxCaptcha > 5) maxCaptcha = 5;
}

function startAutomaticCaptcha(){
     bypassCaptcha = true;
}

function stopAutomaticCaptcha(){
     bypassCaptcha = false;
}

function setProdId(){
     prodId = prompt("Qual jogo?", "64");
     prodId = "IMT" + prodId;
     if(prodId == "IMT" || prodId == "" )prodId = "IMT64";
}

function setFixedCateg(){
     fixedCateg = prompt(" Selecione categoria de 1 - 4 ou deixe 0 para automatico dependendo da disponibilidade", 0);
     if(fixedCateg == "") fixedCateg = 0;
}

function setQuantity(){
     maxQuant = prompt("Quantidade Maxima 1 - 4", 1);
     if(maxQuant > 4 || maxQuant == "") maxQuant = 1;
     quant = maxQuant +1;
}

function restart(){
     stop();
     refreshContent = 2;
     nextValueContent = 0;
     countCaptcha = 0;
     seeCaptcha = false;
     refreshContentInterval = setInterval(run_Refresh, 1000);
}

function stop(){
     seeCaptcha = true;
}


function help(){
     var opt = prompt(" 1 - Maximo de Tentativa \n 2 - Mudar Jogo \n 3 - Mudar Categoria \n 4 - Mudar Quantidade \n 5 - Parar Script \n 6 - Iniciar Script \n 7 - Pré Cadastrar Cartão \n 8 - Preencher cartao automatico\n 9 - Habilitar Captcha Automatico\n 10 - Desabilitar Captcha Automatico", 0);
     if(opt == 1) setMaxCaptcha();
     else if(opt == 2) setProdId();
     else if(opt == 3) setFixedCateg();
     else if(opt == 4) setQuantity();
     else if(opt == 5) stop();
     else if(opt == 6) restart();
     else if(opt == 7) ccard();
     else if(opt == 8) setCCard();
     else if(opt == 9) startAutomaticCaptcha();
     else if(opt == 10) stopAutomaticCaptcha();
}



var ccSelection = "";
var sfpCardNumber = "";
var expiryMonth = "";
var expiryYear = "";
var CVC = "";
var nameOnCard = "";

var captcha = '';
var countCaptcha = 0;
var seeCaptcha = false;
var bypassCaptcha = true;
var captchaURL = "";
var captchaRequest;
var urlImage = "";

var maxCaptcha = 30;
//setMaxCaptcha();

var prodId;
setProdId();

var fixedCateg;
setFixedCateg();

var maxQuant;
var quant;
setQuantity();

var refreshContent = 2;
var nextValueContent = 0;

shoppingCartTimerMinutes = (600);

//storeCard();

jQuery('#avaProductsBoth button.btn.btn-info').click();

var refreshContentInterval = setInterval(run_Refresh, 1000); 