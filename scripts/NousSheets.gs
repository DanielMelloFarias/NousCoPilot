/**
 * NOUS Intelligence — Google Apps Script Webhook
 * Recebe dados do formulário de lead e salva na planilha
 *
 * COMO USAR:
 * 1. Acesse: https://script.google.com/home
 * 2. Clique em "Novo projeto"
 * 3. Apague o código padrão e cole este arquivo inteiro
 * 4. Clique em "Implantar" → "Nova implantação"
 * 5. Tipo: "Aplicativo da Web"
 *    - Executar como: Eu (your email)
 *    - Quem pode acessar: Qualquer pessoa
 * 6. Clique em "Implantar" e copie a URL gerada
 * 7. Crie um arquivo .env na pasta NousLP com:
 *    VITE_SHEETS_URL=https://script.google.com/macros/s/SEU_ID/exec
 */

// ID da planilha (extraído da URL do Google Sheets)
var SPREADSHEET_ID = '1tfAxLmwvWTF6O0fd4JK0C7600vuuXaqKwloMMrXe3FM';
var SHEET_NAME     = 'DadosQRCode'; // Nome da aba existente na planilha

// Cabeçalhos da planilha
var HEADERS = ['Data / Hora', 'Nome', 'E-mail', 'WhatsApp', 'Área de Atuação', 'Tamanho do Escritório', 'Interesses', 'Origem'];

function getOrCreateSheet() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    // Cria aba e adiciona cabeçalhos
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);

    // Estiliza cabeçalhos
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#0D3041');
    headerRange.setFontColor('#C9A55C');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);

    // Congela linha de cabeçalho
    sheet.setFrozenRows(1);

    // Ajusta larguras das colunas
    sheet.setColumnWidth(1, 160); // Data/Hora
    sheet.setColumnWidth(2, 200); // Nome
    sheet.setColumnWidth(3, 240); // E-mail
    sheet.setColumnWidth(4, 160); // WhatsApp
    sheet.setColumnWidth(5, 180); // Área
    sheet.setColumnWidth(6, 180); // Escritório
    sheet.setColumnWidth(7, 320); // Interesses
    sheet.setColumnWidth(8, 120); // Origem
  }

  return sheet;
}

function doPost(e) {
  try {
    // Lê JSON do body (funciona com Content-Type: text/plain via no-cors do browser)
    var data  = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    // Adiciona nova linha com os dados
    sheet.appendRow([
      data.data        || new Date().toLocaleString('pt-BR'),
      data.nome        || '',
      data.email       || '',
      data.whatsapp    || '',
      data.area        || '',
      data.escritorio  || '',
      data.interesses  || '',
      data.origem      || 'Landing Page'
    ]);

    // Resposta de sucesso (não visível via no-cors, mas útil para debug)
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Lead registrado com sucesso!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Para testar: acesse a URL do Web App diretamente no navegador
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'NOUS Sheets Webhook ativo!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Função auxiliar para testar localmente no Apps Script
function testarManualmente() {
  var fakeLead = {
    data:       new Date().toLocaleString('pt-BR'),
    nome:       'Dr. João Teste',
    email:      'joao@escritorio.com.br',
    whatsapp:   '(11) 99999-9999',
    area:       'Trabalhista',
    escritorio: 'Solo (apenas eu)',
    interesses: 'Petições e Peças, Pesquisa Jurisprudencial'
  };

  var sheet = getOrCreateSheet();
  sheet.appendRow([
    fakeLead.data,
    fakeLead.nome,
    fakeLead.email,
    fakeLead.whatsapp,
    fakeLead.area,
    fakeLead.escritorio,
    fakeLead.interesses,
    'Teste Manual'
  ]);

  Logger.log('Lead de teste registrado com sucesso!');
}
