unit uDownload;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, IdHTTP, IdSSL, IdSSLOpenSSL, System.IOUtils,
  IdAuthentication, IdBaseComponent, IdComponent, IdTCPConnection, IdTCPClient;

type
  TForm1 = class(TForm)
    procedure FormClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}

procedure BaixarArquivo(const URL, NomeArquivoDestino: string);
var
  IdHTTP: TIdHTTP;
  FileStream: TFileStream;
  SSLHandler: TIdSSLIOHandlerSocketOpenSSL;
begin
  IdHTTP := TIdHTTP.Create(nil);
  FileStream := TFileStream.Create(NomeArquivoDestino, fmCreate);
  SSLHandler := TIdSSLIOHandlerSocketOpenSSL.Create(nil);
  try
    // Configura o manipulador SSL para conexões HTTPS
    IdHTTP.IOHandler := SSLHandler;

    // Definir um User-Agent para simular um navegador comum
    IdHTTP.Request.UserAgent := 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';

    IdHTTP.Get(URL, FileStream); // Baixa o arquivo da URL e salva no FileStream
  except
    on E: Exception do
      ShowMessage('Erro ao baixar arquivo: ' + E.Message); // Mostra mensagem de erro
  end;
  FileStream.Free;
  IdHTTP.Free;
  SSLHandler.Free;
end;

procedure TForm1.FormClick(Sender: TObject);
begin
  BaixarArquivo('https://media.retroachievements.org/Images/005442.png', 'C:\Users\denis\Downloads\005442.png');
end;

end.

