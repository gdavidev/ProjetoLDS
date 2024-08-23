unit uPrincipal;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.Imaging.jpeg,
  Vcl.ExtCtrls, EMS.ResourceAPI, EMS.FileResource;

type
  TForm1 = class(TForm)
    pImage: TPanel;
    Image1: TImage;
    Panel1: TPanel;
    btnNext: TButton;
    btnBack: TButton;
    Label1: TLabel;
    procedure btnNextClick(Sender: TObject);
    procedure btnBackClick(Sender: TObject);
  private
    { Private declarations }
    procedure ExtractResourceToFile(const ResName, FileName: string);
    procedure InstallApplication;
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}
{$R resources.res}

procedure TForm1.btnBackClick(Sender: TObject);
begin
  close;
end;

procedure TForm1.btnNextClick(Sender: TObject);
begin
  InstallApplication;
end;

procedure TForm1.ExtractResourceToFile(const ResName, FileName: string);
var
  ResStream: TResourceStream;
  FileStream: TFileStream;
begin
  ResStream := TResourceStream.Create(HInstance, ResName, RT_RCDATA);
  try
    FileStream := TFileStream.Create(FileName, fmCreate);
    try
      FileStream.CopyFrom(ResStream, ResStream.Size);
    finally
      FileStream.Free;
    end;
  finally
    ResStream.Free;
  end;
end;

procedure TForm1.InstallApplication;
var
  DestFolder, AppFile, ConfigFile: string;
begin
  DestFolder := 'C:\RetroMenu\';

  // Criar a pasta de destino se ela não existir
  if not DirectoryExists(DestFolder) then
    ForceDirectories(DestFolder);

  // Extrair os arquivos embutidos
  AppFile := DestFolder + 'RetroMenu.exe';

  ExtractResourceToFile('RETROMENU_EXE', AppFile);
end;

end.
