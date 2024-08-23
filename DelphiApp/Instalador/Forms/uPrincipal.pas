unit uPrincipal;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.Imaging.jpeg,
  Vcl.ExtCtrls, EMS.ResourceAPI, EMS.FileResource;

type
  TFormPrincipal = class(TForm)
    panelImage: TPanel;
    imgRetroFrame: TImage;
    panelPrincipal: TPanel;
    procedure FormShow(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
    procedure ExtractResourceToFile(const ResName, FileName: string);
    procedure InstallApplication;
  public
    { Public declarations }
    procedure TrocaFrame(Direcao: Integer);
  end;

var
FormPrincipal: TFormPrincipal;
ResStream: TResourceStream;
FileStream: TFileStream;
FrameAtivo: TFrame;
NumFrame: Integer;

implementation

uses
  uFrAvisos,
  uFrCaminhos,
  uFrLoad;

{$R *.dfm}
{$R resources.res}

procedure TFormPrincipal.ExtractResourceToFile(const ResName, FileName: string);
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

procedure TFormPrincipal.FormCreate(Sender: TObject);
begin
  Left:=(Screen.Width-Width)  div 2;
  Top:=(Screen.Height-Height) div 2;
end;

procedure TFormPrincipal.FormShow(Sender: TObject);
begin
  FrameAtivo := TfrAvisos.Create(Self);
  FrameAtivo.Parent := panelPrincipal;
  FrameAtivo.Show;
  NumFrame := 1;
end;

procedure TFormPrincipal.InstallApplication;
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

procedure TFormPrincipal.TrocaFrame(Direcao: Integer);
begin
  case Direcao of
    0:
    begin
      case NumFrame of
        1:
        begin
          Close;
        end;

        2:
        begin
          FrameAtivo := nil;
          FrameAtivo := TfrAvisos.Create(Self);
          FrameAtivo.Parent := panelPrincipal;
          FrameAtivo.Show;
          NumFrame := 1;
        end;
      end;
    end;

    1:
    begin
      case NumFrame of
        1:
        begin
          FrameAtivo := nil;
          FrameAtivo := TfrCaminhos.Create(Self);
          FrameAtivo.Parent := panelPrincipal;
          FrameAtivo.Show;
          NumFrame := 2;
        end;

        2:
        begin
          FrameAtivo := nil;
          FrameAtivo := TfrLoad.Create(Self);
          FrameAtivo.Parent := panelPrincipal;
          FrameAtivo.Show;
          NumFrame := 3;
        end;

        3:
        begin
          close;
        end;
      end;
    end;
  end;
end;

end.
