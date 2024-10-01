unit uFrCaminhos;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes,
  Vcl.Graphics, Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, FileCtrl;

type
  TfrCaminhos = class(TFrame)
    btnBack: TButton;
    btnNext: TButton;
    editCaminho: TEdit;
    Label1: TLabel;
    btnDiretorio: TButton;
    Label2: TLabel;
    procedure btnNextClick(Sender: TObject);
    procedure btnBackClick(Sender: TObject);
    procedure btnDiretorioClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

implementation

{$R *.dfm}

uses
uPrincipal;

procedure TfrCaminhos.btnBackClick(Sender: TObject);
begin
  TFormPrincipal(Owner).TrocaFrame(0);
  Self.Destroy;
end;

procedure TfrCaminhos.btnDiretorioClick(Sender: TObject);
var
  Diretorio: String;
begin
  SelectDirectory('Selecione a pasta para instalação', 'C:', Diretorio);
  editCaminho.Text := Diretorio + '\EmuHub\';
end;

procedure TfrCaminhos.btnNextClick(Sender: TObject);
var
Caminho: String;
begin
  Caminho := editCaminho.Text;
  Caminho := Caminho.Replace('EmuHub\', '');

  if DirectoryExists(Caminho) then
  begin
    TFormPrincipal(Owner).DefineDiretorio(Caminho);
    TFormPrincipal(Owner).TrocaFrame(1);
    Self.Destroy;
  end
  else
    ShowMessage('Diretorio Inexistente ou inacessivel!');
  

end;

end.
