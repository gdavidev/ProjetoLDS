unit uPrincipal;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls;

type
  TformPrincipal = class(TForm)
    pnlPrincipal: TPanel;
    procedure FormShow(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
    FormAtivo: Tform;
    DiretorioPadrao: String;
    procedure ValidaParametros;
    procedure VerificaRomExiste(Empresa, Emulador, Rom: String);
  public
    { Public declarations }
    procedure TrocaForm(para: String);
  end;

var
  formPrincipal: TformPrincipal;

implementation

uses
  uEmpresas, uNintendo, uGBA, System.StrUtils, IdURI, uLibrary;

{$R *.dfm}

procedure TformPrincipal.VerificaRomExiste(Empresa, Emulador, Rom: String);
var
  Arquivo: String;
begin
  Arquivo := DiretorioPadrao + Empresa + '\' + Emulador + '\Roms\' + Rom;

  if not FileExists(Arquivo) then
  begin
    ForceDirectories(DiretorioPadrao + Empresa + '\' + Emulador + '\Roms\')
  end;
end;

procedure TformPrincipal.ValidaParametros;
var
  Parametro: String;
  Parametros: TArray<string>;
  Empresa: String;
  Emulador: String;
  Rom: String;
begin
  // Captura o link completo
  Parametro := ParamStr(1);

  // Decodifica o parâmetro da URL
  Parametro := TIdURI.URLDecode(Parametro);

  // Remove o prefixo "EmuHub://"
  Delete(Parametro, 1, Length('EmuHub://'));
  // Remove a barra extra, se existir, do final do nome do jogo
  Parametro := StringReplace(Parametro, '/', '', [rfReplaceAll]);


  // Divide os parâmetros usando "|" como delimitador
  Parametros := SplitString(Parametro, '|');

  // Verifica se foram passados os 3 parâmetros esperados
  if Length(Parametros) < 3 then
  begin
    ShowMessage('Número insuficiente de parâmetros.');
    Exit;
  end;

  // Atribui os parâmetros
  Empresa := Parametros[0];
  Emulador := Parametros[1];
  Rom := Parametros[2];

  VerificaRomExiste(Empresa, Emulador, Rom);
end;


procedure TformPrincipal.FormCreate(Sender: TObject);
begin
  DiretorioPadrao := PegaDiretorio;
end;

procedure TformPrincipal.FormShow(Sender: TObject);
begin
  if not (ParamCount > 0) then
    TrocaForm('Empresas')
  else
  begin
    ValidaParametros;
  end;
end;

procedure TformPrincipal.TrocaForm(para: String);
begin
  FreeAndNil(FormAtivo);

  if para = 'Empresas' then
    FormAtivo := TformEmpresas.Create(Self)
  else if para = 'Nintendo' then
    FormAtivo := TformNintendo.Create(Self)
  else if para = 'GBA' then
    FormAtivo := TformGBA.Create(Self);

  FormAtivo.Parent := pnlPrincipal;
  FormAtivo.Show;

  // Verifica se o FormAtivo é do tipo TformEmpresas antes de redimensionar
  if FormAtivo is TformEmpresas then
    TformEmpresas(FormAtivo).FormResize(FormAtivo);
end;

end.
