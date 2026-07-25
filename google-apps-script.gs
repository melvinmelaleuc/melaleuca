/**
 * Google Apps Script — recebe os dados do formulário de prospecção
 * e grava uma nova linha na planilha do Google Sheets.
 *
 * COMO INSTALAR:
 * 1. Abra a planilha:
 *    https://docs.google.com/spreadsheets/d/1rLOb7Yd2cCy6AyU0rwTu2GkHbL-1LhKIYb60ktTNJ9Q/edit
 * 2. Menu Extensões > Apps Script.
 * 3. Apague o conteúdo padrão do arquivo "Code.gs" e cole todo o conteúdo
 *    deste arquivo no lugar.
 * 4. Ajuste a constante SHEET_NAME abaixo, se necessário, e defina o mesmo
 *    valor em SHARED_SECRET que você colocar em CONFIG.SHARED_SECRET no
 *    index.html.
 * 5. Clique em "Implantar" > "Nova implantação".
 *    - Tipo: "App da Web".
 *    - Executar como: "Eu" (sua conta).
 *    - Quem pode acessar: "Qualquer pessoa".
 * 6. Autorize as permissões solicitadas.
 * 7. Copie a URL do app da Web gerada (termina em /exec) e cole em
 *    CONFIG.GOOGLE_SCRIPT_URL no arquivo index.html.
 * 8. Sempre que editar este script, gere uma NOVA implantação (ou uma nova
 *    versão da implantação existente) para que as mudanças entrem em vigor.
 */

const SHEET_NAME = 'Prospects'; // nome da aba onde os cadastros serão gravados
const SHARED_SECRET = 'troque-este-valor'; // deve ser igual ao CONFIG.SHARED_SECRET do index.html

const HEADERS = [
  'Data/Hora',
  'Nome',
  'Sobrenome',
  'E-mail',
  'Telefone',
  'Região/Idioma',
  'Tipo de Membro',
  'Método de Envio',
  'Link do Convite'
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'Requisição sem corpo (postData).' });
    }

    const data = JSON.parse(e.postData.contents);

    if (SHARED_SECRET && data.secret !== SHARED_SECRET) {
      return jsonResponse({ status: 'error', message: 'Token inválido.' });
    }

    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      data.timestamp ? new Date(data.timestamp) : new Date(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.regionLang || '',
      data.membershipType || '',
      data.sendMethod || '',
      data.inviteUrl || ''
    ]);

    return jsonResponse({ status: 'success' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function doGet(e) {
  // Só para permitir testar se a implantação está no ar, abrindo a URL /exec no navegador.
  return jsonResponse({ status: 'ok', message: 'Web app do formulário de prospecção está ativo.' });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
