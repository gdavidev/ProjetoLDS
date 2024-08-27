unit uEmpresas;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls,
  Vcl.Imaging.pngimage;

type
  TformEmpresas = class(TForm)
    pnlEmpresas: TPanel;
    pnlEmpresasUp: TPanel;
    pnlEmpresasDown: TPanel;
    pnlNintendo: TPanel;
    pnlSega: TPanel;
    pnlMicrosoft: TPanel;
    pnlSony: TPanel;
    procedure FormResize(Sender: TObject);
  private
    { Private declarations }
    procedure ArrumaTela;
  public
    { Public declarations }
  end;

var
  formEmpresas: TformEmpresas;

implementation

{$R *.dfm}

procedure TformEmpresas.ArrumaTela;
begin
  pnlNintendo.Width := Round(pnlEmpresas.Width / 2)+1;
  pnlSega.Width := Round(pnlEmpresas.Width / 2)+1;
  pnlMicrosoft.Width := Round(pnlEmpresas.Width / 2)+1;
  pnlSony.Width := Round(pnlEmpresas.Width / 2)+1;
  pnlEmpresasUp.Height := Round(pnlEmpresas.Height / 2)+1;
  pnlEmpresasDown.Height := Round(pnlEmpresas.Height / 2)+1;
end;

procedure TformEmpresas.FormResize(Sender: TObject);
begin
  ArrumaTela;
end;

end.
