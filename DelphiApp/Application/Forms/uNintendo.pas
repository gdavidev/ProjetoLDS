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
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  formNintendo: TformNintendo;

implementation

uses uPrincipal;

{$R *.dfm}

procedure TformNintendo.btnGBAClick(Sender: TObject);
begin
  TformPrincipal(Owner).TrocaForm('GBA');
end;

procedure TformNintendo.btnVoltarClick(Sender: TObject);
begin
  TformPrincipal(Owner).TrocaForm('Empresas');
end;

end.
