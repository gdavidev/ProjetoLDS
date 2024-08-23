unit uFrLoad;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes,
  Vcl.Graphics, Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.ComCtrls, Vcl.StdCtrls;

type
  TfrLoad = class(TFrame)
    Label1: TLabel;
    ProgressBar1: TProgressBar;
    btnNext: TButton;
    procedure FrameResize(Sender: TObject);
    procedure btnNextClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

implementation

uses
uPrincipal;

var
ResizedFr: Integer;

{$R *.dfm}

procedure TfrLoad.btnNextClick(Sender: TObject);
begin
  TFormPrincipal(Owner).TrocaFrame(1);
  Self.Destroy;
end;

procedure TfrLoad.FrameResize(Sender: TObject);
begin
  if ResizedFr = 1 then
  begin
    ProgressBar1.Step := 1;
    for var i := 0 to 99 do
    begin
      ProgressBar1.StepIt;
      Sleep(50);
    end;
  end;
  ResizedFr := 1;

  if ProgressBar1.Position = 100 then
    btnNext.Visible := True;

end;

end.
