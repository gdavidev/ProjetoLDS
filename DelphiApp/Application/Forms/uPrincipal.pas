unit uPrincipal;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls;

type
  TFormPrincipal = class(TForm)
    pnlPrincipal: TPanel;
    procedure FormShow(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  FormPrincipal: TFormPrincipal;

implementation

uses
uEmpresas;

var
FormAtivo: Tform;

{$R *.dfm}

procedure TFormPrincipal.FormShow(Sender: TObject);
begin
  FormAtivo := TformEmpresas.Create(Self);
  FormAtivo.Parent := pnlPrincipal;
  FormAtivo.Show;
  TformEmpresas(FormAtivo).FormResize(FormAtivo);
end;

end.
