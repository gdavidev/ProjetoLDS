unit uEmpresas;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls,
  Vcl.Imaging.pngimage, System.Actions, Vcl.ActnList, System.ImageList,
  Vcl.ImgList, Vcl.Buttons;

type
  TformEmpresas = class(TForm)
    pnlEmpresas: TPanel;
    pnlEmpresasUp: TPanel;
    pnlEmpresasDown: TPanel;
    pnlNintendo: TPanel;
    pnlSega: TPanel;
    pnlMicrosoft: TPanel;
    pnlSony: TPanel;
    btnNintendo: TSpeedButton;
    btnSega: TSpeedButton;
    btnMicrosoft: TSpeedButton;
    btnSony: TSpeedButton;
    procedure FormResize(Sender: TObject);
  private
    { Private declarations }

  public
    { Public declarations }
    procedure ArrumaTela;
  end;

var
  formEmpresas: TformEmpresas;

implementation

{$R *.dfm}

procedure TformEmpresas.ArrumaTela;
begin
  // Paineis
  pnlEmpresasUp.Height := (Round(pnlEmpresas.Height / 2) + 1);
  pnlEmpresasDown.Height := (Round(pnlEmpresas.Height / 2) + 1);
  pnlNintendo.Width := (Round(pnlEmpresasUp.Width / 2) + 1);
  pnlSega.Width := (Round(pnlEmpresasUp.Width / 2) + 1);
  pnlMicrosoft.Width := (Round(pnlEmpresasDown.Width / 2) + 1);
  pnlSony.Width := (Round(pnlEmpresasDown.Width / 2) + 1);

  // Bot�o Nintendo
  btnNintendo.Width := pnlNintendo.Width - 20;
  btnNintendo.Height := pnlNintendo.Height - 20;
  btnNintendo.Top := 10;
  btnNintendo.Left := 10;
  btnNintendo.Font.Size := Round(btnNintendo.Width / 15);

  // Bot�o Sega
  btnSega.Width := pnlNintendo.Width - 20;
  btnSega.Height := pnlSega.Height - 20;
  btnSega.Top := 10;
  btnSega.Left := 10;
  btnSega.Font.Size := Round(btnNintendo.Width / 15);

  // Bot�o Microsoft
  btnMicrosoft.Width := pnlNintendo.Width - 20;
  btnMicrosoft.Height := pnlMicrosoft.Height - 20;
  btnMicrosoft.Top := 10;
  btnMicrosoft.Left := 10;
  btnMicrosoft.Font.Size := Round(btnNintendo.Width / 15);

  // Bot�o Sony
  btnSony.Width := pnlNintendo.Width - 20;
  btnSony.Height := pnlSony.Height - 20;
  btnSony.Top := 10;
  btnSony.Left := 10;
  btnSony.Font.Size := Round(btnNintendo.Width / 15);
end;

procedure TformEmpresas.FormResize(Sender: TObject);
begin
  ArrumaTela;
end;

end.
