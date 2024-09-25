unit uPrincipal;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls;

type
  TformPrincipal = class(TForm)
    pnlPrincipal: TPanel;
    procedure FormShow(Sender: TObject);
  private
    { Private declarations }
    FormAtivo: Tform;
  public
    { Public declarations }
    procedure TrocaForm(para: String);
  end;

var
  formPrincipal: TformPrincipal;

implementation

uses
  uEmpresas, uNintendo, uGBA;

{$R *.dfm}

procedure TformPrincipal.FormShow(Sender: TObject);
begin
  TrocaForm('Empresas');
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
