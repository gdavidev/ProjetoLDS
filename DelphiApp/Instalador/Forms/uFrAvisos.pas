unit uFrAvisos;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes,
  Vcl.Graphics, Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls;

type
  TfrAvisos = class(TFrame)
    Label1: TLabel;
    LabelGuia: TLabel;
    btnBack: TButton;
    btnNext: TButton;
    CheckBox1: TCheckBox;
    procedure btnBackClick(Sender: TObject);
    procedure btnNextClick(Sender: TObject);
    procedure CheckBox1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

implementation

{$R *.dfm}

uses
uPrincipal;

procedure TfrAvisos.btnBackClick(Sender: TObject);
begin
  TFormPrincipal(Owner).TrocaFrame(0);
  Self.Destroy;
end;



procedure TfrAvisos.btnNextClick(Sender: TObject);
begin
  TFormPrincipal(Owner).TrocaFrame(1);
  Self.Destroy;
end;

procedure TfrAvisos.CheckBox1Click(Sender: TObject);
begin
  if CheckBox1.Checked = True then
    btnNext.Enabled := True
  else
    btnNext.Enabled := False;
end;

end.
