object frCaminhos: TfrCaminhos
  Left = 0
  Top = 0
  Width = 260
  Height = 429
  Align = alClient
  TabOrder = 0
  object Label1: TLabel
    Left = 55
    Top = 16
    Width = 152
    Height = 54
    Caption = 'EmuHub'
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWindowText
    Font.Height = -40
    Font.Name = 'Segoe UI'
    Font.Style = []
    ParentFont = False
  end
  object Label2: TLabel
    Left = 16
    Top = 139
    Width = 121
    Height = 15
    Caption = 'Diretorio de Instala'#231#227'o:'
  end
  object btnBack: TButton
    Left = 40
    Top = 384
    Width = 75
    Height = 25
    Caption = 'Back'
    TabOrder = 0
    OnClick = btnBackClick
  end
  object btnNext: TButton
    Left = 160
    Top = 384
    Width = 75
    Height = 25
    Caption = 'Install'
    TabOrder = 1
    OnClick = btnNextClick
  end
  object editCaminho: TEdit
    Left = 16
    Top = 160
    Width = 201
    Height = 23
    TabOrder = 2
    Text = 'C:\EmuHub\'
  end
  object btnDiretorio: TButton
    Left = 223
    Top = 160
    Width = 23
    Height = 23
    Caption = '...'
    TabOrder = 3
    OnClick = btnDiretorioClick
  end
end
