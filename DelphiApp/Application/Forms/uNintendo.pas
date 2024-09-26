unit uNintendo;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.Buttons, Vcl.StdCtrls, Vcl.ExtCtrls,
  System.ImageList, Vcl.ImgList, Vcl.VirtualImageList, Vcl.BaseImageCollection,
  Vcl.ImageCollection;

type
  TformNintendo = class(TForm)
    pnlPrincipal: TPanel;
    imgCollectionIcones: TImageCollection;
    vImgListIcones: TVirtualImageList;
    sbPrincipal: TScrollBox;
    btnGBA: TSpeedButton;
    btnGBC: TSpeedButton;
    btnGB: TSpeedButton;
    btnDS: TSpeedButton;
    btnGC: TSpeedButton;
    btnN64: TSpeedButton;
    btnSNES: TSpeedButton;
    btnNES: TSpeedButton;
    btnVoltar: TButton;
    procedure btnGBAClick(Sender: TObject);
    procedure btnVoltarClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  formNintendo: TformNintendo;

implementation

uses
  uPrincipal, uLibrary, System.IOUtils;

var
  DiretorioPadrao: String;

{$R *.dfm}

procedure TformNintendo.btnGBAClick(Sender: TObject);
begin
  TformPrincipal(Owner).TrocaForm('GBA');
end;

procedure TformNintendo.btnVoltarClick(Sender: TObject);
begin
  TformPrincipal(Owner).TrocaForm('Empresas');
end;

procedure TformNintendo.FormCreate(Sender: TObject);
begin
  DiretorioPadrao := PegaDiretorio;
  if TDirectory.Exists(DiretorioPadrao + 'Nintendo\GB') then
    btnGB.Enabled := True;

  if TDirectory.Exists(DiretorioPadrao + '\Nintendo\GBC') then
    btnGBC.Enabled := True;

  if TDirectory.Exists(DiretorioPadrao + '\Nintendo\GBA') then
    btnGBA.Enabled := True;

  if TDirectory.Exists(DiretorioPadrao + '\Nintendo\NES') then
    btnNES.Enabled := True;

  if TDirectory.Exists(DiretorioPadrao + '\Nintendo\SNES') then
    btnSNES.Enabled := True;

  if TDirectory.Exists(DiretorioPadrao + '\Nintendo\N64') then
    btnN64.Enabled := True;

  if TDirectory.Exists(DiretorioPadrao + '\Nintendo\GC') then
    btnGC.Enabled := True;

  if TDirectory.Exists(DiretorioPadrao + '\Nintendo\DS') then
    btnDS.Enabled := True;
end;

end.
